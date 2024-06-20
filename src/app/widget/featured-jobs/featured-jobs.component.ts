import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AppSettings } from 'src/app/services/AppSettings';
import { ActivatedRoute } from '@angular/router';
import { SearchData } from 'src/app/services/searchData';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreditModelComponent } from 'src/app/components/credit/credit-model/credit-model.component';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { BehaviorSubject } from 'rxjs';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';

@Component({
  selector: 'app-featured-jobs',
  templateUrl: './featured-jobs.component.html',
  styleUrls: ['./featured-jobs.component.scss']
})
export class FeaturedJobsComponent implements OnInit {
  // img: any = 'assets/images/userAvatar.png';
  response = new BehaviorSubject<any[]>([]);
  stopScroll : boolean = false;
  loadAPIcall : boolean = false;
  prevAfterKey : string = '';
  @Input() widgetDesc: string;
  headerTitle;
  userType = localStorage.getItem('userType');
  filterjob;
  @Input() page: number;
  bsModalRef: BsModalRef;

  totalCount: any;
  pathdata: any;
  @Input() inputData: string;
  @Input() maxMin: any = {};
  viewType: string = "MIN";
  sugges = null


  configlist = {
    itemsPerPage: 5,
    currentPage: 1
  }
  obj: any = {
    limit: 10,
    searchAfterKey: null,
    jobPostedBy: localStorage.getItem('userId')
  }
  feaJobCount: any;


  constructor(private a_route: ActivatedRoute, private modalService: BsModalService, private searchdata: SearchData, private router: Router,
    private provider : countProvider, private apiService: ApiService, private util: UtilService) { }
  click: boolean
  ngOnInit() {
    this.searchdata.getWidget().subscribe(res => {
      this.click = res
    })
    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      this.filterjob = res.candidatefilter;
      this.pathdata = res.count;
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }
      this.totalCount = this.pathdata;

      if (res.singleJobF == "true") {
        this.getSingleJob(res.id, false);
      }
      else {
        this.jobsApi()

      }
    })
    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
    }


    var a = this.a_route.pathFromRoot[0]['_routerState']['snapshot'].url
    var b = a.substring(0, 20)
    if (b == '/newcandidates?jobId') {
      this.filterjob = "true";
    } if (b == '/newjobs?candidateId') {
      this.filterjob = "true";
    }


  }

  refreshFeaturedJobs() {
    this.obj = {
      limit: 10,
      pageNumber: 0,
      findAll: false,
      jobPostedBy: localStorage.getItem('userId')
    }
    this.jobsApi();
  }


  resultContent: string = "";
  totalJobs: number = 10;

  jobsApi() {
    if(this.response === undefined || Array.isArray(this.response)){
      this.response = new BehaviorSubject<any[]>([]);
    }


    this.loadAPIcall=true;
    this.apiService.create("jobs/findFeaturedJobs", this.obj).subscribe((res) => {
    this.loadAPIcall=false;

      if (res.code === GigsumoConstants.SUCESSCODE && res.data && res.data.jobList) {
        const resData = res.data.jobList;
        const afterKey = res.data.searchAfterKey && res.data.searchAfterKey[0];
        this.util.stopLoader();

        if (resData) {

          if(this.prevAfterKey === afterKey || resData.length === 0){
            this.stopScroll = true;
          }

          const data = res.data.jobList.map(ele => ({
            ...ele,
            user: {
              ...ele.user,
              photo: ele.user.photo != null ? AppSettings.photoUrl + ele.user.photo : null
            }
          }));

          const combined = [...this.response.getValue() , ...data];
          this.response.next(combined);

          this.prevAfterKey = afterKey;

          this.feaJobCount = resData.length;
          if (resData === null || resData.length === 0){
            this.resultContent = "NULL";
          }

          if (res.data.totalJobs != undefined && res.data.totalJobs != null) {
            this.totalJobs = res.data.totalJobs;
            this.provider.setCount(this.totalJobs);
          }


        }
      }
      else if (res.code == '99999') {
        this.response = null;
      }

    })
  }

  onScrollDown(){
    if (!this.stopScroll && this.obj.searchAfterKey != this.prevAfterKey) {
      this.obj.searchAfterKey = this.prevAfterKey === null ? null
      : [this.prevAfterKey];
      this.jobsApi();
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
    dataPass.singleJobF = show;
    dataPass.menu = this.widgetDesc;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "FeaturedJobsComponent";

    dataPass.count = this.totalCount;

    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }
  currentPage: Number;

  pagecount(event) {
    this.configlist.currentPage = event;
    this.page = event;
    this.obj.pageNumber = this.page - 1;
    this.currentPage = this.page - 1;
    this.jobsApi();
  }

  redirect(val) {
    var data: any = {};
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false;  }
    this.router.onSameUrlNavigation = 'reload';
    data.jobId = val.jobId;
      if (val.createdBy != localStorage.getItem('userId') && val.isViewed == false && localStorage.getItem('userType') != 'JOB_SEEKER') {

          data.jobId = val.jobId
          data.userId = localStorage.getItem('userId');

          data.jobPostedBy = localStorage.getItem('userId');
          this.util.startLoader();
          this.apiService.updatePut("jobs/updateJobViewed", data).subscribe((res) => {

            this.util.stopLoader();
            this.router.navigate(['newjobs'], { queryParams: {jobId : val.jobId , tabName:'job-details' , From : "FEATURED_JOB"} });
          }, err => {
            this.util.stopLoader();
          });

      } else {
        this.router.navigate(['newjobs'], { queryParams: {jobId : val.jobId , tabName:'job-details' , From : "FEATURED_JOB"} });

      }

  }



  getSingleJob(jobId, clickable) {
    if (jobId != null) {
      console.log("this foi called")
      this.apiService.query("jobs/findJobById/" + jobId).subscribe((res) => {
        this.sugges = res.data.jobData;
        if (clickable && this.click == true) {
          this.modelopen(this.sugges, true, jobId)
        }


      });

    }
  }

}
