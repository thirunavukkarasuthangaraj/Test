import { JobProfileDetailComponent } from './../../components/job-module/job-profile-detail/job-profile-detail.component';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { AppSettings } from 'src/app/services/AppSettings';
import { JobService } from 'src/app/services/job.service';
import { JobModel } from 'src/app/services/jobModel';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-jobs-appliedBy-The-user',
  templateUrl: './jobs-appliedBy-The-user.component.html',
  styleUrls: ['./jobs-appliedBy-The-user.component.scss']
})
export class JobsAppliedByTheUserComponent implements OnInit {

  jobAppliedByTheUser =new BehaviorSubject<any>([]);
  jobAppliedByTheUserAfterKey : string = "";
  jobAppliedByTheUserStopScroll :boolean = false ;
  subscription: Subscription;
  loaddata:boolean=false;
  loadAPIcall:boolean=false
  page : any;
  obj: any = {
    limit: 10,
    searchAfterKey : null,
    userId: localStorage.getItem('userId')
  }



  constructor(private jobService : JobService ,
    private util :UtilService , private provider : countProvider, private JobServicecolor: JobService,) { }

  ngOnInit() {
    this.apiCall();
    this.subscription = this.JobServicecolor.confirmationResult$.subscribe(() => {
      this.apiCall();
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
     this.subscription.unsubscribe();
   }
 }
  totalCount : any =  0;
  apiCall(){

    if(this.jobAppliedByTheUserStopScroll){
      return;
    }
    this.loadAPIcall=true;
    this.jobService.findJobAppliedByTheUser(this.obj).subscribe(res=>{
     this.loaddata=true;
     this.loadAPIcall=false;
      const resData = res.jobsApplied;
      const afterKey = res.searchAfterKey;

      if(resData){

        if(this.jobAppliedByTheUserAfterKey === afterKey || resData.length  === 0){
          this.jobAppliedByTheUserStopScroll = true;
        }

        const data = resData.map(ele => {
          if (ele.user != null) {
            if (ele.user.photo != null) {
              ele.user.photo = AppSettings.photoUrl + ele.user.photo
            } else if (ele.user.photo == null) {
              ele.user.photo = null
            }
          }

          return ele;
        });

        const combined = [...this.jobAppliedByTheUser.getValue() , ...data];
        this.jobAppliedByTheUser.next(combined);
        this.jobAppliedByTheUserAfterKey = afterKey;

        if(this.totalCount===0){
          this.totalCount = res.total;
          this.provider.setCount(this.totalCount);
        }

        this.util.stopLoader();

      }

    },err=>{
      this.loaddata=false;
      this.util.stopLoader();
    });
  }

  pagecount(event) {
    this.page = event;
    this.obj.pageNumber = event - 1;
    this.apiCall();
  }

  onScrollDown(){
    if(!this.jobAppliedByTheUserStopScroll&& this.obj.searchAfterKey != this.jobAppliedByTheUserAfterKey){
      this.obj.searchAfterKey = this.jobAppliedByTheUserAfterKey;
      this.apiCall();
    }
  }


}
