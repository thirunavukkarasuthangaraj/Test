import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { CreditModelComponent } from 'src/app/components/credit/credit-model/credit-model.component';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { AppSettings } from 'src/app/services/AppSettings';
import { CandidateService } from 'src/app/services/CandidateService';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { SearchData } from 'src/app/services/searchData';
import { ApiService } from './../../services/api.service';
import { UtilService } from './../../services/util.service';

@Component({
  selector: 'app-suggested-candidate',
  templateUrl: './suggested-candidate.component.html',
  styleUrls: ['./suggested-candidate.component.scss']
})
export class SuggestedCandidateComponent implements OnInit {
  img: any = 'assets/images/userAvatar.png';
  userType = localStorage.getItem('userType');
  @Input() widgetDesc: string;
  @Input() page: number;
  headerTitle;
  candidatefilter
  @Input() inputData: string;
  suggestion = new BehaviorSubject<any[]>([]);
  prevAfterKey : string = "";
  stopScroll : boolean =  false;
  bsModalRef: BsModalRef;
  loadAPIcall:boolean=false;
  jobId
  src: any;
  totalCount: any;
  configlist = {
    itemsPerPage: 5,
    currentPage: 1
  }
  pathdata: any;
  @Input() maxMin: any = {};
  viewType: string = "MIN";
  data = {
    userId: localStorage.getItem('userId'),
    searchAfterKey: null,
    limit: 10,
  };
  sugges = null
  sugCandiCount: any;
  count: any;

  constructor(private a_route: ActivatedRoute, private modalService: BsModalService, private router: Router, private apiService: ApiService, private searchdata: SearchData,
    private util: UtilService, private provider: countProvider, private candidateService: CandidateService) { }

  click: boolean;
  ngOnInit() {


    this.searchdata.getWidget().subscribe(res => {
      this.click = res
    });
    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      this.jobId = res.jobId;



      this.candidatefilter = res.jobfilter;

      this.pathdata = res.count;
      this.totalCount = this.pathdata;
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }


      if (this.maxMin.viewType != undefined) {
        this.viewType = "MAX";
        this.inputData = this.maxMin.master;
      }
      if (res.singleCandiS == "true") {
        this.getSingleCandi(res.id, false)
      } else {
        this.getcandidate();
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

  openModalWithComponent() {

    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);


  }


  refereshSuggestedCandidate() {
    this.data.searchAfterKey=null
    this.getcandidate();
  }

  listLength
  getdatafromjob() {


    this.apiService.query("jobs/findJobById/" + this.jobId).subscribe((res) => {
      let datas = res.data.jobData;
      datas.userId = localStorage.getItem('userId');
      datas.pageNumber = 0;
      datas.limit = 10;
      datas.findAll = false;

      this.apiService.create("candidates/findSuggestedCandidates", datas).subscribe((res) => {
        // this.util.stopLoader();
        if (res.data.candidateList){
          this.suggestion.next(res.data.candidateList);
          this.listLength = this.suggestion.getValue().length;

          this.count = res.data.totalCandidates
          this.sugCandiCount = res.data.candidateList.length;
        }
        // this.src= AppSettings.photoUrl + res.data.candidateList.user.photo;

        // if (res.data.findAll) {
        //   this.data.findAll = true
        //   this.data.pageNumber = 0;

        // } else {
        //   this.data.findAll = false;
        // }
        if (res.data.totalCandidates) {
          this.totalCount = res.data.totalCandidates;
        }


      })


    })
  }
  resultContent: string = "";
  totalcandidates: number = 10;

  getcandidate() {

    if(this.suggestion === undefined || Array.isArray(this.suggestion)){
      this.suggestion = new BehaviorSubject<any[]>([]);
    }
    this.loadAPIcall=true;
    this.apiService.create("candidates/findSuggestedCandidates", this.data).subscribe((res) => {
      this.loadAPIcall=false;
      if (res.code === GigsumoConstants.SUCESSCODE && res.data && res.data.candidateList != undefined) {
        const afterKey = res.data.searchAfterKey && res.data.searchAfterKey[0];
        const resData = res.data.candidateList;


        if(this.prevAfterKey === afterKey || resData.length === 0){
          this.stopScroll = true;
          this.util.stopLoader();
          return;
        }

        const data = resData.map(ele => {
          const d  ={
            ...ele,
            user: {
              ...ele.user,
              photo: ele.user.photo != null ? AppSettings.photoUrl + ele.user.photo : null
            }
          }
          return d;
        });

          const combined = [...this.suggestion.getValue(), ...data];
          this.suggestion.next(combined);

        this.prevAfterKey = afterKey;
        if (res.data.totalCandidates != undefined && res.data.totalCandidates != null) {
          this.totalcandidates = res.data.totalCandidates;
          this.provider.setCount(this.totalcandidates);
        }

        if (resData == null || (resData != null && resData.length === 0)) {
          this.resultContent = "NULL";
        }

      }
      else if (res.code == '99999') {
        this.suggestion.next([]);
      }

      this.util.stopLoader();

    });
  }



  modelopen(data, show, candiid) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.singleCandiS = show;
    dataPass.id = candiid;
    dataPass.menu = this.widgetDesc;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "SuggestedCandidateComponent";
    dataPass.count = this.totalCount;

    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }


  async redirect(val) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; }
    this.router.onSameUrlNavigation = 'reload';
    if (val.createdBy != localStorage.getItem('userId') && !val.isViewed &&
      this.userType != 'JOB_SEEKER') {
      // const userData = await this.planService.UPDATE_USERDETAILS("RESUME_VIEWS");
      // if (userData.isExpired) {
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
      //}
    }
    else {
      this.router.navigate(['newcandidates'], { queryParams: { candidateId: val.candidateId, tabName: 'profileSummary', From: 'SUGGESTED_CANDIDATES' } })
    }
  }



  updateView(val) {
    this.candidateService.updateCandidateViewed(val).subscribe((res) => {
      this.util.stopLoader();
      if (res.code === "00000") {
        this.router.navigate(['newcandidates'], { queryParams: { candidateId: val.candidateId, tabName: 'profileSummary', From: 'SUGGESTED_CANDIDATES' } })
      }
    }, err => {
      this.util.stopLoader();
    });
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
    if (!this.stopScroll && this.data.searchAfterKey != this.prevAfterKey) {
      this.data.searchAfterKey = this.prevAfterKey === null ? null
      : [this.prevAfterKey];
      this.getcandidate();
    }
  }
}
