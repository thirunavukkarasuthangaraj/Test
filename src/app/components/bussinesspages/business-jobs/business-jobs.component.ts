import { ActivatedRoute } from '@angular/router';
import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { PageType } from 'src/app/services/pageTypes';
import { UtilService } from 'src/app/services/util.service';
import { CommonValues } from 'src/app/services/commonValues';

@Component({
  selector: 'app-business-jobs',
  templateUrl: './business-jobs.component.html',
  styleUrls: ['./business-jobs.component.scss']
})
export class BusinessJobsComponent implements OnInit {
  showBusinessJobs: any = [];
  response: any = [];
  stopscrollFlag: boolean = false
  creditexpiredflag : boolean = false
  jobId:any;
  searchContent:any;
  loadAPIcall: boolean = false;
  constructor(private api: ApiService,private commonvalues: CommonValues, private route: ActivatedRoute,private util: UtilService,private pageType: PageType) { }

  ngOnInit() {

    this.route.queryParams.subscribe((res) => {
      if(res.jobId){
        this.jobId=res.jobId
        this.searchContent=res.jobId
      }
    })
    this.getJobList();
  }
  searchfilter(){
    this.jobId=this.searchContent;

    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;
    this.obj.searchAfterKey= null;
    this.response=[];
    this.getJobList()




  }
  getdatafromjob(data: any) {
    data.userId = localStorage.getItem('userId')
    data.pageNumber = 0;
    data.limit = 10;
    this.api.create("candidates/findSuggestedCandidates", data).subscribe((res) => {
      this.util.stopLoader();
      res.componentName = 'SuggestedCandidateComponent';
      this.showBusinessJobs = res;
      // this.pageType.setsuggjob(res)
    })
  }

  img: any;
  obj: any = {
    limit: 10,
    searchAfterKey: null,
    searchContent : "",
    userId : localStorage.getItem('userId'),
    businessId: localStorage.getItem('businessId')
  }
  jobFoundStatus: any = "Fetching Jobs..."
  previousSearchAfterKey = null;
  previousSearchAfterKey1 = null;
  connectionJobs: boolean = false;
  totalJobsCount: any;
  getJobList() {
    if(this.jobId){
      this.obj.searchContent=this.jobId;
    }else{
      this.obj.searchContent='';
    }

    //this.util.startLoader()
    this.loadAPIcall=true;
    this.api.create("jobs/filter", this.obj).subscribe((res) => {
      this.loadAPIcall=false;
      this.util.stopLoader();
      if (res.data.totalJobsCount !=undefined) {
        this.totalJobsCount = res.data.totalJobsCount;
      }

      if (res.code == "00000" && res.data.jobList.length > 0) {
        this.connectionJobs = true ;
        this.jobFoundStatus = "Fetching Jobs...";

        if ((res.data.searchAfterKey[0] != this.previousSearchAfterKey) || this.obj.searchAfterKey == null) {
          var a: any = [res.data.searchAfterKey[0]]
          if (res.data.searchAfterKey[0] < 0) {
            this.obj.searchAfterKey = a;
            this.previousSearchAfterKey = res.data.searchAfterKey[0];
            this.stopscrollFlag = true
          }else  if (res.data.searchAfterKey[0] >0){
            this.obj.searchAfterKey = a;
            this.previousSearchAfterKey = res.data.searchAfterKey[0];
          }
          res.data.jobList.forEach(ele => {
            if (ele.user.photo != null) {
              ele.user.photo = AppSettings.photoUrl + ele.user.photo
            } else if (ele.user.photo == null) {
              ele.user.photo = "assets/images/userAvatar.png"
            }
            var a: any = 0
            this.response.push(ele)
            let dataa: any = this.response.filter((obj, pos, arr) => {
              return arr.map(mapobj => mapobj.jobId).indexOf(obj.jobId) == pos;
            })
            this.response = dataa;
            this.response.forEach((element,i) => {
              if(element.status != 'ACTIVE')
              {
                this.response.remove(i);
              }
            });
            this.commonvalues.setjobsData(this.response);
          })
        } else if (res.data.searchAfterKey[0] == this.previousSearchAfterKey) {
          this.stopscrollFlag = true
          res.data.jobList.forEach(ele => {
            if (ele.user.photo != null) {
              ele.user.photo = AppSettings.photoUrl + ele.user.photo
            } else if (ele.user.photo == null) {
              ele.user.photo = "assets/images/userAvatar.png"
            }
            this.response.push(ele)

            let dataa: any = this.response.filter((obj, pos, arr) => {
              return arr.map(mapobj => mapobj.jobId).indexOf(obj.jobId) == pos;
            })
            this.response = dataa;
              this.response.forEach((element,i) => {
                if(element.status != 'ACTIVE'){
                  this.response.remove(i);
                }
              });
              this.commonvalues.setjobsData(this.response);
          })
        } else if (!res.data.searchAfterKey) {
          this.stopscrollFlag = true
        } else if (res.data.searchAfterKey[0] < 0) {
          this.stopscrollFlag = true
        }
      } else if (res.code == "00000" && res.data.jobList.length === 0) {
        this.stopscrollFlag = true
        this.jobFoundStatus = "Couldn't find any Jobs."
        this.previousSearchAfterKey = null;
        this.previousSearchAfterKey1 = null;
        this.obj.searchAfterKey= null;
      }
      if (res.status == 500) {
        this.util.stopLoader()
      }
    })
  }

  coordinateReached: boolean = false
  @HostListener("window:scroll")
  handleScroll() {
    const windowScroll = window.pageYOffset;
    // console.log("windowScroll")
    // console.log(windowScroll)
    if (windowScroll >= 327.5) {
      this.coordinateReached = true;
    } else {
      this.coordinateReached = false;
    }
  }

  onScrollDown() {
      if (!this.stopscrollFlag) {
      this.getJobList();
    }
  }

}
