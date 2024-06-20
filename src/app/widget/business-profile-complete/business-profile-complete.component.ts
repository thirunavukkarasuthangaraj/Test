import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from './../../services/AppSettings';
import { ApiService } from './../../services/api.service';
import { UtilService } from './../../services/util.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SearchData } from 'src/app/services/searchData';
import { CommonModule } from '@angular/common';
import { CommonValues } from 'src/app/services/commonValues';
@Component({
  selector: 'app-business-profile-complete',
  templateUrl: './business-profile-complete.component.html',
  styleUrls: ['./business-profile-complete.component.scss']
})
export class BusinessbusinessComplteDataComponent implements OnInit, OnChanges, OnDestroy {
  businessComplteData: any = [];
  eventEmitter: Subscription
  nonCreationPage: boolean = false
  eventEmitter1: Subscription
  eventEmitter12: Subscription
  commonDatahide: any = {}
  values: any = {}
  @Input() inputData: string;
  @Input() totalBusinessPercentage: number;
  @Input() inputs: string;
  @Output() commonFunction = new EventEmitter<string>();
  pathdata: any;

  constructor(private util: UtilService, private api: ApiService, private router: Router, private commonvalues: CommonValues, private searchData: SearchData,
    private _route: ActivatedRoute) {
    if (this._route.queryParams['_value']['businessId']) {
      this.nonCreationPage = true
      // //// console.log('passing through this')
    } else {
      this.nonCreationPage = false
      if (this.businessComplteData.businessLogo == null) {
        this.businessComplteData.businessLogo = "assets/images/gallery/company.png"
      }
      //// console.log('no passing thorugh this')
    }

    this.eventEmitter12 = this.commonvalues.getProfo().subscribe(res => {
      if (res.boolean == true) {
        setTimeout(() => {
          this.profileStatus()
        }, 5000);
      }

    })

    this.eventEmitter = this.commonvalues.getBusinessData().subscribe(res => {
      if (this.nonCreationPage === false) {
        this.businessComplteData = res;
      }
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.businessComplteData.completePercentage = changes.totalBusinessPercentage && changes.totalBusinessPercentage.currentValue;

  }
  show = false;
  ngOnInit() {
    this.profileStatus();
  }


  route(businessData) {

    if (businessData != undefined && businessData != null && businessData != "") {
      let datum: any = {}
      datum.businessName = businessData.businessName;
      datum.businessId = localStorage.getItem('businessId');
      datum.menu = 'about';
      this.router.navigate(['business'], { queryParams: datum });

    }
  }

  hide(flag) {

    this.commonDatahide.widgetName = "BusinessbusinessComplteDataComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }

  industryClassification() {
    if (this.businessComplteData.industryClassification == 'MEDICAL_HEALTHCARE_PRACTICE') {
      this.businessComplteData.IndustryClassifications = 'Medical/ Healthcare Practice'
    } else if (this.businessComplteData.industryClassification == 'ALTERNATIVE_MEDICE') {
      this.businessComplteData.IndustryClassifications = 'Alternative Medicine'
    } else if (this.businessComplteData.industryClassification == 'BIOTECHNOLOGY') {
      this.businessComplteData.IndustryClassifications = 'Biotechnology'
    } else if (this.businessComplteData.industryClassification == 'DIAGNOSTIC_SERVICES') {
      this.businessComplteData.IndustryClassifications = 'Diagnostic Services'
    } else if (this.businessComplteData.industryClassification == 'EDUCATIONAL_INSTITUTION_(MEDICAL,_NURSING,_HEALTHCARE)') {
      this.businessComplteData.IndustryClassifications = 'Educational Institution (Medical, Nursing, Healthcare)'
    } else if (this.businessComplteData.industryClassification == 'HEALTH_INSURANCE') {
      this.businessComplteData.IndustryClassifications = 'Health Insurance'
    } else if (this.businessComplteData.industryClassification == 'MEDICAL_DEVICE_EQUIPMENTS') {
      this.businessComplteData.IndustryClassifications = 'Medical Device/ Equipments'
    } else if (this.businessComplteData.industryClassification == 'PROFIT_ORGANIZATION_(HEALTH/WELLNESS/MEDICAL)') {
      this.businessComplteData.IndustryClassifications = 'Non-Profit Organization (Health/Wellness/Medical)'
    }
    else if (this.businessComplteData.industryClassification == 'NON-PROFIT_ORGANIZATION_(HEALTH/WELLNESS/MEDICAL)') {
      this.businessComplteData.IndustryClassifications = 'Non-Profit Organization (Health/Wellness/Medical)'
    }
    else if (this.businessComplteData.industryClassification == 'OTHER') {
      this.businessComplteData.IndustryClassifications = this.businessComplteData.others;
    } else if (this.businessComplteData.industryClassification == 'PHARMACEUTICALS') {
      this.businessComplteData.IndustryClassifications = 'Pharmaceuticals'
    } else if (this.businessComplteData.industryClassification == 'RESEARCH') {
      this.businessComplteData.IndustryClassifications = 'Research'
    } else if (this.businessComplteData.industryClassification == 'WELLNESS_FITNESS') {
      this.businessComplteData.IndustryClassifications = 'Wellness & Fitness'
    }
  }

  profileStatus() {

    //  if ( this.inputData && this.inputData !== "" && this.nonCreationPage === true) {
    let datas: any = {};
    datas.userId = localStorage.getItem('userId')
    this.util.startLoader()
    this.api.query("business/businessprofile/complete/" + localStorage.getItem('businessId')).subscribe(res => {
      this.util.stopLoader()
      if (res.businessLogo == undefined || res.businessLogo == null || res.businessLogo == "") {
        res.businessLogo = 'assets/images/gallery/company.png';
      } else {
        res.businessLogo = AppSettings.photoUrl + res.businessLogo;
      }
      this.businessComplteData = res;

      if (this.totalBusinessPercentage) {
        this.businessComplteData.completePercentage = this.totalBusinessPercentage
      }

      this.values.percentage = res.completePercentage;
      if (this.businessComplteData.businessLogo == null) {
        this.businessComplteData.businessLogo = "assets/images/gallery/company.png"
      }

      this.industryClassification();
      if (res.completePercentage == 100) {
        this.show = false;
      } else {
        this.show = true;
      }
      if (res.userId != localStorage.getItem('userId')) {
        this.hide(true);
      } else {
        this.hide(true);
      }


    }, err => {
      this.hide(true);

    });
    // }
  }

  ngOnDestroy(): void {
    if (this.eventEmitter12) {
      this.eventEmitter12.unsubscribe();
    }

    if (this.eventEmitter1) {
      this.eventEmitter1.unsubscribe();
    }

    if (this.eventEmitter) {
      this.eventEmitter.unsubscribe()
    }
  }
}
