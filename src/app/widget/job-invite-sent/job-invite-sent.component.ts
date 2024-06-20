import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { CandidateService } from 'src/app/services/CandidateService';
import { candidateModel } from 'src/app/services/candidateModel';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-job-invite-sent',
  templateUrl: './job-invite-sent.component.html',
  styleUrls: ['./job-invite-sent.component.scss']
})
export class JobInviteSentComponent implements OnInit {
  page: any;
  pageName: string = 'job-invite-sent';
  invitedCandidateList = new BehaviorSubject<any>([]);
  invitedCandidateListAfterKey : string;
  invitedCandidateListStopScroll : boolean = false;
  loadAPIcall:boolean=false;

  URL = "candidates/findCandidatesInvitedByTheUser";
  obj: any = {
    limit: 10,
    searchAfterKey : null,
    userId: localStorage.getItem('userId')
  }
  totalCount : any = 0;
  constructor(private candidateService : CandidateService ,
    private util :UtilService , private provider :countProvider) { }


  ngOnInit() {
    this.apiCall();
  }

  apiCall() {

    this.loadAPIcall=true;
    this.candidateService.findCandidatesInvitedByTheUser(this.obj).subscribe((response: any) => {
      this.loadAPIcall=false;
      const responseData = response.candidatesInvitations;
      if (response && responseData) {
        const afterKey = response.searchAfterKey;

        if(this.invitedCandidateListAfterKey === afterKey || responseData.length === 0){
          this.invitedCandidateListStopScroll = true;
        }

        const data = responseData.map((item: any) => {
          return { ...item, candidateEntity: { ...item.candidateEntity, currentStatus: item.currentStatus }, user: item.user };
        });
        if (this.invitedCandidateListAfterKey !== afterKey) {
          const combinedResponse = [...this.invitedCandidateList.getValue() , ...data];

          this.invitedCandidateList.next(combinedResponse);

        }
        this.invitedCandidateListAfterKey = afterKey;

        if (this.totalCount === 0) {
          this.totalCount = response.total;
          this.provider.setCount(this.totalCount);
        }
      }
      this.util.stopLoader();
    }, err=>{
      this.util.stopLoader();
    });
  }

  pagecount(event) {
    this.page = event;
    this.obj.pageNumber = this.page - 1;
    this.apiCall();
  }


  onScrollDown(){

    if(!this.invitedCandidateListStopScroll&& this.obj.searchAfterKey != this.invitedCandidateListAfterKey){
      this.obj.searchAfterKey = this.invitedCandidateListAfterKey;
      this.apiCall();
    }

  }

}
