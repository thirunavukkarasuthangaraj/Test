import { EventEmitter, Output, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from './../../services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss']
})
export class FlagComponent implements OnInit {

  @Input() type = '';
  @Input() flags: Array<string> = [];
  @Input() id = '';
  @Input() flagTo = '';
  @Output() onReport = new EventEmitter();


  otherdata: string;
  favoriteSeason: string;
  modalRef: BsModalRef;
  showother: Boolean = false;
  seletedflagType: string;
  constructor(private util: UtilService, private modalService: BsModalService, private apiService: ApiService) { }

  ngOnInit(): void {
   }
   openmodel(template: TemplateRef<any>) {
    this.util.startLoader();
    this.otherdata = undefined;
    this.modalRef = this.modalService.show(template);
    setTimeout(() => {
      this.util.stopLoader();
    }, 500);
  }



  onClick() {

    if (this.type == "USER") {
      this.type = "UserFeed"
    } else if (this.type == "BUSINESS") {
      this.type = "BusinessFeed"
    } else if (this.type == "NETWORK") {
      this.type = "NetworkFeed"
    } else if (this.type == "TEAM") {
      this.type = "TeamFeed"
    } else if (this.type == "COMMUNITY") {
      this.type = "CommunityFeed"
    } else if (this.type == "JOB") {
      this.type = "JobFeed"
    }
    else if (this.type == "CANDIDATE") {
      this.type = "CandidateFeed"
    }


    let obj:any = { flagFrom: localStorage.getItem('userId'), flagTo: this.flagTo, flaggedOnType: this.type, v: this.seletedflagType, flagType: this.seletedflagType, flagStatus: 'OPEN', flaggedOnId: this.id }

    if(this.seletedflagType=='Other'){
      obj.flagContent=this.otherdata;
    }
    this.util.startLoader();
    this.apiService.create("flag/create", obj).subscribe((res) => {
      this.util.stopLoader();
      if (res.code == "00000") {
        if (this.type == "JobFeed") {
          Swal.fire("Your report has been sent.");
        } else if (this.type == "CandidateFeed") {
          Swal.fire("Your report has been sent.");
        } else {
          Swal.fire("This post has been successfully reported as " + this.seletedflagType);
        }
      } else {
        Swal.fire("Reported failed please try again");
      }

    }, err => {
      this.util.stopLoader();
    });
  }


  onchange(item) {
    this.showother = false;
    this.seletedflagType = item;
  }


  submit() {
     this.onReport.emit(this.id);
    if (this.seletedflagType != undefined) {
      if (this.seletedflagType != "Other") {
        this.onClick();
        this.showother = false;
        this.otherdata = undefined;
        this.modalRef.hide();
      }
      else if (this.seletedflagType == "Other" && this.otherdata != undefined) {
        this.onClick();
        this.showother = false;
        this.otherdata = undefined;
        this.modalRef.hide();
      } else {
        Swal.fire("Please Enter Other data");
        this.showother = true;
      }
    } else if (this.seletedflagType == undefined) {
      Swal.fire("Please check any values from list");
    }

  }

  other() {
    this.showother = true;
    this.seletedflagType = "Other";

  }
}
