import { map } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';
import { CommonValues } from 'src/app/services/commonValues';
import { Subscription } from 'rxjs';
import { Component, TemplateRef, OnInit, Input, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AppSettings } from 'src/app/services/AppSettings';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BusinessEmployeeComponent } from '../business-employee/business-employee.component';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { UserCardConfig } from 'src/app/types/UserCardConfig';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-business-admin',
  templateUrl: './business-admin.component.html',
  styleUrls: ['./business-admin.component.scss']
})
export class BusinessAdminComponent implements OnInit, OnDestroy {
  @Input() commonemit
  businessId: any
  userId: any
  adminSearchForm: UntypedFormGroup
  // values = {businessId:"",  admin: false, menu:"", userId:"", adminType:"", admindata:[],employees:[]}
  values: any = {}
  transferId: any;
  addAdminId: any;
  emptyspace = "             "
  adminType: any
  modalRef: BsModalRef;
  clickEventsubscription: Subscription;
  businessDetail: any
  adminList: any = [];
  autoCompleteAdminList: any = [];
  nonAdminList: any = []
  employeeList: any = []
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    // class: 'modal-md'
  }
  tempAdmindata: any;
  noDatafound = "No data Found"
  showNoDatafound: boolean = false;
  name
  serachForm: UntypedFormGroup;
  keyword = 'userName';
  item: any;
  admin_data_pop_up
  adminName
  removeAdmin_userid
  superAdmin_userid
  isAdmin
  isSuperAdmin
  superadminflag: Boolean = false;
  colors: Array<any> = ['hgreen', 'hred', 'horange', 'hyellow'];
  selColor: string;
  loginUserId
  userCardConfig: UserCardConfig[] = []
  searchKey

  constructor(
    private util: UtilService,
    private api: ApiService,
    private commonvalues: CommonValues,
    private employees: BusinessEmployeeComponent,
    private router: Router,
    private modalService: BsModalService,
    private JobServicecolor: JobService,
    private fb: UntypedFormBuilder) {
    this.commonvalues.getbusinessid().subscribe((res) => {

      this.values = res

    })
    this.randomColor();
    this.loginUserId = localStorage.getItem('userId');

  }

  randomColor(): void {
    this.selColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  ngOnInit() {

    this.isAdmin = localStorage.getItem('isAdmin');
    this.isSuperAdmin = localStorage.getItem('isSuperAdmin');

    if (this.isSuperAdmin) {
      this.isAdmin = this.isSuperAdmin
    }
    this.userId = localStorage.getItem('userId')
    this.businessDetails()

    this.adminSearchForm = this.fb.group({
      chooseAdmin: [null, [Validators.required]]
    })

    let revokeBtn: UserCardConfig = new UserCardConfig("Connect", this.removedata, this.canShow, true);
    revokeBtn.source = this;
    this.userCardConfig.push(revokeBtn);

    this.values = this.commonemit
    this.formserchData()
    this.employeesquaryapicall()
    this.getAdmins(this.values.businessId)
    console.log(this.values)
  }

  ngOnDestroy(): void {
    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
  }

  canShow(data, source): boolean {
    return false;
  }

  removedata(data) {
    //// console.log(data)

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



  //  select admin  datas

  formserchData() {
    this.serachForm = this.fb.group({
      serachData: [''],
    });
  }

  selectEvent(val) {
    this.addAdminId = val.userId
    //// console.log(val)
  }

  selectEvent1(val) {
    this.transferId = val.userId
  }

  onFocused1(event) {

  }

  makeadmin() {

    if (this.superAdmin_userid != undefined && this.superAdmin_userid != null) {
      let data = {
        "businessId": this.values.businessId,
        "userId": this.superAdmin_userid,
        "adminType": "SUPERADMIN"
      }
      this.util.startLoader()
      this.api.create('business/add/admin', data).subscribe(res => {
        this.util.stopLoader()
        if (res.code == "00000") {
          this.decline()
          // window.location.reload()
          this.getAdmins(this.values.businessId)
        } else if (res.code == "99999") {

        }
      }, err => {
        this.util.stopLoader();
        if (err.status == 500) {
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
  }


  makeSuperadmin() {
    if (this.transferId != undefined && this.transferId != null) {

      let data = {
        "businessId": this.values.businessId,
        "userId": this.transferId,
        "adminType": "SUPERADMIN"
      }
      this.util.startLoader()
      this.api.create('business/add/admin', data).subscribe(res => {
        this.util.stopLoader()
        if (res.code == "00000") {
          this.decline()
          // window.location.reload()
          this.getAdmins(this.values.businessId)
        } else if (res.code == "99999") {

        }
      }, err => {
        this.util.stopLoader();
        if (err.status == 500) {
          this.util.stopLoader();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Something went wrong while transferring super-admin rights. Please, try again later.',
            showDenyButton: false,
            confirmButtonText: `ok`,
          })
        }
      })
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please select admin',
        //showConfirmButton: true,
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 3000
      })
    }
  }


  cleardata(data) {
    this.addAdminId = null;
    this.transferId = null;
  }



  // add  admin api call here

  addAdmin() {

    if (this.addAdminId != undefined && this.addAdminId != null) {
      let data = {
        "businessId": this.values.businessId,
        "userId": this.addAdminId,
        "adminType": "ADMIN"
      }

      this.util.startLoader()
      this.api.create('business/add/admin', data).subscribe(res => {
        this.util.stopLoader()
        if (res.code == "00000") {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Admin added successfully.',
            // text: "Admin added successfully.",
            //showConfirmButton: true,
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.getAdmins(this.values.businessId);
          })

          // this.commonvalues.getbusinessid()
          this.modalRef.hide()
          // this.decline()

        } else {
          this.decline()
          this.getAdmins(this.values.businessId)

        }
      }, err => {
        this.util.stopLoader();
        if (err.status == 500) {
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

    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please select an employee',
        //showConfirmButton: true,
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 3000
      })
    }

  }


  onChangeSearch(val: string) {

  }

  onFocused(e) {
    // this.item=e
    // this.admin_data_pop_up=e
  }

  decline(): void {
    this.addAdminId = null;
    this.transferId = null;
    this.modalRef.hide();
    this.serachForm.reset()
    this.employeesquaryapicall();

  }


  close() {
    this.addAdminId = null;
    this.transferId = null;
    this.modalRef.hide();
    this.serachForm.reset();
    this.employeesquaryapicall();
  }
  businessDetails() {
    let datas: any = {};
    datas.userId = localStorage.getItem('userId')
    this.util.startLoader()
    this.api.create("business/check/user", datas).subscribe(res => {
      this.util.stopLoader()
      this.businessDetail = res.data.businessModelList[0];
    }, err => {
      this.util.stopLoader();

    });
  }

  openModal(template: TemplateRef<any>) {
    this.employeesquaryapicall()
    this.formserchData();
    this.modalRef = this.modalService.show(template, this.backdropConfig);
  }




  employeesquaryapicall() {
    this.employeeList = []
    let datas: any = {};
    datas.businessId = this.values ? this.values.businessId : null;
    this.util.startLoader()
    this.api.create('business/connectedemployees', datas).subscribe(res => {
      this.employeequary(this.employeeList);
      if (res && res != null && res.length === 0) {
        this.util.stopLoader();
      }

      res.forEach(element => {
        // if (element.userId != 'undefined' || element.userId != 'null' || element.userId != '') {
        // this.api.query('user/connection/' + element.userId).subscribe(res => {
        this.util.stopLoader();
        // var photos
        // if (element.photo == null) {
        //   photos = "assets/images/userAvatar.png"
        // } else if (element.photo != null) {
        //   photos = AppSettings.photoUrl + element.photo;
        // }
        this.employeeList.push({
          userName: element.fullName,
          fullName: element.fullName,
          lastName: element.lastName,
          firstName: element.firstName,
          // photo: photos,
          photo: element.photo,
          organisation: element.organisation,
          title: element.title,
          status: element.status,
          userId: element.userId,
          type: element.type,
          connected: element.connected,

        })
        this.employeequary(this.employeeList)
        //   })
        // }





      })
    }, err => {
      this.util.stopLoader();

    });
  }


  employeequary(datas) {
    this.employeeList = datas
    this.values.employees = this.employeeList
    this.commonvalues.businessid(this.values);
  }

  transferModal(template: TemplateRef<any>) {
    // this.employees.employees()
    this.formserchData()
    this.modalRef = this.modalService.show(template, this.backdropConfig);
    this.getAdmins(this.values.businessId)
  }

  photoUrl: string = AppSettings.photoUrl;
  getAdmins(bussinessid) {
    this.adminList = [];
    this.autoCompleteAdminList = [];
    let data = {
      "businessId": bussinessid,
      "userId": this.userId
    }
    this.adminquary(this.adminList)
    setTimeout(() => {
      this.util.startLoader()
      this.api.create('business/admins', data).subscribe(respose => {
        this.util.stopLoader()
        this.adminList = [];
        respose.data.businessAdminList.forEach(element => {
          if (element.userId != undefined || element.userId != null || element.userId != '') {
            // var photos;
            // if (element.photo == null) {
            //   photos = "assets/images/userAvatar.png"
            // } else if (element.photo != null) {
            //   photos = AppSettings.photoUrl + element.photo;
            // }

            if (element.admin == true) {
              element.assignedOn = new Date();
            }
            let color = this.colors[Math.floor(Math.random() * this.colors.length)];
            if (this.userId === element.userId) {
              element.index = 1
            } else {
              element.index = 2
            }

            let d = {
              fullName: element.fullName,
              userName: element.firstName + " " + element.lastName,
              lastName: element.lastName,
              firstName: element.firstName,
              postCnt: element.postCnt,
              connectionCnt: element.connectionCnt,
              jobsCount: element.jobsCount,
              candidatesCount: element.candidatesCount,
              photo: element.photo,
              organisation: element.organisation,
              title: element.title,
              connectionStatus: element.connectionStatus,
              status: element.status,
              userId: element.userId,
              assignedOn: element.assignedOn,
              type: element.type,
              connected: element.connected,
              userType: element.userType,
              colorVal: color,
              index: element.index
            };
            this.adminList.push(d);
            this.tempAdmindata = this.adminList;

            if (this.userId !== element.userId) {
              this.autoCompleteAdminList.push(d);
            }

            if (this.userId === element.userId) {
              if (element.type === "SUPERADMIN") {
                localStorage.setItem('isSuperAdmin', 'true')
              } else {
                localStorage.setItem('isSuperAdmin', 'false')

              }
            }

          }
        })
        this.adminquary(this.adminList)
      }, err => {
        this.util.stopLoader();

      });
    }, 1000);
  }

  filterName : string = "All";
  adminFilter(val) {
    let datas: any = {};
    datas.businessId = this.values.businessId;
    if (val === "ADMIN" || val === "SUPERADMIN") {
      this.api.create("business/admins", datas).subscribe(response => {
        const filteredData = response.data.businessAdminList.filter(res => res.businessUserType === val);

        this.values.admindata = filteredData;
      });
    } else if (val === "ALL") {
      this.api.create("business/admins", datas).subscribe(response => {
        if (Array.isArray(response.data.businessAdminList)) {
          this.values.admindata = response.data.businessAdminList;
        } else {
          this.values.admindata = [];
        }
      });
    }

    let [first , ...rest] = val;
    this.filterName = first + rest.join("").toLowerCase();
  }
  getInitials(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }

  getColor(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }

  adminquary(datas) {
    ////// console.log(datas);
    this.adminList = this.sortData(datas);
    this.values.menu = 'pageadmin'
    this.values.admindata = this.adminList.sort(this.dynamicSort("userName"));
    this.values.admindata.forEach((element, i) => {
      if (element.userId == localStorage.getItem("userId")) {
        var b = this.values.admindata[i];
        this.values.admindata[i] = this.values.admindata[0];
        this.values.admindata[0] = b;
      }
      this.values.tempAdmindata = this.values.admindata;
      this.tempAdmindata = this.values.admindata;
      this.commonvalues.businessid(this.values);

    });

    // this.commonvalues.businessid(this.values);

  }
  onsearch(val) {
    if (val != undefined) {
      val = val.trim().toLowerCase();
    }

    var datapass = [];
    datapass = this.tempAdmindata;
    this.values.admindata = this.tempAdmindata;
    this.commonvalues.businessid(this.values);

    //// console.log(datapass)
    let admindata = this.filterByString(datapass, val);
    this.values.admindata = admindata;
    this.commonvalues.businessid(this.values);

    if (this.values.admindata.length == 0) {
      this.showNoDatafound = true;
    } else {
      this.showNoDatafound = false;
    }

  }

  keyupdata(event) {
    if (event.target.value.length == 0) {
      this.onsearch('');
    }
  }

  filterByString(data, s) {
    return data.filter(e => e.userName.toLowerCase().includes(s))
      .sort((a, b) => a.userName.toLowerCase().includes(s) && !b.userName.toLowerCase().includes(s) ? -1 : b.userName.toLowerCase().includes(s) && !a.userName.toLowerCase().includes(s) ? 1 : 0);
  }
  sortData(data) {
    return data.sort((a, b) => {
      return <any>new Date(b.assignedOn) - <any>new Date(a.assignedOn);
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



  revoke(template: TemplateRef<any>, userId) {
    // this.employees.employees()
    this.removeAdmin_userid = userId
    this.modalRef = this.modalService.show(template, this.backdropConfig);
  }

  superAdmin(template: TemplateRef<any>, data) {

    this.superAdmin_userid = data
    this.getAdmins(this.values.businessId)
    // this.employees.employees()
    this.modalRef = this.modalService.show(template, this.backdropConfig);
  }


  // reloadpage() {

  //   let data: any = {}
  //   data.commonemit.businessId = this.values.businessId
  //   data.commonemit.businessName = this.values.businessName
  //   data.commonemit.commondata.menu = "pageadmin"

  //   this.router.navigate(['business'], { queryParams: data })
  //   setTimeout(() => {
  //     this.router.navigate(['business'], { queryParams: data })
  //     window.location.reload();
  //   }, 400);


  // }

  onScroll() {
    ////// console.log('scrolled!!');
  }


  //   removeAdmin api call here

  removeAdmin() {
    let data = {
      "businessId": this.values.businessId,
      "userId": this.removeAdmin_userid
    }
    this.util.startLoader()
    this.api.create('business/remove/admin', data).subscribe(res => {
      this.util.stopLoader()
      ////// console.log(res)
      if (res) {
        if (res.code === '00000') {
          this.getAdmins(this.values.businessId);
          this.modalRef.hide();
        }
      }
      this.businessDetails()

      //this.adminList=res;
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while removing admin. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
  }



  sendmsg(data) {
    var userData: any = {}
    userData.groupId = data.userId;
    userData.type = "USER";
    this.router.navigate(['message'], { queryParams: userData })
  }

  userprofile(data) {
    var userData: any = {}
    userData.userId = data
    this.router.navigate(['personalProfile'], { queryParams: userData })
  }

}
