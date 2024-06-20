import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY, Observable, of, Subscription, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { UtilService } from '../services/util.service';
import swal from 'sweetalert2';
import { SearchData } from '../services/searchData';
import { environment } from 'src/environments/environment';


@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  eventEmitter: Subscription
  isLoggedOut: boolean = false
  public lamdaurl: any = environment.LAMDA_URL;

  constructor(private _router: Router, private util: UtilService, private searchData: SearchData,
    private cookie: CookieService) {
    //
    this.eventEmitter = this.searchData.getCommonVariables().subscribe(res => {
      if (res.isLoggedOut == true) {
        this.isLoggedOut = true
      } else {
        this.isLoggedOut = false
      }
    })
    document.cookie = 'curl=' + window.location.href;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    document.cookie = 'curl=' + window.location.href;
    //document.cookie = 'userId='+localStorage.getItem('userId');
    var header = {};
    const windowLocation = window.location.href.split("?", 1);


    if (req.url.indexOf('https://api.stripe.com/v1/checkout/sessions/') == -1) {
      header['curl'] = windowLocation[0];
      header['X-Content-Type-Options'] = 'nosniff';
      if (localStorage.getItem('userId') != null) {
        header['userId'] = localStorage.getItem('userId');
      }

      if (localStorage.getItem('sessionID') != null) {
        header['sessionID'] = this.util.decrypt(localStorage.getItem('sessionID'));

      }
    }




    // if(localStorage.getItem('token') != null){




    if (req.url.indexOf("home/login") == -1 &&
      req.url.indexOf("home/forgot/password") == -1 &&
      req.url.indexOf("user/signup") == -1 &&
      req.url.indexOf("user/invite") == -1 &&
      req.url.indexOf(this.lamdaurl) == -1 &&
      req.url.indexOf('https://api.stripe.com/v1/checkout/sessions/') == -1 &&
      req.url.indexOf("user/setPassword") == -1 &&
      req.url.indexOf("user/directory") == -1 &&
      req.url.indexOf("user/actuator") == -1 &&
      req.url.indexOf("user/validateToken") == -1


    ) {

      const session = this.util.decrypt(localStorage.getItem('sessionID'));
      let credentials = btoa(localStorage.getItem("userId") + ":" + session);
      if (session != "" && req.url.indexOf('/findPlans') != 68) {
        header['Authorization'] = 'Basic ' + credentials;
      }
    }

   // console.log(req.url.indexOf('https://api.stripe.com/v1/checkout/sessions/'))

    if (req.url.indexOf('https://api.stripe.com/v1/checkout/sessions/') == 0) {
          header['Content-Type'] = 'application/x-www-form-urlencoded';
    }




    const cloneReq = req.clone({
      withCredentials: true,
      setHeaders: header
    });


    return next.handle(cloneReq).pipe(
      tap(evt => {


        if (evt instanceof HttpResponse) {


          //     if(evt.body && evt.body.success)
          //         this.toasterService.success(evt.body.success.message,
          // evt.body.success.title, { positionClass: 'toast-bottom-center' });
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {

          if (err && err.error) {
            var notification = err.url.slice(-18)
            if (err.error.code === 'INVALID_SESSION') {
              if (this.isLoggedOut == true) {
                this.cookie.deleteAll();
                let allCookies = document.cookie.split(';');
                if (allCookies) {
                  for (let i = 0; i < allCookies.length; i++) {
                    document.cookie = allCookies[i] + "=;expires="
                      + new Date(0).toUTCString();
                  }
                }
                localStorage.clear();
                this._router.navigate(['/login']);
                this.util.stopLoader();
                swal.close();
                return EMPTY;

              } else if (this.isLoggedOut == false && swal.isVisible() == false) {  //swal.isVisible() == false -> to not show alert when it is already shown
                swal.fire({
                  icon: "info",
                  title: "Invalid session",
                  text: "Sorry, your session has expired. We are routing you to login page.",
                  showConfirmButton: false,
                  timer: 3000,
                }).then(() => {
                  this.cookie.deleteAll();
                  let allCookies = document.cookie.split(';');
                  if (allCookies) {
                    for (let i = 0; i < allCookies.length; i++) {
                      document.cookie = allCookies[i] + "=;expires="
                        + new Date(0).toUTCString();
                    }
                  }
                  localStorage.clear();
                  this._router.navigate(['/login']);
                  this.util.stopLoader();
                  swal.close();
                  return EMPTY;
                });
              }
              // if(this.route.pathFromRoot[0]['_routerState']['snapshot'].url !== '/login'){
              // //// console.log("this.route.pathFromRoot[0]['_routerState']['snapshot'].url")
              // //// console.log(this.route.pathFromRoot[0]['_routerState']['snapshot'].url)

              // }
            } else if (notification === "notification/query" && err.status === 500) {
              this.util.stopLoader()
            } else if (err.status === 500) {
              // this.util.stopLoader()
              return throwError(err)
            } else if (err.status === 0) {
              this.util.stopLoader()
              return throwError(err)
            } else if (err.status !== 200) {
              this.util.stopLoader()
              return throwError(err)
            }





            // //// console.log(this.route.pathFromRoot[0]['_routerState']['snapshot'].url)
            // //// console.log("this.route.parent.snapshot.url")
            // else if(err.status != 200){
            //   this.util.stopLoader();
            //   // swal.fire({
            //   //   title: '<strong>ERROR Reports</strong>',
            //   //   icon: 'error',
            //   //   text: err.statusText,
            //   //   focusConfirm: true,
            //   //   confirmButtonText: 'Ok',
            //   //   confirmButtonAriaLabel: 'Ok',
            //   // });

            //   swal.fire({
            //     icon: "error",
            //     title: "ERROR Reports",
            //     showConfirmButton: true,
            //     timer: 1500,
            //   });


            // }
          }

        }

        return of(err);
      }));
  }

}
