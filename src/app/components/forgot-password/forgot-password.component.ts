import { forEach, result } from 'lodash';
import { AppSettings } from './../../services/AppSettings';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from 'src/app/services/util.service';
import { SearchData } from 'src/app/services/searchData';
import Swal from 'sweetalert2';
import { CustomValidator } from '../Helper/custom-validator';
import { FormValidation } from 'src/app/services/FormValidation';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', "../../../assets/newassets/custom.css",  "../../../assets/newassets/bootstrap/css/bootstrap.min.css"]
})
export class ForgotPasswordComponent extends FormValidation implements OnInit {

  forgotpasswordForm: UntypedFormGroup;
  forgotPasswordAppUserForm: UntypedFormGroup;
  CaptchForm: UntypedFormGroup;
  forgotPwd;
  captch = true;
  cap = false;
  flag:boolean=false;

  msgsend = false;
  forgetPasswordMsg = false;
  showCaptch = false;
  appUserQ1 = false;
  appUserQ2 = false;
  appUserQ3 = false;
  AccountBlockMassege = false;
  MailSentMassege = false;
  AppQuestions;
  nonappuserdata;
  UserQuestion;
  notActive = false;
  truecheck = true

  disabledAgreement: boolean = true;

  public email;
  public Question;
  public Answer;

   isDisabled = false;
  emailemterDisble = false;

  triggerSomeEvent() {
    this.isDisabled = !this.isDisabled;
    return;
  }


  constructor(
    private fb: UntypedFormBuilder,
    private API: ApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private util: UtilService,
    private searchData: SearchData,
    private router : Router
  ) {
    super();
    var val: any = {}
    val.isLoggedOut = false
    this.searchData.setCommonVariables(val);
  }

  ngOnInit() {

    this.fogotForm();
    this.AppUserForm();
    this.formCaptch();
   }

  get pwd() {
    return this.forgotpasswordForm.controls;
  }




  fogotForm() {
    this.forgotpasswordForm = this.fb.group({
      recoverPassword: ['', [Validators.required, Validators.email,Validators.pattern(this.EMAIL.pattern) ,CustomValidator.max(50) ]],
      domainValidationOtp: ['']
      // recaptchaReactive: []
    });
  }
  formCaptch() {
    this.CaptchForm = this.fb.group({
      cap1: ['', { disabled: true }]
    });
  }
  foundInSecondary: boolean = false
  fsName: any;
  lsName: any;
  action:any;
  primaryEmail:any;
  secEmail:any;
  forgotPassword() {
    const Fpwd = {
      email: this.forgotpasswordForm.value.recoverPassword,
      recaptcha: "CHECKED"
    };
     this.notActive = false;
    this.forgotpasswordForm.get('domainValidationOtp').setValue(" ");

    if(this.forgotpasswordForm.valid){
      this.util.startLoader();
      this.API.create('home/forgot/password', Fpwd).subscribe(res => {
        this.util.stopLoader();
        this.nonappuserdata = res;
        this.forgotpasswordForm.controls.values;
          this.forgotPasswordAppUserForm.controls.AppUserEmail.setValue(Fpwd.email);
         if (res.code == '00000') {
          this.forgetPasswordMsg = false;
           this.captch = false;
          this.cap = false;
          this.MailSentMassege = true;

        }



        if (res.code == '66666') {
          this.fsName = res.data.userData.firstName
          this.lsName = res.data.userData.lastName
          this.action='RecoveryBySecondaryMail';
          this.userId = res.data.userData.userId
          this.primaryEmail = res.data.userData.email
          this.secEmail = res.data.userData.secondaryEmail
          this.spinner.hide();
          this.foundInSecondary = true
          this.forgotpasswordForm.get('recoverPassword').setErrors({ foundInSecondary: true })
          let datas:any={}
            datas.userId=this.userId


          this.API.query('business/checkBusinessStatus/'+this.userId+"/null").subscribe((res)=>
            {
              if(res.data.businessStatusCode==10002){
                this.flag=true

                const swalWithBootstrapButtons= Swal.mixin({
                  customClass:{
                    confirmButton:"btn btn-danger",
                    // denyButton:"btn btn-danger"
                  },
                  buttonsStyling:false
                });

                swalWithBootstrapButtons.fire({
              title:"Cannot Change the Mail",
              text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your mail.",
              icon: "error",
              showConfirmButton:true,
              showCancelButton:false,
              confirmButtonText:'ok',
              // denyButtonText:'No',
              allowOutsideClick: false,
              reverseButtons: true

                })

              }
              if(res.data.businessStatusCode==10001){
                this.flag=true
                const swalWithBootstrapButtons= Swal.mixin({
                  customClass:{
                    confirmButton:"btn btn-success",
                    denyButton:"btn btn-danger"
                  },
                  buttonsStyling:false
                });

                swalWithBootstrapButtons.fire({
              title:"Cannot Change the Mail",
              text: "You are the super admin of the business page.Would you like to delete the Business.",
              icon: "error",
              showConfirmButton:true,
              showDenyButton:true,
              confirmButtonText:'Yes',
              denyButtonText:'No',
              allowOutsideClick: false,
              reverseButtons:true
                }).then((result)=>{
                  if(result.isConfirmed){
                    this.flag=false;
                  }
                })

              }

            });

           this.flag=false


          // this.forgotpasswordForm.get('recoverPassword').updateValueAndValidity({emitEvent: false })

        } else if (res.code === '88888') {
          this.foundInSecondary = false
          this.spinner.hide();
          this.captch = false;
          this.cap = true;
          this.msgsend = true;
          this.notActive = false;
          this.isDisabled = true;
          this.forgotpasswordForm.get('recoverPassword').setErrors({ foundInSecondary: false })
          this.forgotpasswordForm.get('recoverPassword').updateValueAndValidity({emitEvent: false })
          // this.MailSentMassege = true;
          // tslint:disable-next-line: align
          this.CaptchForm.controls.cap1.setValue(Fpwd.email);
          ////// console.log('This is non app User :==>', this.nonappuserdata);
          // tslint:disable-next-line: align
        } else if (res.code === '99999') {
          this.foundInSecondary = false
          this.forgotpasswordForm.get('recoverPassword').setErrors({ foundInSecondary: false })
          this.forgotpasswordForm.get('recoverPassword').updateValueAndValidity({emitEvent: false })

          // this.forgotpasswordForm.get('recoverPassword').updateValueAndValidity({validEmailId: true })
          // this.forgotpasswordForm.get('recoverPassword').setErrors({ validEmailId: true })


          this.spinner.hide();
          this.forgetPasswordMsg = true;
          this.forgotpasswordForm.reset();
          this.notActive = false;
          // }
        } else if (res.code === '77777') {
          ////// console.log('User is GigSumo app user');
          this.foundInSecondary = false
          this.forgotpasswordForm.get('recoverPassword').setErrors({ foundInSecondary: false })
          this.forgotpasswordForm.get('recoverPassword').updateValueAndValidity({emitEvent: false })
          this.spinner.hide();
          this.appUserQ1 = true;
          this.captch = false;
          this.cap = false;
          this.notActive = false;
        } else if (res.code === '22222') {
          this.spinner.hide();
          this.foundInSecondary = false
          this.forgotpasswordForm.get('recoverPassword').setErrors({ foundInSecondary: false })
          this.forgotpasswordForm.get('recoverPassword').updateValueAndValidity({emitEvent: false })
          this.forgetPasswordMsg = false;
          this.notActive = true;
        }
        if (res.userSecAnswerQues && res.userSecAnswerQues != null && res.userSecAnswerQues.length > 0) {
          this.UserQuestion = this.forgotPasswordAppUserForm.controls.AppUserquestion.patchValue(res.userSecAnswerQues[0].question);
        }

        // if (res.code === '00000') {
        //   this.forgetPasswordMsg = true;
        // } else if (res.code === '99999') {
        //   this.forgetPasswordMsg = true;
        // }
      }, err => {
        this.util.stopLoader();

      });

    }


  }

  edit() {
    this.otpEmailSent = false
  }

  userId: any;
  otpVerified: boolean = false
  validateOtp() {
    if (this.forgotpasswordForm.value.domainValidationOtp == null || this.forgotpasswordForm.value.domainValidationOtp == '' || this.forgotpasswordForm.value.domainValidationOtp == undefined) {
      this.forgotpasswordForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })
    } else {
      var data: any = {}
      // data.primaryMailId = this.forgotpasswordForm.value.swapEmail
      data.entityId = this.userId
      data.businessId = this.userId
      data.otp = this.forgotpasswordForm.value.domainValidationOtp
      data.primaryMailId = this.secEmail
      data.secondaryMailId = this.primaryEmail
      this.util.startLoader()
      this.API.create('user/verifyOTPToPrimaryMailId', data).subscribe(res => {
        if (res.code == '00000') {
          this.otpVerified = true
          this.util.stopLoader()
          this.forgotpasswordForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
          this.forgotpasswordForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
          // this.otpEmailSent = false
          Swal.fire({
            position: "center",
            icon: "success",
            title: "OTP verified successfully",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            this.router.navigate(["/login"])
          })
        } else if (res.code == '99999') {
          this.util.stopLoader();
          this.forgotpasswordForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })

        }
        else if (res.code == '99998') {
          this.util.stopLoader();
          this.forgotpasswordForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })

        }
      })
    }
  }

  otpEmailSent: boolean = false
  domainValidatorSubmit: boolean = false
  proceedAfterValidation() {
    this.domainValidatorSubmit = true
    this.spinner.show()
    this.forgotpasswordForm.get('recoverPassword').setErrors({ foundInSecondary: false })
    this.forgotpasswordForm.get('recoverPassword').updateValueAndValidity({emitEvent: false })
     if (this.forgotpasswordForm.valid  ) {
      var validateEmail: any;
      validateEmail = this.forgotpasswordForm.value.recoverPassword.split('@')[1];

      this.forgotpasswordForm.get('recoverPassword').setErrors({ genericDomain: null })
      this.forgotpasswordForm.get('recoverPassword').updateValueAndValidity({ emitEvent: false })
      // this.commonVariables.emailDomainValidation = false

      var data: any = {}

      data.email = this.forgotpasswordForm.value.recoverPassword
      data.firstName = this.fsName
      data.lastName = this.lsName
      data.userId = this.userId
      data.action=this.action
      this.API.create('user/sendOtpToMailId', data).subscribe(res => {
        if (res.code == '00000') {
          this.truecheck = false
          this.spinner.hide()
          this.otpEmailSent = true
          this.forgotpasswordForm.get('domainValidationOtp').setValidators([Validators.required])
          this.forgotpasswordForm.get('domainValidationOtp').updateValueAndValidity()

          this.forgotpasswordForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
          this.forgotpasswordForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })

          this.forgotpasswordForm.get('recoverPassword').setErrors({ emailExistsAlready: null })
          this.forgotpasswordForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })


        } else if (res.code == '99998') {
          this.otpEmailSent = false
          this.truecheck = true
          this.spinner.hide()
          this.forgotpasswordForm.get('recoverPassword').setErrors({ emailExistsAlready: true })
        }
      })

    }else{
      this.spinner.hide()
    }
  }


  changeCheck(event) {
    this.disabledAgreement = !event.checked;
  }

  withcapCall(event) {
     const cap = {
      email: this.forgotpasswordForm.value.recoverPassword,
      recaptcha: 'CHECKED',

    };
    this.util.startLoader()
    this.API.create('home/forgot/password', cap).subscribe(res => {
      this.util.stopLoader();
      this.disabledAgreement = !event.checked;
      // this.API.forgotpassword('user/setPassword' , cap).subscribe(res => {
      // //// console.log('cap send :' + res);
      if (res.code === '00000') {

        this.captch = false;
        this.cap = false;
        this.MailSentMassege = true;
        // this.appUserQ1 = true;
        // this.msgsend = true;
      } else {
        this.spinner.hide();
      }
    }, err => {
      this.util.stopLoader();

    });

  }

  AppUserForm() {
    this.forgotPasswordAppUserForm = this.fb.group({
      AppUserEmail: ['', [Validators.required, Validators.email]],
      AppUserquestion: ['', Validators.required],
      AppUserAnswer: ['', Validators.required]
    });
  }


  AppuserQuestion() {
    const Qdata = {
      email: this.forgotPasswordAppUserForm.value.AppUserEmail,
      userSecAnswerQues: [
        {
          answer: this.forgotPasswordAppUserForm.value.AppUserAnswer,
          // question: 'Name?',
          question: this.forgotPasswordAppUserForm.value.AppUserquestion,
          attempt: 0
        }
      ]
    };
    this.spinner.show();
    this.API.create('home/forgot/password', Qdata).subscribe(res => {
      // //// console.log(res.question);
      ////// console.log('Question no 1');
      // this.forgotPasswordAppUserForm.controls['AppUserquestion'].patchValue(res.userSecAnswerQues[0].question)
      if (res.code === '00000') {
        this.spinner.hide();
        // this.captch = false;
        this.appUserQ1 = false;
        // this.appUserQ2 = false;
        // this.appUserQ3 = false;
        this.MailSentMassege = true;
      }
      if (res.code === '77777') {
        this.spinner.hide();
        // //// console.log('worng Answer 2nd question');
        this.resetdata();
        this.forgotPasswordAppUserForm.controls.AppUserEmail.setValue(Qdata.email);
        this.forgotPasswordAppUserForm.controls.AppUserquestion.patchValue(res.userSecAnswerQues[0].question);
        this.captch = false;
        this.appUserQ1 = false;
        this.appUserQ2 = true;
        this.appUserQ3 = false;
        this.MailSentMassege = false;
      }


    }, err => {
      this.util.stopLoader();

    });

  }

  AppuserQuestionTwo() {
    const Qdata = {
      email: this.forgotPasswordAppUserForm.value.AppUserEmail,
      userSecAnswerQues: [
        {
          answer: this.forgotPasswordAppUserForm.value.AppUserAnswer,
          // question: 'School?',
          question: this.forgotPasswordAppUserForm.value.AppUserquestion,
          attempt: 1
        }
      ]
    };
    this.util.startLoader();
    this.API.create('home/forgot/password', Qdata).subscribe(res => {
      // //// console.log(res);
      this.util.stopLoader()
      this.forgotPasswordAppUserForm.controls.AppUserquestion.patchValue(res.userSecAnswerQues[0].question);
      if (res.code === '00000') {
        // this.spinner.hide();
        // this.captch = false;
        // this.appUserQ1 = false;
        this.appUserQ2 = false;
        // this.appUserQ3 = false;
        this.MailSentMassege = true;
      }
      if (res.code === '77777') {
        //this.spinner.hide();
        //   //// console.log('worng Answer 3nd question');
        this.resetdata();
        this.forgotPasswordAppUserForm.controls.AppUserEmail.setValue(Qdata.email);
        this.forgotPasswordAppUserForm.controls.AppUserquestion.patchValue(res.userSecAnswerQues[0].question);
        this.captch = false;
        this.appUserQ1 = false;
        this.appUserQ2 = false;
        this.appUserQ3 = true;
        // this.AccountBlockMassege = true;
      }

    }, err => {
      this.util.stopLoader();

    });

  }

  AppuserQuestionThree() {
    const Qdata = {
      email: this.forgotPasswordAppUserForm.value.AppUserEmail,
      userSecAnswerQues: [
        {
          answer: this.forgotPasswordAppUserForm.value.AppUserAnswer,
          // question: 'Office?',
          question: this.forgotPasswordAppUserForm.value.AppUserquestion,
          attempt: 2
        }
      ]
    };
    this.util.startLoader();
    this.API.create('home/forgot/password', Qdata).subscribe(res => {
      ////// console.log(res);
      this.util.stopLoader();
      this.forgotPasswordAppUserForm.controls.AppUserquestion.patchValue(res.userSecAnswerQues[0].question);
      if (res.code === '00000') {
        // this.spinner.hide();
        this.captch = false;
        this.appUserQ1 = false;
        this.appUserQ2 = false;
        this.appUserQ3 = false;
        this.MailSentMassege = true;
      }
      if (res.code === '99999') {
        //this.spinner.hide();
        //  //// console.log('worng Answer 3nd question');
        this.resetdata();
        this.forgotPasswordAppUserForm.controls.AppUserEmail.setValue(Qdata.email);
        this.forgotPasswordAppUserForm.controls.AppUserquestion.patchValue(res.userSecAnswerQues[0].question);
        this.captch = false;
        this.appUserQ1 = false;
        this.appUserQ2 = false;
        this.appUserQ3 = false;

        this.AccountBlockMassege = true;
      }

    }, err => {
      this.util.stopLoader();

    });

  }
   captchkey: string = AppSettings.RECAPTCHA;
  resolved(captchaResponse: string) {


     if (captchaResponse!=null && captchaResponse.length>0) {
       this.isDisabled = true;
       this.captchkey = null
        } else {
        this.isDisabled = false;
      }
  }

  resetdata() {
    this.forgotPasswordAppUserForm.reset();
  }

  get appuser() {
    return this.forgotPasswordAppUserForm.controls;
  }



}
