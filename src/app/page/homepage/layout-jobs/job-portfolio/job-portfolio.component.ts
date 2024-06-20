import { Router, ActivatedRoute } from '@angular/router';
import { Component, ElementRef, HostListener, OnChanges, OnInit, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import {Location} from '@angular/common';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { JobModel } from 'src/app/services/jobModel';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';

@Component({
  selector: 'app-job-portfolio',
  templateUrl: './job-portfolio.component.html',
  styleUrls: ['./job-portfolio.component.scss'],
  inputs : ['jobData' , "pageName" , "jobPortfolio"]
})
export class JobPortfolioComponent implements OnInit , OnChanges{
  queryParams: any;
  jobPortfolio : jobModuleConfig;
  jobData : JobModel;
  constructor(private util:UtilService,private route: Router,private _location: Location, private activateRoute: ActivatedRoute,
    private searchData : SearchData) {
    this.userId = localStorage.getItem('userId');
    this.userType=localStorage.getItem('userType')
    this.searchData.setHighlighter('newjobs');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.jobData && changes.jobData.currentValue){
      this.jobData =  changes.jobData.currentValue;
      // console.log("JOB_PORTFOLIO_CHANGES " , this.jobData);
    }
  }

  pageName:any;
  userId: any;
  userType:any
  ngOnInit() {
    window.scroll(0,0)

  }


  showChevron: boolean = false;
  showChevron1: boolean = false;
  scrollLeft() {
    const scrollContainer = document.getElementById('scrollContainer1');
    scrollContainer.scrollLeft -= 1000; // Adjust the scroll amount as needed
  }

  scrollRight() {
    const scrollContainer = document.getElementById('scrollContainer1');
    scrollContainer.scrollLeft += 1000; // Adjust the scroll amount as needed
  }

  onMouseEnter() {
    this.showChevron = true;
  }

  onMouseLeave() {
    this.showChevron = false;
  }

  onMouseEnter1() {
    this.showChevron1 = true;
  }

  onMouseLeave1() {
    this.showChevron1 = false;
  }


    pageNamevalues(b):void{
      this.util.startLoader();
    if(b == '/newjobs/job-applic'){
      this.pageName = 'job-applicants'
    }else if(b == '/newjobs/job-detail'){
      this.pageName = 'job-details'
    }else if(b == '/newjobs/jobs-viewe'){
      this.pageName = 'jobs-viewed'
    }else if(b == '/newjobs/job-reques'){
      this.pageName = 'job-requests-received'
    }else if(b == '/newjobs/jobs-liked'){
      this.pageName = 'jobs-liked'
    }else if(b == '/newjobs/jobs-invit'){
      this.pageName = 'jobs-invitedlist'
    }else if(b == '/newjobs/candidates'){
      this.pageName = 'candidates-invited'
    }
    else if(b == '/newjobs/job-applicants'){
      this.pageName = 'job-filter'
    }else if(b == '/newjobs/candi-filt'){
      this.pageName = 'candi-filter'
    }else if(b == '/newjobs/job-applic'){
      this.pageName = 'candidate-applied'
    }
    this.util.stopLoader();
  }

  // @ViewChild("widgetsticky", { static: false }) menuElement: ElementRef;
  // widgetstick: boolean = false
  // @HostListener("window:scroll")
  // handleScroll() {
  //   const windowScroll = window.pageYOffset || window.scrollY;
  //   if (windowScroll >= 20) {
  //     this.widgetstick = true;
  //   } else {
  //     this.widgetstick = false;
  //   }
  // }

  BackBreadCream(){
    this._location.back();
  }
  LandingPage(){
    this.route.navigate(["landingPage"]);
  }

  filterDatas={};
  exchangeparenttochild(){

  }

  onChange(value){

    this.pageName = value;
    this.jobPortfolio.jobDetails.apply(this.jobPortfolio.source,[value]);
    let data:any = {};
    data.filter = false;
    data.pageName=this.pageName;
    this.changePath();
    this.resetfilter(value);

  }

  @Output() resetfilters = new EventEmitter<any>();
  resetfilter(value){
    let data:any = {};
    data.pageName=value;
    this.resetfilters.emit(data);
  }
  @Output() removeCandidate = new EventEmitter<any>();
  changePath(){
    const url =  new URL(window.location.href);
    let queryParams = new URLSearchParams(url.hash.split('?')[1]);
    if (queryParams.has('candidateId')) {
      queryParams.delete('candidateId');
      const newHash = `${url.hash.split('?')[0]}?${queryParams.toString()}`;
      const newUrl = `${url.origin + url.pathname + newHash}`;
      window.history.pushState({}, '', newUrl);

         // selectedItem.parentType = "CANDIDATE_INVITATION";
         this.removeCandidate.emit('clear');
     }

  }

}
