import { result } from 'lodash';
import { Subscription } from 'rxjs';
import { Component, TemplateRef, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AppSettings } from 'src/app/services/AppSettings';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CommonValues } from 'src/app/services/commonValues';
import { BusinessEmployeeComponent } from '../../bussinesspages/business-employee/business-employee.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { UserCardConfig } from 'src/app/types/UserCardConfig';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-community-pageadmin',
  templateUrl: './community-pageadmin.component.html',
  styleUrls: ['./community-pageadmin.component.scss']
})
export class CommunityPageadminComponent implements OnInit {
  @Input() commonemit
  userId: any
  adminSearchForm: UntypedFormGroup
  values: any = {}
  adminType: any
  modalRef: BsModalRef;
  clickEventsubscription: Subscription;
  businessDetail: any
  adminList: any = [];
  autoCompleteAdminList: any = [];
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    // class: 'modal-md'
  }
  communityId
  adminSreach:any
  serachForm: UntypedFormGroup;
  keyword = 'userName';
  item: any;
  admin_data_pop_up
  removeAdmin_userid
  removeCommunityId
  superAdmin_userid
  isAdmin
  isSuperAdmin
  userData = []
  communitySuperadmin;
  loginUserId = null;
  makeSuperAdminData = {};
  superadminflag = false;
  colors: Array<any> = ['hgreen', 'hred', 'horange', 'hyellow'];
  selColor: string;
  tempmadmin:any;
  AllData: boolean = true;
  AdminFilterDatas: any;
  admindata: boolean = false;
  revokedmember: boolean = false;
  revokedData: any;
  AdminCount: boolean = true;
  AdminCountData: boolean = false;
  AdminCountRevokeData: boolean = false;
  noDatafound : Array<string> =[ "You have no admin"];
  showNoDatafound: boolean = false;
  revokedDatatemp:any
  AdminFilterDatastemp:any
  searchKey

  constructor(
    private api: ApiService,
    private commonvalues: CommonValues,
    private employees: BusinessEmployeeComponent,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: UntypedFormBuilder,
    private util: UtilService) {
    this.loginUserId = localStorage.getItem("userId");
    this.commonvalues.getbusinessid().subscribe((res) => {
      this.values = res
    })
    this.isSuperAdmin = localStorage.getItem('isSuperAdmin');
    if (this.isSuperAdmin === "true") {
      this.superadminflag = true;
    } else {
      this.superadminflag = false;
    }
    this.randomColor();
  }

  randomColor(): void {
    this.selColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  ngOnInit() {
    this.communitySuperadmin = localStorage.getItem("communitySuperadmin")
    this.route.queryParams.subscribe((res) => {
      this.communityId = res.communityId;
    });
    this.values = this.commonemit
    this.getadmins()
    this.initiate()
  }

  initiate() {
    this.serachForm = this.fb.group({
      serachData: [''],
    });
  }



  ngAfterViewInit(): void {
    setInterval(() => {
      this.isSuperAdmin = localStorage.getItem('isSuperAdmin');
      if (this.isSuperAdmin === "true") {
        this.superadminflag = true;
      } else {
        this.superadminflag = false;
      }

    }, 700);

  }


  openModal(template: TemplateRef<any>) {
    this.members()
    this.modalRef = this.modalService.show(template, this.backdropConfig);
    this.initiate();
  }

  transferModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.backdropConfig);
  }
  superAdmin(template: TemplateRef<any>, data) {

    this.superAdmin_userid = data.userId
    this.getadmins()
    this.initiate()
    this.modalRef = this.modalService.show(template, this.backdropConfig);
  }

  makeSuperAdminTransfer(template: TemplateRef<any>, data) {

    this.makeSuperAdminData = data;
    ////// console.log(this.makeSuperAdminData);
    this.modalRef = this.modalService.show(template, this.backdropConfig);
  }

  makeSuperAdminTransferAccept() {
    ////// console.log(this.makeSuperAdminData);
    this.superAdmin_userid = this.makeSuperAdminData['userId'];
    this.makeadmin();
  }

  revoke(template: TemplateRef<any>, userId, communityId) {
    // this.employees.employees()
    this.removeAdmin_userid = userId
    this.removeCommunityId = communityId
    this.modalRef = this.modalService.show(template, this.backdropConfig);
    this.getadmins()
  }

  selectEvent(val) {
    this.item = val
    this.admin_data_pop_up = val

  }

  onChangeSearch(val) {
    ////// console.log("dddddddddddddd" + val);
  }

  selectEventtransfer(val) {
    this.superAdmin_userid = val.userId

  }

  onChangeSearchtransfer(e) {

  }


  onFocused(e) {
  }


  decline(): void {
    this.superAdmin_userid = null;
    this.admin_data_pop_up=null;
    this.modalRef.hide();
    this.serachForm.reset()
    this.getadmins();
  }


  close() {
    this.admin_data_pop_up=null;
    this.superAdmin_userid=null;
    this.modalRef.hide()
    this.serachForm.reset()
    this.getadmins();
  }

  cleardata(data){
    this.admin_data_pop_up=null;
    this.superAdmin_userid=null;
  }
  keyupdata(event){
    if(event.target.value.length==0){
      this.onsearch('');
    }
  }
  onsearch(val) {
    if(val!=undefined){  val = val.trim(); }

    if(this.AllData){
      this.values.adminlistdata =this.tempmadmin;
      this.values.adminlistdata = this.filterByString( this.values.adminlistdata, val);
      if (this.values.adminlistdata.length == 0) {
        this.showNoDatafound = true;
      } else {
        this.showNoDatafound = false;
      }
    }
    else if(this.admindata){
      this.AdminFilterDatas =this.AdminFilterDatastemp;
      this.AdminFilterDatas = this.filterByString( this.AdminFilterDatas, val);
      if (this.AdminFilterDatas.length == 0) {
        this.showNoDatafound = true;
      } else {
        this.showNoDatafound = false;
      }
    }

    else if(this.revokedmember){
      this.revokedData  =this.revokedDatatemp;
      this.revokedData = this.filterByString( this.revokedData, val);
      if (this.revokedData.length == 0) {
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


  addAdmin() {

    if (this.admin_data_pop_up !=undefined && (this.admin_data_pop_up.userId != undefined && this.admin_data_pop_up.userId != null)) {
      let data = {
        "communityId": this.communityId,
        "userId": this.admin_data_pop_up.userId,
        "adminType": "ADMIN"
      }
      this.util.startLoader()
      this.api.create('community/add/admin', data).subscribe(res => {
        this.util.stopLoader()

        if (res.code == "00000") {
          this.decline()
          //   if(this.values.employees.length!=0){
          //     this.decline()
          //   }else{
          //    this.decline()
          //  }


        }
      },err => {
        this.util.stopLoader();
        if(err.status==500){
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while adding admin. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please select an admin',
       // showConfirmButton: true,
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 2000
      })
    }
  }


  makeadmin() {

    if(this.superAdmin_userid!=undefined && this.superAdmin_userid!=null ){

    let data = {
      "communityId": this.communityId,
      "userId": this.superAdmin_userid,
      "adminType": "SUPERADMIN"
    }
    this.util.startLoader()
    this.api.create('community/add/admin', data).subscribe(res => {
    this.util.stopLoader()

      if (res.code == "00000") {
        this.decline()
        //   if(this.values.employees.length!=0){
        //     this.decline()
        //   }else{
        //    this.decline()

        //  }

      }
    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while adding admin. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  })
  }else{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Please select an admin',
     // showConfirmButton: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 2000
    })
  }
  }



  remove() {
    let data = {
      "communityId": this.communityId,
      "userId": this.removeAdmin_userid
    }
    this.util.startLoader()
    this.api.create('community/remove/admin', data).subscribe(res => {
      this.util.stopLoader()
      if (res.code === '00000') {
        this.modalRef.hide();
      }
      this.members()
      this.getadmins()
    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while processing your request. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  })
  }

  datas(datas) {
    this.userData = datas;
    this.values.menu = 'communitypageadmin';
    this.values.admin = this.userData;
    this.values.membersflage = true;
    this.commonvalues.communitydata(this.values);
  }


  adminlist(datas) {

    if(datas)
    ////// console.log('Admin list data : \n', datas)
    this.adminList = datas
    //this.adminList = this.sortData(datas)
    this.values.menu = 'communitypageadmin'
    this.values.adminlistdata = this.sort_by_key(datas,'userName');
    this.tempmadmin=this.values.adminlistdata;

     this.values.adminlistdata.forEach((element,i) => {
      if(element.userId==localStorage.getItem("userId")){
       var b =  element;
       this.values.adminlistdata[i] =   this.values.adminlistdata[0];
       this.values.adminlistdata[0] = b;
      }
    });
     this.values.membersflage = true;
     this.commonvalues.communitydata(this.values);
  }

  sort_by_key(array, key) {
    return array.sort(function(a, b) {
     var x = a[key]; var y = b[key];
     return ((x < y) ? -1 : ((x > y) ? 1 : 0));
   });
  }

  sortData(data) {
     if (data != null) {
      return data.sort((a, b) => {
        return <any>new Date(b.assignedOn) - <any>new Date(a.assignedOn);
      });
    }

  }

  members() {
    this.userData = []


    var datas = {
      "communityId": this.communityId,
      "userId": localStorage.getItem('userId'),
      "page": {
        "offSet": 0,
        "pageCount": 100
      }
    }
    this.util.startLoader();
    let data: any = {};
    data.communityId = this.communityId;
    this.showNoDatafound=false;
    this.api.create("community/connectedmembers", data).subscribe(res => {
      this.datas(this.userData)
      this.util.stopLoader();
      res.data.communityMembers.forEach(element => {
        // if (element.userId != 'undefined' || element.userId != 'null' || element.userId != '') {
           // this.api.query('user/connection/' + element.userId).subscribe(res => {
            var photos
            if (element.photo == null) {
              photos = "assets/images/userAvatar.png"
            } else if (element.photo != null) {
              photos = AppSettings.photoUrl + element.photo
            }
           this.showNoDatafound=true;
            this.userData.push({
              userName: element.firstName + " " + element.lastName,
              lastName: element.lastName,
              firstName: element.firstName ,
              photo: photos,
              organisation: element.organisation,
              title: element.title,
              status: element.status,
              userId: element.userId,
              connected: element.connected,
              communityId: element.communityId,
            })
            this.datas(this.userData)
          // })


        // }
        // else {
        //   this.util.stopLoader()
        // }
      })


    },err => {
      this.util.stopLoader();

     });

  }

  userprofile(data) {
    var userData: any = {}
    userData.userId = data
    this.router.navigate(['personalProfile'], { queryParams: userData })
  }

  sendmsg(data) {
    var userData: any = {}
    userData.groupId = data.userId
    userData.type = "USER";
    this.router.navigate(['message'], { queryParams: userData })
  }


  sendMessage(user: User) {
    var userData: any = {};
    userData.groupId = user.userId;
    userData.type = "USER";
    this.router.navigate(["message"], { queryParams: userData });
  }


  getadmins() {
    var data = this.communityId;
    this.adminList = []
    this.autoCompleteAdminList = [];
    this.util.startLoader()

    setTimeout(() => {

      this.api.query("community/admins/" + this.communityId).subscribe(res => {
        this.util.stopLoader()
        this.adminlist(this.adminList);

        res.data.communityAdminsList.forEach(element => {
             //if (this.loginUserId !== element.userId) {
            // this.util.startLoader();
            // this.api.query('user/connection/' + element.userId).subscribe(ress => {
            //   this.util.stopLoader();
              var photos
              if (element.photo == null) {
                photos = "assets/images/userAvatar.png"
              } else if (element.photo != null) {
                photos = AppSettings.photoUrl + element.photo
              }
              let color = this.colors[Math.floor(Math.random() * this.colors.length)];
              let d = {
                userName: element.firstName + " " + element.lastName,
                lastName: element.lastName,
                firstName: element.firstName ,
                fullName: element.fullName ,
                postCnt: element.postCnt ,
                connectionCnt: element.connectionCnt ,
                photo: photos,
                organisation: element.organisation,
                title: element.title,
                status: element.status,
                type: element.type,
                userId: element.userId,
                connected: element.connected,
                connectionStatus: element.connectionStatus,
                assignedOn: element.assignedOn,
                communityId: element.communityId,
                page: 'COMMUNITY',
                menu:"communitypageadmin",
                colorVal: color
              };
              this.adminList.push(d);
              if (this.loginUserId !== element.userId) {
                this.autoCompleteAdminList.push(d);
              }
              if (this.loginUserId === element.userId) {
                ////// console.log("sample test ", element.type)
                if (element.type === "SUPERADMIN") {
                  this.superadminflag = true;
                  localStorage.setItem('isSuperAdmin', "true")
                } else {
                  localStorage.setItem('isSuperAdmin', "false")
                  this.superadminflag = false;

                }
              }

              this.adminlist(this.adminList)

              this.AllData = true;
              this.admindata = false;
              this.revokedmember = false;
              this.AdminCountData = false
              this.AdminCountRevokeData = true;
            // })
            //}

        });


      },err => {
        this.util.stopLoader();
      });
    }
      , 800);

  }

  AdminFilter() {
    const AdminFilterData = {
      id: this.communityId,
      type: 'ADMIN'
    }
    this.api.create('community/filteradmin', AdminFilterData).subscribe((res) => {
      ////// console.log('AdminFilter', res)
      this.AdminFilterDatas=[]
      this.AdminFilterDatas = this.sort_by_key(res.data.communityModels,"firstName");
       res.data.communityModels.forEach(element => {
        element.userName = element.firstName + " " + element.lastName;
       });
     this.AdminFilterDatastemp=this.AdminFilterDatas;
      this.AllData = false;
      this.admindata = true;
      this.revokedmember = false;
      this.AdminCount = false;
      this.AdminCountData = true;
      this.AdminCountRevokeData = false;

    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while processing your request. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  })
  }

  revokedAdmins() {
    const revokedAdminsData = {
      id: this.communityId,
      type: 'REVOKED'
    }

    this.api.create('community/filteradmin', revokedAdminsData).subscribe((res) => {
      this.revokedData =[];
      this.revokedData = this.sort_by_key(res.data.communityModels,"firstName");;
       res.data.communityModels.forEach(element => {
        element.userName = element.firstName + " " + element.lastName;
      });
      this.revokedDatatemp=this.revokedData;
      this.AllData = false;
      this.admindata = false;
      this.revokedmember = true
      this.AdminCount = false;
      this.AdminCountData = false;
      this.AdminCountRevokeData = true;

    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while processing your request. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  })
  }
}
