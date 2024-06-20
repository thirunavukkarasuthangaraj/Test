import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { UtilService } from '../../../services/util.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchData } from 'src/app/services/searchData';
import { GlobalCommunity } from 'src/app/components/bussiness-post/bussiness-post.component';

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit {

  @ViewChild('landingside1') menuElement: ElementRef;

  landingsidesticky1: boolean = false;
  landingsidesticky2: boolean = false;
  elementPosition: any;
  noDatafound = ["You are not part of any Communities yet."]
  showNoDatafound: boolean = false;
  communityDetails: Array<any>;
  tempcommunityDetails: any;
  loadAPIcall:boolean=false
  comm: any;
  subscriber: Subscription;
  CommSearch: any;
  searchKey
  userType = "ALL"
  btnnameshow = "All"
  constructor(
    private util: UtilService,
    private api: ApiService,
    private searchData: SearchData,
    private router: Router, private globalCommunity: GlobalCommunity,
  ) {
    this.subscriber = this.searchData.getBooleanValue().subscribe(res => {
      if (res.boolean == true) {
        this.comunitydetailsapicall()
      }
    })
  }

  ngOnInit() {
    this.comunitydetailsapicall();
  }

  comunitydetailsapicall() {
    let datas: any = {};
    datas.userId = localStorage.getItem('userId');
    this.loadAPIcall=true
    this.api.queryPassval("community/check/user", datas).subscribe(res => {
      this.loadAPIcall=false
      this.communityDetails = res.data.communityModelList.sort(this.dynamicSort('communityName'));
      this.tempcommunityDetails = this.communityDetails
      if (this.communityDetails.length === 0) {
        this.noDatafound = ["Please click the Join Community button on the welcome post from the home page or click on the Follow button on the Communities To Follow widget"];
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  keyupdata(event) {
    if (event.target.value.length == 0) {
      this.onsearch('');
    }
  }
  onsearch(val) {
    if (val != undefined) {
      val = val.trim().toLowerCase();
    }

    if (this.btnnameshow == 'All') {
      this.communityDetails = this.tempcommunityDetails;
      this.communityDetails = this.filterByString(this.communityDetails, val);
    } else if (this.btnnameshow == 'Super Admin') {
      this.communityDetails = this.tempcommunityDetails;
      this.communityDetails = this.communityDetails.filter(function (item) {
        return item.isSuperAdmin == true;
      })
      this.communityDetails = this.filterByString(this.communityDetails, val);
    } else if (this.btnnameshow == 'Admin') {
      this.communityDetails = this.tempcommunityDetails;
      this.communityDetails = this.communityDetails.filter(function (item) {
        return item.isAdmin == true;
      })
      this.communityDetails = this.filterByString(this.communityDetails, val);
    }


    if (this.communityDetails.length == 0) {
      this.showNoDatafound = true;
    } else {
      this.showNoDatafound = false;
    }
  }

  sort_by_key(admin) {
    if (admin == 'superadmin') {
      this.noDatafound = ["You are not a super admin in any Communities."]
      this.btnnameshow = 'Super Admin'
      this.communityDetails = this.tempcommunityDetails;
      this.communityDetails = this.communityDetails.filter(function (item) {
        return item.isSuperAdmin == true;
      })
    } else if (admin == 'admin') {
      this.noDatafound = ["You are not an admin in any Communities."]
      this.btnnameshow = 'Admin'
      this.communityDetails = this.tempcommunityDetails;
      this.communityDetails = this.communityDetails.filter(function (item) {
        return item.isAdmin == true;
      })
    } else if (admin == 'all') {
      this.noDatafound = ["You are not part of any Communities yet."]
      this.btnnameshow = 'All'
      this.communityDetails = this.tempcommunityDetails;
      this.communityDetails = this.filterByString(this.communityDetails, '');
    }

    if (this.communityDetails.length == 0) {
      this.showNoDatafound = true;
    } else {
      this.showNoDatafound = false;
    }

  }


  filterByString(data, s) {
    return data.filter(e => e.communityName.toLowerCase().includes(s))
      .sort((a, b) => a.communityName.toLowerCase().includes(s) && !b.communityName.toLowerCase().includes(s) ? -1 : b.communityName.toLowerCase().includes(s) && !a.communityName.toLowerCase().includes(s) ? 1 : 0);
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


  routePage() {
    this.router.navigate(['createCommunity'], { skipLocationChange: true })
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    //this.elementPosition = this.menuElement.nativeElement.offsetTop;
    // //// console.log(this.elementPosition);
  }

  @HostListener('window:scroll')
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

}
