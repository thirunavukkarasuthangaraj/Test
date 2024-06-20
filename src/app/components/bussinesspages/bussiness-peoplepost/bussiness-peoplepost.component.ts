import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-bussiness-peoplepost',
  templateUrl: './bussiness-peoplepost.component.html',
  styleUrls: ['./bussiness-peoplepost.component.scss']
})
export class BussinessPeoplepostComponent implements OnInit {
  values: any = {}
  communityList: any = [];
  businessId: string;
  businessmenustick: boolean = false;

  constructor(private aroute: ActivatedRoute, private api: ApiService, private router: Router, private util:UtilService) {
    this.aroute.queryParams.subscribe(res => {
      if (res) {
        const bId = res['businessId'];
        if(res['businessId']==undefined){
          const bId = res['communityId'];
        }

        if (bId) {
          this.businessId = bId;
          this.getCommunity(bId);
        }
      }
    });
  }

  ngOnInit() {
  }

  @HostListener('window:scroll')
  handleScroll(){
    const windowScroll = window.pageYOffset;
    if(windowScroll >= 362){
      this.businessmenustick = true;
    } else {
      this.businessmenustick = false;
    }
  }

  getCommunity(businessId: any) {
    this.util.startLoader()
    this.api.query('business/community/' + businessId).subscribe(res => {
      this.util.stopLoader()
      if (res) {
        this.communityList = res.data.communityList;
      }
    },err => {
      this.util.stopLoader();
    });
  }

  redirectCommunity(item: any): void {
    this.router.navigate(['/community'], { queryParams: item });
  }

}
