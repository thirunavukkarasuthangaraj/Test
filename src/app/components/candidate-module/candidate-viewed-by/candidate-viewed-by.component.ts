import { Component, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { candidateModel } from 'src/app/services/candidateModel';
import { JobService } from 'src/app/services/job.service';
import { UtilService } from 'src/app/services/util.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-candidate-viewed-by',
  templateUrl: './candidate-viewed-by.component.html',
  styleUrls: ['./candidate-viewed-by.component.scss'],
  inputs: ['candidateDetails']
})
export class CandidateViewedByComponent implements OnInit, OnChanges {
  stopscrollFlag: boolean = false
  candidateId: any;
  candidateDetails: candidateModel;
  values: any;
  counterpartsDetails: any;
  url = AppSettings.photoUrl;
  connectionRequestRef: BsModalRef;
  connectionStatus: string;
  LoginUserId=localStorage.getItem('userId')
  loadAPIcall:boolean=true;

  constructor(private api: ApiService, private router: Router,private modalService: BsModalService, private util: UtilService, private a_route: ActivatedRoute,
    private JobServicecolor: JobService) {
    this.a_route.queryParams.subscribe(res => {
      this.candidateId = res.candidateId
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.candidateDetails && changes.candidateDetails.currentValue) {
      this.candidateDetails = changes.candidateDetails.currentValue;
      if (this.candidateDetails.candidateId) {
        this.viewedList=[];
        this.loadAPIcall=true;
        this.searchConfig.pageNumber=0;
        this.getViews()
      }
    }
  }

  getInitialstwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }

  getColortwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }

  viewedList: any = []
  ngOnInit() {
    this.viewedList=[];
  }

  searchConfig: any = {
    pageNumber: 0,
  }


  getViews() {
    const candidateId = this.candidateDetails.candidateId
    this.searchConfig = { ...this.searchConfig, candidateId, limit: 10, };

    this.loadAPIcall=true;
    this.api.create('candidates/findCandidatesViewedBy', this.searchConfig).subscribe(
      res => this.handleResponse(res),
      err => this.handleError(err)
    );
  }

  handleResponse(res) {
    this.loadAPIcall=false;

    if (res.code !== '00000' || !res.data || !res.data.viewedByList.length) {
      this.stopscrollFlag = true;
      return;
    }

    if (res.code === '00000') {
      this.stopscrollFlag = res.data.viewedByList.length < 9;

      if (!this.stopscrollFlag) {
        this.searchConfig.pageNumber++;
      }

      res.data.viewedByList.forEach(element => {
        if (element.logo) {
          element.logo = AppSettings.photoUrl + element.logo;
        } else {
          element.logo = null;
        }
       // this.viewedList.push(element);
        const existingCandidate = this.viewedList.find(item => item.userId === element.userId);
        if (!existingCandidate) {
          this.viewedList.push(element);
        }
      });
    }
  }

  handleError(err) {
    this.util.stopLoader();
  }



  onScrollDown() {
    if (this.stopscrollFlag === false) {
      this.getViews();
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
      seletedItem.id = seletedItem.userId;
      seletedItem.onlyuser ="USER";
      this.messageData = seletedItem;
    }, 1000);
  }

    closeMessage(event) {
    this.messagemodelflag = false;
  }



}
