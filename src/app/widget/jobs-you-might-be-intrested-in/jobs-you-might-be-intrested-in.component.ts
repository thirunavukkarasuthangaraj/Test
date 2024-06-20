import { SearchData } from 'src/app/services/searchData';
import { AppSettings } from 'src/app/services/AppSettings';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreditModelComponent } from 'src/app/components/credit/credit-model/credit-model.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';

@Component({
  selector: 'app-jobs-you-might-be-intrested-in',
  templateUrl: './jobs-you-might-be-intrested-in.component.html',
  styleUrls: ['./jobs-you-might-be-intrested-in.component.scss']
})
export class JobsYouMightBeIntrestedInComponent implements OnInit {
  loadAPIcall:boolean=false;
  @Input('title') title: string = 'Jobs you might be interested in ';
  @Input() widgetDesc: string;
  userType = localStorage.getItem('userType');
  headerTitle: string = 'Jobs you might be interested in ';
  user: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  response: any = [];
  filterjob;
  sugges = null
  jobsFoundStatus: any = "Fetching Jobs..."
  bsModalRef: BsModalRef;
  stopScroll : boolean = false;
  totalCount: any;
  @Input() inputData: string;
  @Input() page: number;
  configlist = {
    itemsPerPage: 5,
    currentPage: 1
  }
  pathdata: any;
  prevAfterkey : string = "";
  @Input() maxMin: any = {};
  viewType: string = "MIN";
  jobCount: any;

  constructor(private a_route: ActivatedRoute, private modalService: BsModalService,
    private provider : countProvider, private searchdata: SearchData, private router: Router, private apiService: ApiService, private util: UtilService) { }


  click: boolean;
  ngOnInit() {
    this.searchdata.getWidget().subscribe(res => {
      this.click = res
    })
    this.userType = localStorage.getItem('userType');
    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {

      if (res.singleJobY == 'true') {
        this.getSingleJob(res.id, false)
      }
      else {
        this.jobsApi();
      }

      if (res.candidatefilter) {
        this.filterjob = res.candidatefilter;
      }

      if (res.jobfilter) {
        this.filterjob = res.jobfilter;
      }

      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }

      if (this.maxMin.viewType != undefined) {
        this.viewType = "MAX";
        this.inputData = this.maxMin.master;
      }

    })

  }

  refershJObs() {
    this.obj.searchAfterKey=null;
    this.jobsApi();
  }

  obj: any = {
    limit: 10,
    pageNumber: 0,
    jobPostedBy: localStorage.getItem('userId'),
    searchAfterKey: null
  }

  resultContent: string = "";
  totalJobs: number = 10;
  jobsApi() {
    this.loadAPIcall = true;
    this.apiService.create("jobs/findJobsYouMayInterested", this.obj).subscribe((res) => {
      this.util.stopLoader();
      this.loadAPIcall = false;
      if (res.data != null) {
        const resData = res.data.jobList;
        const afterKey = res.data.searchAfterKey && res.data.searchAfterKey;
        if(resData){
          if (this.prevAfterkey === afterKey || resData.length === 0) {
            this.stopScroll = true;
          }

          if (resData === null || resData.length === 0) {
            this.resultContent = "NULL";
          } else {
            const tempResponse = resData.map(ele => ({
              ...ele,
              user: {
                ...ele.user,
                photo: ele.user.photo != null ? AppSettings.photoUrl + ele.user.photo : null
              }
            }));
            this.response = this.response.concat(tempResponse); // Concatenate new data to existing data
          }
          this.prevAfterkey = afterKey;
          this.jobCount = res.data.totalJobs;
          if (res.data.totalJobs != undefined && res.data.totalJobs != 0) {
            this.totalJobs = res.data.totalJobs;
            this.provider.setCount(this.totalJobs);
          }

        }

      }
    });
  }

  onScrollDown() {
    if (!this.stopScroll && this.obj.searchAfterKey != this.prevAfterkey) {
      this.obj.searchAfterKey = this.prevAfterkey === null ? null : this.prevAfterkey;
      this.jobsApi();
    }
  }


  redirect(val) {

    var data: any = {};
     this.router.routeReuseStrategy.shouldReuseRoute = function () { return false;}
      this.router.onSameUrlNavigation = 'reload';
    data.jobId = val.jobId;
      if (val.createdBy != localStorage.getItem('userId') && val.isViewed == false && localStorage.getItem('userType') != 'JOB_SEEKER') {

          data.jobId = val.jobId
          data.userId = localStorage.getItem('userId');

          data.jobPostedBy = localStorage.getItem('userId');
          this.util.startLoader();
          this.apiService.updatePut("jobs/updateJobViewed", data).subscribe((res) => {

            this.util.stopLoader();
            this.router.navigate(['newjobs'], { queryParams: {jobId : val.jobId , tabName:'job-details' , From : "JOBS_FROM_CONNECTION"} });
          }, err => {
            this.util.stopLoader();
          });


      } else {
        this.router.navigate(['newjobs'], { queryParams: {jobId : val.jobId , tabName:'job-details' , From : "JOBS_FROM_CONNECTION"} });
      }
  }

  openModalWithComponent() {

    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);


  }


  modelopen(data, show, jobid) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.id = jobid;
    dataPass.singleJobY = show;

    dataPass.menu = this.widgetDesc;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "JobsYouMightBeIntrestedInComponent";
    dataPass.count = this.totalCount;
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }
  currentPage: Number;
  pagecount(event: number) {
    this.configlist.currentPage = event;
    this.page = event;
    this.obj.pageNumber = event - 1;
    this.currentPage = event - 1;
    this.jobsApi()
  }
  getSingleJob(jobId, clickable) {
    if (jobId != null) {
      console.log("this foi called12")
      this.apiService.query("jobs/findJobById/" + jobId).subscribe((res) => {
        this.sugges = res.data.jobData;
        if (clickable && this.click == true) {
          this.modelopen(this.sugges, true, jobId)
        }
      });

    }
  }

}
