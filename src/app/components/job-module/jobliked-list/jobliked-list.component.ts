import { SearchData } from 'src/app/services/searchData';
import { AppSettings } from './../../../services/AppSettings';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from './../../../services/util.service';
import { Router } from '@angular/router';
import { ApiService } from './../../../services/api.service';
import { Component, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { JobModel } from 'src/app/services/jobModel';
import { JobService } from 'src/app/services/job.service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-jobliked-list',
  templateUrl: './jobliked-list.component.html',
  styleUrls: ['./jobliked-list.component.scss'],
  inputs: ['jobDetails']
})
export class JoblikedListComponent implements OnInit, OnChanges {
  connectionRequestRef: BsModalRef;
  connectionStatus: string;
  values: any;
  counterpartsDetails: any;
  jobId: any;
  jobDetails: JobModel;
  url = AppSettings.photoUrl;
  LoginUserId=localStorage.getItem('userId')
  constructor(private api: ApiService, private modalService: BsModalService,private searchData: SearchData, private router: Router, private util: UtilService,
    private a_route: ActivatedRoute, private JobServicecolor: JobService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jobDetails.currentValue) {
      this.jobDetails = changes.jobDetails.currentValue;
      if (this.jobDetails.jobId) {
        this.likedByList=[];
        this.searchConfig.pageNumber=0;
        this.getViews();
      }
    }
  }
  getInitialstwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }
  getColortwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }
  likedByList: any = []
  ngOnInit() {
    this.searchData.setNUllCheck("jobs-liked");
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
    this.searchConfig.jobId = this.jobDetails.jobId
    this.searchConfig.limit = 10
    // this.util.startLoader()
    this.loadAPIcall=true
    this.api.create('jobs/findJobsLikedBy', this.searchConfig).subscribe(res => {
      // this.util.stopLoader()
      this.loadAPIcall=false
      if (res.code == '00000') {
        if (res.data != null && res.data.likedByList.length != 0) {
          if (res.data.likedByList.length < 9) {
            this.stopscrollFlag = true
          } else {
            this.stopscrollFlag = false
            this.searchConfig.pageNumber++;
          }
          res.data.likedByList.forEach(ele => {
            if (ele.logo != null) {
              ele.logo = AppSettings.photoUrl + ele.logo
            }else{
              ele.logo=null;
            }
            this.likedByList.push(ele)
          })
        } else if (res.data != null && res.data.likedByList.length == 0) {
          this.stopscrollFlag = true
        }
      }
    })
  }
  stopscrollFlag: boolean = false
  onScrollDown() {
    if (this.stopscrollFlag == false) {
      this.getViews()
    }
  }
  chatuser(values,connectionTemplate?: TemplateRef<any>){
    if (values.connectionStatus === 'CONNECTED') {
      this.openMessage(values)
    } else if (values.connectionStatus !== 'CONNECTED') {
      this.openMessage(values)
      // to be used later
      // this.openConnectionTemplate(values.connectionStatus, values, connectionTemplate);
    }
  }
  seletedChatItem:any;
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
      seletedItem.onlyuser ="USER";
      seletedItem.id = seletedItem.userId;
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
