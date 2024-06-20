import { ModalOptions } from "ngx-bootstrap/modal";
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { formatDate } from "@angular/common";
import { AppSettings } from 'src/app/services/AppSettings';
import { ApiService } from 'src/app/services/api.service';
import { CommonValues } from 'src/app/services/commonValues';
import { UtilService } from 'src/app/services/util.service';
import { JobModel } from 'src/app/services/jobModel';
import { JobService } from "src/app/services/job.service";
import { GigsumoConstants, USER_TYPE } from "src/app/services/GigsumoConstants";
import { Callback } from "src/shared/interfaces/Callback";
import { CommunicationService } from "src/shared/services/CommunicationService";

@Component({
  selector: 'app-job-filter-template',
  templateUrl: './job-filter-template.component.html',
  styleUrls: ['./job-filter-template.component.scss']
})
export class JobFilterTemplateComponent implements OnInit, OnChanges,Callback  {
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
  jobFilterForm: UntypedFormGroup;
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

  // createdByypesCheckboxes = [
  //   { label: 'All', selected: false, control: 'all' },
  //   { label: 'Owner', selected: false, control: 'owner' },
  //   { label: 'Systems Integrator', selected: false, control: 'systemsIntergrator' },
  //   { label: 'Prime Vendor', selected: false, control: 'primeVendor' },
  //   { label: 'Vendor/ Staffing Agency', selected: false, control: 'vendorStaffingAgency' },
  // ];

  statusCheckboxes = [
    { label: 'All', selected: false, disable: false },
    { label: 'Draft', selected: false, disable: false },
    { label: 'Active', selected: true, disable: false },
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
  isEnabled: boolean=false;


  constructor(private formBuilder: UntypedFormBuilder,private util: UtilService, private apiService: ApiService,
    private jobService: JobService, private commonvalues: CommonValues,private communicationService: CommunicationService) {
    this.userType = localStorage.getItem('userType')
    this.receiveFilterData = this.jobService.getDataForFilter().subscribe(data => {
      if (data) {
        this.removeEntity(data.value, data.index);
      }
    })

    this.commonvalues.currentData.subscribe(data => {
      this.isEnabled = data;
    });

  }

   executeMethod(data: string): void {
    this.sourceCount= 0;
    this.clientTypeCount= 0;
    this.engagementTypeCount=0;
    this.statusCount= 0;
    this.postedByCount= 0;
  }




  sourceCount: number;
  clientTypeCount: number;
  engagementTypeCount: number;
  statusCount: number;
  postedByCount: number;

  ngOnChanges(changes: SimpleChanges): void {
    this.createjobFilterForm();
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

      //clientType count starts here
      const keyValuePairs1: Record<string, boolean> = {};
      data.clientTypeCheckedItems.forEach(item => {
        keyValuePairs1[item.label] = item.selected;
      });

      const keyCounts1 = Object.values(keyValuePairs1).reduce((count, item) => {
        return count + (item ? 1 : 0);
      }, 0);

      this.clientTypeCount = keyCounts1;
      //clientType count ends here

      // jobclassification / engagement type count starts here
      const keyValuePairs2: Record<string, boolean> = {};
      data.jobClassifications.forEach(item => {
        keyValuePairs2[item.label] = item.selected;
      });

      const keyCounts2 = Object.values(keyValuePairs2).reduce((count, item) => {
        return count + (item ? 1 : 0);
      }, 0);

      this.engagementTypeCount = keyCounts2;
      // jobclassification / engagement type count ends here

      // status count starts here
      const keyValuePairs3: Record<string, boolean> = {};
      data.statusCheckedItems.forEach(item => {
        keyValuePairs3[item.label] = item.selected;
      });

      const keyCounts3 = Object.values(keyValuePairs3).reduce((count, item) => {
        return count + (item ? 1 : 0);
      }, 0);

      this.statusCount = keyCounts3;
      // status count ends here

      let trueCount = 0;
      const data1 = data.formData.organisationTypeParams;
      for (const key in data1) {
        if (Object.prototype.hasOwnProperty.call(data1, key) && data1[key] === true) {
          trueCount++;
        }
      }
      this.postedByCount = trueCount;

      // posted by count ends here
      // fetching filter number ends here

      this.jobFilterForm.patchValue(data.formData);
      this.jobSource = data.checkedItems;
      this.clientTypeCheckboxes = data.clientTypeCheckedItems;
      this.statusCheckboxes = data.statusCheckedItems;
      this.jobclasscificationCheckboxes = data.jobClassifications;
      this.value1 = data.formData.postedFrom != null ? data.formData.postedFrom : 0;
      this.highValue1 = data.formData.postedTo != null ? data.formData.postedTo : 0;
      // this.FilterForm.patchValue({
      //   jobSource: this.getSelected("JOB_SOURCE"),
      //   clientType: this.getSelected("CLIENT_TYPE"),
      //   engagementType: this.getSelected("ENGAGEMENT_TYPE"),
      //   status: this.getSelected("STATUS"),
      //   postedDayRange: this.getSelected("POSTED_DAY"),
      //   organisationTypeParams: this.getSelected("CREATED_BY_TYPES"),
      //   experienceType: this.getSelected("EXPERIENCE_RANGE"),

      // })
    }
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
    scrollContainer.scrollLeft -= 1000; // Adjust the scroll amount as needed
  }

  scrollRight() {
    const scrollContainer = document.getElementById('scrollContainer');
    scrollContainer.scrollLeft += 1000; // Adjust the scroll amount as needed
  }

  subscribe: Subscription
  // counter: number = 0


  // @ViewChild('jobSource', { static: false }) jobSource1: ElementRef;
  // @ViewChild('engagementType', { static: false }) engagementType1: ElementRef;
  // @ViewChild('status', { static: false }) status1: ElementRef;
  // @ViewChild('postedDayRange', { static: false }) postedDayRange1: ElementRef;
  // @ViewChild('experienceType', { static: false }) experienceType1: ElementRef;
  // @ViewChild('organisationTypeParams', { static: false }) organisationTypeParams: ElementRef;
  // calculateInputWidth(value): number {
  //   const text = this.FilterForm.get(value).value;
  //   const spanElement = document.createElement('span');
  //   spanElement.style.visibility = 'hidden';
  //   spanElement.style.position = 'absolute';
  //   spanElement.style.whiteSpace = 'nowrap';
  //   spanElement.innerText = text;
  //   document.body.appendChild(spanElement);
  //   const width = spanElement.offsetWidth;
  //   document.body.removeChild(spanElement);
  //   console.log(value + width + "this is the width everyone")
  //   return width;
  //   // if (value == 'jobSource' && this.jobSource1) {
  //   //   // const inputElement = this.jobSource1.nativeElement;
  //   // }
  //   // if (value == 'engagementType' && this.engagementType1) {
  //   //   const textWidthMeasurer = this.engagementType1.nativeElement;
  //   //   textWidthMeasurer.innerText = this.FilterForm.get(value).value;
  //   //   console.log(textWidthMeasurer.offsetWidth + "engagementtextWidthMeasurer.offsetWidth")
  //   //   return textWidthMeasurer.offsetWidth;
  //   // }
  //   // if (value == 'status' && this.status1) {
  //   //   const textWidthMeasurer = this.status1.nativeElement;
  //   //   textWidthMeasurer.innerText = this.FilterForm.get(value).value;
  //   //   return textWidthMeasurer.offsetWidth;
  //   // }
  //   // if (value == 'postedDayRange' && this.postedDayRange1) {
  //   //   const textWidthMeasurer = this.postedDayRange1.nativeElement;
  //   //   textWidthMeasurer.innerText = this.FilterForm.get(value).value;
  //   //   return textWidthMeasurer.offsetWidth;
  //   // }
  //   // if (value == 'experienceType' && this.experienceType1) {
  //   //   const textWidthMeasurer = this.experienceType1.nativeElement;
  //   //   textWidthMeasurer.innerText = this.FilterForm.get(value).value;
  //   //   return textWidthMeasurer.offsetWidth;
  //   // }
  //   // if (value == 'organisationTypeParams' && this.organisationTypeParams) {
  //   //   const textWidthMeasurer = this.organisationTypeParams.nativeElement;
  //   //   textWidthMeasurer.innerText = this.FilterForm.get(value).value;
  //   //   return textWidthMeasurer.offsetWidth;
  //   // }

  // }

  @Input() valuesSentForFilters: any;
  lablechangeclienttype: string = '';

  ngOnInit() {
    this.communicationService.setCallback(this)
    this.updateJobFilterData();
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

  isBench(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.BENCH_RECRUITER);
  }

  isRecruiter(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.RECRUITER);
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
          formData: this.jobFilterForm.getRawValue(),
          checkedItems: this.jobSource,
          jobClassifications: this.jobclasscificationCheckboxes,
          statusCheckedItems: this.statusCheckboxes,
          clientTypeCheckedItems: this.clientTypeCheckboxes,
          // createdByTypeCheckedItems: this.createdByypesCheckboxes,
          from: "HORIZANTAL"
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


  POSTED_ANY = GigsumoConstants.POSTED_ANY;
  POSTED_TODAY = GigsumoConstants.POSTED_TODAY;
  POSTED_LAST_7_DAYS = GigsumoConstants.POSTED_LAST_7_DAYS;
  POSTED_LAST_14_DAYS = GigsumoConstants.POSTED_LAST_14_DAYS;
  POSTED_LAST_30_DAYS = GigsumoConstants.POSTED_LAST_30_DAYS;

  POSTED_BY_ANY = GigsumoConstants.POSTED_BY_ANY;
  POSTED_BY_EMPLOYER = GigsumoConstants.POSTED_BY_EMPLOYER;
  POSTED_BY_SYSTEMS_INTEGRATOR = GigsumoConstants.POSTED_BY_SYSTEMS_INTEGRATOR;
  POSTED_BY_PRIME_VENDOR = GigsumoConstants.POSTED_BY_PRIME_VENDOR;
  POSTED_BY_VENDOR_OR_STAFFING_AGENCY = GigsumoConstants.POSTED_BY_VENDOR_OR_STAFFING_AGENCY;

  EXPERIENCE_ANY = GigsumoConstants.EXPERIENCE_ANY;
  EXPERIENCE_JUNIOR = GigsumoConstants.EXPERIENCE_JUNIOR;
  EXPERIENCE_MID_LEVEL = GigsumoConstants.EXPERIENCE_MID_LEVEL;
  EXPERIENCE_SENIOR = GigsumoConstants.EXPERIENCE_SENIOR;
  EXPERIENCE_ARCHITECT = GigsumoConstants.EXPERIENCE_ARCHITECT;

  onPostedDaysChange(content : string) {


    if (content === GigsumoConstants.POSTED_TODAY) {
      this.jobFilterForm.patchValue({ postedFrom: 1, postedTo: 1 });
    } else if (content === GigsumoConstants.POSTED_LAST_7_DAYS) {
      this.jobFilterForm.patchValue({ postedFrom: 1, postedTo: 7 });
    } else if (content === GigsumoConstants.POSTED_LAST_14_DAYS) {
      this.jobFilterForm.patchValue({ postedFrom: 1, postedTo: 14 });
    } else if (content === GigsumoConstants.POSTED_LAST_30_DAYS) {
      this.jobFilterForm.patchValue({ postedFrom: 1, postedTo: 30 });
    } else {
      this.jobFilterForm.patchValue({ postedFrom: null, postedTo: null });
    }

    this.updateFunction();
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
      for (let key of this.keyarrayjobsouces) {
        if (lable === 'all' && key != 'all') {
          if (key === 'myJobs' && this.owner && !this.jobSource.includes(key)) {
            this.jobSource.push(key);
            this.jobSource = [...new Set(this.jobSource)];
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
            this.jobSource = [...new Set(this.jobSource)];
            // this.jobSourcesFormarray.at(0).get(lable).patchValue(true);
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

    // console.log("Filter value ", this.jobSource);

    this.applyFilternew(param);
    this.updateFunction();
  }


  onSelectCreatedBy(event, control, param?: any) {
    this.stopscrollFlag = false
    this.response = []
    this.obj.searchAfterKey = null;
    this.data1.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.previousSearchAfterKey1 = null;

    // this.createdByypesCheckboxes.forEach(item => {
    //   if (item.control == control) {
    //     item.selected = event.target.checked;
    //   }
    // });

    if (event.target.checked == true) {
      this.ischeckedStatus = true;
      if (control == 'all') {
        const nestedForm = this.jobFilterForm.get('organisationTypeParams') as UntypedFormGroup;
        nestedForm.patchValue({ owner: true, all: true, systemsIntergrator: true, primeVendor: true, vendorStaffingAgency: true })
        this.createdByCheckAll(event);
      } else {
        const nestedForm = this.jobFilterForm.get('organisationTypeParams') as UntypedFormGroup;
        nestedForm.get(control).patchValue(true)
        // if (this.createdByypesCheckboxes[0].control == control) {
        //   this.createdByypesCheckboxes[0].selected = true;
        // }
      }
    }
    if (event.target.checked == false) {
      if (control == 'all') {
        this.createdByCheckAll(event);
        const nestedForm = this.jobFilterForm.get('organisationTypeParams') as UntypedFormGroup;
        nestedForm.patchValue({ owner: false, all: false, systemsIntergrator: false, primeVendor: false, vendorStaffingAgency: false });
      } else {
        // if (control == this.createdByypesCheckboxes[0].control) {
        //   this.createdByypesCheckboxes[0].selected = false;
        // }
        const nestedForm = this.jobFilterForm.get('organisationTypeParams') as UntypedFormGroup;
        nestedForm.get(control).patchValue(false);
        nestedForm.get('all').patchValue(false);
      }
    }
    this.applyFilternew(param);
    this.updateFunction();
  }

  onExperienceValueChange(content : any) {
    console.log("SELECTEDVALUE is HERE" , content);
    if (content === GigsumoConstants.EXPERIENCE_JUNIOR) {
      this.jobFilterForm.patchValue({ experienceFrom: 1, experienceTo: 3 });
    } else if (content === GigsumoConstants.EXPERIENCE_MID_LEVEL) {
      this.jobFilterForm.patchValue({ experienceFrom: 4, experienceTo: 6 });
    } else if (content === GigsumoConstants.EXPERIENCE_SENIOR) {
      this.jobFilterForm.patchValue({ experienceFrom: 6, experienceTo: 10 });
    } else if (content === GigsumoConstants.EXPERIENCE_ARCHITECT) {
      this.jobFilterForm.patchValue({ experienceFrom: 10, experienceTo: 20 });
    } else {
      this.jobFilterForm.patchValue({ experienceFrom: null, experienceTo: null });
    }
    this.updateFunction();
  }

  jobsouceCheckedAll(event) {
    const checked = event.target.checked;
    for (let key of this.keyarrayjobsouces) {
      ((this.jobFilterForm.get('source') as UntypedFormArray).at(0) as UntypedFormGroup).get(key).patchValue(checked);
    }

  }


  jobSourceItems: Array<string> = ["Jobs From Platform", "All", "My Jobs", "Recruiter Network",
    "Freelancer Network", "MTA Network", "Team Jobs", "Featured Jobs", "Suggested Jobs"]

  getSelected(content: string): string {
    if (content === "JOB_SOURCE") {
      const data = this.jobFilterForm.get('source') as UntypedFormArray;
      let datas = [];
      Object.keys((data.at(0) as UntypedFormGroup).controls).forEach((ele: any) => {
        if (data.at(0).get(ele).value) {
          datas.push(ele);
        }
      });
      return (datas && datas.length > 0) ? this.pickSmall(datas[0]) : "Job Source";
    }
    else if (content === "STATUS") {
      const data = this.statusCheckboxes.filter(ele => ele.selected === true)
      return (data && data.length > 0) ? data[0].label : "Status";
    }
    else if (content === "CLIENT_TYPE") {
      const data = this.clientTypeCheckboxes.filter(ele => ele.selected === true);
      return (data && data.length > 0) ? data[0].label : "Client Type";
    }
    else if (content === "ENGAGEMENT_TYPE") {
      const data = this.jobclasscificationCheckboxes.filter(ele => ele.selected === true)
      return (data && data.length > 0) ? data[0].label : "Engagement Type";
    } else if (content == "POSTED_DAY") {
      return this.jobFilterForm.get('postedDayRange').value;
    } else if (content == "CREATED_BY_TYPES") {
      // const data = this.createdByypesCheckboxes.filter(ele => ele.selected === true)
      // return (data && data.length > 0) ? data[0].label : "Posted By";
    } else if (content == "EXPERIENCE_RANGE") {
      return this.jobFilterForm.get('experienceType').value;
    }
    return null;
  }


  pickSmall(val: string): string {
    let jobSourceItems: Array<string> = ["Jobs From Platform", "All", "My Jobs", "Recruiter Network",
      "Freelancer Network", "MTA Network", "Team Jobs", "Featured Jobs", "Suggested Jobs"];

    return jobSourceItems.find(x => {
      if (val === "allPlatFormJobs") {
        val = "Jobs From Platform".toLowerCase().replace(/\s/g, '');
      }
      else if (x === "Freelancer Network") {
        x = "Freelancer Network Jobs".toLowerCase().replace(/\s/g, '');
      }
      else if (x === "MTA Network") {
        x = "MTA Network Jobs".toLowerCase().replace(/\s/g, '');
      }
      else if (val === "featured") {
        val = "Featured Jobs".toLowerCase().replace(/\s/g, '');
      }
      else if (x === "suggestedJobs") {
        x = "Suggested Jobs".toLowerCase().replace(/\s/g, '');
      }
      else if (x === "Recruiter Network") {
        x = "Recruiter Network Jobs".toLowerCase().replace(/\s/g, '');
      }

      // console.log("coming value  ", val, x.toLowerCase().replace(/\s/g, ''));
      return x.toLowerCase().replace(/\s/g, '') === (val && val.toLowerCase());
    });
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

    this.applyFilternew()
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

  createdByCheckAll(event) {
    const checked = event.target.checked;
    // this.createdByypesCheckboxes.forEach(item => item.selected = checked);
  }

  onChangestate(state) {
    this.jobFilterForm.value.state = state;
    this.response = [];
    this.data1.searchAfterKey = null;
    this.jobFilterForm.get('city').patchValue(null)
    this.jobFilterForm.get('zipCode').patchValue(null)
    this.filterWhenNoneJobSouce()
    this.applyFilternew();
  }

  onChangecity(city) {
    this.response = [];
    this.jobFilterForm.value.city = city;
    this.data1.searchAfterKey = null;
    this.jobFilterForm.get('zipCode').patchValue(null)
    this.filterWhenNoneJobSouce()
    this.applyFilternew();
  }

  onChangezipcode(zipcode) {
    this.response = [];
    this.jobFilterForm.value.zipCode = zipcode;
    this.data1.searchAfterKey = null;
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
    this.jobFilterForm.value.experienceFrom = value.value
    this.jobFilterForm.value.experienceTo = value.highValue
    this.filterWhenNoneJobSouce()
    this.applyFilternew();
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
      status: null,
      userId: localStorage.getItem('userId'),
      country: null,
      state: null,
      city: null,
      zipCode: null,
      experienceFrom: null,
      experienceTo: null,
      postedFrom: null,
      postedTo: null,
      postedDayRange: 'Any (Days)',
      experienceType: 'Any (Years)',
      organisationTypeParamsContent : 'Posted By',
      jobSourceContent: 'Job Source',
      clientTypeContent: 'Client Type',
      engagementTypeContent: 'Engagement Type',
      statusContent: 'Status',
      postedDayRangeContent: 'Posted (Days)',
      experienceTypeContent: 'Experience (Years)',
      organisationTypeParams: this.formBuilder.group({
        all: false,
        owner: false,
        systemsIntergrator: false,
        primeVendor: false,
        vendorStaffingAgency: false
      })
    });


    this.jobsoucefilterFrom();
    this.worktypefilterFrompush();
    // this.createCreatedByFormArray();
  }



  // get createdByFormArray() {
  //   const formArray = this.jobFilterForm.get('organisationTypeParams') as FormArray;
  //   return formArray;
  // }

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

  // get organisationTypeParams(): FormGroup {
  //   return this.jobFilterForm.get('organisationTypeParams') as FormGroup;
  // }

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

  // createCreatedByFormArray() {
  //   const formArray = this.jobFilterForm.get('organisationTypeParams') as FormArray;
  //   formArray.push(this.constructCreatedByFormArray());
  // }

  // constructCreatedByFormArray(): FormGroup {
  //   return this.formBuilder.group({
  //     all: false,
  //     owner: false,
  //     systemsIntergrator: false,
  //     primeVendor: false,
  //     vendorStaffingAgency: false
  //   })
  // }

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
    console.log(param)

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

    // if (param == 'horizontal') {
    //   console.log("passedthorughtthis")
    //   this.startFilter();
    // }

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
