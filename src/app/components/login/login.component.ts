import { AfterViewInit, Component, HostListener, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Gtag } from 'angular-gtag';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CookieService } from "ngx-cookie-service";
import { NgxSpinnerService } from "ngx-spinner";
import { UserService } from 'src/app/services/UserService';
import { ApiService } from "src/app/services/api.service";
import { CacheService } from "src/app/services/cache.service";
import { SearchData } from "src/app/services/searchData";
import { UtilService } from "src/app/services/util.service";
import { default as Swal, default as swal } from "sweetalert2";
import { MessageService } from "../../services/message.service";
import { StreamService } from './../../services/stream.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss" , "../../../assets/newassets/custom.css",
      "../../../assets/newassets/bootstrap/css/bootstrap.min.css" ],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 10000, noPause: true, showIndicators: true } }
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: UntypedFormGroup;
  submitted: false;
  userId: any;
  cookieValue: any;
  passwordShown = true;
  passwordShown1 = false;
  modalRef: BsModalRef
  errorMsg = false;
  errorMsgTxt = "";
  queryErr = false;

  inviteDisable = false;
  slides = [1, 2, 3]
  formComplete;
  redirectTo = null;

  constructor(
    private fb: UntypedFormBuilder,
    private API: ApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private util: UtilService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private cache: CacheService,
    private UserService: UserService,
    public message: MessageService,
    private modalService: BsModalService,
    private searchData: SearchData,
    private streamService: StreamService,
    private gtag: Gtag

  ) {}


  ngOnInit() {
    this.checkQueryParams();
    this.message.success("Login component");
    this.loginForm = this.fb.group({
      username: [null, [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      password: [null, Validators.required],
    });

    this.API.handleErrorOld();
    // window.scrollTo(0, 0);

  }

  ngAfterViewInit(): void {
    this.util.stopLoader();
    setTimeout(function () {
      window.scrollTo(0, 0);
      // if(this.modalService!=undefined){
      // this.modalRef.hide()
      // this.modalService.
      // }
    }, 500);
    this.modalService.hide(1);
    this.modalService.hide(2);
  }

  checkQueryParams(): void {
    this.route.queryParams.subscribe((res: any) => {
      if (res) {
        if (res.ruser && res.ruser === "1") {
          this.queryErr = true;
        }
        if (res.redirectTo && res.redirectTo != '') {
          //// console.log("redirectTo - " + res.redirectTo);
          this.redirectTo = res.redirectTo;
        }
      }
    });
  }

  get login() {
    return this.loginForm.controls;
  }

  @HostListener('document:keypress', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === "Enter") {
      document.getElementById('login-button').click();
    }
  }


  loginform() {
    this.queryErr = false;
    this.inviteDisable = true;
    this.loginForm.markAllAsTouched();
    let data = { username: btoa(this.loginForm.value.username), password: btoa(this.loginForm.value.password) }

    if (this.loginForm.valid) {
      this.util.startLoader();
      this.API.userLogin("home/login", this.loginForm.value).subscribe((res) => {
        this.util.stopLoader();
        if (res && res.code === "00000") {

          if (res.data && res.data.ACTIVE_SESSION) {
            swal.fire({
              title: "Multiple Logins Detected",
              text: "More than one login detected for the same user. As a security measure, we are closing the previous session.",
              focusConfirm: false,
              confirmButtonText: "Ok",
              confirmButtonAriaLabel: "Ok",
            });
          }
          this.UserService.onlineAPI('ONLINE');
          this.userId = res.data.userId;
          localStorage.setItem("userId", this.userId);
          this.cookieValue = this.cookieService.set("userId", this.userId);
          this.cookieService.set("userId", this.userId);
          //this.cookieService.set("sessionID", res.data.sessionId);
          localStorage.setItem("sessionID", this.util.encrypt(res.data.sessionId));
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userType', res.data.userType);
          if (res.data.lastLoggedIn != null || res.data.lastLoggedIn != undefined) {
            localStorage.setItem('lastLogged', res.data.lastLoggedIn);
          }
          localStorage.setItem('postedDate', res.data.servertime);
          document.cookie = "userId=" + this.userId;
          //document.cookie = "sessionID=" + res.data.sessionId;
          this.cache.setValue("userId", this.userId);
          this.inviteDisable = false;
          this.message.success("Login successfully");
          if (res.data.profileStatus === "INCOMPLETED") {
            const data: any = {};
            data.userId = this.userId;
            this.router.navigate(["userClassification"], { queryParams: data });
          } else if (
            res.data.profileStatus ||
            res.data.profileStatus == null ||
            res.data.profileStatus === "COMPLETED"
          ) {
            if (this.redirectTo != undefined && this.redirectTo != null && this.redirectTo != '') {
              this.router.navigateByUrl(this.redirectTo);
            } else {
              //implementing the first g-tag for tracking
              this.router.navigate(["landingPage"]);
              this.gtag.event('login', {
                'app-name': 'Gigsumo',
                'screen-name': 'landing-page'
              })
            }
            var val: any = {}
            val.isLoggedOut = false
            this.searchData.setCommonVariables(val)
          }


        } else if (res.code === "99999") {
          this.inviteDisable = false;
          this.errorMsg = true;
          this.errorMsgTxt = "Please enter valid email address and password";


          // already data clear

          this.cookieService.deleteAll();
          let allCookies = document.cookie.split(";");
          if (allCookies) {
            for (let i = 0; i < allCookies.length; i++) {
              document.cookie =
                allCookies[i] + "=;expires=" + new Date(0).toUTCString();
            }
          }
          localStorage.clear();

        } else if (res.code === "99998") {
          Swal.fire({
            icon: 'error',
            text: 'Your account has been blocked. Please contact admin to unblock it',
          })
        }
      }, err => {
        this.util.stopLoader();
      });
    }

  }


}
