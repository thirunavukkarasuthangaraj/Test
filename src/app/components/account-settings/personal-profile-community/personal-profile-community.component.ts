import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-personal-profile-community',
  templateUrl: './personal-profile-community.component.html',
  styleUrls: ['./personal-profile-community.component.scss']
})
export class PersonalProfileCommunityComponent implements OnInit {
  communityDetails: any;
  tempcommunityDetails: any;
  searchKey
  noDatafound  =['You are not part of any Communities'];
  constructor(private api: ApiService,
    private router: Router ,private util:UtilService) { }

  ngOnInit() {
    this.comunitydetailsapicall()
  }

  comunitydetailsapicall() {

    let datas: any = {};
    datas.userId = localStorage.getItem('userId');
    this.api.queryPassval("community/check/user", datas).subscribe(res => {
      this.communityDetails = res.data.communityModelList.sort(this.dynamicSort('communityName'));
      this.tempcommunityDetails = this.communityDetails
    },err => {
      this.util.stopLoader();
    });
  }

  routePage() {
    this.router.navigate(['createCommunity'], { skipLocationChange: true })
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
}
