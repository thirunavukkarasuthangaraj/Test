import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/services/AppSettings';
import Swal from 'sweetalert2';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { GlobalCommunity } from '../../bussiness-post/bussiness-post.component';

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.scss']
})
export class CommunityCardComponent implements OnInit {

  @Input() data: any;
  community: any;
  colors: Array<any> = ['hgreen', 'hred', 'horange', 'hyellow'];
  selColor: string;

  constructor(private router: Router, private api: ApiService, private searchData: SearchData, private util: UtilService,
    private globalCommunity: GlobalCommunity) {
    this.randomColor();
  }
  randomColor(): void {
    this.selColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  ngOnInit() {
    this.community = this.globalCommunity.communityData;
    this.data.joined = false;
    if (this.data && this.data.logo && this.data.logo != null && this.data.logo !== '') {
      this.data.logoview = AppSettings.photoUrl + this.data.logo;
    }
    this.community = this.data;
    // this.community.status="INACTIVE";
  }

  CommunityData(data) {



    if (data.status == 'ACTIVE') {
      let datas: any = {};
      datas.communityId = data.communityId
      data.communityId = data.communityId


      datas.userId = localStorage.getItem('userId')
      this.api.create("community/home", datas).subscribe(res => {
        if (res) {
          localStorage.setItem('communityId', res.data.communityhome.communityId)
          localStorage.setItem('isAdmin', res.data.isAdmin)
          localStorage.setItem('communityAdmin', res.data.isAdmin)
          localStorage.setItem('communityType', res.data.communityhome.communityType)
          localStorage.setItem('isSuperAdmin', res.data.isSuperAdmin)
          localStorage.setItem('communitySuperadmin', res.data.isSuperAdmin)
          localStorage.setItem('isJoined', res.data.isJoined)
          localStorage.setItem('screen', 'community')
          localStorage.setItem('adminviewflag', 'false')
          this.router.navigate(['community'], { queryParams: data })
        }
      });
    }
  }

  activate(value) {
    var val: any = {}
    val.communityId = value.communityId
    this.util.startLoader()
    this.api.create('community/activate/', val).subscribe(res => {
      if (res) {
        if (res.code == '00000') {
          this.util.stopLoader()
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Community Page page has been activated.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            var values: any = {}
            values.boolean = true
            this.searchData.setBooleanValue(values)
          });
        } else {
          this.util.stopLoader()
          Swal.fire({
            position: "center",
            icon: "info",
            text: "Something went wrong. Please, try after some time.",
            title: "Oops..",
            showConfirmButton: false,
            timer: 1500,
          })
        }
      }

    })
  }


  deactivate(value) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to deactivate?",
        text: "You will still be able to retrieve the community page after deactivation, if you change your mind.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.util.startLoader()
          this.api.delete('community/remove/' + value.communityId).subscribe(res => {
            if (res.code == '00000') {
              this.util.stopLoader()
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Community Page page has been deactivated.",
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                var values: any = {}
                values.boolean = true
                this.searchData.setBooleanValue(values)
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "info",
                title: "Oops..",
                text: "Something went wrong. Please, try again after some time.",
                showConfirmButton: false,
                timer: 1500,
              })
            }
          })
        }
      })
  }
}
