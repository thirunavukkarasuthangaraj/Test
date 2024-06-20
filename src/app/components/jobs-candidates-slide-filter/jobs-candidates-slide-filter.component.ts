import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CandidateService } from 'src/app/services/CandidateService';
import { JobService } from 'src/app/services/job.service';
import { CommunicationService } from 'src/shared/services/CommunicationService';

@Component({
  selector: 'app-jobs-candidates-slide-filter',
  templateUrl: './jobs-candidates-slide-filter.component.html',
  styleUrls: ['./jobs-candidates-slide-filter.component.scss']
})
export class JobsCandidatesSlideFilterComponent implements OnInit ,OnDestroy  {

  @ViewChild('stickyFilterHeader') stickyFilterHeader: ElementRef
  @Input() valuesSentForFilters;
  @Output() valuesRetainedForFilters = new EventEmitter<any>(null);

  scrollPosition = 0;
  showComponentA: boolean = true;
  restoreScrollPosition: any;
  isOpen = false;
  panel: string;
  constructor(private jobService: JobService, private candidateService: CandidateService,private communicationService: CommunicationService) {
    this.jobService.getSliderToggle().subscribe(values => {
      this.isOpen = values.value;
      this.panel = values.panel;
      // this.toggleBodyOverflow(values.value);
    })
  }


  ngOnInit() {
    this.communicationService.triggerMethod('reset');
   }

  ngOnDestroy(): void {

  }

  executeMethod(data: string): void {
    this.resetFilter(data);


  }

  previousValue_jobDetails:any={};
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes.valuesRetainedForFilters)
    // console.log(changes.filterChanges)
    if(changes.valuesSentForFilters!==undefined && changes.valuesSentForFilters.currentValue != undefined){

    //  this.startFilter(this.valuesSentForFilters.entity)

    }

  }



  closeSlider() {
    this.jobService.setSliderToggle(false, this.panel, null);
    window.scrollTo(0, this.restoreScrollPosition);
  }

  startFilter(value) {
    if (value === 'jobs') {
      this.valuesRetainedForFilters.emit(value);
    } else if (value === 'candidates') {
      this.valuesRetainedForFilters.emit(value);
    } else if (value == 'job applicants') {
      let data: any = {}
      const jobApplicantStatus = JSON.parse(localStorage.getItem('jobApplicantStatus'))
      data.jobApplicantStatus = jobApplicantStatus;
      const jsonData = JSON.stringify(data);
      this.valuesRetainedForFilters.emit(jsonData);
    } else if (value == 'candidates invited') {
      let data: any = {}
      const candidatesInvitedStatus = JSON.parse(localStorage.getItem('candidatesInvitedStatus'))
      data.candidatesInvitedStatus = candidatesInvitedStatus;
      const jsonData = JSON.stringify(data);
      this.valuesRetainedForFilters.emit(jsonData);
    } else if(value == 'jobs applied') {
       let data: any = {}
      const jobsAppliedStatus = JSON.parse(localStorage.getItem('jobsAppliedStatus'))
      data.jobsAppliedStatus = jobsAppliedStatus;
      const jsonData = JSON.stringify(data);
      console.log(jobsAppliedStatus);

      this.valuesRetainedForFilters.emit(jsonData);
    } else if (value == 'job invites') {
      let data: any = {}
      const jobInvitesStatus = JSON.parse(localStorage.getItem('jobInvitesStatus'))
      data.jobInvitesStatus = jobInvitesStatus;
      const jsonData = JSON.stringify(data);
      this.valuesRetainedForFilters.emit(jsonData);
    }
    this.jobService.setSliderToggle(false, value, null);
  }

  resetFilter(value) {
    if(value === "jobs"){
      this.valuesRetainedForFilters.emit("reset");
      this.jobService.setSliderToggle(false, value, null);
    }
    else if(value === "candidates"){
      this.valuesRetainedForFilters.emit("reset");
      this.jobService.setSliderToggle(false, value, null);
    }

    if (value == 'jobs applied' || value == 'job invites') {
      this.candidateService.setReset(true);
    } else if (value == 'job applicants' || value == 'candidates invited') {
      this.jobService.setReset(true);
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrollPosition = window.scrollY
  }
}
