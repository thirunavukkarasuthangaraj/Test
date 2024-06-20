import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { TeamComponent } from "src/app/page/homepage/team/team.component";
import { AppSettings } from "src/app/services/AppSettings";
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from "src/app/services/api.service";
import { JobService } from 'src/app/services/job.service';
import { SearchData } from "src/app/services/searchData";
import { UtilService } from "src/app/services/util.service";
import { TeamUser } from "src/app/types/TeamUser";
import Swal from "sweetalert2";
import { PricePlanService } from "../../Price-subscritions/priceplanService";

@Component({
  selector: "app-teamcard",
  templateUrl: "./teamcard.component.html",
  styleUrls: ["./teamcard.component.scss"],
})
export class TeamcardComponent implements OnInit {
  @Input()
  userDataInput: TeamUser;
  userId: any = localStorage.getItem("userId");
  GigsumoConstant = GigsumoConstants;
  @Output() teamsEmitter = new EventEmitter<{ value: any; flag: string }>();
  @Output() onSubmit = new EventEmitter<string>();
  @Input() showCheckBox: any;
  @Input() stopcheckbox: any;

  acceptRejectBtn;
  constructor(
    private router: Router,
    private api: ApiService,
    private util: UtilService,
    private searchData: SearchData,
    private pricePlan: PricePlanService,
    private tmCls: TeamComponent,
    private JobServicecolor: JobService
  ) {

  }

  ngOnInit() {
    this.acceptRejectBtn = localStorage.getItem("acceptRejectBtn");
    if (this.userDataInput.members) {
      this.userDataInput.members.forEach((element) => {
        if (element.photo != null) {
          element.image = ""
          element.image = AppSettings.photoUrl + element.photo;
        } else {

          element.image = null;
        }
      });
    }


    if (this.showCheckBox == undefined || this.showCheckBox == null) {
      this.showCheckBox = 0;
    }
  }

  getInitialstwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname,lastname);
  }

  getColortwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname,lastname);
  }

  close() { }


  onNgModelChange(event, val) {
    if (this.showCheckBox == undefined || this.showCheckBox == null) {
      this.showCheckBox = 0;
    }
    if (event == true) {
      let data: any = {};
      data.teamId = val;

      this.teamsEmitter.emit({ value: val, flag: "true" });
      this.userDataInput.isSelected = true;
    } else if (event == false) {
      this.teamsEmitter.emit({ value: val, flag: "false" });
      this.userDataInput.isSelected = false;
    }
  }




  reject(dataInput) {
    // {
    //   "memberUserId"	:"374205224040898200511",
    //   "teamId"	:"8b155958-c0ef-482f-bc8e-ca1d5d6de2c1",
    //   "status" : ""
    // }

    var usId = localStorage.getItem("userId");

    var obj: any = {};
    // obj.teamMemberId = usId;
    // obj.teamMemberId = usId;
    obj.memberUserId = usId;
    obj.teamId = dataInput.teamId;
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
        });
        this.onSubmit.emit(GigsumoConstants.SUCESSCODE);
      }
    }, err => {
      this.util.stopLoader();

    });
  }

  mgsBtn(values) {
    const datas: any = {};
    // datas.groupId = this.pathdata.teamId;
    datas.refererId = values.teamId;
    datas.teamId = values.teamId;

    datas.type = "TEAM";
    this.api
      .query("message?type=TEAM&groupId" + datas.groupId)
      .subscribe((res) => {
        // console.log('Message data :', res)
        this.router.navigate(["message"], { queryParams: datas });
      }, err => {
        this.util.stopLoader();
      });
  }

  deleteTeam(values, param) {

    if (param == 'delete') {
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
          text: "You will still be able to retrieve the team after deactivation, if you change your mind.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.util.startLoader()
            this.api
              .delete("teams/deactivate/" + values.teamId)
              .subscribe((res) => {
                if (res.code === "00000") {
                  this.util.stopLoader()
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Team deactivated successfully.",
                    // showConfirmButton: true,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  this.onSubmit.emit(GigsumoConstants.SUCESSCODE);
                  // this.ngOnInit();
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
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
    } else if (param == 'leave') {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure you want to leave?",
          text: "You can only come back to the team if the admin sends you a join invitation.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.util.startLoader()
            this.api
              .delete("teams/delete/member?userId=" +
                localStorage.getItem("userId") + "&type=LEFT" +
                "&teamId=" +
                values.teamId)
              .subscribe((res) => {
                if (res.code === "00000") {
                  this.router.navigate(["landingPage/team"]);

                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "You have left the Team successfully",
                    // showConfirmButton: true,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  this.onSubmit.emit(GigsumoConstants.SUCESSCODE);
                  // this.ngOnInit();
                }
              }, err => {
                this.util.stopLoader();
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
    }

  }

  async activateTeam(data) {

    const userData = await this.pricePlan.UPDATE_USERDETAILS("TEAM_WORKSPACES");

    if (userData.isExpired) {
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
      userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
        if (ele.benefitKey == 'TEAM_WORKSPACES') {
          availablePoints = ele.available
          actualPoints = ele.actual
          utilizedPoints = ele.utilized
          promotional = ele.promotional
        }
      })
      this.pricePlan.expiredPopup("TEAM_WORKSPACES", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);


      return;
    } else {
      this.util.startLoader()
      let teamId = data.teamId;
      this.api
        .create("teams/activate/" + teamId, null)
        .subscribe((res) => {
          if (res.code === "00000") {
            this.userDataInput.status = "ACTIVE"
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Team has been activated.",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              var values: any = {}
              values.boolean = true
              this.searchData.setBooleanValue(values)
            });
          } else if (res.code === "10006") {
            this.util.stopLoader()
            Swal.fire({
              icon: 'info',
              position: "center",
              title: 'Business is not Active you cannot Activate Team ',
              showConfirmButton: false,
              timer: 2000

            })
          }
          else if (res.code === "10004") {
            this.util.stopLoader()
            Swal.fire({
              title: 'Business page not exist',
              showClass: {
                popup: 'Business is not exist  You cannot Activate Team'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            })
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


  }


  accept(dataInput) {
    var usId = localStorage.getItem("userId");

    var obj: any = {};
    obj.memberUserId = usId;
    obj.teamId = dataInput.teamId;
    obj.status = "ACCEPT";
    this.util.startLoader();
    this.api.create("teams/accept", obj).subscribe((res) => {
      if (res.code == "00000") {
        this.onSubmit.emit(GigsumoConstants.SUCESSCODE);
        this.userDataInput.status = "ACCEPT"
        this.util.stopLoader();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "You've been added to " + dataInput.teamName,
          showConfirmButton: false,
          timer: 2000,
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

  visitTeam(data) {

    if (this.acceptRejectBtn == "false" && data.status != 'RequestsReceived' && data.status != 'DEACTIVATED' && data.memberStatus != 'RequestsReceived') {
      localStorage.setItem("teamId", data.teamId);
      data.menu = "home";
      data.master = "TEAM";
      if (this.stopcheckbox == undefined || this.stopcheckbox == null) {
        this.router.navigate(["teamPage/home"], { queryParams: data });
      } else if (this.stopcheckbox == true) {
        return true;
      }

    }
  }

  redirectPage(data) {

    if (data.status != "DEACTIVATED" && data.memberStatus != 'RequestsReceived') {
      this.router.navigate(['teamPage/members'], { queryParams: data })
    }
  }

}
