import { CommonValues } from 'src/app/services/commonValues';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from './../../services/AppSettings';
import { ApiService } from './../../services/api.service';
import { UtilService } from './../../services/util.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-completion',
  templateUrl: './profile-completion.component.html',
  styleUrls: ['./profile-completion.component.scss']
})
export class ProfileCompletionComponent implements OnInit, OnDestroy {
  ProfileComplete: any = []
  eventEmitter: Subscription
  creationPage: boolean = false
  constructor(private util: UtilService, private api: ApiService, private router: Router, private commonvalues: CommonValues, private activateroute: ActivatedRoute) {
    var a = this.router.url
    var b = a.slice(1, 11)
    if (b === 'userDetail') {
      this.creationPage = true
      if (this.ProfileComplete.photo == null || this.ProfileComplete.photo == undefined || this.ProfileComplete.photo == "") {
        this.ProfileComplete.photo = "assets/images/userAvatar.png"
      }
    } else {
      this.creationPage = false;
      if (this.ProfileComplete.photo == null || this.ProfileComplete.photo == undefined || this.ProfileComplete.photo == "") {
        this.ProfileComplete.photo = "assets/images/userAvatar.png"
      }
    }

    // this.eventEmitter = this.commonvalues.getRefresh().subscribe(res=>{
    //   this.ProfileComplete.completePercentage =
    // })
  }
  @Input() inputData: string;
  show = false;
  ngOnInit() {
    // this.profileStatus();
    if (this.creationPage === true) {
      this.commonvalues.getUserData().subscribe(re => {
        this.ProfileComplete = re
      })
    }
  }

  ngOnDestroy(): void {
    if (this.eventEmitter) {
      this.eventEmitter.unsubscribe();
    }
  }

  route(userid) {
    userid = localStorage.getItem('userId')
    if (userid != undefined && userid != null && userid != "") {
      let datas: any = {};
      datas.userId = userid
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate(["personalProfile"], { queryParams: datas });
      });
    }
  }

  ngAfterViewInit(): void {
    setInterval(() => {
      if (localStorage.getItem('profileImage') != undefined) {
        this.ProfileComplete.photo = localStorage.getItem('profileImage');
      }
    }, 2000);
  }


  profileStatus() {
    if (this.inputData && this.inputData != "") {
      let datas: any = {};
      datas.userId = localStorage.getItem('userId')
      if (this.creationPage === false) {
        this.util.startLoader()
        this.api.query("user/profile/complete/" + localStorage.getItem('userId')).subscribe(res => {
          if (res != undefined && res) {
            this.util.stopLoader()
            if (res.photo == undefined || res.photo == null || res.photo == "") {
              res.photo = 'assets/images/userAvatar.png';
            } else {
              res.photo = AppSettings.photoUrl + res.photo;
            }

            this.ProfileComplete = res;

            if (this.inputData == "PROFILE_CREATE_PAGE" || res.completePercentage == 100) {
              this.show = false;
            } else {
              this.show = true;
            }
          }
        }, err => {
          if (err.status == 500) {
            this.util.stopLoader()
          }
        });
      }
    }
  }
}
