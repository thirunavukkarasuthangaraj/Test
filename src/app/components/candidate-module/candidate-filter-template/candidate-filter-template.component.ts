import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CandidateService } from 'src/app/services/CandidateService';
import { GigsumoConstants, USER_TYPE } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { CommonValues } from 'src/app/services/commonValues';
import { JobService } from 'src/app/services/job.service';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { filterConfig } from 'src/app/types/filterConfig';
import { CommunicationService } from 'src/shared/services/CommunicationService';

@Component({
  selector: 'app-candidate-filter-template',
  templateUrl: './candidate-filter-template.component.html',
  styleUrls: ['./candidate-filter-template.component.scss']
})
export class CandidateFilterTemplateComponent implements OnInit, OnDestroy, OnChanges {
  @Input() viewType: string;
  @Input() candidateFilterData: filterConfig;
  @Input() filterChanges: any;

  candidateSourceFlag: boolean = false
  jobClassificationFlag: boolean = false
  availableForFlag: boolean = false
  candidateFlag: boolean = false
  workAuthFlag: boolean = false
  locationFlag: boolean = false
  workTypeFlag: boolean = false
  experienceFlag: boolean = false
  suggestionStick: boolean = false
  previousSearchAfterKey = null;
  benchSalesCandidates: any;
  myCandidates: boolean = true
  featured: boolean = false;
  filterOn: boolean = false
  count: number = 0
  filteredCandidates: boolean = false
  response: any = [];
  dataPass: any = [];
  stopscrollFlag: boolean = false
  candidateLength: number
  userType = localStorage.getItem('userType')
  jobfilter = false;
  totalFilters: number = 0;
  filterdata: any = {};
  candidateFoundStatus: any = "Fetching Candidates..."
  dataPasstoSkillwidgets: any;
  removeSelected: any;
  FeaSugg: boolean = false
  activeStatus: boolean = null;
  removeTagvalues: any;
  stateListCA: any;
  stateListIN: any;
  stateListAU: any;
  candidateFilterForm: UntypedFormGroup;
  countryList: any = [];
  candidateSource: Array<any> = [];
  engagementType: any = [];
  status: any = [];
  filterApplied: boolean = false
  workAuthorization: any = [];
  activeIds = [];
  @ViewChild("lgModal") lgModal;
  highValue2: number;
  refreshCandidates: Subscription
  filterReload: Subscription
  value: number = 0;
  highValue: number = 0;
  previousSearchAfterKey1 = null;
  statusFlag: boolean = false
  myCandidateFlag: boolean = false
  countryFlag: boolean = false
  totalExperienceFlag: boolean = false
  benchCandidatesFlag: boolean = false
  remoteWorkFlag: boolean = false
  postedInDaysFlag: boolean = false
  experienceToFlag: boolean = false
  experienceFromFlag: boolean = false
  cityFlag: boolean = false
  zipcodeFlag: boolean = false
  workFromHomeFlag: boolean = false
  stateFlag: boolean = false
  relocationRequiredFlag: boolean = false
  engagementTypeFlag: boolean = false
  workAuthorizationFlag: boolean = false
  featuredCandidatesFlag: boolean = false
  totalCandidatesCount: number = 0;
  datas: any = {};
  postDateApplied: boolean = false
  value1: number = 0;
  highValue1: number = 0;
  owner: boolean = false
  showsuggJobsData: any = [];
  formDataPost: any = {};
  keyarrayCandidatesouces =
    ["all", "myCandidates", "allPlatFormCandidates", "teamCandidates",
      "benchNetworkCandidates", "freeLancerNetworkCandidates", "mtaNetworkCandidates",
      "jobSeekerNetworkCandidates", "featured", "suggestedCandidates"];
  keysarrWorks = ["all", "remoteWork", "relocationRequired", "workFromHome"];
  searchContent: any;
  userIdStorage = localStorage.getItem('userId')
  candiSourceSearchRoute = null
  searchUserType: any
  candiSourceSelectNetRoute: any
  ScreenLoadBool: boolean = false
  subscription: Subscription;
  isAccordionOpen: boolean;
  messageData: any;
  messagemodelflag: Boolean = false
  //job classification
  availableForCheckboxes = [
    { label: 'All', selected: false, disable: false },
    { label: 'Corp To Corp', selected: false, disable: false },
    { label: 'W2 - Contract', selected: false, disable: false },
    { label: 'W2 - Full Time', selected: false, disable: false },
    { label: 'Part Time', selected: false, disable: false },
    { label: 'Freelance', selected: false, disable: false },
    { label: 'Internship', selected: false, disable: false },
    { label: 'Contract to Hire', selected: false, disable: false },
    { label: 'Direct Hire', selected: false, disable: false },
  ];
  availablecheckbox = [
    { label: 'All', selected: false, disable: false },
    { label: 'Immediate', selected: false, disable: false },
    { label: '1 Week', selected: false, disable: false },
    { label: '2 Weeks', selected: false, disable: false },
    { label: 'Other', selected: false, disable: false }

  ];
  candidate_status = [
    { label: 'All', selected: false, disable: false },
    { label: 'Applied', selected: false, disable: false },
    { label: 'Shortlisted', selected: false, disable: false },
    { label: 'Rejected', selected: false, disable: false },
    { label: 'Interview Scheduled', selected: false, disable: false },
    { label: 'Interview Rejected', selected: false, disable: false },
    { label: 'Selected', selected: false, disable: false },
    { label: 'Offered', selected: false, disable: false },
    { label: 'Pre-Onboarding', selected: false, disable: false },
    { label: 'Onboarded', selected: false, disable: false },
    { label: 'Offer Withdrawn', selected: false, disable: false },
    { label: 'Offer declined', selected: false, disable: false }

  ];
  statusCheckboxes: Array<{ label: string, selected: boolean, disable: boolean }> = [
    { label: 'All', selected: false, disable: false },
    { label: 'Available', selected: false, disable: false },
    { label: 'Draft', selected: false, disable: false },
    // { label: 'Shortlisted', selected: false, disable: false },
    // { label: 'Interview', selected: false, disable: false },
    // { label: 'Offered', selected: false, disable: false },
    // { label: 'Onboarded', selected: false, disable: false },
    // { label: 'On Contract', selected: false, disable: false },
    // { label: 'Featured', selected: false, disable: false },
    { label: 'Unavailable', selected: false, disable: false },


  ];
  WACheckboxes: Array<{ label: string, selected: boolean, disable: boolean }> = [];
  ischeckedJobSource: boolean = false
  ischeckedJobSourceAll: boolean = false
  ischeckedClientType: boolean = false
  ischeckedClientTypeAll: boolean = false
  ischeckedStatus: boolean = false
  ischeckedStatusAll: boolean = false
  ischeckedJobClassification: boolean = false
  ischeckedJobClassificationAll: boolean = false
  ischeckedWorkType: boolean = false
  ischeckedWorkTypeAll: boolean = false
  totalmsgcount: Subscription;
  colurclass = ['fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-saffron-color',
    'fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-yellow-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-saffron-color',
    'fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-yellow-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-saffron-color',
    'fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-yellow-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-saffron-color',
    'fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-yellow-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-saffron-color'];
  feaJ: boolean;
  profile: any
  networkflag: boolean = false;
  receiveFilterData: Subscription;
  resetFilter: Subscription;
  countSouce: number = 0;
  sendProfileData: any = {}
  validTotalPoints: boolean
  totalCount
  listingCount = 0;
  freelanceCount = 0;
  creditsConsume: any = 0;
  availablePoints;
  queryParamsValues: any
  valid: boolean = true;
  usStatesList = []
  showWorkAuthorization: boolean = false
  img: any;
  obj: any = {
    limit: 10,
    searchAfterKey: null,
    userId: localStorage.getItem('userId')
  }
  obj1: any = {
    limit: 10,
    searchAfterKey: null,
    userId: localStorage.getItem('userId')
  }
  yearApplied: boolean = false
  isMyCandidateShowedOnLoad: boolean = false;
  filterSubscriber: Subscription;
  isFilterOpen: boolean = false;
  isEnabled: boolean=false;
  constructor(private apiService: ApiService, private communicationService: CommunicationService, private searchData: SearchData, private commonvalues: CommonValues, private formBuilder: UntypedFormBuilder, private util: UtilService, private candidateService: CandidateService, private jobService: JobService, private a_route: ActivatedRoute, private router: Router) {

    this.filterSubscriber = this.jobService.getSliderToggle().subscribe(value => {
      if (value.panel == 'candidate-listing' && value.value == true) {
        this.isFilterOpen = true;
        this.openFilterSlider();
      } else {
        this.isFilterOpen = false;
        this.closeFilterSlider();
      }
    });

    this.commonvalues.currentData.subscribe(data => {
      this.isEnabled = data;
    });
  }

  sourceCount: number;
  postedDayRangeCount: number;
  engagementTypeCount: number;
  availabilityCount: number;
  statusCount: number;

  executeMethod(data: string): void {
    this.sourceCount = 0;
    this.postedDayRangeCount = 0;
    this.engagementTypeCount = 0;
    this.statusCount = 0;
    this.availabilityCount = 0;
  }
  ngOnChanges(changes: SimpleChanges): void {

    this.createCandidateFilterForm();
    if (changes.filterChanges !== undefined && changes.filterChanges.currentValue != undefined) {
      let data: any = changes.filterChanges.currentValue;
      // fetching the total counts of the source for numbering the filter elements
      // fetching filter number starts here

      //source count starts here
      const keyValuePairs: Record<string, boolean> = data.formData.source[0];
      const keyCounts = Object.values(keyValuePairs).reduce((count, value) => {
        return count + (value ? 1 : 0);
      }, 0);
      this.sourceCount = keyCounts;
      //source count ends here

      // jobclassification / engagement type count starts here
      const keyValuePairs2: Record<string, boolean> = {};
      data.engageMentCheckedItems.forEach(item => {
        keyValuePairs2[item.label] = item.selected;
      });

      const keyCounts2 = Object.values(keyValuePairs2).reduce((count, item) => {
        return count + (item ? 1 : 0);
      }, 0);

      this.engagementTypeCount = keyCounts2;

      // jobclassification / engagement type count ends here

      // availability count starts here
      const keyValuePairs3: Record<string, boolean> = {};
      data.availiabilityCheckedItems.forEach(item => {
        keyValuePairs3[item.label] = item.selected;
      });

      const keyCounts3 = Object.values(keyValuePairs3).reduce((count, item) => {
        return count + (item ? 1 : 0);
      }, 0);

      this.availabilityCount = keyCounts3;

      // availability count ends here

      // status counts starts here
      const keyValuePairs4: Record<string, boolean> = {};
      data.statusCheckedItems.forEach(item => {
        keyValuePairs4[item.label] = item.selected;
      });

      const keyCounts4 = Object.values(keyValuePairs4).reduce((count, item) => {
        return count + (item ? 1 : 0);
      }, 0);

      this.statusCount = keyCounts4;

      // console.log("statusCOunt ", this.statusCount);


      // fetching filter number ends here

      this.candidateFilterForm.patchValue(data.formData);
      this.candidateSource = data.checkedItems;
      this.availablecheckbox = data.availiabilityCheckedItems;
      this.statusCheckboxes = data.statusCheckedItems;
      this.availableForCheckboxes = data.engageMentCheckedItems;
      this.value1 = data.formData.postedFrom != null ? data.formData.postedFrom : 0;
      this.highValue1 = data.formData.postedTo != null ? data.formData.postedTo : 0;
      // this.FilterForm.patchValue({
      //   candidateSource: this.getSelected("CANDIDATE_SOURCE"),
      //   availability: this.getSelected("AVAILABILITY"),
      //   engagementType: this.getSelected("ENGAGEMENT_TYPE"),
      //   postedDayRange: this.getSelected("POSTED_DAY"),

      // })
      // console.log("CHANGES FILE HERE ->>>",
      //   this.candidateFilterForm.getRawValue(),
      //   this.candidateSource,
      //   this.availableForCheckboxes,
      //   this.statusCheckboxes,
      //   this.availablecheckbox);



    }


  }

  POSTED_ANY = GigsumoConstants.POSTED_ANY;
  POSTED_TODAY = GigsumoConstants.POSTED_TODAY;
  POSTED_LAST_7_DAYS = GigsumoConstants.POSTED_LAST_7_DAYS;
  POSTED_LAST_14_DAYS = GigsumoConstants.POSTED_LAST_14_DAYS;
  POSTED_LAST_30_DAYS = GigsumoConstants.POSTED_LAST_30_DAYS;

  onPostedDaysChange(content: string) {

    if (content === GigsumoConstants.POSTED_TODAY) {
      this.candidateFilterForm.patchValue({ postedFrom: 1, postedTo: 1 });
    } else if (content === GigsumoConstants.POSTED_LAST_7_DAYS) {
      this.candidateFilterForm.patchValue({ postedFrom: 1, postedTo: 7 });
    } else if (content === GigsumoConstants.POSTED_LAST_14_DAYS) {
      this.candidateFilterForm.patchValue({ postedFrom: 1, postedTo: 14 });
    } else if (content === GigsumoConstants.POSTED_LAST_30_DAYS) {
      this.candidateFilterForm.patchValue({ postedFrom: 1, postedTo: 30 });
    } else {
      this.candidateFilterForm.patchValue({ postedFrom: null, postedTo: null });
    }
    this.applyFilternew('horizontal');
    this.updateFunction();

  }



  ngOnInit(): void {
    this.previousSearchAfterKey1 = null;
    this.datas.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.obj.searchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.stopscrollFlag = false;
    this.communicationService.setCallback(this)


    this.updateCandidateFilterData();


    // this.a_route.queryParams.subscribe((res) => {


    //   if (!this.ScreenLoadBool) {
    //     if (res.jobfilter != "undefined" && res.jobfilter != undefined) {
    //       this.candidateSource.push('myCandidates');
    //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('myCandidates').patchValue(true);
    //       this.candidateSource = [...new Set(this.candidateSource)]
    //       this.jobfilter = true;
    //       this.filteredCandidates = true;
    //       this.filterdata = res;

    //       this.applyFilternew();
    //     }
    //     this.settingUpFilters();

    //   } else {c
    //     this.settingUpFilters();
    //     this.onLoad()
    //     // console.log('kjhskjsdfhksjdf')
    //   }

    // })

    // this.stopscrollFlag = false
    // if (this.networkflag == true) {
    //   this.applyFilternew()
    // }

  }

  showChevron: boolean = false;
  showChevron1: boolean = false;
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

  scrollLeft() {
    const scrollContainer = document.getElementById('scrollContainer');
    if (scrollContainer) {
      scrollContainer.scrollLeft -= 1000; // Adjust the scroll amount as needed
    }
  }

  scrollRight() {
    const scrollContainer = document.getElementById('scrollContainer');
    if (scrollContainer) {
      scrollContainer.scrollLeft += 1000; // Adjust the scroll amount as needed
    }
  }


  getSelected(content: string): string {

    if (content === "CANDIDATE_SOURCE") {
      const data = this.candidateFilterForm.get('source') as UntypedFormArray;
      let datas = [];
      Object.keys((data.at(0) as UntypedFormGroup).controls).forEach((ele: any) => {
        if (data.at(0).get(ele).value) {
          datas.push(ele);
        }
      });


      return (datas && datas.length > 0) ? this.pickSmall(datas[0]) : "Candidate Source";
    }
    else if (content === "AVAILABILITY") {
      const data = this.availablecheckbox.filter(ele => ele.selected === true)
      return (data && data.length > 0) ? data[0].label : "Availability";
    }
    else if (content === "STATUS") {
      const data = this.statusCheckboxes.filter(ele => ele.selected === true)
      return (data && data.length > 0) ? data[0].label : "Status";
    }
    else if (content === "ENGAGEMENT_TYPE") {
      const data = this.availableForCheckboxes.filter(ele => ele.selected === true)
      return (data && data.length > 0) ? data[0].label : "Engagement Type";
    } else if (content == "POSTED_DAY") {
      return this.candidateFilterForm.get('postedDayRange').value;
    }

    return null;
  }


  pickSmall(val: string): string {
    let candidateSourceItems: Array<string> = ["Platform Candidates", "All", "My Candidates", "My Profile", "Bench Sales Network",
      "Freelancer Network", "MTA Network", "Job Seeker Network", "Team Candidates", "Featured Candidates", "Suggested Candidates"];

    return candidateSourceItems.find(x => {
      if (val === "allPlatFormCandidates") {
        val = "Platform Candidates".toLowerCase().replace(/\s/g, '');
      }
      else if (x === "Freelancer Network") {
        x = "Freelancer Network Candidates".toLowerCase().replace(/\s/g, '');
      }
      else if (x === "MTA Network") {
        x = "MTA Network Candidates".toLowerCase().replace(/\s/g, '');
      }
      else if (val === "featured") {
        val = "Featured Candidates".toLowerCase().replace(/\s/g, '');
      }
      else if (x === "suggestedCandidates") {
        x = "Suggested Candidates".toLowerCase().replace(/\s/g, '');
      }
      else if (val === "benchNetworkCandidates") {
        val = "Bench Sales Network".toLowerCase().replace(/\s/g, '');
      }
      else if (val === "jobSeekerNetworkCandidates") {
        val = "Job Seeker Network".toLowerCase().replace(/\s/g, '');
      }


      return x.toLowerCase().replace(/\s/g, '') === (val && val.toLowerCase())
    });
  }

  updateCandidateFilterData() {
    const userType = localStorage.getItem('userType') as USER_TYPE;

    if (this.isMTAorFREEandBENCHorJOB(userType)) {
      this.owner = true;
    }
    else if (this.isRecruiter(userType)) {
      this.owner = false;
    }

  }

  setDefaultFilter(value: string) {
    this.candidateSource.push(value);
    this.getSource().at(0).get(value).patchValue(true);
  }

  getSource(): UntypedFormArray {
    return this.candidateFilterForm.get('source') as UntypedFormArray;
  }

  isBenchorJob(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.BENCH_RECRUITER
      || userType === GigsumoConstants.JOB_SEEKER);
  }

  isMTAorFREEandBENCHorJOB(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION || userType === GigsumoConstants.JOB_SEEKER
      || userType === GigsumoConstants.FREELANCE_RECRUITER || userType === GigsumoConstants.BENCH_RECRUITER);
  }

  isRecruiter(userType): boolean {
    return userType === GigsumoConstants.RECRUITER;
  }

  isMTAorFREE(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION || userType === GigsumoConstants.FREELANCE_RECRUITER);
  }

  ngOnDestroy(): void {
    if (this.filterSubscriber) {
      this.filterSubscriber.unsubscribe();
    }
  }

  onLoad() {
    this.ScreenLoadBool = true;
    let data: any = JSON.parse(localStorage.getItem('candidateForm'));
    this.generateWorkAutorization(data.country);

    for (let key in data.source) {
      if (data.source[key] === true) {
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(true);
        this.candidateSource.push(key)

        this.candidateSource.forEach((ele, index) => {
          if (this.FeaSugg && ele === "featured" || this.FeaSugg && ele === "suggestedCandidates") {
            this.candidateSource.splice(index, 1)
          }
          if (!this.owner && ele === "myCandidates") {
            this.candidateSource.splice(index, 1)
          }
        })

      }
    }
    data.availableIn.forEach((res) => {
      this.availablecheckbox.forEach(item => {
        if (item.label === res) {
          item.selected = true;
          this.candidateSource.push(res)
        }
      });

    });
    data.status.forEach((res) => {
      this.statusCheckboxes.forEach(item => {
        if (item.label === res) {
          item.selected = true;
          this.candidateSource.push(res)
        }
      });
    });
    data.engagementType.forEach((res) => {
      this.availableForCheckboxes.forEach(item => {
        if (item.label === res) {
          item.selected = true;
          this.candidateSource.push(res)
        }
      });
    });




    for (let key in data.workType) {
      if (data.workType[key] === true) {
        ((this.candidateFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(true);
        this.candidateSource.push(key)
      }
    }
    this.candidateSource = [...new Set(this.candidateSource)]
    this.candidateSource.forEach((ele, index) => {
      if (ele === "All" || ele === "all") {
        this.candidateSource.splice(index, 1)
      }
    });

    this.value = data.experienceFrom != null ? data.experienceFrom : 0;
    this.highValue = data.experienceTo != null ? data.experienceTo : 0;
    this.value1 = data.postedFrom != null ? data.postedFrom : 0;
    this.highValue1 = data.postedTo != null ? data.postedTo : 0;

    this.candidateFilterForm.get('country').patchValue(data.country)
    this.candidateFilterForm.get('state').patchValue(data.state)
    this.candidateFilterForm.get('city').patchValue(data.city)
    this.candidateFilterForm.get('zipCode').patchValue(data.zipCode)
    setTimeout(() => {
      data.workAuthorization.forEach((res) => {
        this.WACheckboxes.forEach(item => {
          if (item.label === res) {
            this.showWorkAuthorization = true
            item.selected = true;
            this.candidateSource.push(res)
          }
        });
      });
    }, 1000);


    this.datas = data
    this.response = [];
    // this.commonvalues.setcandidateData(this.response);

    this.previousSearchAfterKey1 = null;
    this.datas.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.obj.searchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.stopscrollFlag = false;

    localStorage.setItem('candidateSource', JSON.stringify(this.candidateSource));
    this.apicallfilter();
    // console.log('is window:load');
  }

  getCredits(val) {

    if (val != null && this.creditsConsume == null) {
      this.creditsConsume = val;
    }
    else if (val != null && this.creditsConsume != null) {
      this.creditsConsume = "";
      this.creditsConsume = val;
    }

  }

  invalidDate(valid: boolean) {
    this.valid = valid;
  }

  // settingUpFilters() {
  //   if (!this.jobfilter) {
  //     if (!this.isMyCandidateShowedOnLoad && !this.networkflag && this.candiSourceSearchRoute == null) {
  //       this.totalFilters = 1
  //       this.candidateSource.push('allPlatFormCandidates');
  //       this.candidateSource = [...new Set(this.candidateSource)];
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('allPlatFormCandidates').patchValue(true);
  //       this.applyFilternew()
  //     } else if (this.isMyCandidateShowedOnLoad && this.owner && !this.networkflag && this.candiSourceSearchRoute == null) {
  //       this.totalFilters = 1
  //       this.candidateSource.push('myCandidates');
  //       this.candidateSource = [...new Set(this.candidateSource)];
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('myCandidates').patchValue(true);
  //       this.applyFilternew()
  //     } else if (this.networkflag) {
  //       this.candidateSource.push(this.candiSourceSelectNetRoute)
  //       this.candidateSource = [...new Set(this.candidateSource)]
  //       this.datas.searchAfterKey = null;
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get(this.candiSourceSelectNetRoute).patchValue(true);
  //       this.applyFilternew();
  //     } else if (this.candiSourceSearchRoute != null) {
  //       this.candidateSource = []
  //       this.candidateSource.push(this.candiSourceSearchRoute)
  //       this.candidateSource = [...new Set(this.candidateSource)]
  //       this.datas.searchAfterKey = null;
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('all').patchValue(false);
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('myCandidates').patchValue(false);
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('teamCandidates').patchValue(false);
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('benchNetworkCandidates').patchValue(false);
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('freeLancerNetworkCandidates').patchValue(false);
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('mtaNetworkCandidates').patchValue(false);
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('jobSeekerNetworkCandidates').patchValue(false);
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('featured').patchValue(false);
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('suggestedCandidates').patchValue(false);
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get(this.candiSourceSearchRoute).patchValue(true);
  //       this.applyFilternew();
  //     } else {
  //       this.totalFilters = 0
  //       this.candidateSource.push('benchNetworkCandidates')
  //       this.candidateSource = [...new Set(this.candidateSource)];
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get('benchNetworkCandidates').patchValue(true);
  //       this.applyFilternew()
  //     }

  //   } else if (this.jobfilter) {
  //     this.totalFilters = 0
  //     this.applyFilternew();

  //     //   disable for filter
  //     for (let key of this.keyarrayCandidatesouces) {
  //       ((this.candidateFilterForm.get('source') as FormArray).at(0) as FormGroup).get(key).disable();
  //     }

  //     for (let key of this.keysarrWorks) {
  //       ((this.candidateFilterForm.get('workType') as FormArray).at(0) as FormGroup).get(key).disable();
  //     }
  //     this.availableForCheckboxes.forEach(item => item.disable = true);
  //     this.statusCheckboxes.forEach(item => item.disable = true);
  //     this.WACheckboxes.forEach(item => item.disable = true);
  //     this.availablecheckbox.forEach(item => item.disable = true);


  //   }
  // }

  receiveDataFromAccordion(data: any) {
    // Handle the data received from the accordion component
  }

  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }

  // cancelApplication() {
  //   this.router.navigate(['newjobs'])
  // }

  // cancelFilterValues() {

  //   this.statusFlag = false
  //   this.countryFlag = false
  //   this.totalExperienceFlag = false
  //   this.benchCandidatesFlag = false
  //   this.remoteWorkFlag = false
  //   this.postedInDaysFlag = false
  //   this.experienceToFlag = false
  //   this.experienceFromFlag = false
  //   this.cityFlag = false
  //   this.zipcodeFlag = false
  //   this.workFromHomeFlag = false
  //   this.stateFlag = false
  //   this.relocationRequiredFlag = false
  //   this.engagementTypeFlag = false
  //   this.workAuthorizationFlag = false
  //   this.featuredCandidatesFlag = false
  //   // this.suggestedCandidatesFlag = false
  //   this.lgModal.hide()
  //   this.resetFilter()
  //   this.filterOn = false
  //   this.obj.searchAfterKey = null
  //   if (this.owner) {
  //     this.myCandidateFlag = true
  //     this.applyFilter('manual', null)
  //   } else {
  //     this.myCandidateFlag = false
  //     this.getCandidateList("candidates/findCandidates")
  //   }


  //   this.getchildData(null)
  // }

  // get child date to display widgets
  getchildData(data) {
    if (data != null) {
      this.dataPasstoSkillwidgets = JSON.parse(data);
    } else {
      this.dataPasstoSkillwidgets = [];

    }
  }

  //  user remove after uncheck from widgets
  removeUserfromTag(data) {
    this.removeTagvalues = data;
    this.response.forEach(element => {
      if (element.candidateId == data.candidateId) {
        element.isSelected = false;
      }
    });

    this.dataPasstoSkillwidgets.forEach(element => {
      if (element.candidateId == data.candidateId) {
        element.isSelected = false;
      }
    });
  }

  onChangeYear(value) {
    if (value.highValue > 0) {
      this.yearApplied = true
    } else if (value.highValue == 0) {
      this.yearApplied = false
    }
    this.candidateFilterForm.value.experienceFrom = value.value
    this.candidateFilterForm.value.experienceTo = value.highValue
    this.response = []

    this.previousSearchAfterKey1 = null;

    this.datas.searchAfterKey = null
    this.filterWhenNoneCandidateSouce()
    this.applyFilternew()
  }

  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }
  onChangepostday(value, param?: any) {
    if (value.highValue > 0) {
      this.postDateApplied = true
    } else if (value.highValue == 0) {
      this.postDateApplied = false
    }
    this.candidateFilterForm.get("postedFrom").patchValue(value.value);
    this.candidateFilterForm.get("postedTo").patchValue(value.highValue)
    this.filterWhenNoneCandidateSouce()
    this.applyFilternew(param);
    this.updateFunction();
  }

  applyFilternew(param?: any) {
    return;
    console.log(param)
    this.stopscrollFlag = false;
    this.datas.searchAfterKey = null;

    if (this.jobfilter) {
      this.candidateFilterForm.value.jobId = this.filterdata.jobId
    }

    var statusCheckboxesUpdate: any = [];
    this.statusCheckboxes.forEach(element => {
      if (element.selected) {
        statusCheckboxesUpdate.push(element.label)
      }
    });

    var clientTypeCheckboxesUpdate: any = [];
    this.WACheckboxes.forEach(element => {
      if (element.selected) {
        clientTypeCheckboxesUpdate.push(element.label)
      }
    });

    var jobClassificationUpdate = [];
    this.availableForCheckboxes.forEach(element => {
      if (element.selected) {
        jobClassificationUpdate.push(element.label)
      }
    });

    var avalables = [];
    this.availablecheckbox.forEach(element => {
      if (element.selected) {
        avalables.push(element.label)
      }
    });
    var submissionFilters = [];
    this.candidate_status.forEach(element => {
      if (element.selected) {
        let value = element.label;
        if (value == "Pre-Onboarding") {
          value = "PREONBOARDED";
        }
        submissionFilters.push(value.toLocaleUpperCase())
      }
    });

    this.candidateFilterForm.value.workAuthorization = clientTypeCheckboxesUpdate; // work auth values
    this.candidateFilterForm.value.availableIn = avalables;
    this.candidateFilterForm.value.engagementType = jobClassificationUpdate;
    this.candidateFilterForm.value.status = statusCheckboxesUpdate;
    this.candidateFilterForm.value.submissionFilters = submissionFilters;



    this.candidateFilterForm.value.userId = localStorage.getItem('userId')
    if (this.previousSearchAfterKey1 != null || this.previousSearchAfterKey1 != undefined) {
      this.candidateFilterForm.value.searchAfterKey = this.previousSearchAfterKey1;
    } else {
      this.candidateFilterForm.value.searchAfterKey = null;
    }

    if (!this.jobfilter) {
      this.datas = {
        source: this.candidateFilterForm.value.source[0],
        workType: this.candidateFilterForm.value.workType[0]
      };
    }

    if (this.jobfilter) {
      this.datas.jobId = this.candidateFilterForm.value.jobId
      this.datas.source = {
        all: false,
        myCandidates: true,
        allPlatFormCandidates: false,
        teamCandidates: false,
        benchNetworkCandidates: false,
        freeLancerNetworkCandidates: false,
        mtaNetworkCandidates: false,
        jobSeekerNetworkCandidates: false,
        featured: false,
        suggestedCandidates: false
      }
      this.datas.workType = {
        all: false,
        remoteWork: false,
        relocationRequired: false,
        workFromHome: false
      }
    } else {
    }

    this.datas.workAuthorization = clientTypeCheckboxesUpdate,
      this.datas.engagementType = jobClassificationUpdate,
      this.datas.availableIn = avalables,
      this.datas.status = statusCheckboxesUpdate,
      this.datas.searchAfterKey = this.candidateFilterForm.value.searchAfterKey,
      this.datas.city = this.candidateFilterForm.value.city,
      this.datas.state = this.candidateFilterForm.value.state,
      this.datas.country = this.candidateFilterForm.value.country,
      this.datas.zipCode = this.candidateFilterForm.value.zipCode,
      this.datas.submissionFilters = this.candidateFilterForm.value.submissionFilters,
      // this.datas.totalExperience = this.candidateFilterForm.value.totalExperience
      this.datas.experienceFrom = this.candidateFilterForm.value.experienceFrom;
    this.datas.experienceTo = this.candidateFilterForm.value.experienceTo;
    this.datas.postedFrom = this.candidateFilterForm.value.postedFrom
    this.datas.postedTo = this.candidateFilterForm.value.postedTo
    this.datas.limit = this.candidateFilterForm.value.limit,
      this.datas.userId = this.candidateFilterForm.value.userId
    this.datas.searchContent = this.searchContent;
    delete this.datas.searchContent;

    if (this.searchContent != "" && this.searchContent != undefined) {
      this.datas.searchContent = this.searchContent;
      this.datas.searchAfterKey = null;
    }


    if (this.candidateSource.length > 0 && this.searchContent == ""
      || this.candidateSource.length > 0 && this.searchContent == undefined) {
      localStorage.setItem('candidateSource', JSON.stringify(this.candidateSource));
      localStorage.setItem('candidateForm', JSON.stringify(this.datas));
    }

    if (this.candidateSource.length == 0) {
      this.stopscrollFlag = false;
      localStorage.setItem('candidateSource', JSON.stringify(this.candidateSource));
      localStorage.setItem('candidateForm', JSON.stringify(this.datas));
    } else if (this.searchContent != "" && this.searchContent != undefined) {
      this.response = [];
      // this.commonvalues.setcandidateData(this.response);
      localStorage.setItem('candidateSource', JSON.stringify(this.candidateSource));
      localStorage.setItem('candidateForm', JSON.stringify(this.datas));
    } else {
      if (this.networkflag) {
        localStorage.setItem('candidateSource', JSON.stringify(this.candidateSource));
        localStorage.setItem('candidateForm', JSON.stringify(this.datas));
      }
    }

    // if(param == 'horizontal') {
    //   console.log("passing throught this alright")
    //   this.startFilter();
    // }
  }


  updateFunction() {
    if (this.candidateFilterData) {
      this.candidateFilterData.clickHandler.apply(this.candidateFilterData.source,
        [{
          formData: this.candidateFilterForm.getRawValue(),
          availiabilityCheckedItems: this.availablecheckbox,
          engageMentCheckedItems: this.availableForCheckboxes,
          submissionItems: this.candidate_status,
          statusCheckedItems: this.statusCheckboxes, checkedItems: this.candidateSource,
          from: "HORIZANTAL"
        }]);
    }
  }



  @Output() valuesRetainedForFilters = new EventEmitter<any>(null);
  startFilter() {
    let data: any = {}
    const candidateSource = JSON.parse(localStorage.getItem('candidateSource'))
    const candidateForm = JSON.parse(localStorage.getItem('candidateForm'))
    data.candidateSource = candidateSource;
    data.candidateForm = candidateForm
    const jsonData = JSON.stringify(data);
    this.panelValue.emit('candidates')
    this.valuesRetainedForFilters.emit(jsonData);
  }

  searchfilter() {
    // if(this.searchContent.length!=0){
    this.response = [];
    this.previousSearchAfterKey1 = null;
    this.datas.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.stopscrollFlag = false;
    window.scrollTo(0, 0);
    this.applyFilternew();
  }

  apicallfilter() {
    this.util.startLoader()
    this.searchData.getcandidateCount().subscribe(res => {
      if (res != 0 && res.flag) this.stopscrollFlag = false;
      if (res != 0 && res.flag && res.status === "ACTIVE") {
        this.totalCandidatesCount += res.count;
      }
      else if (res != 0 && !res.flag || res != 0 && res.flag && res.status != "ACTIVE") {
        this.totalCandidatesCount = res.count;
      }
    });
    localStorage.setItem('candidateForm', JSON.stringify(this.datas))
  }

  onChangeCountry(event) {
    this.candidateFilterForm.get('city').patchValue(null)
    this.candidateFilterForm.get('state').patchValue(null)
    this.candidateFilterForm.get('zipCode').patchValue(null)
    this.response = [];
    // this.commonvalues.setcandidateData(this.response);
    this.filterWhenNoneCandidateSouce()
    this.applyFilternew();
    const countryCode = event;

    if (event == "US") {
      if (this.usStatesList.length == 0) {
        // this.usStatesList = [];
        // if (this.usStatesList.length == 0) {
        this.apiService
          .query("country/getAllStates?countryCode=" + countryCode)
          .subscribe((res) => {
            res.forEach(ele => {
              this.usStatesList.push(ele.stateName)
            })
          }, err => {
            this.util.stopLoader();
          });
        // }
      }
    } else if (event == "AU") {
      const countryCode = event;
      this.stateListAU = [];

      this.apiService
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          this.stateListAU = res;
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "IN") {
      const countryCode = event;
      this.stateListIN = [];
      this.apiService
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          this.stateListIN = res;
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "CA") {
      const countryCode = event;
      this.stateListCA = [];

      this.apiService
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          this.stateListCA = res;
        }, err => {
          this.util.stopLoader();
        });
    }

    this.generateWorkAutorization(countryCode);

  }

  generateWorkAutorization(countryCode: string) {
    this.apiService.query('listvalue/find?domain=WORK_AUTHORIZATION_' + countryCode).subscribe(res => {
      if (res != undefined && res.code == '00000' && res.data.listValues.length > 0) {
        this.showWorkAuthorization = true
        this.WACheckboxes = []
        this.WACheckboxes = [{ label: 'All', selected: false, disable: false }]
        this.util.stopLoader()
        this.usStatesList = []
        res.data.listValues[0].listItems.forEach((ele) => {
          this.WACheckboxes.push({ label: ele.item, selected: false, disable: false })

        })


      }
      else {
        this.showWorkAuthorization = false
      }

    });
  }

  onChangestate(state) {
    this.candidateFilterForm.value.state = state;
    this.response = [];
    this.previousSearchAfterKey1 = null;
    // this.commonvalues.setcandidateData(this.response);
    this.candidateFilterForm.get('city').patchValue(null)
    this.candidateFilterForm.get('zipCode').patchValue(null)
    this.filterWhenNoneCandidateSouce()
    this.applyFilternew();
  }

  onChangecity(city) {

    this.response = [];
    this.previousSearchAfterKey1 = null;

    // this.commonvalues.setcandidateData(this.response);
    this.candidateFilterForm.value.city = city;
    this.candidateFilterForm.get('zipCode').patchValue(null)
    this.filterWhenNoneCandidateSouce()
    this.applyFilternew();
  }

  onChangezipcode(zipCode) {
    this.response = [];
    this.previousSearchAfterKey1 = null;
    // this.commonvalues.setcandidateData(this.response);
    this.candidateFilterForm.value.zipCode = zipCode;
    this.filterWhenNoneCandidateSouce()
    this.applyFilternew();
  }

  resetFilternew() {
    this.candidateFilterForm.value.searchAfterKey = null
    this.response = []
    this.obj.searchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;
    this.value = 0;
    this.highValue = 0;
    this.value1 = 0;
    this.highValue1 = 0;
    this.showWorkAuthorization = false;

    if (this.candidateFilterForm != undefined) {
      this.candidateFilterForm.get('state').patchValue(null)
      this.candidateFilterForm.get('country').patchValue(null)
      this.candidateFilterForm.get('city').patchValue(null)
      this.candidateFilterForm.get('zipCode').patchValue(null)


      this.WACheckboxes.forEach(item => item.selected = false);  // cleint type -- work auth
      this.statusCheckboxes.forEach(item => item.selected = false);
      this.availableForCheckboxes.forEach(item => item.selected = false);
      this.availablecheckbox.forEach(item => item.selected = false);
      this.candidate_status.forEach(item => item.selected = false);


      for (let key of this.keyarrayCandidatesouces) {
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(false);
      }

      for (let key of this.keysarrWorks) {
        ((this.candidateFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(false);
      }
      this.candidateSource = ['myCandidates'];
      if (this.owner && this.isMyCandidateShowedOnLoad) {
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myCandidates').patchValue(true);
      } else if (!this.isMyCandidateShowedOnLoad) {
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('allPlatFormCandidates').patchValue(true);
      }
      this.obj1.searchAfterKey = null;
      this.applyFilternew();
    }
  }

  openFilter() {
    this.filterOn = true
  }

  createCandidateFilterForm() {
    this.candidateFilterForm = this.formBuilder.group({
      source: this.formBuilder.array([]),
      workType: this.formBuilder.array([]),
      availableIn: null,
      engagementType: null,
      status: null,
      submissionFilters: null,
      workAuthorization: null,
      searchAfterKey: null,
      country: null,
      userId: localStorage.getItem('userId'),
      state: null,
      city: null,
      zipCode: null,
      limit: 10,
      totalExperience: null,
      postedFrom: null,
      postedTo: null,
      postedDayRange: 'Any (Days)',
      experienceType: 'Any (Years)',
      candidateSourceContent: 'Candidate Source',
      engagementTypeContent: 'Engagement Type',
      availabilityContent: 'Availability',
      statusContent: 'Status',
      postedDayRangeContent: 'Posted (Days)',
    });



    this.jobsoucefilterFrom();
    this.worktypefilterFrompush();

  }

  jobsoucefilterFrom() {
    this.jobSourcesFormarray.push(this.jobSourcefields())
  }

  get jobSourcesFormarray() {
    return this.candidateFilterForm.get('source') as UntypedFormArray;
  }

  jobSourcefields(): UntypedFormGroup {
    return this.formBuilder.group({
      all: false,
      myCandidates: false,
      allPlatFormCandidates: false,
      teamCandidates: false,
      benchNetworkCandidates: false,
      freeLancerNetworkCandidates: false,
      mtaNetworkCandidates: false,
      jobSeekerNetworkCandidates: false,
      featured: false,
      suggestedCandidates: false

    });
  }

  worktypefilterFrompush() {
    this.workTypeFormarray.push(this.worktypefilterFrom())
  }

  get workTypeFormarray() {
    return this.candidateFilterForm.get('workType') as UntypedFormArray;
  }

  worktypefilterFrom(): UntypedFormGroup {
    return this.formBuilder.group({
      all: false,
      remoteWork: false,
      relocationRequired: false,
      workFromHome: false
    });
  }

  onKeyZip(event: any) {
    let data: any = {};
    data.countryCode = "US";
    data.zipCode = event.target.value;
    data.stateCode = "";
    if (data.zipCode.length === 5) {
      this.apiService.create("country/geodetails", data).subscribe((res) => {
        if (
          res &&
          res != null &&
          res != "" &&
          res.length > 0 &&
          event.target.value != ""
        ) {
          res.forEach((ele) => {
            let cityName = ele.cityName;
            let stateName = ele.stateName;
            this.candidateFilterForm.patchValue({
              city: cityName,
              state: stateName,
            });
          });
        }
      }, err => {
        this.util.stopLoader();
      });
    } else if (data.zipCode.length < 5 || data.zipCode.length > 5) {

    }
  }

  reloadFilter(value: string) {
    if (value === 'reload') {
      this.previousSearchAfterKey1 = null;
      this.datas.searchAfterKey = null;
      this.previousSearchAfterKey = null;
      this.obj1.searchAfterKey = null;
      this.applyFilternew();
    }
  }

  // thiru work

  // job souce check uncheck

  jobSoucecheck(event, lable, param?: any) {
    this.stopscrollFlag = false
    this.candidateFilterForm.value.searchAfterKey = null
    // this.response = [];
    // this.commonvalues.setcandidateData(this.response);
    this.obj.searchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;
    if (event.target.checked == true) {

      for (let key of this.keyarrayCandidatesouces) {
        if (lable == 'all' && key != 'all') {
          if (key == 'myCandidates' && this.owner && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key);
            this.candidateSource = [...new Set(this.candidateSource)]
          } else if (key == 'teamCandidates' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key);
            this.candidateSource = [...new Set(this.candidateSource)]
          } else if (key == 'benchNetworkCandidates' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key);
            this.candidateSource = [...new Set(this.candidateSource)]
          } else if (key == 'freeLancerNetworkCandidates' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key);
            this.candidateSource = [...new Set(this.candidateSource)]
          } else if (key == 'mtaNetworkCandidates' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key);
            this.candidateSource = [...new Set(this.candidateSource)]
          } else if (key == 'jobSeekerNetworkCandidates' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key);
            this.candidateSource = [...new Set(this.candidateSource)]
          } else if (key == 'featured' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key);
            this.candidateSource = [...new Set(this.candidateSource)]
          } else if (key == 'suggestedCandidates' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key);
            this.candidateSource = [...new Set(this.candidateSource)]
          } else if (key == 'allPlatFormCandidates' && this.owner && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        } else {
          if (lable != 'all' && !this.candidateSource.includes(lable)) {
            this.candidateSource.push(lable);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
      }

    }
    if (event.target.checked == false) {

      if (lable != 'all') {
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(event.target.checked);
      }

      if (lable == 'all') {
        for (let key of this.keyarrayCandidatesouces) {
          if (this.candidateSource.includes(key)) {
            this.candidateSource.splice(this.candidateSource.indexOf(key), 1);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
      } else {
        if (this.candidateSource.includes(lable)) {
          this.candidateSource.splice(this.candidateSource.indexOf(lable), 1);
        }
      }
    }
    if (lable === 'all') {
      this.jobsouceCheckedAll(event);
    }

    this.applyFilternew(param)
    this.updateFunction();
  }

  jobsouceCheckedAll(event) {
    const checked = event.target.checked;
    for (let key of this.keyarrayCandidatesouces) {
      ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(checked);
    }

  }

  candiasasrce() {
    this.candidateSourceFlag = !this.candidateSourceFlag
  }

  jobclassifsd() {
    this.jobClassificationFlag = !this.jobClassificationFlag
  }
  availbwelkdfv() {
    this.availableForFlag = !this.availableForFlag
  }

  candidateFlagsd() {
    this.candidateFlag = !this.candidateFlag
  }

  wortjh() {
    this.workAuthFlag = !this.workAuthFlag
  }

  locatioesdnfjh() {
    this.locationFlag = !this.locationFlag
  }
  workefkjhgtyp() {
    this.workTypeFlag = !this.workTypeFlag
  }

  experienfa() {
    this.experienceFlag = !this.experienceFlag
  }

  workTypecheckbox(event, lable) {
    this.stopscrollFlag = false
    this.candidateFilterForm.value.searchAfterKey = null
    this.response = []
    this.obj.searchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;
    if (event.target.checked == true) {
      if (lable == 'all') {
        for (let key of this.keysarrWorks) {
          if (key != 'all' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.workTypecheckboxCheckAll(event);
      } else {
        if (!this.candidateSource.includes(lable)) {
          this.candidateSource.push(lable);
          this.candidateSource = [...new Set(this.candidateSource)]
        }
      }
      this.filterWhenNoneCandidateSouce()
    }
    if (event.target.checked == false) {
      if (lable == 'all') {
        for (let key of this.keysarrWorks) {
          if (this.candidateSource.includes(key)) {
            this.candidateSource.splice(this.candidateSource.indexOf(key), 1);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.workTypecheckboxCheckAll(event);
      } else {
        if (this.candidateSource.includes(lable)) {
          this.candidateSource.splice(this.candidateSource.indexOf(lable), 1);
        }
      }

      if (lable != 'all') {
        ((this.candidateFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(event.target.checked);
      }

    }

    this.applyFilternew()
  }

  workTypecheckboxCheckAll(event) {
    const checked = event.target.checked;
    for (let key of this.keysarrWorks) {
      ((this.candidateFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(checked);
    }
  }

  // availableCheckbox check and uncheck
  availabletype(event, lable, param?: any) {
    this.stopscrollFlag = false
    this.candidateFilterForm.value.searchAfterKey = null
    this.response = []
    // this.commonvalues.setcandidateData(this.response);

    this.obj.searchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;

    this.availablecheckbox.forEach(item => {
      if (item.label == lable) {
        item.selected = event.target.checked;
      }
    });

    if (event.target.checked == true) {
      this.ischeckedJobClassification = true;
      if (lable == 'All') {
        for (let key of this.availablecheckbox) {
          if (key.label != 'All' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key.label);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.available(event);
      } else {
        if (!this.candidateSource.includes(lable)) {
          this.candidateSource.push(lable);
          this.candidateSource = [...new Set(this.candidateSource)]
        }

      }
      this.filterWhenNoneCandidateSouce()
    }
    if (event.target.checked == false) {
      if (lable != 'All') {
        this.availablecheckbox[0].selected = false;
        if (this.candidateSource.includes(lable)) {
          this.candidateSource.splice(this.candidateSource.indexOf(lable), 1);
        }
      }

      if (lable == 'All') {
        for (let key of this.availablecheckbox) {
          if (this.candidateSource.includes(key.label) && key.label != 'All') {
            this.candidateSource.splice(this.candidateSource.indexOf(key.label), 1);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.available(event);
      }
    }

    this.applyFilternew(param);
    this.updateFunction();
  }

  available(event) {
    const checked = event.target.checked;
    this.availablecheckbox.forEach(item => item.selected = checked);
  }

  // availableCheckbox check and uncheck
  availableCheckboxChange(event, lable, param?: any) {
    this.stopscrollFlag = false
    this.candidateFilterForm.value.searchAfterKey = null
    this.response = []
    // this.commonvalues.setcandidateData(this.response);

    this.obj.searchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;

    this.availableForCheckboxes.forEach(item => {
      if (item.label == lable) {
        item.selected = event.target.checked;
      }
    });

    if (event.target.checked == true) {
      this.ischeckedJobClassification = true;
      if (lable == 'All') {
        for (let key of this.availableForCheckboxes) {
          if (key.label != 'All' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key.label);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.jobclassifiCheckAll(event);
      } else {
        if (!this.candidateSource.includes(lable)) {
          this.candidateSource.push(lable);
          this.candidateSource = [...new Set(this.candidateSource)]
        }

      }
      this.filterWhenNoneCandidateSouce()
    }
    if (event.target.checked == false) {
      if (lable != 'All') {
        this.availableForCheckboxes[0].selected = false;
        if (this.candidateSource.includes(lable)) {
          this.candidateSource.splice(this.candidateSource.indexOf(lable), 1);
        }
      }

      if (lable == 'All') {
        for (let key of this.availableForCheckboxes) {
          if (this.candidateSource.includes(key.label) && key.label != 'All') {
            this.candidateSource.splice(this.candidateSource.indexOf(key.label), 1);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.jobclassifiCheckAll(event);
      }
    }

    this.applyFilternew(param);
    this.updateFunction();
  }

  jobclassifiCheckAll(event) {
    const checked = event.target.checked;
    this.availableForCheckboxes.forEach(item => item.selected = checked);
  }

  //  client type check and uncheck
  workAuthcheckbox(event, lable, param?: any) {
    this.stopscrollFlag = false
    this.candidateFilterForm.value.searchAfterKey = null
    this.response = [];
    // this.commonvalues.setcandidateData(this.response);
    this.obj.searchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;

    this.WACheckboxes.forEach(item => {
      if (item.label == lable) {
        item.selected = event.target.checked;
      }
    });



    if (event.target.checked == true) {
      this.ischeckedClientType = true;

      if (lable == 'All') {
        for (let key of this.WACheckboxes) {
          if (key.label != 'All') {
            this.candidateSource.push(key.label);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.clientTypeCheckedAll(event);
      } else {
        this.candidateSource.push(lable);
        this.candidateSource = [...new Set(this.candidateSource)]
      }
      this.filterWhenNoneCandidateSouce()
    }

    if (event.target.checked == false) {
      if (lable != 'All') {
        this.WACheckboxes[0].selected = false;
        if (this.candidateSource.includes(lable)) {
          this.candidateSource.splice(this.candidateSource.indexOf(lable), 1);
        }

      }

      if (lable == 'All') {
        for (let key of this.WACheckboxes) {
          if (this.candidateSource.includes(key.label) && key.label != 'All') {
            this.candidateSource.splice(this.candidateSource.indexOf(key.label), 1);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.clientTypeCheckedAll(event);
      }

    }

    if (this.ischeckedClientType && this.ischeckedClientTypeAll) {
      event.target.checked = true
    }
    this.applyFilternew(param);
    this.updateFunction();
  }


  statusChange(checked, label) {
    if (label === 'All') {

      if (checked) {
        this.statusCheckboxes.forEach(item => item.selected = true);
      }
      else if (!checked) {
        this.statusCheckboxes.forEach(item => item.selected = false);
      }
    }
    else if (label != 'All') {

      this.statusCheckboxes.forEach(item => {
        if (item.label === label) {
          item.selected = checked;
        }
      });

      const isAllchecked = this.statusCheckboxes.filter(val => val.label != 'All').every(item => item.selected === true);
      this.statusCheckboxes[0].selected = isAllchecked;

    }
    this.updateFunction();
  }

  clientTypeCheckedAll(event) {
    const checked = event.target.checked;
    this.WACheckboxes.forEach(item => item.selected = checked);

  }

  // submit status filed code
  candidate_status_check(event, lable) {
    this.stopscrollFlag = false
    this.candidateFilterForm.value.searchAfterKey = null
    this.response = [];
    // this.commonvalues.setcandidateData(this.response);
    this.obj.searchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;

    this.candidate_status.forEach(item => {
      if (item.label == lable) {
        item.selected = event.target.checked;
      }
    });



    if (event.target.checked == true) {
      this.ischeckedStatus = true;
      if (lable == 'All') {
        for (let key of this.candidate_status) {
          if (key.label != 'All' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key.label);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.candidate_CheckAll(event);
      } else {
        if (!this.candidateSource.includes(lable)) {
          this.candidateSource.push(lable);
          this.candidateSource = [...new Set(this.candidateSource)]
        }
      }


      // clear source values and default check my canidate
      for (let key of this.keyarrayCandidatesouces) {

        if (key == 'myCandidates') {
          ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).setValue(true);
          this.candidateSource.push("myCandidates");
          this.candidateSource = [...new Set(this.candidateSource)]
        } else {
          ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).setValue(false);
        }

        // Clear source values from seleted.
        if (this.candidateSource.includes(key)) {
          if (key != 'myCandidates') {
            this.candidateSource.splice(this.candidateSource.indexOf(key), 1);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }

      }




    }

    if (event.target.checked == false) {
      if (lable != 'All') {
        this.candidate_status[0].selected = false;
        if (this.candidateSource.includes(lable)) {
          this.candidateSource.splice(this.candidateSource.indexOf(lable), 1);
        }
      }

      if (lable == 'All') {
        for (let key of this.candidate_status) {
          if (this.candidateSource.includes(key.label) && key.label != 'All') {
            this.candidateSource.splice(this.candidateSource.indexOf(key.label), 1);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.candidate_CheckAll(event);
      }
    }

    this.applyFilternew()
  }

  candidate_CheckAll(event) {
    const checked = event.target.checked;
    this.candidate_status.forEach(item => item.selected = checked);

  }

  // status check and uncheck
  statuscheck(event, lable) {
    this.stopscrollFlag = false
    this.candidateFilterForm.value.searchAfterKey = null
    this.response = [];
    // this.commonvalues.setcandidateData(this.response);
    this.obj.searchAfterKey = null;
    this.obj1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;

    this.statusCheckboxes.forEach(item => {
      if (lable === 'Available') {
        this.activeStatus = true
      }
      else {
        this.activeStatus = false
      }
      if (item.label == lable) {
        item.selected = event.target.checked;
      }
    });


    if (event.target.checked == true) {
      this.ischeckedStatus = true;
      if (lable == 'All') {
        for (let key of this.statusCheckboxes) {
          if (key.label != 'All' && !this.candidateSource.includes(key)) {
            this.candidateSource.push(key.label);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.statusCheckAll(event);
      } else {
        if (!this.candidateSource.includes(lable)) {
          this.candidateSource.push(lable);
          this.candidateSource = [...new Set(this.candidateSource)]
        }
      }
      if (this.activeStatus) {
        if (!this.owner) {
          if (((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('benchNetworkCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('jobSeekerNetworkCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedCandidates').value == false) {

            for (let key of this.keyarrayCandidatesouces) {
              if (key != "myCandidates") {
                ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(true);
                if (key != 'all') {
                  this.candidateSource.push(key);
                  this.candidateSource = [...new Set(this.candidateSource)]
                }

              }
            }

          }
        }
        if (this.owner) {
          if (((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('benchNetworkCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('jobSeekerNetworkCandidates').value == false) {

            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myCandidates').patchValue(true);
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamCandidates').patchValue(true);
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('benchNetworkCandidates').patchValue(true);
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkCandidates').patchValue(true);
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkCandidates').patchValue(true);
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('jobSeekerNetworkCandidates').patchValue(true);
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').patchValue(true);
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedCandidates').patchValue(true);
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(true);

            this.candidateSource.push("myCandidates");
            this.candidateSource.push("teamCandidates");
            this.candidateSource.push("benchNetworkCandidates");
            this.candidateSource.push("freeLancerNetworkCandidates");
            this.candidateSource.push("mtaNetworkCandidates");
            this.candidateSource.push("jobSeekerNetworkCandidates");
            if (!this.FeaSugg) {
              this.candidateSource.push("featured");
              this.candidateSource.push("suggestedCandidates");
            }

            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.activeStatus = null;
      }
      else if (!this.activeStatus) {
        if (this.owner) {
          if (((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('benchNetworkCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedCandidates').value == false &&
            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('jobSeekerNetworkCandidates').value == false) {

            ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myCandidates').patchValue(true);

            this.candidateSource.push("myCandidates");

            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.activeStatus = null;

      }
    }



    if (event.target.checked == false) {
      if (lable != 'All') {
        this.statusCheckboxes[0].selected = false;
        if (this.candidateSource.includes(lable)) {
          this.candidateSource.splice(this.candidateSource.indexOf(lable), 1);
        }
      }


      if (lable == 'All') {
        for (let key of this.statusCheckboxes) {
          if (this.candidateSource.includes(key.label) && key.label != 'All') {
            this.candidateSource.splice(this.candidateSource.indexOf(key.label), 1);
            this.candidateSource = [...new Set(this.candidateSource)]
          }
        }
        this.statusCheckAll(event);
      }

    }

    this.applyFilternew()
  }

  statusCheckAll(event) {
    const checked = event.target.checked;
    this.statusCheckboxes.forEach(item => item.selected = checked);

  }

  filterWhenNoneCandidateSouce() {
    if (!this.owner) {
      if (((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('benchNetworkCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('jobSeekerNetworkCandidates').value == false) {


        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamCandidates').patchValue(true);
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('benchNetworkCandidates').patchValue(true);
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkCandidates').patchValue(true);
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkCandidates').patchValue(true);
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('jobSeekerNetworkCandidates').patchValue(true);
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').patchValue(true);
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedCandidates').patchValue(true);
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(true);

        this.candidateSource.push("teamCandidates");
        this.candidateSource.push("benchNetworkCandidates");
        this.candidateSource.push("freeLancerNetworkCandidates");
        this.candidateSource.push("mtaNetworkCandidates");
        this.candidateSource.push("jobSeekerNetworkCandidates");
        if (!this.FeaSugg) {
          this.candidateSource.push("featured");
          this.candidateSource.push("suggestedCandidates");
        }

        this.candidateSource = [...new Set(this.candidateSource)]
      }
    }

    if (this.owner) {
      if (((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('benchNetworkCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedCandidates').value == false &&
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('jobSeekerNetworkCandidates').value == false) {

        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myCandidates').patchValue(true);

        this.candidateSource.push("myCandidates");

        this.candidateSource = [...new Set(this.candidateSource)]
      }
    }
  }

  removeEntitynew(value, index) {

    if (this.jobfilter != true) {

      this.candidateFilterForm.value.searchAfterKey = null
      this.response = []
      this.obj.searchAfterKey = null;
      this.obj1.searchAfterKey = null;
      this.previousSearchAfterKey = null;
      this.previousSearchAfterKey1 = null;

      this.stopscrollFlag = false

      this.candidateSource.splice(index, 1);
      if (this.keyarrayCandidatesouces.includes(value)) {
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(false);
        ((this.candidateFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(value).patchValue(false);
      }
      if (this.keysarrWorks.includes(value)) {
        ((this.candidateFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(false);
        ((this.candidateFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get(value).patchValue(false);
      }

      this.WACheckboxes.forEach(element => {
        if (element.selected && element.label == value) {
          element.selected = false;
          this.WACheckboxes[0].selected = false
        }
      });

      this.statusCheckboxes.forEach(element => {
        if (element.selected && element.label == value) {
          element.selected = false;
          this.statusCheckboxes[0].selected = false
        }
      });

      this.availableForCheckboxes.forEach(element => {
        if (element.selected && element.label == value) {
          element.selected = false;
          this.availableForCheckboxes[0].selected = false
        }
      });

      this.availablecheckbox.forEach(element => {
        if (element.selected && element.label == value) {
          element.selected = false;
          this.availablecheckbox[0].selected = false
        }
      });


      this.candidate_status.forEach(element => {
        if (element.selected && element.label == value) {
          element.selected = false;
          this.candidate_status[0].selected = false
        }
      });

      if (value == 'myCandidates') {
        this.response = []
        this.obj.searchAfterKey = null;
        this.obj1.searchAfterKey = null;
        this.previousSearchAfterKey = null;
        this.previousSearchAfterKey1 = null;
      }
      // this.applyFilternew();
    }
  }

  chatbottom() {
    let seletedItem: any = {};
    // this._socket.ngOnDestroy();
    // this._socket.connections();
    seletedItem.owner = true;
    this.messagemodelflag = true;
    seletedItem.userId = localStorage.getItem('userId');
    this.messageData = [];
    seletedItem.groupType = "CANDIDATE";
    seletedItem.messageType = "CANDIDATE";
    seletedItem.id = null;
    this.messageData = seletedItem;
  }

  closeMessage(event) {
    this.messagemodelflag = false;
    // this._socket.ngOnDestroy();

  }

  onFilterToggle(value: any) {
    const receivedData = JSON.parse(value);
    // this.data1 = receivedData.jobForm;
    // this.jobSource = receivedData.jobSource;
    // this.filterapicall()
  }

  openFilterSlider() {
    if (!this.isFilterOpen) {
      this.isFilterOpen = true;
      this.jobService.setSliderToggle(true, 'candidate-listing', null);
    }
  }

  closeFilterSlider() {
    if (this.isFilterOpen) {
      this.isFilterOpen = false;
      this.jobService.setSliderToggle(false, 'candidate-listing', null);
    }
  }
  @Output() panelValue = new EventEmitter<any>(null);

  onMenuItemClick(event, param?: any): void {
    event.stopPropagation();

    if (param != null) {
      // this.meunTrigger.closeMenu();
    }
  }
}
