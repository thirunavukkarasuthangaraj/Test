import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ApiService } from "src/app/services/api.service";
import { AppSettings } from "src/app/services/AppSettings";
import { CommonValues } from "src/app/services/commonValues";
import { SearchData } from "src/app/services/searchData";
import { UtilService } from "src/app/services/util.service";
import { User } from "src/app/types/User";
import { UserCardConfig } from "src/app/types/UserCardConfig";
import Swal from "sweetalert2";
import { BusinessEmployeeComponent } from "../business-employee/business-employee.component";

@Component({
  selector: "app-business-employee-requests",
  templateUrl: "./business-employee-requests.component.html",
  styleUrls: ["./business-employee-requests.component.scss"],
})
export class BusinessEmployeeRequestsComponent implements OnInit, OnDestroy {
  @Input() commonemit;
  values: any = {};
  basicDeatils: any;
  clickEventsubscription: Subscription;
  isAdmin;
  isSuperAdmin;
  name;
  businessId;
  bussinessName;
  empSearch: any;
  requestsReceivedData: any;
  userId: any;
  noDatafound: Array<string> = ["You have no pending employee requests."];
  //Usercard initialization;
  userCardConfig: UserCardConfig[] = [];
  showNoDatafound: boolean = false;
  temppendingList: UserCardConfig[] = [];
  searchKey
  constructor(
    private commonvalues: CommonValues,
    private searchData: SearchData,
    private api: ApiService,
    private util: UtilService,
    private employee: BusinessEmployeeComponent,
    private router: Router,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute
  ) {
    this.businessId = route.snapshot.queryParamMap.get("businessId");
    this.bussinessName = route.snapshot.queryParamMap.get("bussinessName");
    this.clickEventsubscription = this.commonvalues
      .getbusinessid()
      .subscribe((res) => {
        this.values = res;
        this.basicDeatils = res.basicDeatils;
      });
  }

  ngOnInit() {
    this.values = this.commonemit;
    this.isAdmin = localStorage.getItem("isAdmin");
    this.isSuperAdmin = localStorage.getItem("isSuperAdmin");
    this.userId = localStorage.getItem("userId");

    if (this.isSuperAdmin) {
      this.isAdmin = this.isSuperAdmin;
    }

    let accept: UserCardConfig = new UserCardConfig(
      "Accept",
      this.acceptEmployee,
      this.canShow,
      true
    );
    accept.source = this;
    this.userCardConfig.push(accept);

    let ignore: UserCardConfig = new UserCardConfig(
      "Ignore",
      this.ignoreEmployee,
      this.canShow,
      true
    );
    ignore.source = this;
    this.userCardConfig.push(ignore);

    let revokeBtn: UserCardConfig = new UserCardConfig(
      "Deny",
      this.rejectEmployee,
      this.canShow,
      true
    );
    revokeBtn.source = this;
    this.userCardConfig.push(revokeBtn);
    this.requestlist();
  }

  ngOnDestroy(): void {
    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
  }

  filterName : string = "All";
  findAll() {
    this.userCardConfig = [];
    this.filterName = "All";
    this.ngOnInit();
  }

  pendingList: UserCardConfig[] = [];
  requestlist() {
    this.pendingList = [];
    this.util.startLoader();
    this.api
      .query("business/employee/request/pending/" + this.businessId)
      .subscribe((res) => {
        if (res && res.data && res.data.pendingtList && res.data.pendingtList.length > 0) {
          res.data.pendingtList = this.removeDuplicates(res.data.pendingtList, "userId");
          res.data.pendingtList.forEach(element => {
            element.userName = element.firstName + " " + element.lastName;
            element.fullName = element.firstName + " " + element.lastName;
            element.page = 'businessEmployeeRequests'
            element.requestSentTitle = element.title
            element.requestSentOrganization = element.organisation;
            element.showAccept = true;
          });

          this.pendingList = this.sort_by_key(res.data.pendingtList, "firstName");
          this.temppendingList = this.pendingList;
          this.setEmployeeRequestDetailOnBusiness(res.data.pendingtList);

          localStorage.setItem("reqPendinCnt", res.data.pendingtList.length);

        }
      }, err => {
        this.util.stopLoader();
      });

    this.util.stopLoader();
  }



  ignored() {
    let data: any = {}
    data.businessId = this.businessId
    data.status = "IGNORED"
    this.filterName = "Ignored"
    this.api.create("business/employee/requestByStatus", data).subscribe(res => {

      const pendingList: Array<any> = res.data.ignoredList;
      if (pendingList != null) {
        pendingList.forEach(ele => {
          ele.ignoredUser = true;
          ele.showAccept = true;
        });
        this.pendingList = pendingList;
      }

      this.userCardConfig = [];
      let accept: UserCardConfig = new UserCardConfig(
        "Accept",
        this.acceptEmployee,
        this.canShow,
        true
      );
      accept.source = this;
      this.userCardConfig.push(accept);
    });
  }

  denied() {
    let data: any = {}
    data.businessId = this.businessId
    data.status = "REJECTED"
    this.filterName = "Denied";
    this.api.create("business/employee/requestByStatus", data).subscribe(res => {
      const pendingList: Array<any> = res.data.deniedList;
      if (pendingList != null) {
        pendingList.forEach(ele => {
          ele.deniedUser = true;
          ele.showAccept = true;
        });
        this.pendingList = pendingList;
      }
      this.userCardConfig = [];
      let accept: UserCardConfig = new UserCardConfig(
        "Accept",
        this.acceptEmployee,
        this.canShow,
        true
      );
      accept.source = this;
      this.userCardConfig.push(accept);
    });
  }



  onsearch(val) {
    if (val != undefined) {
      val = val.trim().toLowerCase();
    }

    this.pendingList = this.temppendingList
    this.pendingList = this.filterByString(this.temppendingList, val);
    if (this.pendingList.length == 0) {
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
  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  rejectEmployee(user: User) {
    let data: any = {};
    data.businessId = this.businessId;
    data.userId = user.userId;
    data.status = "REJECTED"

    this.api
      .create("business/employee/request/reject", data)
      .subscribe((res) => {
        if (res.code == "00000") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Employee Denied",

            showConfirmButton: false,
            timer: 2000,
          });
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
        this.requestlist();
      }, err => {
        this.util.stopLoader();

      });
  }

  ignoreEmployee(user: User) {
    let data: any = {};
    data.businessId = this.businessId;
    data.userId = user.userId;
    data.status = "IGNORED"

    this.api
      .create("business/employee/request/reject", data)
      .subscribe((res) => {
        if (res.code == "00000") {
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
        this.requestlist();
      }, err => {
        this.util.stopLoader();

      });
  }



  acceptEmployee(user: User) {
    let data: any = {};
    data.businessId = this.businessId;
    data.userId = user.userId;

    this.api
      .create("business/employee/request/accept", data)
      .subscribe((res) => {
        if (res.code == "00000") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Employee added successfully",
            // text: 'Employee added successfully',
            showConfirmButton: false,
            timer: 2000,
          });

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
        this.requestlist();
      }, err => {
        this.util.stopLoader();

      });
  }

  canShow() { }

  userprofile(data) {
    var userData: any = {};
    userData.userId = data;

    this.router.navigate(["personalProfile"], { queryParams: userData });

  }

  setEmployeeRequestDetailOnBusiness(userdata) {

    this.values.menu = "requestsReceived";
    this.values.requestsReceived = this.sort_by_key(userdata, "firstName");
    this.values.requestsReceived = userdata;
    this.values.requestsReceived.forEach((element, i) => {
      if (element.userId == localStorage.getItem("userId")) {
        var b = this.values.requestsReceived[i];
        this.values.requestsReceived[i] = this.values.requestsReceived[0];
        this.values.requestsReceived[0] = b;
      }
    });


    this.employee.employees();
  }
}
