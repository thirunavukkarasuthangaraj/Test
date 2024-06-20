import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { values, forEach } from "lodash";
import { PageType } from "src/app/services/pageTypes";
import { AppSettings } from "./../../../services/AppSettings";
import { UtilService } from "./../../../services/util.service";
import { ApiService } from "./../../../services/api.service";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
  UntypedFormControl,
} from "@angular/forms";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import Swal from "sweetalert2";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CreditModelComponent } from "../credit-model/credit-model.component";
import { Router } from '@angular/router';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: "app-referrals",
  templateUrl: "./referrals.component.html",
  styleUrls: ["./referrals.component.scss"],
})
export class ReferralsComponent implements OnInit {
  id = "1";
  connectionRequest: UntypedFormGroup;
  bsModalRef: BsModalRef;
  splitPattern = new RegExp("[,;:]");
  validators = [this.emailValid];
  accdianId;
  userRes;
  faqresponse;
  inviteRes;
  noDatafound: string[];
  showNoDatafound: boolean = false;
  appliedFilter: string;
  arr;
  loadAPIcall:boolean=false;
  existLength;
  searchForm: UntypedFormGroup;
  existOrInvited: Array<any> = [];
  userId = localStorage.getItem('userId');
  url = AppSettings.photoUrl;
  gigsumoConstants = GigsumoConstants
  public errorMessages = {
    emailValid: "Please enter valid email id",
  };
  showText: string;
  existUser: any;
  inviteUser: any;

  constructor(
    private fb: UntypedFormBuilder,
    private pageType: PageType,
    private modalService: BsModalService,
    private api: ApiService,
    private util: UtilService,
    private router: Router,
    private JobServicecolor: JobService,

  ) { }

  ngOnInit() {
    this.connectionRequest = this.fb.group({
      email: [null, Validators.required],
      msg: [null],
    });

    this.userAPI();
    this.inviteduserList();
  }
  getInitials(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }

  getColor(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }

  userAPI() {
   // this.util.startLoader();
   this.loadAPIcall=true
    this.api.query("user/" + this.userId).subscribe(
      (res) => {
        this.loadAPIcall=false
        this.util.stopLoader();
        if (res && res.code === "00000") {
          this.userRes = res;
        }
      },
      (err) => {
        this.util.stopLoader();
      }
    );
  }
  activeTab(getid) {
    let data: any = {};
    this.id = getid;
    if (getid == "2") {
      this.inviteduserList();
    }
    if (getid == "1") {
      data.ComponentName = "InvitesCerditsComponent";
      data.show = true;
      this.pageType.setsuggjob(data);
    }
    if (getid == "3") {
      data.ComponentName = "InvitesCerditsComponent";
      data.show = false;
      this.pageType.setsuggjob(data);
      this.FAQList();

    }
  }

  accadian(id) {
    this.accdianId = id;
  }
  sendMessage(userId: string) {
    var userData: any = {};
    userData.groupId = userId;
    userData.type = "USER";
    this.router.navigate(["message"], { queryParams: userData });
  }

  Connect(userId) {
    let data: any = {};
    data.userId = userId;
    data.requestedBy = this.userId;
    this.api.create("user/connect", data).subscribe((res) => {
      this.util.stopLoader();
      setTimeout(() => {
        if (res.code == "00000") {
          Swal.fire({
            icon: "success",
            title: "Request sent successfully",
            showDenyButton: false,
            showConfirmButton: false,

            timer: 2000,
          });
        }
        this.inviteduserList();
      }, 3500);
    });
  }

  cancel(userId) {
    let data: any = {};
    data.userId = userId;
    this.api.create("user/connect/cancel", data).subscribe((res) => {
      this.util.stopLoader();
      if (res.code == "00000") {
        Swal.fire({
          icon: "success",
          title: "Request cencel successfully",
          showDenyButton: false,
          showConfirmButton: false,

          timer: 2000,
          // timer: 4500,
        });

        setTimeout(() => {
          this.inviteduserList();
        }, 3500);
      }
    });
  }

  FAQList() {
    let data: any = {};
    data.module = "Referral";
    this.loadAPIcall=true
    //this.util.startLoader();
    this.api.create("home/findFAQs", data).subscribe(
      (res) => {
        this.loadAPIcall=false
        this.util.stopLoader();
        if (res.code == "00000") {
          this.faqresponse = res.data;
        }
      },
      (err) => {
        this.util.stopLoader();
      }
    );
  }
  @ViewChild("exist") popup: any;

  inviteduserList() {
    let data: any = {};
    data.userId = this.userId
   // this.util.startLoader();

    this.findUserInvitesApiCAll(data, 0)
  }

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    // scroll
  };

  closemodel() {

    this.connectionRequest.value.email;
    this.connectionRequest.value.email =
      this.connectionRequest.value.email.filter(
        (val) => !this.existUser.includes(val)
      );
    this.connectionRequest.value.email =
      this.connectionRequest.value.email.filter(
        (val) => !this.inviteUser.includes(val)
      );

    let value = this.connectionRequest.value.email;
    this.connectionRequest.reset();
    this.connectionRequest.patchValue({ email: value });
    this.modalService.hide(1)

  }
  referalLimit() {
    this.util.startLoader()
    let data: any = {}
    // console.log("mails-> check no",this.connectionRequest);

    data.userId = localStorage.getItem('userId');
    this.api.create(this.gigsumoConstants.findUserInvites, data).subscribe((res) => {
      if (res.code === "00000" && this.connectionRequest.value.email.length > 0) {
        this.referalCountForAMonth = this.connectionRequest.value.email.length + res.data.referralCountOfTheMonth
        if (this.referalCountForAMonth > res.data.referralLimit) {
          const count = res.data.referralLimit - res.data.referralCountOfTheMonth
          if (res.data.referralCountOfTheMonth >= res.data.referralLimit) {
            this.util.stopLoader
            this.exceedErrorPopUp(0, res.data.referralLimit)

          } else if (res.data.referralCountOfTheMonth === 0) {
            this.exceedErrorPopUp(0, res.data.referralLimit)

          } else if (res.data.referralCountOfTheMonth < res.data.referralLimit && this.referalCountForAMonth > res.data.referralLimit) {

            this.util.stopLoader
            this.exceedErrorPopUp(count, res.data.referralLimit)

          }
          this.util.stopLoader()
          this.connectionRequest.controls['email'].setErrors({ invalid: true })
        }
      }

      this.util.stopLoader();

    });
  }

  exceedErrorPopUp(count, referralLimit) {
    Swal.fire({
      icon: "error",
      title: +count + " of " + referralLimit + " invites available",
      showDenyButton: false,
      showConfirmButton: true,
      timer: 3000
    });
  }

  referalCountForAMonth: number;
  datas: any

  SendInvite(ValidEmail) {
    if (this.connectionRequest.valid) {
      this.util.startLoader();

      if (this.userRes && this.userRes.firstName && this.userRes.lastName) {
        const input = {
          userId: this.userId,
          firstName: this.userRes.firstName,
          lastName: this.userRes.lastName,
          inviteEmailList: this.connectionRequest.value.email,
          message: this.connectionRequest.value.msg
        };

        this.api.create("home/inviteeUser", input).subscribe(
          (res) => {
            if (res.code == "00000") {
              setTimeout(() => {
                this.faqresponse = res.data;
                this.util.stopLoader();
                Swal.fire({
                  icon: "success",
                  title: "Invite sent successfully",
                  showDenyButton: false,
                  showConfirmButton: false,
                  timer: 2000,
                });
                this.connectionRequest.reset();
              }, 500);
            } else if (res.code == "99998") {
              this.util.stopLoader();
              this.existUser = res.data.existingUsers;
              this.inviteUser = res.data.alreadyInvited;
              this.modalService.show(ValidEmail);
              this.util.stopLoader();
            }
          },
          (err) => {
            this.util.stopLoader();

          }
        );
      } else {

        this.util.stopLoader();
      }
    }
  }




  cancelInvite(email) {
    let data: any = {};
    data.userId = this.userId;
    data.inviteeEmail = email;
    this.util.startLoader();
    this.api.create("home/cancelInvite", data).subscribe(
      (res) => {
        setTimeout(() => {
          this.util.stopLoader();
          if (res.code == "00000") {
            this.inviteduserList();

            Swal.fire({
              icon: "success",
              title: "Invite Cancelled Successfully",
              showDenyButton: false,
              showConfirmButton: false,

              timer: 2000,
            });
          }
        }, 3500);
      },
      (err) => {
        this.util.stopLoader();
      }
    );
  }

  emailValid(control: AbstractControl) {
    var pattern: string =
      "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+){1,2}$";
    //if (Validators.email(new FormControl(control.value))) {
    const control1 = new UntypedFormControl(
      control.value,
      Validators.pattern(pattern)
    );
    if (control1.errors != null) {
      return {
        emailValid: true,
      };
    }
  }

  selectedFilterName : string = "Filter";
  filterApi(val: string) {
    var data: any = {};
    data.userId = this.userId;
    data.status = val;
    this.selectedFilterName = val === "PENDING" ? "Pending Acceptance" :
    val === "CANCELLED" ? "Invitation Cancelled" : val === "COMPLETED" ? "Invite Accepted" :
    val === "USERCANCELLED" ? "User Cancelled" : val;
    this.findUserInvitesApiCAll(data, 0)

  }

  findUserInvitesApiCAll(data, debouncetime?: number) {
    this.showNoDatafound = false
    this.loadAPIcall=true
    this.api.create(this.gigsumoConstants.findUserInvites, data).pipe(debounceTime(debouncetime), distinctUntilChanged()).subscribe((res) => {
      this.util.stopLoader();
      this.loadAPIcall=false
      this.inviteRes = []
      this.inviteRes = res.data
      if (this.inviteRes.userInvites.length == 0) {
        this.showNoDatafound = true
        this.noDatafound = ['No Invites Received']
      } else {
        this.showNoDatafound = false;
      }
    });
  }
  onSearch(val) {
    var data: any = {};
    var value = val.target.value;


    if (value != null) {

      data.userId = this.userId;
      data.status = this.appliedFilter;
      data.inviteeEmail = value;
      this.util.startLoader();

      this.findUserInvitesApiCAll(data, 1000)
    }
  }
  // checkEmailExistOrUser()
  // {
  //   // this.API.query("user/checkMailAlreadyExists/" + id).subscribe((res) => {
  //   //   if (res.data.exists) {
  //   //     this.candidatePostForm.get('email').setErrors({ existingEmailAddress: true })
  //   //     // this.candidatePostForm.get('email').reset();
  //   //     this.candidatePostForm.get('candidateEmailId').patchValue(null);
  //   //     // Swal.fire({
  //   //     //   icon: "info",
  //   //     //   title: "There already exists an account registered with this email address, Please enter different email",
  //   //     //   showConfirmButton: true,

  //   //     // });
  //   //   } else {
  //   //     this.candidatePostForm.get('email').setErrors({ existingEmailAddress: null })
  //   //     this.candidatePostForm.get('email').updateValueAndValidity({ emitEvent: false })
  //   //   }
  //   // })
  //   const data = {
  //     userId: localStorage.getItem('userId'),
  //     firstName: this.userRes.firstName,
  //     lastName: this.userRes.lastName,
  //     inviteEmailList: this.connectionRequest.value.email,
  //     message: this.connectionRequest.value.msg

  //   };

  //    this.api.create("")

  // }
}
