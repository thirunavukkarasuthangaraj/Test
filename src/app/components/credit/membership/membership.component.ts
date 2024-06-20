import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { SearchData } from 'src/app/services/searchData';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PlanDowngradeModelComponent } from '../../plan-downgrade-model/plan-downgrade-model.component';
import { ApiService } from './../../../services/api.service';
import { UtilService } from './../../../services/util.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit, OnDestroy {
  points: any = [];
  MemberShipType = localStorage.getItem('MemberShipType');
  userType = localStorage.getItem('userType');
  id = "1";
  public envName: any = environment.name;
  planDetails;
  findActiveCandidatesSub: Subscription;
  showcheckboxbtn: Boolean = true;
  statuskey:Boolean=true;
  loadAPIcall:boolean=false
  bsModalRef: BsModalRef;
  constructor(
    private modalService: BsModalService, private gigsumoService: GigsumoService,
    private api: ApiService,  private router: Router,private fb: UntypedFormBuilder, private util: UtilService,private searchData: SearchData) { }

  ngOnInit() {
    this.apicall();
    this.USER_PLAN_DETAILS();
    this.JobListAPI();
    this.candidatesListAPI();
    this.TeamListAPI();
    this.updateCount(this.seletedCandidateCount.length , this.selectedjobscount.length);

   }


  openModal() {
    const initialState = {  };
    this.bsModalRef = this.modalService.show(PlanDowngradeModelComponent, {
      initialState,
      keyboard:false,
      backdrop: 'static',
      class: 'model_forDowngrade',
    });
    this.bsModalRef.content.closeBtnName = 'Close';
  }


  activeTab(id) {
    this.id = id;

  }

  apicall() {
    this.loadAPIcall=true
    var data: any = {}
    data.userId = localStorage.getItem('userId');
    data.userType = localStorage.getItem('userType');
    this.api.create('user/profileDetails', data).subscribe(res => {
      this.loadAPIcall=false
      this.points = res.data;

    })

  }
  getMessage(): string {
    switch (this.userType) {
      case 'BENCH_RECRUITER':
        return 'Please pick 5 Candidates to Activate from the candidate listing';
      case 'RECRUITER':
        return 'Please pick 5 Jobs to Activate from the job listing';
      case 'FREELANCE_RECRUITER'||'MANAGEMENT_TALENT_ACQUISITION':
        return 'Please pick 5 Jobs and Candidates from the job and candidate listings';
      default:
        return '';
    }
  }



  // get active candidate
  findActiveCandidates: any;
  candidatesListAPI() {

    let data: any = { "userId": localStorage.getItem('userId'), "limit": 1000, "searchAfterKey": null }
    this.findActiveCandidatesSub = this.api.create('candidates/findActiveCandidates', data).subscribe(res => {
      this.findActiveCandidates = res.data.candidateList;
      this.util.stopLoader();
      this.findActiveCandidates.forEach((obj) => {
        obj.isSelected = false;
      });
    })
  }


  // get active jobs
  findActiveJobsSub: Subscription;
  findActiveJobs: any;
  JobListAPI() {

    let data: any = { "userId": localStorage.getItem('userId'), "limit": 1000, "searchAfterKey": null }
    this.findActiveJobsSub = this.api.create('jobs/findActiveJobs', data).subscribe(res => {
      this.findActiveJobs = res.data.jobList;
      this.util.stopLoader();
      this.findActiveJobs.forEach((obj) => {
        obj.isSelected = false;
      });
    })
  }



  // get teams

  findteamListSub: Subscription;
  findteamList:any=[];

  TeamListAPI() {

    let data: any = { "userId": localStorage.getItem('userId') }
    this.findteamListSub = this.api.query('teams/findActiveTeams/' + data.userId).subscribe(res => {
      this.util.stopLoader();
       this.findteamList=[];
      res.data.activeTeams.forEach(element => {
        // if(element.memberType=='OWNER'){
          element.isSelected=false;
          this.findteamList.push(element);
        // }
      });
    })
  }

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    class:'modal-lg'
  };

  openList = false;
  modalRef: BsModalRef;
  dontselectJob=false;
  plan(template: TemplateRef<any>) {

    this.USER_PLAN_DETAILS();
    this.JobListAPI();
    this.candidatesListAPI();
    this.TeamListAPI();

    let counts=(this.findActiveCandidates.length+this.findActiveJobs.length);

    if(this.findteamList.length <=1 && counts<6 ){
      this.dontselectJob=true;
      this.submit();
    }else{
      this.modalRef = this.modalService.show(template, this.backdropConfig);
    }



  }

  activejobcount: number = 0;
  activeCandidatesCount: number = 0;
  totalCount: number = 0;
  downgradeRequested:boolean=false;
  planCount: any = {
    benefitsUsages: [
      { utilized: 0 },
      { utilized: 0 },
      { utilized: 0 },
      { actual: 0 }
    ]
  };
  async USER_PLAN_DETAILS() {


    let planbenefits: any = await this.api.lamdaFunctionsget('findUserPlanBenefits/' + localStorage.getItem('userId'));
    if (planbenefits.data != undefined && this.userType != "JOB_SEEKER") {
      this.util.stopLoader();
      this.activejobcount = planbenefits.data.activeJobsCount != undefined ? planbenefits.data.activeJobsCount : 0;
      this.activeCandidatesCount = planbenefits.data.activeCandidatesCount != undefined ? planbenefits.data.activeCandidatesCount : 0;
      this.totalCount = this.activeCandidatesCount + this.activejobcount;
       if (planbenefits.data.userPlanAndBenefits) {
        this.planCount.benefitsUsages = [];
        this.planCount.benefitsUsages = planbenefits.data.userPlanAndBenefits.benefitsUsages;
      }
       localStorage.setItem("MemberShipType", planbenefits.data.userPlanAndBenefits.membershipType);

      if(planbenefits.data.userPlanAndBenefits.downgradeRequested!=undefined && planbenefits.data.userPlanAndBenefits.downgradeRequested){
        this.downgradeRequested=true;
      }else{
        this.downgradeRequested=false;
      }
    }

  }

  selectedCandidatedtoremove: any = [];
  seletedCandidateCount:any=[];
  getseletedCandidate(data: any) {
    this.seletedCandidateCount=[]
    this.updateCount(this.seletedCandidateCount.length , this.selectedjobscount.length);
    this.findActiveCandidates.forEach(obj => {
      if (data.value === obj.candidateId && data.flag === 'true') {
        obj.isSelected = true;
        this.seletedCandidateCount= this.findActiveCandidates.filter(obj => obj.isSelected === true);
        this.updateCount(this.seletedCandidateCount.length , this.selectedjobscount.length);

        console.log(this.seletedCandidateCount)
      } else if (data.value === obj.candidateId && data.flag === 'false') {
        obj.isSelected = false;
      }
    });
  }
  selectedjobscount:any=[];
  getseletedjobs(data: any) {
    this.selectedjobscount=[]
    this.updateCount(this.seletedCandidateCount.length , this.selectedjobscount.length);
    this.findActiveJobs.forEach(obj => {
      if (data.value === obj.jobId && data.flag === 'true') {
        obj.isSelected = true;
        this.selectedjobscount= this.findActiveJobs.filter(obj => obj.isSelected === true);
        this.updateCount(this.seletedCandidateCount.length , this.selectedjobscount.length);

        console.log(this.selectedjobscount)
      } else if (data.value === obj.jobId && data.flag === 'false') {
        obj.isSelected = false;
      }
    });
  }


  seletedTeamCount=[];
  count:any=[];
  getseletedTeams(data:any){

    this.updateCount(this.seletedCandidateCount.length , this.selectedjobscount.length);
    this.findteamList.forEach(obj => {
      if (data.value === obj.teamId && data.flag === 'true') {
        obj.isSelected = true;
        this.seletedTeamCount= this.findteamList.filter(obj => obj.isSelected === true);
        this.updateCount(this.seletedCandidateCount.length , this.selectedjobscount.length);
        console.log(this.seletedTeamCount)
      } else if (data.value === obj.teamId && data.flag === 'false') {
        obj.isSelected = false;
      }
    });


  }


  teamvalidation = false;
  updateCount(one: number, two: number) {
    this.count = (one || 0) + (two || 0);
  }

  submit() {
    Swal.fire({
      title: "Are you sure want to downgrade the plan?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then((result) => {
       if (result.isConfirmed) {
         this.apiDowngrade();
      } else if (result.isDenied) {
       }
    });

  }

  apiCancelDowngrade(){
    const userId = localStorage.getItem('userId');
    this.findActiveJobsSub = this.api.create('user/cancelDowngradeRequest/'+userId,{}).subscribe(res=>{
      if(res.code==="00000"){
         Swal.fire({
            icon: "success",
            title: "Downgrade Cancelled Successfully",
            timer: 2000,
          });
          setTimeout(() => {
            this.router.navigate(["landingPage"]);
            this.searchData.setHighlighter('landingPage');
          }, 1000);
      }
    })
  }

  requestDowngrade() {
    Swal.fire({
      icon: 'question',
      title: "Downgrade Alert!",
      text: "Are you sure you want to downgrade your current plan?",
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No',
      allowOutsideClick: false,
      allowEscapeKey: false
     }).then((result) => {
      if (result.isConfirmed) {
        this.apiDowngrade();
      }
    });
  }

  apiDowngrade(){
    const userId = localStorage.getItem('userId');
    const data = { userId, teamsToBeDeactivated: null, jobsToBeDeactivated: null, candiatesToBeDeactivated: null };

    this.findActiveJobsSub = this.api.create('user/requestForPlanDowngrade/'+userId,{}).subscribe(
      res => {
        this.findActiveJobs = res.data;
        this.util.stopLoader();
        this.dontselectJob = false;
        this.modalService.hide(1);
         if(res.code==="00000"){
          this.gigsumoService.planUpdatedTo = 'Free';
            const date = new Date(res.data.planUsageHistory.toDate);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(date);

            Swal.fire({
              icon: 'success',
              title: "Your request for plan downgrade is received",
              text: "Your plan will be downgraded on " + formattedDate + ". You will continue to enjoy the benefits of the current plan until then.",
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: false
             }).then((result) => {
              if (result.isConfirmed) {
                setTimeout(() => {
                  this.downgradeRequested = true;
                  // this.router.navigate(["landingPage"]);
                  // this.searchData.setHighlighter('landingPage');
                }, 1000);
              }
            });
        }else if (res.code==="99998"){
          Swal.fire({
            icon: "info",
            title: "Plan already downgraded",
            timer: 2000
          })

          this.downgradeRequested=true;
        }
      },
      error => {
         this.util.stopLoader();
       }
    );
  }



  ngOnDestroy() {
    if(this.findActiveCandidatesSub!=undefined){
      this.findActiveCandidatesSub.unsubscribe();
    }
   if(this.findteamListSub!=undefined){
      this.findteamListSub.unsubscribe();
    }
    if(this.findActiveJobsSub!=undefined){
      this.findActiveJobsSub.unsubscribe();
    }

  }

}
