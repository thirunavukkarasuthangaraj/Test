import { GisgumoMessages } from 'src/app/services/GisgumoMessages';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { candidateModel } from 'src/app/services/candidateModel';
import { CommonValues } from 'src/app/services/commonValues';
import { JobModel } from 'src/app/services/jobModel';
import { UtilService } from 'src/app/services/util.service';
import { SearchData } from './../../services/searchData';
declare var $: any;
@Component({
  selector: 'app-job-activity-widget',
  templateUrl: './job-activity-widget.component.html',
  styleUrls: ['./job-activity-widget.component.scss'],
  inputs: ["candidateDetails"]
})
export class JobActivityWidgetComponent implements OnInit, OnDestroy {
  candidateId: any;
  candidateDetails: candidateModel;
  @Input() jobData: any;
  @Input() TabName: any;
  @Input() dataPassedToActivity: any;
  @Input() JobAcvityData: JobModel | any;
  clickEmitter: Subscription
  @Output() eventpass = new EventEmitter<any>();
  checkpath
  queryparamData: any;
  displayingdata: any
  clickEventsubscription: Subscription;
  GigsumoConstant = GigsumoConstants;
  GigsumoConstantMsg = GisgumoMessages;
  showfilter = false;
  parentActivity: any;
  jobIdsub: Subscription;
  getNulllChecksub: Subscription;
  triggersub: Subscription;
  userId = localStorage.getItem('userId');
  subsVar: Subscription;
  statusFilter: string;
  dayfilter: string;
  FILTER_TYPE: string;
  filterbtn = false;
  filtermessage = this.GigsumoConstantMsg.filterMessage;
  subFilter
  activitiesFoundStatus: string = "Fetching Activities....";
  previousSearchAfterKey: any = null
  responseReceived: boolean = false
  jeas: any = []
  private subscription: Subscription;
  filterStatusData: any;
  constructor(private util: UtilService, private commonValues: CommonValues, private searchData: SearchData, private activatedRoute: ActivatedRoute, private api: ApiService, private router: Router) {
    this.subscription = this.commonValues.getinviterefresh().subscribe((value) => {
      if (value.candidateId == this.candidateDetails.candidateId)
        this.isLoading=true;
        this.fetchJobActivities();
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.jeas = [];
    this.isLoading=true; 
    this.payload.activityType = null;
    if (changes !== undefined && changes.TabName !== undefined) {
      this.TabName = changes.TabName.currentValue;
    }
    if (changes.candidateDetails && changes.candidateDetails !== undefined && changes.candidateDetails.currentValue == null && this.displayingdata) {
      this.displayingdata.timeLines = []
      this.isLoading=false;
    } else if (changes.candidateDetails !== undefined && changes.candidateDetails.currentValue !== undefined) {
      this.candidateDetails = changes.candidateDetails.currentValue;
      this.isLoading=false;
      if (this.candidateDetails && this.candidateDetails.candidateId && (this.candidateDetails.call === undefined || !this.candidateDetails.call)) {
        this.preparedPayload();
        if (this.TabName != 'jobsApplied' && this.TabName != 'cInvited') {
          this.fetchJobActivities();
        }
      }
    }
    else if (changes.JobAcvityData !== undefined && changes.JobAcvityData.currentValue !== undefined) {
      this.isLoading=false;
      this.preparedPayload();
      this.JobAcvityData = changes.JobAcvityData.currentValue;
      if (this.JobAcvityData.call) {
        this.isLoading=false;
        this.payload.activityOn = this.JobAcvityData.jobId;
        this.payload.parentActivity = this.JobAcvityData.parentType;
        this.payload.entityType = "CANDIDATE";
        if (!this.JobAcvityData.isSelected) {
          this.displayingdata.timeLines = [];
        } else {
          this.fetchJobActivities()
        }
      }
    }
  }
  ngOnInit(): void {
    this.isLoading=true;
    this.getAppliedFilter();
  }
  filteredScreens(): boolean {
    const excludedTabs = [
      'profileSummary',
      'candidate-requests-received',
      'views',
      'documents',
      'Clike-like',
      'candidateDetails',
      'cInvited'
    ]
    return !excludedTabs.includes(this.TabName)
  }
  getAppliedFilter() {
    this.isLoading=true;
    this.api.create('listvalue/findbyList', { domain: "TIMELINE_ACTIVITY_VALUES" }).subscribe(res => {
      const sorted: Array<any> = res.data.TIMELINE_ACTIVITY_VALUES && res.data.TIMELINE_ACTIVITY_VALUES.listItems;
      this.filterStatusData = res.data;
      this.isLoading=false;
      if (sorted) {
        this.filterStatusData = sorted.map(x => {
          return { itemId: x.itemId, value: x.value };
        });
      }
    });
  }
  getFilterValue(key: string) {
    const arrs: Array<any> = [...this.filterStatusData];
    if (arrs) {
      const find = arrs.find(c => c.itemId === key);
      return find ? find.value : null;
    }
  }
  ngOnDestroy() {
    if (this.jobIdsub != undefined) {
      this.jobIdsub.unsubscribe();
    }
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }
  stopscrollFlag: boolean = false
  onScrollDown() {
    if (this.stopscrollFlag == false) {
      this.fetchJobActivities()
    }
  }
  payload: any = {};
  preparedPayload() {
    this.isLoading=true;
    if (this.candidateDetails) {
      this.payload = {
        entityId: this.candidateDetails.candidateId,
        entityType: "CANDIDATE",
        limit: 20,
        searchAfterKey: null,
        activityOn: null,
        parentActivity: null,
        activityBy: null,
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
    this.payload.entityId = this.candidateDetails.candidateId;
    // Call getJobActivities
    this.fetchJobActivities();
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
      entityId: this.candidateDetails.candidateId,
      daysToFilter: null,
      parentActivity: null,
      activityType: null
    };
    this.filterbtn = false;
    this.fetchJobActivities();
  }
  isLoading:boolean=false
  fetchJobActivities() {
    // this.util.startLoader();
    this.isLoading=true
    if (this.candidateDetails) {
      if (this.payload.parentActivity == null) {
        this.payload.commonActivityRequired = true;
        if (this.candidateDetails.createdBy == this.userId) {
          this.payload.activityBy = null;
        }
        if (this.candidateDetails.createdBy != this.userId) {
          this.payload.activityBy = this.userId + "," + this.candidateDetails.createdBy;
          const allIdsSet = new Set<string>();
          // Collect IDs from interestShownLogs
          if (this.candidateDetails.interestShownLogs) {
            this.candidateDetails.interestShownLogs
              .filter(candidate => candidate.requestedBy === this.userId)
              .forEach(candidate => allIdsSet.add(candidate.jobId.replace(/\[|\]/g, '')));
          }
          // Collect IDs from jobsApplied
          if (this.candidateDetails.jobsApplied) {
            this.candidateDetails.jobsApplied
              .forEach(candidate => allIdsSet.add(candidate.userId));
          }
          // Collect IDs from resumeRequestLogs
          if (this.candidateDetails.resumeRequestLogs) {
            this.candidateDetails.resumeRequestLogs
              .filter(candidate => candidate.requestedBy === this.userId)
              .forEach(candidate => allIdsSet.add(candidate.jobId.replace(/\[|\]/g, '')));
          }
          // Join unique IDs into a single string
          this.payload.activityOn = [...allIdsSet].join(",");
        }
      } else {
        this.payload.activityBy = this.candidateDetails.createdBy;
        if (this.candidateDetails && this.candidateDetails.createdBy != this.userId) {
          this.payload.activityBy += ',' + this.userId;
        }
        else if (this.candidateDetails && (this.candidateDetails.interestShownLogs || this.candidateDetails.jobsApplied || this.candidateDetails.resumeRequestLogs)) {
          if (this.candidateDetails.interestShownLogs) {
            this.candidateDetails.interestShownLogs.forEach(ele => {
              if (ele.jobId == this.JobAcvityData.jobId) {
                this.payload.activityBy += ',' + this.JobAcvityData.jobPostedBy;
              }
            });
          }
          if (this.candidateDetails.jobsApplied) {
            this.candidateDetails.jobsApplied.forEach(ele => {
              if (ele.userId == this.JobAcvityData.jobId) {
                this.payload.activityBy += ',' + this.JobAcvityData.jobPostedBy;
              }
            });
          }
          if (this.candidateDetails.resumeRequestLogs) {
            this.candidateDetails.resumeRequestLogs.forEach(ele => {
              if (ele.jobId == this.JobAcvityData.jobId) {
                this.payload.activityBy += ',' + this.JobAcvityData.jobPostedBy;
              }
            });
          }
        }
      }
      if (this.candidateDetails && this.candidateDetails.createdBy == this.userId) {
        this.payload.owner = true;
      } else {
        this.payload.owner = false;
      }
      this.payload.entityId = this.candidateDetails.candidateId;
      this.jobIdsub = this.api.create("jobs/findTimeLines", this.payload).subscribe(
        res => {
          // this.util.stopLoader();
          this.isLoading=false
          this.displayingdata = res.data;
          this.processApiResponse(res);
        },
        err => {
          // this.util.stopLoader();
          this.isLoading=false
          // Handle API call error
        }
      );
    }
  }
  getReferenceId(obj: any): string | undefined {
    let firstLetter: string = obj.activityOn.charAt(0);
    firstLetter = firstLetter.toLocaleUpperCase();
    if (obj.activityOn) {
      switch (firstLetter) {
        case 'J':
          if (obj.jobData == undefined) {
            return
          }
          return " - " + obj.jobData ? obj.jobData.jobReferenceId : undefined;
        case 'C':
          return " - " + obj.candidateData ? obj.candidateData.candidateReferenceId : undefined;
      }
    }
    return undefined;
  }
  processApiResponse(res) {
    if (res.code === "00000" && res.data) {
      this.handleValidResponse(res);
    } else if (res.status === 500) {
      // Handle server error
    }
  }
  handleValidResponse(res) {
    this.responseReceived = true;
    this.activitiesFoundStatus = this.getActivitiesFoundStatus(res);
    if (res.data.searchAfterKey) {
      this.updateSearchAfterKey(res.data.searchAfterKey[0]);
      this.updateJobActivities(res.data.timeLines);
    }
    this.stopscrollFlag = res.data.timeLines.length === 0 || res.data.searchAfterKey[0] === this.previousSearchAfterKey;
  }
  getActivitiesFoundStatus(res) {
    if (res.data.timeLines.length === 0) {
      return "There are no activities found for the selected candidate.";
    }
    return "";
  }
  updateSearchAfterKey(newKey) {
    if (newKey !== this.previousSearchAfterKey || this.payload.searchAfterKey === null) {
      this.previousSearchAfterKey = newKey;
      this.jeas = [];
    }
  }
  updateJobActivities(timeLines) {
    timeLines.forEach(ele => {
      let date = new Date(ele.createdOn);
      let current = new Date();
      ele.createdOn = this.util.dataconvert(current, date);
      if (ele.entityType == "CANDIDATE") {
        ele.entityId = ele.candidateData.candidateReferenceId
      } else {
        ele.entityId = ele.jobData.jobReferenceId
      }
      this.jeas.push(ele);
    });
    this.jeas = [...new Set(this.jeas)];
  }
}
