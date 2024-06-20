import { values } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-searchjob',
  templateUrl: './searchjob.component.html',
  styleUrls: ['./searchjob.component.scss']
})
export class SearchjobComponent implements OnInit {
  totalJobsCount: any;

  constructor(  private util: UtilService, private API: ApiService,     private route: ActivatedRoute,
    ) { }
    colors: Array<any> = ['hgreen', 'hred', 'horange', 'hyellow'];

  randomColor(): void {
    this.selColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }
  alljob;
  lenght;
  selColor: string;

  srarch;
  navaData;
  title:string = "Jobs";
  photoId;
  jobData=true;
  passValues=true;
  clearInput = new UntypedFormControl();
  @Input() searchText ;


  ngOnInit() {
    this.route.queryParams.subscribe((data)=>{
      ////// console.log('datanav',data)
      this.navaData =data.data;
      this.srarch = data.searchData;
      // this.name = data.searchData

    })
    // this.loadInitPost()
    if(this.navaData != 'undefined' && this.srarch != 'undefined'){

      this.loadInitPost();
    }else{
      this.loadInitPost();
    }

  }

  loadInitPost() {
    let obj: any = {
      searchContent: this.srarch,
      searchAfterKey: null,
      source: {
        all: false,
        myJobs: true,
        teamJobs: false,
        recruiterJobs: true,
        isFeatured: false,
        suggestedJobs: false,
      },
      workType: {
        all: false,
        remoteWork: false,
        relocationRequired: false,
        workFromHome: false,
      },
      experienceFrom: null,
      experienceTo: null,
      country: null,
      state: null,
      city: null,
      zipcode: null,
      limit: 10,
      userId: localStorage.getItem('userId'),
      jobClassification: [],
      clientType: [],
      status: [],
    };

 this.util.startLoader()
 this.API.create("jobs/filter", obj).subscribe(res => {
      this.util.stopLoader()
      this.dynamicdata= res;

      ////// console.log("user data :",data.users);
      this.alljob = res.data.jobList;
      this.lenght = res.data.jobList.length;
      this.totalJobsCount = res.data.totalJobsCount;

      this.alljob.forEach(element => {

        element.user.photo= AppSettings.photoUrl+ element.user.photo;
        element.businessColor = this.colors[Math.floor(Math.random() * this.colors.length)];

       });
      //  this.img = this.alljob.photo
      ////// console.log(this.lenght);
     },err => {
       this.util.stopLoader();

      });

   }

   jobDataSearch(val){
    let searchkey =this.clearInput.value;

    //this.businessData1 = true;
    let obj: any = {
      searchContent: this.clearInput.value,
      searchAfterKey: null,
      source: {
        all: false,
        myJobs: true,
        teamJobs: false,
        recruiterJobs: true,
        isFeatured: false,
        suggestedJobs: false,
      },
      workType: {
        all: false,
        remoteWork: false,
        relocationRequired: false,
        workFromHome: false,
      },
      experienceFrom: null,
      experienceTo: null,
      country: null,
      state: null,
      city: null,
      zipcode: null,
      limit: 10,
      userId: localStorage.getItem('userId'),
      jobClassification: [],
      clientType: [],
      status: [],
    };
 this.util.startLoader()
 this.API.create("jobs/filter", obj).subscribe(res => {
  //////// console.log('businessDataSearch(busn)',res)
      this.util.stopLoader()
    this.dynamicdata= res;
    this.alljob = res.data.jobList;
      this.lenght = res.data.jobList.length;
      this.totalJobsCount = res.data.totalJobsCount;

      this.alljob.forEach(element => {
        element.photo = AppSettings.photoUrl+ element.photo;
        element.businessColor = this.colors[Math.floor(Math.random() * this.colors.length)];

       });
       this.photoId = this.alljob.photo
    //////// console.log('bData=>>>', this.businessPages)
    // this.alljob.forEach(element => {
    //   element.businessLogo = AppSettings.photoUrl+ element.businessLogo;
    //   // element.businessColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    //  });
    //  this.photoId = this.alljob.businessLogo
    // ////// console.log("sBusiness search data:=>>>>",this.businessPages)
    // ////// console.log('Array length is :===>>', this.Arraylength)
  },err => {
    this.util.stopLoader();

   });

  }

  dynamicdata(arg0: string, dynamicdata: any) {
    throw new Error("Method not implemented.");
  }
  clearData(){
    this.jobData = true;
    this.clearInput.reset();
  ////// console.log('cleare Data')
  }

}
