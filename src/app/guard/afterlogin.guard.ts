import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AfterLoginGuard implements CanActivateChild {

  constructor(private _cookie: CookieService, private _route: Router) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const sessionId = localStorage.getItem('sessionID');
     var routPath = state.url.substring(0,17)
    if (sessionId === undefined || sessionId === null || sessionId === '') {
      return true;
    }else if(routPath=='/setPassword?jsr='){

      //  Swal.fire({
      //   title: 'There is already a logged in user in another tab/browser. Please log out of the application from that tab/browser and then create the password',
      //     confirmButtonText: 'OK',
      //  }).then((result) => {
      //   /* Read more about isConfirmed, isDenied below */

      // })


      return true;
    }
    this._route.navigate(['/landingPage']);
    return false;
  }

}
