import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-job-requests-received',
  templateUrl: './job-requests-received.component.html',
  styleUrls: ['./job-requests-received.component.scss']
})
export class JobRequestsReceivedComponent implements OnInit {
  jobId: any;
  constructor(private api: ApiService, private router: Router, private util: UtilService, private a_route: ActivatedRoute) {
    this.a_route.queryParams.subscribe(res => {
      this.jobId = res.jobId
    })
  }
  viewedList: any = []
  ngOnInit() {
    this.getInterestedList()
  }

  searchConfig: any = {
    pageNumber: 0,

  }
  getInterestedList() {
    this.searchConfig.jobId = this.jobId
    this.searchConfig.limit = 10
    this.util.startLoader()
    this.api.create('jobs/findJobInterestShownBy', this.searchConfig).subscribe(res => {
      if (res.code == '00000') {
        this.searchConfig.pageNumber = this.searchConfig.pageNumber + 1
        this.util.stopLoader()
        if (res.data!=null && res.data.viewedByList.length != 0) {
          res.data.viewedByList.forEach(ele => {
            if (ele.photo != null) {
              ele.photo = AppSettings.photoUrl + ele.photo
            } else if (ele.photo == null) {
              ele.photo = "assets/images/userAvatar.png"
            }

            let date = new Date(ele.activityDate);
            let current: any = new Date()
            ele.activityDate = this.util.dataconvert(current, date)


            this.viewedList.push(ele)
          })
        } else if (res.data!=null && res.data.viewedByList.length == 0) {
          this.stopscrollFlag = true
        }
      }
    })
  }

  stopscrollFlag: boolean = false
  onScrollDown() {
    if (this.stopscrollFlag == false) {
      this.getInterestedList()
    }
  }

}
