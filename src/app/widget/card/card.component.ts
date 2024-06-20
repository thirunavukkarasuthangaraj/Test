import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { UtilService } from 'src/app/services/util.service';
import { User } from 'src/app/types/User';
import { UserCardConfig } from 'src/app/types/UserCardConfig';
import Swal from 'sweetalert2';

  @Injectable()
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input('title') title: any = 'Page';
  @Input() inputData: string;
  headerTitle: any = 'Page';
  commonDatahide: any = {}
  @Output() commonFunction = new EventEmitter<string>();
  admin: any = []
  @Input() maxMin: any = {};
  @Input() page: string;
  imgUrl: any = AppSettings.photoUrl;
  data: any;
  userCardConfig: UserCardConfig[] = []

  constructor(private auth: ApiService, private router: Router, private util: UtilService,private _route: ActivatedRoute) {
    this.headerTitle = this.title;
  }
  ngOnInit() {
      this.util.startLoader();
      var menu = this._route.queryParams['_value']['masterMenu']
      if (menu== "COMMUNITY") {
      let invite : UserCardConfig = new UserCardConfig("Invite", this.inviteFollower, this.canShow, true);
      invite.source = this;
      this.userCardConfig = []
      this.userCardConfig.push(invite);

      this.auth.query("community/connection/suggestion/" + localStorage.getItem('communityId')).subscribe((res) => {
        this.util.stopLoader()
        if(res.status==404){
          this.hide(true);
          //// console.log(res.status)
        }
        if ( res && res.length!=0&&res != undefined && res != null) {
          if (res['data']&& res['data']!=null && res['data']['connectionInvites']  && res['data']['connectionInvites'] != null && res['data']['connectionInvites'].length != 0){
            this.data = res['data']['connectionInvites'];
           }else{
            this.hide(true)
           }
        }  else{
            this.hide(true)
         }
      },err => {
        this.util.stopLoader()

        // //// console.log(err)
      });


    }
    else if (menu == "BUSINESS") {
      let invite : UserCardConfig = new UserCardConfig("Invite", this.inviteConnectionsToFollow, this.canShow, true);
      invite.source = this;
      this.userCardConfig = []
      this.userCardConfig.push(invite);
      this.data = []
      this.auth.query("business/connection/suggestion/" + localStorage.getItem('businessId')).subscribe((res) => {
        if(res){
           res.data.connectionInvites.forEach(ele=>{
            // invite.source = this;
            this.data.push(ele)

          })
        }
      },err => {
        this.util.stopLoader();
      });



    }

  }
  canShow(){ }

  inviteFollower(user){
    var menu = this._route.queryParams['_value']['masterMenu']
    let data: any = {}
    data.userId = user.userId;
    if (menu == "COMMUNITY") {
      data.entityId = localStorage.getItem('communityId');
      data.communityId = localStorage.getItem('communityId');
      data.sentBy = localStorage.getItem('userId')
      this.util.startLoader()
      this.auth.create('community/send/invite', data).subscribe(res => {
        this.util.stopLoader()
        if (res.code = "00000") {
          // this.ngOnInit()
          Swal.fire({
            position: 'center',
                icon: 'success',
                title: 'Invite sent successfully',
                showConfirmButton: false,
                timer: 1500
          }).then(()=>{
            this.ngOnInit()
          })
        }else{
          Swal.fire({
            position: 'center',
                icon: 'error',
                title: 'Oops..',
                text: 'Something went wrong. Please try again later.',
                showConfirmButton: false,
                timer: 3000
          })
        }
      },err => {
        this.util.stopLoader();
      });
     }

  }

  inviteConnectionsToFollow(user: User){

    let data: any = {}
    data.userId = user.userId;
    data.source = 'CONNECTION'
    data.businessId = localStorage.getItem('businessId')
      this.util.startLoader()
      this.auth.create('business/visitor/send/request', data).subscribe(res => {
        this.util.stopLoader()
        if (res.code = "00000") {
          // this.connectionInvitesList.splice(i, 1);
          Swal.fire({
            position: 'center',
                icon: 'success',
                title: 'Invite sent successfully',
                showConfirmButton: false,
                timer: 1500
          }).then(()=>{
            this.ngOnInit()
          })
        }else{
          Swal.fire({
            position: 'center',
                icon: 'error',
                title: 'Oops..',
                text: 'Something went wrong. Please try again later.',
                showConfirmButton: false,
                timer: 3000
          })
        }
      },err => {
        this.util.stopLoader();
      });
    //  }

  }

  hide(flag) {
    this.commonDatahide.widgetName = "CardComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }
}
