import { BusinessAnalyticsComponent } from './../../bussinesspages/business-analytics/business-analytics.component';
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonValues } from 'src/app/services/commonValues';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  @Input() commonemit
  clickEventsubscription: Subscription;
  values: any = {}
  name: any;
  communityId
  userData = []
  communitySuperadmin
  communityName
  tempmrequest
  noDatafound : Array<string> = ["You have no request recived"];
  showNoDatafound: boolean = false;
  searchKey
  constructor(
    private commonvalues: CommonValues,
    private route: ActivatedRoute,
    private API: ApiService,
    private router: Router,
    private http: HttpClient,
    private util: UtilService) {
    this.clickEventsubscription = this.commonvalues.getbusinessid().subscribe((res) => {
      this.values = res;

    })
  }

  ngOnInit() {
    this.communitySuperadmin = localStorage.getItem("communitySuperadmin")

    this.route.queryParams.subscribe((res) => {
      this.communityId = res.communityId;
      this.communityName = res.communityName;
    });
    // this.values=this.commonemit
    this.requestlist()
  }

  requestquary(datas) {
    this.userData = datas
    this.values.menu = 'request'
    this.values.communityName = this.communityName
    this.values.request = this.sort_by_key(this.userData, "userName");
    this.tempmrequest=this.values.request;
    this.values.adminviewnavigation = true
    this.values.membersflage = true
    this.commonvalues.communitydata(this.values);
  }


  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  sortData(data) {
    return data.sort((a, b) => {
      return <any>new Date(b.visitedOn) - <any>new Date(a.visitedOn);
    });
  }


  userprofile(data) {
    var userData: any = {}
    userData.userId = data
    this.router.navigate(['personalProfile'], { queryParams: userData })
  }


  updateRequest(datas, status) {
    let data: any = {}
    data.communityId = datas.communityId;
    data.userId = datas.userId
    data.communityJoinStatus = status
    this.util.startLoader()
    this.API.create('community/join/acceptrequest', data).subscribe(res => {
      this.util.stopLoader()
      this.requestlist()
      let val = localStorage.getItem('reqcount');
      if (!isNaN(Number(val))) {
        let numberValue = Number(val);
        if (numberValue > 0) {
          localStorage.setItem('reqcount', (numberValue - 1).toString());
        }
      }
    },err => {
      this.util.stopLoader();

     });

  }
   keyupdata(event){
    if(event.target.value.length==0){
      this.onsearch('');
    }
  }
  onsearch(val) {
    if(val!=undefined){
      val = val.trim().toLowerCase();
    }
     this.values.request =this.tempmrequest;
     this.values.request = this.filterByString( this.values.request, val);
     if (this.values.request.length == 0) {
      this.showNoDatafound = true;
    } else {
      this.showNoDatafound = false;
    }
  }

  filterByString(data, s) {
    return data.filter(e => e.userName.toLowerCase().includes(s))
      .sort((a, b) => a.userName.toLowerCase().includes(s) && !b.userName.toLowerCase().includes(s) ? -1 : b.userName.toLowerCase().includes(s) && !a.userName.toLowerCase().includes(s) ? 1 : 0);
 }
  requestlist() {
    this.userData = [];
    this.requestquary(this.userData)
    var datas = {
      "communityId": this.communityId,
      "userId": localStorage.getItem('userId'),
      "page": {
        "offSet": 0,
        "pageCount": 100
      }
    }
    this.util.startLoader();
    this.showNoDatafound =false
    this.API.create('community/joinrequests', datas).subscribe(res => {
      this.requestquary(this.userData)
      res.data.communitymemberjoinrequest.forEach(element => {

        // if (element.userId != 'undefined' || element.userId != 'null' || element.userId != '') {
          // this.API.query('user/connection/' + element.userId).subscribe(res => {

            this.util.stopLoader()
            var photos
            if (element.photo == null) {
              photos = "assets/images/userAvatar.png"
            } else if (element.photo != null) {
              photos = AppSettings.photoUrl + element.photo
            }
            this.showNoDatafound =true
            this.userData.push({
              userName: element.fullName ,
              photo: photos,
              organisation: element.organisation,
              title: element.title,
              status: element.status,
              connectionCnt: element.connectionCnt,
              postCnt: element.postCnt,
              visitedOn: element.sentOn,
              userId: element.userId,
              connected: element.connected,
              communityId: element.communityId,
            })
            this.requestquary(this.userData)
          })


      //   }
      // })

      setTimeout(() => {
        this.getcount();
      }, 800);

    },err => {
      this.util.stopLoader();

     });
    this.util.stopLoader()
  }


  getcount(){
    this.util.startLoader();
    this.API.query('community/details/' + this.communityId).subscribe(res => {
      this.util.stopLoader();
      localStorage.setItem("communitycount",res.data.communityDetails.members.length);
    },err => {
      this.util.stopLoader();
    })
  }

}
