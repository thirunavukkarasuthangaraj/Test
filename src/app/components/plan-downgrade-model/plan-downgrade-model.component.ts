import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Gtag } from 'angular-gtag';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
// import { decrement, increment, setPlan } from 'src/app/app.actions';
import { AppSettings } from 'src/app/services/AppSettings';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-downgrade-model',
  templateUrl: './plan-downgrade-model.component.html',
  styleUrls: ['./plan-downgrade-model.component.scss']
})
export class PlanDowngradeModelComponent implements OnInit, OnDestroy {
  @Input() data: any;
  MemberShipType = localStorage.getItem('MemberShipType');
  userType = localStorage.getItem('userType');
  id = "1";
  public envName: any = environment.name;
  planDetails;
  findActiveCandidatesSub: Subscription;
  showcheckboxbtn: Boolean = true;
  statuskey: Boolean = true;
  bsModalRef: BsModalRef;
  alertTitle: string = '';
  count$: Observable<number>;
  modalRef: NgbModalRef;
  teamPlanUrl: any;
  constructor(
    private modalService: BsModalService,
    private api: ApiService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private util: UtilService,
    private searchData: SearchData,
    private datePipe: DatePipe,
    private gigsumoService: GigsumoService,
    private gtag: Gtag
    // private store: Store<{ app: { planName: string } }>
  ) {
    this.teamPlanUrl = environment.PaymentmonthSub + '?prefilled_email=' + localStorage.getItem('userName');
  }

  ngOnInit() {
    this.user()
    this.USER_PLAN_DETAILS();
    this.JobListAPI();
    this.candidatesListAPI();
    this.TeamListAPI();
    this.fetchActiveNetwork();
    this.updateCount(this.seletedCandidateCount.length, this.selectedjobscount.length);
    setTimeout(async () => {
      if (this.findteamList != undefined && this.findActiveJobs != undefined && this.networklist && this.networklist != undefined) {
        let counts = await (this.findActiveCandidates.length + this.findActiveJobs.length);
        let networkCounts = this.networklist.length;
        if (this.findteamList.length <= this.data.allowedWorkspaceCount
          && counts <= this.data.allowedJobsCandidatesCount
          && networkCounts <= this.data.allowedNetworksCount) {
          this.closeModal();
        }
      }
      if (this.data.isDowngraded == true && this.data.isPromotional == true) {
        this.alertTitle = this.prepareContent(this.data.planBenefits, 'both');
      } else if (this.data.isDowngraded == true && this.data.isPromotional == false) {
        this.alertTitle = this.prepareContent(this.data.planBenefits, 'planExpired');
      } else if (this.data.isDowngraded == false && this.data.isPromotional == true) {
        this.alertTitle = this.prepareContent(this.data.planBenefits, 'promotionExpired');
      } else if (this.data.isUpgrading == true) {
        this.alertTitle = this.prepareContent(this.data.planBenefits, 'prerequisitesBeforeUpgrade');
      }
    }, 3000);
    // console.log("Received data")
    // console.log(this.data)
  }

  // changePlanTo(planName: string) {
  //   this.store.dispatch(setPlan({ planName }));
  // }

  // decrement() {
  //   this.store.dispatch(decrement());
  // }

  closeModel() {
    this.modalService.hide(1);
  }

  getMessage(): string {
    switch (this.userType) {
      case 'BENCH_RECRUITER':
        if (this.activeCandidatesCount > this.data.allowedJobsCandidatesCount && this.data.allowedJobsCandidatesCount != 0
          && this.totalCount > this.data.allowedJobsCandidatesCount) {
          return `Please pick ${this.data.allowedJobsCandidatesCount} candidates to activate from the candidate listing`;
        }
      case 'RECRUITER':
        if (this.activejobcount > this.data.allowedJobsCandidatesCount && this.data.allowedJobsCandidatesCount != 0
          && this.totalCount > this.data.allowedJobsCandidatesCount) {
          return `Please pick ${this.data.allowedJobsCandidatesCount} jobs to activate from the job listing`;
        }
      case 'FREELANCE_RECRUITER':
      case 'MANAGEMENT_TALENT_ACQUISITION':
        if (this.totalCount > this.data.allowedJobsCandidatesCount && this.data.allowedJobsCandidatesCount != 0) {
          return `Please pick ${this.data.allowedJobsCandidatesCount} jobs and candidates from the job and candidate listings`;
        }
      default:
        return '';
    }
  }



  // get active candidate
  findActiveCandidates: any;
  candidatesListAPI() {
    this.util.startLoader();
    let data: any = { "userId": localStorage.getItem('userId'), "limit": 1000, "searchAfterKey": null }
    this.findActiveCandidatesSub = this.api.create('candidates/findActiveCandidates', data).subscribe(res => {
      this.findActiveCandidates = res.data.candidateList;
      this.util.stopLoader();
      this.findActiveCandidates.forEach((obj) => {
        if(this.activeCandidatesCount + this.activejobcount > this.data.allowedJobsCandidatesCount) {
          obj.isSelected = false;
        } else {
          obj.isSelected = true
        }
      });
    })
  }

  userInfo: any = {};
  async user() {
    await this.api.query('user/' + localStorage.getItem('userId')).subscribe(res => {
      this.userInfo = res;
    })
  }

  seletedTeamCount = [];
  count: any = [];
  teamSelectedItem(checked, item) {

    this.updateCount(this.seletedCandidateCount.length, this.selectedjobscount.length);
    this.findteamList.forEach(obj => {
      if (checked && item.teamId === obj.teamId) {
        obj.isSelected = true;
        this.seletedTeamCount = this.findteamList.filter(obj => obj.isSelected === true);
        this.updateCount(this.seletedCandidateCount.length, this.selectedjobscount.length);
        console.log(this.seletedTeamCount)
      } else if (!checked && item.teamId === obj.teamId) {
        obj.isSelected = false;
        this.seletedTeamCount = [];
      }
    });


  }

  selectNetwork(checked, item) {
    this.updateNetworkCount(this.selectedNetworkCount);
    this.networklist.forEach(obj => {
      if (checked && item.networkId === obj.networkId) {
        obj.isSelected = true;
        this.selectedNetworkCount = this.networklist.filter(obj => obj.isSelected === true);
        this.updateNetworkCount(this.selectedNetworkCount);
      } else if (!checked && item.networkId === obj.networkId) {
        obj.isSelected = false;
        this.selectedNetworkCount = []
      }
    })
  }


  // get active jobs
  isRoutingDisabled: boolean = true;
  findActiveJobsSub: Subscription;
  findActiveJobs: any;
  panelOpenState: boolean = false
  panelOpenState1: boolean = false
  panelOpenState2: boolean = false
  panelOpenState3: boolean = false
  panelOpenState4: boolean = false
  JobListAPI() {
    this.util.startLoader();
    let data: any = { "userId": localStorage.getItem('userId'), "limit": 1000, "searchAfterKey": null }
    this.findActiveJobsSub = this.api.create('jobs/findActiveJobs', data).subscribe(res => {
      this.findActiveJobs = res.data.jobList;
      this.util.stopLoader();
      this.findActiveJobs.forEach((obj) => {
        if (this.activeCandidatesCount + this.activejobcount > this.data.allowedJobsCandidatesCount) {
          obj.isSelected = false;
        } else {
          obj.isSelected = true;
        }
        obj.user.photo == null || obj.user.photo == undefined ? obj.user.photo = null : obj.user.photo = AppSettings.photoUrl + obj.user.photo;
      });
    })
  }



  // get teams

  findteamListSub: Subscription;
  findteamList: any = [];

  TeamListAPI() {
    this.util.startLoader();
    let data: any = { "userId": localStorage.getItem('userId') }
    this.findteamListSub = this.api.query('teams/findActiveTeams/' + data.userId).subscribe(res => {
      this.util.stopLoader();
      this.findteamList = [];
      res.data.activeTeams.forEach(element => {
        if (res.data.activeTeams.length <= GigsumoConstants.FREE_PLAN_TEAM_COUNT) {
          element.isSelected = true;
        } else {
          element.isSelected = false;
        }
        this.findteamList.push(element);
      });
    })
  }

  networklist: Array<any>;
  fetchActiveNetwork() {
    this.util.startLoader()
    let status = 'ACTIVE';
    this.api.query("network/home?userId=" + localStorage.getItem('userId') + "&withmember=true&limit=10&offset=0&status=" + status).subscribe(res => {
      this.networklist = res.data.network.filter(ele => ele.isDefaultNetwork === false && ele.memberType == "OWNER" && ele.status == GigsumoConstants.ACTIVE);
      if(this.networklist.length > 0) {
        this.networklist.forEach(ele=>{
          if(this.networklist.length <= GigsumoConstants.FREE_PLAN_NETWORK_COUNT) {
            ele.isSelected = true
          }else{
            ele.isSelected = false
          }
        })
      }
    })
  }

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    class: 'modal-lg'
  };
  activejobcount: number = 0;
  activeCandidatesCount: number = 0;
  totalCount: number = 0;
  planCount: any = {
    benefitsUsages: [
      { utilized: 0 },
      { utilized: 0 },
      { utilized: 0 },
      { actual: 0 }
    ]
  };
  async USER_PLAN_DETAILS() {
    this.util.startLoader();
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
    }
  }

  selectedCandidatedtoremove: any = [];
  seletedCandidateCount: any = [];
  getseletedCandidate(data: any) {
    this.seletedCandidateCount = []
    this.updateCount(this.seletedCandidateCount.length, this.selectedjobscount.length);
    this.findActiveCandidates.forEach(obj => {
      if (data.candidateId === obj.candidateId && data.flag === 'true') {
        obj.isSelected = true;
        this.seletedCandidateCount = this.findActiveCandidates.filter(obj => obj.isSelected === true);
        this.updateCount(this.seletedCandidateCount.length, this.selectedjobscount.length);
      } else if (data.candidateId === obj.candidateId && data.flag === 'false') {
        obj.isSelected = false;
      }
    });
  }
  selectedjobscount: any = [];
  getseletedjobs(data: any) {
    this.selectedjobscount = []
    this.updateCount(this.seletedCandidateCount.length, this.selectedjobscount.length);
    this.findActiveJobs.forEach(obj => {
      if (data.value.jobId === obj.jobId && data.flag === 'true') {
        obj.isSelected = true;
        this.selectedjobscount = this.findActiveJobs.filter(obj => obj.isSelected === true);
        this.updateCount(this.seletedCandidateCount.length, this.selectedjobscount.length);

        // console.log("this.selectedjobscount")
        // console.log(this.selectedjobscount)

        // console.log("this.seletedCandidateCount")
        // console.log(this.seletedCandidateCount)
      } else if (data.value.jobId === obj.jobId && data.flag === 'false') {
        obj.isSelected = false;
      }
    });
  }
  selectedNetworkCount: any = [];
  getSelectedNetwork(data: any) {
    this.selectedNetworkCount = []
    this.updateNetworkCount(this.selectedNetworkCount.length);
    this.networklist.forEach(obj => {
      if (data.networkId === obj.networkId && data.flag === 'true') {
        obj.isSelected = true;
        this.selectedNetworkCount = this.networklist.filter(obj => obj.isSelected === true);
        this.updateNetworkCount(this.selectedNetworkCount.length);
      } else if (data.networkId === obj.networkId && data.flag === 'false') {
        obj.isSelected = false;
      }
    })
  }




  teamvalidation = false;
  updateCount(one: number, two: number) {
    this.count = (one || 0) + (two || 0);
  }

  networkCount: number = 0;
  updateNetworkCount(value: number) {
    this.networkCount = value || 0;
  }




  submit() {

    const jobsSelected = this.findActiveJobs.filter(obj => obj.isSelected).length;
    const candidatesSelected = this.findActiveCandidates.filter(obj => obj.isSelected).length;
    const teamsSelected = this.findteamList.filter(obj => obj.isSelected).length;
    const networkSelected = this.networklist.filter(obj => obj.isSelected).length;
    let minimumNetworkSelectionRequired = this.data.allowedNetworksCount;
    let minimumSelectionRequired = this.data.allowedJobsCandidatesCount;
    let minimumTeamSelectionRequired = this.data.allowedWorkspaceCount;
    let add: number = (jobsSelected + candidatesSelected);
    let activteJobCandidate: number = (this.findActiveJobs.length + this.findActiveCandidates.length);
    let activeNetworks: number = this.networklist.length;
    let activeTeams: number = this.findteamList.length;
    let callApiCondition = false;
    let message = "";
    if ([GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION, GigsumoConstants.FREELANCE_RECRUITER].includes(this.userType)) {

      if (activteJobCandidate > this.data.allowedJobsCandidatesCount && minimumSelectionRequired != add) {
        message = `Please select a total of ${this.data.allowedJobsCandidatesCount} candidates & jobs combined.`;
      }
      // else if (
      //   (activteJobCandidate <= this.data.allowedJobsCandidatesCount
      //     || activteJobCandidate > this.data.allowedJobsCandidatesCount
      //     && minimumSelectionRequired == add)
      //   && this.findteamList.length !== 0
      //   && teamsSelected === 0)
      else if (activeTeams > minimumTeamSelectionRequired && minimumTeamSelectionRequired != teamsSelected) {
        message = `Please select at least ${this.data.allowedWorkspaceCount} Team`;
      } else if (activeNetworks > minimumNetworkSelectionRequired && minimumNetworkSelectionRequired != networkSelected) {
        message = `Please select a minimum of ${this.data.allowedNetworksCount} network(s)`
      } else {
        callApiCondition = true;
      }

    }

    else if (this.userType == GigsumoConstants.RECRUITER) {

      if (this.findActiveJobs.length >= GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT && jobsSelected != minimumSelectionRequired) {
        message = `Please select ${GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT} jobs`;
      } else if (this.findteamList.length !== 0 && teamsSelected !== this.data.allowedWorkspaceCount) {
        message = `Please select a minimum of ${this.data.allowedWorkspaceCount}`;
      } else if (activeNetworks > 0 && minimumNetworkSelectionRequired != networkSelected) {
        message = `Please select a minimum of ${this.data.allowedNetworksCount} network(s)`
      } else {
        callApiCondition = true;
      }

    } else if (this.userType == GigsumoConstants.BENCH_RECRUITER) {
      if (this.findActiveCandidates.length >= GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT && candidatesSelected != minimumSelectionRequired) {
        message = `Please select ${GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT} candidates`;
      } else if (this.findteamList.length !== 0 && teamsSelected !== this.data.allowedWorkspaceCount) {
        message = "Please select atleast one team";
      } else if (activeNetworks > 0 && minimumNetworkSelectionRequired != networkSelected) {
        message = `Please select a minimum of ${this.data.allowedNetworksCount} network(s)`
      } else {
        callApiCondition = true
      }
    }

    if (callApiCondition) {
      this.util.startLoader()
      // Swal.fire({
      //   title: "Are you sure want to downgrade the plan?",
      //   showDenyButton: true,
      //   confirmButtonText: "Yes",
      //   denyButtonText: `No`
      // }).then((result) => {
      //   if (result.isConfirmed) {
      this.apiDowngrade();
      //   } else if (result.isDenied) {
      //   }
      // });
    } else {
      Swal.fire({
        icon: "info",
        title: `Invalid number of selections`,
        text: message,
        // timer: 3000,
      })
    }
  }

  get isJobAndCandidateBothAvailable(): boolean {
    return this.activeCandidatesCount > 0 && this.activejobcount > 0 ? true : false;
  }

  apiDowngrade() {
    const jobs = this.findActiveJobs.filter(obj => !obj.isSelected);
    const candidates = this.findActiveCandidates.filter(obj => !obj.isSelected);
    const teams = this.findteamList.filter(obj => !obj.isSelected);
    const networks = this.networklist.filter(obj => !obj.isSelected);
    const extractIds = (list, idKey) => list.map(item => item[idKey]);
    const candidateList = extractIds(candidates, 'candidateId');
    const teamList = extractIds(teams, 'teamId');
    const jobList = extractIds(jobs, 'jobId');
    const networkList = extractIds(networks, 'networkId');

    const userId = localStorage.getItem('userId');
    const data = { 'userId': userId, teamsToBeDeactivated: teamList, jobsToBeDeactivated: jobList, candiatesToBeDeactivated: candidateList, networksToBeDeactivated: networkList, expirePrmotional: false, updateToFreePlan: false };
    data.updateToFreePlan = this.data.isDowngraded === true ? true : false;
    data.expirePrmotional = this.data.isPromotional === true ? true : false;
    this.findActiveJobsSub = this.api.create('user/downgradeSubscriptionPlan', data).subscribe(
      res => {
        this.findActiveJobs = res.data;
        this.util.stopLoader();
        this.modalService.hide(1);
        if (res && res.code === "00000") {
          if (this.data.isDowngraded) {
            this.gigsumoService.planUpdatedTo = 'Free'
            this.gigsumoService.jobCandidateCountUpdatedTo = this.data.allowedJobsCandidatesCount ? this.data.allowedJobsCandidatesCount : null;
            localStorage.setItem('MemberShipType', 'Free')
          }
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Entities retained successfully",
            timer: 2000,
          }).then(() => {
            if (this.data.isUpgrading) {
              this.gtag.event('upgrade-in-process', {
                'app-name': 'Gigsumo',
                'screen-name': 'feed'
              })
              window.location.href = this.teamPlanUrl;
            }
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
                // setTimeout(() => {
                //   this.router.navigate(["landingPage"]);
                //   this.searchData.setHighlighter('landingPage');
                // }, 1000);
              }
            });
          });
        } else if (res.code === "99998") {
          Swal.fire({
            icon: "info",
            title: "Plan already downgraded",
            timer: 2000
          })
        } else if (res.code === "99999") {
          Swal.fire({
            icon: "info",
            title: "Oops..!",
            text: "Something went wrong, please try after some time.",
            timer: 2000
          })
        }
      },
      error => {
        this.util.stopLoader();
      }
    );
  }

  prepareContent(content, scenario: 'promotionExpired' | 'planExpired' | 'both' | 'prerequisitesBeforeUpgrade'): string {
    if (scenario == 'promotionExpired') {
      return `Your Promotional Credits have been expired on ${this.dateFormat(content.data.userPlanAndBenefits.promotionsEndDate)} and you seem to have more than the allowed number of active entities.`;
    } else if (scenario == 'planExpired') {
      return `Your plan is moved from '${content.data.userPlanAndBenefits.membershipType}' to 'Free' as it had expired on ${this.dateFormat(content.data.userPlanAndBenefits.toDate)} and you seem to have more than the allowed number of active entities.`
    } else if (scenario == 'both') {
      return `Your '${content.data.userPlanAndBenefits.membershipType}' Plan and Promotional Credits have both expired on ${this.dateFormat(content.data.userPlanAndBenefits.toDate)} and ${this.dateFormat(content.data.userPlanAndBenefits.promotionsEndDate)} respectively and you seem to have more than the allowed number of active entities.`
    } else if (scenario == 'prerequisitesBeforeUpgrade') {
      return `As you are upgrading to 'Team' plan, your promotional entities will not be valid. Please, choose the ones you want to keep active before upgrading.`
    }
  }

  dateFormat(date: any): string {
    if (date != null) {
      let date1 = new Date(date);
      let date_transform = this.datePipe.transform(date1, 'MM/dd/yyyy')
      return date_transform;
    }
  }


  closeModal() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
  }

  ngOnDestroy() {
    if (this.findActiveCandidatesSub != undefined) {
      this.findActiveCandidatesSub.unsubscribe();
    }
    if (this.findteamListSub != undefined) {
      this.findteamListSub.unsubscribe();
    }
    if (this.findActiveJobsSub != undefined) {
      this.findActiveJobsSub.unsubscribe();
    }

  }

}
