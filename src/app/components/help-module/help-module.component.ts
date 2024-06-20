import { CommonValues } from 'src/app/services/commonValues';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList,TemplateRef,ViewChild, ViewChildren} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { startWith,map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';


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
  selector: 'app-help-module',
  templateUrl: './help-module.component.html',
  styleUrls: ['./help-module.component.scss']
})

export class HelpModuleComponent implements OnInit,AfterViewInit {



  PayloadforFAQ={
    "mediaType": "Video",
    "module": "JOBS",
    "searchText": ""
   }
  myControl = new UntypedFormControl();
  searchControl = new UntypedFormControl();
  filteredOptions: Observable<JosnData[]>;
  options= [];
  selectedIndex: number = 0;
  videoStart: number = 6;
  @ViewChild('templateVideo', { static: true }) templateVideo: TemplateRef<any>;
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChildren('videoElements') videoElements: QueryList<ElementRef>;
  constructor(private api: ApiService,private router: Router,private activatedRoute: ActivatedRoute, private commonValues:CommonValues,  private modalService: BsModalService) { }
  loadAPIcall=false;
  ngOnInit() {

     this.activatedRoute.queryParams.subscribe((res) => {
      if(res.menu=="CANDIDATE"){
        this.PayloadforFAQ.module="CANDIDATES"
        this.selectedTabName="Candidates";
        this.selectedIndex=1;
      }
    })

    this.FAQAPIcall()
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
    this.jobVideos = [];
    this.teamVideos = [];
    this.networkVideos = [];
    this.messageVideos = [];
    this.businessVideos = [];
    this.communityVideos = [];
    this.generalVideos = [];
  }

  removeLastLetter(inputString: string): string {
   let keyss= inputString.toLowerCase();
    if (keyss.endsWith('s')&& keyss!="business") {
      return inputString.slice(0, -1);
    }
    return inputString;
  }

  FAQAPIcall() {
    this.loadAPIcall=true;
    this.PayloadforFAQ.module = this.removeLastLetter(this.PayloadforFAQ.module).toLocaleUpperCase();
    let  tabName =  this.removeLastLetter(this.selectedTabName);
    this.api.create("home/findFAQs", this.PayloadforFAQ).subscribe((res) => {
      this.loadAPIcall=false;
      if (res.code === '00000') {
        this.clearMethod();
        this.helpDetails = this.filteredOptions = this.options = this.temphelpDetails = res.data.faqList;
          if (this.helpDetails.length!=0) {
          tabName = tabName.toUpperCase();
          this.helpDetails=res.data.faqList.filter(detail => detail.module === tabName);
          this.jobVideos = res.data.faqList.filter(video => video.module === 'JOB');
          this.candidateVideos = res.data.faqList.filter(video => video.module === 'CANDIDATE');
          this.teamVideos = res.data.faqList.filter(video => video.module === 'TEAM');
          this.networkVideos = res.data.faqList.filter(video => video.module === 'NETWORK');
          this.messageVideos = res.data.faqList.filter(video => video.module === 'MESSAGE');
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
   const tabIndexMap = { 'Jobs': 0,'Candidates': 1,  'Teams': 2,  'Network': 3, 'Messages': 4, 'Business': 5, 'Community': 6, 'General': 7 };
  //  const tabIndexMap = { 'Jobs': 0,'Candidates': 1, 'Connections': 2 };
   let formattedData = moduleName.charAt(0).toUpperCase() + moduleName.slice(1).toLowerCase();
   this.selectedIndex = tabIndexMap[formattedData] || 0;
  }

  tabs =  [ 'Jobs','Candidates', 'Teams' ,'Network', 'Messages','Business','Community','General'];
  // tabs =  [ 'Jobs','Candidates','Connections'];

  selectedTabName: any="Jobs";
  selectTab(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedTabName = tabChangeEvent.tab.textLabel;
    this.PayloadforFAQ.module = this.selectedTabName;
    this.FAQAPIcall()

  }

  searchFilter( ){
    console.log("get values from",this.searchControl.value)
    this.router.navigate(['/helpSearch'], { queryParams: { query: this.searchControl.value } });
   }

   clearfilter(){
    this.searchControl.reset();
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


  // Bottom Chat
  closeModel(){
     this.isVideoPaused=false;
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
