import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gtag } from 'angular-gtag';
import { Observable, Subscription } from 'rxjs';
import { AppSettings } from 'src/app/services/AppSettings';
import { UserService } from 'src/app/services/UserService';
import { ApiService } from 'src/app/services/api.service';
import { CommonValues } from 'src/app/services/commonValues';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { PageType } from 'src/app/services/pageTypes';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { User } from 'src/app/types/User';
import { PricePlanService } from '../../Price-subscritions/priceplanService';
import { TourService } from 'src/app/services/TourService';

@Component({
  selector: 'app-user-badge',
  templateUrl: './user-badge.component.html',
  styleUrls: ['./user-badge.component.scss'],
})
export class UserBadgeComponent implements OnInit {
  @Input('landingPageUserDatails') landingPageUserDatails: any = {};

  @Input() inputData: string;
  show = false;
  planType: any = localStorage.getItem('MemberShipType');
  contentLoaded: boolean = false;
  otherData: any;
  userId: string = localStorage.getItem('userId');
  date: any;
  name: any;
  home: any;
  studentFlag: boolean;
  schoolName: any;
  img: any = {};
  title: any;
  place: any;
  orgName: any;
  user: User;
  userType: string = localStorage.getItem('userType');
  countData: any;
  collapseProfileCompletion = false;
  ownerType: any = ''
  landingsidesticky1: boolean = false;
  ProfileComplete: any;
  clickEventsubscription: Subscription;
  currentplan: any;
  planCount: any = {
    benefitsUsages: [
      { utilized: 0 },
      { utilized: 0 },
      { utilized: 0 },
      { actual: 0 }
    ],
    includedContactsCount: 0,
    interactionCount: 0,

  };
  showingcount: boolean = false;
  planName$: Observable<string>;
  constructor(private JobServicecolor: JobService,
    private util: UtilService,
    public prices: PricePlanService,
    private searchData: SearchData,
    private pageType: PageType,
    private API: ApiService,
    private commonValues: CommonValues,
    private router: Router,
    private userService: UserService,
    public gigsumoService: GigsumoService,
    private tourService: TourService,
    private gtag: Gtag) {
    // this.planName$ = this.store.select(state => state.app.planName);
    this.searchData.getContactCount().subscribe(count => {
      if (count) {
        this.planCount.includedContactsCount = this.planCount.includedContactsCount + count;
      }
    });

    // this.tourService.getTourSteps().subscribe((steps) => {
    //   this.tourService.startTour();
    // });

  }


  startTour:boolean=false;
  tourSteps: any[] = [];
  ngOnInit() {
    // this.profileStatus();
    this.profielCompletionDetails();
    this.USER_PLAN_DETAILS(); 
    // this.checktourview()
  }

  // checktourview(){
  //   const currentStepIndex = this.tourService.getCurrentStepIndex();
  //   const completedSteps = this.tourService.getCompletedSteps(); 
  //    if (currentStepIndex !== 0 && completedSteps.length > 0 && !this.tourService.isTourCompleted()) {
  //     this.tourService.startTour();
  //     this.startTour=true;
  //   }
  // }
  

  // shouldShowStep(stepId: string): boolean {
  //    return this.startTour;  
  // }

  // markStepCompleted(stepId: string): void {
  //   this.tourService.markStepAsCompleted(stepId);
  // }
  
  generateInitialsImageSrc(firstName: string, lastName: string): string {
    const initials = this.getInitials(firstName, lastName);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 100;
    canvas.height = 100;

    // Draw background
    context.fillStyle = this.getColor(firstName, lastName);
    context.fillRect(0, 0, 100, 100);

    // Draw text (initials)
    context.fillStyle = '#ffffff';
    context.font = '40px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(initials, 50, 50);

    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png');

    return dataUrl;
  }
  generateProgressPath(percentage: number): string {
    const radius = 50;
    const centerX = 50;
    const centerY = 50;
    const startAngle = -90; // Start at the top
    const endAngle = startAngle + (percentage / 100) * 360;

    const startRadians = (startAngle * Math.PI) / 180;
    const endRadians = (endAngle * Math.PI) / 180;

    const startX = centerX + radius * Math.cos(startRadians);
    const startY = centerY + radius * Math.sin(startRadians);

    const endX = centerX + radius * Math.cos(endRadians);
    const endY = centerY + radius * Math.sin(endRadians);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  }
  organizationname:any;
  profielCompletionDetails() {
    this.loadAPIcall=true;
    this.userService.userProfileComplete(this.userId).subscribe(res => {
      this.loadAPIcall=false;
      this.ProfileComplete = res;
      const workExperience = this.ProfileComplete.workExperience;
      if (workExperience.length > 0) {
          const currentExperience = workExperience.find(ele => ele.currentOrganization);

          if (currentExperience) {
              this.organizationname = currentExperience.organisationName;
              this.title=currentExperience.title;
          }
          // else {
          //     const firstExperience = workExperience[0];
          //     this.organizationname = firstExperience.organisationName;
          // }
      }

    });
  }
  getInitials(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }

  getColor(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }

  viewMore() {
    let data: any = {};
    data.userId = localStorage.getItem('userId');
    data.menu = 'pricing_summary';
    this.router.navigate(["personalProfile"], { queryParams: data });
  }
  activejobcount: number = 0;
  activeCandidatesCount: number = 0;
  totalCount: number = 0;

  PlanName: string;
  loadAPIcall=false;
  async USER_PLAN_DETAILS() {
    this.util.startLoader();
    this.loadAPIcall=true;
    try {
      let planbenefits: any = await this.API.lamdaFunctionsget('findUserPlanBenefits/' + localStorage.getItem('userId'));
      this.loadAPIcall=false;
      if (planbenefits.data && this.userType !== "JOB_SEEKER") {
        this.util.stopLoader();
        this.showingcount = true;
        this.activejobcount = planbenefits.data.activeJobsCount || 0;
        this.activeCandidatesCount = planbenefits.data.activeCandidatesCount || 0;
        this.totalCount = this.activeCandidatesCount + this.activejobcount;
        this.currentplan = planbenefits.data.userPlanAndBenefits.membershipType;

        if (planbenefits.data.userPlanAndBenefits) {
          this.planCount.benefitsUsages = [];
          this.planCount.benefitsUsages = planbenefits.data.userPlanAndBenefits.benefitsUsages;
          this.PlanName = planbenefits.data.userPlanAndBenefits.membershipType;

          // Dynamically find the utilization counts based on benefitKey
          for (let benefit of planbenefits.data.userPlanAndBenefits.benefitsUsages) {
            if (benefit.benefitKey === "ACTIVE_INTERACTIONS") {
              this.planCount.interactionCount = benefit.utilized || 0;
            } else if (benefit.benefitKey === "INCLUDED_CONVERSATIONS") {
              this.planCount.includedContactsCount = benefit.utilized || 0;
            }
          }
        }
        localStorage.setItem("MemberShipType", planbenefits.data.userPlanAndBenefits.membershipType);
      }
    } catch (error) {
      this.util.stopLoader();
    }
  }


  streamReloadApicallcandidate() {
    // this.profileStatus();
  }

  upgrade() {
    this.gtag.event('upgrade-initiated', {
      'app-name': 'Gigsumo',
      'screen-name': 'landing-page'
    })
  }


  @HostListener('window:scroll')
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 24) {
      //console.log("maximize");
      this.landingsidesticky1 = true;
      this.collapseProfileCompletion = true;
    } else {
      this.collapseProfileCompletion = false;
      //console.log("minimize");
      this.landingsidesticky1 = false;
    }
  }


  route(userid) {
    userid = localStorage.getItem('userId')
    if (userid != undefined && userid != null && userid != "") {
      let datas: any = {};
      datas.userId = userid
      this.router.navigate(['personalProfile'], { queryParams: datas });
    }
  }

  domainList: any = ['gmail.com', 'yahoo.com', 'hotmail.com']
  profileFlag: any = ''
  profileStatus() {
    let datas: any = {};
    datas.userId = localStorage.getItem('userId')
    this.util.startLoader()
    this.API.query("user/profile/complete/" + localStorage.getItem('userId')).subscribe(res => {
      if (res) {
        this.util.stopLoader()
        this.countData = res;
        if (res.photo == undefined || res.photo == null || res.photo == "") {
          res.photo = 'assets/images/userAvatar.png';
        } else {
          res.photo = AppSettings.photoUrl + res.photo;
        }
        // res.email




        var validateEmail: any;
        validateEmail = res.email.split('@')[1];
        const a = this.domainList.indexOf(validateEmail)



        //   valid email check if not valid it will return  -1
        if (a != '-1' && res.userType != 'student' && res.userType != 'JOB_SEEKER') {
          this.profileFlag = 'BUSINESS_EMAIL'
        } else if (res.userType == 'student') {
          if (res.educationDetail) {
            if (res.educationDetail.length == 0) {
              this.profileFlag = 'EDUCATION'
            }
          }
        } else if (res.userType != 'student' && res.workExperience != null && res.workExperience.length == 0) {
          this.profileFlag = 'EXPERIENCE'
        } else if (res.userType != 'student' && res.userType != 'JOB_SEEKER' && res.creditPoints < 10) {
          this.profileFlag = 'CREDIT'
        }



        localStorage.setItem('userName', res.username);
        this.commonValues.setUserData(res);
        this.commonValues.setpubliccommunity(res.memberInGSComm)
        if (this.inputData == "PROFILE_CREATE_PAGE" || res.completePercentage == 100) {
          this.show = false;
        } else {
          this.show = true;
        }
        setTimeout(() => {

          if (res.memberInGSComm) {
            this.commonValues.setpubliccommunity(res.memberInGSComm)
          }
        }, 4000);
      }
    }, err => {
      this.util.stopLoader();
    });

  }

  addEntities(value) {
    if (value == 'edu' || value == 'exp') {
      var data1: any = {}
      data1.userId = localStorage.getItem('userId')
      this.router.navigate(['personalProfile'], { queryParams: data1 })
      setTimeout(() => {
        var data: any = {}
        data.pages = 'personalProfile'
        this.pageType.setPageName(data)
      }, 2000);
    } else if (value == 'credits') {
      var data1: any = {}
      data1.userId = localStorage.getItem('userId')
      this.router.navigate(['personalProfile'], { queryParams: data1 })
      setTimeout(() => {
        var data: any = {}
        data.pages = 'credits'
        this.pageType.setPageName(data)
      }, 2000);
    }
  }

  selectMenu(value) {
    this.searchData.setHighlighter(value)
  }




  @HostListener("window:resize")
  onResize() {
    if (window.innerHeight == 500 && window.innerWidth == 1093) {
      this.landingsidesticky1 = false;

      // this.csshide=true;
    } else if (window.innerHeight > 500 && window.innerWidth > 1093) {
      this.landingsidesticky1 = false;

      //  this.csshide=true;
    } else if (window.innerHeight < 500 && window.innerWidth < 1093) {
      //this.csshide=false;
    }
  }


}


