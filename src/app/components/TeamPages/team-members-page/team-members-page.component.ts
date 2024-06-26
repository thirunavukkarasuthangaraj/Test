import { UtilService } from "./../../../services/util.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { UserCardConfig } from "src/app/types/UserCardConfig";
import Swal from "sweetalert2";
import { CreateteamModelComponent } from "src/app/page/model/createteam-model/createteam-model.component";
import { AppSettings } from "src/app/services/AppSettings";
import { SearchData } from "src/app/services/searchData";
import { Subscription } from "rxjs";
import { JobService } from "src/app/services/job.service";

@Component({
  selector: "app-team-members-page",
  templateUrl: "./team-members-page.component.html",
  styleUrls: ["./team-members-page.component.scss"],
})
export class TeamMembersPageComponent implements OnInit {
  modalRef: BsModalRef;
  pathdata;
  membersForm: UntypedFormGroup;
  conditionList: any = [];
  membersData: any = [];
  tempmembersData: any = [];
  conditionSelectedItems: any;
  userCardConfig: UserCardConfig[] = [];
  tempData: any = [];
  ownerFlag = false;
  teamMembersSearch: any;
  url = AppSettings.photoUrl;
  clickEventsubscription: Subscription;
  pesponseDisplay:any;
  loadAPIcall:boolean=false
  noDatafound : Array<string> = ["You have no member"];
  showNoDatafound: boolean = false;
  searchKey
   constructor(
    private route: ActivatedRoute,
    private util: UtilService,
    private fb: UntypedFormBuilder,
    private modalService: BsModalService,
    private api: ApiService,
    private router: Router,
    private commonValues: SearchData,
    private teamModel: CreateteamModelComponent,
    private JobServicecolor: JobService,
  ) {
    this.clickEventsubscription = commonValues.getTeamdata().subscribe(res => {
      this.pesponseDisplay = res
    })
  }

  ngOnInit() {
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.queryParams.subscribe((res) => {
      this.pathdata = res;
      if (res.teamId == undefined) {
        this.refresh();
      }
      if (localStorage.getItem("userId") == this.pathdata.teamsOwnerId) {
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

    this.connectedlist();
    this.membersDatas();
    this.formNetworkModal();
    this.membersForm = this.fb.group({
      addconnection: this.pathdata.teamName,
      description: this.pathdata.description,
    });
  }
    // for first and last name
    getInitialName(firstname: string,lastname: string): string {
      return this.JobServicecolor.getInitialsparam(firstname,lastname);
    }
     // for first and last name
     getColorName(firstname: string,lastname: string): string {
      return this.JobServicecolor.getColorparam(firstname,lastname);
    }

  keyupdata(event){
    if(event.target.value.length==0){
      this.onsearch('');
    }
  }

  filterName : string = "All";
  allEmployee()
  {
    this.util.startLoader();
    this.api.query("teams/get/" + this.pathdata.teamId).subscribe((res) => {
        if(res){
        this.membersData = res.data.teams.members;
        }
        this.util.stopLoader();
    },err=>{
      this.util.stopLoader();
    });
    this.filterName = "All";
}

admins()
{
  this.util.startLoader();
  this.api.query("teams/get/"+ this.pathdata.teamId+ "?type=" + "ADMIN").subscribe((res) => {
    if(res){
      this.membersData = res.data.TeamAdmin.members;
      }
      this.util.stopLoader();
  },err=>{
    this.util.stopLoader();
  });
  this.filterName = "Admins";

}


members(){
  this.util.startLoader();
  this.api.query("teams/get/"+ this.pathdata.teamId+ "?type=" + "MEMBERS").subscribe((res) => {
    if(res){
      this.membersData = res.data.TeamAdmin.members;
    }
    this.util.stopLoader();
  },err=>{
    this.util.stopLoader();
  });
  this.filterName = "Members";
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
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.api
            .delete(
              "teams/delete/member?userId=" +
              data.userId +"&type=REMOVED"+
              "&teamId=" +
              this.pathdata.teamId
            )
            .subscribe((res) => {
              if (res != null) {
                this.membersDatas();
                this.refresh();
              }
            },err => {
              this.util.stopLoader();
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {

          }
        });

  }


  canShow(data, source) {
    return true;
  }

  connectedlist() {
    this.util.startLoader();
    let queryText:string="teams/member/suggestion?userId=" + localStorage.getItem("userId")+"&orgId=" +this.pathdata.organizationId;

    if(this.pathdata. teamId   !=null && this.pathdata. teamId !=undefined){
      queryText=queryText+ "&teamId=" + this.pathdata.teamId;
    }
    this.api
      .query(
        queryText
      )
      .subscribe((res) => {
        this.util.stopLoader();
        res.data.userDatas.forEach((element) => {
          element.userName = element.firstName + " " + element.lastName;
        });
        this.conditionList = this.sort_by_key(res.data.userDatas, "userName");
      },err => {
        this.util.stopLoader();
      });
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
  membersDatas() {
    this.loadAPIcall=true
    this.api.query("teams/get/" + this.pathdata.teamId).subscribe((res) => {
      this.loadAPIcall=false
      this.membersData = this.sort_by_key(res.data.teams.members, "firstName");
       this.membersData.forEach((element, i) => {
        element.userName = element.firstName + " " + element.lastName;
         element.label_Id=  this.pathdata.teamsOwnerId;
        if (element.userId == localStorage.getItem("userId")) {
          var b = this.membersData[i];
          this.membersData[i] = this.membersData[0];
          this.membersData[0] = b;
        }
      });

      this.tempmembersData=  this.membersData;


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
  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  formNetworkModal() {
    this.membersForm = this.fb.group({
      addconnection: this.pathdata.teamName,
      description: this.pathdata.description,
    });
  }

  addmember(template: TemplateRef<any>) {
    this.membersForm.reset();
    this.conditionSelectedItems = [];
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });

    this.connectedlist();
  }

  modelhide() {
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    // }
    this.modalRef.hide()
  }

  submit() {
    this.tempData = [];
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
            teamId: this.pathdata.teamId,
          });
        });
      }
      this.util.startLoader();
      this.api.create("teams/members/save", this.tempData).subscribe((res) => {
        this.util.stopLoader();
        this.membersForm.reset();
        if (res != undefined && res != null) {
          if (res.code == "00000") {

            this.modelhide();
            this.refresh();
            this.getInviteList();
            this.connectedlist();

            Swal.fire({
              position: "center",
              icon: "success",
              title: "Invitation sent successfully",
              //showConfirmButton: true,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 2000,
            }).then((result) => {

            });
          } else if (res.code == "99999") {
            this.modelhide();
            this.refresh();
            this.connectedlist();
            this.getInviteList();
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Member add failed",
              text: "Please try again later",
              showConfirmButton: true,
              showCancelButton: false,
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
              }
            });
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
      .query("teams/member/invites/sent/" + this.pathdata.teamId)
      .subscribe((res) => {
        if (res != undefined && res != null) {
          this.pesponseDisplay.pendingCount=res.data.TeamsMember.length
             this.commonValues.setCommonVariables( this.pesponseDisplay);
         }

      },err => {
        this.util.stopLoader();
      });
    this.util.stopLoader();
  }

  refresh() {
    this.api.query("teams/get/" + this.pathdata.teamId).subscribe((res) => {
      if (res != undefined && res != null) {
        this.commonValues.setTeamdata(res.data.teams)
        this.pesponseDisplay = res.data.teams;
      }
    },err => {
      this.util.stopLoader();
    });
   }


}
