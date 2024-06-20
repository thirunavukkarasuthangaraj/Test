import { CommonValues } from 'src/app/services/commonValues';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList,TemplateRef,ViewChild, ViewChildren} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { startWith,map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


interface JosnData {
  id: number;
  order: number;
  question: string;
  answer: string;
  module: string;
  mediaType: string;
  searchText: string;
  duration:string
}
@Component({
  selector: 'app-help-search',
  templateUrl: './help-search.component.html',
  styleUrls: ['./help-search.component.scss']
})

export class HelpSearchComponent implements OnInit,AfterViewInit {

  PayloadforFAQ={
    "mediaType": "Video",
    "module": "",
    "searchText": ""
   }
  myControl = new UntypedFormControl();
  searchControl = new UntypedFormControl();
  filteredOptions: Observable<JosnData[]>;
  options= [];
  selectedIndex: number = 0;
  videoStart: number = 6;
  loadAPIcall:boolean=false;
  @ViewChild('templateVideo', { static: true }) templateVideo: TemplateRef<any>;
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChildren('videoElements') videoElements: QueryList<ElementRef>;
  constructor(private api: ApiService,private route: ActivatedRoute,private location: Location, private commonValues:CommonValues,  private modalService: BsModalService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const search = params.query;
      this.PayloadforFAQ.searchText=search;
      if (search) {
        this.searchControl.patchValue(search);
      }
      this.FAQAPIcall()

    });

  }



  ngAfterViewInit(): void {
    this.videoElements.forEach((elem) => {
      const video: HTMLVideoElement = elem.nativeElement;
       video.addEventListener('loadedmetadata', () => {
        video.currentTime = 6;
      });

      video.onseeked = () => {
        video.pause();
      };
    });
  }


   private _filter(value: string): JosnData[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.question.toLowerCase().includes(filterValue));
  }
  helpDetails = [];
  temphelpDetails = [];
  candidateVideos = [];
  connectionVideos = [];
  jobVideos = [];
  teamVideos = [];
  networkVideos = [];
  messageVideos = [];
  businessVideos = [];
  communityVideos = [];
  generalVideos = [];

  clearMethod(){
    this.helpDetails = [];
    this.temphelpDetails = [];
    this.candidateVideos = [];
    this.connectionVideos = [];
    this.jobVideos = [];
    this.teamVideos = [];
    this.networkVideos = [];
    this.messageVideos = [];
    this.businessVideos = [];
    this.communityVideos = [];
    this.generalVideos = [];
  }

  FAQAPIcall() {
    this.loadAPIcall=true;
    this.api.create("home/findFAQs", this.PayloadforFAQ).subscribe((res) => {
      this.loadAPIcall=false;
      if (res.code === '00000') {
        this.clearMethod();
        this.helpDetails = this.filteredOptions = this.options = this.temphelpDetails= res.data.faqList;
          if (this.helpDetails.length!=0) {
           this.helpDetails=res.data.faqList;
          this.jobVideos = res.data.faqList.filter(video => video.module === 'JOB');
          this.candidateVideos = res.data.faqList.filter(video => video.module === 'CANDIDATE');
          this.connectionVideos = res.data.faqList.filter(video => video.module === 'CONNECTION');
          this.teamVideos = res.data.faqList.filter(video => video.module === 'TEAM');
          this.networkVideos = res.data.faqList.filter(video => video.module === 'NETWORK');
          this.messageVideos =res.data.faqList.filter(video => video.module === 'MESSAGE');
          this.businessVideos = res.data.faqList.filter(video => video.module === 'BUSINESS');
          this.communityVideos = res.data.faqList.filter(video => video.module === 'COMMUNITY');
          this.generalVideos = res.data.faqList.filter(video => video.module === 'GENERAL');
          this.processHelpDetails(this.helpDetails);
          this.processHelpDetails(this.temphelpDetails);
         }
       }
    });
  }




  processHelpDetails(elements) {
   elements.forEach(element => {
   this.commonValues.getVideoDuration(element.answer)
  .then((duration: any) => {
    let mins = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    element.duration = mins > 0 ? `${mins}:${seconds} Sec` : `${seconds} Sec`;

  })
  .catch((error) => {
    console.error("Error loading video metadata: ", error);
   });


    this.videoElements.forEach((elem) => {
      const video: HTMLVideoElement = elem.nativeElement;
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = this.videoStart;
      }, false);
      video.onseeked = () => {
        video.pause();
      };
    });


  });
  }




  switchTab(modules){
    this.filteredOptions = this.searchControl.valueChanges.pipe(
    startWith(''), map(value => this._filter(value)));
    this.selectTabBasedOnResponse(modules);
  }

 selectTabBasedOnResponse(moduleName: string) {
   const tabIndexMap = {'All':0,'Job': 1,'Candidate': 2,  'Team': 3, 'Network': 4, 'Message': 5, 'Business': 6, 'Community': 7, 'General': 8 };
   let formattedData = moduleName.charAt(0).toUpperCase() + moduleName.slice(1).toLowerCase();
   this.selectedIndex = tabIndexMap[formattedData] || 0;
  }



  searchFilter(){
    this.PayloadforFAQ.searchText=this.searchControl.value;
    this.PayloadforFAQ.module=""
    this.FAQAPIcall();
   }

   clearfilter(){
    this.searchControl.reset();
    this.PayloadforFAQ.searchText="";
    this.FAQAPIcall();
   }



  viewPage(option){
    this.openVideo(option, this.templateVideo)
 }



  // Model open
  ModelforVideo: BsModalRef;
  seletedVideo;
  isVideoPaused: boolean = false;

  openVideo(video,videotemplate?: TemplateRef<any>) {
     this.seletedVideo=video;
     this.isVideoPaused = true;
 }

 goBack(): void {
  this.location.back(); // Navigate to the previous page in history
}

  // Bottom Chat
  closeModel(){
     this.isVideoPaused=false;
     this.searchControl.reset();
     this.PayloadforFAQ.searchText=""
     this.FAQAPIcall();
  }

  ContactAdmin() {
    let data: any = {}
    data.userId = localStorage.getItem('userId');
    data.groupType = "SUPPORT";
     let url = "findContactsByRefererId";
     this.api.messagePageService('POST', url, data).subscribe(res => {
      console.log("res", res);
      var userData: any = {};
      userData.groupId = null;
      if (res.length != 0) {
        userData.groupId = null;
        if (res[0].groupId) {
          userData.groupId = res[0].groupId;
        }
      }
      this.messageData = [];
      this.messagemodelflag = true;
      this.messageData.onlySupport = "SUPPORT";
      this.messageData.groupType = "SUPPORT";
      this.messageData.messageType = "SUPPORT";
      this.messageData.userId = localStorage.getItem('userId');
      this.messageData.id =  userData.groupId;
    });
  }

  messageData: any;
  messagemodelflag = false;
  closeMessage(event) {
    this.messagemodelflag = false;
  }



}
