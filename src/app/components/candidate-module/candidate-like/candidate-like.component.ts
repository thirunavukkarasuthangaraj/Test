import { ActivatedRoute } from '@angular/router';
import { UtilService } from './../../../services/util.service';
import { Router } from '@angular/router';
import { ApiService } from './../../../services/api.service';
import { AppSettings } from './../../../services/AppSettings';
import { Component, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { candidateModel } from 'src/app/services/candidateModel';
import { JobService } from 'src/app/services/job.service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-candidate-like',
  templateUrl: './candidate-like.component.html',
  styleUrls: ['./candidate-like.component.scss'],
  inputs: ['candidateDetails']
})

export class CandidateLikeComponent implements OnInit, OnChanges {

  candidateId: any;
  candidateDetails: candidateModel;
  values: any;
  counterpartsDetails: any;
  connectionRequestRef: BsModalRef;
  connectionStatus: string;
  LoginUserId=localStorage.getItem('userId')
  stopscrollFlag: boolean = false
  loadAPIcall:boolean=false;

  constructor(private api: ApiService, private router: Router, private modalService: BsModalService,private util: UtilService, private a_route: ActivatedRoute,
    private JobServicecolor: JobService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.candidateDetails && changes.candidateDetails.currentValue) {
      this.candidateDetails = changes.candidateDetails.currentValue;
      if (this.candidateDetails.candidateId) {
        this.likedByList=[];
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

  likedByList: any = []
  ngOnInit() {
  }

  searchConfig: any = {
    pageNumber: 0,

  }
  getViews() {
    if (this.loadAPIcall) {
      return; // Prevent multiple simultaneous API calls
    }

    this.searchConfig.candidateId = this.candidateDetails.candidateId;
    this.searchConfig.limit = 10;

    this.loadAPIcall = true;

    this.api.create('candidates/findCandidatesLikedBy', this.searchConfig).subscribe(res => {
      this.loadAPIcall = false;
      if (res.code !== '00000' || !res.data || !res.data.likedByList.length) {
        this.stopscrollFlag = true;
        return;
      }
      if (res.code == '00000' && res.data && res.data.likedByList) {
        this.stopscrollFlag = res.data.likedByList.length < 9;

        if (!this.stopscrollFlag) {
          this.searchConfig.pageNumber++;
        }

        // Add unique items from API response to likedByList
        res.data.likedByList.forEach(ele => {
          if (ele.logo) {
            ele.logo = AppSettings.photoUrl + ele.logo;
          } else {
            ele.logo = null;
          }

          // Check if the element already exists in likedByList based on candidateId
          const existingCandidate = this.likedByList.find(item => item.userId === ele.userId);
          if (!existingCandidate) {
            this.likedByList.push(ele);
          }
        });
      }
    });
  }







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
