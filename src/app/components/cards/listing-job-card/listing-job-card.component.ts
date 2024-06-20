import { JobModel } from './../../../services/jobModel';
import { NewCandidateComponent } from './../../../page/homepage/candidate/new-candidate/new-candidate.component';
import { SearchData } from 'src/app/services/searchData';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl } from "@angular/forms";
import { CommonValues } from './../../../services/commonValues';
import { Component, Input, OnInit, Output, EventEmitter, ViewChildren, QueryList, ElementRef, OnChanges, SimpleChanges, Directive, Renderer2, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreditModelComponent } from '../../credit/credit-model/credit-model.component';
import { element } from 'protractor';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, DatePipe, formatDate } from '@angular/common';
import { BehaviorSubject, Subscription, from, fromEvent } from 'rxjs';
import { FormValidation } from 'src/app/services/FormValidation';
import { candidateModel } from 'src/app/services/candidateModel';
import { debug } from 'console';
import { UtilService } from 'src/app/services/util.service';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
declare var $: any;

interface SelectAllCandidate {
  val: string,
  flag: boolean
}
interface effectiveForm {
  effectiveDate: string | Date | null,
  effectiveUntil: string | Date | null
  effectiveFor: string
  jobId: string
}

@Component({
  selector: 'app-listing-job-card',
  templateUrl: './listing-job-card.component.html',
  styleUrls: ['./listing-job-card.component.scss']
})
export class ListingJobCardComponent extends FormValidation implements OnInit, OnChanges, OnDestroy {
  deactivateEffectiveForm: UntypedFormGroup;

  @ViewChild('effective', { static: true }) effetiveEle: ElementRef;
  @Input() deactivatedList: Array<JobModel | candidateModel>;
  @Input() ListingContent: any;
  @Input() totalCreditPoints: any;
  url = AppSettings.photoUrl;
  @Input() profileData: any;
  @Input() disableSelectAll: boolean;
  @Output() Candidatecredits = new EventEmitter<any>();
  @Output() Jobcredits = new EventEmitter<any>();
  @Output() listfOfCandidates = new EventEmitter<{ value: any, flag: string }>();
  @Output() listfOfJob = new EventEmitter<{ value: any, flag: string }>();
  @Output() dataInValid = new EventEmitter<boolean>();
  @ViewChildren('jobCheck') jobCheckBoxes: QueryList<ElementRef> | any;
  @ViewChildren('candCheck') candCheckBoxes: QueryList<ElementRef> | any;



  pasDatehide: any;
  GigsumoConstant = GigsumoConstants;
  effectiveUntilmaxDate: Array<Date> = [];
  effectiveFromminDate: Array<Date> = [];
  unit: Array<any> = [];
  bsModalRef: BsModalRef
  totalPoints
  trigegrApi = new BehaviorSubject('null');
  effectiveFormArray: Array<effectiveForm> = [];
  efftiveselecteddate: string | Date;

  constructor(private api: ApiService, private util: UtilService,
    private modalService: BsModalService, private searchdata: SearchData, private formBuilder: UntypedFormBuilder,
    private router: Router, private candidate: NewCandidateComponent, private cdr: ChangeDetectorRef) {
    super();
  }
  selectAllSubscription: Subscription;
  ngOnDestroy(): void {
    if (this.selectAllSubscription) {
      this.selectAllSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.totalCreditPoints != null || changes.totalCreditPoints != undefined) {
      const updatedCredits: number = changes.totalCreditPoints.currentValue - changes.totalCreditPoints.previousValue;
      let sum = 0;
      if (this.ListingContent === 'JOB') {
        this.creditsTobeConsumedJob.map(item => sum += item.credits);
      }
      else if (this.ListingContent === 'CANDIDATE') {
        this.creditsTobeConsumedCand.map(item => sum += item.credits);
      }
      this.availablepoints = this.availablepoints + updatedCredits;
      this.tempAvailablePoints = changes.totalCreditPoints.currentValue;
    }

  }

  updateEffectiveUntil(effectiveFor: string, index: number) {
    let jobunitdate = new Date(this.effectiveArray.at(index).value.effectiveDate);
    jobunitdate.setDate(jobunitdate.getDate() + +effectiveFor);
    this.effectiveArray.at(index).get('effectiveUntil').patchValue(jobunitdate);
    this.effectiveArray.at(index).get('effectiveFor').patchValue('0');
    this.changeEffectiveUntil(jobunitdate, index, 'Select Date')
  }
  effectivFordetails: Array<string> = ['30', '7', '15'];

  updatingEffectiveForms(element: JobModel | candidateModel, index: number, serverDate: Date) {
    console.log('job', element, index, serverDate);

    const effectiveDateconversion: Date = this.util.dateFormatestring(String(element.effectiveDate));
    const effectiveUntilconversion: Date = this.util.dateFormatestring(String(element.effectiveUntil));
    const effectiveUntilcheck: boolean = super.dateInFuture(new Date(element.effectiveUntil));
    const effectiveFor = String(element.effectiveFor);


    if (element.status === 'INACTIVE_DUE_TO_LOW_CREDITS') {

      this.effectiveArray.at(index).get('effectiveDate').patchValue((effectiveUntilcheck) ? effectiveDateconversion : serverDate);
      this.effectiveArray.at(index).get('effectiveUntil').patchValue(effectiveUntilcheck ? effectiveUntilconversion : serverDate);
      this.effectiveArray.at(index).get('effectiveFor').patchValue(this.effectivFordetails.includes(effectiveFor) ? effectiveFor : '0');
      this.unit[index].duration = this.effectivFordetails.includes(effectiveFor) ? effectiveFor : '0';
      this.effectiveFromminDate.push((effectiveUntilcheck) ? effectiveDateconversion : serverDate);
      this.effectiveUntilmaxDate.push(serverDate);
      this.updateEffectiveUntil(effectiveFor != '0' ? String(+effectiveFor - 1) : '0', index);
      this.cdr.detectChanges();
    }
    else {
      this.effectiveArray.at(index).get('effectiveDate').patchValue(new Date(serverDate));
      this.effectiveArray.at(index).get('effectiveUntil').patchValue(new Date(serverDate));
      this.effectiveArray.at(index).get('effectiveFor').patchValue(this.effectivFordetails.includes(effectiveFor) ? effectiveFor : '0');
      this.unit[index].duration = this.effectivFordetails.includes(effectiveFor) ? effectiveFor : '0';
      this.updateEffectiveUntil(effectiveFor != '0' ? String(+effectiveFor - 1) : '0', index);
      this.effectiveFromminDate.push(serverDate);
      this.effectiveUntilmaxDate.push(serverDate);
    }
  }

  tempAvailablePoints: number;
  serverTimeZone: Date;
  ngOnInit() {
    const serverDate: Date | null = this.util.dateFormatestring(String(this.profileData.data.currentTime));
    this.serverTimeZone = this.util.dateFormatestring(String(this.profileData.data.currentTime));

    this.deactivateEffectiveForm = this.formBuilder.group({
      effectiveArray: this.formBuilder.array([]),
    });
    this.deactivatedList.forEach((ele: JobModel | candidateModel, index: number) => {


      if (this.ListingContent === 'JOB') {
        this.unit.push({ duration: '0' });
        this.effectiveArray.push(this.jobpushField(ele.jobId));
        this.updatingEffectiveForms(ele, index, serverDate);
      }
      else if (this.ListingContent === 'CANDIDATE') {
        this.unit.push({ duration: '0' });
        this.effectiveArray.push(this.candidatepushField(ele.candidateId));
        this.updatingEffectiveForms(ele, index, serverDate);
      }

    });

    console.log("ef", this.effectiveArray);

    this.pasDatehide = new Date();
    this.selectAllSubscription = this.searchdata.selectAll$.subscribe((response: SelectAllCandidate) => {

      if (response.val === "selectAll" && response.flag) {
        this.selectAll(response.flag);
        $('#selectAll').prop('checked', true);
      }
      else if (response.val === "deselectAll" && !response.flag) {
        this.selectAll(response.flag);
        $('#selectAll').prop('checked', false);
      }
    });
    let res: any = {}
    res = this.profileData;
    this.totalPoints = this.deactivatedList[0].totalpoints;
    this.availablepoints = res.data.creditPoints == 0 ? 0 : res.data.creditPoints;
    this.tempAvailablePoints = res.data.creditPoints == 0 ? 0 : res.data.creditPoints;

    this.effectiveArray.valueChanges.subscribe((element) => {
      this.dataInValid.emit(this.effectiveArray.valid);
      console.log(this.effectiveArray);
    })
  }

  jobpushField(jobId: string = null): UntypedFormGroup {
    return this.formBuilder.group({
      jobId: jobId,
      effectiveDate: new UntypedFormControl(null, Validators.required),
      effectiveFor: new UntypedFormControl(""),
      effectiveUntil: new UntypedFormControl(null, Validators.required),
    })
  }

  candidatepushField(candidateId: string = null): UntypedFormGroup {
    return this.formBuilder.group({
      candidateId: candidateId,
      effectiveDate: new UntypedFormControl(null, Validators.required),
      effectiveFor: new UntypedFormControl(""),
      effectiveUntil: new UntypedFormControl(null, Validators.required),
    })
  }

  get effectiveArray() {
    return (<UntypedFormArray>this.deactivateEffectiveForm.get('effectiveArray'));
  }

  callEffective(jobId: string, val: any) {
    console.log("jobId", jobId, val);
  }

  changeEffectiveDate(selecteddate: string, index: number = 0, event: any | undefined) {

    if (event === "Select Date") {

      let date1: any = new Date(selecteddate);
      let date2: any = new Date(selecteddate);
      const cuurenteffectiveFor = this.effectiveArray.at(index).get('effectiveFor').value;

      let temp = this.formatDates(date1);
      date1 = new Date(temp);
      this.efftiveselecteddate = new Date(selecteddate);
      let temp2 = this.formatDates(date2);
      date2 = new Date(temp);

      if (cuurenteffectiveFor == "7") {
        date2.setDate(date2.getDate() + 6);
        this.unit[index].duration = '7';
        let time_difference = date2.getTime() - date1.getTime();
        let days_difference: any = time_difference / (1000 * 3600 * 24);
        let stringconvert = days_difference.toString();
        this.effectiveArray.at(index).get('effectiveUntil').patchValue(date2);
        this.effectiveArray.at(index).get('effectiveFor').patchValue('7');
        this.changeEffectiveUntil(date2, index, 'Select Date');

      } else if (cuurenteffectiveFor == "15") {
        date2.setDate(date2.getDate() + 14);
        this.unit[index].duration = '15';
        let time_difference = date2.getTime() - date1.getTime();
        let days_difference: any = time_difference / (1000 * 3600 * 24);
        let stringconvert = days_difference.toString();

        this.effectiveArray.at(index).get('effectiveUntil').patchValue(date2);
        this.effectiveArray.at(index).get('effectiveFor').patchValue('15');
        this.changeEffectiveUntil(date2, index, 'Select Date');

      } else if (cuurenteffectiveFor == "30") {
        date2.setDate(date2.getDate() + 29);
        this.unit[index].duration = '30';
        let time_difference = date2.getTime() - date1.getTime();
        let days_difference: any = time_difference / (1000 * 3600 * 24);

        let stringconvert = days_difference.toString();
        this.effectiveArray.at(index).get('effectiveUntil').patchValue(date2);
        this.effectiveArray.at(index).get('effectiveFor').patchValue('30');
        this.changeEffectiveUntil(date2, index, 'Select Date')

      } else {

        this.unit[index].duration = '0';
        // console.log('eff' , selecteddate);
        this.effectiveArray.at(index).get('effectiveUntil').reset();
        this.effectiveArray.at(index).get('effectiveUntil').setValidators([Validators.required]);
        this.effectiveArray.at(index).get('effectiveUntil').updateValueAndValidity();
        this.effectiveArray.at(index).get('effectiveFor').patchValue('0');
      }

    }


  }

  CurrentDate = new Date();
  formatDates(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;

    }

    return [year, month, day].join('/');
  }

  changeEffectiveUntil(selecteddate: string | Date, index: number = 0, event: any | undefined) {
    let date1: any;

    if (event === "Select Date") {

      if (this.efftiveselecteddate == null) {
        date1 = new Date(this.effectiveArray.at(index).value.effectiveDate);
      } else {
        date1 = new Date(this.efftiveselecteddate);
      }
      let date2: any = new Date(selecteddate);

      let date_f = this.formatDates(date1);
      let date_2f = this.formatDates(date2);

      date1 = new Date(date_f);
      date2 = new Date(date_2f);

      let time_difference = date2.getTime() - date1.getTime();
      let days_difference: any = time_difference / (1000 * 3600 * 24);
      if (days_difference == 6) {
        this.unit[index].duration = "7";
        this.effectiveArray.at(index).get('effectiveFor').patchValue('7');
      }
      else if (days_difference == 14) {
        this.unit[index].duration = "15";
        this.effectiveArray.at(index).get('effectiveFor').patchValue('15');
      }
      else if (days_difference == 29) {
        this.unit[index].duration = "30";
        this.effectiveArray.at(index).get('effectiveFor').patchValue('30');
      }
      else {
        this.unit[index].duration = "0";
        this.effectiveArray.at(index).get('effectiveFor').patchValue('0');
      }


    }

  }

  changeEffectiveFor(selecteddate: string, index: number = 0) {

    let date1;
    let date2;
    let jobunitdate;

    date1 = new Date(this.effectiveArray.at(index).value.effectiveDate);
    date2 = new Date(this.effectiveArray.at(index).value.effectiveDate);


    if (selecteddate == "7") {
      date2.setDate(date2.getDate() + 7);
    } else if (selecteddate == "15") {
      date2.setDate(date2.getDate() + 15);
    } else if (selecteddate == "30") {
      date2.setDate(date2.getDate() + 30);
    }
    else if (selecteddate == "0") {
      date2.setDate(date2.getDate() + 1);
    }
    let date_f = this.formatDates(date1);
    let date_2f = this.formatDates(date2);

    date1 = new Date(date_f);
    date2 = new Date(date_2f);

    let time_difference = date2.getTime() - date1.getTime();
    let days_difference: any = time_difference / (1000 * 3600 * 24);
    if (selecteddate === '7') {
      this.unit[index].duration = "7";
      jobunitdate = new Date(this.effectiveArray.at(index).value.effectiveDate);
      jobunitdate.setDate(jobunitdate.getDate() + 6);
      this.effectiveArray.at(index).get('effectiveUntil').patchValue(jobunitdate);
      this.changeEffectiveUntil(jobunitdate, index, 'Select Date')
    }
    else if (selecteddate === '15') {
      this.unit[index].duration = "15";
      jobunitdate = new Date(this.effectiveArray.at(index).value.effectiveDate);
      jobunitdate.setDate(jobunitdate.getDate() + 14);
      this.effectiveArray.at(index).get('effectiveUntil').patchValue(jobunitdate);
      this.changeEffectiveUntil(jobunitdate, index, 'Select Date')
    }
    else if (selecteddate === '30') {
      this.unit[index].duration = "30";
      jobunitdate = new Date(this.effectiveArray.at(index).value.effectiveDate);
      jobunitdate.setDate(jobunitdate.getDate() + 29);
      this.effectiveArray.at(index).get('effectiveUntil').patchValue(jobunitdate);
      this.changeEffectiveUntil(jobunitdate, index, 'Select Date')
    }
    else {
      this.unit[index].duration = "0";
      jobunitdate = new Date(this.effectiveArray.at(index).value.effectiveDate);
      this.effectiveArray.at(index).get('effectiveUntil').patchValue(jobunitdate);
      this.changeEffectiveUntil(jobunitdate, index, 'Select Date')
    }

  }


  unCheckBox: boolean = true;
  openModalWithComponent() {
    const initialState: any = {
      backdrop: 'static',
      keyboard: false,
      size: this.ListingContent,
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, { initialState });
  }

  selectedAllbutCredits: boolean = false;
  updatingSelectAll(content: boolean) {
    const deactivatedData = JSON.parse(JSON.stringify(this.deactivatedList));
    const AllJobCheckBox: Array<any> = this.jobCheckBoxes._results;
    const AllCandidateCheckBox: Array<any> = this.candCheckBoxes._results;

    if (content) {
      if (this.ListingContent === 'JOB') {
        this.selectedAllbutCredits = false;
        AllJobCheckBox.forEach((res: any) => {
          res.nativeElement.checked = true;
        });
        if (this.tempAvailablePoints < this.totalPoints) {
          this.selectedAllbutCredits = true;
          deactivatedData.forEach(element => {
            if (!element.isSelected) element.isSelected = false;
          });
          AllJobCheckBox.forEach(res => {
            res.nativeElement.checked = false;
          });
          $('#selectAll').prop('checked', false);
          this.openModalWithComponent();
          return;
        }
        let sum = 0;
        this.creditsTobeConsumedJob = [];
        deactivatedData.forEach(element => {
          element.status = "ACTIVE";
          sum = sum + element.points;
          this.creditsTobeConsumedJob.push({ credits: element.points, jobId: element.jobId });
          this.updatingEffectiveFields(element, 'JOB');
        });

        this.availablepoints = 0;
        this.Jobcredits.emit(sum);
        this.listfOfJob.emit({ value: deactivatedData, flag: "selectAll" });
      }
      else if (this.ListingContent === 'CANDIDATE') {
        this.selectedAllbutCredits = false;
        AllCandidateCheckBox.forEach(res => {
          res.nativeElement.checked = true;
        });
        if (this.tempAvailablePoints < this.totalPoints) {
          this.selectedAllbutCredits = true;
          deactivatedData.forEach(element => {
            if (!element.isSelected) element.isSelected = false;
          });
          AllCandidateCheckBox.forEach(res => {
            res.nativeElement.checked = false;
          });
          $('#selectAll').prop('checked', false);
          this.openModalWithComponent();
          return;
        }
        let sum = 0;
        this.creditsTobeConsumedCand = [];
        deactivatedData.forEach(element => {
          element.status = "ACTIVE"
          sum = sum + element.points;
          this.creditsTobeConsumedCand.push({ credits: element.points, candId: element.candidateId });
          this.updatingEffectiveFields(element, 'CANDIDATE');
        });
        this.availablepoints = 0;
        this.Candidatecredits.emit(sum);


        this.listfOfCandidates.emit({ value: deactivatedData, flag: "selectAll" });
      }
    }
    else if (!content) {

      if (this.ListingContent === 'JOB') {
        AllJobCheckBox.forEach(res => {
          res.nativeElement.checked = false;
        });
        this.availablepoints = this.tempAvailablePoints;
        this.creditsTobeConsumedJob = [];
        this.listfOfJob.emit({ value: deactivatedData, flag: "deselectAll" });
      }
      else if (this.ListingContent === 'CANDIDATE') {
        AllCandidateCheckBox.forEach(res => {
          res.nativeElement.checked = false;
        });
        this.availablepoints = this.tempAvailablePoints;
        this.creditsTobeConsumedCand = [];
        this.listfOfCandidates.emit({ value: deactivatedData, flag: "deselectAll" });
      }

    }
  }

  updatingEffectiveFields(data: JobModel | candidateModel, compareData: string) {
    const jobcandidateId: string = compareData === 'JOB' ? data.jobId : data.candidateId;
    const key: string = compareData === 'JOB' ? 'jobId' : 'candidateId';
    this.effectiveArray.controls.forEach(res => {
      if (res.get(key).value === jobcandidateId) {
        if (this.checkTimeZoneFuture(new Date(res.get('effectiveDate').value))) {
          data.status = GigsumoConstants.AWAITING_HOST;
        }
        const effdateformat: string = this.util.formatDateddd(String(res.get('effectiveDate').value));
        const effuntilformat: string = this.util.formatDateddd(String(res.get('effectiveUntil').value));


        data.effectiveDate = effdateformat;
        data.effectiveFor = res.get('effectiveFor').value;
        data.effectiveUntil = effuntilformat;
      }
    });
  }

  updatingAvailablePoints(content: boolean) {

    if (content) {
      if (this.candidateClicked && this.creditsTobeConsumedCand.length > 0 && this.ListingContent === 'CANDIDATE') {
        this.availablepoints = this.tempAvailablePoints;
        let sum = 0;
        this.creditsTobeConsumedCand.map(item => sum += item.credits);
        this.availablepoints = this.availablepoints - sum;
      }
      else if (this.jobsClicked && this.creditsTobeConsumedJob.length > 0 && this.ListingContent === 'JOB' && this.selectedAllbutCredits) {
        this.availablepoints = this.tempAvailablePoints;
        let sum = 0;
        this.creditsTobeConsumedJob.map(item => sum += item.credits);
        this.availablepoints = this.availablepoints - sum;
      }
    }
  }

  selectall: boolean = false;
  selectAll(event: boolean) {

    if (this.selectedAllbutCredits) this.updatingAvailablePoints(true);
    else this.updatingAvailablePoints(false)

    if (event) {
      this.selectall = true;
      this.updatingSelectAll(event);
    }
    else if (!event) {
      this.selectall = false;
      this.updatingSelectAll(event);
    }
  }


  checkTimeZoneFuture(timezoneDate: Date): boolean {
    const date = new Date(this.serverTimeZone);
    date.setHours(0, 0, 0, 0);
    timezoneDate.setHours(0, 0, 0, 0);


    return timezoneDate > date;
  }

  creditsTobeConsumedJob: Array<{ credits: number, jobId: any }> = [];
  jobsClicked: boolean;
  onChangeJobs(jobVal: JobModel, event: boolean, jobCheckbox: HTMLElement) {
    let AllJobCheckBox: Array<any> = this.jobCheckBoxes._results;
    const { ...JobData } = jobVal;
    let profileresponse: any | undefined = {};
    profileresponse = this.profileData;


    if (event) {
      if (jobVal.isFeatured) {
        JobData.status = "ACTIVE";
        this.jobsClicked = true;
        this.creditsTobeConsumedJob.push({ credits: jobVal.points, jobId: jobVal.jobId });

        if (this.availablepoints < jobVal.points) {
          AllJobCheckBox.forEach((element) => {
            if (jobCheckbox === element.nativeElement) element.nativeElement.checked = false;
          });
          this.jobsClicked = false;
          this.creditsTobeConsumedJob.forEach((ele, i) => {
            if (ele.jobId === jobVal.jobId) this.creditsTobeConsumedJob.splice(i, 1);
          });
          this.openModalWithComponent();
          let sum = 0;
          this.creditsTobeConsumedJob.map(item => { sum = sum + item.credits; });
          this.Jobcredits.emit(sum);
          return;
        }
        this.availablepoints = this.availablepoints - jobVal.points;
      }
      else {
        JobData.status = "ACTIVE";
        this.jobsClicked = true;
        this.creditsTobeConsumedJob.push({ credits: jobVal.points, jobId: jobVal.jobId })

        if (this.availablepoints < jobVal.points) {
          AllJobCheckBox.forEach((element) => {
            if (jobCheckbox === element.nativeElement) element.nativeElement.checked = false;
          });
          this.jobsClicked = false;
          this.creditsTobeConsumedJob.forEach((ele, i) => {
            if (ele.jobId === jobVal.jobId) this.creditsTobeConsumedJob.splice(i, 1);
          });
          this.openModalWithComponent();
          let sum = 0;
          this.creditsTobeConsumedJob.map(item => { sum = sum + item.credits; });
          this.Jobcredits.emit(sum);
          return;
        }
        this.availablepoints = this.availablepoints - jobVal.points;
      }

      this.updatingEffectiveFields(JobData, 'JOB');

      this.listfOfJob.emit({ value: JobData, flag: "true" });

      let sum = 0;
      this.creditsTobeConsumedJob.map(item => { sum = sum + item.credits; });
      this.Jobcredits.emit(sum);
    }
    else if (!event) {

      if (this.jobsClicked) {
        this.availablepoints = this.availablepoints + jobVal.points;
      } else {
        this.availablepoints = this.availablepoints + jobVal.points;
      }

      this.listfOfJob.emit({ value: JobData, flag: "false" });

      this.creditsTobeConsumedJob.forEach((creditjob, i) => {
        if (creditjob.jobId === jobVal.jobId) this.creditsTobeConsumedJob.splice(i, 1);
      });


      let sum = 0;
      this.creditsTobeConsumedJob.map(item => { sum = sum + item.credits; });
      this.Jobcredits.emit(sum);

    }

  }

  userId = localStorage.getItem('userId');
  userType = localStorage.getItem('userType');
  creditsTobeConsumedCand: Array<{ credits: number, candId: any }> = []
  availablepoints: number;
  candidateClicked: boolean;
  onChangeCandidates(candidateval, event: boolean, candCheckBox: HTMLElement) {
    let AllCandidateCheckBox: Array<any> = this.candCheckBoxes._results;
    const { ...candidateData } = candidateval;
    let profileresponse: any | undefined = {};
    profileresponse = this.profileData;


    if (event) {

      if (candidateval.isFeatured) {
        candidateData.status = "ACTIVE";
        this.candidateClicked = true;
        this.creditsTobeConsumedCand.push({ credits: candidateval.points, candId: candidateval.candidateId });


        if (this.availablepoints < candidateval.points) {
          AllCandidateCheckBox.forEach((element) => {
            if (candCheckBox === element.nativeElement) element.nativeElement.checked = false;
          });
          this.candidateClicked = false;
          this.creditsTobeConsumedCand.forEach((item, i) => {
            if (item.candId === candidateval.candidateId) this.creditsTobeConsumedCand.splice(i, 1);
          });
          this.openModalWithComponent();
          let sum = 0;
          this.creditsTobeConsumedCand.map(item => { sum = sum + item.credits; });
          this.Candidatecredits.emit(sum);
          return;
        }
        this.availablepoints = this.availablepoints - candidateval.points;
      } else {
        candidateData.status = "ACTIVE";
        this.candidateClicked = true;
        this.creditsTobeConsumedCand.push({ credits: candidateval.points, candId: candidateval.candidateId });

        if (this.availablepoints < candidateval.points) {
          AllCandidateCheckBox.forEach((element) => {
            if (candCheckBox === element.nativeElement) element.nativeElement.checked = false;
          });
          this.candidateClicked = false;
          this.creditsTobeConsumedCand.forEach((item, i) => {
            if (item.candId === candidateval.candidateId) this.creditsTobeConsumedCand.splice(i, 1);
          });
          this.openModalWithComponent();
          let sum = 0;
          this.creditsTobeConsumedCand.map(item => { sum = sum + item.credits; });
          this.Candidatecredits.emit(sum);
          return;
        }
        this.availablepoints = this.availablepoints - candidateval.points;
      }

      this.updatingEffectiveFields(candidateData, 'CANDIDATE');


      this.listfOfCandidates.emit({ value: candidateData, flag: "true" });

      let sum = 0;
      this.creditsTobeConsumedCand.map(item => { sum = sum + item.credits; });
      this.Candidatecredits.emit(sum);

    }
    else if (!event) {
      if (this.candidateClicked) {
        this.availablepoints = this.availablepoints + candidateval.points;
      } else {
        this.availablepoints = this.availablepoints + candidateval.points;
      }

      this.listfOfCandidates.emit({ value: candidateData, flag: "false" });

      this.creditsTobeConsumedCand.forEach((creditCand, i) => {
        if (creditCand.candId === candidateval.candidateId) this.creditsTobeConsumedCand.splice(i, 1);
      });

      let sum = 0;
      this.creditsTobeConsumedCand.map(item => { sum = sum + item.credits; });
      this.Candidatecredits.emit(sum);


    }
  }
}

