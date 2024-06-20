import { map } from "rxjs/operators";
import { BusinessEmployeeRequestsComponent } from "./../business-employee-requests/business-employee-requests.component";
import { Component, OnInit, TemplateRef, Input, OnDestroy } from "@angular/core";
import { AppSettings } from "src/app/services/AppSettings";
import { Subscription, interval, Subject } from "rxjs";
import { CommonValues } from "src/app/services/commonValues";
import { Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { UtilService } from "src/app/services/util.service";
import { UserCardConfig } from "src/app/types/UserCardConfig";
import Swal from "sweetalert2";
import { User } from "src/app/types/User";

@Component({
  selector: "app-business-employee",
  templateUrl: "./business-employee.component.html",
  styleUrls: ["./business-employee.component.scss"],
})
export class BusinessEmployeeComponent implements OnInit, OnDestroy {
  clickEventsubscription: Subscription;
  //   values = {businessId:"",  admin: false,employees:[]  ,
  //   menu:"", userId:"",follower:false
  //  }

  @Input() commonemit;
  values: any = {};
  modalRef: any;
  term: string;
  basicDeatils;
  userData: Array<any> = [];
  removedatas;
  name;
  empSearch: any;
  tempemployee: any;
  noDatafound: Array<string> = ["You have no employee"];
  showNoDatafound: boolean = false;
  isAdmin;
  isSuperAdmin;
  AllRevokeData: boolean = false;
  revokedData;
  loadAPIcallValue:boolean
  //Abu
  serachForm: UntypedFormGroup;
  userList: any = [];
  firstList: any;
  formCtrlSub: Subscription;
  subject: Subject<any> = new Subject();
  berequest: BusinessEmployeeRequestsComponent;
  //Usercard initialization;
  userCardConfig: UserCardConfig[] = [];
  searchKey;
  constructor(
    private API: ApiService,
    private util: UtilService,
    private modalService: BsModalService,
    private router: Router,
    private commonvalues: CommonValues,
    private fb: UntypedFormBuilder
  ) {
    this.clickEventsubscription = this.commonvalues
      .getbusinessid()
      .subscribe((res) => {
        this.values = res;
        this.basicDeatils = res.basicDeatils;
      });
  }

  ngOnInit() {
    this.API.loadAPIcallValue$.subscribe(value => {
      this.loadAPIcallValue = value;
    });
    this.values = this.commonemit;
    this.isAdmin = localStorage.getItem("isAdmin");
    this.isSuperAdmin = localStorage.getItem("isSuperAdmin");

    if (this.isSuperAdmin) {
      this.isAdmin = this.isSuperAdmin;
    }

    //abu
    this.formserchData();

    if (this.isSuperAdmin == "true" || this.isSuperAdmin == true) {
      let revokeBtn: UserCardConfig = new UserCardConfig(
        "Revoke",
        this.removedata,
        this.canShow,
        true
      );
      revokeBtn.source = this;
      this.userCardConfig.push(revokeBtn);
    }
  }

  ngOnDestroy(): void {
    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
    if (this.formCtrlSub) {
      this.formCtrlSub.unsubscribe();
    }
  }

  popupdata(popup, data) {
    this.removedatas = data;
    this.PopupServicevlaues(popup);
  }

  canShow(data, source): boolean {
    return false;
  }

  employeRevoke() {
    let datas: any = {};
    datas.id = this.values.businessId;
    datas.type = "REVOKED";
    this.API.create("business/filter/employees", datas).subscribe((res) => {
      res.data.filterEmployeesAndAdminList.forEach((element) => {
        if (element.userId === localStorage.getItem("userId")) {
          element.joinedOn = new Date();
        }
        element.userName = element.firstName + " " + element.lastName;
        element.type = element.businessUserType;
      });
      this.values.employees = res.data.filterEmployeesAndAdminList;
      this.AllRevokeData = true;
    });
    this.userCardConfig = [];
    let accept: UserCardConfig = new UserCardConfig(
      "Accept",
      this.accept,
      this.canShow,
      true
    );
    accept.source = this;
    this.userCardConfig.push(accept);
  }
  accept(user: User) {
    let data: any = {};
    data.businessId = this.values.businessId;
    data.userId = user.userId;
    data.type = "REVOKED";
    // //// console.log()
    // /business/employee/request/accept - accept employee from request - {'userId': '', 'businessId': ''}
    this.API.create("business/employee/request/accept", data).subscribe(
      (res) => {
        if (res.code == "00000") {
          this.filterTeam("REVOKED");
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Employee added successfully",
            // text: 'Employee added successfully',
            showConfirmButton: false,
            timer: 2000,
          });
          // this.empCount()
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
      },
      (err) => {
        this.util.stopLoader();
      }
    );
  }

  admin: boolean = false;
  filterName : string = "All";
  filterTeam(val:string) {
    let datas: any = {};
    if (val == "All") {
      datas.businessId = this.values.businessId;
      this.API.create("business/employees", datas).subscribe((res) => {
        if (res != null) {
          this.values.employees = res.data.businessEmployees;
          this.employeequary(res.data.businessEmployees);

        }
        this.userCardConfig = [];
        let revokeBtn: UserCardConfig = new UserCardConfig(
          "Revoke",
          this.removedata,
          this.canShow,
          true
        );
        revokeBtn.source = this;
        this.userCardConfig.push(revokeBtn);
      });
    } else if (val == "ADMIN") {
      datas.id = this.values.businessId;
      datas.type = val;
      this.API.create("business/filter/employees", datas).subscribe((res) => {
        this.values.employees = res.data.businessAdminList;
        this.employeequary(res.data.businessAdminList);
      });
    } else if (val == "REVOKED") {
      datas.type = val;
      datas.id = this.values.businessId;
      this.API.create("business/filter/employees", datas).subscribe((res) => {
        this.values.employees = res.data.filterEmployeesAndAdminList;
      });
      this.userCardConfig = [];
      let accept: UserCardConfig = new UserCardConfig(
        "Accept",
        this.accept,
        this.canShow,
        true
      );
      accept.source = this;
      this.userCardConfig.push(accept);
    }
    let [first , ...rest] = val;
    this.filterName = first + rest.join("").toLowerCase();
  }

  removedata(data) {
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
        text: "This employee will be removed from this bussiness page.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let datas: any = {};
          datas.businessId = this.values.businessId;
          datas.userId = data.userId;
          this.util.startLoader();
          this.API.create("business/revoke/employee", datas).subscribe(
            (res) => {
              this.util.stopLoader();
              if (res.code == "00000") {
                this.employees();
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Employee revoked",
                  text: "Employee has been revoked",
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
            },
            (err) => {
              this.util.stopLoader();
              if (err.status == 500) {
                this.util.stopLoader();
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong while processing your request. Please, try again later.",
                  showDenyButton: false,
                  confirmButtonText: `ok`,
                });
              }
            }
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: "Employee is safe",
          //   showConfirmButton: false,
          //   timer: 1500,
          // });
        }
      });
  }

  modalclose() {
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    // }
    this.modalRef.hide();
  }

  PopupServicevlaues(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
  }

  onsearch(val) {
    if (val != undefined) {
      val = val.trim().toLowerCase();
    }

    var datapass = [];
    datapass = this.values.tempemployees;
    this.values.employees = this.values.tempemployees;
    this.commonvalues.businessid(this.values);

    if (this.values.employees != null) {
      let empdata = this.filterByString(datapass, val);
      this.values.employees = empdata;
      this.commonvalues.businessid(this.values);
    }

    if (this.values.employees.length == 0) {
      this.showNoDatafound = true;
    } else {
      this.showNoDatafound = false;
    }
  }
  keyupdata(event) {
    if (event.target.value.length == 0) {
      this.onsearch("");
    }
  }
  filterByString(data, s) {
    return data
      .filter((e) => e.userName.toLowerCase().includes(s))
      .sort((a, b) =>
        a.userName.toLowerCase().includes(s) &&
          !b.userName.toLowerCase().includes(s)
          ? -1
          : b.userName.toLowerCase().includes(s) &&
            !a.userName.toLowerCase().includes(s)
            ? 1
            : 0
      );
  }
  employeequary(datas) {
    // this.userData = datas
    this.values.employees = datas;
    // this.values.employees = this.sort_by_key(datas, "firstName");
    // this.values.employees = [...new Set(this.values.employees)];
    const SuperAdmin = this.values.employees.find(
      (x) => x.businessUserType === "SUPERADMIN"
    );
    if (SuperAdmin) {
      const index = this.values.employees.indexOf(SuperAdmin);
      this.values.employees.splice(index, 1);
      this.values.employees.unshift(SuperAdmin);
    }
    this.values.tempemployees = this.values.employees;
    // this.commonvalues.businessid(this.values);
    // console.log("value is coming ", this.values.employees);
  }

  sortData(data) {
    return data.sort((a, b) => {
      return <any>new Date(b.joinedOn) - <any>new Date(a.joinedOn);
    });
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  employees() {

    try {
      this.util.startLoader();
      this.userData = [];
      this.values.employees = [];
      let datas: any = {};
      datas.businessId = this.values.businessId;
      this.showNoDatafound = false;
      this.API.setLoadAPIcall(true);
      this.API.create("business/employees", datas).subscribe(
        (res) => {
          this.API.setLoadAPIcall(false);


          this.showNoDatafound = true;
          this.values.employees = res.data.businessEmployees;
          this.userData = res.data.businessEmployees;
          if (this.userData.length > 0) {
            this.userData.forEach((element) => {
              if (element.userId === localStorage.getItem("userId")) {
                element.joinedOn = new Date();
              }
              element.userName = element.firstName + " " + element.lastName;
              element.type = element.businessUserType;
            })
            this.employeequary(this.userData);
            this.util.stopLoader();
          }

        },
        (err) => {
          this.util.stopLoader();
        }
      );
    } catch (error) {
      this.util.stopLoader();
    }

  }

  sendmsg(data) {
    var userData: any = {};
    userData.userid = data.userId;
    this.router.navigate(["message"], { queryParams: userData });
  }

  userprofile(data) {
    var userData: any = {};
    userData.userId = data;
    this.router.navigate(["personalProfile"], { queryParams: userData });

  }
  connetedstatus(data) { }

  //abu
  formserchData() {
    this.serachForm = this.fb.group({
      serachData: [""],
    });
  }

  userSelected(valUser) {
    var userData: any = {};
    userData.userId = valUser.userId;

    this.router.navigate(["personalProfile"], { queryParams: userData });

  }

  onChangeSearch(val: string) {
    const data: any = {
      businessId: this.values.businessId,
      searchText: this.serachForm.value.serachData,
    };

    if (val != null && this.serachForm.value.serachData != "") {
      // console.log('value entered  --> calling api ', this.serachForm.value.serachData);
      this.util.startLoader();
      this.API.create("business/employees/search", data).subscribe(
        (res) => {
          // console.log('business/employees/search',res)
          this.util.stopLoader();
          this.firstList = res.data.businessEmployees;
          this.afterCall();
        },
        (err) => {
          this.util.stopLoader();
        }
      );
    } else if (this.serachForm.value.serachData == "") {
      this.employees();
    }
  }

  afterCall() {
    this.firstList.forEach((response) => {
      this.userList.push(response.userId);
    });
    // console.log(this.userList + "<-----aftercall")
    this.userList.forEach((element) => {
      this.util.startLoader();
      this.API.query("user/connection/" + element).subscribe(
        (res) => {
          this.util.stopLoader();
          this.userData = [];
          this.userData.push({
            userName: res.firstName + " " + res.lastName,
            photo: AppSettings.photoUrl + res.photo,
            organisation: res.organisation,
            title: res.title,
            status: element.status,
            userId: element.userId,
            connected: element.connected,
          });
          this.employeequary(this.userData);
        },
        (err) => {
          this.util.stopLoader();
        }
      );
    });
  }

  delay(callback, ms) {
    var timer = 0;
    return function () {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      var timer = setTimeout(function () {
        callback.apply(context, args);
      }, ms || 0);
    };
  }
}
