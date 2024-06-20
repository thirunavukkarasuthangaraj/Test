import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { NetworkComponent } from "src/app/page/homepage/network/network.component";
import { TeamComponent } from 'src/app/page/homepage/team/team.component';
import { AppSettings } from "src/app/services/AppSettings";
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { JobService } from 'src/app/services/job.service';
import { SearchData } from "src/app/services/searchData";
import { StreamService } from 'src/app/services/stream.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from "sweetalert2";
@Pipe({
  name: 'Adding'
})
export class AddPipe implements PipeTransform {
  transform(value: string): number {
    let sum = 0;
    for (let index = 0; index < value.length; index++) {
      sum = sum + +value.charAt(index);
    }
    return sum;
  }
}
@Pipe({ name: 'stripHtmlTags' })
export class StripHtmlTagsPipe implements PipeTransform {
  transform(value: string): string {
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.body.textContent || '';
  }
}
export enum MESSAGESTATUS {
  EMPTY, MESSAGE
}
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [DatePipe]
})
export class NotificationComponent implements OnInit, OnDestroy, AfterViewInit {
  notificationStatus: "Fetching Notifications..."
  notificationList: any = [];
  userId = localStorage.getItem('userId');
  unreadUserMsgCount: number = 0;
  notificationcount: number = 0;
  clickEventsubscription: Subscription;
  countEmitter: Subscription;
  isEnabled:boolean=false;
  public innerHeight;
  public chatHeight;
  commonVariables: any = {};
  GigsumoConstant = GigsumoConstants;
  eventEmitterData: Subscription
  constructor(private api: ApiService, private util: UtilService, private stremService: StreamService,
    private router: Router, private searchData: SearchData,
    private netCls: NetworkComponent,private cdr: ChangeDetectorRef,
    private tmCls: TeamComponent, private JobServicecolor: JobService,
  ) {
    this.userId = localStorage.getItem('userId');
    this.getUserHeaderCount();
    this.eventEmitterData = this.searchData.getCommonVariables().subscribe(res => {
      this.commonVariables.offSetMap = res.offSetMap
      this.commonVariables.notificationList = res.notificationList
    });
    this.countEmitter = this.searchData.getNotificationCount().subscribe(res => {
      if(res)
      this.unreadUserMsgCount = res.unreadUserMsgCount;
      this.notificationcount = res.notificationcount;
    })
  }
  getInitials(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }
  getColor(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }
  datechange(date) {
    const dateSendingToServer = new DatePipe('en-US').transform(date, 'MM/dd/yyyy HH:mm');
    return dateSendingToServer;
  }
  getUserHeaderCount() {
    // this.isEnabled=true;
    const userId = localStorage.getItem("userId");
    this.api.query("user/header/" + userId + "/" + localStorage.getItem('postedDate')).subscribe((res) => {
      // this.isEnabled=false;
      if (res) {
        this.unreadUserMsgCount = res.message;
        this.notificationcount = res.notification;
        var commonVariable: any = {}
        commonVariable.unreadUserMsgCount = res.message
        commonVariable.notificationcount = res.notification
        this.searchData.setNotificationCount(commonVariable)
      }
    }, err => {
      // this.util.stopLoader();
    });
  }
  ngOnInit() {
    this.innerHeight = window.innerHeight
    this.chatHeight = this.innerHeight - 500;
    this.cdr.detectChanges();
  }
  ngOnDestroy() {
    if (this.eventEmitterData) {
      this.eventEmitterData.unsubscribe();
    }
    if (this.countEmitter) {
      this.countEmitter.unsubscribe();
    }
    if (this.eventEmitterData) {
      this.eventEmitterData.unsubscribe();
    }
  }
  ngAfterViewInit() {

    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 500);
    // setTimeout(() => {
    //   if (document.getElementById('jingalala') != null) {
    //     document.getElementById('jingalala').style.visibility = "visible";
    //   }
    // }, 3000)
    this.getnotificationView()
  }
  @ViewChild('stickedThere') menuElement: ElementRef;
  @ViewChild('itIsThere') menuElement1: ElementRef;
  stickThere: boolean = false
  beThere: boolean = false
  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(value) {
  // let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
  // let max = document.documentElement.scrollHeight;
  //  if(pos == max )   {
  //    if(this.stopscrollFlag == false){
  //      if(this.count==2){
  //         setTimeout(() => {
  //           this.getnotificationView()
  //         }, 500);
  //      }else{
  //       this.getnotificationView()
  //      }
  //    }
  //  }
  //  const windowScroll = window.pageYOffset;
  //     if(windowScroll >= 42){
  //       this.stickThere = true;
  //       this.beThere = true;
  //     } else {
  //       this.stickThere = false;
  //       this.beThere = false;
  //     }
  // }
  cumulativeLimit: number = 0
  bottomFlag = false
  count: number = 0
  funtioncallFlag: boolean = false
  stopscrollFlag: boolean = false
  responseReceived: boolean = false
  getnotificationView(): void {
    const userId = localStorage.getItem("userId");
    this.count = this.count + 1

    var value: any = {}
    value.userId = this.userId
    if (this.count == 1) {
      value.offSetMap = null
      value.pageNumber = 0
      this.commonVariables.pageNumber = 0
      this.searchData.setCommonVariables(this.commonVariables)
    } else {
      value.offSetMap = this.commonVariables.offSetMap
      value.pageNumber = this.commonVariables.pageNumber
    }
    this.isEnabled=true;
    this.api.create("notification/query", value).subscribe((res) => {
      // this.util.stopLoader()
      if (res.status == 500) {
        this.isEnabled=false;
        // this.util.stopLoader()
      } else if (res.code == "00000" && res.data != null, res.data != null) {
        this.isEnabled=false;
        this.responseReceived = true
        this.funtioncallFlag = false
        if (res.data.notifications.length === 10) {
          this.commonVariables.offSetMap = null
          this.commonVariables.pageNumber = this.commonVariables.pageNumber + 1
          this.searchData.setCommonVariables(this.commonVariables)
          this.getNotification(res.data['notifications']);
        } else if (res.data.notifications.length < 10) {
          this.stopscrollFlag = true
          this.getNotification(res.data['notifications']);
          this.funtioncallFlag = false
          this.bottomFlag = true
        }
      } else if (res.code == "00000" && res.data == null) {
        this.isEnabled=false;
        this.responseReceived = true
      }
      else {
        this.isEnabled=false;
        this.funtioncallFlag = false
      }
    });
    // }
  }
  routeToPageOrProfile(value, category) {
    if (category == 'profile') {
      this.router.navigate(["/personalProfile"], {
        queryParams: { userId: value.notifyData.userId },
      });
    } else if (category == 'businessPage') {
      localStorage.setItem("businessId", value["notifyEntityId"]);
      this.router.navigate(["/business"], {
        queryParams: value["notifyData"],
      });
    } else if (category == 'messageGroup') {
      this.router.navigate(["/message"], {
        queryParams: value["notifyData"],
      });
    } else if (category == 'communityPage') {
      localStorage.setItem("communityId", value["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: value["notifyData"],
      });
    } else if (category == 'networkPage') {
      localStorage.setItem("networkId", value["notifyEntityId"]);
      this.router.navigate(["/network"], {
        queryParams: value["notifyData"],
      });
    }
  }
  onScrollDown() {
    if (this.stopscrollFlag == false) {
      if (this.count == 2) {
        setTimeout(() => {
          this.getnotificationView()
        }, 500);
      } else {
        this.getnotificationView()
      }
    }
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 42) {
      this.stickThere = true;
      this.beThere = true;
    } else {
      this.stickThere = false;
      this.beThere = false;
    }
  }
  deleteFromNotification(index) {
    // this.util.startLoader()
    this.commonVariables.notificationList.splice(index, 1)
    this.searchData.setCommonVariables(this.commonVariables)
    this.getUserHeaderCount()
    // this.util.stopLoader()
  }
  notificationRead(item, index) {
    this.util.startLoader();
    this.api.create("notification/read/" + item, {}).subscribe((res) => {
      if (res && res.code === "00000") {
        this.util.stopLoader();
        if (index >= 0 && index < this.commonVariables.notificationList.length) {
          this.commonVariables.notificationList[index].read = true;
          this.searchData.setCommonVariables(this.commonVariables)
          this.getUserHeaderCount();
        }
      } else {
        this.util.stopLoader();
      }
    });
  }
  resendEmployeeRequest(item, index) {
    this.funtioncallFlag = true
    this.util.startLoader();
    var data: any = {}
    data.userId = item['notifyData']['userId']
    data.businessId = item['notifyData']['businessId']
    this.api.create("business/employee/request/send", data).subscribe(res => {
      if (res.code == "00000") {
        this.util.stopLoader();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Employee request sent successfully",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          this.deleteFromNotification(index)
          // this.commonvalues.businessid(this.values);
          // this.ngOnInit();
          // this.getnotificationView()
        });
      } else {
        this.util.stopLoader();
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops...",
          text: "Sorry, something went wrong. Please try after some time.",
          showConfirmButton: false,
          timer: 5000,
        }).then((result) => {
          // this.commonvalues.businessid(this.values);
          // this.ngOnInit();
        });
      }
    })
  }
  joinRequestNetwork(value, index) {
    this.funtioncallFlag = true
    this.notificationRead(value["notifyId"], index)
    let datas: any = {};
    datas.memberUserId = localStorage.getItem("userId");
    // datas.networkId =   networkId;
    this.util.startLoader()
    this.api.create("network/member/save", datas).subscribe((res) => {
      if (res.code == '00000') {
        // this.getnotificationView()
        this.ngOnInit()
        this.util.stopLoader()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Nework join request sent",
          showConfirmButton: false,
          timer: 2000,
        })
      } else {
        this.util.stopLoader()
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops...",
          text: "Sorry, something went wrong. Please try after some time.",
          showConfirmButton: false,
          timer: 5000,
        })
      }
    });
  }
  acceptBusinessEmployee(value, index) {
    this.funtioncallFlag = true
    // this.notificationRead(value["notifyId"], index)
    let data: any = {};
    data.businessId = value.notifyData.businessId;
    data.userId = value.notifyData.userId;
    this.api
      .create("business/employee/request/accept", data)
      .subscribe((res) => {
        if (res.code == "00000") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Employee added successfully",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            this.deleteFromNotification(index)
          })
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Oops..",
            text: "Something went wrong. Please try again later.",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      });
  }
  rejectBusinessEmployee(value, index) {
    this.funtioncallFlag = true
    let data: any = {};
    data.businessId = value.notifyData.businessId;
    data.userId = value.notifyData.userId;
    this.util.startLoader()
    this.api
      .create("business/employee/request/reject", data)
      .subscribe((res) => {
        if (res.code == "00000") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Add employee request Denied",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            this.deleteFromNotification(index)
          })
          this.util.stopLoader()
        } else {
          this.util.stopLoader()
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Oops..",
            text: "Something went wrong. Please try again later.",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      });
  }
  acceptBusinessFollowerRequest(value, index) {
    this.funtioncallFlag = true
    // this.notificationRead(value["notifyId"], index)
    let data: any = {}
    data.businessId = value.notifyData.businessId
    data.userId = localStorage.getItem('userId')
    this.util.startLoader()
    this.api.create('business/follow/accept/request', data).subscribe(res => {
      if (res.code == '00000') {
        // this.getnotificationView()
        // this.admindata.isFollowerInvited=false;
        this.util.stopLoader()
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Follower Added',
          text: 'You are now following the Business Page.',
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          this.deleteFromNotification(index)
        })
      } else {
        this.util.stopLoader()
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oops..',
          text: 'Something went wrong. Please try later.',
          showConfirmButton: false,
          timer: 3000
        })
      }
    })
  }
  rejectBusinessFollowerRequest(value, index) {
    this.funtioncallFlag = true
    // this.notificationRead(value["notifyId"], index)
    let data: any = {}
    data.businessId = value.notifyData.businessId
    data.userId = localStorage.getItem('userId')
    this.util.startLoader()
    this.api.create('business/follow/reject/request', data).subscribe(res => {
      if (res.code == '00000') {
        // this.getnotificationView()
        this.util.stopLoader()
        // this.admindata.isFollowerInvited=false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Follower request rejected',
          showConfirmButton: false,
          timer: 4000
        }).then(() => {
          this.deleteFromNotification(index)
        })
      } else {
        this.util.stopLoader()
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oops..',
          text: 'Something went wrong. Please try later.',
          showConfirmButton: false,
          timer: 3000
        })
      }
    })
  }
  redirectToSaidPage(item) {
    this.funtioncallFlag = true
    item["redirectFrom"] = "notification";
    if (item["notifyType"] == "CANDIDATE_GOT_SELECTED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["newcandidates/jobsApplied"], {
        queryParams: item["notifyData"]['candidateData'],
      });
    } else if (item["notifyType"] == "INTERVIEW_SCHEDULED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["newcandidates/jobsApplied"], {
        queryParams: item["notifyData"]['candidateData'],
      });
    }
    else if (item["notifyType"] == "CANDIDATE_REJECTED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["newcandidates/jobsApplied"], {
        queryParams: item["notifyData"]['candidateData'],
      });
    }
    else if (item["notifyType"] == "CANDIDATE_SHORTLISTED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["newcandidates/jobsApplied"], {
        queryParams: item["notifyData"]['candidateData'],
      });
    }
    else if (item["notifyType"] == "JOB_OFFERED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["newcandidates/jobsApplied"], {
        queryParams: item["notifyData"]['candidateData'],
      });
    }
    else if (item["notifyType"] == "OFFER WITHDRAWN") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["newcandidates/jobsApplied"], {
        queryParams: item["notifyData"]['candidateData'],
      });
    }
    else if (item["notifyType"] == "CANDIDATE BACKOUT") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["newcandidates/jobsApplied"], {
        queryParams: item["notifyData"]['candidateData'],
      });
    }
    else if (item["notifyType"] == "CANDIDATE_PREONBOARDED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["newcandidates/jobsApplied"], {
        queryParams: item["notifyData"]['candidateData'],
      });
    }
    else if (item["notifyType"] == "CANDIDATE_ONBOARDED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["newcandidates/jobsApplied"], {
        queryParams: item["notifyData"]['candidateData'],
      });
    }
    else if (item["notifyType"] == "CANDIDATE_INVITATION_ACCEPTED") {
      this.notificationRead(item["notifyId"], null)
      var data: any = {}
      data.jobPostedBy = item["userId"]
      data.jobId = item["notifyData"]['jobId']
      data.points = 0
      data.consumptionType = 'CONSUMPTION_FOR_JOB_VIEW'
      this.router.navigate(["newjobs/candidates-invited"], {
        queryParams: data
      });
    }
    else if (item["notifyType"] == "CANDIDATE_INVITATION_REJECTED") {
      this.notificationRead(item["notifyId"], null)
      var data: any = {}
      data.jobPostedBy = item["userId"]
      data.jobId = item["notifyData"]['jobId']
      data.points = 0
      data.consumptionType = 'CONSUMPTION_FOR_JOB_VIEW'
      this.router.navigate(["newjobs/candidates-invited"], {
        queryParams: data
      });
    }
    else if (item["notifyType"] === "NETWORK_CONNECT_REQUEST_ACCEPTED") {  // going to 404 page
      item.notifyData.networkOwnerId = localStorage.getItem('userId')
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["networkPage/members"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "CONNECT_REQUEST_RECEIVED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["/personalProfile"], {
        queryParams: { userId: item["notifyEntityId"] },
      });
    } else if (item["notifyType"] === "POST_LIKED") {
      this.notificationRead(item["notifyId"], null)
      // this.router.navigate(["/personalProfile"], {
      //   queryParams: { userId: item["notifyEntityId"] },
      // });
    } else if (item["notifyType"] === "POST_COMMENTED") {
      this.notificationRead(item["notifyId"], null)
      // this.router.navigate(["/personalProfile"], {
      //   queryParams: { userId: item["notifyEntityId"] },
      // });
    }
    else if (item["notifyType"] === "POST_SHARED") {
      this.notificationRead(item["notifyId"], null)
      // this.router.navigate(["/personalProfile"], {
      //   queryParams: { userId: item["notifyEntityId"] },
      // });
    }
    else if (item["notifyType"] === "COMMUNITY_USER_INVITE_REQUEST") {
      this.notificationRead(item["notifyId"], null)
      localStorage.setItem("communityId", item["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: item["notifyData"],
      });
    }
    else if (item["notifyType"] === "COMMUNITY_USER_JOIN_REQUEST") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "request"
      localStorage.setItem('communityId', item.notifyData.communityId)
      localStorage.setItem('isAdmin', 'false')
      localStorage.setItem('isSuperAdmin', 'true')
      localStorage.setItem('screen', 'community')
      localStorage.setItem('adminviewflag', 'false')
      localStorage.setItem("communityId", item["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: item["notifyData"],
      });
    }
    else if (item["notifyType"] === "JOINED_TEAM") {
      this.notificationRead(item["notifyId"], null)
      const temp = item["notifyData"];
      temp.routeFrom = "notification";
      this.router.navigate(["landingPage/team"], {
        queryParams: temp,
      });
    } else if (item["notifyType"] === "JOINED_NETWORK" || item["notifyType"] === "NETWORK_INVITE_SENT") {
      this.notificationRead(item["notifyId"], null)
      const temp = item["notifyData"];
      temp.routeFrom = "notification";
      this.router.navigate(["landingPage/network"], {
        queryParams: temp,
      });
    } else if (
      item["notifyType"] === "BUSINESS_PAGE_FOLLOWER_INVITE_SENT"
    ) {
      this.notificationRead(item["notifyId"], null)
      // //console.log("passing thru this");
      localStorage.setItem("businessId", item["notifyEntityId"]);
      this.router.navigate(["/business"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "BUSINESS_EMPLOYEE_REQUEST_REJECTED") {
      this.notificationRead(item["notifyId"], null)
      localStorage.setItem("businessId", item["notifyEntityId"]);
      this.router.navigate(["/business"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "BUSINESS_EMPLOYEE_REQUEST_ACCEPTED") {
      this.notificationRead(item["notifyId"], null)
      localStorage.setItem("businessId", item["notifyEntityId"]);
      this.router.navigate(["/business"], {
        queryParams: item["notifyData"],
      });
    }
    else if (
      item["notifyType"] === "BUSINESS_EMPLOYEE_INVITE_REQUEST"
    ) {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "requestsReceived"
      localStorage.setItem("businessId", item["notifyEntityId"]);
      this.router.navigate(["/business"], {
        queryParams: item["notifyData"],
      });
    } else if (
      item["notifyType"] === "BUSINESS_EMPLOYEE_INVITE_SENT"
    ) {
      this.notificationRead(item["notifyId"], null)
      localStorage.setItem("businessId", item["notifyEntityId"]);
      this.router.navigate(["/business"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "COMMUNITY_USER_JOINED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "memberspage"
      localStorage.setItem("communityId", item["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "COMMUNITY_MEMBER_INVITE_REQUEST") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "memberspage"
      localStorage.setItem("communityId", item["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: item["notifyData"],
      });
    }
    else if (item["notifyType"] === "NETWORK_INVITE_CANCELLED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["networkPage/home"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "CONNECTION_REMOVED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["/personalProfile"], {
        queryParams: { userId: item["notifyEntityId"] },
      });
    } else if (item["notifyType"] === "NETWORK_CONNECT_REQUEST_REJECTED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.networkOwnerId = localStorage.getItem('userId')
      this.router.navigate(["networkPage/members"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "User_itself_remove_from_teams") {
      this.notificationRead(item["notifyId"], null)
      localStorage.setItem('teamId', item["notifyData"]['teamId'])
      item.notifyData.teamsOwnerId = localStorage.getItem('userId')
      this.router.navigate(["teamPage/members"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "TEAMS_REMOVED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["teamPage/home"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "CONNECT_REQUEST_CANCELLED") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["/personalProfile"], {
        queryParams: { userId: item["notifyEntityId"] },
      });
    } else if (item["notifyType"] === "TEAM_CONNECT_REQUEST_ACCEPTED") {
      this.notificationRead(item["notifyId"], null)
      localStorage.setItem('teamId', item["notifyData"]['teamId'])
      item.notifyData.teamsOwnerId = localStorage.getItem('userId')
      this.router.navigate(["teamPage/members"], {
        queryParams: item["notifyData"],
      });
      // } else if (item["notifyType"] === "TEAM_CONNECT_REQUEST_CANCELLED") {
      //   this.notificationRead(item["notifyId"], null)
      //   localStorage.setItem('teamId', item["notifyData"]['teamId'])
      //   item.notifyData.teamsOwnerId = localStorage.getItem('userId')
      //   this.router.navigate(["teamPage/members"], {
      //     queryParams: item["notifyData"],
      //   });
      // }
    } else if (item["notifyType"] === "BUSINESS_PAGE_FOLLOWER_INVITE_SENT") {
      this.notificationRead(item["notifyId"], null)
      localStorage.setItem("businessId", item["notifyEntityId"]);
      this.router.navigate(["/business"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "LEFT_FROM_MSG_GRP") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["/personalProfile"], {
        queryParams: { userId: item["notifyEntityId"] },
      });
    } else if (item["notifyType"] === "REMOVED_FROM_MSG_GRP") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["/message"], {
        queryParams: { userId: item["notifyData"] },
      });
    } else if (item["notifyType"] === "ADDED_TO_MSG_GRP") {
      this.notificationRead(item["notifyId"], null)
      this.router.navigate(["/message"], {
        queryParams: { userId: item["notifyData"] },
      });
    } else if (item["notifyType"] === "User_itself_remove_from_Network") {
      this.notificationRead(item["notifyId"], null)
      // item.notifyData.routeFrom = "memberLeftNotification"
      item.notifyData.networkOwnerId = localStorage.getItem('userId')
      this.router.navigate(["networkPage/members"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "BUSINESS_FOLLOWER_ADDED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "follower"
      this.router.navigate(["business"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "COMMUNITY_USER_REQUEST_REJECTED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "home"
      localStorage.setItem("communityId", item["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "COMMUNITY_MEMBER_REQUEST_ACCEPTED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "home"
      localStorage.setItem("communityId", item["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "COMMUNITY_MEMBER_REQUEST_REJECTED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "home"
      localStorage.setItem("communityId", item["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "COMMUNITY_USER_REQUEST_ACCEPTED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "home"
      localStorage.setItem("communityId", item["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "COMMUNITY_USER_INVITE_REQUEST_REJECTED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "memberspage"
      localStorage.setItem('communityId', item.notifyData.communityId)
      localStorage.setItem('isAdmin', 'false')
      localStorage.setItem('isSuperAdmin', 'true')
      localStorage.setItem('screen', 'community')
      localStorage.setItem('adminviewflag', 'false')
      localStorage.setItem("communityId", item["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "COMMUNITY_USER_INVITE_REQUEST_ACCEPTED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "memberspage"
      localStorage.setItem('communityId', item.notifyData.communityId)
      localStorage.setItem('isAdmin', 'false')
      localStorage.setItem('isSuperAdmin', 'true')
      localStorage.setItem('screen', 'community')
      localStorage.setItem('adminviewflag', 'false')
      localStorage.setItem("communityId", item["notifyEntityId"]);
      this.router.navigate(["/community"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "BUSINESS_FOLLOWER_INVITE_REQUEST_REJECTED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "follower"
      this.router.navigate(["business"], {
        queryParams: item["notifyData"],
      });
    } else if (item["notifyType"] === "BUSINESS_FOLLOWER_INVITE_REQUEST_ACCEPTED") {
      this.notificationRead(item["notifyId"], null)
      item.notifyData.menu = "follower"
      this.router.navigate(["business"], {
        queryParams: item["notifyData"],
      });
    }
  }
  resendCommunityJoinRequest(value, index) {
  }
  markAsRead(value, index) {
    this.funtioncallFlag = true
    this.notificationRead(value["notifyId"], index)
  }
  acceptConnection(value, index) {
    this.funtioncallFlag = true
    // this.notificationRead(value["notifyId"], index)
    var data: any = {};
    data.userId = localStorage.getItem("userId");
    data.connectedUser = value.notifyData.userId;
    data.status = "CONNECTED";
    this.util.startLoader();
    this.api.create("user/connect/accept", data).subscribe((res) => {
      if (res.code == "00000") {
        this.util.stopLoader();
        Swal.fire({
          icon: "success",
          title: "Request accepted successfully",
          // title: "Connection Request",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.deleteFromNotification(index)
        })
      } else {
        this.util.stopLoader();
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Connection accept request failed. Please try after a while.",
          showConfirmButton: false,
          timer: 4000,
        });
      }
    });
  }
  rejectConnection(value, index) {
    this.funtioncallFlag = true
    // this.notificationRead(value["notifyId"], index)
    var data: any = {};
    data.userId = localStorage.getItem("userId");
    data.connectedUser = value.notifyData.userId;
    data.status = "REJECTED";
    this.util.startLoader();
    this.api.create("user/connect/accept", data).subscribe((res) => {
      if (res.code == "00000") {
        this.util.stopLoader();
        Swal.fire({
          position: "center",
          icon: "success",
          // title: "Connection Request",
          title: "Connection request rejected",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.deleteFromNotification(index)
        })
      } else {
        this.util.stopLoader();
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops...",
          text: "Something went wrong. Please try after some time.",
          showConfirmButton: false,
          timer: 2000,
        })
      }
    });
  }
  // COMMUNITY_USER_INVITE_REQUEST
  acceptCommunityInvitation(value, index) {
    this.funtioncallFlag = true
    // this.notificationRead(value["notifyId"], index)
    let data: any = {};
    data.entityId = value.notifyData.communityId
    data.userId = localStorage.getItem('userId');
    this.util.startLoader()
    this.api.create("community/accept/invite", data).subscribe(res => {
      this.util.stopLoader()
      if (res.code == "00000") {
        // this.getnotificationView()
        Swal.fire({
          icon: "success",
          title: "You have successfully joined Community",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.deleteFromNotification(index)
        })
      } else {
        this.util.stopLoader()
        // this.getnotificationView()
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops...",
          text: "Please try again some time later.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
  }
  rejectCommunityInvitation(value, index) {
    this.funtioncallFlag = true
    // this.notificationRead(value["notifyId"], index)
    let datas: any = {};
    datas.entityId = value.notifyData.communityId
    datas.userId = localStorage.getItem('userId');
    this.util.startLoader()
    this.api.create("community/reject/invite", datas).subscribe(res => {
      this.util.stopLoader()
      if (res.code == "00000") {
        // this.getnotificationView()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Invitation rejected",
          showConfirmButton: false,
          timer: 2500,
        }).then(() => {
          this.deleteFromNotification(index)
        })
      } else {
        this.util.stopLoader()
        // this.getnotificationView()
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops...",
          text: "Please try again some time later.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
  }
  addOrRejectMemberToCommunity(values, status, index) {
    this.funtioncallFlag = true
    // this.notificationRead(values["notifyId"], index)
    let data: any = {}
    data.communityId = values.notifyData.communityId;
    data.userId = values.notifyData.userId
    data.communityJoinStatus = status
    this.util.startLoader()
    this.api.create('community/join/acceptrequest', data).subscribe(res => {
      this.util.stopLoader()
      // this.requestlist()
      if (res.code == '00000') {
        // this.getnotificationView()
        if (status == 'ACCEPT') {
          Swal.fire({
            icon: "success",
            title: "Member successfully added to Community",
            // title: "Community Join Request",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            this.deleteFromNotification(index)
          })
        } else if (status == 'REJECT') {
          Swal.fire({
            icon: "success",
            title: "Request rejected",
            // title: "Community Join Request",
            showConfirmButton: false,
            timer: 2500,
          }).then(() => {
            this.deleteFromNotification(index)
          })
        }
      } else {
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Something went wrong. Please, try again later.",
          showConfirmButton: false,
          timer: 4000,
        })
      }
      let val = localStorage.getItem('reqcount');
      if (!isNaN(Number(val))) {
        let numberValue = Number(val);
        if (numberValue > 0) {
          localStorage.setItem('reqcount', (numberValue - 1).toString());
        }
      }
    });
  }
  rejectNetworkMemberInvitation(value, index) {
    this.funtioncallFlag = true
    // this.notificationRead(value["notifyId"], index)
    var usId = localStorage.getItem("userId");
    var obj: any = {};
    obj.memberUserId = usId;
    obj.networkId = value.notifyData.networkId;
    obj.status = "REJECT";
    this.api.create("network/reject/invite", obj).subscribe((res) => {
      if (res.code == "00000") {
        // this.getnotificationView()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Network invitation rejected",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.deleteFromNotification(index)
          this.netCls.ngOnInit();
        })
      } else if (res.code == "99999") {
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops...",
          text: "Something went wrong. Please try again later.",
          showConfirmButton: false,
          timer: 3000,
        })
      }
    });
  }
  acceptNetworkMemberInvitation(value, index) {
    this.funtioncallFlag = true
    // this.notificationRead(value["notifyId"], index)
    var usId = localStorage.getItem("userId");
    var obj: any = {};
    obj.memberUserId = usId;
    obj.networkId = value.notifyData.networkId;
    obj.status = "ACCEPT";
    this.util.startLoader()
    this.api.create("network/accept/member", obj).subscribe((res) => {
      if (res.code == "00000") {
        this.util.stopLoader()
        // this.getnotificationView()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "You have been successfully added to Network",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.deleteFromNotification(index)
          this.netCls.ngOnInit();
        })
      } else {
        this.util.stopLoader()
        // this.getnotificationView()
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops...",
          text: "Please try again some time later.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
  }
  rejectTeamInvitation(dataInput, index) {
    this.funtioncallFlag = true
    var usId = localStorage.getItem("userId");
    var obj: any = {};
    obj.memberUserId = usId;
    obj.teamId = dataInput.notifyData.teamId;
    obj.status = "REJECT";
    this.util.startLoader();
    this.api.create("teams/accept", obj).subscribe((res) => {
      this.util.stopLoader();
      if (res.code == "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Invitation rejected",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.deleteFromNotification(index)
          this.tmCls.filterApi(undefined);
        })
      } else {
        this.util.stopLoader()
        // this.getnotificationView()
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops...",
          text: "Please try again some time later.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
  }
  inviteAgainToNetwork(item) {
  }
  acceptTeamInvitation(dataInput, index) {
    this.funtioncallFlag = true
    var usId = localStorage.getItem("userId");
    var obj: any = {};
    obj.memberUserId = usId;
    obj.teamId = dataInput.notifyData.teamId;
    obj.status = "ACCEPT";
    this.util.startLoader();
    this.api.create("teams/accept", obj).subscribe((res) => {
      this.util.stopLoader();
      if (res.code == "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "You've been successfully added to Team",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.deleteFromNotification(index)
          this.tmCls.filterApi("invites_received");
        })
      } else {
        this.util.stopLoader()
        // this.getnotificationView()
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops...",
          text: "Please try again some time later.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
  }
  count1: number = 0
  notificationZeroFlag: boolean = false
  getNotification(val: any): any {

    if (val) {
      this.count = this.count + 1
      if (this.count == 1) {
        this.notificationList = []
      }
      val.forEach((ele: any) => {
        let date = new Date(ele.notifyTime);
        let current: any = new Date()
        ele.notifyTime = this.util.dataconvert(current, date)
        if (ele.notifyData != null) {
          if (ele.notifyData.logo != null || ele.notifyData.logo != undefined) {
            ele.notifyData.logo = AppSettings.photoUrl + ele.notifyData.logo
          }
        }
        this.notificationList.push(ele)
        let temp = this.duplicate(this.notificationList);
        this.notificationList = temp;
      })
      this.commonVariables.notificationList = this.notificationList
      this.searchData.setCommonVariables(this.commonVariables)
    }
    // this.util.stopLoader()
  }
  duplicate(data) {
    var temp = [];
    var arr = data.filter(function (el) {
      // If it is not a duplicate, return true
      if (temp.indexOf(el.notifyId) == -1) {
        temp.push(el.notifyId);
        return true;
      }
      return false;
    });
    return arr;
  }
}
