import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { UtilService } from 'src/app/services/util.service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreditModelComponent } from 'src/app/components/credit/credit-model/credit-model.component';
import { FormValidation } from 'src/app/services/FormValidation';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { BehaviorSubject } from 'rxjs';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';

@Component({
  selector: 'app-candidate-invite',
  templateUrl: './candidate-invite.component.html',
  styleUrls: ['./candidate-invite.component.scss']
})
export class CandidateInviteComponent extends FormValidation implements OnInit , OnChanges{

  @Input('title') title: string = 'Job Applicants';
  @Input() widgetDesc: string;
  @Input() isDefault : boolean = true;
  @Input() interactionResponse : any;
  userType = localStorage.getItem('userType');
  headerTitle: string = 'Job Applicants';
  user: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  response = new BehaviorSubject<any[]>([]);
  prevAfterKey : string = "";
  stopScroll : boolean = false;


  filterjob;
  totalCount: any;
  @Input() inputData: string;
  @Input() page: string;
  userId = localStorage.getItem('userId')
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
    userId: localStorage.getItem('userId')
  }
  url = AppSettings.photoUrl;
  loaddata:boolean=false;
  loadAPIcall:boolean=false

  constructor(private a_route: ActivatedRoute,
    private provider : countProvider, private modalService: BsModalService, private router: Router, private apiService: ApiService, private util: UtilService) {
    super();
   }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes.interactionResponse!=undefined&&changes.interactionResponse.currentValue != undefined){
      this.response = changes.interactionResponse.currentValue;
    }
  }



  ngOnInit() {

    this.userType = localStorage.getItem('userType');
    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      this.filterjob = res.candidatefilter;
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }

    })


    if(this.isDefault){
      this.jobsApi();
    }else{
      this.response = this.interactionResponse;
    }
  }
  totalapplicants: number = 10;
  jobsApi() {
    if(this.stopScroll){
      return;
    }
    this.loadAPIcall = true
    this.apiService.create("jobs/findMyJobApplicants", this.obj).subscribe((res) => {

     this.loaddata=true
     this.loadAPIcall=false

      if (res.code  === GigsumoConstants.SUCESSCODE && res.data.jobApplicants) {
        const afterKey = res.data.searchAfterKey;
        const resData = res.data.jobApplicants;

        if(this.prevAfterKey === afterKey || resData.length === 0){
          this.stopScroll = true;
          this.util.stopLoader();
          return;
        }

        this.totalapplicants = res.data.totalCount;
        const data = resData.map(ele => {
          ele.jobDetails.user = ele.user;
          if (ele.user.photo != null) {
            ele.user.photo =  ele.user.photo
          } else if (ele.user.photo == null) {
            ele.user.photo = null;
          }
          return ele;
        });

        const combined = [...this.response.getValue() , ...data];
        this.response.next(combined);

        this.prevAfterKey = afterKey;

        if (res.data.totalCount) {
          this.totalCount = res.data.totalCount;
          this.provider.setCount(this.totalCount);
        }
      }else{
        this.loaddata=false
      }
     });
  }

  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.menu = this.widgetDesc;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "CandidateInviteComponent";
    dataPass.count = this.totalCount;
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }
  currentPage: Number;
  pagecount(event) {
    this.configlist.currentPage = event;
    this.page = event;
    this.obj.pageNumber = event - 1;
    this.currentPage = event - 1;
    this.jobsApi();
  }

  open(data, path) {

  }
  bsModalRef: BsModalRef;

  openModalWithComponent() {
    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    // let data:any={}; data.sufficient=true;
    // this.router.navigate(["checkout"], { queryParams: data });
  }
  isExcludedStatus(status: string): boolean {
    return status === 'WITHDRAWN' || status === 'OFFER DECLINED' || status === 'INTERVIEW REJECTED';
  }

  onScrollDown(){
    if(!this.stopScroll&& this.obj.searchAfterKey != this.prevAfterKey){
      this.obj.searchAfterKey = this.prevAfterKey;
      this.jobsApi();
    }
      }


}





