import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
import { GigsumoConstants } from "./GigsumoConstants";
import { ApiService } from "./api.service";

export interface superAdminDetails {
  organisationId: string,
  userId: string,
  call: boolean,
  status: "CALL" | "NOCALL"
}

export type APPLICANT_STATUS =
"CANDIDATE-SELECTED" |
"PROFILE-REJECTED" |
"ONBOARDED" |
"INTERVIEW-SCHEDULED" |
"CANDIDATE-SHORTLISTED" |
"PRE-ONBOARDED" |
"OFFER-WITHDRAWN" |
"WITHDRAW" |
"OFFER-DECLINED" |
"OFFER-ACCEPTED" |
"INITIATED" |
"ACCEPT" |
"REJECT" |
"JOB-APPLIED" |
"OFFERED" |
"INTERVIEW-ACCEPTED" |
"INTERVIEW-REJECTED" |
"CANDIDATE-WITHDRAWN" | "ACTIVE" | "INACTIVE" |
"INTERVIEW-FAILED" | "ACCEPTED" | "REJECTED"
"OFFER WITHDRAWN" ;


@Injectable({
  providedIn: "root",
})
export class GigsumoService {

  buttonClicked: boolean = true;
  planUpdatedTo: string = null;
  jobCandidateCountUpdatedTo: string = null;
  candidateInviteBtnClicked: boolean = false;

  constructor(private api: ApiService) { }
  readonly swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  readonly userType = localStorage.getItem('userType');
  readonly userId = localStorage.getItem('userId');

  get PROFILEDETAILS(): Observable<any> {
    const data: { userId: string; userType: string } = {
      userType: localStorage.getItem("userType"),
      userId: localStorage.getItem("userId"),
    };
    return this.api.create("user/profileDetails", data);
  }

  get FINDBYLIST(): Observable<any> {
    let data = { "domain": "CLIENT_TYPE,PAY_TYPE,GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST" }
    return this.api.create('listvalue/findbyList', data);
  }

  getUsaCities(value: string): Observable<any> {
    let data: { countryCode: string, zipCode: string } = {
      countryCode: "US",
      zipCode: value
    }
    return this.api.create("country/geodetails", data);
  }

  isSuperAdmin(data: Partial<superAdminDetails>) {
    return this.api.query(`business/checkBusinessStatus/${data.userId}/${data.organisationId}`);
  }

  checkBusinessByDomain(email: string) {
    return this.api.create(`business/checkBusinessByDomain/${email}`,{});
  }

  get USERDETAILS(): Observable<any> {
    return this.api.query("user/" + this.userId);
  }


  getResponseMessage(code: string, content?: any): Promise<SweetAlertResult> {
    switch (code) {


      case "OTP_SUCCESSFULLY_VERIFIED":
        return this.swalMessage({
          icon: "success",
          title: "Work Experience saved successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        break;
      case GigsumoConstants.SUCESSCODE:
        return this.swalMessage({
          icon: "success",
          title: "Work Experience saved successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        break;
      // case "EMAIL_DOMAIN_MATCHES_BUSINESS_ORGANISATION" :
      // return this.swalMessage({
      //   icon: "success",
      //   title: "Business email matches business organisation",
      //   text: "Now, that your email address matched with your business organisation, please authenticate your business email.",
      //   showConfirmButton: true,
      // });
      // break;
      case "NO_BUSINESS_FOUND_FOR_EMAIL":
        return this.swalMessage({
          icon: "info",
          title: "Pro Tip",
          text: "There are no business pages found against your email address. Therefore, you may create business page for your business email and enjoy a great deal of benefits. Please, authenticate the email first.",
          showConfirmButton: true,
        });
        break;

      case GigsumoConstants.CHANGING_CURRENORG:
        return this.swalWithButtons({
          title:  ` ${content === 'change' ? 'Leaving' : 'Deleting'} current organization`,
          text: "Please, note that all the posting under the current organization will be marked for deletion. Do you want to proceed ?",
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          reverseButtons: true
        });
        break;
      case "DELTING_CURRENT_ORGANIZATION":
        return this.swalWithButtons({
          title: 'Deleting current organization',
          text: "Please, note that all the posting under the current organization will be marked for deletion. Do you want to proceed ?",
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          reverseButtons: true
        });
        break;
      case GigsumoConstants.NO_ADMIN_BUSINESS_FOUND: case GigsumoConstants.NO_BUSINESS:
        return this.swalWithButtons({
          title: 'info',
          text: "Please, note that all the posting under the current organization will be marked for deletion. Do you want to proceed ?",
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          reverseButtons: true
        });
        break;
      case GigsumoConstants.CURRENTORGANIZATION_NEED:
        return this.swalMessage({
          title: "Oops..",
          text: "Sorry, one current organization is at least needed for your user type.",
          icon: "error",
          confirmButtonText: "Ok",
        })
        break;
      case GigsumoConstants.SUPERADMIN_BUSINESS_NO_MEMBERS:
        return this.swalWithButtons({
          title: `Deactivate Business Page`,
          text: `You are the super admin of the current organization business page. Please deactivate the business page before ${content != "changing" ? "deleting" : "changing"} your current organization.`,

          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          reverseButtons: true
        });
        break;
      case GigsumoConstants.SUPERADMIN_BUSINESS_HAS_MEMBERS: case "DEACTIVATED_BUSINESS":
        return this.swalMessage({
          text: `You are the super admin of the business page '${content}'. You have to transfer your super admin rights to other members before ${code === "DEACTIVATED_BUSINESS" ? "deactivating the business page": "changing your current organization"}.`,
          title: "Transfer your super admin rights",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          reverseButtons: true
        });
        break;
      case GigsumoConstants.FAILURECODE:
        return this.swalMessage({
          text: "Oops! Something went wrong!",
          icon: 'info'
        })
        break;
      case "DELETE":
        return this.swalWithButtons({
          title: "Delete your Work Experience?",
          text: "Are you sure you wish to delete this work Experience ? It cannot be reversed. ",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        });
        break;
      case "MAKECURRENT":
        return this.swalWithButtons({
          title: 'Oops..',
          text: "Looks Like you don't have any Current Organization",
          icon: 'info',
          confirmButtonText: 'Ok',
          showCancelButton: true,
          cancelButtonText: "Cancel",
          reverseButtons: true,
        })
        break;
      case "AREYOUSURE":
        return this.swalWithButtons({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        });
        break;
      case "CANCELEMAILAUTHENTICATION":
        return this.swalWithButtons({
          title: "Cancelling Email Verification",
          text: "You won't be able be to change the current organisation if you skip this step. Would you like to proceed?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        });
        break;
      case "CHANGEPROFILE":
        return this.swalWithButtons({
          title: "Are you sure you want to change?",
          text: "There is a workplace you have chosen already to show on Profile. Would you like to change it?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        });
        break;
      case "CHANGING_CLIENT_TYPE":
        return this.swalWithButtons({
          title: 'Alert',
          text: "Please, note that the current organisation type is updated.",
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: "Proceed",
          cancelButtonText: "Cancel",
          reverseButtons: true,
        });
        break;
      case "TWO_SAME_CURRENTORGANIZATION":
        return this.swalWithButtons({
          title: "Two Current Organization Detected.",
          text: "Sorry, you can't have two current organization under the same business organization.",
          icon: "info"
        });
        break;
      case "CHECK_EMAIL_DOMAIN_AGAINST_BUSINESS_ORGANISATION":
        return this.swalWithButtons({
          title: "Business Organisation Mismatches Email Domain",
          // text: "The provided business email address seems like it is linked to the business page " + "'" + content + "'" + ", which is not your new current organisation. With mismatching email address and current organisation details, you shall not become an employee of the business page.",
          text: "The email domain associated with the business page " + "'" + content + "'" + " does not match your current organization. Therefore, you cannot be listed as an employee of this business page, Please check your credentials",
          icon: "info",
          // showCancelButton: true,
          confirmButtonText: "Ok",
          // cancelButtonText: "Cancel",
          reverseButtons: true,
        });
        break;
      case "WORK_EXPERIENCE_HAS_BUSINESS_BUT_EMAIL_DOESNOT":
        return this.swalWithButtons({
          title: "Provided Email Doesn't Have A Business But Your Work Experience Does",
          text: "The provided business email address does not have a business page, however your work experience is linked to the business page " + "'" + content + "'" + ". With mismatching email address and current organisation details, you shall not become an employee of the business page.",
          icon: "info",
          showCancelButton: true,
          cancelButtonText: "Go Back",
          showConfirmButton : false
        });
        break;
      case "BUSINESS_EXIST_WITH_DOMAIN":
        return this.swalWithButtons({
          title: "Business Already exists",
          text: "There is already an organization with a business page associated with your email domain. Are you sure you dont want to use that organization? You will not be able to create a business page. Do you wish to continue ?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "yes",
          cancelButtonText: "Cancel",
          reverseButtons: true,
        });
        break;
      case "OTP_VERIFIED":
        return this.swalMessage({
          title: "Otp Verified Sucessfully",
          icon: "success",
          text: "Your secondary Email is added Sucessfully!.",
          timer: 1000
        })
        break;
      default:
        break;
    }
  }

  public colorClass: string[] = ['fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-saffron-color',
    'fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-yellow-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-saffron-color',
    'fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-yellow-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-saffron-color',
    'fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-yellow-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-saffron-color',
    'fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-yellow-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-saffron-color'];


  private swalMessage(data: SweetAlertOptions): Promise<any> {
    return Swal.fire(data);
  }

  private swalWithButtons(data: SweetAlertOptions): Promise<any> {
    return this.swalWithBootstrapButtons.fire(data);
  }


  isNullOrEmptyList(array: Array<any>): boolean {
    return array == null || array.length == 0;

  }

  isNullOrEmptyString(string: string): boolean {
    return string == null || string.trim().length == 0;

  }
}
