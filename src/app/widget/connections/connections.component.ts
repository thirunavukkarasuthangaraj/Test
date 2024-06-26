import { AppSettings } from './../../services/AppSettings';
import { Component, Input, Output, EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { JobService } from 'src/app/services/job.service';
declare var $: any;

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss']
})
export class ConnectionsComponent implements OnInit {

  @Input('title') title: any = 'Invite your connections ';
  @Input() inputData: string;
  headerTitle: any = 'Invite your connections ';
  userConnecction: Array<any> = [];
  searchName: any;
  imgUrl: any = AppSettings.photoUrl;
  businessName: any;
  modalRef: BsModalRef;
  commonDatahide: any = {}
  apicalled:boolean=false;
  @Output() commonFunction = new EventEmitter<string>();
  admin: Array<any> = [{ src: '1.jpg' }, { src: '2.jpg' }, { src: '3.jpg' }, { src: '4.jpg' }, { src: '5.jpg' },
  { src: '6.jpg' }, { src: '7.jpg' }, { src: '8.jpg' }, { src: '9.jpg' }];
  @Input() maxMin: any = {};
  @Input() page: string;
  viewType: string = "MIN";
  pageName: any = ''
  show: Boolean = true;
  @Input() widgetDesc: string;

  constructor(private auth: ApiService,
    private router: Router,
    private util: UtilService,
    private a_route: ActivatedRoute,
    private _route: ActivatedRoute,
    private modalService: BsModalService,private JobServicecolor: JobService) {
  }

  route(item) {
    this.router.navigate(['personalProfile'], { queryParams: item });
  }


  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.menu = this.widgetDesc;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "ConnectionsComponent";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }
   // for first and last name
 getInitialName(firstname: string,lastname: string): string {
  return this.JobServicecolor.getInitialsparam(firstname,lastname);
}
 // for first and last name
 getColorName(firstname: string,lastname: string): string {
  return this.JobServicecolor.getColorparam(firstname,lastname);
}

  config = {
    itemsPerPage: 5,
    currentPage: 1
  }
  storedPage: any;

  onSearch(event: any) {
    if (event.target.value != '') {
      this.config.currentPage = 1
      this.beingTyped = true
    } else if (event.target.value == '') {
      this.config.currentPage = this.storedPage
      this.beingTyped = false
    }
  }


  ngOnInit() {

    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      if (res.master && res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }
    })

    let a = this._route.pathFromRoot[0]['_routerState']['snapshot'].url
    let b = a.substr(13, 25)
    if (b == 'communityList') {
      this.pageName = 'COMMUNITY_LIST'
    } else {
      this.pageName = 'BUSINESS_LIST'
    }
    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
    }
    if (this.inputData && this.inputData != null && this.inputData != "") {
      this.util.startLoader()

      if (this.inputData == "BUSINESS") {
        this.show = true;
        this.auth.query("business/connection/suggestion/" + localStorage.getItem('businessId')).subscribe((res) => {
          this.util.stopLoader();
          // console.log(res);
          if (res.status == 404) {
            this.hide(true);
          }
          if (res && res.length != 0 && res != undefined && res != null) {
            if (res['data'] && res['data'] != null && res['data']['connectionInvites'] && res['data']['connectionInvites'] != null) {
              this.userConnecction = res['data']['connectionInvites'];
            } else {
              this.hide(true)
            }
          } else {
            this.hide(true)
          }

        }, err => {
          this.util.stopLoader()


          // console.log(err)
        });

      } else if (this.inputData == "COMMUNITY") {

        var type = this._route.queryParams['_value'].communityType;
        var isSuperAdmin = this._route.queryParams['_value'].superAdmin;
        var isAdmin = this._route.queryParams['_value'].isAdmin;
        var isJoined = this._route.queryParams['_value'].isJoined;

        if (type == "false" && isSuperAdmin == "true" && isAdmin == "false"
          || type == "false" && isSuperAdmin == "false" && isAdmin == "true"
          || type == "false" && isSuperAdmin == "true" && isAdmin == "true"
          || type == "true" && isSuperAdmin == "true" && isAdmin == "true"
          || type == "true" && isSuperAdmin == "false" && isAdmin == "true"
          || type == "true" && isSuperAdmin == "true" && isAdmin == "false") {
          this.show = true;
        } else if (type == "true" && isJoined == "true") {
          this.show = true;
        } else {
          this.show = false;
        }

        this.auth.query("community/connection/suggestion/" + localStorage.getItem('communityId')).subscribe((res) => {
          this.util.stopLoader()
          if (res.status == 404) {
            this.hide(true);
          }
          if (res && res.length != 0 && res != undefined && res != null) {
            if (res['data'] && res['data'] != null && res['data']['connectionInvites'] && res['data']['connectionInvites'] != null && res['data']['connectionInvites'].length != 0) {
              this.userConnecction = res['data']['connectionInvites'];
            } else {
              this.hide(true)
            }
          } else {
            this.hide(true)
          }
        }, err => {
          this.util.stopLoader()

          // console.log(err)
        });

      } else if (this.inputData == "HOME") {
        this.auth.query("widget/business/connection/suggestion/" + localStorage.getItem('userId')).subscribe((res) => {
          this.util.stopLoader()

          if (res && res.length != 0 && res != undefined && res != null) {
            this.userConnecction = res;
          } else {


          }
        }, err => {
          this.util.stopLoader()
          this.hide(true)
          // console.log(err)
        });
      }
    }
  }


  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
  };

  openModal(postTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(postTemplate, this.backdropConfig);
  }
  closeModal() {
    this.modalRef.hide();
    setTimeout(() => {
      this.config.currentPage = 1
      this.userConnecction.forEach(ele => {
        ele.checked = false
      })
      // $("#xcxcv").val("");
      // document.getElementById('xcxcv').value='';
      this.searchName = ''
      this.theChecker = false
      this.selectedEntities = []
      this.checkedList = []
    }, 1000);
  }
  getInitials(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }

  getColor(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }

  duplicate(data) {
    var temp = [];
    var arr = data.filter(function (el) {
      // If it is not a duplicate, return true
      if (temp.indexOf(el) == -1) {
        temp.push(el);
        return true;
      }
      return false;
    });
    return arr;
  }

  selectedEntities: any = []
  checkedList: any = []
  page1: number = 1;

  onCheckboxChange(data, event) {
    if (event.target.checked) {
      // (option.communityId){
      // String()
      this.selectedEntities.push(String(data.userId))
      this.checkedList.push(String(data.userId))
      // this.selectedEntities = this.duplicate(this.selectedEntities)
      // }
    } else {
      // data.checked = false;
      for (var i = 0; i < this.selectedEntities.length; i++) {
        if (data.userId == data.userId) {
          this.checkedList.splice(i, 1);
          this.selectedEntities.splice(i, 1);
        }
      }
      this.theChecker = false
    }
  }

  dismiss() {
    this.modalRef.hide()
    this.config.currentPage = 1
    setTimeout(() => {
      this.userConnecction.forEach(ele => {
        ele.checked = false
      })
      // $("#xcxcv").val("");
      // document.getElementById('xcxcv').value='';
      this.selectedEntities = []
      this.checkedList = []
      this.searchName = ''
      this.theChecker = false
    }, 1000);
  }
  theChecker: any;
  beingTyped: boolean = false
  checkAll(event) {
    if (event.target.checked == true) {
      // alert('checked all')
      this.userConnecction.forEach(ele => {
        ele.checked = true
        this.selectedEntities.push(String(ele.userId))
        this.checkedList.push(String(ele.userId))
      })
    } else if (event.target.checked == false) {
      this.selectedEntities = []
      this.checkedList = []
      this.userConnecction.forEach(ele => {
        ele.checked = false
      })
    }
  }

  inviteConnectionsToFollow() {
    // let data: any = {}
    // data.userId = user.userId;
    // data.source = 'CONNECTION'
    // data.businessId = localStorage.getItem('businessId')
    //   this.util.startLoader()
    //   this.auth.create('business/visitor/send/request', data).subscribe(res => {
    //     this.util.stopLoader()
    //     if (res.code = "00000") {
    //       // this.connectionInvitesList.splice(i, 1);
    //       Swal.fire({
    //         position: 'center',
    //             icon: 'success',
    //             title: 'Invite sent successfully',
    //             showConfirmButton: false,
    //             timer: 1500
    //       }).then(()=>{
    //         this.ngOnInit()
    //       })
    //     }else{
    //       Swal.fire({
    //         position: 'center',
    //             icon: 'error',
    //             title: 'Oops..',
    //             text: 'Something went wrong. Please try again later.',
    //             showConfirmButton: false,
    //             timer: 3000
    //       })
    //     }
    //   })
  }

  tempcheckedList: any = []
  inviteAll() {
    this.apicalled=true
    if (this.inputData == 'BUSINESS') {
      var a = ''
      a = this.selectedEntities
      var busId = localStorage.getItem('businessId')
      this.util.startLoader();
      this.auth.create("business/visitor/send/requests?businessId=" + busId + "&users=" + a + "&source=CONNECTION", null).subscribe(res => {
        this.util.stopLoader();
        this.apicalled=false
        if (res.code == '00000') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Invitation sent successfully',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.ngOnInit()
            this.modalRef.hide()
          })
        }
      }, err => {
        this.util.stopLoader();
      });
    } else if (this.inputData == 'COMMUNITY') {
      var data: any = {}
      var q: any = ""
      var p: any = ""
      p = this.selectedEntities
      this.selectedEntities.forEach((element, i) => {
        if (i != this.selectedEntities.length - 1) {
          q = q + element + ","
        } else {
          q = q + element
        }
      });
      data.userId = q
      data.entityId = localStorage.getItem('communityId')
      data.source = 'CONNECTION'
      data.sentBy = localStorage.getItem('userId')
      this.util.startLoader();
      this.auth.create("community/send/invite", data).subscribe(res => {
        this.util.stopLoader();
        this.apicalled=false
        if (res.code == '0000') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Invitation sent successfully',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.ngOnInit()
            this.modalRef.hide()
          })
        }
      }, err => {
        this.apicalled=false
        this.util.stopLoader();
      });
    }
  }

  pagecount(count) {
    // this.page1 = count;
    this.config.currentPage = count
    this.storedPage = count
  }


  routeToInvitePage(data) {
    let dataPass: any = {};
    dataPass.data = data;
    if (this.inputData == "COMMUNITY") {
      dataPass.id = localStorage.getItem('communityId');
      dataPass.master = this.page;
      dataPass.masterMenu = this.inputData;
      dataPass.menu = "Invite User";
      dataPass.widgetName = "CardComponent";
      this.router.navigate(['suggestions'], { queryParams: dataPass })

    } else if (this.inputData == "BUSINESS") {
      dataPass.id = localStorage.getItem('businessId');
      data.businessName = this._route.queryParams['_value'].businessName;
      // data.master = this.page;
      // data.masterMenu = this.inputData;
      // data.showflag = true;
      // this.router.navigate(['businessConnectionsInvite'], { queryParams: data })

      dataPass.master = this.page;
      dataPass.masterMenu = this.inputData;
      dataPass.menu = "Invite User to Business";
      dataPass.widgetName = "CardComponent";
      this.router.navigate(['suggestions'], { queryParams: dataPass })
    }

  }


  hide(flag) {
    this.commonDatahide.widgetName = "ConnectionsComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }

}


