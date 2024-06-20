import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CountdownComponent } from "ngx-countdown";
import { ApiService } from "src/app/services/api.service";
import { AppSettings } from "src/app/services/AppSettings";
import { BusinessModal } from "src/app/services/businessModal";
import { CommonValues } from "src/app/services/commonValues";
import { BUSINESS_STATUS_CODE, GigsumoConstants } from "src/app/services/GigsumoConstants";
import { GigsumoService } from "src/app/services/gigsumoService";
import { SearchData } from "src/app/services/searchData";
import { UtilService } from "src/app/services/util.service";
import { BusinessCard } from "src/app/types/BusinessCard";
import Swal from "sweetalert2";

@Component({
  selector: "app-business-card",
  templateUrl: "./business-card.component.html",
  styleUrls: ["./business-card.component.scss"],
})
export class BusinessCardComponent implements OnInit {
  @ViewChild("cd") private countdown: CountdownComponent;
  @Input()
  BusinessDataInput: BusinessCard;
  bData: any;
  siperAdmin: any;
  modalRef: BsModalRef;
  ShowButton: boolean = false;
  Showsuitcase: boolean = false;
  loggedInUser: any;
  userId: String;
  OTPConfirm: UntypedFormGroup;
  userType: String
  claimBusinesCard: boolean = false

  IndustryClassifications: any;
  @Output() onUnfollow = new EventEmitter();

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: UntypedFormBuilder,
    private util: UtilService,
    private commonvalues: CommonValues,
    private modalService: BsModalService,
    private searchData: SearchData,
    private gigsumoService: GigsumoService,
  ) { }

  ngOnInit() {

    this.userType = localStorage.getItem("userType");
    this.siperAdmin = localStorage.getItem("isSuperAdmin");
    this.loggedInUser = localStorage.getItem("userId");
    this.claimBusinesCard = this.BusinessDataInput.claimable === true ? (this.userType === 'JOB_SEEKER' ? true : false) : false
    this.getBusinessLogo();
    this.ShowAdminData();
    this.industryClassification();
    this.OTPConfirm = this.fb.group({
      otp: [null, [Validators.required, Validators.pattern(/^[^\s]*$/)]],
    });
  }

  get otpControl() {
    return this.OTPConfirm.controls;
  }

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
  };

  businessData: any;
  offlineVerificationFlag: boolean = false;
  verifyBusiness(template: TemplateRef<any>, data) {
    // //// console.log("data")
    // //// console.log(data)
    if (data.offlineVerification == false) {
      this.offlineVerificationFlag = false;
    } else if (data.offlineVerification == true) {
      this.offlineVerificationFlag = true;
    }
    this.businessData = data;
    this.modalRef = this.modalService.show(template, this.backdropConfig);
  }

  disable: boolean = false;
  incorrectOtp: boolean = false;
  otpExpiredFlag: boolean = false;

  onKeyDown() {
    this.incorrectOtp = false;
  }
  navigate() {
    this.disable = true;
    if (this.OTPConfirm.valid) {
      let data: any = {};
      data.otp = this.OTPConfirm.value.otp;
      data.businessId = this.businessData.businessId;
      this.util.startLoader();
      this.api.AuthValidation("business/verify", data).subscribe((res) => {
        this.util.stopLoader();
        if (res.code == "00000") {
          this.modalRef.hide();
          this.commonvalues.businessid(this.businessData.businessId);
          localStorage.setItem("businessId", this.businessData.businessId);
          localStorage.setItem("isSuperAdmin", "true");
          let datum: any = {};
          datum.businessName = this.businessData.businessName;
          datum.businessId = this.businessData.businessId;
          datum.menu = "about";
          this.router.navigate(["business"], { queryParams: datum });
        } else if (res.code == "99999") {
          this.incorrectOtp = true;
        } else if (
          res.code == "85003" &&
          this.offlineVerificationFlag == false
        ) {
          // time expired
          this.otpExpiredFlag = true;
        }
      }, err => {
        this.util.stopLoader();

      });
    }
  }

  onTimeUp(event) {
    if (event.left == 0) {
      this.resendCodeFlag = false;
    }
  }

  resendCodeFlag: boolean = false;
  sendAnotherCode(businessId) {
    var data: any = {};
    data.businessId = businessId;
    this.util.startLoader();

    this.api.create("business/resendotp", data).subscribe((response) => {
      this.util.stopLoader();
      if (response.code == "00000") {
        // //// console.log('resend code send')
        this.resendCodeFlag = true;
        // this.countdown.begin()
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while sending another code. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  onHidden(): void {
    this.OTPConfirm.reset();
    this.modalRef.hide();
    this.disable = false;
    this.incorrectOtp = false;
    this.resendCodeFlag = false
    // this.onTimeUp(event)
    // this.otpExpiredFlag = false
    // this.resendCodeFlag = false
  }

  close() { }

  deactivate(data) {
    // console.log(data)
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to deactivate?",
        text: "You will still be able to retrieve the business page after by contacting Gigsumo admins via messages.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      }).then((result) => {

        if (result.isConfirmed) {
          this.checkSuperAdmin(data);
        }
      });
  }


  checkSuperAdmin(datas) {
    this.util.startLoader();
    let data = { userId: localStorage.getItem('userId'), organisationId: datas.organisationId };
    this.gigsumoService.isSuperAdmin(data).subscribe(Adminresponse => {
      if (Adminresponse && Adminresponse.code === GigsumoConstants.SUCESSCODE) {
        let businessCode: BUSINESS_STATUS_CODE =
          Adminresponse.data ? Adminresponse.data.businessStatusCode : (Adminresponse.data === null && "00000");
        const adminData: BusinessModal = Adminresponse.data ? Adminresponse.data.businessData : null;
        if (businessCode !== "10003" && adminData && adminData.status === GigsumoConstants.INACTIVE) {
          businessCode = "10003";
        }
        this.util.stopLoader();
        this.showInfoMessage({
          AdminData: adminData,
          content: businessCode
        }, datas);
      } else {
        this.util.stopLoader();
      }
    });
  }

  showInfoMessage(value: { AdminData: any, content: BUSINESS_STATUS_CODE }, datas) {
    value.content = value.content === "10003" ? "10000" : value.content;
    let data: "NO_MEMBER" | "HAS_MEMBER" | "NOTHING";
    data = (value.content === "10000" || value.content === "00000") ? "NOTHING" :
      value.content === "10001" ? "NO_MEMBER" : "HAS_MEMBER";

   if (data === "NO_MEMBER" || data === "NOTHING") {
    this.deacivateBusiness(datas);
  } else if (data === "HAS_MEMBER") {
    const response = this.gigsumoService.getResponseMessage("DEACTIVATED_BUSINESS", value.AdminData.businessName);
    if (response && response.then) {
      response.then(response => {
        if (response && response.isConfirmed) {
          let data: { businessId: string; businessName: string; menu: string } =
          {
            businessId: value.AdminData.businessId,
            businessName: value.AdminData.businessName,
            menu: "pageadmin"
          };
          this.router.navigate(["/business"], { queryParams: data, skipLocationChange: true });
        }
      });
    }
  }
}

  deacivateBusiness(data) {
    this.util.startLoader()
    let deactivateBusinessID = data.businessId;
    this.api
      .delete("business/remove/" + deactivateBusinessID)
      .subscribe((res) => {
        if (res.code === "00000") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Business page has been deactivated.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            var values: any = {}
            values.boolean = true
            this.searchData.setBooleanValue(values)
          });
        } else {
          this.util.stopLoader()
          Swal.fire({
            position: "center",
            icon: "info",
            text: "Something went wrong. Please, try after some time.",
            title: "Oops..",
            showConfirmButton: false,
            timer: 1500,
          })
        }
      }, err => {
        this.util.stopLoader();
      });
  }

  activate(data) {
    this.util.startLoader()
    let businessId = data.businessId;
    this.api
      .create("business/activate/" + businessId, null)
      .subscribe((res) => {
        if (res.code === "00000") {

          this.router.navigate(["landingPage/business"]);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Business page has been activated.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            var values: any = {}
            values.boolean = true
            this.searchData.setBooleanValue(values)
          });
        } else {
          this.util.stopLoader()
          Swal.fire({
            position: "center",
            icon: "info",
            title: "Oops..",
            text: "Something went wrong. Please, try again later.",
            showConfirmButton: false,
            timer: 1500,
          })
        }
      }, err => {
        this.util.stopLoader();
      });
  }

  claimBusiness(value) {

    this.router.navigate(['createBusiness'], { queryParams: value })
  }

  BusinessData(data, verifyTemplate) {

    if (this.BusinessDataInput.status) {
      if (this.BusinessDataInput.businessStatus === "VERIFIED" && this.BusinessDataInput.status == 'ACTIVE') {
        localStorage.setItem("businessId", data.businessId);
        localStorage.setItem("isSuperAdmin", data.isSuperAdmin);
        this.router.navigate(["business"], { queryParams: data });

      } else if (this.BusinessDataInput.businessStatus === "NOT VERIFIED") {
        if (this.BusinessDataInput.isSuperAdmin === true) {
          this.verifyBusiness(verifyTemplate, this.BusinessDataInput);
        }
      }
    }

    if (!this.BusinessDataInput.status) {
      if (this.BusinessDataInput.businessStatus === "VERIFIED") {
        localStorage.setItem("businessId", data.businessId);
        localStorage.setItem("isSuperAdmin", data.isSuperAdmin);

        this.router.navigate(["business"], { queryParams: data });

        // setTimeout(()=>{
        // this.api.query('business/employee/request/pending/'+data.businessId).subscribe(res=>{
        //   this.searchData.setRequestedEmployeeCount(res.length)
        // })
        // }, 600)
      } else if (this.BusinessDataInput.businessStatus === "NOT VERIFIED") {
        if (this.BusinessDataInput.isSuperAdmin === true) {
          this.verifyBusiness(verifyTemplate, this.BusinessDataInput);
        }
      }
    }
  }

  getBusinessLogo() {
    if (
      this.BusinessDataInput &&
      this.BusinessDataInput.businessLogo &&
      this.BusinessDataInput.businessLogo != null &&
      this.BusinessDataInput.businessLogo !== ""
    ) {
      let photoUrl = this.BusinessDataInput.businessLogo.toLocaleLowerCase();
      if (photoUrl.indexOf("http://") !== -1) {
        this.BusinessDataInput.businessLogo = this.BusinessDataInput.businessLogo;
      } else {
        this.BusinessDataInput.businessLogo =
          AppSettings.photoUrl + this.BusinessDataInput.businessLogo;
      }
    }

    this.bData = this.BusinessDataInput;
  }

  showBusinessIcon() {
    if (this.loggedInUser == this.userId) {
      this.Showsuitcase = true;
    }
  }

  ShowAdminData() {
    if (
      this.BusinessDataInput.isSuperAdmin === true ||
      this.BusinessDataInput.isAdmin === true
    ) {
      this.Showsuitcase = true;
    }
  }



  industryClassification() {
    if (
      this.BusinessDataInput.industryClassification ==
      "MEDICAL_HEALTHCARE_PRACTICE"
    ) {
      this.IndustryClassifications = "Medical/ Healthcare Practice";
    } else if (
      this.BusinessDataInput.industryClassification == "ALTERNATIVE_MEDICE"
    ) {
      this.IndustryClassifications = "Alternative Medicine";
    } else if (
      this.BusinessDataInput.industryClassification == "BIOTECHNOLOGY"
    ) {
      this.IndustryClassifications = "Biotechnology";
    } else if (
      this.BusinessDataInput.industryClassification == "DIAGNOSTIC_SERVICES"
    ) {
      this.IndustryClassifications = "Diagnostic Services";
    } else if (
      this.BusinessDataInput.industryClassification ==
      "EDUCATIONAL_INSTITUTION_(MEDICAL,_NURSING,_HEALTHCARE)"
    ) {
      this.IndustryClassifications =
        "Educational Institution (Medical, Nursing, Healthcare)";
    } else if (
      this.BusinessDataInput.industryClassification == "HEALTH_INSURANCE"
    ) {
      this.IndustryClassifications = "Health Insurance";
    } else if (
      this.BusinessDataInput.industryClassification ==
      "MEDICAL_DEVICE_EQUIPMENTS"
    ) {
      this.IndustryClassifications = "Medical Device/ Equipments";
    } else if (
      this.BusinessDataInput.industryClassification ==
      "PROFIT_ORGANIZATION_(HEALTH/WELLNESS/MEDICAL)"
    ) {
      this.IndustryClassifications =
        "Non-Profit Organization (Health/Wellness/Medical)";
    } else if (
      this.BusinessDataInput.industryClassification ==
      "NON-PROFIT_ORGANIZATION_(HEALTH/WELLNESS/MEDICAL)"
    ) {
      this.IndustryClassifications =
        "Non-Profit Organization (Health/Wellness/Medical)";
    } else if (this.BusinessDataInput.industryClassification == "OTHER") {
      this.IndustryClassifications = this.BusinessDataInput.others;
    } else if (
      this.BusinessDataInput.industryClassification == "PHARMACEUTICALS"
    ) {
      this.IndustryClassifications = "Pharmaceuticals";
    } else if (this.BusinessDataInput.industryClassification == "RESEARCH") {
      this.IndustryClassifications = "Research";
    } else if (
      this.BusinessDataInput.industryClassification == "WELLNESS_FITNESS"
    ) {
      this.IndustryClassifications = "Wellness & Fitness";
    }
  }

  unfollow() {
    const datas: any = {};
    datas.businessId = this.BusinessDataInput.businessId;
    datas.userId = this.loggedInUser;
    this.util.startLoader();
    this.api.create("business/unfollow/follower", datas).subscribe((res) => {
      this.util.stopLoader();

      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Business unfollow",
          text: "You are not following this business page anymore!",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          this.BusinessDataInput.isFollower = false;
          // if (this.onUnfollow != undefined && this.onUnfollow != null) {
          //   this.onUnfollow.emit(this.BusinessDataInput);
          // }
        });
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while processing your request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }
  shouldShowUnfollowButton(): boolean {
    return !this.BusinessDataInput.isSuperAdmin &&
           !this.BusinessDataInput.isAdmin &&
           !this.BusinessDataInput.isEmployee &&
           this.BusinessDataInput.isFollower &&
           this.BusinessDataInput.status=='ACTIVE'&&
           !this.BusinessDataInput.claimable;
  }

  shouldShowFollowButton(): boolean {
    return !this.BusinessDataInput.isSuperAdmin &&
           !this.BusinessDataInput.isAdmin &&
           !this.BusinessDataInput.isFollower &&
           !this.BusinessDataInput.isEmployee &&
           this.BusinessDataInput.status=='ACTIVE'&&
           !this.BusinessDataInput.claimable;
  }

  addfollower() {
    const datas: any = {};
    datas.businessId = this.BusinessDataInput.businessId;
    datas.userId = this.loggedInUser;
    this.util.startLoader();
    this.api.create("business/add/follower", datas).subscribe((res) => {
      this.util.stopLoader();
      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Follower added",
          text: "Now, you are following this business page",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          this.BusinessDataInput.isFollower = true;
          localStorage.setItem('isAFollower', 'true')
        });
      }
    }, (err) => {

      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while adding follower. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }
}

