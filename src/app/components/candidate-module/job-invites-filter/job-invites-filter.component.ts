import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CandidateService } from 'src/app/services/CandidateService';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-invites-filter',
  templateUrl: './job-invites-filter.component.html',
  styleUrls: ['./job-invites-filter.component.scss']
})
export class JobInvitesFilterComponent implements OnInit {
  jobInvitesFilterForm: UntypedFormGroup;
  jobInvitesStatusList: any;
  all = false;
  removingData : boolean = false;
  receiveFilterData: Subscription
  resetFilter: Subscription
  constructor(private formBuilder: UntypedFormBuilder, private candidateService: CandidateService,
    private apiService : ApiService, private jobService: JobService) {
    this.receiveFilterData = this.jobService.getDataForFilter().subscribe(data => {
      if (data) {
        this.removingData = true;
        this.getAppliedFilter(data);
      }
    })

    this.resetFilter = this.candidateService.getReset().subscribe(data => {
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

  getAppliedFilter(data) {
    this.apiService.create('listvalue/findbyList' , {domain : "JOB_INVITATION_SUPPLIER_ACTIONS"}).subscribe(res=>{
      const sorted : Array<any> =  res.data.JOB_INVITATION_SUPPLIER_ACTIONS && res.data.JOB_INVITATION_SUPPLIER_ACTIONS.listItems;
      if(sorted){
        this.jobInvitesStatusList = sorted.map(x => {
          return {itemId : x.itemId , value : x.value};
        });
        }
        this.jobInvitesFilterForm = this.createFormGroupFromFieldNames(this.jobInvitesStatusList.map(x=>x.itemId));
        this.removeEntity(data);
     });
  }

  ngOnDestroy(): void {
    this.receiveFilterData.unsubscribe();
    this.resetFilter.unsubscribe();
    this.removingData = false;
  }

  initiateFormGroup() {
    this.all = true;
    // let data: any = JSON.parse(localStorage.getItem('jobInvitesStatus'));
    const formValues = this.jobInvitesFilterForm.value;
    for (const controlName in formValues) {
      if (formValues.hasOwnProperty(controlName)) {
        this.jobInvitesStatusList.forEach(ele => {
          if (controlName == ele) {
            this.jobInvitesFilterForm.get(controlName).setValue(true);
          }
        })
      }
    }
    this.setTheValueForFilters();
  }

  resetForm() {
    this.all = false;
    for (const controlName in this.jobInvitesFilterForm.controls) {
      if (this.jobInvitesFilterForm.controls.hasOwnProperty(controlName)) {
        this.jobInvitesFilterForm.get(controlName).setValue(false);
      }
    }
    this.setTheValueForFilters()
  }

  removeEntity(value) {
    if(this.jobInvitesFilterForm){
      this.jobInvitesFilterForm.patchValue({...value});
      const allTrue = [];
      Object.keys(this.jobInvitesFilterForm.controls).map((ele)=>{
          allTrue.push(this.jobInvitesFilterForm.get(ele).value);
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

  jobInvitesStatusFilter(event, label) {

    if (label == 'all') {
      if (event.target.checked) {
        // Set all form controls to true
        for (const controlName in this.jobInvitesFilterForm.controls) {
          if (this.jobInvitesFilterForm.controls.hasOwnProperty(controlName)) {
            this.jobInvitesFilterForm.get(controlName).setValue(true);
          }
        }
      } else {
        // Set all form controls to false
        for (const controlName in this.jobInvitesFilterForm.controls) {
          if (this.jobInvitesFilterForm.controls.hasOwnProperty(controlName)) {
            this.jobInvitesFilterForm.get(controlName).setValue(false);
          }
        }
      }
    }
    else if (label != 'all'){
       this.all = false;

       if (event.target.checked) {
         this.jobInvitesFilterForm.get(label).setValue(true);
       }
       else if(!event.target.checked){
         this.jobInvitesFilterForm.get(label).setValue(false);
       }
   }


    this.setTheValueForFilters();
  }

  setTheValueForFilters() {
    // Now, calculate jobApplicantStatus outside the subscription
    const formValues = this.jobInvitesFilterForm.value;
    const jobInvitesStatus: any = [];
    for (const controlName in formValues) {
      if (formValues.hasOwnProperty(controlName)) {
        const controlValue = formValues[controlName];
        if (controlValue && controlName !== 'all') {
          jobInvitesStatus.push(controlName);
        }
      }
    }

    // Setting the job applicant status list in the local storage
    // so that it can be accessed by filter component
    localStorage.setItem('jobInvitesStatus', JSON.stringify(jobInvitesStatus));
  }

}
