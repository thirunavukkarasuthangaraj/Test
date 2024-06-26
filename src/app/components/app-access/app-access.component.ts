import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal'
import { IfStmt } from '@angular/compiler';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { ProfilePhoto } from 'src/app/services/profilePhoto';
// import { NotifierService } from "angular-notifier";
@Component({
  selector: 'app-app-access',
  templateUrl: './app-access.component.html',
  styleUrls: ['./app-access.component.scss']
})
export class AppAccessComponent implements OnInit {
  accessGranted: boolean = false
  appAccess: UntypedFormGroup
  personalFlag: boolean = false
  physicianFlag: boolean = false
  homeHealthAgencyFlag: boolean = false
  billingFlag: boolean = false
  modalRef: BsModalRef;
  // secQuestionFlag: boolean =false;
  // secquespersflag: boolean = false;
  // secquesphyflag: boolean = false;
  // secquesageflag: boolean = false;
  // secquesbilflag: boolean = false;
  secQuestionForm: UntypedFormGroup
  userId: any;
  infoData: any;
  userName: any;
  secCheckData: any = {}
  secData: any = {}
  loadAPIcall:boolean=false
  securityQuestionaire: any = [];
  secSubmitFlag: boolean = false
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    show: true,
    keyboard: false
  }
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  @ViewChild('questionModal') questionModal: ModalDirective;
  isModalShown = false;
  isQuestionsShown = false;
  showModal(): void {
    this.isModalShown = true;
    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  showModal1(): void {
    this.isQuestionsShown = true;
    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  hideModal1(): void {
    this.questionModal.hide();
    this.secSubmitFlag = false
  }

  onHidden(): void {
    this.isModalShown = false;
  }

  onHidden1(): void {
    this.isQuestionsShown = false;
  }
  // private readonly notifier: NotifierService;
  // private notifierService: NotifierService
  //  securityQuestionaire : any = [{"question":"What was your childhood nickname?","questionDesc":null,"id":"5e9c166033b041c43872ddb7"},{"question":"In what city did you meet your spouse/significant other?","questionDesc":null,"id":"5e9c166033b041c43872ddb8"},{"question":"What is the name of your favorite childhood friend?","questionDesc":null,"id":"5e9c166033b041c43872ddb9"},{"question":"What street did you live on in third grade?","questionDesc":null,"id":"5e9c166033b041c43872ddba"},{"question":"What is your oldest sibling’s birthday month and year? (e.g., January 1900)","questionDesc":null,"id":"5e9c166033b041c43872ddbb"},{"question":"What is your oldest sibling's middle name?","questionDesc":null,"id":"5e9c166033b041c43872ddbc"},{"question":"What is the middle name of your youngest child?","questionDesc":null,"id":"5e9c166033b041c43872ddbd"},{"question":"What school did you attend for sixth grade?","questionDesc":null,"id":"5e9c166033b041c43872ddbe"},{"question":"What was your childhood phone number including area code? (e.g., 000-000-0000)","questionDesc":null,"id":"5e9c166033b041c43872ddbf"},{"question":"What is your oldest cousin's first and last name?","questionDesc":null,"id":"5e9c166033b041c43872ddc0"}]
  constructor(private fb: UntypedFormBuilder,
    private api: ApiService,
    private modalService: BsModalService,
    private util: UtilService,
    private profilePhoto: ProfilePhoto) {
    // window.scrollTo(0,0);


  }



  click() {
    const toggle:any = document.querySelector('.toggle input')

    toggle.addEventListener('click', () => {
      const onOff = toggle.parentNode.querySelector('.onoff')
      onOff.textContent = toggle.checked ? 'ON' : 'OFF'
    })
  }
  ngOnInit() {
    this.appAccess = this.fb.group({
      healthPortal: [null],
      physicianPortal: [null],
      agencyPortal: [null],
      billingPortal: [null]
    })

    this.secQuestionForm = this.fb.group({
      question1: [null, [Validators.required]],
      question2: [null, [Validators.required]],
      question3: [null, [Validators.required]],
      answer1: [null, [Validators.required]],
      answer2: [null, [Validators.required]],
      answer3: [null, [Validators.required]],
      pin: [null, [Validators.required]]
    })
    this.userId = localStorage.getItem('userId')
    this.userName = localStorage.getItem('userName')
    this.checkAppAccess();
    this.getSecurityQuestion();
    this.photoCall()
  }

  photoCall() {

    this.api.query("user/" + this.userId).subscribe(res => {

        this.infoData = res
      if (this.infoData.photo != null &&
        this.infoData.photo != undefined &&
        this.infoData.photo != '') {

      } else if (this.infoData.photo == null ||
        this.infoData.photo == undefined ||
        this.infoData.photo == '') {

      }
    }, err => {
      this.util.stopLoader();
    })
  }

  get securityControl() {
    return this.secQuestionForm.controls;
  }

  decline(): void {
    this.modalRef.hide()
  }



  personalHealthRevoke() {
    this.personalFlag = false
  }



  physicianRevoke() {
    this.physicianFlag = false
  }



  homeHealthAgencyRevoke() {
    this.homeHealthAgencyFlag = false
  }


  billingRevoke() {
    this.billingFlag = false
  }

  getSecurityQuestion() {
    this. loadAPIcall=true
    this.api.query('security/questions').subscribe(res => {
      this. loadAPIcall=false;
      this.util.stopLoader();
      res.forEach(element => {
        this.securityQuestionaire.push(element)
      })
      // //// console.log(res)
      // //// console.log("Security question response")
    }, err => {
      this.util.stopLoader();
    })
    // //// console.log("Security questions")
    // //// console.log(this.securityQuestionaire)
  }

  checkAppAccess() {
    //  this.util.startLoader()
    this.api.query('user/getuser/appaccess/' + this.userName).subscribe(res => {

      if (!res) {
        this.personalFlag = false
        this.physicianFlag = false
        this.homeHealthAgencyFlag = false
        this.billingFlag = false
        this.appAccess.patchValue({
          healthPortal: 'off',
          physicianPortal: 'off',
          billingPortal: 'off',
          agencyPortal: 'off'
        })
        // this.util.stopLoader()
      } else {

        if (res.healthPortal) {
          this.personalFlag = true
          this.appAccess.patchValue({
            healthPortal: 'on'
          })

        } else {
          this.personalFlag = false
          this.appAccess.patchValue({
            healthPortal: 'off'
          })
        }
        if (res.physicianPortal) {
          this.physicianFlag = true
          this.appAccess.patchValue({
            physicianPortal: 'on'
          })
        } else {
          this.physicianFlag = false
          this.appAccess.patchValue({
            physicianPortal: 'off'
          })
        }
        if (res.agencyPortal) {
          this.homeHealthAgencyFlag = true
          this.appAccess.patchValue({
            agencyPortal: 'on'
          })
        } else {
          this.homeHealthAgencyFlag = false
          this.appAccess.patchValue({
            agencyPortal: 'off'
          })
        }
        if (res.billingPortal) {
          this.billingFlag = true
          this.appAccess.patchValue({
            billingPortal: 'on'
          })
        } else {
          this.billingFlag = false
          this.appAccess.patchValue({
            billingPortal: 'off'
          })
        }
      }

    }, err => {
      this.util.stopLoader();
    })
    // this.util.stopLoader()
  }

  questions() {
    this.hideModal()
    this.isQuestionsShown = true
    this.secQuestionForm.get('question1').setValidators([Validators.required])
    this.secQuestionForm.get('question1').updateValueAndValidity()
    this.secQuestionForm.get('question2').setValidators([Validators.required])
    this.secQuestionForm.get('question2').updateValueAndValidity()
    this.secQuestionForm.get('question3').setValidators([Validators.required])
    this.secQuestionForm.get('question3').updateValueAndValidity()
    this.secQuestionForm.get('answer1').setValidators([Validators.required])
    this.secQuestionForm.get('answer1').updateValueAndValidity()
    this.secQuestionForm.get('answer2').setValidators([Validators.required])
    this.secQuestionForm.get('answer2').updateValueAndValidity()
    this.secQuestionForm.get('answer3').setValidators([Validators.required])
    this.secQuestionForm.get('answer3').updateValueAndValidity()
    this.secQuestionForm.get('pin').setValidators([Validators.required])
    this.secQuestionForm.get('pin').updateValueAndValidity()
  }

  setPersonalAppAccess1(open: boolean) {
    this.secData = {}
    this.secData.userName = this.userName
    //  this.util.startLoader()
    this.api.create('user/security/questions', this.secData).subscribe(res => {

      if (res.code == "00000") {
        this.secData.healthPortal = "ACCESS"
        if (this.physicianFlag) {
          this.secData.physicianPortal = "ACCESS"
        } else {
          this.secData.physicianPortal = "REMOVE"
        }

        if (this.homeHealthAgencyFlag) {
          this.secData.agencyPortal = "ACCESS"
        } else {
          this.secData.agencyPortal = "REMOVE"
        }

        if (this.secData.billingPortal) {
          this.secData.billingPortal = "ACCESS"
        } else {
          this.secData.billingPortal = "REMOVE"
        }
        this.api.create('user/appaccess', this.secData).subscribe(res => {
          // this.util.stopLoader()
          //if success
          if (res.code == "00000") {
            this.appAccess.patchValue({
              healthPortal: 'on'
            })
            Swal.fire("App access has been granted!")
            // this.notifier.notify("success", "App access has been granted!");
          } else if (res.code == "99999") {
            this.appAccess.patchValue({
              healthPortal: 'off'
            })
          }
        })
      } else if (res.code == "99999") {
        // this.util.stopLoader()
        this.isModalShown = open
      }
    })
  }


  setPersonalAppAccess2() {
    this.secSubmitFlag = true
    this.secData = {}
    this.secData.userName = this.userName
    this.secData.healthPortal = "ACCESS"
    if (this.physicianFlag) {
      this.secData.physicianPortal = "ACCESS"
    } else {
      this.secData.physicianPortal = "REMOVE"
    }
    if (this.homeHealthAgencyFlag) {
      this.secData.agencyPortal = "ACCESS"
    } else {
      this.secData.agencyPortal = "REMOVE"
    }
    if (this.billingFlag) {
      this.secData.billingPortal = "ACCESS"
    } else {
      this.secData.billingPortal = "REMOVE"
    }

    this.secData.userSecurityQuestion = [
      {
        "userName": this.userName,
        "question1": this.secQuestionForm.value.question1,
        "answer1": this.secQuestionForm.value.answer1,
        "question2": this.secQuestionForm.value.question2,
        "answer2": this.secQuestionForm.value.answer2,
        "question3": this.secQuestionForm.value.question3,
        "answer3": this.secQuestionForm.value.answer3,
        "pinNumber": this.secQuestionForm.value.pin,
        "attempt": null,
        "id": this.userId
      }
    ]


    if (this.secQuestionForm.valid) {
      this.hideModal1();
      this.util.startLoader()
      this.api.create('user/appaccess', this.secData).subscribe(res => {

        this.util.stopLoader()
        if (res.code == "00000") {
          this.personalFlag = true
          this.appAccess.patchValue({
            healthPortal: 'on'
          })
          setTimeout(function () { Swal.fire("Access has been granted"); }, 50);
          //alert("Access has been granted")
        }
        else if (res.code == "99999") {
          // this.secquespersflag = true
          this.appAccess.patchValue({
            healthPortal: 'off'
          })
        }
      }, err => {
        this.util.stopLoader();

      });
    }



  }



  setPhysicianAppAccess1(open: boolean) {
    this.secData = {}
    this.secData.userName = this.userName
    //chcking if security question has already beencreated for physician portal access
    // this.util.startLoader()
    this.api.create('user/security/questions', this.secData).subscribe(res => {

      if (res.code == "00000") {
        //if security questions has been created
        this.secData.physicianPortal = "ACCESS"

        if (this.personalFlag) {
          this.secData.healthPortal = "ACCESS"
        } else {
          this.secData.healthPortal = "REMOVE"
        }

        if (this.homeHealthAgencyFlag) {
          this.secData.agencyPortal = "ACCESS"
        } else {
          this.secData.agencyPortal = "REMOVE"
        }

        if (this.billingFlag) {
          this.secData.billingPortal = "ACCESS"
        } else {
          this.secData.billingPortal = "REMOVE"
        }
        this.api.create('user/appaccess', this.secData).subscribe(res => {
          //  this.util.stopLoader()
          //if app acces is granted
          if (res.code == "00000") {
            this.physicianFlag = true
            this.appAccess.patchValue({
              physicianPortal: 'on'
            })
            Swal.fire("App access has been granted!")
          }
          //if app access is denied
          else if (res.code == "99999") {
            this.appAccess.patchValue({
              physicianPortal: 'off'
            })
          }
        })
      }
      //if security questions hasn't been created
      else if (res.code == "99999") {
        //this.util.stopLoader()
        this.isModalShown = open
      }
    })
  }

  setPhysicianAppAccess2() {

    this.secData = {}
    this.secData.userName = this.userName
    this.secData.physicianPortal = "ACCESS"
    if (this.personalFlag) {
      this.secData.healthPortal = "ACCESS"
    } else {
      this.secData.healthPortal = "REMOVE"
    }
    if (this.homeHealthAgencyFlag) {
      this.secData.agencyPortal = "ACCESS"
    } else {
      this.secData.agencyPortal = "REMOVE"
    }
    if (this.billingFlag) {
      this.secData.billingPortal = "ACCESS"
    } else {
      this.secData.billingPortal = "REMOVE"
    }
    this.secData.userSecurityQuestion = [
      {
        "userName": this.userName,
        "question1": this.secQuestionForm.value.question1,
        "answer1": this.secQuestionForm.value.answer1,
        "question2": this.secQuestionForm.value.question2,
        "answer2": this.secQuestionForm.value.answer2,
        "question3": this.secQuestionForm.value.question3,
        "answer3": this.secQuestionForm.value.answer3,
        "pinNumber": this.secQuestionForm.value.pin,
        "attempt": null,
        "id": this.userId
      }
    ]
    this.util.startLoader()
    this.api.create('user/appaccess', this.secData).subscribe(res => {
      this.util.stopLoader()
      //if app access has been granted
      if (res.code == "00000") {
        this.physicianFlag = true
        this.appAccess.patchValue({
          physicianPortal: 'on'
        })
        setTimeout(function () { Swal.fire("Access has been granted"); }, 50);
        //alert("Access has been granted")
      }
      //if app access has been denied
      else if (res.code == "99999") {
        this.appAccess.patchValue({
          physicianPortal: 'off'
        })
      }
    }, err => {
      this.util.stopLoader();

    });

  }

  setAgencyAppAccess1(open: boolean) {
    this.secData = {}
    this.secData.userName = this.userName
    // this.util.startLoader()
    this.api.create('user/security/questions', this.secData).subscribe(res => {

      //if security questions were created already
      if (res.code == "00000") {
        this.secData.agencyPortal = "ACCESS"

        if (this.personalFlag) {
          this.secData.healthPortal = "ACCESS"
        } else {
          this.secData.healthPortal = "REMOVE"
        }

        if (this.physicianFlag) {
          this.secData.physicianPortal = "ACCESS"
        } else {
          this.secData.physicianPortal = "REMOVE"
        }

        if (this.billingFlag) {
          this.secData.billingPortal = "ACCESS"
        } else {
          this.secData.billingPortal = "REMOVE"
        }
        this.api.create('user/appaccess', this.secData).subscribe(res => {
          // this.util.stopLoader()
          //if app acces has been granted
          if (res.code == "00000") {
            this.homeHealthAgencyFlag = true
            this.appAccess.patchValue({
              agencyPortal: 'on'
            })
            Swal.fire("App access has been granted!")
          }
          //if app access is denied
          else if (res.code == "99999") {
            this.appAccess.patchValue({
              agencyPortal: 'off'
            })
          }
        })
      } else if (res.code == "99999") {
        // this.util.stopLoader()
        // this.secquesageflag = open
        this.isModalShown = open

      }
    })
  }

  setAgencyAppAccess2() {

    this.secData = {}
    this.secData.userName = this.userName
    this.secData.agencyPortal = "ACCESS"
    if (this.personalFlag) {
      this.secData.healthPortal = "ACCESS"
    } else {
      this.secData.healthPortal = "REMOVE"
    }
    if (this.physicianFlag) {
      this.secData.physicianPortal = "ACCESS"
    } else {
      this.secData.physicianPortal = "REMOVE"
    }
    if (this.billingFlag) {
      this.secData.billingPortal = "ACCESS"
    } else {
      this.secData.billingPortal = "REMOVE"
    }
    this.secData.userSecurityQuestion = [
      {
        "userName": this.userName,
        "question1": this.secQuestionForm.value.question1,
        "answer1": this.secQuestionForm.value.answer1,
        "question2": this.secQuestionForm.value.question2,
        "answer2": this.secQuestionForm.value.answer2,
        "question3": this.secQuestionForm.value.question3,
        "answer3": this.secQuestionForm.value.answer3,
        "pinNumber": this.secQuestionForm.value.pin,
        "attempt": null,
        "id": this.userId
      }
    ]
    this.util.startLoader()
    this.api.create('user/appaccess', this.secData).subscribe(res => {
      this.util.stopLoader()
      // if app access is granted
      if (res.code == "00000") {
        this.appAccess.patchValue({
          agencyPortal: 'on'
        })
        setTimeout(function () { Swal.fire("App access has been granted!"); }, 50);
        // alert("App access has been granted!")
        this.homeHealthAgencyFlag = true
        setTimeout(function () { Swal.fire("Access has been granted"); }, 50);
        // alert("Access has been granted")
      }
      else if (res.code == "99999") {
        this.appAccess.patchValue({
          agencyPortal: 'off'
        })
        // this.secquespersflag = true

      }
    }, err => {
      this.util.stopLoader();

    });



  }

  setBillingAppAccess1(open: boolean) {
    this.secData = {}
    this.secData.userName = this.userName
    //this.util.startLoader()
    this.api.create('user/security/questions', this.secData).subscribe(res => {

      // if security questions exist
      if (res.code == "00000") {
        this.secData.billingPortal = "ACCESS"
        if (this.personalFlag) {
          this.secData.healthPortal = "ACCESS"
        } else {
          this.secData.healthPortal = "REMOVE"
        }

        if (this.physicianFlag) {
          this.secData.physicianPortal = "ACCESS"
        } else {
          this.secData.physicianPortal = "REMOVE"
        }

        if (this.homeHealthAgencyFlag) {
          this.secData.agencyPortal = "ACCESS"
        } else {
          this.secData.agencyPortal = "REMOVE"
        }
        this.api.create('user/appaccess', this.secData).subscribe(res => {
          // this.util.stopLoader()
          //if success
          if (res.code == "00000") {
            // if app access is granted
            this.billingFlag = true
            this.appAccess.patchValue({
              billingPortal: 'on'
            })
            Swal.fire("App access has been granted!")
          }
          // if app access is denied
          else if (res.code == "99999") {
            this.appAccess.patchValue({
              billingPortal: 'off'
            })
          }
        })
      } else if (res.code == "99999") {
        // this.util.stopLoader()
        // this.secquesbilflag = open
        this.isModalShown = open

      }
    })
  }
  setBillingAppAccess2() {
    this.secData = {}
    this.secData.userName = this.userName
    this.secData.billingPortal = "ACCESS"
    if (this.personalFlag) {
      this.secData.healthPortal = "ACCESS"
    } else {
      this.secData.healthPortal = "REMOVE"
    }
    if (this.physicianFlag) {
      this.secData.physicianPortal = "ACCESS"
    } else {
      this.secData.physicianPortal = "REMOVE"
    }
    if (this.homeHealthAgencyFlag) {
      this.secData.agencyPortal = "ACCESS"
    } else {
      this.secData.agencyPortal = "REMOVE"
    }

    this.secData.userSecurityQuestion = [
      {
        "userName": this.userName,
        "question1": this.secQuestionForm.value.question1,
        "answer1": this.secQuestionForm.value.answer1,
        "question2": this.secQuestionForm.value.question2,
        "answer2": this.secQuestionForm.value.answer2,
        "question3": this.secQuestionForm.value.question3,
        "answer3": this.secQuestionForm.value.answer3,
        "pinNumber": this.secQuestionForm.value.pin,
        "attempt": null,
        "id": this.userId
      }
    ]

    //  //// console.log("Element data")
    //  //// console.log(this.secData)
    this.util.startLoader()
    this.api.create('user/appaccess', this.secData).subscribe(res => {
      this.util.stopLoader()
      //if app access granted
      if (res.code == "00000") {
        this.appAccess.patchValue({
          billingPortal: 'on'
        })
        this.billingFlag = true
        setTimeout(function () { Swal.fire("Access has been granted"); }, 50);
        //  alert("Access has been granted")
      }
      else if (res.code == "99999") {
        // this.secquespersflag = true
        this.appAccess.patchValue({
          billingPortal: 'off'
        })
      }
    }, err => {
      this.util.stopLoader();

    });



  }
}



