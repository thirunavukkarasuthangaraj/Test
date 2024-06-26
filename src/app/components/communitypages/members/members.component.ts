import { Component, OnInit, Input } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { CommonValues } from "src/app/services/commonValues";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { AppSettings } from "src/app/services/AppSettings";
import { UtilService } from "src/app/services/util.service";
import { InvitesendComponent } from "../invitesend/invitesend.component";
import { UserCardConfig } from "src/app/types/UserCardConfig";
import Swal from "sweetalert2";
import { Subscription } from "rxjs";

@Component({
  selector: "app-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
})
export class MembersComponent implements OnInit {
  @Input() commonemit;
  userData = [];
  values: any = {
    members: [],
  };
  communityId;
  communitySuperadmin;
  name: string = "";
  loadAPIcall:boolean=false
  inivateAcceptdata: any;
  AllData: boolean = true;
  invitedMember: boolean = true;
  adminData: boolean = true;
  AdminFilterData: any;
  tempAdminFilterData: any;
  tempInivateAcceptdata: any;
  memberCount: boolean = true;
  AdminCount: boolean = false;
  AdminFilterDatalength: any;
  admin: any;
  membersList: any;
  memberList: any;
  tempmembersList = [];
  userCardConfig: UserCardConfig[] = [];
  noDatafound: Array<string> = ["You have no member"];
  noDatafoundadmin: Array<string> = ["You have no admin"];
  noDatafoundinvited: Array<string> = ["You have no invitations sent yet"];
  searchKey
  emitter: Subscription
  showNoDatafound: boolean = false;
  valueChanged: any;
  constructor(
    private api: ApiService,
    private commonvalues: CommonValues,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService,
    private inivateData: InvitesendComponent
  ) {
    this.commonvalues.getcommunitydata().subscribe((res) => {
      this.values = res;
    });

    this.emitter = this.commonvalues.getCommunityEventEmitter().subscribe(res => {
      this.valueChanged = res.boolean
      if (this.valueChanged == true) {
        this.members()
      }
    })
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      this.communityId = res.communityId;
      this.values.menu = "memberspage";
      this.values = this.commonemit;
      this.members();
    });

    this.communitySuperadmin = localStorage.getItem("communitySuperadmin");
    this.admin = localStorage.getItem("isSuperAdmin");

    if (
      this.communitySuperadmin == "true" ||
      this.communitySuperadmin == true
    ) {
      this.communitySuperadmin = true;
      if (this.admin === "true") {
        let revokeBtn: UserCardConfig = new UserCardConfig(
          "Revoke",
          this.removedata,
          this.canShow,
          true
        );
        revokeBtn.source = this;
        this.userCardConfig.push(revokeBtn);
      }
    } else {
      this.communitySuperadmin = false;
    }
  }

  canShow(data, source): boolean {
    return this.communitySuperadmin;
  }

  removedata(data) {
    data.userId;
    this.communityId;

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to remove?",
        text: "This member will be removed from this community page",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let datas: any = {};
          datas.communityId = this.communityId;
          datas.userId = data.userId;
          this.util.startLoader();
          this.api
            .create("community/remove/members", datas)
            .subscribe((res) => {
              this.util.stopLoader();
              if (res.code == "00000") {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Community member",
                  text: "Member has been removed",
                  showConfirmButton: false,
                  timer: 2000,
                }).then(() => {
                  this.members();
                })
              }
            }, err => {
              this.util.stopLoader();

            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: "Community member",
          //   text: "Member is safe",
          //   showConfirmButton: false,
          //   timer: 1500,
          // });
        }
      });
  }

  userprofile(data) {
    var userData: any = {};
    userData.userId = data;

    this.router.navigate(["personalProfile"], { queryParams: userData });

  }

  sendmsg(data) {
    var userData: any = {};
    userData.userid = data.userId;
    this.router.navigate(["message"], { queryParams: userData });
  }

  connect(data) {
    //console.log('connect data:', data)
    data.requestedBy = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.create("user/connect", data).subscribe((res) => {
      //console.log('connect data :', res)
      this.util.stopLoader();
      if (res.code == "00000") {
        this.members();
        // setTimeout(function () {
        //   alert("Request is sent Successfully!");
        // }, 200);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Connection request",
          text: "Request sent successfully",
          //showConfirmButton: true,
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1500
        })
      } else if (res.code == "88888") {
      }
    }, err => {
      this.util.stopLoader();

    });
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  keyupdata(event) {
    if (event.target.value.length == 0) {
      this.onsearch('');
    }
  }

  onsearch(val) {
    if (val != undefined) {
      val = val.trim().toLowerCase();
    }


    if (this.AllData) {
      this.membersList = this.tempmembersList;
      this.membersList = this.filterByString(this.membersList, val);
      if (this.membersList.length == 0) {
        this.showNoDatafound = true;
      } else {
        this.showNoDatafound = false;
      }
    }
    else if (this.adminData) {
      this.AdminFilterData = this.tempAdminFilterData;
      this.AdminFilterData = this.filterByString(this.AdminFilterData, val);
      if (this.AdminFilterData.length == 0) {
        this.showNoDatafound = true;
      } else {
        this.showNoDatafound = false;
      }
    }

    else if (this.invitedMember) {
      this.inivateAcceptdata = this.tempInivateAcceptdata;
      this.inivateAcceptdata = this.filterByString(this.inivateAcceptdata, val);
      if (this.inivateAcceptdata.length == 0) {
        this.showNoDatafound = true;
      } else {
        this.showNoDatafound = false;
      }
    }


  }

  filterByString(data, s) {
    return data.filter(e => e.userName.toLowerCase().includes(s))
      .sort((a, b) => a.userName.toLowerCase().includes(s) && !b.userName.toLowerCase().includes(s) ? -1 : b.userName.toLowerCase().includes(s) && !a.userName.toLowerCase().includes(s) ? 1 : 0);
  }
  members() {
    this.userData = [];
    var datas = {
      communityId: this.communityId,
      userId: localStorage.getItem("userId"),
      page: {
        offSet: 0,
        pageCount: 100,
      },
    };
   this.loadAPIcall=true;
    this.api
      .query("community/members/" + this.communityId)
      .subscribe((resMembers) => {
        this.loadAPIcall=false;
        this.memberList = resMembers.data.communityMembersList.length;
        localStorage.setItem('communitycount', resMembers.data.communityMembersList.length);

        this.util.stopLoader();
        this.membersList = [];
        if (resMembers.data.communityMembersList != null) {
          resMembers.data.communityMembersList.forEach((element) => {
            if (
              element.userId != "undefined" ||
              element.userId != "null" ||
              element.userId != ""
            ) {
              element.page = 'COMMUNITY'
              element.menu = "memberspage"

              this.membersList.push(element);
            }
          });
          this.membersList = this.sort_by_key(this.membersList, "firstName");
          this.membersList.forEach(element => {
            element.userName = element.firstName + " " + element.lastName;
          });
          this.tempmembersList = this.membersList
          this.membersList.forEach((element, i) => {
            if (element.userId == localStorage.getItem("userId")) {
              var b = this.membersList[i];
              this.membersList[i] = this.membersList[0];
              this.membersList[0] = b;
            }
          });

          this.adminData = false;
          this.AllData = true;
          this.invitedMember = false;
          this.memberCount = true;
          this.AdminCount = false;

          //console.log('this.membersList : \n',this.membersList)
        }
      }, err => {
        this.util.stopLoader();
      });
  }
  sortData(data) {
    return data.sort((a, b) => {
      return <any>new Date(b.memberOn) - <any>new Date(a.memberOn);
    });
  }

  datas(datas) {
    this.values.menu = "memberspage";
    this.userData = datas;
    this.values.members = this.userData;
    this.commonvalues.communitydata(this.values);
  }

  AdminFilter() {
    // Swal.fire('AdminFilter');
    // let commData:any ={};
    // commData.id= this.communityId;
    // commData.type = 'ADMIN'

    const AdminFilterData = {
      id: this.communityId,
      type: "ADMIN",
    };

    // this.api.communityfilAPIAdmin('community/admins/'+commData.id).subscribe((res)=>{
    this.api
      .create("community/filteradmin", AdminFilterData)
      .subscribe((res) => {
        //console.log('AdminFilter',res)
        this.AdminFilterData = res.data.communityModels;
        this.AdminFilterDatalength = res.data.communityModels.length;
        //console.log('this.AdminFilterDatalength' ,this.AdminFilterDatalength)
        this.adminData = true;
        this.AllData = false;
        this.invitedMember = false;
        this.memberCount = false;
        this.AdminCount = true;
        res.data.communityModels.forEach(element => {
          element.userName = element.firstName + " " + element.lastName;
          element.page = 'COMMUNITY';
          element.menu = "memberspage";

        });
        this.tempAdminFilterData = this.AdminFilterData;
        //console.log('this.AdminFilterData',res)
      });
  }

  InvitedFilter() {
    let commData: any = {};
    commData.id = this.communityId;
    this.api
      .query("community/inviteacceptmember/" + commData.id)
      .subscribe((res) => {
        this.inivateAcceptdata = res.data.inviteAcceptMembers;
        this.AllData = false;
        this.invitedMember = true;
        this.adminData = false;
        this.memberCount = false;
        this.AdminCount = false;

        res.data.inviteAcceptMembers.forEach(element => {
          element.userName = element.firstName + " " + element.lastName;
          element.page = 'COMMUNITY';
          element.menu = "memberspage";

        });

        this.tempInivateAcceptdata = this.inivateAcceptdata;
        //console.log('fliter InvitedFilter',this.inivateAcceptdata)
        // alert('fliter InvitedFilter'+res)
      }, err => {
        this.util.stopLoader();
      });
  }
}
