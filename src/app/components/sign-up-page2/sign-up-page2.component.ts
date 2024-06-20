import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { __param } from "tslib";
import { ApiService } from "src/app/services/api.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from "@angular/material/dialog";
import { UtilService } from "src/app/services/util.service";
import { CacheService } from "src/app/services/cache.service";
import { CookieService } from "ngx-cookie-service";
import { LocationStrategy } from "@angular/common";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-sign-up-page2",
  templateUrl: "./sign-up-page2.component.html",
  styleUrls: ["./sign-up-page2.component.scss" ,  "../../../assets/newassets/custom.css",  "../../../assets/newassets/bootstrap/css/bootstrap.min.css"],
})
export class SignUpPage2Component implements OnInit {
  validation: any;
  validUser = false;
  resetassflag: boolean = false;
  candidateInvitation: boolean = false;
  sigupPage: any;
  token: string;
  response: { userType: any };
  userId: any;
  showForm: boolean = null;
  userDetails: any = {};
  Model: false;
  setpassword: UntypedFormGroup;
  userTypeForm: UntypedFormGroup;
  userData: any;
  username: any;
  passwordShownpwd = true;
  passwordShowncpwd = true;
  error: string;

  oldnewsame: boolean = false;

  pageRes: any = {};
  showSucessMessage: boolean = false;
  btnSubmit = false;

  constructor(
    private fb: UntypedFormBuilder,
    private API: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private util: UtilService,
    private cookieService: CookieService,
    private cache: CacheService,
    private location: LocationStrategy
  ) {
    this.route.data.subscribe((res) => {
      console.log(res[0].resetPassword);
      console.log("ss", res[0]);

      if (res[0].code === "00000") {
        this.showForm = true;
        this.response = res[0];
        this.pageRes = res[0];
        this.userId = res[0].userId;
        this.username = res[0].username;

        if (res[0].resetPassword) { this.resetassflag = true; }
      } else if (res[0].code === "70002") {
        this.showForm = false;
        this.response = res[0];
        this.pageRes = res[0];
        this.error = "LINK_EXPIRED";
      } else if (res[0].code === "99999") {
        this.error = "UNEXPECTED";
        this.showForm = false;
      } else if (res[0].code === "70001") {
        this.error = "INVALID_LINK";
        this.showForm = false;
      } else {
        this.error = "UNEXPECTED";
        this.showForm = false;
      }
    });

    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
  }

  ngOnInit() {
    this.formvalidate();
    this.UtypeForm();
    this.setpassword.controls.email.patchValue(this.username);
    this.setpassword.get("email").disable();
  }


  keyDown(e) {
    var e = window.event || e;
    var key = e.keyCode;
    //space pressed
    if (key == 32) {
      //space
      e.preventDefault();
    }
  }
  //  form validation
  formvalidate(): UntypedFormGroup {
    return (this.setpassword = this.fb.group({
      email: [null, [Validators.required]],
      pwd: [null, [Validators.required]],
      // cpwd: ['', Validators.compose([Validators.required])]
      cpwd: ["", [Validators.required]],
    }));
  }

  get sign2() {
    return this.setpassword.controls;
  }

  sendActivationLink(): void {
    const user = {
      firstName: this.pageRes.firstName,
      lastName: this.pageRes.lastName,
      email: this.pageRes.primaryEmail,
      username: this.pageRes.username,
      tokenFor: this.pageRes.tokenFor,
      userId: this.pageRes.userId,
    };
    this.util.startLoader();
    this.API.AuthValidation("user/createtoken", user).subscribe((res) => {
      this.util.stopLoader();
      if (res.code === "00000") {
        this.error = "";
        this.showSucessMessage = true;
      } else {
        this.showSucessMessage = false;
      }
    });
  }

  termspolicy = false;
  checkPolicy(val) {
    if (val.checked == true) {
      this.termspolicy = true;
    } else if (val.checked == false) {
      this.termspolicy = false;
    }
  }

  MassageValidate() {
    const data: any = {};
    data.token = this.token;

    if (this.candidateInvitation) {
      data.candidateInvitation = true;
    }
    this.util.startLoader();
    this.API.AuthValidation("user/validateToken", data).subscribe((res) => {
      this.util.stopLoader();
      this.pageRes = res;
      if (res.code === "00000") {
        console.log(res);

        this.showForm = true;
        this.setpassword.get("email").disable();
        this.response = res;
        this.pageRes = res;
        this.userId = res.userId;
        this.username = res.username;
        this.setpassword.controls.email.patchValue(this.username);
        this.Model = false;
      } else if (res.code === "70002") {
        this.showForm = false;
        this.error = "LINK_EXPIRED";

        //show link expired page
      } else if (res.code === "99999") {
        this.error = "UNEXPECTED";
        this.showForm = false;

        //show unexpected error page
      } else if (res.code === "70001") {
        this.error = "INVALID_LINK";
        this.showForm = false;
      } else {
        this.error = "UNEXPECTED";
        this.showForm = false;
      }
    });
  }

  confirmSave() {
    const sessionId = localStorage.getItem('sessionID');
    if (sessionId != undefined && sessionId != null) {
      Swal.fire({
        title: 'There is already a logged in user in another tab/browser. Please log out of the application from that tab/browser and then create the password',
        confirmButtonText: 'ok',
      }).then((result) => {
        if (result.isConfirmed) {
          //
        }
      })
    }else{
      this.SetPasswordNewUser();
    }
  }


  SetPasswordset() {
    this.setpassword.markAllAsTouched();
    const data: any = {};
    data.userId = this.userId;
    data.password = this.setpassword.value.pwd;
    if (this.resetassflag) {
      data.resetPassword = true;
    }
    this.util.startLoader();
    this.API.create("user/setPassword", data).subscribe(
      (res) => {
        if (res.code === "00000") {
          this.router.navigate(["PasswordResetConfired"]);
        } else if (res.code === "99999") {
          Swal.fire({
            icon: "info",
            title: "Oops...",
            text: "Something went wrong. Please try after a while.",
          })
          this.util.stopLoader();
        } else if (res.code === "91234") {
          this.oldnewsame = true;
          this.util.stopLoader();
        }
      },
      (err) => {
        this.util.stopLoader();
      }
    );
  }

  setControl(value : string){
    this.setpassword.get(value).setValidators([Validators.required]);
    this.setpassword.get(value).updateValueAndValidity();
  }

  passwordRequirements : Array<{alpha : boolean ,uppercase : boolean ,lowercase : boolean ,numeric : boolean ,specialChar : boolean , }> = [{
    alpha : false,
    uppercase : false,
    lowercase : false,
    numeric : false,
    specialChar : false
  }];

  SetPasswordNewUser() {
    this.setpassword.markAllAsTouched();
     this.btnSubmit = true;
    const data: any = {};
    data.userId = this.userId;
    data.password = this.setpassword.value.pwd;
    data.token = this.token;
    let valid : boolean = this.passwordRequirements.every(val => (val.alpha && val.lowercase && val.uppercase && val.numeric && val.specialChar));
    if (
      this.CheckPassMatch == true && valid &&
      this.setpassword.valid &&
      this.termspolicy == true
    ) {

      this.util.startLoader();
      this.API.create("user/setPassword", data).subscribe(
        (res) => {
          ////// console.log('Sign Up Data : ',res);
          this.util.stopLoader();
          if (res.code === "00000") {
            let data = {
              username: this.username,
              password: this.setpassword.value.pwd,
            };

            this.util.startLoader();
            this.API.userLogin("home/login", data).subscribe((loginRes) => {
              this.util.stopLoader();
              if (loginRes) {
                if (loginRes.code === "00000") {
                  this.userId = loginRes.data.userId;
                  localStorage.setItem("userId", this.userId);
                  this.cookieService.set("userId", this.userId);
                  this.cache.setValue("userId", this.userId);
                  //this.cookieService.set("sessionID", loginRes.data.sessionId);
                  // localStorage.setItem("sessionID", loginRes.data.sessionId);
                  localStorage.setItem("sessionID", this.util.encrypt(loginRes.data.sessionId));

                  localStorage.setItem("token", loginRes.data.token);
                  //document.cookie = "sessionID=" + loginRes.data.sessionId;
                  const data: any = {};
                  data.userId = this.userId;
                  this.router.navigate(["userClassification"], {
                    queryParams: data,
                  });
                }
              }
            });
          } else if (res.code === "99999") {
            // ////// console.log('user id : ' +data.userId)
            /// this.API.stopLoader();
          } else if (res.code === "70001") {
            this.error = "INVALID_LINK";
            this.showForm = false;
          } else if (res.code === "91234") {
            this.oldnewsame = true;
          }
        },
        (err) => {
          this.util.stopLoader();
        }
      );
    }
  }

  UtypeForm(): UntypedFormGroup {
    return (this.userTypeForm = this.fb.group({
      usertype: ["", [Validators.required]],
    }));
  }

  get myForm() {
    return this.userTypeForm.get("usertype");
  }

  onCheckValid() {
    this.checkPassword();
    var myInput: any = document.getElementById("passInput1");
    var letter = document.getElementById("letter");
    var capital = document.getElementById("capital");
    var number = document.getElementById("number");
    var length = document.getElementById("length");
    var specialCharacter = document.getElementById("specialCharacter");

    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if (myInput.value.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
      this.passwordRequirements[0].lowercase = true;
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
      this.passwordRequirements[0].lowercase = false;
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (myInput.value.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
      this.passwordRequirements[0].uppercase = true;
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
      this.passwordRequirements[0].uppercase = false;
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (myInput.value.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
      this.passwordRequirements[0].numeric = true;
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
      this.passwordRequirements[0].numeric = false;
    }

    // Validate length
    if (myInput.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
      this.passwordRequirements[0].alpha = true;
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
      this.passwordRequirements[0].alpha = false;
    }

    // Validate special character
    var specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialChar.test(myInput.value)) {
      specialCharacter.classList.remove("invalid");
      specialCharacter.classList.add("valid");
      this.passwordRequirements[0].specialChar = true;
    } else {
      specialCharacter.classList.remove("valid");
      specialCharacter.classList.add("invalid");
      this.passwordRequirements[0].specialChar = false;
    }

    this.isGoodPassCheck(myInput.value);
  }

  isGoodPassCheck(password) {
    var password_strength = document.getElementById("password-text");

    //TextBox left blank.
    if (password.length == 0) {
      password_strength.innerHTML = "";
      return;
    }

    //Regular Expressions.
    var regex = new Array();
    regex.push("[A-Z]"); //Uppercase Alphabet.
    regex.push("[a-z]"); //Lowercase Alphabet.
    regex.push("[0-9]"); //Digit.
    regex.push("[$@$!%*#?&]"); //Special Character.

    var passed = 0;

    //Validate for each Regular Expression.
    for (var i = 0; i < regex.length; i++) {
      if (new RegExp(regex[i]).test(password)) {
        passed++;
        var myInput: any = document.getElementById("passInput1");
        if (myInput.value.length < 8) {
          passed = 2;
        }
      }
    }

    //Display status.
    var strength = "";
    switch (passed) {
      case 0:
      case 1:
      case 2:
        strength =
          "<small class='progress-bar passCheck bg-danger' style='width: 40%;Background-color: #ff3524;color: #fff;''>Weak</small>";
        break;
      case 3:
        strength =
          "<small class='progress-bar passCheck bg-warning' style='width: 60% ; Background-color: #FFC107;color: #fff;''>Medium</small>";
        break;
      case 4:
        strength =
          "<small class='progress-bar passCheck bg-success' style='width: 100% ;Background-color: #008768;color: #fff;'>Strong</small>";
        break;
    }
    password_strength.innerHTML = strength;
  }

  usertype() {
    ////// console.log(this.response);
    // if (this.userTypeForm.valid){
    this.response.userType = this.userTypeForm.value.usertype;
    ////// console.log('User Type :' + this.response.userType);
    this.util.startLoader();
    this.API.create("user/updateUserType", this.response).subscribe(
      (res) => {
        this.util.stopLoader();
        ////// console.log('Api response' + res);
        this.router.navigate(["userClassification"], { queryParams: res });
      },
      (err) => {
        this.util.stopLoader();
      }
    );
    // }
  }

  onReset() {
    this.setpassword.reset();
  }

  showHidePass(e) {
    if ($("#show_hide_password_" + e + " input").attr("type") == "text") {
      $("#show_hide_password_" + e + " input").attr("type", "password");
      $("#show_hide_password_" + e + " i").addClass("bi-eye-slash-fill");
      $("#show_hide_password_" + e + " i").removeClass("bi-eye-fill");
    } else if (
      $("#show_hide_password_" + e + " input").attr("type") == "password"
    ) {
      $("#show_hide_password_" + e + " input").attr("type", "text");
      $("#show_hide_password_" + e + " i").removeClass("bi-eye-slash-fill");
      $("#show_hide_password_" + e + " i").addClass("bi-eye-fill");
    }
  }
  CheckPassMatch : boolean = false;
  checkPassword() {
    this.oldnewsame = false;
    var pass1 : string = $("#show_hide_password_1 input").val();
    var pass2 : string = $("#show_hide_password_2 input").val();
    let password1 = pass1.trim().length;
    let password2 = pass2.trim().length;

    if ((password1 > 1 && password2 > 1) && pass1 == pass2) {
      $("#passwordMatch").removeClass("invalid");
      $("#passwordMatch").addClass("valid");
      this.CheckPassMatch = true;
    } else {
      $("#passwordMatch").removeClass("valid");
      $("#passwordMatch").addClass("invalid");
      this.CheckPassMatch = false;
    }
  }



}
