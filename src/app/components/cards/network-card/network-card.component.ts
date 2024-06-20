import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkComponent } from 'src/app/page/homepage/network/network.component';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { JobService } from 'src/app/services/job.service';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { NetworkUser } from 'src/app/types/NetworkUser';
import Swal from 'sweetalert2';
import { PricePlanService } from '../../Price-subscritions/priceplanService';
import { AppSettings } from './../../../services/AppSettings';

@Component({
  selector: 'app-network-card',
  templateUrl: './network-card.component.html',
  styleUrls: ['./network-card.component.scss']
})
export class NetworkCardComponent implements OnInit {

  @Input()  userDataInput: NetworkUser;
  @Input() loading: boolean;
  @Output() onSubmit = new EventEmitter<string>();
  userId: any = localStorage.getItem('userId')

  constructor(private router: Router,
    private searchDatas: SearchData,
    private api: ApiService,
    private util: UtilService,
    private pricePlan: PricePlanService,
    private JobServicecolor: JobService,
    private netCls: NetworkComponent) {

  }
  flag: boolean = false;
  textContent: string;

  ngOnInit() {
    console.log(this.loading);
    const validNetworks: string[] = ['recruiter network', 'job seeker network', 'bench sales network'];
    if (validNetworks.includes(this.userDataInput.networkNameLowerCase.toString().toLowerCase())) {
        this.flag = true;
    }
    this.textContent = this.contentchanges(this.userDataInput.networkName);

    if (this.userDataInput.members) {
      this.userDataInput.members.forEach(element => {

        if (element.photo != null) {
          element.image = AppSettings.photoUrl + element.photo;
        } else {
          element.image = null;
        }
      });
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
  contentchanges(networkname: string) {
    let textContent: string;
    switch (networkname) {
      case 'Bench Sales Network':
      case "BENCH SALES NETWORK":
        textContent = `Your Connections who are Bench Sales Recruiters will be available in this Network`
        break;
      case 'Freelance Recruiter Network':
      case "FREELANCE RECRUITER NETWORK":
        textContent = `Your Connections who are Freelance Recruiters will be available in this Network`
        break;
      case 'Management Talent Acquisition Network':
      case "MANAGEMENT TALENT ACQUISITION NETWORK":
        textContent = `Your Connections who are Talent Acquisition Managers will be available in this Network`
        break;
      case 'Recruiter Network':
      case "RECRUITER NETWORK":
        textContent = `Your Connections who are Recruiters will be available in this Network`
        break;
        case 'Job Seeker Network':
            textContent = `Your Connections who are Job seekers will be available in this Network`
            break;
    }
    return textContent;
  }
  async activate(value) {

    const userData = await this.pricePlan.UPDATE_USERDETAILS("PERSONAL_NETWORKS");

    if (userData.isExpired) {
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
      userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
        if (ele.benefitKey == 'PERSONAL_NETWORKS') {
          availablePoints = ele.available
          actualPoints = ele.actual
          utilizedPoints = ele.utilized
          promotional = ele.promotional
        }
      })
      this.pricePlan.expiredPopup("PERSONAL_NETWORKS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);

    } else {
      this.util.startLoader()
      this.api.create("network/activate/" + value.networkId, null)
        .subscribe((res) => {
          if (res.code === "00000") {
            this.util.stopLoader()
            this.userDataInput.status = "ACTIVE"
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Network activated successfully",
              showConfirmButton: false,
              timer: 2000,
            }).then((result) => {
              var values: any = {}
              values.boolean = true
              this.searchDatas.setBooleanValue(values)
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

  }

  reject(dataInput) {
    var usId = localStorage.getItem("userId");
    var obj: any = {};
    obj.memberUserId = usId;
    obj.networkId = dataInput.networkId;
    obj.status = "REJECT";
    this.util.startLoader();
    this.api.create("network/reject/invite", obj).subscribe((res) => {
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

  deletenet(value, param) {
    if (param == "delete") {
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
          text: "You will still be able to retrieve the network if you change your mind.",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.util.startLoader()
            this.api
              .delete("network/delete/" + value.networkId)
              .subscribe((res) => {
                if (res.code === "00000") {
                  this.util.stopLoader()
                  this.router.navigate(["landingPage/network"]);
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Network deactivated successfully.",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                  this.onSubmit.emit(GigsumoConstants.SUCESSCODE);
                } else {
                  this.util.stopLoader()
                  Swal.fire({
                    position: "center",
                    icon: "info",
                    title: "Oops..",
                    text: "Something went wron. Please, try again later.",
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
    } else if (param == "leave") {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure you want to leave this network?",
          text: "You can only become a member in the network again if the admin sends you an inviation to join network.",
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
                "network/delete/member?status=LEFT&userId=" +
                localStorage.getItem("userId") +
                "&networkId=" +
                value.networkId
              )
              .subscribe((res) => {
                if (res.code == "00000") {
                  this.router.navigate(["landingPage/network"]);
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Left successfully ",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                  this.onSubmit.emit(GigsumoConstants.SUCESSCODE);
                }
              }, err => {
                this.util.stopLoader();
              });
          }
        });
    }
    if (value == "message") {
    }
  }


  commonVariables: any = {};
  mgsBtn(value) {
    const datas: any = {};
    datas.networkId = value.networkId;
    datas.recipientId = value.networkId;
    datas.refererId = value.networkId;
    // datas.groupId=value.networkId;

    datas.type = "NETWORK";
    this.api
      .query("message?type=NETWORK&groupId=" + datas.groupId)
      .subscribe((res) => {
        // console.log('Message data :', res)
        this.router.navigate(["message"], { queryParams: datas });
      }, err => {
        this.util.stopLoader();
      });
  }

  accept(dataInput) {
    var usId = localStorage.getItem("userId");
    var obj: any = {};
    obj.memberUserId = usId;
    obj.networkId = dataInput.networkId;
    obj.status = "ACCEPT";
    this.util.startLoader();
    this.api.create("network/accept/member", obj).subscribe((res) => {
      this.util.stopLoader();
      if (res.code == "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "You have been added to " + dataInput.networkName,
          showConfirmButton: false,
          timer: 2000,
        });
        this.onSubmit.emit(GigsumoConstants.SUCESSCODE)
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while accepting request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  redirectPage(data) {
    if (data.status != 'INACTIVE' && data.memberStatus == 'ACTIVE') {
      data.menu = "members";
      this.router.navigate(['networkPage/members'], { queryParams: data })
    }
  }


  close(event) {
    event.stopPropagation();
  }

  networkdata(data) {
    if (data.status != 'REQUEST_SENT' && data.status != 'INACTIVE' && data.memberStatus == 'ACTIVE') {
      localStorage.setItem('networkId', data.networkId);
      this.searchDatas.setnetpathdata(data);
      data.menu = "home";
      data.master = "NETWORK";
      this.router.navigate(['networkPage/home'], { queryParams: data })
    }
  }
  routepage(str, datas) {
    var data: any = {}
    data.networkflag = true
    data.networkName = (datas.isDefaultNetwork != undefined && datas.isDefaultNetwork)  ? datas.networkName.replace(/ /g, "_").toUpperCase() : "OWNER";
    if (str === 'JOBS' && datas.jobsCount > 0&& datas.status != 'INACTIVE') {
      this.router.navigate(['newjobs'], { queryParams: data });
      this.searchDatas.setHighlighter('newjobs')
    }
    if (str === 'CANDIDATES' && datas.candidatesCount > 0 && datas.status != 'INACTIVE') {
      this.router.navigate(['newcandidates'], { queryParams: data });
      this.searchDatas.setHighlighter('newcandidates')
    }


  }





}
