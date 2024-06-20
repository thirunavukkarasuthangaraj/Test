import { Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { candidateModel } from 'src/app/services/candidateModel';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-candidate-portfolio',
  templateUrl: './candidate-portfolio.component.html',
  styleUrls: ['./candidate-portfolio.component.scss'],
  inputs: ['candidateDetails', "pageName", "candidatePortfolio"]
})
export class CandidatePortfolioComponent implements OnInit, OnChanges {
  queryParams: any;
  candidateDetails: candidateModel;
  candidatePortfolio: jobModuleConfig;
  userId: any;
  constructor(private util: UtilService, private route: Router, private activateRoute: ActivatedRoute, private _location: Location,
    private searchData: SearchData) {
    this.userId = localStorage.getItem('userId');
    this.searchData.setHighlighter('newcandidates');
  }
  BackBreadCream() {
    this._location.back();
  }
  LandingPage() {
    this.route.navigate(["landingPage"]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.candidateDetails && changes.candidateDetails.currentValue) {
      this.candidateDetails = changes.candidateDetails.currentValue;
      // console.log("CANDIDATE_PORTFOLIO_CHANGES ", this.candidateDetails);
    }
  }


  ngOnInit() {

    window.scrollTo(0, 0)
    this.activateRoute.queryParams.subscribe((res) => {
      this.queryParams = res;
      var a = this.activateRoute.pathFromRoot[0]['_routerState']['snapshot'].url
      var b = a.substring(0, 20)
      this.pageNamevalues(b);
    })
  }
  pageNamevalues(b): void {
    this.util.startLoader();
    if (b == '/newcandidates/profi') {
      this.pageName = 'profileSummary'
    } else if (b == '/newcandidates/jobsA') {
      this.pageName = 'jobsApplied'
    } else if (b == '/newcandidates/candi') {
      this.pageName = 'candidateDetails'
    } else if (b == '/newcandidates/view') {
      this.pageName = 'candidate-viewed'
    } else if (b == '/newcandidates/reque') {
      this.pageName = 'candidate-requests-received'
    } else if (b == '/newcandidates/Clik') {
      this.pageName = 'Clike-like'
    } else if (b == '/newcandidates/cInvi') {
      this.pageName = 'cInvited'
    } else if (b == '/newcandidates/joba') {
      this.pageName = 'joba'
    } else if (b == '/newcandidates/jinv') {
      this.pageName = 'jinv'
    }
    this.util.stopLoader();
  }



  @ViewChild("widgetsticky") menuElement: ElementRef;
  widgetstick: boolean = false
  @HostListener("window:scroll")
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 5) {
      this.widgetstick = true;
    } else {
      this.widgetstick = false;
    }
  }

  pageName: any;

  showChevron: boolean = false;
  showChevron1: boolean = false;
  scrollLeft() {
    const scrollContainer12 = document.getElementById('scrollContainer12');
    scrollContainer12.scrollLeft -= 1000; // Adjust the scroll amount as needed
  }

  scrollRight() {
    const scrollContainer12 = document.getElementById('scrollContainer12');
    scrollContainer12.scrollLeft += 1000; // Adjust the scroll amount as needed
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

  onChange(value) {
    this.pageName = value;
    if (this.candidatePortfolio) {
      this.candidatePortfolio.jobDetails.apply(this.candidatePortfolio.source, [value]);
    }
    this.changePath();
    this.resetfilter(value);
  }

  @Output() resetfilters = new EventEmitter<any>();
  resetfilter(value){
    let data:any = {};
    data.pageName=value;
    this.resetfilters.emit(data);
  }
  @Output() removeJob = new EventEmitter<any>();
  changePath(){
    const url =  new URL(window.location.href);
    let queryParams = new URLSearchParams(url.hash.split('?')[1]);
    if (queryParams.has('jobId')) {
      queryParams.delete('jobId');
      const newHash = `${url.hash.split('?')[0]}?${queryParams.toString()}`;
      const newUrl = `${url.origin + url.pathname + newHash}`;
      window.history.pushState({}, '', newUrl);
          // selectedItem.parentType = "CANDIDATE_INVITATION";
         this.removeJob.emit('clear');
     }

  }


}
