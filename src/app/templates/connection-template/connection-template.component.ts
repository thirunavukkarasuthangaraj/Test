import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { AppSettings } from 'src/app/services/AppSettings';
import { ApiService } from 'src/app/services/api.service';
import { CommonValues } from 'src/app/services/commonValues';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-connection-template',
  templateUrl: './connection-template.component.html',
  styleUrls: ['./connection-template.component.scss']
})
export class ConnectionTemplateComponent implements OnInit , OnChanges{
  userType: any = localStorage.getItem('userType');
  bsModalRef: BsModalRef;
  @Input() page: string;
  @Input() connectionStatus: string;
  @Input() values: any;
  @Input() counterpartsDetails: any;
  @Input() module: any;

  connectionlist: Subscription;
  candidateconnectionlist: Subscription;
  url = AppSettings.ServerUrl + "download/";
  userId = localStorage.getItem('userId');
  constructor(private JobServicecolor: JobService, private modalService: BsModalService, private api: ApiService, private util: UtilService,
    private router: Router, private searchData: SearchData, private commonValues: CommonValues, private gigsumoService: GigsumoService) {
    this.connectionlist = this.commonValues.getJobData().subscribe(jobObject => {
      this.updateconnbject(jobObject);
    })
    this.candidateconnectionlist = this.commonValues.getCandidateData().subscribe(candidateObject => {
      this.updateCandidatecnnection(candidateObject);
    })

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.counterpartsDetails && changes.counterpartsDetails.currentValue != undefined){
      this.counterpartsDetails = changes.counterpartsDetails.currentValue;
      // console.log("counterpartsDetails" , this.counterpartsDetails);
      if(this.counterpartsDetails){
        this.counterpartsDetails.fullname = this.counterpartsDetails.fullname != undefined ? this.counterpartsDetails.fullname :
        this.counterpartsDetails.firstName + this.counterpartsDetails.lastName;

      }
    }
  }

  connectionsStatus: string;
  ngOnInit() {

  }
  getInitials(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }

  getColor(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }
   // for first and last name
   getInitialName(firstname: string,lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname,lastname);
  }
   // for first and last name
   getColorName(firstname: string,lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname,lastname);
  }


  updateconnbject(jobObject): void {
    if (this.values.jobId == jobObject.jobId) {
      this.connectionStatus = jobObject.connectionStatus;
    }
    this.gigsumoService.candidateInviteBtnClicked = false
  }
  updateCandidatecnnection(candidateObject): void {
    if (this.values.candidateId == candidateObject.candidateId) {
      this.connectionStatus = candidateObject.connectionStatus
    }
    this.gigsumoService.candidateInviteBtnClicked = false
  }


  ngOnDestroy() {
    if (this.connectionlist) {
      this.connectionlist.unsubscribe();
    }
    this.gigsumoService.candidateInviteBtnClicked = false
  }

  sendMessage(Data: any) {
    let userId: string;
    if (Data.createdBy) {
      userId = Data.createdBy
    } else if (Data.jobPostedBy) {
      userId = Data.jobPostedBy
    }

    var userData: any = {};
    userData.groupId = userId;
    userData.type = "USER";
    this.router.navigate(["message"], { queryParams: userData });
  }



  closeConnectionProcess() {
    this.modalService.hide(1);
    this.gigsumoService.candidateInviteBtnClicked = false
  }

  accept() {
    var data: any = {};
    data.userId = localStorage.getItem("userId");
    if (this.module == 'job') {
      data.connectedUser = this.values.jobPostedBy;
    } else if (this.module == 'candidate') {
      data.connectedUser = this.values.createdBy;
    }
    else if(this.module == undefined){
      data.connectedUser=this.values.userId;
    }

    data.status = "CONNECTED";
    this.util.startLoader();
    this.api.create("user/connect/accept", data).subscribe((res) => {
      if (res.code == "00000") {
        this.modalService.hide(1);
        this.connectionStatus = 'CONNECTED';
        this.values.connectionStatus = 'CONNECTED';
        if (this.module == 'candidate') {
          this.commonValues.setCandidateData(this.values)
        } else if (this.module == 'job') {
          this.commonValues.setJobData(this.values)
        }
        this.util.stopLoader();
        Swal.fire({
          icon: "success",
          title: "Request accepted successfully",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.modalService.hide(1);
        })
      } else if (res.code == "88889") {
        this.util.stopLoader();
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Connection accept request failed. Please try after a while.",
          showConfirmButton: false,
          timer: 4000,
        });
      }
    }, err => {
      this.util.stopLoader();
    });
    this.gigsumoService.candidateInviteBtnClicked = false
  }

  reject() {
    var data: any = {};
    data.userId = localStorage.getItem("userId");
    if (this.module == 'job') {
      data.connectedUser = this.values.jobPostedBy;
    } else if (this.module == 'candidate') {
      data.connectedUser = this.values.createdBy;
    }
    else if(this.module == undefined){
      data.connectedUser=this.values.userId;
    }

    data.status = "REJECTED";
    this.util.startLoader();
    this.api.create("user/connect/accept", data).subscribe((res) => {
      if (res.code == "00000") {
        this.modalService.hide(1);
        this.connectionStatus = 'NOT_CONNECTED';
        this.values.connectionStatus = 'NOT_CONNECTED';
        if (this.module == 'candidate') {
          this.commonValues.setCandidateData(this.values)
        } else if (this.module == 'job') {
          this.commonValues.setJobData(this.values)
        }
        this.util.stopLoader();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Connection Request",
          text: "Connection request rejected",
          showConfirmButton: false,
          timer: 2000,
        })
      } else if (res.code == "88889") {
        this.util.stopLoader();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Oops...",
          text: "Something went wrong. Please try after some time.",
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }, err => {
      this.util.stopLoader();

    });
    this.gigsumoService.candidateInviteBtnClicked = false
  }

  connect() {
    var data: any = {};
    if (this.module == 'job') {
      data.userId = this.values.jobPostedBy;
    } else if (this.module == 'candidate') {
      data.userId = this.values.createdBy;
    }else if(this.module == undefined){
      data.userId=this.values.userId;
    }
    data.requestedBy = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.create("user/connect", data).subscribe((res) => {
      if (res.code == "00000") {
        this.modalService.hide(1);
        this.connectionStatus = 'REQUEST_SENT';
        this.util.stopLoader();
        this.values.connectionStatus = 'REQUEST_SENT';
        if (this.module == 'candidate') {
          this.commonValues.setCandidateData(this.values)
        } else if (this.module == 'job') {
          this.commonValues.setJobData(this.values)
        }
        //message to show connect request is sent successfully
        setTimeout(function () {
          Swal.fire({
            icon: "success",
            title: "Request sent successfully",
            showConfirmButton: false,
            timer: 2000,
          });
        }, 200);
      } else if (res.code == "88888") {
        this.util.stopLoader();
        Swal.fire({
          icon: "info",
          title: "Request failed",
          text: "Request coundn't be sent now. Please try after some time.",
          showConfirmButton: false,
          timer: 3000,
        });
      } else if (res.code == 'U0031') {
        this.util.stopLoader()
      }
    }, err => {
      this.util.stopLoader();

    });
    this.gigsumoService.candidateInviteBtnClicked = false
  }

  cancelConnectionRequest() {
    let cancelData: any = {};
    if (this.module == 'job') {
      cancelData.userId = this.values.jobPostedBy;
    } else if (this.module == 'candidate') {
      cancelData.userId = this.values.createdBy;
    }

    this.util.startLoader();
    this.api.create("user/connect/cancel", cancelData).subscribe((res) => {
      if (res.code === "00000") {
        this.util.stopLoader();
        this.modalService.hide(1);
        this.connectionStatus = 'NOT_CONNECTED';
        this.values.connectionStatus = 'NOT_CONNECTED';
        if (this.module == 'candidate') {
          this.commonValues.setCandidateData(this.values)
        } else if (this.module == 'job') {
          this.commonValues.setJobData(this.values)
        }
        Swal.fire({
          icon: "success",
          title: "Connection request cancelled",
          showConfirmButton: false,
          timer: 2000,
        });
      } else if (res.code === "88888") {
        this.util.stopLoader();

        Swal.fire({
          icon: "info",
          title: "Cancel request failed",
          text: "Unable to cancel connection. Please try after some time.",
          showConfirmButton: false,
          timer: 4000,
        });
      }
    }, err => {
      this.util.stopLoader();

    });
    this.gigsumoService.candidateInviteBtnClicked = false
  }

  removeConnection() {
    let connData: any = {};
    if (this.module == 'job') {
      connData.userId = this.values.jobPostedBy;
    } else if (this.module == 'candidate') {
      connData.userId = this.values.createdBy;
    }
    this.util.startLoader();
    this.api.create("user/connect/remove", connData).subscribe((res) => {
      if (res.code === "00000") {
        this.util.stopLoader();
        this.modalService.hide(1);
        this.connectionStatus = 'NOT_CONNECTED';
        this.values.connectionStatus = 'NOT_CONNECTED';
        if (this.module == 'candidate') {
          this.commonValues.setCandidateData(this.values)
        } else if (this.module == 'job') {
          this.commonValues.setJobData(this.values)
        }
        Swal.fire({
          icon: "success",
          title: "Connection removed successfully",
          showConfirmButton: false,
          timer: 2000,
        });

      } else if (res.code === "88888") {
        this.util.stopLoader();

        Swal.fire({
          icon: "info",
          title: "Unable to remove connection. Please try after some time.",
          showConfirmButton: false,
          timer: 4000,
        });
      }
    }, err => {
      this.util.stopLoader();
    });
    this.gigsumoService.candidateInviteBtnClicked = false
  }

  onHidden(): void {
    // console.log('Dropdown is hidden');
  }
  onShown(): void {
    // console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    // console.log('Dropdown state is changed');
  }

}
