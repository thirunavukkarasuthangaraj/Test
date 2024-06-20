import { ModalOptions } from "ngx-bootstrap/modal";
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { formatDate } from "@angular/common";
import { AppSettings } from 'src/app/services/AppSettings';
import { ApiService } from 'src/app/services/api.service';
import { CommonValues } from 'src/app/services/commonValues';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { JobModel } from 'src/app/services/jobModel';
import { JobService } from "src/app/services/job.service";
import { UserService } from "src/app/services/UserService";
import { GigsumoConstants, USER_TYPE } from "src/app/services/GigsumoConstants";
import { map, take } from "rxjs/operators";

@Component({
  selector: 'app-job-filter-vertical-template',
  templateUrl: './job-filter-vertical-template.component.html',
  styleUrls: ['./job-filter-vertical-template.component.scss']
})
export class JobFilterVerticalTemplateComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() viewType: any;
  @Input() filterChanges: any;
  ischeckedStatusAll: boolean = false
  totalCount
  validTotalPoints: boolean
  deactivatedJobs: Array<JobModel> = [];
  filterApplied: boolean = false
  searchContent: any;
  keyarrayjobsouces = ["all", "myJobs", "allPlatFormJobs", "teamJobs", "recruiterNetworkJobs", "freeLancerNetworkJobs", "mtaNetworkJobs", "featured", "suggestedJobs"];
  keyarrayClientType = ["directHire", "systemsIntegrator", "staffingAgency", "primeVendor", "vendor"];
  keysarrWorks = ["all", "remoteWork", "relocationRequired", "workFromHome"];
  userType: any = localStorage.getItem('userType')
  userIdStorage = localStorage.getItem('userId')
  jobFoundStatus: any = "Fetching Jobs..."
  activeStatus: boolean = null;
  ischeckedJobClassification: boolean = false
  ischeckedJobClassificationAll: boolean = false
  listingCount = 0;
  jobSource: any = [];
  value: number = 0;
  filterData: any;
  networkflag: boolean = false;
  jobSourceSelectNetRoute: any
  searchUserType: any
  totalmsgcounts: any;
  totalmsgcount: Subscription;
  ScreenLoadBool: boolean = false
  jobSourceSearchRoute = null
  queryParamValues: any;
  highValue: number = 0;
  options: any = {
    ceil: 20,
    floor: 0
  };
  data: any = {
    limit: 10,
    searchAfterKey: null,
    userId: localStorage.getItem('userId')
  }


  value1: number = 0;
  highValue1: number = 0;
  options1: any = {
    floor: 0,
    ceil: 99
  };
  obj: any = {
    limit: 10,
    searchAfterKey: null,
    jobPostedBy: localStorage.getItem('userId')
  }
  jobFilterForm: UntypedFormGroup
  stopscrollFlag: boolean = false
  owner: boolean = false
  data1: any = {}
  connectionJobs: boolean = false;
  previousSearchAfterKey = null;
  ischeckedStatus: boolean = false
  previousSearchAfterKey1 = null;
  clientTypeCheckboxes = [
    { label: 'All', selected: false, disable: false },
    { label: 'Direct Client', selected: false, disable: false },
    { label: 'Client', selected: false, disable: false },
    { label: 'Direct Hire', selected: false, disable: false },
    { label: 'Systems Integrator', selected: false, disable: false },
    { label: 'Staffing Agency', selected: false, disable: false },
    { label: 'Prime Vendor', selected: false, disable: false },
    { label: 'Vendor', selected: false, disable: false },
    { label: 'Supplier', selected: false, disable: false },
  ];

  statusCheckboxes = [
    { label: 'All', selected: false, disable: false },
    { label: 'Draft', selected: false, disable: false },
    { label: 'Active', selected: false, disable: false },
    { label: 'On Hold', selected: false, disable: false },
    { label: 'Filled', selected: false, disable: false },
    { label: 'Closed', selected: false, disable: false },
    { label: 'Inactive', selected: false, disable: false },
    { label: 'Deactivated', selected: false, disable: false },

  ];

  jobclasscificationCheckboxes = [
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
  filterOn: boolean = false
  response: any = [];
  ischeckedClientType: boolean = false
  ischeckedClientTypeAll: boolean = false
  triggerapi = new BehaviorSubject("null")
  getResume: boolean = false
  creditexpiredflag: boolean = false
  availablePoints
  sendProfileData
  receiveFilterData: Subscription;
  resetFilter: Subscription;
  isMyJobsShowedOnLoad: boolean = false;
  @Input() jobFilterData: any;
  recruiterNetwork: boolean = false;
  freelancerNetwork: boolean = false;
  benchNetwork: boolean = false;
  mtaNetwork: boolean = false;
  jobseekerNetwork: boolean = false;
  constructor(private formBuilder: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private util: UtilService,
    private router: Router, private searchData: SearchData, private commonvalues: CommonValues, private apiService: ApiService,
    private jobService: JobService, private userService: UserService, private cdr: ChangeDetectorRef) {
    this.userType = localStorage.getItem('userType');

    this.receiveFilterData = this.jobService.getDataForFilter().subscribe(data => {
      if (data) {
        this.removeEntity(data.value, data.index);
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.networkName && params.networkName == 'MANAGEMENT_TALENT_ACQUISITION_NETWORK') {
        this.mtaNetwork = true
        this.freelancerNetwork = false
        this.recruiterNetwork = false
        this.jobseekerNetwork = false
        this.benchNetwork = false
      } else if (params.networkName && params.networkName == 'FREELANCE_RECRUITER_NETWORK') {
        this.mtaNetwork = false
        this.freelancerNetwork = true
        this.recruiterNetwork = false
        this.jobseekerNetwork = false
        this.benchNetwork = false
      } else if (params.networkName && params.networkName == 'JOB_SEEKER_NETWORK') {
        this.mtaNetwork = false
        this.freelancerNetwork = false
        this.recruiterNetwork = false
        this.jobseekerNetwork = true
        this.benchNetwork = false
      } else if (params.networkName && params.networkName == 'RECRUITER_NETWORK') {
        this.mtaNetwork = false
        this.freelancerNetwork = false
        this.recruiterNetwork = true
        this.jobseekerNetwork = false
        this.benchNetwork = false
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createjobFilterForm();
    if (changes.filterChanges !== undefined && changes.filterChanges.currentValue != undefined) {
      let data: any = changes.filterChanges.currentValue;
      this.jobFilterForm.patchValue(data.formData);
      this.jobSource = data.checkedItems;
      this.clientTypeCheckboxes = data.clientTypeCheckedItems === undefined ? this.clientTypeCheckboxes : data.clientTypeCheckedItems;
      this.statusCheckboxes = data.statusCheckedItems === undefined ? this.statusCheckboxes : data.statusCheckedItems;
      this.jobclasscificationCheckboxes = data.jobClassifications === undefined ? this.jobclasscificationCheckboxes : data.jobClassifications;
      this.value1 = data.formData.postedFrom != null ? data.formData.postedFrom : 0;
      this.highValue1 = data.formData.postedTo != null ? data.formData.postedTo : 0;
      this.value = data.formData.experienceFrom != null ? data.formData.experienceFrom : 0;
      this.highValue = data.formData.experienceTo != null ? data.formData.experienceTo : 0;
      // console.log("CHANGES FILE HERE ->>>",
      //  this.jobFilterForm.getRawValue()  ,
      //   this.jobSource ,
      //   this.jobclasscificationCheckboxes ,
      //   this.statusCheckboxes ,
      //   this.clientTypeCheckboxes );
    }
  }

  ngAfterViewInit(): void {
      if (this.mtaNetwork) {
        this.jobSourcesFormarray.at(0).get('allPlatFormJobs').patchValue(false);
        this.jobSourcesFormarray.at(0).get('mtaNetworkJobs').patchValue(true);
      } else if (this.freelancerNetwork) {
        this.jobSourcesFormarray.at(0).get('allPlatFormJobs').patchValue(false);
        this.jobSourcesFormarray.at(0).get('freeLancerNetworkJobs').patchValue(true);
      } else if (this.jobseekerNetwork) {
        this.jobSourcesFormarray.at(0).get('allPlatFormJobs').patchValue(true);
      } else if (this.recruiterNetwork) {
        this.jobSourcesFormarray.at(0).get('allPlatFormJobs').patchValue(false);
        this.jobSourcesFormarray.at(0).get('recruiterNetworkJobs').patchValue(true);
      }
  }

  @Input() valuesSentForFilters: any;
  lablechangeclienttype: string = '';
  EXPERIENCE_ANY = GigsumoConstants.EXPERIENCE_ANY;
  EXPERIENCE_JUNIOR = GigsumoConstants.EXPERIENCE_JUNIOR;
  EXPERIENCE_MID_LEVEL = GigsumoConstants.EXPERIENCE_MID_LEVEL;
  EXPERIENCE_SENIOR = GigsumoConstants.EXPERIENCE_SENIOR;
  EXPERIENCE_ARCHITECT = GigsumoConstants.EXPERIENCE_ARCHITECT;

  POSTED_ANY = GigsumoConstants.POSTED_ANY;
  POSTED_TODAY = GigsumoConstants.POSTED_TODAY;
  POSTED_LAST_7_DAYS = GigsumoConstants.POSTED_LAST_7_DAYS;
  POSTED_LAST_14_DAYS = GigsumoConstants.POSTED_LAST_14_DAYS;
  POSTED_LAST_30_DAYS = GigsumoConstants.POSTED_LAST_30_DAYS;

  ngOnInit() {
    this.updateJobFilterData();
    this.getCountries();
  }

  onExperienceValueChange() {
    // console.log('selected option: ', this.jobFilterForm.get('experienceType').value)
    let selectedValue: any;
    selectedValue = this.jobFilterForm.get('experienceType').value;
    if (selectedValue == GigsumoConstants.EXPERIENCE_JUNIOR) {
      this.jobFilterForm.patchValue({ experienceFrom: 1, experienceTo: 3 });
    } else if (selectedValue == GigsumoConstants.EXPERIENCE_MID_LEVEL) {
      this.jobFilterForm.patchValue({ experienceFrom: 4, experienceTo: 6 });
    } else if (selectedValue == GigsumoConstants.EXPERIENCE_SENIOR) {
      this.jobFilterForm.patchValue({ experienceFrom: 6, experienceTo: 10 });
    } else if (selectedValue == GigsumoConstants.EXPERIENCE_ARCHITECT) {
      this.jobFilterForm.patchValue({ experienceFrom: 10, experienceTo: 20 });
    } else {
      this.jobFilterForm.patchValue({ experienceFrom: null, experienceTo: null });
    }
    this.updateFunction();
  }

  onPostedDaysChange() {
    // console.log('selected option: ', this.jobFilterForm.get('experienceType').value)
    let selectedValue: any;
    selectedValue = this.jobFilterForm.get('postedDayRange').value;
    if (selectedValue == GigsumoConstants.POSTED_TODAY) {
      this.jobFilterForm.patchValue({ postedFrom: 1, postedTo: 1 });
    } else if (selectedValue == GigsumoConstants.POSTED_LAST_7_DAYS) {
      this.jobFilterForm.patchValue({ postedFrom: 1, postedTo: 7 });
    } else if (selectedValue == GigsumoConstants.POSTED_LAST_14_DAYS) {
      this.jobFilterForm.patchValue({ postedFrom: 1, postedTo: 14 });
    } else if (selectedValue == GigsumoConstants.POSTED_LAST_30_DAYS) {
      this.jobFilterForm.patchValue({ postedFrom: 1, postedTo: 30 });
    } else {
      this.jobFilterForm.patchValue({ postedFrom: null, postedTo: null });
    }
    this.updateFunction();
  }

  updateJobFilterData() {
    const userType = localStorage.getItem('userType') as USER_TYPE;
    if (this.isMTAorFREEandREC(userType)) {
      this.owner = true;
    }
    else if (this.isBench(userType)) {
      this.owner = false;
    }
  }

  isRecruiter(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.RECRUITER);
  }

  isBench(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.BENCH_RECRUITER);
  }

  isMTAorFREEandREC(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION
      || userType === GigsumoConstants.FREELANCE_RECRUITER || userType === GigsumoConstants.RECRUITER);
  }

  isMTAorFREE(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION || userType === GigsumoConstants.FREELANCE_RECRUITER);
  }

  settingUpFilters() {
    if (!this.isMyJobsShowedOnLoad && this.networkflag == false && !this.queryParamValues.networkflag
      && this.jobSourceSearchRoute == null) {
      this.jobSource.push('allPlatFormJobs')
      this.jobSource = [...new Set(this.jobSource)]
      this.data1.searchAfterKey = null;
      ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('allPlatFormJobs').patchValue(true);
      this.applyFilternew();
    } else if (this.owner && this.isMyJobsShowedOnLoad && this.networkflag == false && !this.queryParamValues.networkflag
      && this.jobSourceSearchRoute == null) {
      this.jobSource.push('myJobs')
      this.jobSource = [...new Set(this.jobSource)]
      this.data1.searchAfterKey = null;
      ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myJobs').patchValue(true);
      this.applyFilternew();
    } else if (this.networkflag == true && this.queryParamValues.networkflag) {
      this.jobSource.push(this.jobSourceSelectNetRoute)
      this.jobSource = [...new Set(this.jobSource)]
      this.data1.searchAfterKey = null;
      ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(this.jobSourceSelectNetRoute).patchValue(true);
      this.applyFilternew();
    } else if (this.jobSourceSearchRoute != null) {
      this.jobSource = []
      this.jobSource.push(this.jobSourceSearchRoute)
      this.jobSource = [...new Set(this.jobSource)]
      this.data1.searchAfterKey = null;
      ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).patchValue({
        all: false,
        myJobs: false,
        allPlatFormJobs: false,
        teamJobs: false,
        recruiterNetworkJobs: false,
        freeLancerNetworkJobs: false,
        mtaNetworkJobs: false,
        featured: false,
        suggestedJobs: false,
      });
      ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(this.jobSourceSearchRoute).patchValue(true);
      this.applyFilternew();
    }
  }

  listingDeactivatedJobs() {
    var userid = localStorage.getItem('userId');
    var userType = localStorage.getItem('userType');
    let profiledata: any = {}
    profiledata.userId = userid;
    profiledata.userType = userType;
    const format = 'dd-MM-yyyy';
    const locale = 'en-US';
    let lastLoggedTime: any = localStorage.getItem('lastLogged');

    if (lastLoggedTime != null && lastLoggedTime != undefined) {

      let datas: any = {}

      this.apiService.create('user/profileDetails', profiledata).subscribe(profileres => {
        let logged = new Date(lastLoggedTime);
        let today = new Date();

        const lastloggedYesterday = this.dateInPast(logged);
        if (formatDate(logged, format, locale) < formatDate(today, format, locale) || lastloggedYesterday) {
          if (profileres != undefined && profileres.code === "00000") {
            this.sendProfileData = profileres;

            this.availablePoints = profileres.data.creditPoints;



            this.apiService.query('jobs/listingDeactivatedJobsandCandidates/' + userid + "/" + userType).subscribe(res => {

              if (res.code === "00000" && res.data.deactivatedJobs != undefined) {

                this.deactivatedJobs = res.data.deactivatedJobs;
                this.totalCount = this.deactivatedJobs.length;

                let totalcredit = profileres.data.creditPoints;
                let sum = 0;
                this.deactivatedJobs.forEach(element => {

                  element.isSelected = false;

                  if (element.isFeatured == true) {
                    datas = profileres.data.creditConsumptions.find(item => item.creditType === AppSettings.UPGRADED_JOB);
                    sum = sum + datas.points;
                    element.points = datas.points
                    element.consumptionType = datas.creditType;
                  }
                  else {
                    datas = profileres.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_JOB);
                    sum = sum + datas.points;
                    element.points = datas.points;
                    element.consumptionType = datas.creditType;
                  }
                });
                this.deactivatedJobs[0].totalpoints = sum;
                if (sum < totalcredit) {
                  this.validTotalPoints = true;
                }
                else {
                  this.validTotalPoints = false;
                }

                //validating popup to appear only one day

                let ngbModalOptions: NgbModalOptions = { backdrop: 'static', keyboard: false };
                let checkModalOpenedToday: any = localStorage.getItem(userid + '_jobmodalOpened');

                if (checkModalOpenedToday != null || checkModalOpenedToday != undefined) {

                  const openedDate = new Date(checkModalOpenedToday.toString());

                  // openedDate.valueOf() < endofDay;
                  const checkDateIfYesterDay = this.dateInPast(openedDate);

                  if (checkDateIfYesterDay) {
                    this.listingCount = 0;
                    localStorage.removeItem(userid + '_jobmodalOpened')
                  }
                  else if (!checkDateIfYesterDay) {
                    this.listingCount++;
                  }
                }

                if (this.listingCount >= 1) {
                  return;
                }
                const config: ModalOptions = { class: 'modal-lg', backdrop: 'static', keyboard: false };
                //this.modalRef = this.modalService.show(this.listingmodal, config);
                setTimeout(() => {
                  localStorage.setItem(userid + '_jobmodalOpened', String(today));
                }, 1000);
                // $('body').css('position','fixed').css('overflow', 'hidden');
                this.stopscrollFlag = true;

              }

            });

          }
        }
      });


    }

  }

  dateInPast(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  onLoad() {
    let data: any = JSON.parse(localStorage.getItem('jobForm'));
    for (let key in data.source) {
      if (data.source[key] === true) {
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(true);
        this.jobSource.push(key)
        this.jobSource.forEach((ele, index) => {
          if (this.FeaSugg && ele === "featured" || this.FeaSugg && ele === "suggestedJobs") {
            this.jobSource.splice(index, 1)
          }
          if (!this.owner && ele === "myJobs") {
            this.jobSource.splice(index, 1)
          }
        })
      }
    }
    data.clientType.forEach((res) => {
      this.clientTypeCheckboxes.forEach(item => {
        if (item.label === res) {
          item.selected = true;
          this.jobSource.push(res)
        }
      });
    });
    data.status.forEach((res) => {
      this.statusCheckboxes.forEach(item => {
        if (item.label === res) {
          item.selected = true;
          this.jobSource.push(res)
        }
      });
    });
    data.jobClassification.forEach((res) => {
      this.jobclasscificationCheckboxes.forEach(item => {
        if (item.label === res) {
          item.selected = true;
          this.jobSource.push(res)
        }
      });
    });
    for (let key in data.workType) {
      if (data.workType[key] === true) {
        ((this.jobFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(true);
        this.jobSource.push(key)
      }
    }

    this.jobSource = [...new Set(this.jobSource)]
    this.jobSource.forEach((ele, index) => {
      if (ele === "All" || ele === "all") {
        this.jobSource.splice(index, 1)
      }
    })
    this.value = data.experienceFrom != null ? data.experienceFrom : 0;
    this.highValue = data.experienceTo != null ? data.experienceTo : 0;
    this.value1 = data.postedFrom != null ? data.postedFrom : 0;
    this.highValue1 = data.postedTo != null ? data.postedTo : 0;


    this.jobFilterForm.get('country').patchValue(data.country)
    this.jobFilterForm.get('state').patchValue(data.state)
    this.jobFilterForm.get('city').patchValue(data.city)
    this.jobFilterForm.get('zipCode').patchValue(data.zipCode)

    localStorage.setItem('jobSource', this.jobSource);
  }

  get jobSourcesFormarray() {
    return this.jobFilterForm.get('source') as UntypedFormArray;
  }

  // @Output() clientTypeChecked = new EventEmitter<any>();
  clientTypecheck(event, lable, param?: any) {
    this.response = []
    this.obj.searchAfterKey = null;
    this.data1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;
    this.stopscrollFlag = false
    this.clientTypeCheckboxes.forEach(item => {
      if (item.label == lable) {
        item.selected = event.target.checked;
      }
    });

    this.response = []
    this.data1.searchAfterKey = null;
    if (event.target.checked == true) {
      this.ischeckedClientType = true;

      if (lable == 'All') {
        for (let key of this.clientTypeCheckboxes) {
          if (key.label != 'All') {
            this.jobSource.push(key.label);
            this.jobSource = [...new Set(this.jobSource)]
          }
        }
        this.clientTypeCheckedAll(event);
      } else {
        this.jobSource.push(lable);
        this.jobSource = [...new Set(this.jobSource)]
      }
    }

    if (event.target.checked == false) {
      if (lable != 'All') {
        this.clientTypeCheckboxes[0].selected = false;
        if (this.jobSource.includes(lable)) {
          this.jobSource.splice(this.jobSource.indexOf(lable), 1);
        }

      }

      if (lable == 'All') {
        for (let key of this.clientTypeCheckboxes) {
          if (this.jobSource.includes(key.label) && key.label != 'All') {
            this.jobSource.splice(this.jobSource.indexOf(key.label), 1);
            this.jobSource = [...new Set(this.jobSource)]
          }
        }
        this.clientTypeCheckedAll(event);
      }
      // this.clientTypeChecked.emit({event, lable, param});
    }

    if (this.ischeckedClientType && this.ischeckedClientTypeAll) {
      event.target.checked = true
    }
    this.filterWhenNoneJobSouce()
    this.applyFilternew(param);
    // this.cdr.detectChanges();
    this.updateFunction()
  }

  updateFunction() {
    if (this.jobFilterData) {
      this.jobFilterData.clickHandler.apply(this.jobFilterData.source,
        [{
          formData: this.jobFilterForm.getRawValue(), checkedItems: this.jobSource,
          jobClassifications: this.jobclasscificationCheckboxes,
          statusCheckedItems: this.statusCheckboxes,
          clientTypeCheckedItems: this.clientTypeCheckboxes,
          createdByTypeCheckedItems: this.createdByypesCheckboxes,
          from: "VERTICAL"
        }]);
    }
  }

  filterWhenNoneJobSouce() {
    if (!this.owner) {
      if (((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('recruiterNetworkJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedJobs').value == false) {

        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).patchValue({
          teamJobs: true,
          recruiterNetworkJobs: true,
          freeLancerNetworkJobs: true,
          mtaNetworkJobs: true,
          featured: true,
          suggestedJobs: true
        })


        this.jobSource.push("teamJobs");
        this.jobSource.push("recruiterNetworkJobs");
        this.jobSource.push("freeLancerNetworkJobs");
        this.jobSource.push("MTA Network");
        if (!this.FeaSugg) {
          this.jobSource.push("featured");
          this.jobSource.push("suggestedJobs");
        }

        this.jobSource = [...new Set(this.jobSource)]
      }
    }
    if (this.owner && this.isMyJobsShowedOnLoad) {
      if (((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('recruiterNetworkJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('allPlatFormJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamJobs').value == false) {

        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myJobs').patchValue(true);
        this.jobSource.push("myJobs");
        this.jobSource = [...new Set(this.jobSource)]
      }
    } else if (!this.isMyJobsShowedOnLoad) {
      if (((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('recruiterNetworkJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('allPlatFormJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedJobs').value == false &&
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamJobs').value == false) {

        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('allPlatFormJobs').patchValue(true);
        this.jobSource.push("allPlatFormJobs");
        this.jobSource = [...new Set(this.jobSource)]
      }
    }
  }

  totalCountJob: number = 0;

  statuscheckbox(event, lable, param?: any) {
    this.stopscrollFlag = false
    this.response = []
    this.obj.searchAfterKey = null;
    this.data1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;


    this.statusCheckboxes.forEach(item => {
      if (lable === 'Active') {
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
      this.ischeckedJobClassification = true;
      if (lable == 'All') {
        for (let key of this.statusCheckboxes) {
          if (key.label != 'All' && !this.jobSource.includes(key)) {
            this.jobSource.push(key.label);
            this.jobSource = [...new Set(this.jobSource)]
          }
        }
        this.statusCheckAll(event);
      }
      else {

        this.jobSource.push(lable);
        this.jobSource = [...new Set(this.jobSource)]

      }

      if (this.activeStatus) {

        if (!this.owner) {
          if (((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('recruiterNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedJobs').value == false) {

            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('recruiterNetworkJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(true);

            this.jobSource.push("teamJobs");
            this.jobSource.push("recruiterNetworkJobs");
            this.jobSource.push("freeLancerNetworkJobs");
            this.jobSource.push("MTA Network");
            if (!this.FeaSugg) {
              this.jobSource.push("featured");
              this.jobSource.push("suggestedJobs");
            }

            this.jobSource = [...new Set(this.jobSource)]
          }
        }
        if (this.owner) {
          if (((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('recruiterNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamJobs').value == false) {

            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('recruiterNetworkJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamJobs').patchValue(true);
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(true);

            this.jobSource.push("myJobs");
            this.jobSource.push("recruiterNetworkJobs");
            if (!this.FeaSugg) {
              this.jobSource.push("featured");
              this.jobSource.push("suggestedJobs");
            }
            this.jobSource.push("freeLancerNetworkJobs");
            this.jobSource.push("mtaNetworkJobs");
            this.jobSource.push("teamJobs");
            this.jobSource = [...new Set(this.jobSource)]
          }
        }

        this.activeStatus = null;
      }
      else if (!this.activeStatus) {

        if (this.owner && this.isMyJobsShowedOnLoad) {
          if (((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('allPlatFormJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('recruiterNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamJobs').value == false) {

            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myJobs').patchValue(true);

            this.jobSource.push("myJobs");

            this.jobSource = [...new Set(this.jobSource)]
          }
        } else if (!this.isMyJobsShowedOnLoad) {
          if (((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('allPlatFormJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('recruiterNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('freeLancerNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('mtaNetworkJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('featured').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('suggestedJobs').value == false &&
            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('teamJobs').value == false) {

            ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('allPlatFormJobs').patchValue(true);
            this.jobSource.push("allPlatFormJobs");
            this.jobSource = [...new Set(this.jobSource)]
          }
        }

        this.activeStatus = null;
      }
    }

    if (event.target.checked == false) {
      if (lable != 'All') {
        this.statusCheckboxes[0].selected = false;
        if (this.jobSource.includes(lable)) {
          this.jobSource.splice(this.jobSource.indexOf(lable), 1);
        }
      }

      if (lable == 'All') {
        for (let key of this.statusCheckboxes) {
          if (this.jobSource.includes(key.label) && key.label != 'All') {
            this.jobSource.splice(this.jobSource.indexOf(key.label), 1);
            this.jobSource = [...new Set(this.jobSource)]
          }
        }
        this.statusCheckAll(event);
      }

    }
    if (this.ischeckedJobClassification && this.ischeckedJobClassificationAll) {
      event.target.checked = true
    }
    this.applyFilternew(param);
    this.updateFunction();
  }
  FeaSugg: boolean = false;

  jobSoucecheck(event, lable, param?: any) {


    this.response = []
    this.stopscrollFlag = false
    this.data1.searchAfterKey = null;
    if (event.target.checked == true) {
      if (lable == 'myJobs') {
        this.response = []
        this.obj.searchAfterKey = null;
        this.previousSearchAfterKey = null;
        this.previousSearchAfterKey1 = null;
      }
      for (let key of this.keyarrayjobsouces) {
        if (lable == 'all' && key != 'all') {
          if (key === 'myJobs' && this.owner && !this.jobSource.includes(key)) {
            this.jobSource.push(key);
            this.jobSource = [...new Set(this.jobSource)]

          } else if (key == 'teamJobs' && !this.jobSource.includes(key)) {
            this.jobSource.push(key);
            this.jobSource = [...new Set(this.jobSource)]

          } else if (key == 'recruiterNetworkJobs' && !this.jobSource.includes(key)) {
            this.jobSource.push(key);
            this.jobSource = [...new Set(this.jobSource)]

          } else if (key == 'freeLancerNetworkJobs' && !this.jobSource.includes(key)) {
            this.jobSource.push(key);
            this.jobSource = [...new Set(this.jobSource)]

          } else if (key == 'mtaNetworkJobs' && !this.jobSource.includes(key)) {
            this.jobSource.push(key);
            this.jobSource = [...new Set(this.jobSource)]

          } else if (key == 'featured' && !this.jobSource.includes(key)) {
            this.jobSource.push(key);
            this.jobSource = [...new Set(this.jobSource)]
          } else if (key == 'suggestedJobs' && !this.jobSource.includes(key)) {
            this.jobSource.push(key);
            this.jobSource = [...new Set(this.jobSource)]
          } else if (key == 'allPlatFormJobs' && this.owner && !this.jobSource.includes(key)) {
            // when platform jobs is selected it does not require other sources
            this.jobSource.push(key);
            this.jobSource = [...new Set(this.jobSource)]
          }
        } else {
          if (lable != 'all' && !this.jobSource.includes(lable)) {
            this.jobSource.push(lable);
            this.jobSource = [...new Set(this.jobSource)]
          }
          // code to remove platform jobs if filters other than platform job is chosen
          // if (lable !== 'allPlatFormJobs') {
          //   let arr: any = this.jobSource.filter(item => item !== 'allPlatFormJobs');
          //   this.jobSource = arr;
          //   this.jobSource = [...new Set(this.jobSource)];
          //   ((this.jobFilterForm.get('source') as FormArray).at(0) as FormGroup).get('allPlatFormJobs').patchValue(false);
          // }
          // else if (lable === 'allPlatFormJobs') {
          //   let arr: any = this.jobSource.filter(item => item === 'allPlatFormJobs');
          //   this.jobSource = arr;
          //   this.jobSource = [...new Set(this.jobSource)];
          //   ((this.jobFilterForm.get('source') as FormArray).at(0) as FormGroup).patchValue({
          //     allPlatFormJobs: true,
          //     myJobs: false,
          //     all: false,
          //     recruiterNetworkJobs: false,
          //     freeLancerNetworkJobs: false,
          //     mtaNetworkJobs: false,
          //     teamJobs: false,
          //     featured: false,
          //     suggestedJobs: false
          //   });
          // }
        }
      }
    }
    else if (event.target.checked == false) {
      if (lable != 'all') {
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(event.target.checked);
      }

      if (lable == 'myJobs') {
        this.response = []
        this.obj.searchAfterKey = null;
        this.data1.searchAfterKey = null;
        this.previousSearchAfterKey = null;
        this.previousSearchAfterKey1 = null;
      }
      if (lable == 'all') {
        for (let key of this.keyarrayjobsouces) {
          if (this.jobSource.includes(key)) {
            this.jobSource.splice(this.jobSource.indexOf(key), 1);
            this.jobSource = [...new Set(this.jobSource)]
          }
        }
      } else {
        if (this.jobSource.includes(lable)) {
          this.jobSource.splice(this.jobSource.indexOf(lable), 1);
        }
      }
    }

    if (lable === 'all') {
      this.jobsouceCheckedAll(event);
    }

    // console.log("Filter value " , this.jobSource);

    this.applyFilternew(param);
    this.updateFunction();
  }

  jobsouceCheckedAll(event) {
    const checked = event.target.checked;
    for (let key of this.keyarrayjobsouces) {
      ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(checked);
    }

  }

  jobclassficheckbox(event, lable, param?: any) {
    this.stopscrollFlag = false
    this.response = []
    this.obj.searchAfterKey = null;
    this.data1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;

    this.jobclasscificationCheckboxes.forEach(item => {
      if (item.label == lable) {
        item.selected = event.target.checked;
      }
    });


    if (event.target.checked == true) {
      this.ischeckedStatus = true;
      if (lable == 'All') {
        for (let key of this.jobclasscificationCheckboxes) {
          if (key.label != 'All' && !this.jobSource.includes(key)) {
            this.jobSource.push(key.label);
            this.jobSource = [...new Set(this.jobSource)]
          }
        }
        this.jobclassifiCheckAll(event);
      } else {
        if (!this.jobSource.includes(lable)) {

          this.jobSource.push(lable);
          this.jobSource = [...new Set(this.jobSource)]
        }

      }
    }
    if (event.target.checked == false) {
      if (lable != 'All') {
        this.jobclasscificationCheckboxes[0].selected = false;
        if (this.jobSource.includes(lable)) {
          this.jobSource.splice(this.jobSource.indexOf(lable), 1);
        }
      }

      if (lable == 'All') {
        for (let key of this.jobclasscificationCheckboxes) {
          if (this.jobSource.includes(key.label) && key.label != 'All') {
            this.jobSource.splice(this.jobSource.indexOf(key.label), 1);
            this.jobSource = [...new Set(this.jobSource)]
          }
        }
        this.jobclassifiCheckAll(event);
      }
    }

    if (this.ischeckedStatus && this.ischeckedStatusAll) {
      event.target.checked = true
    }
    this.filterWhenNoneJobSouce()
    this.applyFilternew(param);
    this.updateFunction();
  }

  workTypecheckboxCheckAll(event) {
    const checked = event.target.checked;
    for (let key of this.keysarrWorks) {
      ((this.jobFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(checked);
    }
  }

  workTypecheckbox(event, lable) {
    this.stopscrollFlag = false
    this.response = []
    this.obj.searchAfterKey = null;
    this.data1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;
    if (event.target.checked == true) {
      if (lable == 'all') {
        for (let key of this.keysarrWorks) {
          if (key != 'all' && !this.jobSource.includes(key)) {
            this.jobSource.push(key);
            this.jobSource = [...new Set(this.jobSource)]
          }
        }
        this.workTypecheckboxCheckAll(event);
      } else {
        if (!this.jobSource.includes(lable)) {
          this.jobSource.push(lable);
          this.jobSource = [...new Set(this.jobSource)]
        }

      }

    }

    if (event.target.checked == false) {
      if (lable == 'all') {
        for (let key of this.keysarrWorks) {
          if (this.jobSource.includes(key)) {
            this.jobSource.splice(this.jobSource.indexOf(key), 1);
            this.jobSource = [...new Set(this.jobSource)]
          }
        }
        this.workTypecheckboxCheckAll(event);
      } else {
        if (this.jobSource.includes(lable)) {
          this.jobSource.splice(this.jobSource.indexOf(lable), 1);
        }
      }


      if (lable != 'all') {
        ((this.jobFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(event.target.checked);
      }

    }
    this.filterWhenNoneJobSouce()

    this.applyFilternew();
    this.updateFunction();
  }

  stateListCA: any;
  stateListIN: any;
  stateListAU: any;
  countryList: any = [];
  onChangeCountry(event) {
    this.jobFilterForm.get('state').patchValue(null)
    this.jobFilterForm.get('city').patchValue(null)
    this.jobFilterForm.get('zipCode').patchValue(null)
    this.jobFilterForm.value.country = event;
    this.response = [];
    this.filterWhenNoneJobSouce()
    this.applyFilternew();
    if (event == "US") {
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
    this.updateFunction();
  }

  createdByypesCheckboxes = [
    { label: 'All', selected: false, control: 'all' },
    { label: 'Owner', selected: false, control: 'owner' },
    { label: 'Systems Integrator', selected: false, control: 'systemsIntergrator' },
    { label: 'Prime Vendor', selected: false, control: 'primeVendor' },
    { label: 'Vendor/ Staffing Agency', selected: false, control: 'vendorStaffingAgency' },
  ];

  createdByCheckAll(event) {
    const checked = event.target.checked;
    this.createdByypesCheckboxes.forEach(item => item.selected = checked);
  }

  onSelectCreatedBy(event, control, param?: any) {
    this.createdByypesCheckboxes.forEach(item => {
      if (item.control == control) {
        item.selected = event.target.checked;
      }
    });

    if (event.target.checked == true) {
      this.ischeckedStatus = true;
      if (control == 'all') {
        const nestedForm = this.jobFilterForm.get('organisationTypeParams') as UntypedFormGroup;
        nestedForm.patchValue({ owner: true, all: true, systemsIntergrator: true, primeVendor: true, vendorStaffingAgency: true })
        this.createdByCheckAll(event);
      } else {
        const nestedForm = this.jobFilterForm.get('organisationTypeParams') as UntypedFormGroup;
        nestedForm.get(control).patchValue(true);
        if (this.createdByypesCheckboxes[0].control == control) {
          this.createdByypesCheckboxes[0].selected = true;
        }
      }
    }
    if (event.target.checked == false) {
      if (control == 'all') {
        this.createdByCheckAll(event);
        const nestedForm = this.jobFilterForm.get('organisationTypeParams') as UntypedFormGroup;
        nestedForm.patchValue({ owner: false, all: false, systemsIntergrator: false, primeVendor: false, vendorStaffingAgency: false });
      } else {
        if (control == this.createdByypesCheckboxes[0].control) {
          this.createdByypesCheckboxes[0].selected = false;
        }
        const nestedForm = this.jobFilterForm.get('organisationTypeParams') as UntypedFormGroup;
        nestedForm.get(control).patchValue(false);
        nestedForm.get('all').patchValue(false);
      }
    }
    this.applyFilternew(param);
    this.updateFunction();
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
            this.jobFilterForm.patchValue({
              city: cityName,
              state: stateName,
            });
          });
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }

  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }

  jobclassifiCheckAll(event) {
    const checked = event.target.checked;
    this.jobclasscificationCheckboxes.forEach(item => item.selected = checked);
  }

  onChangestate(state) {
    this.jobFilterForm.value.state = state;
    this.response = [];
    this.data1.searchAfterKey = null;
    this.jobFilterForm.get('city').patchValue(null)
    this.jobFilterForm.get('zipCode').patchValue(null)
    this.updateFunction();

    this.filterWhenNoneJobSouce()
    this.applyFilternew();
  }

  onChangecity(city) {
    this.response = [];
    this.jobFilterForm.value.city = city;
    this.data1.searchAfterKey = null;
    this.jobFilterForm.get('zipCode').patchValue(null)
    this.updateFunction();
    this.filterWhenNoneJobSouce()
    this.applyFilternew();
  }

  onChangezipcode(zipcode) {
    this.response = [];
    this.jobFilterForm.value.zipCode = zipcode;
    this.data1.searchAfterKey = null;
    this.updateFunction();
    this.filterWhenNoneJobSouce()
    this.applyFilternew();
  }

  yearApplied: boolean = false
  onChangeYear(value) {

    if (value.highValue > 0) {
      this.yearApplied = true
    } else if (value.highValue == 0) {
      this.yearApplied = false
    }
    this.jobFilterForm.get('experienceFrom').patchValue(value.value);
    this.jobFilterForm.get('experienceTo').patchValue(value.highValue);
    this.filterWhenNoneJobSouce()
    this.applyFilternew();
    this.updateFunction();
    // value.value
  }
  daysApplied: boolean = false
  onChangedays(value, param?: any) {


    if (value.highValue > 0) {
      this.daysApplied = true
    } else if (value.highValue == 0) {
      this.daysApplied = false
    }
    this.jobFilterForm.get('postedFrom').patchValue(value.value);
    this.jobFilterForm.get('postedTo').patchValue(value.highValue)
    this.filterWhenNoneJobSouce()
    this.applyFilternew(param);
    this.updateFunction();
    // value.value
  }

  cancel() {
    // this.router.navigate(["newcandidates"])
  }
  // @Input() updateFromParent: any;
  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.updateFromParent && changes.updateFromParent.currentValue) {
  //     console.log("changes")
  //     console.log(changes)
  // // this.clientTypecheck({changes})
  //     // Handle updates from the parent
  //     // You can also update the state of this component based on the new data
  //   }
  // }

  resetFilternew() {
    this.value = 0;
    this.highValue = 0;
    this.value1 = 0;
    this.highValue1 = 0;
    this.jobSource = ['myJobs'];
    this.response = []
    this.obj.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;

    if (this.jobFilterForm != undefined) {
      this.jobFilterForm.get('state').patchValue(null)
      this.jobFilterForm.get('country').patchValue(null)
      this.jobFilterForm.get('city').patchValue(null)
      this.jobFilterForm.get('zipCode').patchValue(null)


      this.clientTypeCheckboxes.forEach(item => item.selected = false);
      this.statusCheckboxes.forEach(item => item.selected = false);
      this.jobclasscificationCheckboxes.forEach(item => item.selected = false);

      for (let key of this.keyarrayjobsouces) {
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(false);
      }

      for (let key of this.keysarrWorks) {
        ((this.jobFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(false);
      }

      if (this.owner && this.isMyJobsShowedOnLoad) {
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('myJobs').patchValue(true);
      } else if (!this.isMyJobsShowedOnLoad) {
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('allPlatFormJobs').patchValue(true);
      }
      // this.response = [];
      this.data1.searchAfterKey = null;
      this.data.searchAfterKey = null;
      this.applyFilternew();

    }

  }

  createjobFilterForm() {
    this.jobFilterForm = this.formBuilder.group({
      source: this.formBuilder.array([]),
      workType: this.formBuilder.array([]),
      jobClassification: null,
      clientType: null,
      status: ["Active"],
      userId: localStorage.getItem('userId'),
      country: null,
      state: null,
      city: null,
      zipCode: null,
      experienceFrom: null,
      experienceTo: null,
      postedFrom: null,
      postedTo: null,
      experienceType: 'Any (Years)',
      postedDayRange: 'Any (Posted Day)',
      organisationTypeParams: this.formBuilder.group({
        all: false,
        owner: false,
        systemsIntergrator: false,
        primeVendor: false,
        vendorStaffingAgency: false
      })
    })

    this.jobsoucefilterFrom();
    this.worktypefilterFrompush();
  }

  @Output() panelValue = new EventEmitter<any>(null);
  @Output() valuesRetainedForFilters = new EventEmitter<any>(null);
  startFilter() {
    let data: any = {}
    const jobSource = JSON.parse(localStorage.getItem('jobSource'))
    const jobForm = JSON.parse(localStorage.getItem('jobForm'))
    data.jobSource = jobSource;
    data.jobForm = jobForm
    const jsonData = JSON.stringify(data);
    this.panelValue.emit('jobs')
    this.valuesRetainedForFilters.emit(jsonData);
  }


  getCountries() {
    this.countryList = [];
    this.util.startLoader();
    this.apiService.query("country/getAllCountries").subscribe((res) => {
      this.util.stopLoader();
      if (res != undefined) {
        res.forEach((ele) => {
          this.countryList.push(ele);
        });
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  jobSourcefields(): UntypedFormGroup {
    return this.formBuilder.group({
      all: false,
      allPlatFormJobs: false,
      myJobs: false,
      teamJobs: false,
      recruiterNetworkJobs: false,
      freeLancerNetworkJobs: false,
      mtaNetworkJobs: false,
      featured: false,
      suggestedJobs: false

    });
  }

  worktypefilterFrom(): UntypedFormGroup {
    return this.formBuilder.group({
      all: false,
      remoteWork: false,
      relocationRequired: false,
      workFromHome: false
    });
  }

  worktypefilterFrompush() {
    this.workTypeFormarray.push(this.worktypefilterFrom())
  }

  get workTypeFormarray() {
    return this.jobFilterForm.get('workType') as UntypedFormArray;
  }

  clientTypeCheckedAll(event) {
    const checked = event.target.checked;
    this.clientTypeCheckboxes.forEach(item => item.selected = checked);

  }

  jobsoucefilterFrom() {
    this.jobSourcesFormarray.push(this.jobSourcefields())
  }

  applyFilternew(param?: any) {
    return;
    // console.log(param)

    this.stopscrollFlag = false;

    var statusCheckboxesUpdate: any = [];
    this.statusCheckboxes.forEach(element => {
      if (element.selected) {
        statusCheckboxesUpdate.push(element.label)
      }
    });

    var clientTypeCheckboxesUpdate: any = [];
    this.clientTypeCheckboxes.forEach(element => {
      if (element.selected) {
        clientTypeCheckboxesUpdate.push(element.label)
      }
    });

    var jobClassificationUpdate = [];
    this.jobclasscificationCheckboxes.forEach(element => {
      if (element.selected) {
        jobClassificationUpdate.push(element.label)
      }
    });


    if (!this.filterApplied) {
      const source = this.jobFilterForm.get('source').value;
      // console.log('source', source[0], this.jobFilterForm);

      this.data1.source = { ...this.jobFilterForm.value.source[0] };
      this.data1.workType = { ...this.jobFilterForm.value.workType[0] };
    }
    if (this.filterApplied) {
      this.data1.source = {
        myJobs: true,
        allPlatFormJobs: false,
        teamJobs: false,
        recruiterNetworkJobs: false,
        freeLancerNetworkJobs: false,
        mtaNetworkJobs: false,
        featured: false,
        suggestedJobs: false
      },
        this.data1.workType = { all: false, remoteWork: false, relocationRequired: false, workFromHome: false }
    }

    this.data1.searchAfterKey = null;

    this.data1.experienceFrom = this.jobFilterForm.value.experienceFrom;
    this.data1.experienceTo = this.jobFilterForm.value.experienceTo;
    this.data1.postedFrom = this.jobFilterForm.value.postedFrom;
    this.data1.postedTo = this.jobFilterForm.value.postedTo;
    this.data1.country = this.jobFilterForm.value.country;
    this.data1.state = this.jobFilterForm.value.state;
    this.data1.city = this.jobFilterForm.value.city;
    this.data1.zipCode = this.jobFilterForm.value.zipCode;
    this.data1.limit = 10;
    this.data1.userId = localStorage.getItem('userId');
    this.data1.jobClassification = jobClassificationUpdate;
    this.data1.clientType = clientTypeCheckboxesUpdate;
    this.data1.status = statusCheckboxesUpdate;
    this.data1.searchContent = this.searchContent;
    delete this.data1.searchContent;

    if (this.searchContent != "" && this.searchContent != undefined) {
      this.data1.searchContent = this.searchContent;
      this.data1.searchAfterKey = null;
    }

    if (this.jobSource.length != 0 && this.searchContent == "" || this.jobSource.length != 0 && this.searchContent == undefined) {
      this.data1.searchAfterKey = null
      localStorage.setItem('jobSource', JSON.stringify(this.jobSource));
      localStorage.setItem('jobForm', JSON.stringify(this.data1));
    } else if (this.searchContent != "" && this.searchContent != undefined) {
      this.data1.searchAfterKey = null
      localStorage.setItem('jobSource', JSON.stringify(this.jobSource));
      localStorage.setItem('jobForm', JSON.stringify(this.data1));
    }
    if (this.jobSource.length == 0) {
      this.data1.searchAfterKey = null
      localStorage.setItem('jobSource', JSON.stringify(this.jobSource));
      localStorage.setItem('jobForm', JSON.stringify(this.data1));
    }


  }

  statusCheckAll(event) {
    const checked = event.target.checked;
    this.statusCheckboxes.forEach(item => item.selected = checked);
  }

  removeEntity(value, index) {
    if (this.filterApplied != true) {
      this.jobSource.splice(index, 1);
      if (this.keyarrayjobsouces.includes(value)) {
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(false);
        ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(value).patchValue(false);
      }
      if (this.keysarrWorks.includes(value)) {
        ((this.jobFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get('all').patchValue(false);
        ((this.jobFilterForm.get('workType') as UntypedFormArray).at(0) as UntypedFormGroup).get(value).patchValue(false);
      }

      this.clientTypeCheckboxes.forEach(element => {
        if (element.selected && element.label == value) {
          element.selected = false;
          this.clientTypeCheckboxes[0].selected = false
        }
      });

      this.statusCheckboxes.forEach(element => {
        if (element.selected && element.label == value) {
          element.selected = false;
          this.statusCheckboxes[0].selected = false
        }
      });

      this.jobclasscificationCheckboxes.forEach(element => {
        if (element.selected && element.label == value) {
          element.selected = false;
          this.jobclasscificationCheckboxes[0].selected = false
        }
      });

      if (value == 'myJobs') {
        // this.response = []
        this.obj.searchAfterKey = null;
        this.data1.searchAfterKey = null;
        this.previousSearchAfterKey = null;
        this.previousSearchAfterKey1 = null;
      }
      // this.applyFilternew();
    }

    // this.receiveFilterData.unsubscribe();

  }


  onMenuItemClick(event, param?: any): void {
    event.stopPropagation();

    if (param != null) {
      // this.meunTrigger.closeMenu();
    }
  }

}
