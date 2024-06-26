import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonValues } from 'src/app/services/commonValues';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { UtilService } from 'src/app/services/util.service';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-invitesend',
  templateUrl: './invitesend.component.html',
  styleUrls: ['./invitesend.component.scss']
})
export class InvitesendComponent implements OnInit {
  @Input() commonemit
     clickEventsubscription:Subscription;
   values:any={ }
  //  adminSreach:any;
   adminSreach: string;
   username
   communityId
   userData=[];
   tempminvite=[];
   communitySuperadmin
   communityName
   noDatafound : Array<string> =[ "You have no invitations sent lately"];
   showNoDatafound: boolean = false;
   searchKey
  constructor(
      private commonvalues:CommonValues,
      private route: ActivatedRoute,
      private API: ApiService,
      private router: Router ,
      private http: HttpClient,
      private util:UtilService){
      this.clickEventsubscription=this.commonvalues.getcommunitydata().subscribe((res)=>{
      this.values=res;

     })
    }

  ngOnInit() {
    this.communitySuperadmin=localStorage.getItem("communitySuperadmin")
     this.route.queryParams.subscribe((res) => {
     this.communityId=res.communityId;
     this.communityName=res.communityName;
     });

     this.values= this.commonemit
    this.members()
  }

  sort_by_key(array, key) {
    return array.sort(function(a, b) {
     var x = a[key]; var y = b[key];
     return ((x < y) ? -1 : ((x > y) ? 1 : 0));
   });
  }

  datas(datas){
    this.userData = this.sortData(datas)
    this.values.communityName= this.communityName
    this.values.invitelist= this.sort_by_key(datas,"userName");
    this.tempminvite = this.values.invitelist;
    this.values.menu='Invite'
    this.values.adminviewnavigation=true
    this.values.membersflage=true

    this.commonvalues.communitydata(this.values);
    }


    userprofile(data){
      var userData: any= {}
       userData.userId = data
       this.router.navigate(['personalProfile'], {queryParams : userData})
     }

     sendmsg(data){
      var userData: any= {}
      userData.userid  = data.userId
      this.router.navigate(['message'], {queryParams : userData})
   }


   members(){
    this.userData=[]
    var datas ={
      "communityId":this.communityId ,
      "userId": localStorage.getItem('userId'),
     "page": {
     "offSet":0,
     "pageCount": 100
     }
    }
    this.showNoDatafound =false
     this.util.startLoader()
      this.API.create('community/members/visited',datas).subscribe(res=>{
        this.userData=[]
       this.datas(this.userData)
        res.data.visitorList.forEach(element => {
               this.util.stopLoader()
              var  photos
              if(element.photo==null){
                 photos="assets/images/userAvatar.png"
              }else if(element.photo!=null){
                photos=AppSettings.photoUrl+element.photo;
              }
              this.userData.push({
               userName:element.userData.fullName,
               photo:photos,
               organisation:element.userData.organisation,
               title:element.userData.title,
               status:element.status,
               connectionCnt:element.userData.connectionCnt,
               postCnt:element.userData.postCnt,
               userId:element.userId,
               visitedOn:element.visitedOn,
               connectionStatus:element.userData.connectionStatus,
               connected:element.userData.connected,
               communityId:element.communityId,
              })
             this.datas(this.userData)

      })

setTimeout(() => {
  if(this.userData.length == 0) {
    this.showNoDatafound = true
  }
}, 1000);

},err => {
  this.util.stopLoader();

 });
     this.util.stopLoader()
  }
  keyupdata(event){
    if(event.target.value.length==0){
      this.onsearch('');
    }
  }
  onsearch(val) {
    if(val!=undefined){
      val = val.trim().toLowerCase();
    }
     this.values.invitelist =this.tempminvite;
     this.values.invitelist = this.filterByString( this.values.invitelist, val);
     if (this.values.invitelist.length == 0) {
      this.showNoDatafound = true;
    } else {
      this.showNoDatafound = false;
    }
  }

  filterByString(data, s) {
    return data.filter(e => e.userName.toLowerCase().includes(s))
      .sort((a, b) => a.userName.toLowerCase().includes(s) && !b.userName.toLowerCase().includes(s) ? -1 : b.userName.toLowerCase().includes(s) && !a.userName.toLowerCase().includes(s) ? 1 : 0);
 }

  sortData(data) {
    return data.sort((a, b) => {
      return <any>new Date(b.visitedOn) - <any>new Date(a.visitedOn);
    });
  }

  invite(datas){


   let data =  {
    "userId": datas.userId, // invite userid
    "entityId":  this.communityId, // communityid
    "sentBy":localStorage.getItem('userId')   // login persion userid
   }
   this.util.startLoader()
   this.API.create('community/send/invite', data).subscribe(res=>{
    this.util.stopLoader()
       if(res.code="00000"){
        this.members()
      }
    },err => {
      this.util.stopLoader();

     });

  }
}
