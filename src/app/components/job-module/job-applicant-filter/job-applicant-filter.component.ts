import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-applicant-filter',
  templateUrl: './job-applicant-filter.component.html',
  styleUrls: ['./job-applicant-filter.component.scss']
})
export class JobApplicantFilterComponent implements OnInit, OnDestroy {
  gigsumoConstant: GigsumoConstants;
  jobApplicantFilterForm: UntypedFormGroup;
  jobApplicantStatusList : Array<any> = [];
  all = false;
  receiveFilterData: Subscription;
  resetFilter: Subscription;
  removingData : boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  // gigsumoConstant?.JOB_LIST_STATUS
  constructor(private formBuilder: UntypedFormBuilder, private jobService: JobService , private apiService : ApiService) {
    // this.jobApplicantStatusList = GigsumoConstants.JOB_LIST_STATUS.slice();\
    this.receiveFilterData = this.jobService.getDataForFilter().subscribe(data => {
      if (data) {
        this.removingData = true;
        this.getApplicantFilter(data);
      }
    })

    this.resetFilter = this.jobService.getReset().subscribe(data => {
      if (data) {
        this.reserForm();
      }
    })
  }

  ngOnInit() {
    if(!this.removingData){
      this.initiateFormGroup(this.jobApplicantStatusList.map(x=>x.itemId));
    }
  }

  getApplicantFilter(data) {
    this.apiService.create('listvalue/findbyList' , {domain : "JOB_APPLICATION_BUYER_ACTIONS"}).subscribe(res=>{
      const sorted : Array<any> =  res.data.JOB_APPLICATION_BUYER_ACTIONS && res.data.JOB_APPLICATION_BUYER_ACTIONS.listItems;
      if(sorted){
        this.jobApplicantStatusList = sorted.map(x => {
          return {itemId : x.itemId , value : x.value};
        });
        }
        this.jobApplicantFilterForm = this.createFormGroupFromFieldNames(this.jobApplicantStatusList.map(x=>x.itemId));
        this.removeEntity(data);
     });
  }

  initiateFormGroup(jobApplicantStatusList : any) {
    this.all = true;
    const formValues = this.jobApplicantFilterForm.value;
    for (const controlName in formValues) {
      if (formValues.hasOwnProperty(controlName)) {
        jobApplicantStatusList.forEach(ele => {
          if (controlName == ele) {
            this.jobApplicantFilterForm.get(controlName).setValue(true);
          }
        })
      }
    }
    this.setTheValueForFilters();
  }

  reserForm() {
     this.all = false;
    for (const controlName in this.jobApplicantFilterForm.controls) {
      if (this.jobApplicantFilterForm.controls.hasOwnProperty(controlName)) {
        this.jobApplicantFilterForm.get(controlName).setValue(false);
      }
    }
    this.setTheValueForFilters()
  }

  ngOnDestroy(): void {
    this.receiveFilterData.unsubscribe();
    this.resetFilter.unsubscribe();
    this.removingData = false;
  }

  removeEntity(value) {

    if(this.jobApplicantFilterForm){

      this.jobApplicantFilterForm.patchValue({...value});

      const allTrue = [];
      Object.keys(this.jobApplicantFilterForm.controls).map((ele)=>{
        allTrue.push(this.jobApplicantFilterForm.get(ele).value);
      });
      this.all = allTrue.every(val => val === true) ? true : false;

      this.setTheValueForFilters();
    }
  }

  private createFormGroupFromFieldNames(fieldNames: string[]): UntypedFormGroup {
    const group = {};
    fieldNames.forEach(fieldName => {
      group[fieldName] = false;
    });
    return this.formBuilder.group(group);
  }

  jobApplicantStatusFilter(event, label) {
    if (label == 'all') {
      if (event.target.checked) {
        // Set all form controls to true
        for (const controlName in this.jobApplicantFilterForm.controls) {
          if (this.jobApplicantFilterForm.controls.hasOwnProperty(controlName)) {
            this.jobApplicantFilterForm.get(controlName).setValue(true);
          }
        }
      } else {
         // Set all form controls to false
        for (const controlName in this.jobApplicantFilterForm.controls) {
          if (this.jobApplicantFilterForm.controls.hasOwnProperty(controlName)) {
            this.jobApplicantFilterForm.get(controlName).setValue(false);
          }
        }
      }
    }
    else if (label != 'all'){
       this.all = false;

        if (event.target.checked) {
          this.jobApplicantFilterForm.get(label).setValue(true);
        }
        else if(!event.target.checked){
          this.jobApplicantFilterForm.get(label).setValue(false);
        }
    }



    this.setTheValueForFilters()
  }

  setTheValueForFilters() {
    // Now, calculate jobApplicantStatus outside the subscription
    const formValues = this.jobApplicantFilterForm.value;
    const jobApplicantStatus: any = [];
    for (const controlName in formValues) {
      if (formValues.hasOwnProperty(controlName)) {
        const controlValue = formValues[controlName];
        if (controlValue && controlName !== 'all') {
          jobApplicantStatus.push(controlName);
        }
      }
    }

    // Setting the job applicant status list in the local storage
    // so that it can be accessed by filter component
    localStorage.setItem('jobApplicantStatus', JSON.stringify(jobApplicantStatus));
  }


}
