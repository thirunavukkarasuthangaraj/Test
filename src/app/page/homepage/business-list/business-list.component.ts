import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { UtilService } from '../../../services/util.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { UntypedFormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { SearchData } from 'src/app/services/searchData';
import { CustomValidator } from 'src/app/components/Helper/custom-validator';
import { FormValidation } from 'src/app/services/FormValidation';
import { debounceTime } from 'rxjs/operators';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { HealthCareOrganization } from 'src/app/services/HealthCareOrganization';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss']
})
export class BusinessListComponent extends FormValidation implements OnInit {


  @ViewChild('landingside1') menuElement: ElementRef;
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  @ViewChild('workExperienceTemplate') workExperienceTemplate;
  @ViewChild('currentOrganizationList') currentOrganizationList;

  landingsidesticky1: boolean = false;
  landingsidesticky2: boolean = false;
  elementPosition: any;
  noDatafound: Array<string>;
  workExperience: UntypedFormArray
  eperienceForm: UntypedFormGroup
  organizationList: any;
  businessExistList: any;
  businessPendingList: any;
  loadAPIcall:boolean=false
  clientTypeListprofile: Array<string> = ['Direct Client', 'Supplier', 'Systems Integrator', 'Prime Vendor', 'Vendor', 'Staffing Agency']
  public FORMERROR = this.Form
  businessdetail: any;
  tempbusinessdetail: any;
  isModalShown = false;
  formValidity: boolean = false
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    show: true
  }
  months: Array<{ code: number, name: string }> | any = [
    { code: 1, name: "January" },
    { code: 2, name: "February" },
    { code: 3, name: "March" },
    { code: 4, name: "April" },
    { code: 5, name: "May" },
    { code: 6, name: "June" },
    { code: 7, name: "July" },
    { code: 8, name: "August" },
    { code: 9, name: "September" },
    { code: 10, name: "October" },
    { code: 11, name: "November" },
    { code: 12, name: "December" },
  ];

  subscriber: Subscription
  bname;
  chooseBusinessPage: UntypedFormGroup;
  userType = "ALL"
  loginUserType = localStorage.getItem('userType')
  seletedOrgnazationId: any;
  showNoDatafound: boolean = false;
  btnnameshow = 'All'
  searchKey
  stateListAU: any[];
  stateListIN: any[];
  stateListCA: any[];
  years1: any[];
  countryList: any[];
  selectedOrganisation: string
  clientTypeList: Array<string> | any = []
  isButtonClicked: boolean = false;
  supportModal: any;
  constructor(
    private util: UtilService,
    private api: ApiService,
    private router: Router,
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private searchData: SearchData,
    private gigsumoService: GigsumoService
  ) {
    super();
    this.subscriber = this.searchData.getBooleanValue().subscribe(res => {
      if (res&&res.boolean == true) {
        this.companydetailsapicall();
      }
    });
    this.isButtonClicked = this.gigsumoService.buttonClicked ? false : true;
  }

  ngOnInit() {
    this.updateSupportModule();

    this.domainForm = this.formBuilder.group({
      priEmail: null,
      secEmail: null,
      swapEmail: [null, [Validators.required]],
      domainValidationOtp: null,
    })
    this.companydetailsapicall();
  }

  // triggerChange: number = Date.now();
  isButtonDisabled: boolean = false
  isModalClosed(event) {
    if (event == 'CLOSE') {
      this.isButtonDisabled = false;
    }
  }

  get controlOfForms() {
    return this.chooseBusinessPage.controls;
  }

  keyupdata(event) {
    if (event.target.value.length == 0) {
      this.onsearch('');
    }
  }
  userId: any = localStorage.getItem('userId')
  domainList: any = []
  firstName: any;
  workExperienceDetailsCheck: any = [];
  lastName: any;
  currentOrg: boolean = false

  // creditPoints; any;
  checkPrerequisites() {
    this.util.startLoader()
    var data: any = {}
    data.userId = this.userId
    data.userType = this.userType
    this.api.create('user/profileDetails', data).subscribe(res => {
      this.util.stopLoader()

      res.data.exeperienceList.forEach(res => {
        if (res.currentOrganization) {
          this.currentOrg = true
        }
      });

      if (res.code == '00000') {

        res.data.GIGSUMO_GENERIC_EMAIL_DOMAINS.listItems.forEach(ele => {
          this.domainList.push(ele.item)
        })
        // primaryEmail = "abubakrgoogl@gmail.com";
        // primaryEmail = "lixara4382@pantabi.com";
        this.firstName = res.data.userData.firstName;
        this.lastName = res.data.userData.lastName;
        // this.creditPoints = res.data.creditPoints
        this.primaryEmail = res.data.userData.email;
        if (res.data.userData.secondaryEmail == null || res.data.userData.secondaryEmail == undefined) {
          this.secondaryEmail = 'None provided'
        } else {
          this.secondaryEmail = res.data.userData.secondaryEmail
        }

        var validateEmail: any;
        validateEmail = this.primaryEmail.split('@')[1];
        const a = this.domainList.indexOf(validateEmail)

        //   valid email check if not valid it will return  -1
        // a == '-1' &&
        if (this.userType != 'student' && this.userType != 'JOB_SEEKER') {

          this.util.stopLoader()
          if (res.data.exeperienceList.length == 0 || !this.currentOrg) {

            // Swal.fire({
            //   title: 'Work Experience Required',
            //   text: 'You need to currently work at a business organization to create a Business Page. Please go to Profile > Add Work Experience > Check the Current Organization check-box.',
            //   icon: 'info',
            //   showDenyButton: false,
            //   confirmButtonText: `ok`,

            // }).then((result) => {
            //   /* Read more about isConfirmed, isDenied below */
            //   if (result.isConfirmed) {
            //   // this.modalService.hide(1)
            // }
            // });

            this.addWorkExperience(res.data.userData.clientType)
            this.modalRef = this.modalService.show(this.workExperienceTemplate, this.backdropConfig)
            this.isButtonDisabled = true

          } else if (res.data.exeperienceList.length > 0) {

            // res.data.exeperienceList.forEach(ele => {
            //   this.workExperienceDetailsCheck.push(ele)
            // })
            this.BusniessCreatePage()

          }

        } else if (this.userType == 'student' || this.userType == 'JOB_SEEKER') {

          Swal.fire({
            position: "center",
            icon: "info",
            title: "Oops..",
            text: "Sorry, Student or a Job Seeker cannot create a business page.",
            showConfirmButton: false,
            timer: 1500,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              // this.modalService.hide(1)
            }
          });
        } else if (this.userType != 'student' && this.userType != 'JOB_SEEKER' && a != '-1') {

          // template: TemplateRef<any>
          this.modalRef = this.modalService.show(this.businessEmailTemplate, this.backdropConfig);
          this.isButtonDisabled = true
        }
      }
    })

  }

  openBusiness(openPop: string) {
    setTimeout(() => {
      this.checkPrerequisites();
    }, 1000);
  }
  modalRef: BsModalRef;
  @ViewChild("businessEmailTemplate") businessEmailTemplate;

  validateOtp() {

    if (this.domainForm.value.domainValidationOtp == null || this.domainForm.value.domainValidationOtp == '' || this.domainForm.value.domainValidationOtp == undefined) {

      this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })

    } else {

      var data: any = {}
      data.primaryMailId = this.domainForm.value.swapEmail
      if (this.secondaryEmail == null || this.secondaryEmail == undefined || this.secondaryEmail == 'None provided') {
        data.secondaryMailId = this.primaryEmail  // working pending hre abu
      } else if (this.secondaryEmail != null && this.secondaryEmail != undefined && this.secondaryEmail != 'None provided') {
        data.secondaryMailId = this.secondaryEmail
      }
      data.entityId = this.userId
      data.businessId = this.userId
      data.otp = this.domainForm.value.domainValidationOtp
      this.util.startLoader()
      this.api.create('user/verifyOTPToPrimaryMailId', data).subscribe(res => {
        if (res.code == '00000') {
          this.util.stopLoader()
          this.modalService.hide(1)
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
          this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
          this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
          this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
          // this.otpEmailSent = false
          Swal.fire({
            position: "center",
            icon: "success",
            title: "OTP verified successfully",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            // localStorage.setItem('userName', this.domainForm.value.swapEmail)
            if (this.workExperienceDetailsCheck.length > 0) {

              this.BusniessCreatePage()
            } else {

              // this.addWorkExperience()
              Swal.fire({
                title: 'Work Experience Required',
                text: 'You need to have a work experience where you currently work to create a business page. Please go to Profile > Add Work Experience > Check the Current Organization check-box.',
                icon: 'info',
                showDenyButton: false,
                confirmButtonText: `ok`,

              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {

                }
              });
            }
          })
        } else if (res.code == '99999') {
          this.util.stopLoader();
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })

        }
        else if (res.code == '99998') {
          this.util.stopLoader();
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })

        }
      })
    }
  }

  closeValidator() {
    this.domainValidatorSubmit = false
    this.otpEmailSent = false
    this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
    this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
    this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
    this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
    this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
    this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
    this.modalService.hide(1)
  }

  otpEmailSent: boolean = false
  domainValidatorSubmit: boolean = false
  proceedAfterValidation() {
    this.domainValidatorSubmit = true
    if (this.domainForm.valid) {
      var validateEmail: any;
      validateEmail = this.domainForm.value.swapEmail.split('@')[1];
      const a = this.domainList.indexOf(validateEmail)
      if (a != '-1') {
        this.util.stopLoader()
        this.domainForm.get('swapEmail').setErrors({ genericDomain: true })
      } else {
        this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
        this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
        var data: any = {}
        data.email = this.domainForm.value.swapEmail
        data.firstName = this.firstName
        data.lastName = this.lastName
        data.userId = this.userId
        this.api.create('user/sendOtpToMailId', data).subscribe(res => {
          if (res.code == '00000') {
            this.otpEmailSent = true
            this.domainForm.get('domainValidationOtp').setValidators([Validators.required])
            this.domainForm.get('domainValidationOtp').updateValueAndValidity()
            this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
            this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
            this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
            this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
          } else if (res.code == '99998') {
            this.otpEmailSent = false
            this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: true })
          }
        })
      }
    }
  }

  secondaryEmail: any = null
  primaryEmail: any;
  closeEmailDomainValidator() {
    // if (this.otpEmailSent == true) {
    this.isButtonDisabled = false;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to discontinue the validation?",
        text: "If you ignore this process, you may not create Business",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
        allowOutsideClick: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.modalService.hide(1);
          this.domainForm.get('domainValidationOtp').patchValue(null)
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
          this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
          this.domainForm.get('swapEmail').patchValue(null)
          this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
          this.domainForm.get('domainValidationOtp').clearValidators();
          this.domainForm.get('domainValidationOtp').updateValueAndValidity();
          this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
          this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
          this.otpEmailSent = false
          // this.commonVariables.emailDomainValidation = false
          // this.searchData.setCommonVariables(this.commonVariables)
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // this.commonVariables.emailDomainValidation = true
          // this.searchData.setCommonVariables(this.commonVariables)
        }
      })
    // } else if (this.otpEmailSent == false) {
    //   this.domainForm.get('domainValidationOtp').patchValue(null)
    //   // this.commonVariables.emailDomainValidation = false
    //   // this.searchData.setCommonVariables(this.commonVariables)
    // }
  }


  edit() {
    this.otpEmailSent = false
  }

  onsearch(val) {
    if (val != undefined) {
      val = val.trim().toLowerCase();
    }

    if (this.btnnameshow == 'All') {
      this.businessdetail = this.tempbusinessdetail;
      this.businessdetail = this.filterByString(this.businessdetail, val);
    } else if (this.btnnameshow == 'All') {
      this.businessdetail = this.tempbusinessdetail;
      this.businessdetail = this.businessdetail.filter(function (item) {
        return item.isSuperAdmin == true;
      })
      this.businessdetail = this.filterByString(this.businessdetail, val);
    } else if (this.btnnameshow == 'Admin') {
      this.businessdetail = this.tempbusinessdetail;
      this.businessdetail = this.businessdetail.filter(function (item) {
        return item.isAdmin == true;
      })
      this.businessdetail = this.filterByString(this.businessdetail, val);
    }
  }
  sort_by_key(admin) {
    if (admin == 'superadmin') {
      this.noDatafound = ["You are not a super admin any Business Pages."]
      this.btnnameshow = 'Super Admin';
      this.businessdetail = this.tempbusinessdetail;
      this.businessdetail = this.businessdetail.filter(function (item) {
        return item.isSuperAdmin == true;
      })
    } else if (admin == 'admin') {
      this.noDatafound = ["You are not an admin any Business Pages."]
      this.btnnameshow = 'Admin';
      this.businessdetail = this.tempbusinessdetail;
      this.businessdetail = this.businessdetail.filter(function (item) {
        return item.isAdmin == true;
      })
    } else if (admin == 'all') {
      this.noDatafound = ["You are not in any Businesses yet."]
      this.btnnameshow = 'All';
      this.businessdetail = this.tempbusinessdetail;
      this.businessdetail = this.filterByString(this.businessdetail, '');
    }

    if (this.businessdetail.length == 0) {
      this.showNoDatafound = true;
    } else {
      this.showNoDatafound = false;
    }

  }

  filterByString(data, s) {
    return data.filter(e => e.businessName.toLowerCase().includes(s))
      .sort((a, b) => a.businessName.toLowerCase().includes(s) && !b.businessName.toLowerCase().includes(s) ? -1 : b.businessName.toLowerCase().includes(s) && !a.businessName.toLowerCase().includes(s) ? 1 : 0);
  }
  CreatebusinessPage() {
    //this.pagelistData.businessPageStatus();
  }
  companydetailsapicall() {
    let datas: any = {};
    datas.userId = localStorage.getItem('userId');
   this.loadAPIcall=true
    this.api.create("business/check/user", datas).subscribe(res => {
      this.loadAPIcall=false
      this.businessdetail = [];
      this.util.stopLoader();

      let combinedList = [];

      if (res && res.data && res.data.businessModelList && res.data.businessModelList.length > 0) {
        combinedList = combinedList.concat(res.data.businessModelList);
      }
      if (res && res.data && res.data.businessSuggestionsList && res.data.businessSuggestionsList.length > 0) {
        combinedList = combinedList.concat(res.data.businessSuggestionsList);
      }
      if (res && res.data && res.data.openBusinessList && res.data.openBusinessList.length > 0 && this.loginUserType != 'JOB_SEEKER') {
        res.data.openBusinessList.forEach(e => {
          e.claimable = true;
        });
        combinedList = combinedList.concat(res.data.openBusinessList);
      }

      this.businessdetail = combinedList;
      if (this.businessdetail.length > 0) {
        this.businessdetail.sort(this.dynamicSort('businessName'));
        this.tempbusinessdetail = this.businessdetail;
      } else {
        if (this.loginUserType != "FREELANCE_RECRUITER") {
          this.isButtonDisabled = false;
          this.noDatafound = [
            'b Please do one of the below, for businesses to be listed in the page',
            '1. Update your profile with your company business email ID.',
            '2. Complete your current work experience section in your profile.',
            this.loginUserType != "JOB_SEEKER" ? '3. Create a business page for your company ' : '3. Follow a business',
            this.loginUserType != "JOB_SEEKER" ? '4. Follow a business' : ''
          ];
        } else {
          this.isButtonDisabled = true;

          this.noDatafound = [
            'You are not part of any business pages or you are not following any business pages available on the platform. Please follow them to be listed here.'
          ];
        }
      }
    }, err => {
      this.util.stopLoader();
    });
  }


  ngAfterViewInit() {
    window.scrollTo(0, 0);
    // this.elementPosition = this.menuElement.nativeElement.offsetTop;
    // ////// console.log(this.elementPosition);
  }

  @HostListener('window:scroll')
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 24) {
      this.landingsidesticky1 = true;
      this.landingsidesticky2 = true;
    } else {
      this.landingsidesticky1 = false;
      this.landingsidesticky2 = false;
    }
  }

  getbussinessid(data) {
    this.checkadmin(data.businessId, data)
  }

  checkadmin(businessid, data) {
    let datas: any = {};
    datas.businessId = businessid;
    datas.userId = localStorage.getItem('userId');
    this.util.startLoader();
    this.api.create("business/check/admin", datas).subscribe(res => {
      this.util.stopLoader();

      localStorage.setItem('businessId', businessid)
      localStorage.setItem('isAdmin', res.isAdmin)
      localStorage.setItem('isSuperAdmin', res.isSuperAdmin)
      localStorage.setItem('screen', 'business')
      localStorage.setItem('adminviewflag', 'false')
      this.router.navigate(['business'], { queryParams: data })

    }, err => {
      this.util.stopLoader();

    });
  }

  onselecte(value) {
    this.seletedOrgnazationId = value.item.organizationId;
  }


  clear() {
    ////// console.log("1");
    this.seletedOrgnazationId = null;
  }



  navigate() {
    ////// console.log(this.chooseBusinessPage.value.organizationName)
    this.formValidity = true

    this.chooseBusinessPage.value.organizationName = this.seletedOrgnazationId;

    if (this.seletedOrgnazationId != null && this.chooseBusinessPage.valid) {
      let pendingBussiness = _.find(this.businessPendingList, ["organizationId", this.chooseBusinessPage.value.organizationName]);
      let existsBusiness = _.find(this.businessExistList, ["organizationId", this.chooseBusinessPage.value.organizationName]);
      let OrgList = _.find(this.organizationList, ["organizationId", this.chooseBusinessPage.value.organizationName]);
      this.seletedOrgnazationId = null;
      this.organizationList.forEach(ele => {

        if (ele.organizationId == this.chooseBusinessPage.value.organizationName) {

          // existing Business check
          if (existsBusiness != undefined) {

            const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
              },
              buttonsStyling: false
            })

            swalWithBootstrapButtons.fire({
              title: 'Business page exists already',
              text: "Do you want to create a new business page with a different location?",
              icon: 'info',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {

                var obj: any = {}
                obj.organizationId = ele.organizationId;
                obj.businessName = ele.organizationName;
                obj.zipCode = ele.zipCode;
                obj.city = ele.city;
                obj.state = ele.state;
                obj.country = ele.country;
                obj.value = true;
                obj.street = ele.street && ele.street !== null ? ele.street : null;
                obj.referenceId = ele.businessId;

                this.util.startLoader()
                setTimeout(() => {
                  this.router.navigate(['createBusiness'], { skipLocationChange: true, queryParams: obj })
                }, 1000);
                this.util.stopLoader()

              } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.chooseBusinessPage.reset();
                // swalWithBootstrapButtons.fire(
                //   'Cancelled',
                //   'Business not Created :)',
                //   'error'
                // )
                // Swal.fire({
                //   position: 'center',
                //   icon: 'info',
                //   title: 'Business not created',
                //   showConfirmButton: false,
                //   timer: 3000,
                //   allowOutsideClick: false,
                // })

              }
            })


          }    // pending business
          else if (pendingBussiness != undefined) {

            const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
              },
              buttonsStyling: false
            })

            swalWithBootstrapButtons.fire({
              title: 'Pending business verification ',
              text: "Do you want to verify your business page now?",
              icon: 'info',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {

                var obj: any = {}
                obj.organizationId = ele.organizationId;
                obj.businessName = ele.organizationName;
                obj.zipCode = ele.zipCode;
                obj.city = ele.city;
                obj.state = ele.state;
                obj.country = ele.country;
                obj.value = true;
                obj.street = ele.street && ele.street !== null ? ele.street : null;
                obj.referenceId = ele.businessId;
                this.util.startLoader();
                setTimeout(() => {
                  // this.router.navigate(['createBusiness'], { queryParams: obj })
                  this.router.navigate(['createBusiness'], { skipLocationChange: true, queryParams: obj })

                }, 1000);
                this.util.stopLoader()

              }
              // else if (result.dismiss === Swal.DismissReason.cancel) {
              //   this.chooseBusinessPage.reset();
              //   // swalWithBootstrapButtons.fire(
              //   //   'Cancelled',
              //   //   'Business not Created :)',
              //   //   'error'
              //   // )

              //   Swal.fire({
              //     position: 'center',
              //     icon: 'info',
              //     title: 'Business page not created',
              //     showConfirmButton: false,
              //     timer: 3000,
              //     allowOutsideClick: false,
              //   })
              // }
            })

          }   //   new business  create
          else {
            var obj: any = {}
            obj.organizationId = ele.organizationId;
            obj.businessName = ele.organizationName
            obj.zipCode = ele.zipCode
            obj.city = ele.city
            obj.state = ele.state
            obj.country = ele.country
            obj.street = ele.street &&
              ele.street !== null ? ele.street : null

            this.util.startLoader()
            setTimeout(() => {
              // this.router.navigate(['createBusiness'], { queryParams: obj })
              this.router.navigate(['createBusiness'], { skipLocationChange: true, queryParams: obj })

            }, 1000);
            this.util.stopLoader()
          }


        }
      })
    } else {


      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Please select a valid organization',
        // showConfirmButton: true,
        showConfirmButton: false,
        timer: 3000,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.chooseBusinessPage.reset();
        }
      })



    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      if (sortOrder == -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    }
  }

  domainForm: UntypedFormGroup
  userPossibilityStatusForOrgList: string
  get domainControl() {
    return this.domainForm.controls
  }
  busListToShow: Array<HealthCareOrganization> | any;
  BusniessCreatePage() {
    this.isButtonDisabled=false;
    var id: any = localStorage.getItem('userId')
    this.util.startLoader()

    this.api.query('business/check/orgname/' + id).subscribe(res => {

      this.util.stopLoader()
      if (res.code == '10000') {

        Swal.fire({
          title: 'Invalid user ID',
          text: 'Sorry there! The user ID seems to be invalid.',
          icon: 'error',
          showDenyButton: false,
          confirmButtonText: `ok`,

        }).then((result) => {

          if (result.isConfirmed) {

          }
        });
      } else if (res.code == '10001') {

        Swal.fire({
          title: 'Invalid user',
          text: 'Sorry there! There is no such user present.',
          icon: 'error',
          showDenyButton: false,
          confirmButtonText: `ok`,

        }).then((result) => {

          if (result.isConfirmed) {

          }
        });
      } else if (res.code == '10002') {

        Swal.fire({
          text: 'Work experience is required for creating a business page. It seems you have not provided any. Please create one in your profile.',
          title: 'Work Experience is required',
          icon: 'info',
          showDenyButton: false,
          confirmButtonText: `ok`,

        }).then((result) => {

          if (result.isConfirmed) {

          }
        });
      } else if (res.code == '10003') {

        Swal.fire({
          title: 'Current Organization is required',
          text: 'You need a business organization where you should be currently working for creating a Business Page. Please go to Profile > Add Work Experience > Check the Current Organization check-box.',
          icon: 'info',
          showDenyButton: false,
          confirmButtonText: `ok`,

        }).then((result) => {

          if (result.isConfirmed) {

          }
        });
      } else if (res.code == '10004') {

        var obj: any = {}

        obj.businessName = res.data.organisation.organizationName
        obj.zipCode = res.data.organisation.zipCode
        obj.organizationType = res.data.organisation[0].organizationType
        obj.city = res.data.organisation.city
        obj.state = res.data.organisation.state
        obj.country = res.data.organisation.country
        obj.street = res.data.organisation.street && res.data.organisation.street !== null ? res.data.organisation.street : null
        obj.orgId = res.data.organisation.organizationId;
        setTimeout(() => {
          this.router.navigate(['createBusiness'], { queryParams: obj })

        }, 400);
      } else if (res.code == '10005') {

        Swal.fire({

          title: "Business page exists",
          text: "There already exists a business page, which has not been verified as yet.",
          showDenyButton: false,
          confirmButtonText: `ok`,
          icon: 'info',

        }).then((result) => {

          if (result.isConfirmed) {

          }
        });
      } else if (res.data.organisation.length > 0) {

        if (res.code === '10008') {
          this.userPossibilityStatusForOrgList = "Your domain already has a business page, you may either follow or view the business page."
          this.busListToShow = res.data.organisation.filter((orgList) => orgList.businessActivationStatus !== GigsumoConstants.OPEN)
          if (this.busListToShow.length > 0) {
            this.checkWheatherToRedirectOrCreateBus(this.busListToShow);
          } else {
            this.busListToShow = res.data.organisation
            if (res.data.businessExist.status == GigsumoConstants.ACTIVE
              && res.data.businessExist.verified == GigsumoConstants.VERIFIED) {
              this.redirectToBusinesPage(res.data.businessExist)
            } else if (res.data.businessExist.status == GigsumoConstants.INACTIVE
              && res.data.businessExist.verified == GigsumoConstants.VERIFIED) {
              this.contactAdminForBusiness();
            } else if (res.data.businessExist.status == GigsumoConstants.ACTIVE
              && res.data.businessExist.verified == GigsumoConstants.NOT_VERIFIED) {
              this.unverifiedBusinessPopUp(res.data.businessExist);
            } else if (res.data.businessExist.status == GigsumoConstants.OPEN
              && this.busListToShow.length > 1) {
              this.isModalShown = true
              this.organizationList = res.data.organisation;
              this.chooseBusinessPage = this.formBuilder.group({
                organizationName: [null, [Validators.required]]
              })
            } else if (res.data.businessExist.status == GigsumoConstants.OPEN
              && this.busListToShow.length == 1) {
              this.createBusinesss(res.data.businessExist)
              // this.redirectToBusinesPage(res.data.businessExist)
            }
            else {
              this.nonActiveBusinessPopUp();
            }
          }

        } else {

          this.userPossibilityStatusForOrgList = "Choose the organisation"
          this.busListToShow = []
          this.busListToShow = res.data.organisation
          this.checkWheatherToRedirectOrCreateBus(this.busListToShow)
        }

      } else if (res.data.businessData != undefined && res.data.businessData.status == "VERIFIED" || res.code == "10008") {
        if (res.data.businessExist.status == "ACTIVE" || res.data.businessExist.verified == "VERIFIED") {
          this.redirectToBusinesPage(res.data.businessExist)
        } else {
          this.nonActiveBusinessPopUp()
        }

      } else if (res.code == "10008" || res.data.businessData != undefined && res.data.businessData.status == "INITIATED") {
        Swal.fire({
          title: "Business Page Pending Verification",
          text: "There is already a business page created for your organization that is pending verification.",
          icon: 'info',
          // showDenyButton: true,
          // showCancelButton: true,
          // reverseButtons: true,
          showConfirmButton: true,

          // cancelButtonText: 'Cancel',
          // denyButtonText: 'Create',
          confirmButtonText: 'Ok',


        }).then((result) => {
          if (result.isConfirmed) {

          }
        })
      } else if (res.code == "10008" || res.data.businessData != undefined && res.data.businessData.status == "INACTIVE") {
        Swal.fire({
          title: "Business Page Deactivated",
          text: "There is a business page already existing for your organization. However, it has been deactivated. The super admin of the business page has to activate it for using the business page.",
          icon: 'info',
          // showDenyButton: true,
          // showCancelButton: true,
          // reverseButtons: true,
          showConfirmButton: true,

          // cancelButtonText: 'Cancel',
          // denyButtonText: 'Create',
          confirmButtonText: 'Ok',


        }).then((result) => {
          if (result.isConfirmed) {

          }
        })
      } else if (res.code == "10008" || res.data.businessData != undefined && res.data.businessData.status == "ACTIVE") {
        Swal.fire({
          title: "Business Page Exists Already",
          text: "There is a business page already existing for your organization. Please, click the 'Redirect' button to visit the business page.",
          icon: 'info',
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Redirect',


        }).then((result) => {
          if (result.isConfirmed) {
            var obj1 = res.data.businessData
            this.router.navigate(["business"], { queryParams: obj1 });
          }
        })
      } else if (res.code == "10008" && res.data.businessExist != undefined && res.data.businessExist.status == "INITIATED") {
        Swal.fire({
          title: "Business Page Pending Verification",
          text: "There is already a business page created for your organization that is pending verification.",
          icon: 'info',
          // showDenyButton: true,
          // showCancelButton: true,
          // reverseButtons: true,
          showConfirmButton: true,

          // cancelButtonText: 'Cancel',
          // denyButtonText: 'Create',
          confirmButtonText: 'Ok',


        }).then((result) => {
          if (result.isConfirmed) {

          }
        })
      } else if (res.code == "10008" || res.data.businessExist != undefined && res.data.businessExist.status == "INACTIVE") {
        Swal.fire({
          title: "Business Page Deactivated",
          text: "There is a business page already existing for your organization. However, it has been deactivated. The super admin of the business page has to activate it for using the business page.",
          icon: 'info',
          // showDenyButton: true,
          // showCancelButton: true,
          // reverseButtons: true,
          showConfirmButton: true,

          // cancelButtonText: 'Cancel',
          // denyButtonText: 'Create',
          confirmButtonText: 'Ok',


        }).then((result) => {
          if (result.isConfirmed) {

          }
        })
      } else if (res.code == "10008" || res.data.businessExist != undefined && res.data.businessExist.status == "ACTIVE") {
        Swal.fire({
          title: "Business Page Exists Already",
          text: "There is a business page already existing for your organization. Please, click the 'Redirect' button to visit the business page.",
          icon: 'info',
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Redirect',


        }).then((result) => {
          if (result.isConfirmed) {
            let data: any = {}
            data = res.data.businessExist.businessId
            this.router.navigate(["business"], { queryParams: data });
          }
        })
      } else if (res.code == "10008" && res.data.businessExist != undefined && res.data.businessExist.businessStatus == "VERIFIED") {
        Swal.fire({
          title: "Business Page Already Exists",
          text: "You current organization already has a business page.",
          showDenyButton: false,
          icon: "info",
          confirmButtonText: `ok`,
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      } else if (res.code == '00000') {

        this.organizationList = res.data.organisation;
        this.businessExistList = res.data.businessExist;
        this.businessPendingList = res.data.businessPending;

        if (this.organizationList.length == 0) {
          Swal.fire({
            title: 'Work Experience Required',
            text: 'You need to have a work experience to create a business page. Go to profile > click on + icon at work experience > choose current organization and save to proceed.',
            icon: 'question',
            showDenyButton: false,
            confirmButtonText: `ok`,
          }).then((result) => {
            if (result.isConfirmed) {

            }
          });

          return;
        } else if (this.organizationList.length == 1 && this.businessExistList.length == 0 && this.businessPendingList.length == 0) {
          if (res.data.organisation[0].city == null || res.data.organisation[0].state == null || res.data.organisation[0].country == null || res.data.organisation[0].zipCode == null) {
            Swal.fire({
              title: 'Location is Required',
              text: 'Please, provide city, state, zip code, and country in your work experience to create a business page.',
              icon: 'question',
              showDenyButton: false,
              confirmButtonText: `ok`,
            }).then((result) => {
              if (result.isConfirmed) {

              }
            });
          } else {
            const organisation = res.data.organisation
            this.createBusinesss(organisation)

          }

        } else if (this.organizationList.length > 0 && this.businessExistList.length > 0) {
          Swal.fire({
            title: "Business Page Exists Already",
            text: "There is a business page already existing for your organization. Please, click the 'Redirect' button to visit the business page.",
            icon: 'info',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Redirect',


          }).then((result) => {
            if (result.isConfirmed) {
              var obj1 = res.data.businessExist[0]
              this.router.navigate(["business"], { queryParams: obj1 });
            }
          })
        } else if (this.organizationList.length > 1) {
          // && this.businessExistList == 0 && this.businessPendingList == 0
          this.isModalShown = true
          this.organizationList = res.data.organisation;
          ////// console.log(this.organizationList)
          this.chooseBusinessPage = this.formBuilder.group({
            organizationName: [null, [Validators.required]]
          })
        }




      } else if (res.code == '99999') {
      }
    }, err => {
      this.util.stopLoader();
    });

  }

  createBusinesss(organisation: Array<HealthCareOrganization> | HealthCareOrganization | any) {
    const result = Array.isArray(organisation);
    const obj: any = {}
    // console.log("connt",typeof organisation ,organisation instanceof Object)

    obj.city = result ? organisation[0].city : organisation.city
    obj.state = result ? organisation[0].state : organisation.state;
    obj.country = result ? organisation[0].country : organisation.country;
    obj.zipCode = result ? organisation[0].zipCode : organisation.zipCode;
    obj.organizationId = (result ? organisation[0].organizationId : organisation.organizationId) || (result ? organisation[0].organisationId : organisation.organisationId)
    obj.businessId = result ? organisation[0].businessId : organisation.businessId
    obj.businessName = result ? organisation[0].organizationName : (organisation.organizationName || organisation.businessName)
    obj.businessId = result ? organisation[0].businessId : organisation.businessId
    obj.organizationType = result ? organisation[0].organizationType : organisation.organizationType
    obj.address1 = result ? organisation[0].address1 : organisation.address1
    obj.address2 = result ? organisation[0].address2 : organisation.address2
    obj.street = result ? (organisation[0].street && organisation[0].street !== null ? organisation[0].street : null) : (organisation.street && organisation.street !== null ? organisation.street : null)
    if (this.modalRef) {
      this.closeModal()
    }
    setTimeout(() => {
      this.router.navigate(['createBusiness'], { queryParams: obj })
    }, 500);
  }

  checkWheatherToRedirectOrCreateBus(BusList: Array<HealthCareOrganization> | any) {
    this.isButtonDisabled=false;
    if (BusList.length === 1) {
      if (BusList[0].businessActivationStatus === GigsumoConstants.OPEN) {
        this.createBusinesss(BusList)
      } else if (BusList[0].businessActivationStatus === GigsumoConstants.ACTIVE
        && BusList[0].businessStatus === GigsumoConstants.VERIFIED) {
        this.redirectToBusinesPage(BusList[0])
      } else if (BusList[0].businessActivationStatus == GigsumoConstants.INACTIVE
        && BusList[0].businessStatus == GigsumoConstants.VERIFIED) {
        this.contactAdminForBusiness();
      } else if (BusList[0].businessActivationStatus == GigsumoConstants.ACTIVE
        && BusList[0].businessStatus == GigsumoConstants.PENDING) {
        this.unverifiedBusinessPopUp(BusList[0]);
      } else if (BusList[0].businessActivationStatus == GigsumoConstants.BLOCKED) {
        this.blockedBusinessPopUp();
      }
      else {
        this.nonActiveBusinessPopUp()
      }
    } else if (BusList.length > 1) {
      this.busListToShow = BusList
      this.modalRef = this.modalService.show(this.currentOrganizationList, this.backdropConfig)
      this.isButtonDisabled = true

    }



  }

  checkBusinessStatus(currentOrg) {

    if (currentOrg.businessActivationStatus === GigsumoConstants.OPEN) {
      this.createBusinesss(currentOrg)
    } else if (currentOrg.businessActivationStatus === GigsumoConstants.ACTIVE || currentOrg.businessActivationStatus === GigsumoConstants.VERIFIED) {
      this.redirectToBusinesPage(currentOrg)
    } else {
      this.nonActiveBusinessPopUp()
    }


  }

  redirectToBusinesPage(currentOrg: HealthCareOrganization | any) {

    Swal.fire({
      title: "Business page exists already",
      text: "There already exists a business page for your business email. Please click 'Redirect' to visit the page or click cancel.",
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Redirect',

    }).then((result) => {

      if (result.isConfirmed) {
        if (this.modalRef) {
          this.closeModal()
        }
        let data: any = {}
        data.businessId = currentOrg.businessId
        this.router.navigate(["business"], { queryParams: data });

      } else if (result.dismiss) {


      }
      // else if (result.isDenied) {
      //   setTimeout(() => {
      //     var object: any = {}
      //     object.value = 'create'
      //     object.businessName = res.data.business.businessName
      //     this.router.navigate(['createBusiness'], { queryParams: object })
      //   }, 400);
      // }
    })
  }

  contactAdminForBusiness() {
    Swal.fire({
      title: "The business page is deactivated",
      text: "The business page you are trying to create has already been created by an user and had been deactivated. Please contact the support.",
      showDenyButton: false,
      confirmButtonText: `ok`,
      icon: 'info',
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  nonActiveBusinessPopUp() {
    Swal.fire({
      title: "Business page is currently not active",
      text: "The business page associated with your email domain is currently inactive. Please, contact admin to proceed.",
      showDenyButton: false,
      confirmButtonText: `ok`,
      icon: 'info',
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  blockedBusinessPopUp() {
    Swal.fire({
      title: "Business page is blocked",
      text: "The business page you are trying to create is already existing and has been blocked by the platform. Please contact the support.",
      showDenyButton: false,
      confirmButtonText: `ok`,
      icon: 'info',
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  unverifiedBusinessPopUp(value) {
    let businessName: any;
    if (value.businessName) {
      businessName = value.businessName;
    } else {
      businessName = value.organizationName
    }
    Swal.fire({
      title: "Business page exists",
      text: "There already exists a business page, " + "'" + businessName + "'" + " for your email domain, which has not been verified yet. ",
      showDenyButton: false,
      confirmButtonText: `ok`,
      icon: 'info',
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  onHidden(): void {
    this.isModalShown = false;
    this.formValidity = false;
  }

  hideModal(): void {
    this.autoShownModal.hide();
    this.isButtonDisabled = false;
  }


  onUnfollow(event: any): void {
    if (event != undefined && event != null) {
      this.businessdetail = this.businessdetail.filter(element => element.businessId != event.businessId);
      this.tempbusinessdetail = this.businessdetail;

    }
  }

  closeModal() {
    this.modalRef.hide()
    this.isButtonDisabled = false;
  }


  currentYear: any = new Date().getFullYear();
  workSaveFlag: boolean = false;
  searchBarShow1: boolean = false
  uniqueOrgList: Array<Partial<HealthCareOrganization>> = [];
  searchBarShow = false;
  timezoneslist: any = []
  commonVariables: any = {};
  yearIndex: any;
  yearData: any;
  profileyears: any = []
  candidateJobTitleList: any = []
  clientType: any;
  recruiterTitleList: Array<string> | any = []



  getOrganization(clientType: string = null) {

    this.eperienceForm = this.formBuilder.group({
      workExperience: this.formBuilder.array([])
    })
    this.workExperience = this.eperienceForm.get("workExperience") as UntypedFormArray;
    this.workExperience.push(this.createWorkExperience());
    if (this.workExperience.controls[0].get('timeZone') != null && this.userType == "JOB_SEEKER") {
      this.workExperience.controls[0].get('timeZone').clearValidators()
      this.workExperience.controls[0].get('timeZone').updateValueAndValidity()
    }
    this.workExperience.at(0).get('clientType').patchValue(clientType);
    this.util.stopLoader()

  }


  createWorkExperience(): UntypedFormGroup {

    return this.formBuilder.group({
      currentOrganization: [true],
      organisationName: [
        null, [Validators.required, CustomValidator.checkWhiteSpace(),
        CustomValidator.max(this.ORGANIZATION_NAME.max)]
      ],
      clientType: [null, [Validators.required]],
      action: [null],
      businessId: [null],
      expId: [null],
      userId: [this.userId],
      badge: [true],
      organisationId: [null],
      timeZone: [null, [Validators.required]],
      title: [null, [Validators.required]],
      state: [null, [Validators.required, CustomValidator.max(this.STATE.max)]],
      zipcode: [null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]],
      city: [null, [Validators.required, CustomValidator.max(this.CITY.max)]],
      country: [null, [Validators.required]],
      startMonth: [null, [Validators.required]],
      startYear: [this.currentYear, [Validators.required]],
      // endMonth: [null, [Validators.required]],
      // endYear: [this.currentYear, [Validators.required]],

    });
  }


  getOrgList(value) {
    if (value != null) {
      const orgList: Array<Partial<HealthCareOrganization>> = [];
      this.api.query("care/organizations?organizationName=" + this.workExperience.value[0].organisationName)
        .pipe(debounceTime(500))
        .subscribe((res) => {
          if (res) {
            res.forEach(ele => {
              var obj: any = {}
              obj.organizationId = ele.organizationId;
              obj.organizationName = ele.organizationName;
              obj.city = ele.city;
              obj.zipCode = ele.zipCode;
              obj.address1 = ele.address1;
              obj.address2 = ele.address2;
              obj.state = ele.state;
              obj.country = ele.country;
              obj.countryName = ele.countryName;
              obj.street = ele.street && ele.street !== null ? ele.street : null;
              orgList.push(obj);
            })
            const uniqueList = new Set(orgList);
            this.uniqueOrgList = Array.from(uniqueList);
          }

        }, err => {
          this.util.stopLoader();

        });
      this.searchBarShow1 = true;
    } else {
      this.searchBarShow1 = false
    }
  }

  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if (pastedText != null) {
      this.util.startLoader();
      this.api.query("care/organizations?organizationName=" + pastedText)
        .pipe(debounceTime(2000))
        .subscribe((res) => {
          this.util.stopLoader();
          if (res) {
            this.util.stopLoader();
            const orgList: Array<Partial<HealthCareOrganization>> = [];
            // this.orgList = [];
            res.forEach(ele => {
              var obj: any = {}
              obj.organizationId = ele.organizationId;
              obj.organizationName = ele.organizationName;
              obj.city = ele.city;
              obj.address1 = ele.address1;
              obj.zipCode = ele.zipCode;
              obj.address2 = ele.address2;
              obj.state = ele.state;
              obj.country = ele.country;
              obj.countryName = ele.countryName;
              obj.street = ele.street && ele.street !== null ? ele.street : null;
              orgList.push(obj);
            })
            const uniqueList = new Set(orgList);
            this.uniqueOrgList = Array.from(uniqueList);
          }
        }, err => {
        });
      this.searchBarShow = true;
    } else {
      this.searchBarShow = false
    }
  }


  onChangeCountrypatchvalue(event, value, index) {
    if (value == "work") {
      this.workExperience.controls[index].patchValue({
        state: null,
        zipcode: null,
        city: null,

        country: event,
      });
      this.workExperience.controls.forEach((ele) => {
        ele.get("state").setValidators([Validators.required]);
        ele.get("state").updateValueAndValidity();
      });
    }

    if (event == "United States") {

    } else if (event == "AU") {
      const countryCode = event;
      this.stateListAU = [];
      this.util.startLoader();
      this.api
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListAU = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "IN") {
      const countryCode = event;
      this.stateListIN = [];
      this.util.startLoader();
      this.api
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListIN = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "CA") {
      const countryCode = event;
      this.stateListCA = [];
      this.util.startLoader();
      this.api
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListCA = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else {

    }
  }

  timeZonecountryvalues(countryCode) {

    this.workExperience.controls[0].get("timeZone").patchValue(null);
    this.api.query("user/timeZoneByCountryCode/" + countryCode).subscribe((res) => {

      if (res) {
        this.util.stopLoader();
        this.timezoneslist = res.data.zones;
      }

    }, err => {
      this.util.stopLoader();
    });

  }


  onChngOrg1(value, index) {

    var data = value.organizationName + "/" + value.organizationId;
    this.util.startLoader();
    this.api.query("care/organization/" + data).subscribe((res) => {

      if (res) {
        this.workExperience.controls[index].get('timeZone').enable()
        this.timeZonecountryvalues(res[0].countryCode);
        if (res[0].businessId) {

          this.workExperience.controls[index].get('country').disable()
          this.workExperience.controls[index].get('city').disable()
          this.workExperience.controls[index].get('state').disable()
          this.workExperience.controls[index].get('zipcode').disable()
          this.util.startLoader();
          this.api.query("business/details/" + res[0].businessId).subscribe((res) => {
            if (res.code == '00000') {

              this.util.stopLoader();
              if (res.data.businessModelList[0].organizationType && res.data.businessModelList[0].organizationType != null) {
                this.workExperience.controls[index].get('clientType').disable()
              } else {
                this.workExperience.controls[index].get('clientType').enable()
              }

              this.onChangeCountrypatchvalue(res.data.businessModelList[0].companyLocationDetails[0].country, 'work', index)
              setTimeout(() => {
                this.workExperience.controls[index].patchValue({
                  clientType: res.data.businessModelList[0].organizationType,
                  country: res.data.businessModelList[0].companyLocationDetails[0].country,
                  city: res.data.businessModelList[0].companyLocationDetails[0].city,
                  state: res.data.businessModelList[0].companyLocationDetails[0].state,
                  zipcode: res.data.businessModelList[0].companyLocationDetails[0].zipCode
                })
              }, 500);
            } else {

              this.util.stopLoader();
              this.workExperience.controls[index].get('clientType').enable()
              this.workExperience.controls[index].get('country').enable()
              this.workExperience.controls[index].get('city').enable()
              this.workExperience.controls[index].get('state').enable()
              this.workExperience.controls[index].get('zipcode').enable()
              this.workExperience.controls[index].patchValue({
                clientType: null,
                country: null,
                city: null,
                state: null,
                zipcode: null
              })
            }
          }, err => {

            this.util.stopLoader();
            this.workExperience.controls[index].get('clientType').enable()
            this.workExperience.controls[index].get('country').enable()
            this.workExperience.controls[index].get('city').enable()
            this.workExperience.controls[index].get('state').enable()
            this.workExperience.controls[index].get('zipcode').enable()
            this.workExperience.controls[index].patchValue({
              clientType: null,
              country: null,
              city: null,
              state: null,
              zipcode: null
            })
          })

        } else {

          // this.onChangeCountry(value.country, '');
          this.workExperience.controls[index].get('clientType').enable()
          this.workExperience.controls[index].get('country').enable()
          this.workExperience.controls[index].get('city').enable()
          this.workExperience.controls[index].get('state').enable()
          this.workExperience.controls[index].get('zipcode').enable()
          this.workExperience.controls[index].patchValue({
            clientType: null,
            country: value.country,
            city: value.city,
            state: value.state,
            zipcode: value.zipCode
          })
        }
      }

      setTimeout(() => {
        var data: any = {}
        data.userId = this.userId
        data.businessId = value.businessId
        data.organisationId = value.organizationId
        this.api.create('business/find/superadmin', data).subscribe(res => {
          if (res.code == '0000') {
            this.util.stopLoader()
            this.workExperience.controls[0].get("city").disable()
            this.workExperience.controls[0].get("state").disable()
            this.workExperience.controls[0].get("country").disable()
            this.workExperience.controls[0].get("zipcode").disable()
          } else {
            this.util.stopLoader()
          }
        })
      }, 500);
    }, err => {
      this.util.stopLoader();
    });

  }

  getWorkFormGroup(index): UntypedFormGroup {
    const formGroup = this.workExperience.controls[index] as UntypedFormGroup;
    return formGroup;
  }



  curOrg(event, index) {

    if (event.target.checked == true) {

      this.workExperience.controls[index].patchValue({
        currentOrganization: true,
      });
      this.workExperience.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.workExperience.controls[index].patchValue({ endMonth: null });

      this.workExperience.controls.forEach((ele) => {
        ele.get("endYear").clearValidators();
        ele.get("endYear").updateValueAndValidity();
        ele.get("endMonth").clearValidators();
        ele.get("endMonth").updateValueAndValidity();
      });
    } else if (event.target.checked == false) {

      this.workExperience.controls[index]
        .get("currentOrganization")
        .markAsUntouched();
      this.workExperience.controls[index]
        .get("currentOrganization")
        .updateValueAndValidity();

      this.workExperience.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.workExperience.controls[index].patchValue({ endMonth: null });

      this.workExperience.controls.forEach((ele) => {
        ele.get("endMonth").setValidators([Validators.required]);
        ele.get("endMonth").updateValueAndValidity();
        ele.get("endYear").setValidators([Validators.required]);
        ele.get("endYear").updateValueAndValidity();
      });

      this.workExperience.controls[0]
        .get("badge")
        .setErrors({ checkIfChecked: true });
    }

  }


  showThis(event, i) {

    if (event.target.checked == true) {

      this.commonVariables.noOrgSelected = false;
      this.searchData.setCommonVariables(this.commonVariables);
    } else if (event.target.checked == false) {
      this.commonVariables.noOrgSelected = true;
      this.searchData.setCommonVariables(this.commonVariables);
    }

  }

  onChangeCountryorg(event, value, index) {

    if (value == "work") {
      this.workExperience.controls[index].patchValue({
        state: null,
        zipcode: null,
        city: null,
        country: event,
      });
      this.workExperience.controls.forEach((ele) => {
        ele.get("state").setValidators([Validators.required]);
        ele.get("state").updateValueAndValidity();
      });
    }
    if (event == "United States") {
    } else if (event == "AU") {
      const countryCode = event;
      this.stateListAU = [];
      this.util.startLoader();
      this.api
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListAU = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "IN") {
      const countryCode = event;
      this.stateListIN = [];
      this.util.startLoader();
      this.api
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListIN = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "CA") {
      const countryCode = event;
      this.stateListCA = [];
      this.util.startLoader();
      this.api
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListCA = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else {
    }
    const countryCode = event;
    if (event != null && this.eperienceForm != undefined) {

      this.workExperience.controls[0].get("timeZone").enable();
    }
    this.timeZonecountryvalues(countryCode);

  }


  onKeyZip(event: any, param, index) {

    let data: any = {};
    data.countryCode = "US";
    data.zipCode = event.target.value;
    data.stateCode = "";
    if (data.zipCode.length === 5) {
      this.api.create("country/geodetails", data).subscribe((res) => {
        if (
          res &&
          res != null &&
          res != "" &&
          res.length > 0 &&
          event.target.value != ""
        ) {
          res.forEach((ele) => {
            let cityName = ele.cityName;
            let stateName = ele.stateName;
            // if (param == 'job') {
            //   this.jobPostForm.patchValue({
            //     city: cityName,
            //     state: stateName,
            //   });
            // } else if (param == 'candidate') {
            //   this.candidatePostForm.patchValue({
            //     city: cityName,
            //     state: stateName,
            //   });
            // }
            if (param == 'work') {
              this.workExperience.controls[0].patchValue({
                city: cityName,
                state: stateName,
              });
            }
          });
        }
      });
    } else if (data.zipCode.length < 5 || data.zipCode.length > 5) {

    }

  }
  digitKeyOnly(e) {

    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;

  }


  monthChange(index, val) {

    if (val == "exp") {
      var a: any = this.workExperience.value[index].startYear;
      var b: any = this.workExperience.value[index].endYear;
      if (a == b) {
        this.workExperience.controls[index].patchValue({
          endMonth: null,
        });
      }
    } else if (val == "edu") {

    }

  }

  checkMonth1(m, i, val) {

    if (val == "exp") {
      var n = new Date().getMonth();
      var maxYear = new Date().getFullYear();
      var maxMonth = n + 1;
      var monthCode = m;
      let startYear = parseInt(this.workExperience.value[i].startYear);
      if (startYear == maxYear) {
        if (monthCode > maxMonth) {
          return true;
        } else {
          return false;
        }
      }
    }

  }

  yearChange(index, event, val, par) {

    if (val == "exp") {
      var stYr = parseInt(this.workExperience.value[index].startYear);
      var maxYr = new Date().getFullYear();
      if (stYr == maxYr) {
        this.workExperience.controls[index].patchValue({ startMonth: null });
      }
      this.yearData = event.target.value;
      this.yearIndex = index;
      this.workExperience.controls[index].patchValue({
        endYear: this.currentYear,
        endMonth: null,
      });
    }

  }

  saveWorkExperience() {

    this.workSaveFlag = true

    if (this.eperienceForm.valid) {
      this.currentOrg = true;

      this.util.startLoader();
      this.api.create("user/v1/workexperience", this.workExperience.getRawValue()[0]).subscribe((res) => {
        if (res.code == '00000') {
          this.util.stopLoader();
          localStorage.setItem("currentOrganization", this.workExperience.getRawValue()[0].organisationName)
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Work Experience added successfully",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {


            //credit validation

            var profiledata: any = {};
            profiledata.userId = localStorage.getItem('userId')
            profiledata.userType = localStorage.getItem('userType')
            this.util.startLoader()
            this.api.create('user/profileDetails', profiledata).subscribe(res => {
              this.util.stopLoader()
              if (res.code == '00000') {
                let element: any = {}
                this.modalRef.hide()
                this.BusniessCreatePage()
                //if(values.clientType=='Internal Hire'){

                // if (this.currentEntity == 'JOBS') {
                //   element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_JOB)
                // } else if (this.currentEntity == 'CANDIDATE') {
                //   element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_CANDIDATE)
                // }


                // if (res.data.creditPoints >= element.points || localStorage.getItem('userType') == 'student' || this.userType == 'JOB_SEEKER') {
                //   if (this.currentEntity == 'JOBS') {
                //     this.createJobs();
                //   } else if (this.currentEntity == 'CANDIDATE') {
                //     this.createCandidate()
                //   }

                // } else {
                //   this.commonVariables.creditFlag = true
                //   this.redirectToCreditPage();
                //   this.commonVariables.educationFlag = false
                //   this.commonVariables.workExperienceFlag = false
                //   this.commonVariables.jobPostingFlag = false
                //   this.commonVariables.candidatePostingFlag = false
                //   this.commonVariables.postPrivacyFlag = false
                //   this.commonVariables.emailDomainValidation = false
                // }

              }
            })
          })
        }
      })
    }
  }
  generateYearsprofile() {

    var max = new Date().getFullYear();
    var min = max - 80;
    for (var i = min; i <= max; i++) {
      this.profileyears.push(i);
    }

  }


  addWorkExperience(clientType: string = null) {
    this.generateYears1()
    this.getCountries()
    this.generateYearsprofile()
    this.clientTypeList = []
    this.candidateJobTitleList = []
    this.recruiterTitleList = []
    var data = { "domain": "CLIENT_TYPE,PAY_TYPE,GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST" }
    this.api.create('listvalue/findbyList', data).subscribe(res => {
      if (res.code == '00000') {
        res.data.CLIENT_TYPE.listItems.forEach(ele => {
          // if (this.clientType == "Direct Client" && ele.item == "Direct Client") {
          //   ele.item = "Client";
          // }
          this.clientTypeList.push(ele.item);
        })

        /** This 2 lines used for job seeker , but job seeker canot create business for now */
        // res.data.GIGSUMO_JOB_TITLE.listItems.forEach(ele => {
        //   this.candidateJobTitleList.push(ele.item)
        // })

        res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
          this.recruiterTitleList.push(ele.item)

        })


        this.getOrganization(clientType)

      }
    })

  }

  generateYears1() {

    this.years1 = []
    var max = new Date().getFullYear();
    var min = max - 80;
    for (var i = min; i <= max; i++) {
      this.years1.push(i);
    }

  }

  getCountries() {

    this.countryList = [];
    this.util.startLoader();
    this.api.query("country/getAllCountries").subscribe((res) => {
      res.forEach((ele) => {
        this.countryList.push(ele);
      });
    }, err => {
      this.util.stopLoader();
    });

  }

  messagemodelflag = false;
  messageData : any
  closeMessage(){
    this.messagemodelflag =  false;
  }

  updateSupportModule() {

    let module = new jobModuleConfig(this.openSupport);
    module.source = this;
    this.supportModal = module;
  }

  openSupport(){
    // this.closeModal();
      let data: any = {}
      data.userId = localStorage.getItem('userId');
      data.groupType = "SUPPORT";
      let url = "findContactsByRefererId";
      this.api.messagePageService('POST', url, data).subscribe(res => {

        var userData: any = {};
        userData.groupId = null;
        if (res.length != 0) {
          userData.groupId = null;
          if (res[0].groupId) {
            userData.groupId = res[0].groupId;
          }
        }
        this.messageData = [];
        this.messagemodelflag = true;
        this.messageData.onlySupport = "SUPPORT";
        this.messageData.groupType = "SUPPORT";
        this.messageData.messageType = "SUPPORT";
        this.messageData.userId = localStorage.getItem('userId');
        this.messageData.id = userData.groupId;
      });
   }


}
