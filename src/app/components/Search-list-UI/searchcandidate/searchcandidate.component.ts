import { ActivatedRoute } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/services/AppSettings';

@Component({
  selector: 'app-searchcandidate',
  templateUrl: './searchcandidate.component.html',
  styleUrls: ['./searchcandidate.component.scss']
})
export class SearchcandidateComponent implements OnInit {
  photoId;
  totalCandiateCount: any;

  constructor(private util: UtilService, private API: ApiService,private route: ActivatedRoute) { }
  navaData
  srarch
  clearInput = new UntypedFormControl();
  candiateData=true;
  allcandidate;
  lenght;
  selColor: string;

  title:string = "Candidate";
  colors: Array<any> = ['hgreen', 'hred', 'horange', 'hyellow'];

  randomColor(): void {
    this.selColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }
  ngOnInit() {
    this.route.queryParams.subscribe((data)=>{
      ////// console.log('datanav',data)
      this.navaData =data.data;
      this.srarch = data.searchData;
      // this.name = data.searchData

    });
    if(this.navaData != 'undefined' && this.srarch != 'undefined'){

      this.loadInitPost();
    }else{
          this.loadInitPost()

    }

  }
  loadInitPost() {
    let obj: any = {
      searchContent: this.srarch,

      source: {
        all: false,
        myCandidates: true,
        teamCandidates: false,
        benchCandidates: true,
        isFeatured: false,
        suggestedCandidates: false,
      },
      workType: {
        all: false,
        remoteWork: false,
        relocationRequired: false,
        workFromHome: false,
      },
      clientType: [],
      availableIn: [],
      status: [],
      searchAfterKey: null,
      city: null,
      state: null,
      country: null,
      limit: 10,
      userId: localStorage.getItem('userId'),
    };
     // const data = {'search': this.srarch,
     //    // 'searchContent':'ALL',
     //    'searchContent': 'JOB',
     //    'loginUserId':localStorage.getItem('userId'),
     //    'page': {
     //            'offSet': 0,
     //            'pageCount': 50
     //            }
     //    };
        this.util.startLoader()
     this.API.create("candidates/filter", obj).subscribe(res => {
       this.util.stopLoader()
       this.dynamicdata= res;

       ////// console.log("user data :",data.users);
       this.allcandidate = res.data.candidateList;


       this.totalCandiateCount = res.data.totalCandidatesCount;

       this.lenght = res.data.candidateList.length;
       this.allcandidate.forEach(element => {
        element.photo = AppSettings.photoUrl+ element.photo;
        element.businessColor = this.colors[Math.floor(Math.random() * this.colors.length)];

       });
       this.photoId = this.allcandidate.photo
       ////// console.log(this.lenght);
      },err => {
        this.util.stopLoader();

       });

    }

    candidateSearchdata(val){
      let searchkey =this.clearInput.value;

      //this.businessData1 = true;
      let obj: any = {
        searchContent: this.clearInput.value,

      source: {
        all: false,
        myCandidates: true,
        teamCandidates: false,
        benchCandidates: true,
        isFeatured: false,
        suggestedCandidates: false,
      },
      workType: {
        all: false,
        remoteWork: false,
        relocationRequired: false,
        workFromHome: false,
      },
      clientType: [],
      availableIn: [],
      status: [],
      searchAfterKey: null,
      city: null,
      state: null,
      country: null,
      limit: 10,
      userId: localStorage.getItem('userId'),
      }
   this.util.startLoader()
   this.API.create("candidates/filter", obj).subscribe(res => {
    //////// console.log('businessDataSearch(busn)',res)
        this.util.stopLoader()
        this.allcandidate = res.data.candidateList;
       this.lenght = res.data.candidateList.length;
       this.totalCandiateCount = res.data.totalCandidatesCount;
      this.dynamicdata= res;
      this.allcandidate.forEach(element => {
        element.photo = AppSettings.photoUrl+ element.photo;
        element.businessColor = this.colors[Math.floor(Math.random() * this.colors.length)];

       });
       this.photoId = this.allcandidate.photo
    },err => {
      this.util.stopLoader();

     });

    }

  dynamicdata(arg0: string, dynamicdata: any) {
    throw new Error("Method not implemented.");
  }

  clearData(){
    this.candiateData = true;
    this.clearInput.reset();
  ////// console.log('cleare Data')
  }

}
