import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppSettings } from 'src/app/services/AppSettings';
import { Subscription, interval, Observable, fromEvent, Subject } from 'rxjs';
import { CommonValues } from 'src/app/services/commonValues';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { UtilService } from 'src/app/services/util.service';
import { UserCardConfig } from 'src/app/types/UserCardConfig';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-business-follower',
  templateUrl: './business-follower.component.html',
  styleUrls: ['./business-follower.component.scss']
})
export class BusinessFollowerComponent implements OnInit, OnDestroy {
  clickEventsubscription: Subscription;

  values: any = {}
  @Input() commonemit
  userData
  followersData
  followersDataInBusiness: any;
  term: string;
  basicDeatils
  followerSearch: string;
  name
  isAdmin
  isSuperAdmin

  businessID: any;

  //Abu
  serachForm: UntypedFormGroup
  loadAPIcall:boolean=false
  userId;
  requestSent: boolean = false;
  requestPending: boolean = false;
  connected: boolean = false;
  notConnected: boolean = false;

  userList: any = []
  firstList: any;
  formCtrlSub: Subscription

  NOT_CONNECTED_followers;
  REQUEST_SENT_followers;
  REQUEST_PENDING_followers;
  CONNECTED_followers;

  DefaultData: boolean = true;
  AllfollowerData: boolean = false;
  AllRevokeData: boolean = false;
  revokedFollower: boolean = false;
  BusFollowers: boolean = false;

  revokedData: any;
  Alldata: any;
  tempRevokefollower: any;
  tempfollower: any;
  tempfollowers: any;
  subject: Subject<any> = new Subject();

  noDatafound = "You have no follower"
  showNoDatafound: boolean = false;

  userCardConfig: UserCardConfig[] = []
  searchKey
  constructor(private API: ApiService,
    private util: UtilService,
    private router: Router,
    private commonvalues: CommonValues,
    private fb: UntypedFormBuilder) {
    this.clickEventsubscription = this.commonvalues.getbusinessid().subscribe((res) => {
      this.values = [];
      this.values = res;
      this.basicDeatils = res.basicDeatils;
    });
  }

  ngOnInit() {
    this.values = this.commonemit;
    this.isAdmin = localStorage.getItem('isAdmin');
    this.businessID = localStorage.getItem('businessId');

    this.isSuperAdmin = localStorage.getItem('isSuperAdmin');
    if (this.isSuperAdmin) {
      this.isAdmin = this.isSuperAdmin;
    }



    this.formserchData()


    this.followersapicall();
    this.checkFollowerStatus();
    var a = localStorage.getItem('isAdmin')

    if (this.isSuperAdmin == "true" || this.isSuperAdmin == true || a === 'true') {

      let revokeBtn: UserCardConfig = new UserCardConfig("Revoke", this.removedata, this.canShow, true);
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
  // data set only

  followerquary(datas) {
    this.followersDataInBusiness = datas;
    this.userData = datas;
    this.values.menu = 'follower';
    this.values.follower = this.sort_by_key(datas, 'firstName');
    this.values.follower.forEach((element, i) => {
      if (element.userId == localStorage.getItem("userId")) {
        var b = this.values.follower[i];
        this.values.follower[i] = this.values.follower[0];
        this.values.follower[0] = b;
      }

    });
    this.tempfollowers = this.values.follower;
    this.values.tempfollowers = this.values.follower;
  }

  sortData(data) {
    return data.sort((a, b) => {
      return <any>new Date(b.followedOn) - <any>new Date(a.followedOn);
    });
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  followersapicall() {
 this.loadAPIcall=true
    this.userData = []
    let datas: any = {};
    datas.businessId = this.values.businessId

    setTimeout(() => {
      this.API.create('business/followers', datas).subscribe(res => {
        this.util.stopLoader()
      this.loadAPIcall=false
        res.data.businessFollowers.forEach(element => {
          element.userName = element.firstName + " " + element.lastName;
          if (element.userId === localStorage.getItem('userId')) {
            element.followedOn = new Date()
          }
        })

        this.userData = res.data.businessFollowers;
        this.values.follower = res.data.businessFollowers;
        this.followerquary(this.userData)

      }, err => {
        this.util.stopLoader();

      });


    }, 100);
    this.BusFollowers = true;

  }

  canShow(data, source): boolean {
    // //// console.log('b-f -> canshow - ' , this.isAdmin);
    return this.isSuperAdmin && this.values.adminviewnavigation;
  }

  removedata(data, source) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, revoke',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {


        let datas: any = {};
        datas.businessId = source.values.businessId
        datas.userId = data.userId

        // //// console.log("test -> business page - revoke - " + JSON.stringify(datas));
        this.util.startLoader()
        this.API.create('business/revoke/follower', datas).subscribe(res => {
          this.util.stopLoader()
          if (res.code === '00000') {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Revoke follower",
              text: "Follower has been revoked",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              this.followersapicall();
            })
          }
        }, err => {
          this.util.stopLoader();

        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Follower is safe",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    })

  }

  sendmsg(data) {
    var userData: any = {}
    userData.userid = data.userId
    this.router.navigate(['message'], { queryParams: userData })
  }

  userprofile(data) {
    var userData: any = {}
    userData.userId = data
    this.router.navigate(['personalProfile'], { queryParams: userData })
  }



  //Abu
  formserchData() {
    this.serachForm = this.fb.group({
      serachData: [''],
    });
  }

  userSelected(valUser) {
    var userData: any = {}
    userData.userId = valUser.userId
    this.router.navigate(['personalProfile'], { queryParams: userData })
  }



  onChangeSearch(val: string) {

    const data: any = {
      businessId: this.values.businessId,
      searchText: this.serachForm.value.serachData
    }


    if (val != null && this.serachForm.value.serachData != '') {
      // //// console.log('value entered  --> calling api ', this.serachForm.value.serachData);
      this.util.startLoader()
      this.API.create('business/followers/search', data).subscribe(res => {
        this.util.stopLoader()
        this.firstList = res
        this.afterCall()
      }, err => {
        this.util.stopLoader();

      });
    } else if (this.serachForm.value.serachData == '') {
      this.followersapicall()
    }
  }

  afterCall() {
    this.firstList.forEach(response => {
      this.userList.push(response.userId)
    })
    // //// console.log(this.userList + '<-----aftercall')
    this.userList.forEach(element => {
      this.util.startLoader()
      this.API.query('user/connection/' + element).subscribe(res => {
        this.util.stopLoader()
        this.userData = []
        this.userData.push({
          userName: res.firstName + ' ' + res.lastName,
          photo: AppSettings.photoUrl + res.photo,
          organisation: res.organisation,
          title: res.title,
          status: element.status,
          userId: element.userId,
          connected: element.connected,
        })
        this.followerquary(this.userData)
      }, err => {
        this.util.stopLoader();
      })
    })


  }

  connect(data) {
    let datas: any = {}
    datas.userId = data.userId
    //data.requestedBy = localStorage.getItem('userId')
    this.util.startLoader()
    this.API.create('user/connect', datas).subscribe(conData => {
      this.util.stopLoader()
      // //// console.log('connection Request........')
      // console.warn('Connection Response data: ', conData);
      if (conData.code === '00000') {

        this.requestSent = true;
        this.notConnected = false;
        this.connected = false;
        setTimeout(function () { Swal.fire('Request is sent Successfully!'); }, 500);
        //alert('Request is sent Successfully!')
      } else if (conData.code === '88888') {
        this.requestSent = false;
        this.notConnected = false;
        this.connected = false;
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while sending request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
  }


  removeConnection(data) {
    let connData: any = {};
    connData.userId = data.userId

    this.util.startLoader()
    this.API.create('user/connect/remove', connData).subscribe(res => {
      this.util.stopLoader()

      if (res.code === '00000') {

        this.followersapicall()

      } else if (res.code === '88888') {

      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while removing connection. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
  }

  //Created  by Dev
  //Cancel Connection
  cancelConnection(data) {
    let cancelData: any = {};
    cancelData.userId = data.userId
    // //// console.log('connData.userId',cancelData.userId)
    this.util.startLoader()
    this.API.create('user/connect/cancel', cancelData).subscribe(res => {
      this.util.stopLoader()
      // //// console.log('Cancel Connection : ', res);
      if (res.code === '00000') {
        // //// console.log('Connect request cancelled successfully');
      } else if (res.code === '88888') {
        // //// console.log('Unable to Cancel connection');
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while saving business. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
  }

  checkFollowerStatus() {
    let data: any = {};
    data.userId = this.userId;
    data.requestedBy = localStorage.getItem('userId');
    // console.warn('local storage data :', data.requestedBy);
    this.util.startLoader()
    this.API.query('user/connection/' + data.requestedBy).subscribe(res => {
      this.util.stopLoader()
      // console.warn('Check follower data', res)
      this.NOT_CONNECTED_followers = res.connectionStatus;
      this.CONNECTED_followers = res.connected;
      // //// console.log('connectionStatus of user :',this.NOT_CONNECTED_followers)
      // //// console.log('connectionStatus of connection :',this.CONNECTED_followers)
    }, err => {
      this.util.stopLoader();
    })
  }

  delay(callback, ms) {
    var timer = 0;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      var timer = setTimeout(function () {
        callback.apply(context, args);
      }, ms || 0);
    };
  }

  filterName : string = "All";
  allFollowers() {
    this.filterName = "All";
    const datas: any = {};
    datas.id = this.businessID;
    datas.type = "ALL"
    this.showNoDatafound = false;
    this.API.create('business/filter/followers', datas).subscribe(res => {

      this.showNoDatafound = true;
      if (res != null) {
        res.data.FollowersList.forEach(element => {
          element.userName = element.firstName + " " + element.lastName;
        });
      }
      this.Alldata = res.data.FollowersList[0].data.businessFollowers;
      this.tempfollower = res.data.FollowersList[0].data.businessFollowers;
      this.AllRevokeData = false;
      this.AllfollowerData = true;
      this.DefaultData = false;
      this.BusFollowers = true;
      this.revokedFollower = false;
      this.userCardConfig = []
      let revokeBtn: UserCardConfig = new UserCardConfig("Revoke", this.removedata, this.canShow, true);
      revokeBtn.source = this;
      this.userCardConfig.push(revokeBtn);
    })
  }


  RevokedFollowers() {
    this.filterName = "Revoked";
    const datas: any = {};
    datas.id = this.businessID;
    datas.type = "REVOKED"
    this.showNoDatafound = false;
    this.API.create('business/filter/followers', datas).subscribe(res => {
      this.showNoDatafound = true;

      res.data.FollowersList.forEach(element => {
        element.userName = element.firstName + " " + element.lastName;
      });
      this.revokedData = res.data.FollowersList;
      this.tempRevokefollower = res.data.FollowersList;
      this.DefaultData = false;
      this.AllfollowerData = false;
      this.AllRevokeData = true;
      this.BusFollowers = false;
      this.revokedFollower = true;
      this.userCardConfig = []
    })
  }
  keyupdata(event) {
    if (event.target.value.length == 0) {
      this.onsearch('');
    }
  }

  onsearch(val) {
    if (val != undefined) {
      val = val.trim().toLowerCase();
    }

    if (this.DefaultData) {
      this.values.follower = this.values.tempfollowers
      if (this.values.follower != null) {
        this.values.follower = this.values.tempfollowers;
        this.commonvalues.businessid(this.values);
        var datapass = []
        datapass = this.values.follower;
        let follower = this.filterByString(datapass, val);
        this.values.follower = follower;
        this.commonvalues.businessid(this.values);

      }
      if (this.values.follower.length == 0) {
        this.showNoDatafound = true;
      } else {
        this.showNoDatafound = false;
      }
    } else if (this.AllfollowerData) {
      this.Alldata = this.tempfollower
      if (this.Alldata != null) {
        this.Alldata = this.filterByString(this.Alldata, val);
      }
      if (this.Alldata.length == 0) {
        this.showNoDatafound = true;
      } else {
        this.showNoDatafound = false;
      }
    } else if (this.AllRevokeData) {
      this.revokedData = this.tempRevokefollower;
      if (this.revokedData != null) {
        this.revokedData = this.filterByString(this.revokedData, val);
      }
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

}


