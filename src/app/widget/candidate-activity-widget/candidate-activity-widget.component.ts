import { GisgumoMessages } from 'src/app/services/GisgumoMessages';
import { GigsumoConstants } from './../../services/GigsumoConstants';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { candidateModel } from 'src/app/services/candidateModel';
import { CommonValues } from 'src/app/services/commonValues';
import { JobModel } from 'src/app/services/jobModel';
import { SearchData } from 'src/app/services/searchData';
import { ApiService } from './../../services/api.service';
import { UtilService } from './../../services/util.service';

declare var $: any;

@Component({
  selector: 'app-candidate-activity-widget',
  templateUrl: './candidate-activity-widget.component.html',
  styleUrls: ['./candidate-activity-widget.component.scss'],
  inputs: ["parentActivityObj"]
})
export class CandidateActivityWidgetComponent implements OnInit, OnChanges {
  jobId: any;
  selectedCandidateId: any;
  checkflag = false;
  checkpath;
  GigsumoConstant = GigsumoConstants;
  GigsumoConstantMsg = GisgumoMessages;
  subFilter
  clickEventsubscription: Subscription;
  showfilter = true;
  subsVar: Subscription;
  triggerApi_subscribe: Subscription;
  getNulllCheck_subscribe: Subscription;
  getJobID_subscribe: Subscription;
  queryParamData: any;
  userId = localStorage.getItem('userId')
  @Input() CandidateAcvityData: candidateModel | any;
  @Input() parentActivityObj: any;
  @Input() jobDetails: JobModel;
  @Input() TabName: any;
  stopscrollFlag: boolean = false
  activitiesFoundStatus: string = "Fetching Activities...";
  previousSearchAfterKey: any = null
  jeas: any = [];
  displayingdata: any
  responseReceived: boolean = false;
  statusFilter: string;
  dayfilter: string;
  FILTER_TYPE: string;
  filterbtn = false;
  filtermessage = this.GigsumoConstantMsg.filterMessage;
  sub1: Subscription;
  sub2: Subscription;
  private subscription: Subscription;
  filterStatusData: any;
  constructor(private util: UtilService, private commonValues: CommonValues, private searchData: SearchData, private activatedRoute: ActivatedRoute, private api: ApiService) {
    this.subscription = this.commonValues.getinviterefresh().subscribe((value) => {
      if (value.jobId == this.jobDetails.jobId)
        this.getJobActivities();
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.jeas = [];
    this.payload.activityType = null;
    if (changes.jobDetails && changes.jobDetails.currentValue == null && this.displayingdata) {
      this.displayingdata.timeLines = []
    } else if (changes.jobDetails !== undefined && changes.jobDetails.currentValue !== undefined) {
      this.jobDetails = changes.jobDetails.currentValue;
      if (this.jobDetails && this.jobDetails.jobId && (this.jobDetails.call === undefined || !this.jobDetails.call)) {
        this.preparedPayload();
        if(this.TabName!='job-applicants'&&this.TabName!='candidate-applied'&&this.TabName!='candidates-invited'){
          this.getJobActivities();
        }
      }
    }
    else if (changes.CandidateAcvityData !== undefined && changes.CandidateAcvityData.currentValue != undefined) {
      this.preparedPayload();
      this.CandidateAcvityData = changes.CandidateAcvityData.currentValue;
      if (this.CandidateAcvityData.call) {
        this.payload.activityOn = this.CandidateAcvityData.candidateId;
        this.payload.parentActivity = this.CandidateAcvityData.parentType;
        this.payload.entityType = "JOB";
        if (!this.CandidateAcvityData.isSelected) {
          if (this.displayingdata != undefined)
            this.displayingdata.timeLines = [];
        } else {
          this.getJobActivities()
        }

      }
    }



  }


  ngOnInit(): void {
    this.getAppliedFilter();
   }

  onScrollDown() {
    if (this.stopscrollFlag == false) {
      this.getJobActivities()
    }
  }

  getAppliedFilter() {
    this.api.create('listvalue/findbyList' , {domain : "TIMELINE_ACTIVITY_VALUES"}).subscribe(res=>{
      const sorted : Array<any> =  res.data.TIMELINE_ACTIVITY_VALUES && res.data.TIMELINE_ACTIVITY_VALUES.listItems;
      this.filterStatusData = res.data;
      if(sorted){
        this.filterStatusData = sorted.map(x => {
          return {itemId : x.itemId , value : x.value};
        });
      }
     });
  }

  getFilterValue(key : string){
    const arrs : Array<any> = [...this.filterStatusData];

    if(arrs){
      const find = arrs.find(c=>c.itemId === key);
      return find ? find.value : null;
    }
  }


  ngOnDestroy() {
    if (this.sub1 != undefined) {
      this.sub1.unsubscribe();
    }
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }

  }

  payload: any = {};
  preparedPayload() {
    if (this.jobDetails) {
      this.payload = {
        entityId: this.jobDetails.jobId,
        entityType: "JOB",
        limit: 20,
        searchAfterKey: null,
        activityOn: null,
        parentActivity: null,
        activityBy: null
      };
    }

  }



  Submitbyfilter($event) {
    let Days: any = [7, 15, 30]
    const dayLabelIndex = this.GigsumoConstant.Daya_LABEL.indexOf(this.dayfilter);
    if (dayLabelIndex >= 0) {
      this.payload.daysToFilter = Days[dayLabelIndex];
    }

    const filterTypeIndex = this.GigsumoConstant.FILTER_TYPE_LABEL.indexOf(this.FILTER_TYPE);
    if (filterTypeIndex >= 0) {
      this.payload.parentActivity = this.GigsumoConstant.FILTER_TYPE[filterTypeIndex];
    }

    this.payload.activityType = this.subFilter ? this.subFilter.toString() : undefined;
    this.payload.entityId = this.jobId;

    // Call getJobActivities
    this.getJobActivities();

    var element = document.getElementById("removeopen");
    element.classList.remove("open");
    $("button").attr("aria-expanded", "false");
  }

  filterType(event) {
    this.subFilter = "";
  }

  clearFilter() {
    this.dayfilter = null;
    this.FILTER_TYPE = null;
    this.subFilter = null;
    this.payload = {
      entityId: this.jobId,
      daysToFilter: null,
      parentActivity: null,
      activityType: null
    };
    this.filterbtn = false;
    this.getJobActivities();
  }

  // get activity api call;
  isLoading = false;
  getJobActivities() {
    if (this.jobDetails) {
      this.payload.entityId = this.jobDetails.jobId;

      if (this.payload.parentActivity == null) {
        this.payload.commonActivityRequired = true;

        if (this.jobDetails.jobPostedBy == this.userId) {

          this.payload.activityBy = null;
        } else {
          this.payload.activityBy = this.userId + "," + this.jobDetails.jobPostedBy;
          if (this.jobDetails.appliedBy) {
            this.payload.activityOn = this.jobDetails.appliedBy.
              filter(user => user.appliedUserId == this.userId).
              map(user => user.userId).join(",");
          }
        }
      } else {
        this.payload.activityBy = this.jobDetails.jobPostedBy;
        if (this.jobDetails.jobPostedBy != this.userId) {
          this.payload.activityBy += ',' + this.userId;
        } else if (this.CandidateAcvityData) {
          this.payload.activityBy += ',' + this.CandidateAcvityData.createdBy;
        }
      }

      if (this.jobDetails.jobPostedBy == this.userId) {
        this.payload.owner = true;
      } else {
        this.payload.owner = false;
      }

      if (this.jobDetails.jobId !== undefined) {
        // this.util.startLoader();
        this.isLoading = true;
        this.sub1 = this.api.create("jobs/findTimeLines", this.payload).subscribe(res => {
          // this.util.stopLoader();
          if (res && res.code === "00000" && res.data) {
            this.displayingdata = res.data;
            this.handleResponse(res.data);
          } else if (res && res.status === 500) {
            // Handle server error
          }
        }, err => {
          // this.util.stopLoader();
          this.isLoading = false;

          // Handle API call error
        });
      }
    }
  }


  handleResponse(data) { 
    this.isLoading = false;
    this.responseReceived = true;

    if (data.searchAfterKey) {
      this.handleSearchAfterKey(data.searchAfterKey[0]);
      this.updateJeas(data.timeLines);
    } else if (data.timeLines.length === 0) {
      this.noActivitiesFound();
    } 
    this.stopscrollFlag = data.timeLines.length === 0 || data.searchAfterKey[0] === this.previousSearchAfterKey;
  }
  handleSearchAfterKey(newKey) {
    if (newKey !== this.previousSearchAfterKey || this.payload.searchAfterKey === null) {
      this.previousSearchAfterKey = newKey;
      this.jeas = [];
    }
  }


  noActivitiesFound() {

    this.activitiesFoundStatus = "There are no activities found for the selected job.";
  }



  getReferenceId(obj: any): string | undefined {
    let firstLetter: string = obj.createdOn.charAt(0);
    firstLetter = firstLetter.toLocaleUpperCase();
    if (obj.createdOn) {
      if (firstLetter == 'J') {
        if (obj.jobData == undefined) {
          return
        } else{
          return " - " + obj.jobData ? obj.jobData.jobReferenceId : undefined;
        }
      } else {
        if (obj.jobData == undefined) {    return
        }else{  return " - " + obj.candidateData ? obj.candidateData.candidateReferenceId : undefined;
        }
      }
  }

  return undefined;
}

  updateJeas(timeLines) {

    this.jeas = [];
    timeLines.forEach(ele => {
      let date = new Date(ele.createdOn);
      let current = new Date();
      if(ele.activityType == "SHORTLISTED") {
        ele.activityType = "CANDIDATE-SHORTLISTED"
      }
      ele.createdOn = this.util.dataconvert(current, date);
      if(ele.entityType=="CANDIDATE"){
        ele.entityId= ele.candidateReferenceId
      }else{
        ele.entityId= ele.jobReferenceId
      }
      this.jeas.push(ele);
    });
    this.jeas = this.jeas.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj.activityId).indexOf(obj.activityId) === pos;
    });
  }





}

