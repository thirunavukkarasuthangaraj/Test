import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Router, ActivatedRoute } from '@angular/router';
import { __param } from 'tslib';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { SocketService } from 'src/app/services/socket.service';
import { SocketServiceStream } from 'src/app/services/SocketServiceStream';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss' ,  "../../../assets/newassets/custom.css",  "../../../assets/newassets/bootstrap/css/bootstrap.min.css" ]
})
export class ChangePasswordComponent implements OnInit {
  validation: any;
  validUser = false;
  envName : any
  resetassflag = true;
  candidateInvitation: boolean = false;
  worngPwd: boolean=false
  sigupPage: any;
  token: string;
  response: { userType: any; };
  userId: any;
  showForm = false;
  userDetails: any = {};
  Model: false;
  setpassword: UntypedFormGroup;
  userData: any;
  username: any;
  passwordShownpwd = true;
  passwordShowncpwd = true;
  error: string;

  constructor(private fb: UntypedFormBuilder,
    private API: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private util: UtilService,
    private cookieService: CookieService,
    private _socket: SocketService,
    private _socket_stream: SocketServiceStream,
  ) {

    this.route.queryParams.subscribe(res => {

      const userId : CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(decodeURIComponent(res.userId), 'gigsumo');;
      const username : CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(decodeURIComponent(res.username), 'gigsumo');

      // console.log(userId.toString(CryptoJS.enc.Utf8) , username.toString(CryptoJS.enc.Utf8));

      this.userId = userId.toString(CryptoJS.enc.Utf8);
      this.username = username.toString(CryptoJS.enc.Utf8);

    });

  }

  ngOnInit() {

    this.setpassword = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newpassword: [null, [Validators.required]],
      confirmpassword: [null, [Validators.required]]
    })
    setTimeout(() => {
     this.setpassword.reset();
    }, 1000);

    this.setpassword.get('oldPassword').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value: string) => {

      const secData = {
        userId: this.userId,
        username: this.username,
        oldPassword: value
      };

      this.API.create("user/validate/password", secData).subscribe((res) => {

        if (res.code !== "00000") {
          this.worngPwd = true;
        } else {
          this.worngPwd = false;
        }
      }, err => {
        this.worngPwd = false;
        this.util.stopLoader();
      });
    });
    this.setpassword.get('newpassword').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value: string) => {
      this.onCheckValid();
    });
   }


  keyDown(e) {
    var e = window.event || e;
    var key = e.keyCode;
    //space pressed
    if (key == 32) { //space
      e.preventDefault();
    }

  }


  get sign2() {
    return this.setpassword.controls;
  }

  passwordRequirements : Array<{alpha : boolean ,uppercase : boolean ,lowercase : boolean ,numeric : boolean ,specialChar : boolean , }> = [{
    alpha : false,
    uppercase : false,
    lowercase : false,
    numeric : false,
    specialChar : false
  }];
  updatePassword() {
    this.setpassword.markAllAsTouched();
    let secData: any = {};
    secData.userId = this.userId;
    secData.username = this.username;
    secData.oldPassword = this.setpassword.value.oldPassword;
    let valid : boolean = this.passwordRequirements.every(val => (val.alpha && val.lowercase && val.uppercase && val.numeric && val.specialChar));
    if(this.setpassword.valid && this.CheckPassMatch && valid){

      this.API.startLoader()
      this.API.create("user/validate/password", secData).subscribe((res) => {

        if (res.code == "00000") {
          secData.password = this.setpassword.value.confirmpassword;
          this.API.startLoader();
          this.API.create("user/setPassword", secData).subscribe((res) => {
            this.API.stopLoader();
            if (res.code === "00000") {
              this.worngPwd = false;
              Swal.fire({
                icon: "success",
                title: "Password changed successfully!",
                text: "Please login using the new password. \n Thank You",
                allowEscapeKey: false,
                allowOutsideClick: false,
                showConfirmButton: false,
                timer: 2000

              }).then((result) => {
                this.API.onLogout().subscribe(res => {
                  this.API.stopLoader();
                  if (res) {
                    if (res.code === "00000") {
                      this.cookieService.deleteAll();
                      localStorage.clear();
                      this._socket.ngOnDestroy();
                      this._socket_stream.ngOnDestroy();
                      this.router.navigate(['login']);
                    }
                  }
                });
              });

            } else if (res.code === "99999") {
              this.worngPwd = false;
              this.API.stopLoader();
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Sorry! Password update failed."
              });
            } else if (res.code === '91234') {
              this.API.stopLoader();
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Old Password and New Password cannot be same',
              });
              this.setpassword.get('newpassword').reset();
              this.setpassword.get('confirmpassword').reset();
              this.worngPwd = false;
            }
          }, err => {
            this.util.stopLoader();
          });
        } else if (res.code == "99999") {
          this.API.stopLoader();
          this.worngPwd = true;
        }
      }, err => {
        this.worngPwd = false;
        this.util.stopLoader();
      });
      this.API.stopLoader();

    }

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
      this.passwordRequirements[0].numeric =true;
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
      this.passwordRequirements[0].numeric =false;

    }

    // Validate length
    if (myInput.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
      this.passwordRequirements[0].alpha =true;
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
      this.passwordRequirements[0].alpha =false;

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
        strength = "<small class='progress-bar passCheck bg-danger' style='width: 40%;Background-color: #ff3524;color: #fff;''>Weak</small>";
        break;
      case 3:
        strength = "<small class='progress-bar passCheck bg-warning' style='width: 60% ; Background-color: #FFC107;color: #fff;''>Medium</small>";
        break;
      case 4:
        strength = "<small class='progress-bar passCheck bg-success' style='width: 100% ;Background-color: #008768;color: #fff;'>Strong</small>";
        break;

    }
    password_strength.innerHTML = strength;

  }

  onReset() {

    this.setpassword.reset();
  }


  showHidePass(e) {
    if ($('#show_hide_password_' + e + ' input').attr("type") == "text") {
      $('#show_hide_password_' + e + ' input').attr('type', 'password');
      $('#show_hide_password_' + e + ' i').addClass("bi-eye-slash-fill");
      $('#show_hide_password_' + e + ' i').removeClass("bi-eye-fill");
    } else if ($('#show_hide_password_' + e + ' input').attr("type") == "password") {
      $('#show_hide_password_' + e + ' input').attr('type', 'text');
      $('#show_hide_password_' + e + ' i').removeClass("bi-eye-slash-fill");
      $('#show_hide_password_' + e + ' i').addClass("bi-eye-fill");
    }
  }
  CheckPassMatch : boolean = false;
  checkPassword() {
    var pass1: string | null = this.setpassword.value.newpassword;
    var pass2: string | null = this.setpassword.value.confirmpassword;

    // Check if pass1 and pass2 are not null or undefined
    if (pass1 && pass2) {
      let password1 = pass1.trim().length;
      let password2 = pass2.trim().length;

      if ((password1 > 1 && password2 > 1) && pass1 === pass2) {
        $("#passwordMatch").removeClass('invalid');
        $("#passwordMatch").addClass('valid');
        this.CheckPassMatch = true;
      } else {
        $("#passwordMatch").removeClass('valid');
        $("#passwordMatch").addClass('invalid');
        this.CheckPassMatch = false;
      }
    } else {

    }
  }



}
