import { Router, ActivatedRoute } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { log } from 'console';
import { SearchData } from 'src/app/services/searchData';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-common-profile-info',
  templateUrl: './common-profile-info.component.html',
  styleUrls: ['./common-profile-info.component.scss']
})
export class CommonProfileInfoComponent implements OnInit, AfterViewInit {

  @Input('type') type: any;
  @Input() userIdInput: String;
  @Input() page: String;
  @Input('src') srcImg: any;
  userinfo: any = []
  @Input('data') data: any;

  img: any;

  constructor(private JobServicecolor:JobService,private cdRef: ChangeDetectorRef, private auth: ApiService, private router: Router, private searchdata: SearchData) {
    if (this.type && this.type === 'HASHTAG') {
      this.img = 'assets/images/hashtag.png';
    } else if (this.type && this.type === 'BUSINESS') {
      this.img = 'assets/images/gallery/company.png';
    }
  }

  ngOnInit() {
    this.userprofile();
  }


  getInitialstwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname,lastname);
  }

  getColortwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname,lastname);
  }

  userprofile() {

    if (this.userIdInput != undefined) {
      this.auth.query("user/" + this.userIdInput).subscribe(userres => {
        if (this.page == "BUSINESS") {

          if (this.data.businessLogo != undefined && this.data.businessLogo != null ) {
            this.img = AppSettings.photoUrl + this.data.businessLogo;
          } else {
            this.img = "assets/images/gallery/company.png"
          }
          this.userinfo = userres;
        } else if (this.page == "COMMUNITY") {
          if (this.data.communityLogo != undefined && this.data.communityLogo != null ) {
            this.img = AppSettings.photoUrl + this.data.communityLogo;
          } else {
            this.img = "assets/icon/comm.png"
          }
          this.userinfo = userres;
        }
        else if (this.page == "JOBS") {


        if (this.data.user) {
            if (this.data.user.photo != null && this.data.user.photo.indexOf("http://") == -1) {
              this.img = this.data.user.photo;
            }
        }

          this.userinfo = userres;
        }
        else if (this.page == "SUGGJOBS") {

          if (this.data.user != null) {
            if (this.data.user.photo != null && this.data.user.photo.indexOf("http://") == -1) {
              this.img =  this.data.user.photo;
            }
          }
          this.userinfo = userres;
        }
        else if (this.page == "CANDIDATES_MIGHT") {

          if (this.data.user.photo != undefined && this.data.user.photo != null && this.data.user.photo.indexOf("http://") == -1) {
            this.img =  this.data.user.photo;
          }
          this.userinfo = userres;
        }
        else if (this.page == "CANDIDATES") {

          if (this.data.user.photo != undefined && this.data.user.photo != null && this.data.user.photo.indexOf("http://") == -1) {
            this.img = this.data.user.photo;
          }
          this.userinfo = userres;
        }
        else {
          if (userres.photo != null && userres.photo.indexOf("http://") == -1) {
            this.img =  AppSettings.photoUrl+userres.photo;
          }
          this.userinfo = userres;
        }



      }, err => {
        this.auth.stopLoader();
      });
    }
    else
      this.img =null


  }

  route(data, val) {

    if (val == true || this.page == "PeopleMayYouKnow") {
      if (this.type == "BUSINESS") {

        if (this.data != undefined && this.data != null && this.data != "") {
          this.router.navigate(['business'], { queryParams: this.data, replaceUrl: true });
        }

      }
      else if (this.type == "COMMUNITY") {
        setTimeout(() => {
          this.router.navigate(['community'], { queryParams: this.data, replaceUrl: true });
        }, 80);

      }
      else if (this.userIdInput != null && this.page == "PeopleMayYouKnow") {
        let data: any = {}
        data.userId = this.userIdInput;
        this.router.navigate(['personalProfile'], { queryParams: data });
      }
      else if (this.type === "MOSTACTIVE") {
        let userId = data.userId;
        if (data.userId != "") {
          this.router.navigate(['personalProfile'], { queryParams: { "userId": userId }, replaceUrl: true });
        }
      }

    } else {
      this.searchdata.setWidget(true);
    }
  }


  ngAfterViewInit() {
    if (this.type && this.type === 'HASHTAG') {
      this.img = 'assets/images/hashtag.png';
    } else if (this.type && this.type === 'BUSINESS') {
      this.img = 'assets/images/gallery/company.png';
    }

    this.cdRef.detectChanges();
  }


  datapass(data) {
  }
}
