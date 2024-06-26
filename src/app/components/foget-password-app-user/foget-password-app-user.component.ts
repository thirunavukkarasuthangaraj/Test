import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CustomValidator } from '../Helper/custom-validator';

@Component({
  selector: 'app-foget-password-app-user',
  templateUrl: './foget-password-app-user.component.html',
  styleUrls: ['./foget-password-app-user.component.scss']
})
export class FogetPasswordAppUserComponent implements OnInit {

  validation: any ;
  validUser = false;
  resetassflag= true;
  sigupPage: any;
  token: string;
  response: { userType: any; };
  userId: any;
  showForm = false;
  userDetails: any = {};
  Model: false;
  setpassword: UntypedFormGroup;
  userTypeForm: UntypedFormGroup;
  userData: any;
  username: any;

  constructor(private fb: UntypedFormBuilder,
              private API: ApiService,
              private router: Router ,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              public dialog: MatDialog
              ) { }

  ngOnInit() {

    this.formvalidate();
    this.valuesget();
    this.UtypeForm();

   }

  keyDown(e) {
    var e = window.event || e;
    var key = e.keyCode;
    //space pressed
     if (key == 32) { //space
      e.preventDefault();
     }
   }
//  form validation
   formvalidate(): UntypedFormGroup {

    return this.setpassword = this.fb.group({
      email : [null , Validators.required],
      pwd : [ null , Validators.compose(
        [
          Validators.required,
          CustomValidator.patternValidator(/\d/, { hasNumber: true }),
          CustomValidator.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidator.patternValidator(/[a-z]/, { hasSmallCase: true }),
          CustomValidator.patternValidator(/^[a-zA-Z0-9!@#$%^&*()]+$/  , { hasSpecialCharacters: true }),
          Validators.minLength(8)
        ]
      )],
      cpwd: ['', Validators.compose([Validators.required])]
   },
   {
    validator: CustomValidator.passwordMatchValidator

    });
 }

 public noWhitespaceValidator(control: UntypedFormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'whitespace': true };
}
// path value get
   valuesget() {
    this.route.queryParams.subscribe((pathvalue) => {
     this.token = pathvalue.jsr;
     this.resetassflag = pathvalue.resetPassword;
    // //// console.log(pathvalue.resetassflag  === 'true');
    // //// console.log(pathvalue.resetassflag);
    // //// console.log(typeof pathvalue.resetPassword);

     if (pathvalue.resetPassword === 'true') {
      this.resetassflag = false;
     }
    // //// console.log( 'Res Data from serve :' + pathvalue);

     if ( this.token !== null || this.token !== 'undefined' ) {
      this.MassageValidate();
     }
    });
   }

  get sign2() {
    return this.setpassword.controls;
  }


  MassageValidate() {
    const data: any = {};
    data.token = this.token;
    this.API.startLoader();
    this.API.AuthValidation('user/validateToken', data).subscribe(res => {
      if (res.code === '00000') {
        this.API.stopLoader();
          this.response = res;
          this.userId = res.userId;
          this.username = res.username;
         // //// console.log('userId' + this.userId);
          this.setpassword.controls.email.patchValue(this.username);
          this.showForm = true;
          this.Model = false;
       } else if (res.code === '99999') {
        this.API.stopLoader();
        this.showForm = false;
       }
     });
  }

  SetPasswordset() {

    // if (this.setpassword.valid) {
          const data: any = {};
          data.userId = this.userId;
          data.password = this.setpassword.value.pwd;
          this.API.startLoader();
          this.API.create('user/setPassword', data).subscribe(res => {
         //   //// console.log('Sign Up Data : ' + res);

            if (res.code === '00000') {
              this.API.stopLoader();
           // this.usertype();
            this.router.navigate(['login']);
          } else if (res.code === '99999') {
            this.API.stopLoader();
         }
        },err => {
          this.API.stopLoader();

         });
    // }

  }

  UtypeForm(): UntypedFormGroup {
   return this.userTypeForm = this.fb.group({
      usertype: ['' , [Validators.required]]
    });
  }

  get myForm() {
    return this.userTypeForm.get('usertype');
  }

  usertype() {
   // //// console.log(this.response);
    // if (this.userTypeForm.valid){
    this.response.userType = this.userTypeForm.value.usertype;
   // //// console.log('User Type :' + this.response.userType);
    this.API.startLoader()
    this.API.create('user/updateUserType' , this.response).subscribe(res => {
      this.API.stopLoader()
      //  //// console.log('Api response' + res);
        this.router.navigate(['userClassification'], {queryParams : res});
      });
    // }
  }

  onReset() {

    this.setpassword.reset();
}

}
