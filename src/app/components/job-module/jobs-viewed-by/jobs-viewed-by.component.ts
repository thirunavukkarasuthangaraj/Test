import { SearchData } from 'src/app/services/searchData';
import { Component, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { JobModel } from 'src/app/services/jobModel';
import { JobService } from 'src/app/services/job.service';
import Swal from 'sweetalert2';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-jobs-viewed-by',
  templateUrl: './jobs-viewed-by.component.html',
  styleUrls: ['./jobs-viewed-by.component.scss'],
  inputs: ['jobDetails']
})
export class JobsViewedByComponent implements OnInit, OnChanges {
  jobId: any;
  values: any;
  counterpartsDetails: any;
  jobDetails: JobModel
  url = AppSettings.photoUrl;
  connectionRequestRef: BsModalRef;
  LoginUserId = localStorage.getItem('userId')
  connectionStatus: string;
  constructor(private api: ApiService, private searchData: SearchData, private modalService: BsModalService, private router: Router, private util: UtilService,
    private a_route: ActivatedRoute, private JobServicecolor: JobService) {
    this.a_route.queryParams.subscribe(res => {
      this.jobId = res.jobId
    })
    this.searchData.setNUllCheck("jobs-viewed");
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jobDetails.currentValue) {
      this.jobDetails = changes.jobDetails.currentValue;
      if (this.jobDetails.jobId) {
        this.viewedList = [];
        this.searchConfig.pageNumber = 0;
        this.getViews()
      }
    }
  }
  viewedList: any = []
  ngOnInit() {
    this.viewedList = [];
  }
  getInitialstwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }
  getColortwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }
  searchConfig: any = {
    pageNumber: 0,
  }
  profile(val) {
    let values: any = {}
    values.userId = val;
    this.router.navigate(["personalProfile"], { queryParams: values });
  }
  loadAPIcall:boolean=false;
  getViews() {
    const jobId = this.jobDetails.jobId;
    this.searchConfig = { ...this.searchConfig, jobId, limit: 10, };
    // this.util.startLoader();
    this.loadAPIcall=true;
    this.api.create('jobs/findJobsViewedBy', this.searchConfig).subscribe(
      
      res => this.handleResponse(res),
      err => this.handleError(err)
    );
  }
  handleResponse(res) {
    // this.util.stopLoader();
    this.loadAPIcall=false
    if (res.code !== '00000' || !res.data || !res.data.viewedByList.length) {
      this.stopscrollFlag = true;
      return;
    }
    if (res.code == '00000') {
      if (res.data.viewedByList.length < 9) {
        this.stopscrollFlag = true;
      } else {
        this.stopscrollFlag = false;
        this.searchConfig.pageNumber++;
      }
      res.data.viewedByList.forEach(element => {
        if (element.logo != undefined) {
          element.logo = AppSettings.photoUrl + element.logo;
        } else {
          element.logo = null;
        }
        this.viewedList.push(element)
      });
    }
  }
  handleError(err) {
    // this.util.stopLoader();
    this.loadAPIcall=false
  }
  stopscrollFlag: boolean = false
  onScrollDown() {
    if (this.stopscrollFlag == false) {
      this.getViews()
    }
  }
  chatuser(values, connectionTemplate?: TemplateRef<any>) {
    if (values.connectionStatus === 'CONNECTED') {
      this.openMessage(values)
    } else if (values.connectionStatus !== 'CONNECTED') {
      this.openMessage(values)
      // to be used later
      // this.openConnectionTemplate(values.connectionStatus, values, connectionTemplate);
    }
  }
  seletedChatItem: any;
  messageData: any;
  userId = localStorage.getItem('userId');
  messagemodelflag: any;
  openMessage(seletedItem) {
    if (seletedItem.userId == this.userId) {
      seletedItem.owner = true;
    } else {
      seletedItem.owner = false;
    }
    setTimeout(() => {
      seletedItem.userId = seletedItem.userId;
      this.seletedChatItem = seletedItem;
      this.messageData = [];
      this.messagemodelflag = true;
      seletedItem.groupType = "USER";
      seletedItem.messageType = "USER";
      seletedItem.id = seletedItem.userId;
      seletedItem.onlyuser = "USER";
      this.messageData = seletedItem;
    }, 1000);
  }
  closeMessage(event) {
    this.messagemodelflag = false;
  }
  openConnectionTemplate(connectionStatus, values, connectionTempate?: TemplateRef<any>) {
    this.connectionStatus = connectionStatus;
    this.values = values;
    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
    };
    this.api.query("user/" + this.values.userId).subscribe(res => {
      if (res.code == '00000') {
        this.counterpartsDetails = res;
        this.connectionRequestRef = this.modalService.show(connectionTempate, initialState);
      }
    })
  }
}
