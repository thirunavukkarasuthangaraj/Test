import { Component, ElementRef, HostListener, Injectable, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { PricePlanService } from 'src/app/components/Price-subscritions/priceplanService';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { SearchData } from 'src/app/services/searchData';
import Swal from 'sweetalert2';
import { ModalContentComponent } from '../../model/modal-content/modal-content.component';
import { UtilService } from './../../../services/util.service';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {

  @ViewChild('landingside1') menuElement: ElementRef;
  landingsidesticky1: boolean = false;
  landingsidesticky2: boolean = false;
  elementPosition: any;
  bsModalRef: BsModalRef;
  networkdata: any = [];
  networklist: any;
  tempnetworklist = []
  userType: any = localStorage.getItem('userType');
  temp: any = [];
  noDatafound: Array<string> = ["You are not in any Network yet"];
  noDataInReqReceived: Array<string> = ["You have no requests received lately"];
  showNoDatafound: boolean = false;
  networkSearch: string;
  btnnameshow: any;
  allNetwork: boolean = false;
  requestNetwork: boolean = false;
  activeNetwork: boolean = false;
  search: any;
  netlist: string;
  searchKey
  subscriber: Subscription
  loadAPIcall:boolean=false;
  constructor(
    private api: ApiService,
    private router: Router,
    private util: UtilService,
    private searchData: SearchData,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService,
    private pricePlan: PricePlanService,
    private route: ActivatedRoute) {
  }
  ngOnInit() {
    if (
      this.route.queryParams["_value"].routeFrom != "" &&
      this.route.queryParams["_value"].routeFrom != undefined &&
      this.route.queryParams["_value"].routeFrom != null) {
      this.querynetwork("REQUEST_SENT");
    } else {
      this.querynetwork('All');
    }

    //// console.log( this.route.queryParams["_value"].routeFrom)
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    // this.elementPosition = this.menuElement.nativeElement.offsetTop;
  }

  @HostListener('window:scroll')
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 24) {
      this.landingsidesticky1 = true;
      this.landingsidesticky2 = true;
    } else {
      this.landingsidesticky1 = false;
      this.landingsidesticky2 = false;
    }
  }

  keyupdata(event) {
    if (event.target.value.length == 0) {
      this.onsearch('');
    }
  }
  onsearch(val) {
    this.search = val;
    if (val != undefined) {
      val = val.trim().toLowerCase();
    }
    this.networklist = this.tempnetworklist;

    if (this.networklist.length > 0) {
      this.networkLength = this.networklist.length
    } else {
      this.networkLength = ''
    }

    if (this.networklist.length > 0) {
      this.networkLength = this.networklist.length
    } else {
      this.networkLength = ''
    }

    this.networklist = this.filterByString(this.networklist, val);

    if (this.networklist.length > 0) {
      this.networkLength = this.networklist.length
    } else {
      this.networkLength = ''
    }

    if (this.networklist.length == 0) {
      this.showNoDatafound = true;
    } else {
      this.showNoDatafound = false;
    }

  }

  move_focus(e) {
    if (e.keyCode == 13) $("#my_btn").focus();
  }

  keypress(val) {
    if (val == undefined) {
      if (
        this.route.queryParams["_value"].routeFrom != "" &&
        this.route.queryParams["_value"].routeFrom != undefined &&
        this.route.queryParams["_value"].routeFrom != null) {
        this.querynetwork("REQUEST_SENT");
      } else {
        this.querynetwork('All');
      }
    }
  }
  querynetwork(status) {
    if (status == "All") {
      this.btnnameshow = "All Network"
      this.allNetwork = true;
      this.requestNetwork = false;
      this.activeNetwork = false;
    } else if (status == 'REQUEST_SENT') {
      this.btnnameshow = "Request Received"
      this.allNetwork = false;
      this.requestNetwork = false;
      this.activeNetwork = true;
    } else if (status == 'ACTIVE') {
      this.btnnameshow = "Active Network"
      this.allNetwork = false;
      this.requestNetwork = true;
      this.activeNetwork = false;
    }
    this.temp = [];

    this.showNoDatafound = false;
    this.loadAPIcall=true

    this.api.query("network/home?userId=" + localStorage.getItem('userId') + "&withmember=true&limit=10&offset=0&status=" + status).subscribe(res => {

        this.loadAPIcall=false
      this.networklist = res.data.network;

      if (this.networklist.length > 0) {
        this.networkLength = this.networklist.length
      } else {
        this.networkLength = ''
      }


      this.sortNetworks();
      this.util.stopLoader();
      if (this.networklist && this.networklist.length != 0 && this.networklist != null && this.networklist != undefined) {
        this.showNoDatafound = true;

        this.networklist.forEach((element, i) => {

          element.name = element.adminUserData.fullName;
          element.index = 2;
          if (localStorage.getItem('userId') == element.networkOwnerId) {
            element.index = 1;
            this.networklist = this.sort_by_keyuserid(this.networklist, 'index')

            this.tempnetworklist = this.networklist;
            if (this.networklist.length > 0) {
              this.networkLength = this.networklist.length
            } else {
              this.networkLength = ''
            }
          }
        });
      }

      if (this.networklist.length == 0) {
        this.showNoDatafound = true;
      } else {
        this.showNoDatafound = false;
        this.networklist = this.sort_by_keyuserid(this.networklist, 'index');
        this.tempnetworklist = this.networklist;

        if (this.networklist.length > 0) {
          this.networkLength = this.networklist.length
        } else {
          this.networkLength = ''
        }


      }

    }, err => {
      this.loadAPIcall=false
      this.util.stopLoader();
    });

  }
  sortNetworks() {
     this.networklist.sort((a, b) => {
      if (a.isDefaultNetwork && !b.isDefaultNetwork) return -1;
      if (!a.isDefaultNetwork && b.isDefaultNetwork) return 1;
      if (!a.isDefaultNetwork && !b.isDefaultNetwork) {
        return a.networkName.localeCompare(b.networkName);
      }
      return 0;
    });
  }

  networkLength: any;

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



  sort_by_keyuserid(array, key) {
    return array.sort(function (a, b) {
      return parseInt(a.index) - parseInt(b.index);
    });
  }

  filterByString(data, s) {
    return data.filter(e => e.networkName.toLowerCase().includes(s))
      .sort((a, b) => a.networkName.toLowerCase().includes(s) && !b.networkName.toLowerCase().includes(s) ? -1 : b.networkName.toLowerCase().includes(s) && !a.networkName.toLowerCase().includes(s) ? 1 : 0);
  }

  async openModalWithComponent() {

    // let isNetworkExpired : boolean = await this.pricePlan.UPDATE_USERDETAILS("PERSONAL_NETWORKS");
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
      // this.pricePlan.expiredPopup("PERSONAL_NETWORKS");
    }
    else {
      const initialState: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: "open"
      };
      this.bsModalRef = this.modalService.show(ModalContentComponent, initialState);
      this.bsModalRef.content.closeBtnName = 'Close';
    }

  }

  apicall(data) {
    this.util.startLoader();
    let datas: any = {};
    datas.memberUserId = localStorage.getItem('userId');
    // datas.networkId =   networkId;
    this.api.create("network/member/save", datas).subscribe(res => {
      this.util.stopLoader();
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while processing you request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }


  onSubmit(data : string){
    if(data === GigsumoConstants.SUCESSCODE){
      this.querynetwork('All');
    }
  }


}
