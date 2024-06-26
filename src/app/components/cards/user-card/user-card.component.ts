import { Component, OnInit, Input, EventEmitter, Output, ElementRef } from "@angular/core";
import { User } from "src/app/types/User";
import { ApiService } from "src/app/services/api.service";
import { UserCardConfig } from "src/app/types/UserCardConfig";
import { AppSettings } from "src/app/services/AppSettings";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UtilService } from "src/app/services/util.service";
import Swal from "sweetalert2";
import { UserBadgeComponent } from "../../landing-page/user-badge/user-badge.component";
import { CommonValues } from "src/app/services/commonValues";
import { read } from "fs";
import { JobService } from "src/app/services/job.service";
declare var $: any;

@Component({
  selector: "app-user-card",
  templateUrl: "./user-card.component.html",
  styleUrls: ["./user-card.component.scss"],

})

export class UserCardComponent implements OnInit {
  private _adminFlag: boolean = false;
  user: User;
  userId: String;
  ready: boolean = false;
  hide: boolean = false;
  selfUser: boolean = false;
  lblName
  ownerNameMember
  ownerName
  primaryButton: UserCardConfig;
  dropdownList: UserCardConfig[] = [];
  dropdownListTemp: UserCardConfig[] = [];
  bntStyle
  @Input()
  userIdInput: String;

  businessId: any;

  @Input() hideButton: boolean = true;

  @Input()
  userDataInput: User;

  @Input()
  config: UserCardConfig[];

  @Input()
  refresh: boolean = false;

  @Input()
  showFooter: boolean = true;

  @Input()
  button: string = "PRIMARY";
  @Input()
  labelName: String;
  @Output() handleEvent = new EventEmitter();
  communityValues: any;
  colors: Array<any> = ["hgreen", "hred", "horange", "hyellow"];
  selColor: string;
  loaded: boolean = false;
  constructor(
    private API: ApiService,
    private router: Router,
    private util: UtilService,
    private userbadges: UserBadgeComponent,
    private _eref: ElementRef,
    private commonvalues: CommonValues,
    private route: Router,
    private aroute: ActivatedRoute,
    private JobServicecolor:JobService,
  ) // private connectionData: ConnectionComponent
  {
    this.randomColor();

    this.commonvalues.getcommunitydata().subscribe((res) => {
      this.communityValues = res;
    });

  }

  @Input()
  set adminFlag(adminFlag: boolean) {
    this._adminFlag = adminFlag;
    if (this.ready) {
      if (this.button === "PRIMARY") {
        this.initCard();
      } else {
        this.initSecondaryButton();
      }
    }
  }

  randomColor(): void {
    this.selColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }



  ngOnInit() {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.showName();
    let loggedInUser = localStorage.getItem("userId");
    if (this.userDataInput == null || this.userDataInput == undefined) {

      if (loggedInUser == this.userIdInput) {
        this.selfUser = true;
        this.lblName = this.labelDisplay(this.labelName);
      }
      this.initUserData(this.userIdInput);
    } else {

      this.user = this.userDataInput;
      this.userId = this.user.userId;
      if (loggedInUser == this.userId) {
        this.selfUser = true;
        this.lblName = this.labelDisplay(this.labelName);
      }

      if (this.userDataInput && this.userDataInput.photo) {
        let photoUrl = this.userDataInput.photo.toLowerCase();
        this.user.photo = photoUrl.startsWith('http://') ? this.userDataInput.photo : AppSettings.photoUrl + this.userDataInput.photo;
      }

      this.initBtnCard()
    }
    if (loggedInUser == this.userId) {
      this.selfUser = true;
      this.lblName = this.labelDisplay(this.labelName);
    }

  }

  labelDisplay(labelName) {

    if (labelName == "NETWORK" || labelName == "TEAM") {
      if (this.userDataInput.label_Id == localStorage.getItem("userId")) {
        return "Owner";
      } else if (this.userDataInput.userId == localStorage.getItem("userId")) {
        return "You";
      }
    } else if (labelName == "BUSINESS" || labelName == "COMMUNITY" || labelName == undefined) {
      return "You";
    }
  }

  showName() {

    if (this.labelName == "NETWORK" || this.labelName == "TEAM") {
      if (this.userDataInput.label_Id != localStorage.getItem("userId") &&
        this.userDataInput.userId == this.userDataInput.label_Id) {
        this.ownerNameMember = "( Owner )"
        this.ownerName = "Owner"

      }

    }
  }

  initBtnCard() {
    if (this.button === "PRIMARY") {
      this.initCard();
    } else {
      this.initSecondaryButton();
    }
  }
  getInitialstwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname,lastname);
  }

  getColortwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname,lastname);
  }

  initUserData(userId: String) {
    this.userId = userId;
    this.util.startLoader();
    this.API.query("user/" + userId).subscribe((res) => {
      this.util.stopLoader();
      let tempUser: User = new User();
      tempUser.userId = userId;
      tempUser.username = res.username;
      tempUser.firstName = res.firstName;
      tempUser.lastName = res.lastName;
      tempUser.photo = res.photo ? AppSettings.photoUrl + res.photo : null;
      tempUser.organisation = res.organisation;
      tempUser.title = res.title;
      tempUser.connected = res.connected;
      tempUser.connectionStatus = res.connectionStatus;
      tempUser.connectionCnt = res.connectionCnt;
      tempUser.postCnt = res.postCnt;
      this.user = tempUser;

      this.initBtnCard();
    }, err => {
      this.util.stopLoader();
    });
  }

  initAdminButton(): void {

    this.dropdownList = [];
    let buttonConfig: UserCardConfig[] = [];
    if (this.config != undefined) {
      this.config.forEach((element) => {
        let add = element.canShow.apply(element.source, [
          this.user,
          element.source,
        ]);
        if (this._adminFlag || add == true || add == "true") {
          buttonConfig.push(element);
        }
      });
    }
    this.dropdownList = buttonConfig;
    this.dropdownListTemp = buttonConfig;
    this.ready = true;
  }

  initSecondaryButton(): void {

    if (this.button === "ADMIN") {
      this.initAdminButton();
    } else {
      this.dropdownList = [];
      let buttonConfig: UserCardConfig[] = this.commonCardButton();
      if (this.config != undefined) {
        this.config.forEach((element) => {
          let add = element.canShow.apply(element.source, [
            this.user,
            element.source,
          ]);
          if (this._adminFlag || add == true || add == "true") {
            buttonConfig.push(element);
          }
        });
      }
      this.dropdownList = buttonConfig;
      this.dropdownListTemp = buttonConfig;

      this.ready = true;
    }
  }

  private commonCardButton(): any {
    let buttonConfig: UserCardConfig[] = [];
    if (this.user.connectionStatus == "NOT_CONNECTED" ||this.user.connectionStatus == "REQUEST_PENDING"&&this.user.page != 'connectionList') {
      let connect: UserCardConfig = new UserCardConfig(
        "Connect",
        this.connect,
        null,
        true
      );
      connect.source = this;
      buttonConfig.push(connect);
    } else if (this.user.connectionStatus == "REQUEST_SENT"&&this.user.page == 'connectionList') {
      let cancelRequest: UserCardConfig = new UserCardConfig(
        "Cancel Request",
        this.cancelConnectionRequest,
        null,
        true
      );
      cancelRequest.source = this;
      buttonConfig.push(cancelRequest);
    } else if (this.user.connectionStatus == "REQUEST_PENDING"&&this.user.page == 'connectionList') {
      let acceptRequest: UserCardConfig = new UserCardConfig(
        "Accept Request",
        this.acceptRequest,
        null,
        true
      );
      acceptRequest.source = this;
      buttonConfig.push(acceptRequest);
      let rejectRequest: UserCardConfig = new UserCardConfig(
        "Reject Request",
        this.rejectRequest,
        null,
        true
      );
      rejectRequest.source = this;
      buttonConfig.push(rejectRequest);
    } else if (
      (this.user.connectionStatus == "CONNECTED" ||
        this.user.connected)
    ) {
      let sendMessage: UserCardConfig = new UserCardConfig(
        "Send Message",
        this.sendMessage,
        null,
        true
      );
      sendMessage.source = this;
      buttonConfig.push(sendMessage);
    }
    return buttonConfig;
  }


  revokeMemberCommunity(data) {
    data.userId;
    data.communityId;

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
          datas.communityId = data.communityId;
          datas.userId = data.userId;
          this.util.startLoader();
          this.API
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
                  var obj: any = {}
                  obj.boolean = true
                  this.commonvalues.setCommunityEventEmitter(obj)
                })
              }
            }, err => {
              this.util.stopLoader();

            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  }
  ulbutton:boolean=false;
  initCard(): void {

    let buttonConfig: UserCardConfig[] = this.commonCardButton();
    if (!this.selfUser) {
      if ((this.user.connectionStatus == "CONNECTED" || this.user.connected) && this.user.page == 'connectionList') {
       let removeConnection: UserCardConfig = new UserCardConfig(
          "Remove Connection",
          this.removeConnection,
          null,
          true
        );
        removeConnection.source = this;
        buttonConfig.push(removeConnection);
      }
      else if (this.user.connectionStatus != "CONNECTED") {
        let buttonConfig: UserCardConfig[] = [];
        let connect: UserCardConfig = new UserCardConfig(
          "Connect",
          this.connect,
          null,
          true
        );
        connect.source = this;
        buttonConfig.push(connect);
      }
    }
    if (this.config != undefined) {
      this.config.forEach((element) => {
        let add = element.canShow.apply(element.source, [
          this.user,
          element.source,
        ]);

        if (this._adminFlag || add == true || add == "true") {

          buttonConfig.push(element);
        }
      });
    }

    if (!this.userDataInput.showAccept) {
      this.primaryButton = buttonConfig[0];
    }
    else if (this.userDataInput.showAccept) {

      this.config.forEach((ele: UserCardConfig, i: number) => {
        if (ele.buttonName === "Accept") {
          this.primaryButton = ele;
          this.hideButton = true;
          buttonConfig.splice(i, 1);
        }
      });

      if (this.userDataInput.ignoredUser || this.userDataInput.deniedUser) {
        this.ulbutton=true;
        this.dropdownList = [
          { show: true }
        ];
        this.ready = true;
        return;
      }

    }

    this.dropdownList = buttonConfig.slice(1);
    this.ready = true;
  }

  onclick(buttonConfig: UserCardConfig) {
    if (buttonConfig.buttonName == "Remove Connection" || buttonConfig.buttonName == "Reject Request" || buttonConfig.buttonName == "Cancel Request") {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      var text = buttonConfig.buttonName.toLowerCase()
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "Do you want to " + text + " for this user?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes ",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            buttonConfig.clickHandler.apply(buttonConfig.source, [
              this.user,
              buttonConfig.source,
            ]);
          } else if (result.dismiss === Swal.DismissReason.cancel) { }
        });


    } else {
      buttonConfig.clickHandler.apply(buttonConfig.source, [
        this.user,
        buttonConfig.source,
      ]);
    }
  }



  connect(user: User) {
    let datas: any = {};
    datas.userId = user.userId;
    datas.requestedBy= localStorage.getItem('userId');
    this.util.startLoader();
    this.API.create("user/connect", datas).subscribe((conData) => {
      this.util.stopLoader();
      console.warn("Connection Response data: ", conData);
      if (conData.code === "00000") {
        Swal.fire({
          icon: "success",
          title: "Connection request sent successfully",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          this.emitEvent("Connection request sent successfully", user);
        });
        this.user.connected = false;
        this.user.connectionStatus = "REQUEST_SENT";
        this.initBtnCard();
      } else if (conData.code === "88888") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops..",
          text: "Sorry, connection request failed. Please try after some time",
          showConfirmButton: false,
          timer: 3000,
        });

      }
    }, err => {
      this.util.stopLoader();
    });
  }

  acceptRequest(user: User) {

    let data: any = {};
    data.connectedUser = this.userId;
    data.status = "CONNECTED";

    this.util.startLoader();
    this.API.create("user/connect/accept", data).subscribe((conData) => {
      this.util.stopLoader();
      console.warn("Connection Response data: ", conData);
      if (conData.code === "00000") {
        this.user.connected = true;
        this.user.connectionStatus = "CONNECTED";

        this.dropdownList = this.dropdownListTemp;
        this.emitEvent("ACCEPTCONNECT", user);
        this.userbadges.profileStatus();


        this.initBtnCard();



      } else if (conData.code === "88889") {

        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops..",
          text: "Sorry, accept request failed. Please try after some time",
          showConfirmButton: false,
          timer: 3000,
        });

      }
    }, err => {
      this.util.stopLoader();

    });
  }

  rejectRequest(user: User) {
    let data: any = {};
    data.connectedUser = this.userId;
    data.status = "REJECTED";
    this.util.startLoader();

    this.API.create("user/connect/accept", data).subscribe((conData) => {
      this.util.stopLoader();
      console.warn("Connection Response data: ", conData);
      if (conData.code === "00000") {
        this.userbadges.profileStatus();
        Swal.fire({
          icon: "success",
          title: "Connection has been rejected",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          this.emitEvent("REJECTEDCONNECT", user);
        });

        this.user.connected = false;
        this.user.connectionStatus = "NOT_CONNECTED";
        this.initBtnCard();
      } else if (conData.code === "88889") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops..",
          text: "Sorry, reject request failed. Please try after some time",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }, err => {
      this.util.stopLoader();

    });
  }

  cancelConnectionRequest(user: User) {
    let cancelData: any = {};
    cancelData.userId = user.userId;

    this.util.startLoader();
    this.API.create("user/connect/cancel", cancelData).subscribe((res) => {
      this.util.stopLoader();

      if (res.code === "00000") {

        Swal.fire({
          icon: "success",
          title: "Connection request cancelled",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          this.emitEvent("CANCEL_CONNECT_REQUEST", user);
        });

        this.user.connectionStatus = "NOT_CONNECTED";
        this.initBtnCard();
      } else if (res.code === "88888") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops..",
          text: "Sorry, unable to cancel connection",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }, err => {
      this.util.stopLoader();

    });
  }


  removeConnection(user: User) {
    let connData: any = {};
    connData.userId = user.userId;
    this.util.startLoader();
    this.API.create("user/connect/remove", connData).subscribe((res) => {
      this.util.stopLoader();

      this.userbadges.profileStatus();
      if (res.code === "00000") {

        Swal.fire({
          icon: "success",
          title: "Connection removed",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {

        });

        this.user.connectionStatus = "NOT_CONNECTED";
        this.user.connected = false;
        this.initBtnCard();
        this.emitEvent("REMOVE_CONNECTION", user);
        if (this.user.page == 'COMMUNITY' && this.user.type == 'SUPERADMIN') {
          const queryParams: Params = { menu: user.menu };
          this.route.navigate([], {
            relativeTo: this.aroute,
            queryParams: queryParams,
            queryParamsHandling: 'merge',
          });
          window.scrollTo(0, 0);

        }

      } else if (res.code === "88888") {
        this.emitEvent("NOT_CONNECTED", user);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops..",
          text: "Connection request failed. Please try after some time",
          showConfirmButton: false,
          timer: 1500,
        });

      }
    }, err => {
      this.util.stopLoader();

    });
  }

  emitEvent(event: String, data: User) {
    var cardEvent = {
      event: event,
      data: data,
    };
    this.handleEvent.emit(cardEvent);
  }

  sendMessage(user: User) {
    var userData: any = {};
    userData.groupId = user.userId;
    userData.type = "USER";
    this.router.navigate(["message"], { queryParams: userData });
  }

  navigateUserProfile(user: User) {
    var userData: any = {};
    userData.userId = user.userId;

    this.router.navigate(["personalProfile"], { queryParams: userData });

  }
}
