 import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subscription, fromEvent } from "rxjs";
import { map, throttleTime } from 'rxjs/operators';
import { PricePlanService } from 'src/app/components/Price-subscritions/priceplanService';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { UserService } from 'src/app/services/UserService';
import { ApiService } from "src/app/services/api.service";
import { GigsumoService } from 'src/app/services/gigsumoService';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';
import { SearchData } from "src/app/services/searchData";
import { UserModel, WorkExperience } from 'src/app/services/userModel';
import { UtilService } from "src/app/services/util.service";
import { CreateteamModelComponent } from "../../model/createteam-model/createteam-model.component";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.scss"],
})
export class TeamComponent implements OnInit {
  @ViewChild('myButton') myButton: ElementRef;
  @ViewChild("landingside1") menuElement: ElementRef;
  landingsidesticky1: boolean = false;
  landingsidesticky2: boolean = false;
  elementPosition: any;
  teamSearch: string;
  commonVariables: any = {};
  bsModalRef: BsModalRef;
  teamdata: any = [];
  teamlist: any;
  tempteamlist: any = [];
  teamlistuserdata: any = [];
  status = "all";
  loadAPIcall:boolean=false
  search: any;
  showNoDatafound: boolean = false;
  allTeams = true;
  showWorkExpereince : boolean = false;
  activeTeams = false;
  RequestsReceived = false
  noDatafound : Array<string>;
  noRequestReceived : Array<string> = ["You have no requests remaining"];
  searchKey
  subscriber: Subscription;
  popupvisible:boolean=false
  userType: any = localStorage.getItem('userType');
  userId: string =  localStorage.getItem('userId');
  supportModal: any;

  constructor(
    private api: ApiService,
    private searchData: SearchData,
    private modalService: BsModalService,
    private util: UtilService,
    private userService: UserService,
    private router: Router,
    private gigsumoService: GigsumoService,
    private pricePlan: PricePlanService,
    private route: ActivatedRoute
) {
    const myButton = document.getElementById('myButton');
    if (myButton) {
        fromEvent(myButton, 'click')
            .pipe(
                throttleTime(1000) // 1 second throttle
            )
            .subscribe(() => {
                this.openModalWithComponent();
            });

    }

}

  userDataModel : any  = {};

  ngOnInit() {
    // this.getUserDetails();
    this.updateSupportModule();
    if (
      this.route.queryParams["_value"].routeFrom != "" &&
      this.route.queryParams["_value"].routeFrom != undefined &&
      this.route.queryParams["_value"].routeFrom != null
    ) {
      this.filterApi("invites_received");
    } else {
       this.filterApi(this.status);
    }
  }


  async getUserDetails() : Promise<Record<string , boolean | any>> {

    const profileData = await this.userService.userProfileDetails({userId : this.userId , userType  : this.userType});
    const { exeperienceList } =  profileData;
    let hasCurrentOrganization : boolean = false;
    if(Array.isArray(exeperienceList) && exeperienceList.length > 0){
        exeperienceList.forEach((element : WorkExperience)=>{
          if(element.currentOrganization){
            hasCurrentOrganization = true;
          }
        });
    }
    else  hasCurrentOrganization = false;
    return {hasCurrentOrganization : hasCurrentOrganization  , data : exeperienceList};

   }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    // this.elementPosition = this.menuElement.nativeElement.offsetTop;
    // ////// console.log(this.elementPosition);
  }

  @HostListener("window:scroll")
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 24) {
      this.landingsidesticky1 = true;
      this.landingsidesticky2 = true;
    } else {
      this.landingsidesticky1 = false;
      this.landingsidesticky2 = false;
    }
  }
  no_of_Team:number
  TeamCreateLimit:{length:number,memberType:boolean}
  filterteam(val:any){

    var userid =localStorage.getItem("userId");
    this.util.startLoader();

   if(val=="ACTIVE"){

    this.api.query("teams/getAllteams/" + userid).pipe(
      map(res =>{
        return res.data.AllTeams.filter(active => active.status == val)
      })
    ).subscribe((res:any)=>{
       if(res!=null || undefined){
      this.teamlist = res
      this.teamLength= this.teamlist.length
      this.util.stopLoader();
      }
    })

  }
    if(val=="DEACTIVATED"){

     this.api.query("teams/getAllteams/" + userid).pipe(
        map(res =>{
          return res.data.AllTeams.filter(active => active.status == val)
        })
      ).subscribe((res:any)=>{
         if(res!=null || undefined){
        this.teamlist = res
        this.teamLength= this.teamlist.length
        this.util.stopLoader();
        }
      })

    }
    let t = val;
    t = t === "all" ? "All Teams" : t === "ACTIVE" ? "Active Teams" :
    t === "DEACTIVATED" ? "Deactive Teams" : t;
    let [first , ...rest] = t;
    this.btnnameshow = first + rest.join("").toLowerCase();
  }


  teamLength: number = 0;
  allQueryteams() {
    this.loadAPIcall=true
    this.showNoDatafound = false;
    this.api
      .query("teams/getAllteams/" + localStorage.getItem("userId"))
      .subscribe((res) => {
        this.loadAPIcall=false
       this.no_of_Team= res.data.AllTeams.filter(res=>res.memberType==='OWNER').length
        this.TeamCreateLimit={
          length:res.data.AllTeams.length,
          memberType: res.data.AllTeams.some(res=>res.memberType==='OWNER')
         }

         this.teamlist = res.data.AllTeams;
        if(this.teamlist.length>0){
          this.teamLength = this.teamlist.length
        }else{
          this.teamLength = 0;
        }
        this.teamlist.sort(this.dynamicSort("teamName"));
        if(this.teamlist.length>0){
          this.teamLength = this.teamlist.length
        }else{
          this.teamLength = 0;
        }


        if (res.data.AllTeams != null && res.data.AllTeams != undefined && res.data.AllTeams != "") {
          this.teamlist.forEach((element, i) => {

                element.name = element.adminUserData.fullName;
                element.index = 2;
                if ( element.adminUserData.userId == localStorage.getItem("userId")) {
                  element.index = 1;
                  this.teamlist = this.sort_by_keyuserid(this.teamlist, 'index')
                  this.tempteamlist=this.teamlist;

                  if(this.teamlist.length>0){
                    this.teamLength = this.teamlist.length
                  }else{
                    this.teamLength = 0
                  }

                }


          });

        }else{
          this.showNoDatafound = true;
          this.noDatafound = [
            'b Please do one of the below, for Teams to be listed in the page',
            '1 . Update your profile with your company business email ID.',
            '2 . Complete your current work experience section in your profile.',
            '3 . Connect with colleagues on the platform.',
            '4 . Create a Team and add your colleagues to the Team.'
          ];
          this.showNoRequestReceived = false;
        }

      },err => {
        this.util.stopLoader();
        this.loadAPIcall=false
      });
    this.util.stopLoader();
  }

  sort_by_keyuserid(array, key) {
    return array.sort(function (a, b) {
      return parseInt(a.index) - parseInt(b.index);
    });

  }

  queryteams() {

    this.showNoDatafound = false;
    this.api
      .query("teams/home?userId=" + localStorage.getItem("userId") + "&limit=6&offset=0").subscribe((res) => {

        if (res.data.teams != null && res.data.teams != undefined && res.data.teams != "") {
          this.teamlist = res.data.teams;

          if(this.teamlist.length>0){
            this.teamLength = this.teamlist.length
          }else{
            this.teamLength = 0
          }

          this.teamlist.sort(this.dynamicSort("teamName"));
          this.teamlist.forEach((element, i) => {

                element.name = element.fullName;
                element.index = 2;
                if (element.userId == localStorage.getItem("userId")) {
                  element.index = 1;
                  this.teamlist = this.sort_by_keyuserid(this.teamlist, 'index');
                  this.tempteamlist=this.teamlist;

                }

            },err => {
              this.util.stopLoader();
            });
        }else{
          this.showNoDatafound = true;
          this.showNoRequestReceived = false
        }

      });
    this.util.stopLoader();
  }

  keyupdata(event){
    if(event.target.value.length==0){
      this.onsearch('');
    }
  }
  showNoRequestReceived: boolean = false
  onsearch(val) {
    this.search = val;
    if(val!=undefined){
      val = val.trim().toLowerCase();
    }
     this.teamlist =this.tempteamlist

     if(this.teamlist.length>0){
      this.teamLength = this.teamlist.length
    }else{
      this.teamLength = 0
    }

     this.teamlist = this.filterByString(this.teamlist, val);
    if (this.teamlist.length == 0) {
      this.showNoDatafound = true;
      this.showNoRequestReceived = false
    } else {
      this.showNoDatafound = false;
    }

  }
  filterByString(data, s) {
    return data.filter(e => e.teamName.toLowerCase().includes(s))
      .sort((a, b) => a.teamName.toLowerCase().includes(s) && !b.teamName.toLowerCase().includes(s) ? -1 : b.teamName.toLowerCase().includes(s) && !a.teamName.toLowerCase().includes(s) ? 1 : 0);
 }

  btnnameshow: any;

  filterName : string = "All Teams"
  filterApi(filter) {
    if(filter!=undefined){
      this.status = filter;
     }
     this.teamlist = [];
    this.showNoDatafound = false;
    if (this.status === "invites_received") {
      this.allTeams = false;
      this.activeTeams = false;
      this.RequestsReceived = true
      this.btnnameshow = "Requests Received";

      localStorage.setItem("acceptRejectBtn", "true");
      var usId = localStorage.getItem("userId");
      this.util.startLoader();
      this.showNoDatafound = false;
      this.api.query("teams/pending/invites/" + usId)
        .subscribe((res) => {
          this.teamlist = [];
          this.teamLength = res.data.Teams.length

          if ( res.data.Teams && res.data.Teams!= 0 && res.data.Teams!= null && res.data.Teams != undefined) {
            res.data.Teams.sort(this.dynamicSort("teamName"));
            res.data.Teams.forEach((element, i) => {
              this.api
                .query("user/" + element.teamsOwnerId)
                .subscribe((user: any) => {
                  element.name = user.firstName + " " + user.lastName;
                  if (user.userId == localStorage.getItem("userId")) {
                    var b =res.data.Teams[i];
                    res.data.Teams[i] =res.data.Teams[0];
                    res.data.Teams[0] = b;
                  }
                });
            });
            res.data.Teams.forEach((element, i) => {
              if (element != null) {
                this.teamlist.push(element);
                this.tempteamlist=this.teamlist;
              }
            });
          } else{
            this.showNoDatafound = false;
            this.showNoRequestReceived = true;
          };


        },err => {
          this.util.stopLoader();
        });
      this.util.stopLoader();

    } else if (this.status === "all_teams") {
      this.allTeams = false;
      this.activeTeams = true;
      this.RequestsReceived = false
      this.btnnameshow = "Active Teams";

      localStorage.setItem("acceptRejectBtn", "false");
      this.teamlist = [];
      this.showNoDatafound = false;
      this.queryteams();
       if (this.teamlist.length == 0) {

      }
    } else if (this.status === "all") {
      this.allTeams = true;
      this.activeTeams = false;
      this.RequestsReceived = false
      this.btnnameshow = "All Teams";

      localStorage.setItem("acceptRejectBtn", "false");
      this.teamlist = [];
      this.showNoDatafound = false;
      this.allQueryteams();

    }
    let datas: any = {};
    datas.status = this.status;
    if (this.search != null && this.search != undefined) {

    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      if (sortOrder == -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    }
  }


   isCurrentOrganisation(userDataModel : UserModel) : boolean{
    return Array.isArray(userDataModel.workExperience) && userDataModel.workExperience.some(respose => respose.currentOrganization === true);
  }
  async openModalWithComponent(workExpData ?: any , val : "YES" | "NO" = "NO") {

    this.util.startLoader();
    if (!this.popupvisible) {
      this.popupvisible = true;
    }
      let response :  any = await this.getUserDetails();
      this.userDataModel =  response['data'];
     if(val === "NO"){
       if(!response['hasCurrentOrganization']){
        this.showWorkExpereince = true;
        this.popupvisible=false;
        return;
      }
    }

    const userData = await this.pricePlan.UPDATE_USERDETAILS("TEAM_WORKSPACES");
    if(userData.isExpired){
      this.popupvisible=false;
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
      userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
        if (ele.benefitKey == 'TEAM_WORKSPACES') {
          availablePoints = ele.available
          actualPoints = ele.actual
          utilizedPoints = ele.utilized
          promotional = ele.promotional
        }
      })
      this.pricePlan.expiredPopup("TEAM_WORKSPACES", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);

      return;
    }
    else{
       this.afterPLanValidation(workExpData , val);
    }
  }
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
  };

  onSubmit(data : string){
    if(data === GigsumoConstants.SUCESSCODE){
      this.allQueryteams();
    }
  }

  afterPLanValidation(workExpData ?: any , val : "YES" | "NO" = "NO"){
    const initialState: any = {
      CurrentOrganizationData : val === "YES" ? workExpData : (this.userDataModel.length > 0 &&
        this.userDataModel.find(respose => respose.currentOrganization === true))
    };
    const modalOptions = { initialState, ...this.backdropConfig };
    this.showWorkExpereince = false;
    this.popupvisible=false;
    this.bsModalRef = this.modalService.show(CreateteamModelComponent, modalOptions);
    this.bsModalRef.content.closeBtnName = "Close";
  }

  showTeamIfWorkExpSucess(item : {content : "CLOSE" | "SUCESS"  , data : WorkExperience}){

     if (item.content === "CLOSE"){
       this.showWorkExpereince = false;
      return;
    }

    if(item.data!=null){
      this.showWorkExpereince = false;
      this.userDataModel.workExperience = [item.data];
      // console.log("FINAL" , item.data);
      setTimeout(() => {
        this.openModalWithComponent(item.data  , "YES");
      }, 1000);
    }
  }


  apicall() {
    let datas: any = {};
    datas.memberUserId = localStorage.getItem("userId");
    // datas.networkId =   networkId;
    this.api.create("teams/member/save", datas).subscribe((res) => {

     },err => {
      this.util.stopLoader();

     });
  }

  messagemodelflag = false;
  messageData : any
  closeMessage(){
    this.messagemodelflag =  false;
  }

  updateSupportModule() {

    let module = new jobModuleConfig(this.openSupport);
    module.source = this;
    this.supportModal = module;
  }

  openSupport(){
    // this.closeModal();
      let data: any = {}
      data.userId = localStorage.getItem('userId');
      data.groupType = "SUPPORT";
      let url = "findContactsByRefererId";
      this.api.messagePageService('POST', url, data).subscribe(res => {

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
        this.messageData.id = userData.groupId;
      });
   }
}
