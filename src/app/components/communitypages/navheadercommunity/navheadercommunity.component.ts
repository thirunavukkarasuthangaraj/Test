import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonValues } from 'src/app/services/commonValues';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { BusinessProfileComponent } from '../../bussinesspages/business-profile/business-profile.component';
import { BusinessFollowerComponent } from '../../bussinesspages/business-follower/business-follower.component';
 import { BusinessAdminComponent } from '../../bussinesspages/business-admin/business-admin.component';
import { BusinessEmployeeComponent } from '../../bussinesspages/business-employee/business-employee.component';
import { BussinessPostComponent } from '../../bussiness-post/bussiness-post.component';
import { ActivatedRoute } from '@angular/router';
import { InvitesendComponent } from '../invitesend/invitesend.component';
import { UtilService } from 'src/app/services/util.service';
// import { BussinessPostComponent } from '../../bussiness-post/bussiness-post.component';

@Component({
  selector: 'app-navheadercommunity',
  templateUrl: './navheadercommunity.component.html',
  styleUrls: ['./navheadercommunity.component.scss']
})
export class NavheadercommunityComponent implements AfterViewInit, OnInit {

  @ViewChild('communitymenusticky') communitymenustic: ElementRef;
  communitymenustick: boolean = false;

  clickEventsubscription: Subscription;

   commondata : any = {}
   active
   // commondata

  allroles: any = []
  selectedRole = '13';
  selectedDetails: any = [];
  screenData: any = []
  serviceData: any = [];
  roleData: any = [];
  rolescreenMap = {};
  groupedMenu = []
  panelOpenState = false;

  communitymembers = true;
  communitymanagepage = true;

  notificationList: any = [];

  InviteUsers:any;



 values:any={}
  navigationMenu=[]
  navigationadminMenu=[]
  selectedItem
  submenuData
  membersflage = true;
  isJoined
  isAdmin
  isCommunitySuperAdmin
  joined:Boolean=false;
  isSuperAdmin:any ;
  communityType:any;

  constructor( private commonvalues: CommonValues,

    private about: BusinessProfileComponent,
    private follower: BusinessFollowerComponent,
    private people: BussinessPostComponent,
    private api: ApiService,
    private util: UtilService,
    private adminadd: BusinessAdminComponent,
    private employee: BusinessEmployeeComponent,
    private route: ActivatedRoute,
    private inivateData: InvitesendComponent) {
       this.clickEventsubscription = this.commonvalues.getbusinessid().subscribe((res) => {
        this.commondata = res;
        this.membersflage=res.membersflage;
       })
    }

    ngOnInit() {
      setTimeout(() => {
        this.companydetailsapicall()
      }, 800);
      this.isSuperAdmin=localStorage.getItem('isSuperAdmin');
      //console.log('this.isSuperAdmin',this.isSuperAdmin)

    }

    @HostListener('window:scroll')
    handleScroll(){
      const windowScroll = window.pageYOffset;
      if(windowScroll >= 330){
        this.communitymenustick = true;
      } else {
        this.communitymenustick = false;
      }
    }

    companydetailsapicall(){
      this.route.queryParams.subscribe((res) => {
         this.values.communityId=res.communityId;
         if(res.menu == 'request'){
          this.communitymembers = false
         }
       });

       this.api.query('community/details/'+this.values.communityId).subscribe(res=>{
        this.values.joinReqCnt = res.data.communityDetails.joinReqCnt;
        this.communityType = res.data.communityDetails.communityType;
        localStorage.setItem('reqcount',res.data.communityDetails.joinReqCnt);
        },err => {
          this.util.stopLoader();
        });
    }

     ngAfterViewInit( ): void {
      setInterval(() => {
             this.values.joinReqCnt=localStorage.getItem('reqcount');
             this.values.joined = localStorage.getItem('isJoined');
             this.isSuperAdmin=localStorage.getItem('isSuperAdmin');
             this.isJoined = localStorage.getItem('isJoined')
             this.isAdmin = localStorage.getItem('communityAdmin');
             this.isCommunitySuperAdmin = localStorage.getItem('communitySuperadmin');
      }, 700);

     }



    submenu(value){
      this. companydetailsapicall();

      if(value =='managepages'){
        this.communitymembers = true;
        // this.communitymanagepage = false;
        this.communitymanagepage = false;

       }
    }

    comMethod(value){
      this. companydetailsapicall();
      // this.inivateData.members();
      if(value =='managepages'){
        this.communitymembers = true;
        this.communitymanagepage = false;

       }else if(value=='memberspage'){
        this.communitymembers = false;
        this.communitymanagepage = true;

      }
        //this.selectedItem = data;
     this.commondata.menu = value
     //console.log('this.commondata.menu = value', value)

     if(this.commondata.adminviewnavigation){
       this.commondata.viewadmin=true
      }

      this.commondata.menu = "communityhome";
      if(value=="communityhome"){
        this.commondata.menu = "communityabout";
       }
      this.commonvalues.businessid(this.commondata);

      setTimeout(() => {
       this.commondata.menu = value;
       this.commonvalues.businessid(this.commondata);
      }, 10);


     if (value === 'communityabout'){
       this.about.getbussinessId( this.commondata.businessId, this.commondata.admin)

     }

    }

  menuclick(value){

    //this.selectedItem = data;
     this.commondata.menu = value


    if(this.commondata.adminviewnavigation){
      this.commondata.viewadmin=true
     }

     this.commondata.menu = "communityhome";
     this.commonvalues.businessid(this.commondata);

     setTimeout(() => {
      this.commondata.menu = value;
      this.commonvalues.businessid(this.commondata);
     }, 10);


    if (value === 'communityabout'){
      this.about.getbussinessId( this.commondata.businessId, this.commondata.admin)

    }


  }


}

