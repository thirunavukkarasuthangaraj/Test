import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-candidate-invited-for-job-filter',
  templateUrl: './candidate-invited-for-job-filter.component.html',
  styleUrls: ['./candidate-invited-for-job-filter.component.scss']
})
export class CandidateInvitedForJobFilterComponent implements OnInit, OnDestroy {
  candidateInvitedFilterForm: UntypedFormGroup;
  candidateInvitedStatusList: any;
  all = false;
  receiveFilterData: Subscription
  resetFilter: Subscription
  removingData : boolean = false;
  constructor(private formBuilder: UntypedFormBuilder,private apiService : ApiService, private jobService: JobService) {

    this.receiveFilterData = this.jobService.getDataForFilter().subscribe(data => {
      if (data) {
        this.removingData = true;
        this.getApplicantFilter(data);
      }
    })

    this.resetFilter = this.jobService.getReset().subscribe(data => {
      console.log("data")
      console.log(data)
      if (data) {
        this.resetForm();
      }
    })
  }

  ngOnInit() {
    if(!this.removingData){
      this.initiateFormGroup();
    }
  }

  ngOnDestroy(): void {
    this.receiveFilterData.unsubscribe();
    this.resetFilter.unsubscribe();
    this.removingData = false;
  }

  getApplicantFilter(data) {
    this.apiService.create('listvalue/findbyList' , {domain : "JOB_INVITATION_SUPPLIER_ACTIONS"}).subscribe(res=>{
      const sorted : Array<any> =  res.data.JOB_INVITATION_SUPPLIER_ACTIONS && res.data.JOB_INVITATION_SUPPLIER_ACTIONS.listItems;
      if(sorted){
        this.candidateInvitedStatusList = sorted.map(x => {
          return {itemId : x.itemId , value : x.value};
        });
        }
        this.candidateInvitedFilterForm = this.createFormGroupFromFieldNames(this.candidateInvitedStatusList.map(x=>x.itemId));
        this.removeEntity(data);
     });
  }

  initiateFormGroup() {
    this.all = true;
    const formValues = this.candidateInvitedFilterForm.value;
    for (const controlName in formValues) {
      if (formValues.hasOwnProperty(controlName)) {
        this.candidateInvitedStatusList.forEach(ele => {
          if (controlName == ele) {
            this.candidateInvitedFilterForm.get(controlName).setValue(true);
          }
        })
      }
    }
    this.setTheValueForFilters();
  }

  resetForm() {
    this.all = false;
    for (const controlName in this.candidateInvitedFilterForm.controls) {
      if (this.candidateInvitedFilterForm.controls.hasOwnProperty(controlName)) {
        this.candidateInvitedFilterForm.get(controlName).setValue(false);
      }
    }
    this.setTheValueForFilters()
  }

  removeEntity(value) {
    if(this.candidateInvitedFilterForm){

      this.candidateInvitedFilterForm.patchValue({...value});
      const allTrue = [];
      Object.keys(this.candidateInvitedFilterForm.controls).map((ele)=>{
        allTrue.push(this.candidateInvitedFilterForm.get(ele).value);
      });
      this.all = allTrue.every(val => val === true) ? true : false;

      this.setTheValueForFilters()
    }
  }

  private createFormGroupFromFieldNames(fieldNames: string[]): UntypedFormGroup {
    const group = {};
    fieldNames.forEach(fieldName => {
      group[fieldName] = false;
    });
    return this.formBuilder.group(group);
  }

  candidateInvitedStatusFilter(event, label) {
    if (label === 'all') {
      if (event.target.checked) {
        // Set all form controls to true
        for (const controlName in this.candidateInvitedFilterForm.controls) {
          if (this.candidateInvitedFilterForm.controls.hasOwnProperty(controlName)) {
            this.candidateInvitedFilterForm.get(controlName).setValue(true);
          }
        }
      } else {
        // Set all form controls to false
        for (const controlName in this.candidateInvitedFilterForm.controls) {
          if (this.candidateInvitedFilterForm.controls.hasOwnProperty(controlName)) {
            this.candidateInvitedFilterForm.get(controlName).setValue(false);
          }
        }
      }
    }
    else if (label != 'all'){
      this.all = false;

       if (event.target.checked) {
         this.candidateInvitedFilterForm.get(label).setValue(true);
       }
       else if(!event.target.checked){
         this.candidateInvitedFilterForm.get(label).setValue(false);
       }
   }

    this.setTheValueForFilters();
  }

  setTheValueForFilters() {
    // Now, calculate jobApplicantStatus outside the subscription
    const formValues = this.candidateInvitedFilterForm.value;
    const candidateInvitedStatus: any = [];
    for (const controlName in formValues) {
      if (formValues.hasOwnProperty(controlName)) {
        const controlValue = formValues[controlName];
        if (controlValue && controlName !== 'all') {
          candidateInvitedStatus.push(controlName);
        }
      }
    }

    // Setting the job applicant status list in the local storage
    // so that it can be accessed by filter component
    localStorage.setItem('candidatesInvitedStatus', JSON.stringify(candidateInvitedStatus));
  }

}
