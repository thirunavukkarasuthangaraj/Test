import { map } from 'rxjs/operators';
import { ApiService } from './../../services/api.service';
import { Router } from '@angular/router';
import { PageType } from 'src/app/services/pageTypes';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, Input, OnInit, Pipe, PipeTransform, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { log } from 'console';
import { AppSettings } from 'src/app/services/AppSettings';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreditModelComponent } from 'src/app/components/credit/credit-model/credit-model.component';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';

@Component({
  selector: 'app-suggested-job',
  templateUrl: './suggested-job.component.html',
  styleUrls: ['./suggested-job.component.scss']
})
export class SuggestedJobComponent implements OnInit, AfterViewInit {

  @Input('title') title: string = 'Suggested Job';
  @Input() widgetDesc: string;
  @Input() inputData: string;
  suggestion = new BehaviorSubject<any[]>([]);
  stopScroll : boolean = false;
  loadAPIcall : boolean = false;
  prevAfterkey : string = "";
  @Input() page: number;
  jobsFoundStatus: any = "Fetching Jobs..."


  headerTitle: string = 'Suggested Job';
  user: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  userType = localStorage.getItem('userType');
  filterjob;
  sugges = null
  datacheck: any;
  candidateId: any;
  totalCount: any;
  configlist = {
    itemsPerPage: 5,
    currentPage: 1
  }
  pathdata: any;
  @Input() maxMin: any = {};
  viewType: string = "MIN";
  datas = {
    userId: localStorage.getItem('userId'),
    searchAfterKey: null,
    limit: 10,
  };
  suggesJobCount: any;
  bsModalRef: BsModalRef;

  constructor(private a_route: ActivatedRoute, private util: UtilService, private modalService: BsModalService,
    private provider : countProvider, private apiService: ApiService, private router: Router, private searchdata: SearchData) {
  }
  ngAfterViewInit(): void {


  }

  openModalWithComponent() {

    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);


  }

  refershSugestedjob() {
    this.datas = {
      userId: localStorage.getItem('userId'),
      limit: 10,
      searchAfterKey : null
    };
    this.getjobs();
  }
  click: boolean;

  ngOnInit() {
     this.searchdata.getWidget().subscribe(res => {
      this.click = res;
    });

    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      this.candidateId = res.candidateId;

      if (res.singleJobS == "true") {
        this.getSingleJob(res.id, false)
      } else {
        this.getjobs();
      }


      if (res.candidateId != undefined) {
        this.getdatafromjob();
      }

      this.filterjob = res.candidatefilter;
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;

      }

      this.totalCount = this.pathdata;
      if (this.maxMin.viewType != undefined) {
        this.viewType = "MAX";
        this.inputData = this.maxMin.master;
      }

    })


    var a = this.a_route.pathFromRoot[0]['_routerState']['snapshot'].url
    var b = a.substring(0, 20)
    if (b == '/newcandidates?jobId') {
      this.filterjob = "true";
    } if (b == '/newjobs?candidateId') {
      this.filterjob = "true";
    }


  }


  getdatafromjob() {
      this.apiService.query("jobs/findJobById/" + this.candidateId).subscribe((res) => {
      let data: any = {};
      if (res.data != null) {
        data.userId = localStorage.getItem('userId');
        data.pageNumber = 0;
        data.limit = 10;
        data = res.data.candidateData;

      }
    })
  }

  resultContent: string = "";
  totalJobs: number = 10;
  getjobs() {

    if(this.suggestion === undefined || Array.isArray(this.suggestion)){
      this.suggestion = new BehaviorSubject<any[]>([]);
    }

    this.loadAPIcall=true;
    this.apiService.create("jobs/findSuggestedJobs", this.datas).subscribe((res) => {
      this.loadAPIcall=false;


      if(res.code === GigsumoConstants.SUCESSCODE && res.data && res.data.jobList){

        const resData = res.data.jobList;
        const afterKey = res.data.searchAfterKey && res.data.searchAfterKey[0];

        if(resData){

          if(this.prevAfterkey === afterKey || resData.length === 0){
            this.stopScroll = true;
          }

          if (resData === undefined || resData.length === 0) {
            this.resultContent = "NULL";
            this.suggesJobCount = 0;
          }
          if (this.suggestion != null) {
            this.suggesJobCount = resData.length;
          }

          const data = resData.map(ele => ({
            ...ele,
            user: {
              ...ele.user,
              photo: ele.user.photo != null ? AppSettings.photoUrl + ele.user.photo : null
            }
          }));

            const combined = [...this.suggestion.getValue() , ...data];
            this.suggestion.next(combined);


          this.prevAfterkey = afterKey;

          if (resData == null) {
            this.jobsFoundStatus = "Couldn't find any Jobs." ;
          }
        }


        if (res.data.totalJobs != undefined && res.data.totalJobs != null) {
          this.totalJobs = res.data.totalJobs;
          this.provider.setCount(this.totalJobs);
        }

      }
      else if (res.code == '99999') {
        this.suggestion = null;
      }

    })

  }

  getSingleJob(jobId, clickable) {
    if (jobId != null) {
      console.log("this foi 4234234called")
      this.apiService.query("jobs/findJobById/" + jobId).subscribe((res) => {
        this.sugges = res.data.jobData;

        if (res.data.jobData.user.photo != null && res.data.jobData.user.photo != undefined) {
          res.data.jobData.user.photo = AppSettings.photoUrl + res.data.jobData.user.photo;
        }
        else if (res.data.jobData.user.photo == null) {
          res.data.jobData.user.photo = null;
        }

        if (this.click == true && clickable) {
          this.modelopen(this.sugges, true, jobId)
        }
      });

    }
  }


  modelopen(data, show, jobid) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.singleJobS = show;
    dataPass.id = jobid;
    dataPass.menu = this.widgetDesc;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "SuggestedJobComponent";
    dataPass.count = this.totalCount;


    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }

  currentPage: Number;

  redirect(val) {
    var data: any = {};
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false;}
    this.router.onSameUrlNavigation = 'reload';
    data.jobId = val.jobId
      if (val.createdBy != localStorage.getItem('userId') && val.isViewed == false && localStorage.getItem('userType') != 'JOB_SEEKER') {

          data.jobId = val.jobId
          data.userId = localStorage.getItem('userId');
          data.jobPostedBy = localStorage.getItem('userId');
          this.util.startLoader();
          this.apiService.updatePut("jobs/updateJobViewed", data).subscribe((res) => {
            this.util.stopLoader();
            this.router.navigate(['newjobs'], { queryParams: {jobId : val.jobId , tabName:'job-details' , From : 'SUGGESTED_JOBS'} });
          }, err => {
            this.util.stopLoader();
          });
      } else {
        this.router.navigate(['newjobs'], { queryParams: {jobId : val.jobId , tabName:'job-details' , From : 'SUGGESTED_JOBS'} });
      }
  }

  onScrollDown(){
    if (!this.stopScroll && this.datas.searchAfterKey != this.prevAfterkey) {
      this.datas.searchAfterKey = this.prevAfterkey === null ? null
      : [this.prevAfterkey];
      this.getjobs();
    }
  }
}


