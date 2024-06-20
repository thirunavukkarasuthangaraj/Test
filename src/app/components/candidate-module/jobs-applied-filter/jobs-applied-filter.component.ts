import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CandidateService } from 'src/app/services/CandidateService';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-jobs-applied-filter',
  templateUrl: './jobs-applied-filter.component.html',
  styleUrls: ['./jobs-applied-filter.component.scss']
})
export class JobsAppliedFilterComponent implements OnInit, OnDestroy {
  gigsumoConstant: GigsumoConstants;
  jobsAppliedFilterForm: UntypedFormGroup;
  jobAppliedStatusList;
  all = false;
  removingData : boolean = false;
  receiveFilterData: Subscription;
  resetFilter: Subscription;
  constructor(private formBuilder: UntypedFormBuilder, private candidateService: CandidateService , private apiService : ApiService) {
     this.receiveFilterData = this.candidateService.getDataForFilter().subscribe(data => {
      if (data) {
        this.removingData = true
        this.getAppliedFilter(data);
      }
    })

    this.resetFilter = this.candidateService.getReset().subscribe(data => {
      if (data) {
        this.reserForm();
      }
    })
   }

  ngOnInit() {
    if(!this.removingData){
      this.initiateFormGroup();
    }
  }

  getAppliedFilter(data) {
    this.apiService.create('listvalue/findbyList' , {domain : "JOB_APPLICATION_SUPPLIER_ACTIONS"}).subscribe(res=>{
      const sorted : Array<any> =  res.data.JOB_APPLICATION_SUPPLIER_ACTIONS && res.data.JOB_APPLICATION_SUPPLIER_ACTIONS.listItems;
      if(sorted){
        this.jobAppliedStatusList = sorted.map(x => {
          return {itemId : x.itemId , value : x.value};
        });
        }
        this.jobsAppliedFilterForm = this.createFormGroupFromFieldNames(this.jobAppliedStatusList.map(x=>x.itemId));
        this.removeEntity(data);
     });
  }


  initiateFormGroup() {
    this.all = true;
    const formValues = this.jobsAppliedFilterForm.value;
    for (const controlName in formValues) {
      if (formValues.hasOwnProperty(controlName)) {
        this.jobAppliedStatusList.forEach(ele => {
          if (controlName == ele) {
            this.jobsAppliedFilterForm.get(controlName).setValue(true);
          }
        })
      }
    }
    this.setTheValueForFilters();
  }

  reserForm() {
    this.all = false;
    for (const controlName in this.jobsAppliedFilterForm.controls) {
      if (this.jobsAppliedFilterForm.controls.hasOwnProperty(controlName)) {
        this.jobsAppliedFilterForm.get(controlName).setValue(false);
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
  if (this.jobsAppliedFilterForm) {
      this.jobsAppliedFilterForm.patchValue({...value});
      const allTrue = [];

      Object.keys(this.jobsAppliedFilterForm.controls).map((ele)=>{
          allTrue.push(this.jobsAppliedFilterForm.get(ele).value);
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

  jobsAppliedStatusFilter(event, label) {
    if (label === 'all') {
      if (event.target.checked) {
        // Set all form controls to true
        for (const controlName in this.jobsAppliedFilterForm.controls) {
          if (this.jobsAppliedFilterForm.controls.hasOwnProperty(controlName)) {
            this.jobsAppliedFilterForm.get(controlName).setValue(true);
          }
        }
      } else {
        // Set all form controls to false
        for (const controlName in this.jobsAppliedFilterForm.controls) {
          if (this.jobsAppliedFilterForm.controls.hasOwnProperty(controlName)) {
            this.jobsAppliedFilterForm.get(controlName).setValue(false);
          }
        }
      }
    }
    else if (label != 'all'){
      this.all = false;

       if (event.target.checked) {
         this.jobsAppliedFilterForm.get(label).setValue(true);
       }
       else if(!event.target.checked){
         this.jobsAppliedFilterForm.get(label).setValue(false);
       }
   }

    this.setTheValueForFilters()
  }

  setTheValueForFilters() {
    // Now, calculate jobApplicantStatus outside the subscription
    const formValues = this.jobsAppliedFilterForm.value;
    const jobsAppliedStatus: any = [];
    for (const controlName in formValues) {
      if (formValues.hasOwnProperty(controlName)) {
        const controlValue = formValues[controlName];
        if (controlValue && controlName !== 'all') {
          jobsAppliedStatus.push(controlName);
        }
      }
    }

    // Setting the job applicant status list in the local storage
    // so that it can be accessed by filter component
    localStorage.setItem('jobsAppliedStatus', JSON.stringify(jobsAppliedStatus));
  }


}
