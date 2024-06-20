import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Component, OnInit, TemplateRef, ElementRef, ViewChild } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { BsModalRef, BsModalService, ModalDirective } from "ngx-bootstrap/modal";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
// import { CustomValidator } from '../Helper/custom-validator';
import { CustomValidator } from "../Helper/custom-validator";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { MustMatch } from '../Helper/MustMatch';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { pwdMatch } from '../Helper/passwordMatch';
import { ProfilePhoto } from 'src/app/services/profilePhoto';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from 'src/app/services/socket.service';
import { SocketServiceStream } from 'src/app/services/SocketServiceStream';

@Component({
  selector: "app-security-settings",
  templateUrl: "./security-settings.component.html",
  styleUrls: ["./security-settings.component.scss"],
})
export class SecuritySettingsComponent implements OnInit {
  userId: any;
  infoData: any = {};
  bar0 = "green"
  secData: any = {};
  twoFactorFlag: boolean = false;
  modalRef: BsModalRef;
  // changePassword;
  elementRef: ElementRef;
  userType: any;
  securityFlag: boolean = false;
  receivedData: any = {};
  careOnlineId: any;
  receivedQuestions: any = [];
  timezoneslist: any = [];
  countryList: any = [];
  securityForm: UntypedFormGroup;
  timezoneForm: UntypedFormGroup;
  pinForm: UntypedFormGroup;
  physicianFlag: boolean = false;
  userName: any | string;
  changeQuestionFlag: boolean = false;
  chngPswrdPopFlag: boolean = false;
  secQuestionForm: UntypedFormGroup;
  chngPsswrdForm: UntypedFormGroup;
  loadAPIcall:boolean=false

  newPin = true;
  verifyPin = true;
  newPassword = true;
  CnewPassword = true;
  oldPassword = true;
  checkPassword = true;
  ValidatePassword = false;
  worngPwd: boolean = false;

  errorMsg = false;
  errorMsgTxt = '';

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    show: true
  }

  point_one: number = 0
  point_two: number = 0
  point_three: number = 0
  point_four: number = 0
  point_five: number = 0
  point_all: number = 0

  setpass = ["hasNumber", "hasCapitalCase", "hasSmallCase", "hasSpecialCharacters", "maxlength"];

  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  @ViewChild('passwordModal') passwordModal: ModalDirective;
  @ViewChild('pinModal') pinModal: ModalDirective;
  isModalShown = false;
  isPasswordShown = false
  isPinShown = false
  showModal(): void {
    this.isModalShown = true;
    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }
  onChangeCountry(event) {
    const countryCode = event;
    this.timezoneForm.get("timeZone").patchValue(null);
    this.timezoneForm.get("timeZone").enable();
    this.timeZonecountryvalues(countryCode);
  }
  timeZonecountryvalues(countryCode) {
    this.api.query("user/timeZoneByCountryCode/" + countryCode).subscribe((res) => {

      if (res) {
        this.util.stopLoader();
        this.timezoneslist = res.data.zones;

      }
    }, err => {
      this.util.stopLoader();
    });
  }

  onHidden(): void {
    this.isModalShown = false;
  }
  getCountry() {


    this.api.query("country/getAllCountries").subscribe((res) => {
      if (res) {
        this.util.stopLoader();
        res.forEach((ele) => {
          this.countryList.push(ele);
        });

      }

    }, err => {
      this.util.stopLoader();
    });
  }
  getCountry1(countrycode) {


    this.api.query("country/getAllCountries").subscribe((res) => {
      if (res) {
        this.util.stopLoader();

        res.forEach((ele) => {
          this.countryList.push(ele);
        });

      }

    }, err => {
      this.util.stopLoader();
    });
  }


  showModal1(): void {
    this.isPasswordShown = true;
    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  hideModal1(): void {
    this.passwordModal.hide();
    this.chngPsswrdForm.reset();
    this.checkPassword = true;
    this.errorMsg = false;
    this.ValidatePassword = false;
    this.worngPwd = false;
  }

  onHidden1(): void {
    this.isPasswordShown = false;
  }

  showModal2(): void {
    this.isPinShown = true;
    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  hideModal2(): void {
    this.pinModal.hide();
  }

  onHidden2(): void {
    this.isPinShown = false;
  }
  constructor(
    private api: ApiService,
    private modalService: BsModalService,
    private fb: UntypedFormBuilder,
    public matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService,
    private profilePhoto: ProfilePhoto,
    private cookieservice: CookieService,
    private _socket: SocketService,
    private _socket_stream: SocketServiceStream,
  ) {
    // window.scrollTo(0,0);
  }
  timecountry: any;
  timezoneget: any;

  ngOnInit() {

    this.userName = localStorage.getItem("userName");
    this.userId = localStorage.getItem("userId");

    this.timezoneForm = this.fb.group({
      timeZoneCountry: [null, [Validators.required]],
      timeZone: [null, [Validators.required]],
    });
    this.getCountry();
    this.getData();


    this.securityForm = this.fb.group({
      twoFactorAuth: [null],
      accountType: [null],
    });




    this.securityForm.patchValue({
      accountType: "standard",
      twoFactorAuth: "off",
    });


    this.secQuestionForm = this.fb.group({
      question1: [null],
      question2: [null],
      question3: [null],
      answer1: [null],
      answer2: [null],
      answer3: [null],
      pin: [null],
    });

    this.pinForm = this.fb.group(
      {
        oldPin: [""],
        newPin: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(4),
            CustomValidator.patternValidator(/\d/, { hasNumber: true }),
            // Validators.
          ]),
        ],
        verifyPin: ["", Validators.compose([Validators.required])],
      },
      {
        validators: CustomValidator.pinMatch,
      }
    );
    // {validator: this.checkPasswords }
    // confirmPin : ['']

    this.chngPsswrdForm = this.fb.group(
      {
        oldPassword: [null, Validators.required],
        pwd: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidator.patternValidator(/\d/, { hasNumber: true }),
            CustomValidator.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
            CustomValidator.patternValidator(/[a-z]/, { hasSmallCase: true }),
            CustomValidator.patternValidator(/[!@#$%^&*()]/, { hasSpecialCharacters: true, }),
            Validators.minLength(8),
            Validators.maxLength(15)
          ]),
        ],
        cpwd: ['', Validators.required]

      },
      {
        // validator: CustomValidator.passwordMatchValidator,

        validator: MustMatch('pwd', 'cpwd'),
        //  validators: pwdMatch('oldPassword','pwd'),

      }


    );


    this.getSecurityQuestions();
    this.checkAppAccess();
  }

  changepass(Input) {


    this.point_all = 0;
    var value = Input;
    if (value === '') {
      return {
        valid: true,
      };
    }
    for (var i = 0; i < Input.length; i++) {
      if (value.length > 8) {
        this.point_one = 20
      }
      if (value.length == 0) {
        this.point_one = 0;
        this.point_two = 0;
        this.point_three = 0;
        this.point_four = 0;
        this.point_five = 0;
        this.point_all = 0;
      }

      if (Input.charAt(i).toLowerCase()) {
        this.point_two = 20
      }
      if (Input.charAt(i).toUpperCase()) {
        this.point_three = 20
      }
      if (value === value.indexOf(/[!@#$%^&*()]/)) {
        this.point_four = 20
      }
      if (value === value.indexOf(/\d/)) {
        this.point_five = 20
      }
    }

    this.point_all = this.point_one + this.point_two + this.point_three + this.point_four + this.point_five;

    let point = document.getElementById("perogressbar");



  }




  getData() {

   this.loadAPIcall=true;
    this.api.query("user/" + this.userId).subscribe((res) => {

     this.loadAPIcall=false;
      this.infoData = res;

      this.timezoneForm.get('timeZoneCountry').patchValue(this.infoData.timeZoneCountry);
      this.timeZonecountryvalues(this.infoData.timeZoneCountry);
      this.timezoneForm.get('timeZone').patchValue(this.infoData.timeZone);




      this.userType = res["userType"];
      this.receivedData.country = res.country;
      this.receivedData.timeZone = res.timeZone;
      this.receivedData.phoneNo = res.phoneNo;


      this.callThis()
      if (this.infoData.photo != null &&
        this.infoData.photo != undefined &&
        this.infoData.photo != '') {

      } else if (this.infoData.photo == null ||
        this.infoData.photo == undefined ||
        this.infoData.photo == '') {

      }
    }, err => {
      this.util.stopLoader();
    });
  }

  callThis() {
    if (this.infoData.careOnlineNo != undefined &&
      this.infoData.careOnlineNo != null &&
      this.infoData.careOnlineNo != '') {
      this.careOnlineId = this.infoData.careOnlineNo
    }
  }

  changeQuestionsPopup() {
    this.isModalShown = true
    // this.modalRef = this.modalService.show(template);
    this.secData = {};
    this.secData.userName = this.userName;
    // this.changeQuestionFlag = on
    this.util.startLoader()
    this.api
      .create("user/security/getUserQuestions", this.secData)
      .subscribe((res) => {
        this.util.stopLoader()
        res.forEach((ele) => {
          this.secQuestionForm.patchValue({
            question1: ele.question1,
            question2: ele.question2,
            question3: ele.question3,
            answer1: ele.answer1,
            answer2: ele.answer2,
            answer3: ele.answer3,
          });
        });
      }, err => {
        this.util.stopLoader();

      });
  }
  saveusertimezone() {
    this.api.query("user/" + this.userId).subscribe((res) => {
      res.timeZoneCountry = this.timezoneForm.value.timeZoneCountry;
      res.timeZone = this.timezoneForm.value.timeZone;

      this.api.create("user/updateUser", res).subscribe((res) => {


        if (res.code == "00000") {

          Swal.fire({
            icon: "success",
            title: "Updated successfully.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }, err => {
      });

    });

  }

  updatePIN() {
    this.hideModal2()
    this.secData = {};
    this.secData.userName = this.userName;

    this.secData.oldPinNumber = this.pinForm.value.oldPin;
    this.api.startLoader();
    this.api
      .create("user/validate/security/pin", this.secData)
      .subscribe((res) => {
        if (res.code == "00000") {
          this.secData.pinNumber = this.pinForm.value.newPin;
          this.api
            .create("user/update/security/pin", this.secData)
            .subscribe((res) => {
              if (res.code == "00000") {
                this.api.stopLoader();
                Swal.fire({
                  icon: 'success',
                  title: 'Good job!',
                  text: "PIN updated successfully!"
                });
              } else if (res.code == "99999") {
                this.api.stopLoader();
                Swal.fire({
                  icon: 'error',
                  title: 'Oops..',
                  text: "Sorry! Something went wrong. Please try again later."
                });
              }
            }, err => {
              this.util.stopLoader();

            });
        } else if (res.code == "99999") {
          this.api.stopLoader();
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: "Oops! PIN did not match"
          });
        }
      });

    this.modalRef.hide();
  }

  updateSecurityQuestion() {
    this.hideModal();
    this.secData = {};
    this.secData.id = this.userId;
    this.secData.userName = this.userName;
    this.secData.question1 = this.secQuestionForm.value.question1;
    this.secData.answer1 = this.secQuestionForm.value.answer1;
    this.secData.question2 = this.secQuestionForm.value.question2;
    this.secData.answer2 = this.secQuestionForm.value.answer2;
    this.secData.question3 = this.secQuestionForm.value.question3;
    this.secData.answer3 = this.secQuestionForm.value.answer3;
    this.util.startLoader()
    this.api
      .updatePut("user/questions/update", this.secData)
      .subscribe((res) => {
        this.util.stopLoader()
        if (res.code == "00000") {
          // Swal.fire({
          //   icon: "success",
          //   title: "Good job!",
          //   text:"Security Questions has been updated successfully!"});


          Swal.fire({
            position: "center",
            icon: "success",
            title: "Security questions",
            text: "Security Questions has been updated successfully",
            showConfirmButton: false,
            timer: 2000,
          });


          // alert("Security Questions has been updated successfully!");
        } else if (res.code == "99999") {
          // setTimeout(function(){Swal.fire("Sorry. Update failed!");}, 50);
          //alert("Sorry. Update failed!");
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Security questions",
            text: "Sorry, security questions update failed. Please try after some time.",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }, err => {
        this.util.stopLoader();
      });
  }

  changePasswordPopup() {
    // this.modalRef = this.modalService.show(template);
    // this.isPasswordShown = true
    // this.chngPsswrdForm.reset();
    let datas: any = {};

    datas.username = CryptoJS.AES.encrypt(this.userName, 'gigsumo');
    datas.userId = CryptoJS.AES.encrypt(this.userId, 'gigsumo');;
    this.router.navigate(['changePassword'], { queryParams: datas });
  }


  get updatePwd() {
    return this.chngPsswrdForm.controls;
  }


  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    // https://material.angular.io/components/dialog/overview
    // const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
  }
  updatePassword() {

    this.secData = {};
    this.secData.userId = this.userId;
    this.secData.username = this.userName;
    this.secData.oldPassword = this.chngPsswrdForm.value.oldPassword;
    this.api.startLoader()
    this.api.create("user/validate/password", this.secData).subscribe((res) => {

      if (res.code == "00000") {
        this.secData.password = this.chngPsswrdForm.value.pwd;
        this.api.startLoader();
        this.api.create("user/setPassword", this.secData).subscribe((res) => {
          this.api.stopLoader();
          if (res.code === "00000") {

            this.hideModal1();
            this.checkPassword = false;
            this.errorMsg = false;
            this.chngPsswrdForm.reset();

            Swal.fire({
              icon: "success",
              title: "Password changed successfully!",
              text: "Please login using the new password. \n Thank You",
              allowEscapeKey: false,
              allowOutsideClick: false,
              showConfirmButton: false,
              timer: 2000

            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              //// console.log("login redirect")
              //// console.log("login redirect" + result.isConfirmed);

              this.api.onLogout().subscribe(res => {
                this.api.stopLoader();
                if (res) {
                  if (res.code === "00000") {
                    this.cookieservice.deleteAll();
                    localStorage.clear();
                    this._socket.ngOnDestroy();
                    this._socket_stream.ngOnDestroy();
                    this.router.navigate(['login']);
                  }
                }
              });
            });

          } else if (res.code === "99999") {
            this.api.stopLoader();
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Sorry! Password update failed."
            });
          } else if (res.code === '91234') {
            this.api.stopLoader();
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Old Password and New Password cannot be same',
            })
          }
        }, err => {
          this.util.stopLoader();
        });
      } else if (res.code == "99999") {
        this.api.stopLoader();
        this.worngPwd = true;
      }
    }, err => {
      this.util.stopLoader();
    });
    this.api.stopLoader();
  };
  setSecurityQuestions() { }

  getSecurityQuestions() {
    this.api.query("security/questions").subscribe((res) => {
      res.forEach((ele) => {
        this.receivedQuestions.push(ele);
      });
    }, err => {
      this.util.stopLoader();
    });
  }

  checkAppAccess() {
    this.secData = {};
    this.secData.userName = this.userName;
    this.api
      .create("user/security/questions", this.secData)
      .subscribe((res) => {
        // //// console.log("This is response alright!");
        // //// console.log(res);
        if (res.code == "99999") {
          this.securityFlag = false;
          // this.securityFlag = true;
        } else if (res.code == "00000") {
          this.securityFlag = true;
        }
      }, err => {
        this.util.stopLoader();

      });
  }

  //   chagetext(event: any) {
  //       event.target.value

  //       //// console.log(event.target.value)

  //       var array = [event.target.value];
  // //alert(array[0]);

  //       // let values = event.target.value;

  //       // //// console.log(values)

  //     // Ascending

  //     //// console.log(array)
  //            var array = [event.target.value];
  //            array.sort((a,b) => 0 - (a > b ? -1 : 1));

  //     // Descending

  //     array.sort((a,b) => 0 - (a > b ? 1 : -1));
  //   }

  changePin() {
    // this.modalRef = this.modalService.show(template);
    // this.pinForm.value;
    this.isPinShown = true
  }

  twoFactorAuthGenerate() {
    this.twoFactorFlag = true;
    //   let radios = []
    //   radios.push(this.securityForm.value['twoFactorAuth']);
    // for (var i=0, len=radios.length; i<len; i++) {
    //     var r = radios[i];
    //         if ( this.twoFactorFlag = true ) {
    //             r.value === 'on'
    //             r.checked = true;
    //         }
    //     }
    //     //// console.log("enabled")
  }

  twoFactorAuthRevoke() {
    this.twoFactorFlag = false;
    // let radios = this.securityForm.value['twoFactorAuth'];
    // for( var i=0, len=radios.length; i<len; i++){
    //   var r = radios[i];
    //     if(r.value === 'off'){
    //       r.checked = true
    //     }
    // }
    // //// console.log("revoked")
  }

  // validateOldPassward(){
  //   this.secData = {};
  //   this.secData.userId = this.userId;
  //   this.secData.oldPassword = this.chngPsswrdForm.value.oldPassword;
  //   this.util.startLoader()
  //   this.api.create("user/validate/password", this.secData).subscribe((data) =>{
  //     this.util.stopLoader()
  //     //// console.log('validate', data);
  //     if(data.code === '00000'){
  //       this.checkPassword = false;
  //       this.errorMsg = false;
  //       this.ValidatePassword=true;

  //     //  Swal.fire("Its validate password...")
  //     }else if(data.code === '99999'){
  //       this.checkPassword = true;
  //       this.ValidatePassword=false;
  //       this.errorMsg = true;
  //       this.errorMsgTxt = 'Incorrect old password';

  //       // Swal.fire("Incorrect old password")
  //     }
  //   })
  // }


}
