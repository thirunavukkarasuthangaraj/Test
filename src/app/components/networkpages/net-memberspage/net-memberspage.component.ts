import { AppSettings } from './../../../services/AppSettings';
import { UtilService } from "./../../../services/util.service";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { UserCardConfig } from "src/app/types/UserCardConfig";
import Swal from "sweetalert2";
import { Subscription } from 'rxjs';
import { SearchData } from 'src/app/services/searchData';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: "app-net-memberspage",
  templateUrl: "./net-memberspage.component.html",
  styleUrls: ["./net-memberspage.component.scss"],
})
export class NetMemberspageComponent implements OnInit {
  modalRef: BsModalRef;
  pathdata;
  tempData: any = [];
  membersForm: UntypedFormGroup;
  conditionList: any = [];
  membersData: any = [];
  conditionSelectedItems: any;
  userCardConfig: UserCardConfig[] = [];
  ownerFlag = false;
  isDisabled = false;
  url=AppSettings.photoUrl;
  MemberSearch: any;
  clickEventsubscription: Subscription;
  pesponseDisplay:any;
  noDatafound = "You have no member"
  showNoDatafound: boolean = false;
  tempmembersData:any;
  loadAPIcall:boolean=false
  searchKey
   constructor(
    private route: ActivatedRoute,
    private util: UtilService,
    private fb: UntypedFormBuilder,
    private commonValues: SearchData,
    private modalService: BsModalService,
    private api: ApiService,
    private router: Router,
    private JobServicecolor: JobService,
  ) {
    this.clickEventsubscription = commonValues.getNetdata().subscribe(res => {
      this.pesponseDisplay = res
    })
  }
  networkName:String

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.queryParams.subscribe((res) => {
      this.pathdata = res;
      if(this.pathdata.networkName){
        if(this.pathdata.networkName=="Freelance Recruiter Network")  this.networkName= "Freelance Recruiters"
         if(this.pathdata.networkName=="Bench Sales Network")  this.networkName="Bench Sales"
         if(this.pathdata.networkName=="Management Talent Acquisition Network") this.networkName= "Management Talent Acquisition"
         if(this.pathdata.networkName=="Recruiter Network")  this.networkName= "Recruiters"
         if(this.pathdata.networkName=="Job Seeker Network")  this.networkName= "Job seekers"

       }
      if (res.networkId == undefined) {
        res.networkId = null;
      }
      if (localStorage.getItem("userId") === this.pathdata.networkOwnerId && this.pathdata.isDefaultNetwork=='false') {
        this.ownerFlag = true;
        let revokeBtn: UserCardConfig = new UserCardConfig(
          "Revoke",
          this.removeMember,
          this.canShow,
          true
        );
        revokeBtn.source = this;
        this.userCardConfig.push(revokeBtn);
      } else {
        this.ownerFlag = false;
      }
    });
    this.isDisabled = false;

    this.formNetworkModal();
    this.connectedlist();
    this.membersDatas();
  }
  keyupdata(event){
    if(event.target.value.length==0){
      this.onsearch('');
    }
  }
  onsearch(val) {
     if(val!=undefined){
      val = val.trim().toLowerCase();
    }
     this.membersData =this.tempmembersData;
     this.membersData = this.filterByString(this.membersData, val);
    if (this.membersData.length == 0) {
      this.showNoDatafound = true;
    } else {
      this.showNoDatafound = false;
    }

  }
    // for first and last name
    getInitialName(firstname: string,lastname: string): string {
      return this.JobServicecolor.getInitialsparam(firstname,lastname);
    }
     // for first and last name
     getColorName(firstname: string,lastname: string): string {
      return this.JobServicecolor.getColorparam(firstname,lastname);
    }

  filterByString(data, s) {
    return data.filter(e => e.userName.toLowerCase().includes(s))
      .sort((a, b) => a.userName.toLowerCase().includes(s) && !b.userName.toLowerCase().includes(s) ? -1 : b.userName.toLowerCase().includes(s) && !a.userName.toLowerCase().includes(s) ? 1 : 0);
 }

  removeMember(data) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "Do you want to revoke this member?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, revoke!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.api
            .delete(
              "network/delete/member?status=REVOKED&userId=" +
                data.userId+
                "&networkId=" + this.pathdata.networkId
            )
            .subscribe((res) => {
              if (res != null) {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Member revoked successfully ",
                  showConfirmButton: false,
                  timer: 2000,
                }).then((result) => {
                  this.membersDatas();
                  // this.refresh();

                });
              }
            },err => {
              this.util.stopLoader();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: "Member is safe",
          //   // showConfirmButton: true,
          //   showConfirmButton: false,
          //   timer: 1500,
          // });
        }
      });
  }

  canShow(data, source) {
    return true;
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  membersDatas() {
    this.loadAPIcall=true
    this.api
      .query("network/get/" + this.pathdata.networkId)
      .subscribe((res) => {
       this.loadAPIcall=false
        if (res != null) {
          res.data.Network.members.forEach((element) => {
            element.userName = element.firstName + " " + element.lastName;
          });
          this.membersData = this.sort_by_key(
            res.data.Network.members,
            "userName"
          );
          this.tempmembersData =this.membersData;
          this.membersData.forEach((element, i) => {
            element.label_Id=  this.pathdata.networkOwnerId;
            if (element.userId == localStorage.getItem("userId")) {
             // element.label_Id=  this.pathdata.networkOwnerId;
              var b = this.membersData[i];
              this.membersData[i] = this.membersData[0];
              this.membersData[0] = b;
            }
          });
        }
      },err => {
        this.util.stopLoader();
      });
  }
  connectedlist() {

   let queryText:string="network/member/suggestion?userId=" + localStorage.getItem("userId") ;

    if(this.pathdata. networkId   !=null && this.pathdata. networkId !=undefined){
      queryText=queryText+ "&networkId=" + this.pathdata.networkId;
    }
    this.api
      .query(
        queryText
      )
      .subscribe((res) => {
        res.data.userDatas.forEach((element) => {
          element.userName = element.firstName + " " + element.lastName;
        });
        this.conditionList = this.sort_by_key( res.data.userDatas, "userName" );

       },err => {
        this.util.stopLoader();
      });
  }


  handleUserCardEvent(data: any) : void{
     //// console.log(data.event);
    //// console.log('userid - ' + data.data.userId);
    if(data.event != undefined && data.event != null && data.event == 'REMOVE_CONNECTION'){
      this.membersData = this.membersData.filter(element => element.userId != data.data.userId);
    }
  }

  addmember(template: TemplateRef<any>) {
    this.connectedlist();
    this.formNetworkModal();
    this.membersForm.reset();
    this.conditionSelectedItems = [];

    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
  }
  formNetworkModal() {
    this.membersForm = this.fb.group({
      addconnection: this.pathdata.userName,
      description: this.pathdata.description,
    });
  }
  modelhide() {
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    // }
    this.modalRef.hide()
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
  submit() {
    this.isDisabled = true;
    this.tempData = [];
    this.connectedlist();

    if (
      this.conditionSelectedItems == undefined ||
      this.conditionSelectedItems.length == 0
    ) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please select a member",
        // showConfirmButton: true,
        showConfirmButton: false,
        timer: 2000,
        allowOutsideClick: false,
      });
    } else if (
      this.conditionSelectedItems != undefined &&
      this.conditionSelectedItems.length != 0
    ) {
      if (this.conditionSelectedItems != 0) {
        this.conditionSelectedItems.forEach((element) => {
          this.tempData.push({
            memberUserId: element.userId,
            networkId: this.pathdata.networkId,
          });
        });
      }

      this.util.startLoader();
      this.api
        .create("network/invite/members", this.tempData)
        .subscribe((res) => {
          this.util.stopLoader();
          if (res != undefined && res != null) {
            this.modelhide();
            this.membersForm.reset();
            if (res.code == "00000") {
              this.refresh();
              this.connectedlist();
              this.membersDatas();
              this.getInviteList();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Invitation sent successfully",
                showConfirmButton: false,
                showCancelButton: false,
                allowOutsideClick: false,
                timer: 2000,
              });
            } else if (res.code == "99999") {
              this.refresh();
              this.connectedlist();
              this.membersDatas();

              Swal.fire({
                position: "center",
                icon: "error",
                title: "Adding member failed",
                showConfirmButton: false,
                timer: 2000,
                showCancelButton: false,
              })
              // .then((result) => {
              //   if (result.isConfirmed) {
              //   }
              // });
            }
          }
        },err => {
          this.util.stopLoader();

         });

    }
  }

  getInviteList() {
    this.util.startLoader();
    this.api
      .query("network/invite/sent/" + this.pathdata.networkId)
      .subscribe((res) => {
        if (res != undefined && res != null) {
          this.pesponseDisplay.pendingCount=res.data.SentRequests.length
             this.commonValues.setCommonVariables( this.pesponseDisplay);
         }

      },err => {
        this.util.stopLoader();
      });
    this.util.stopLoader();
  }


  refresh() {
    this.util.startLoader();
    this.api
      .query("network/get/" + this.pathdata.networkId)
      .subscribe((res) => {
        this.util.stopLoader();
        if (res != undefined && res != null) {
          res.data.Network.members.forEach((element) => {
            element.userName = element.firstName + " " + element.lastName;
          });
          this.commonValues.setNetdata(res.data.Network)
          this.pesponseDisplay = res.data.Network;
        }
      },err => {
        this.util.stopLoader();
      });
  }
}
