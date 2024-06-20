import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked, Renderer2, NgZone, AfterContentChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { CommonValues } from 'src/app/services/commonValues';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-business-community',
  templateUrl: './business-community.component.html',
  styleUrls: ['./business-community.component.scss']
})
export class BusinessCommunityComponent implements OnInit, AfterViewInit,
  AfterViewChecked, AfterContentChecked, OnDestroy {

  @Input() commonemit: any;
  businessData: any = {};
  communityList: any = [];
  photoUrl = AppSettings.photoUrl;
  searchText;
  createCommunity;
  nodata ="Please upgrade your profile to premium profile to create communities"
  SuperAdminData:any;
  superAdmin = false;
  viewAdmin = true;
  colors: Array<any> = ['hgreen', 'hred', 'horange', 'hyellow'];

  private createCom: ElementRef;
  @ViewChild('createcommunity', { static: true }) set assetInput(elRef: ElementRef) {
    this.createCom = elRef;
  }

  constructor(private util:UtilService, private router: Router, private aroute: ActivatedRoute, private api: ApiService,
    private cm: CommonValues, private cdRef: ChangeDetectorRef, private render: Renderer2,
    private zone: NgZone) {
    aroute.queryParams.subscribe(res => {
      const businessId = res.businessId;
      this.superAdmin = res.isSuperAdmin;
      const userId = localStorage.getItem('userId');
      if(res.businessOwner === userId) {
        this.superAdmin = true;
      }
      this.getBusinessData(businessId);
    });
  }

  routePage(){
     this.router.navigate(['createCommunity'], { skipLocationChange: true ,queryParams: {entityType: 'BUSINESS', entityId: this.businessData.businessId }})
    }



  sort_by_key(array, key) {
    return array.sort(function(a, b) {
     var x = a[key]; var y = b[key];
     return ((x < y) ? -1 : ((x > y) ? 1 : 0));
   });
  }

  getBusinessData(businessId: string) {
    this.util.startLoader()
    this.api.query('business/details/' + businessId).subscribe(res => {
      if (res) {
        const userId = localStorage.getItem('userId');
        res.data.businessModelList[0]['isSuperAdmin'] = false;
        if (userId === res.data.businessModelList[0]['businessOwner']) {
          res.data.businessModelList[0]['isSuperAdmin'] = true;
          //this.createCommunity = 'SUPERADMIN';
        }
        this.businessData = res.data.businessModelList[0];
        this.api.query('business/community/' + businessId).subscribe(ress => {
          this.util.stopLoader()
          if (ress) {
            //this.communityList = ress;
            this.setColor(ress.data.communityList);
          }
        },err => {
          this.util.stopLoader();
        });
      }else{
        this.util.stopLoader()
      }
      this.util.stopLoader()
    },err => {
      this.util.stopLoader();
    });
  }

  redirectCommunity(val: any) {
    localStorage.setItem('communityId', val['communityId']);
    this.router.navigate(['/community'], { queryParams: val });
  }

  searchCommunity() {
    const data = {
      searchText: this.searchText,
      businessId: this.businessData['businessId']
    };
    this.util.startLoader()
    this.api.messagePageService('POST', 'business/community/search', data).subscribe(res => {
      this.util.stopLoader()
      if (res) {
        //this.communityList = res;
        this.setColor(res);
      }
    });
  }

  private setColor(res: any): any {
    if (res && res != null && res !== '' && res.length > 0) {
      res.forEach(e => {
        e.comColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      });
    }
    this.communityList = this.sort_by_key(res,"communityName");
  }

  ngOnInit() {
     if (this.commonemit) {
      this.viewAdmin = this.commonemit.viewadmin;
    }
    this.enableBtn(1);
    this.businessUserData();
  }

  businessUserData(){
    this.SuperAdminData = localStorage.getItem('isSuperAdmin');
    // console.log('this.SuperAdminData',this.SuperAdminData)
  }

  ngOnDestroy() {
    // this.createCommunity = '';
  }

  ngAfterViewInit(): void {
    this.cm.getbusinessid().subscribe(res => {
       if (res) {
        if (res.viewadmin) {
          this.zone.run(() => {
            //this.createCommunity = 'SUPERADMIN';
            this.viewAdmin = true;
            setTimeout(() => {
              this.enableBtn(2);
            }, 3);
          });
        } else {
          this.zone.run(() => {
            //this.createCommunity = 'MEMBER';
            this.viewAdmin = false;
            setTimeout(() => {
              this.enableBtn(3);
            }, 3);
          });
        }
      }
    });
  }

  enableBtn(val) {
     if (this.viewAdmin && this.superAdmin) {
      this.createCommunity = 'SUPERADMIN';
    } else {
      this.createCommunity = 'MEMBER';
    }
  }

  ngAfterViewChecked(): void {

  }

  ngAfterContentChecked() {
  }

}
