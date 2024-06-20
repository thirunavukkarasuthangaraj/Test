import { SearchData } from 'src/app/services/searchData';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, QueryList, ViewChildren } from '@angular/core';
import { AppSettings } from 'src/app/services/AppSettings';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreditModelComponent } from 'src/app/components/credit/credit-model/credit-model.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PricePlanService } from 'src/app/components/Price-subscritions/priceplanService';
import { CandidateService } from 'src/app/services/CandidateService';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { BehaviorSubject } from 'rxjs';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';

@Component({
  selector: 'app-featured-candidate',
  templateUrl: './featured-candidate.component.html',
  styleUrls: ['./featured-candidate.component.scss']
})
export class FeaturedCandidateComponent implements OnInit {
  response = new BehaviorSubject<any[]>([]);
  responseAfterkey : string = null;
  responseStopScroll : boolean = false;
  loadAPIcall : boolean = false;

  @Input() widgetDesc: string;
  headerTitle;
  userType = localStorage.getItem('userType');
  candidatefilter
  totalCount: any;
  @Input() inputData: string;
  @Input() page: number;
  configlist = {
    itemsPerPage: 5,
    currentPage: 1
  }
  pathdata: any;
  @Input() maxMin: any = {};
  viewType: string = "MIN";
  obj: any = {
    limit: 10,
    searchAfterKey: null,
    createdBy: localStorage.getItem('userId')
  }
  sugges = null
  feaCandiCount: any;

  bsModalRef: BsModalRef;
  constructor(private a_route: ActivatedRoute, private modalService: BsModalService,
    private provider: countProvider, private router: Router, private apiService: ApiService,
    private candidateService : CandidateService , private util: UtilService, private searchdata: SearchData) { }

  click: boolean;
  ngOnInit() {
    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      this.searchdata.getWidget().subscribe(res => {
        this.click = res;
      })

      this.candidatefilter = res.jobfilter;
      this.pathdata = res.count;
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle =this.widgetDesc;
      }
      this.totalCount = this.pathdata;
      if (this.maxMin.viewType != undefined) {
        this.viewType = "MAX";
        this.inputData = this.maxMin.master;
      }
      if (res.singleCandiF == "true") {
        this.getSingleCandi(res.id, false)
      }
      else {
        this.jobsApi();
      }
    })

    var a = this.a_route.pathFromRoot[0]['_routerState']['snapshot'].url
    var b = a.substring(0, 20)
    if (b == '/newcandidates?jobId') {
      this.candidatefilter = "true";
    } if (b == '/newjobs?candidateId') {
      this.candidatefilter = "true";
    }



  }

  refereshFeatureCandidates() {
    this.obj = {
      limit: 10,
      searchAfterKey:null,
      createdBy: localStorage.getItem('userId')
    }
    this.jobsApi()
  }


  resultContent: string = "";
  totalcandidates: number = 10;
  jobsApi() {

    if(this.response === undefined || Array.isArray(this.response)){
      this.response = new BehaviorSubject<any[]>([]);
    }

    this.loadAPIcall=true;
    this.apiService.create("candidates/findFeaturedCandidates", this.obj).subscribe((res) => {

      this.loadAPIcall=false;
      if (res.code === GigsumoConstants.SUCESSCODE &&  res.data != null && res.data.candidateList != null) {

          const afterKey = res.data.searchAfterKey && res.data.searchAfterKey[0];
          const resData = res.data.candidateList;

          if(this.responseAfterkey === afterKey || resData.length === 0){
            this.responseStopScroll = true;
          }

          const data = resData.map(ele => ({
            ...ele,
            user: {
              ...ele.user,
              photo: ele.user.photo != null ? AppSettings.photoUrl + ele.user.photo : null
            }
          }));
          if (this.responseAfterkey !== afterKey) {
            const combine = [...this.response.getValue() , ...data];

          this.response.next(combine);
          }

          this.responseAfterkey = afterKey;

          this.feaCandiCount = resData.length;

          if (res.data.totalCandidates != undefined && res.data.totalCandidates != null) {
            this.totalcandidates = res.data.totalCandidates;
            this.provider.setCount(this.totalcandidates);
          }

          if (res.data.findAll) {
            this.obj.findAll = true;
            this.obj.pageNumber = 0;
          } else {
            this.obj.findAll = false;
          }

          if (res.data.candidateList === null || res.data.candidateList.length === 0){
            this.resultContent = 'NULL';
          }

      }
      else if (res.code == '99999') {
        this.response.next([]);
      }

    })
  }

  modelopen(data, show, candiid) {
    let dataPass: any = {};
    dataPass.data = data.getValue();
    dataPass.singleCandiF = show;
    dataPass.id = candiid;
    dataPass.menu = this.widgetDesc;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "FeaturedCandidateComponent";
    dataPass.count = this.totalCount;
    // console.log("datapasss",dataPass)
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }



  async redirect(val) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false;  }
    this.router.onSameUrlNavigation = 'reload';
    if (val.createdBy != localStorage.getItem('userId') && val.isViewed == false && this.userType != 'JOB_SEEKER') {

      // const userData = await this.planService.UPDATE_USERDETAILS("RESUME_VIEWS");
      // if (userData.isExpired ) {
      //   let availablePoints = null;
      //   let actualPoints = null;
      //   let utilizedPoints = null;
      //   userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
      //     if (ele.benefitKey == 'RESUME_VIEWS') {
      //       availablePoints = ele.available
      //       actualPoints = ele.actual
      //       utilizedPoints = ele.utilized
      //     }
      //   })
      //   this.planService.expiredPopup("RESUME_VIEWS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints);

      //   return;
      // }
     // else {
        this.updateView(val);
     // }
    }
    else{
       this.router.navigate(["newcandidates"], { queryParams: {candidateId : val.candidateId , tabName:'profileSummary' , From : 'FEATURED_CANDIDATE'} });
    }
  }


  updateView(val) {
       this.candidateService.updateCandidateViewed(val).subscribe((res) => {
        this.util.stopLoader();
          if(res.code==="00000"){
            this.router.navigate(["newcandidates"], { queryParams: {candidateId : val.candidateId , tabName:'profileSummary' , From : 'FEATURED_CANDIDATE'} });
          }
      }, err => {
        this.util.stopLoader();
      });

  }

  openModalWithComponent() {
    // const initialState: NgbModalOptions = {
    //   backdrop: 'static',
    //   keyboard: false,
    //   size: "open"
    // };
    // this.bsModalRef = this.modalService.show(CreditModelComponent, { initialState });
    // this.bsModalRef.content.closeBtnName = 'Close';
    //let data:any={}; data.sufficient=true; this.router.navigate(["checkout"], { queryParams: data });


    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);
  }
  currentPage: Number;
  pagecount(event) {
    this.configlist.currentPage = event;
    this.page = event;
    this.obj.pageNumber = this.page - 1;
    this.currentPage = this.page - 1
    this.jobsApi();
  }

  getSingleCandi(candiId, clickable) {
    if (candiId != null) {
      this.apiService.query("candidates/findCandidateById/" + candiId).subscribe((res) => {
        this.sugges = res.data.candidateData;
        if (clickable && this.click == true) {
          this.modelopen(this.sugges, true, candiId)
        }


      });

    }
  }

  onScrollDown(){
    if (!this.responseStopScroll && this.obj.searchAfterKey != this.responseAfterkey) {
      this.obj.searchAfterKey = this.responseAfterkey === null ? null
      : [this.responseAfterkey];
      this.jobsApi();
    }
  }
}
