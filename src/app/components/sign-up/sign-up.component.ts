import { CustomValidator } from './../Helper/custom-validator';
import { SocketService } from 'src/app/services/socket.service';
import { SocketServiceStream } from './../../services/SocketServiceStream';
import { LocationStrategy } from '@angular/common';
import { Component, HostListener, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiService } from "src/app/services/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { whiteSpaceValidator } from "../Helper/whitespaceValidator";
import { UtilService } from "src/app/services/util.service";
import { SearchData } from "src/app/services/searchData";
import { CookieService } from "ngx-cookie-service";
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
declare var $: any;

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss" ,  "../../../assets/newassets/custom.css",  "../../../assets/newassets/bootstrap/css/bootstrap.min.css"],
})
export class SignUpComponent extends FormValidation implements OnInit {
  signupForm: UntypedFormGroup;
  disableBtn = false;
  Authtokenservice: any;
  Authtoken: any;
  submitted = false;
  public FORMERROR = super.Form;
  userSubmit: boolean = false;
  userData: any;
  Msg = false;
  MsgFailed = false;
  fileToUpload: File = null;
  signupCheckEmail = false;
  signUpEmail = null;
  directoryProfileId: any;
  active;
  disabled = true;
  url: any;
  referalnew: any;
  emailPattern: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  inviteeEmailId: any;
  constructor(
    private fb: UntypedFormBuilder,
    private API: ApiService,
    private router: Router,
    private cookieservice: CookieService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private util: UtilService,
    private searchData: SearchData,
    private location: LocationStrategy,
    private _socket: SocketService,
    private _socket_stream: SocketServiceStream,

  ) {
    super();
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });

    this.route.queryParams.subscribe((res) => {
      this.businessProfileId = res.businessProfileId;
      this.businessOrganizationDirectory = res.source;
      this.signUpEmail = res.emailId;
      this.referalnew = res.referalcode;
      // this.npiNo = res.npiNo;
    });
    var val: any = {}
    val.isLoggedOut = false
    this.searchData.setCommonVariables(val);
  }

  checkspace(event : any) : boolean{
    return  super.validSpace(event);
  }

  ngOnInit() {

    this.signupForm = this.fb.group({
      firstName: [
        null,
        [Validators.required, Validators.pattern(this.FIRST_Name.pattern),
        CustomValidator.checkWhiteSpace(), CustomValidator.max(this.FIRST_Name.max)],
      ],
      lastName: [null, [Validators.required, Validators.pattern(this.LAST_NAME.pattern),
      CustomValidator.checkWhiteSpace(), CustomValidator.max(this.LAST_NAME.max)]],
      email: [
        null,
        [
          Validators.required,
          Validators.email, CustomValidator.max(this.EMAIL.max),
          Validators.pattern(this.EMAIL.pattern),
        ],
      ],
      Terms: [false, Validators.required],
      referralCode: [this.referalnew],

    });


    this.signupForm.valueChanges.subscribe((changedObj: any) => {
      this.disableBtn = this.signupForm.valid;
    });



    this.url = this.router.url.substring(1, 7)
    if (this.url == 'invite') {
      this.route.queryParams.subscribe((res) => {
        this.inviteeEmailId = res.emailId;
        this.signupForm.patchValue({ email: this.inviteeEmailId })
        this.signupForm.controls['email'].disable();
      });
    } else {
      this.signupForm.controls['email'].enable();
      this.profilesignup();
    }



  }



  updateUserOnlineOrOffline(status: any) {
    let url = 'user/onlineoroffline';
    let user = {
      userId: localStorage.getItem('userId'),
      online: status.toUpperCase()
    };
    this.API.create(url, user).subscribe(res => {
    }, err => {
      this.util.stopLoader();

    });
  }

  onLogoutSuccess() {
    this.cookieservice.deleteAll();
    let allCookies = document.cookie.split(";");
    if (allCookies) {
      for (let i = 0; i < allCookies.length; i++) {
        document.cookie =
          allCookies[i] + "=;expires=" + new Date(0).toUTCString();
      }
    }
    localStorage.clear();
    this._socket.ngOnDestroy();
    this._socket_stream.ngOnDestroy();
    var val: any = {}
    val.emailId = this.inviteeEmailId;
    this.router.navigate(["signUp"], { queryParams: val });
  }

  onLogout() {
    var val: any = {}
    val.isLoggedOut = true
    this.searchData.setCommonVariables(val);
    this.util.startLoader();
    this.API.onLogout().subscribe((res) => {
      if (res) {
        if (res.code === "00000") {
          this.util.stopLoader();
          // this.updateUserOnlineOrOffline('OFFLINE');
          this.onLogoutSuccess();
        } else {
          this.util.stopLoader();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 500);
  }

  profilesignup() {
    this.route.queryParams.subscribe((res) => {
      this.directoryProfileId = res.profileId;
      if (this.signUpEmail != null) {
        this.signupForm.patchValue({
          email: this.signUpEmail
        })
      }
    });
  }

  get e() {
    return this.signupForm.controls;
  }


  @HostListener('document:keypress', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === "Enter") {
      document.getElementById('signup-button').click();
    }
  }

  businessProfileId: any;
  businessOrganizationDirectory: any;
  isChecked: boolean = true
  npiNo: any;
  checkPolicy() {
    this.isChecked = $('#flexCheckDefault').is(":checked");

  }
  signUp() {
    this.signupForm.markAllAsTouched();
    this.userSubmit = true;
    this.signupForm.controls['email'].enable();
    this.signupCheckEmail = false;

    let data: any = {};
    data.firstName = this.signupForm.value.firstName;
    data.lastName = this.signupForm.value.lastName;
    data.email = this.signupForm.value.email;
    data.directoryProfileId = this.directoryProfileId;
    data.profileId = this.businessProfileId;
    data.source = this.businessOrganizationDirectory;
    data.followEnabled = true;
    data.referralCode = this.referalnew;

    if (this.signupForm.valid && this.signupForm.value.Terms) {
      this.util.startLoader();
      this.API.create("user/signup", data).subscribe((res) => {
        this.util.stopLoader();
        if (res.code === "00000") {
          this.Msg = true;
          this.MsgFailed = false;
        } else if (res.code === "99999") {
          this.Msg = false;
          this.MsgFailed = true;
        } else if (res.code === "ALREADY_REGISTER_USER") {
          this.MsgFailed = true
        } else if (res.code === "ALREADY_SIGNED_UP_CHECK_EMAIL") {
          this.signupCheckEmail = true;
        }
        this.util.stopLoader();
      }, err => {
        this.util.stopLoader();

      });
    }




  }

  Datareset() {
    this.signupForm.reset();
    // //// console.log('cancel button clicked')
  }

  resolved(captchaResponse: string) {
    // //// console.log(`Resolved captcha with response: ${captchaResponse}`);
  }




}
