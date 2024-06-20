import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from 'src/app/services/AppSettings';
import { SearchData } from 'src/app/services/searchData';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreditModelComponent } from 'src/app/components/credit/credit-model/credit-model.component';
import { PricePlanService } from 'src/app/components/Price-subscritions/priceplanService';
import { CandidateService } from 'src/app/services/CandidateService';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';

@Component({
  selector: 'app-candidate-you-might-be-intrested-in',
  templateUrl: './candidate-you-might-be-intrested-in.component.html',
  styleUrls: ['./candidate-you-might-be-intrested-in.component.scss']
})
export class CandidateYouMightBeIntrestedInComponent implements OnInit {

  @Input('title') title: string = 'Jobs you might be interested in ';
  @Input() widgetDesc: string;

  headerTitle: string = 'Jobs you might be interested in ';
  user: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  userType: any = localStorage.getItem('userType');
  candidatefilter
  response: any = [];
  totalCount: any;
  sugges = null
  @Input() inputData: string;
  @Input() page: string;
  configlist = {
    itemsPerPage: 5,
    currentPage: 1
  }
  pathdata: any;
  stopScroll : boolean = false;
  @Input() maxMin: any = {};
  viewType: string = "MIN";
  candidateCount: any;
  prevAfterkey : string = "";
  bsModalRef: BsModalRef;
  loadAPIcall:boolean=false;
   params: any = {
    limit: 10,
    pageNumber: 0,
    createdBy: localStorage.getItem('userId'),
    searchAfterKey: null
  }

  constructor(private a_route: ActivatedRoute, private planService: PricePlanService, private modalService: BsModalService,
    private searchdata: SearchData, private router: Router, private apiService: ApiService, private provider : countProvider,
    private candidateService: CandidateService, private util: UtilService) { }


  click: boolean
  ngOnInit() {
    this.searchdata.getWidget().subscribe(res => {
      this.click = res
    })
    this.userType = localStorage.getItem('userType');
    this.headerTitle = this.widgetDesc;

    this.a_route.queryParams.subscribe((res) => {

      if (res.singleCandiY == "true") {
        this.getSingleCandi(res.id, false)
      } else {
        this.candidateApi()
      }

      this.candidatefilter = res.jobfilter;

      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }

      if (this.maxMin.viewType != undefined) {
        this.viewType = "MAX";
        this.inputData = this.maxMin.master;
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
  onScrollDown(){
    if (!this.stopScroll && this.params.searchAfterKey != this.prevAfterkey) {
      this.params.searchAfterKey = this.prevAfterkey === null ? null
      : this.prevAfterkey;
      this.candidateApi();
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


  modelopen(data, show, candiid) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.id = candiid;
    dataPass.singleCandiY = show;
    dataPass.menu = this.widgetDesc;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "CandidateYouMightBeIntrestedInComponent";
    dataPass.count = this.totalCount;
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }

  async redirect(val) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; }
    this.router.onSameUrlNavigation = 'reload';

    if (val.createdBy != localStorage.getItem("userId") && val.isViewed == false &&
      this.userType != "JOB_SEEKER") {
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
      //} else {
        this.updateView(val);
     // }
    } else {
      this.router.navigate(['newcandidates'], { queryParams: { candidateId: val.candidateId, tabName: 'profileSummary', From: 'CANDIDATES_FROM_CONNECTION' } })
    }

  }

  updateView(val) {
    this.util.startLoader();
    this.candidateService.updateCandidateViewed(val)
      .subscribe(
        (res) => {
          this.util.stopLoader();
          if (res.code === "00000") {
            this.router.navigate(['newcandidates'], { queryParams: { candidateId: val.candidateId, tabName: 'profileSummary', From: 'CANDIDATES_FROM_CONNECTION' } })
          }
        },
        (err) => {
          this.util.stopLoader();
        }
      );
  }

  refreshCandidate() {
    this.params.searchAfterKey=null
    this.candidateApi();
  }

  resultContent: string = "";
  totalcandidates: number = 10;

  candidateApi() {

    this.loadAPIcall=true;
    this.apiService.create("candidates/findCandidateYouMayInterested", this.params).subscribe((res) => {
      this.loadAPIcall=false;

         if (res != null && res.data != null) {
            const resData = res.data.candidateList;
            const afterKey = res.data.searchAfterKey && res.data.searchAfterKey;
            if(resData){
              if(this.prevAfterkey === afterKey || resData.length === 0){
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

            }
            if (res.data.totalCandidates != undefined && res.data.totalCandidates != 0) {
              this.totalcandidates = res.data.totalCandidates;
              this.candidateCount = res.data.totalCandidates;
            this.provider.setCount(this.candidateCount);
            }
      }

    })
  }

  currentPage: Number;
  pagecount(event) {

    this.configlist.currentPage = event;
    this.page = event;
    this.currentPage = event - 1
    this.params.pageNumber= this.currentPage;
    this.candidateApi();
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
}
