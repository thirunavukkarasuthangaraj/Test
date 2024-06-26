import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from './../../services/api.service';
import { UtilService } from './../../services/util.service';
import { Component, OnInit, Output,EventEmitter,Input } from '@angular/core';

@Component({
  selector: 'app-similar-business-near-you',
  templateUrl: './similar-business-near-you.component.html',
  styleUrls: ['./similar-business-near-you.component.scss']
})
export class SimilarBusinessNearYouComponent implements OnInit {


  // business search based query ;

  @Input('title') title: string = 'Similar Business Near you (Public search)';
  @Input() inputData: string;
  @Input() maxMin: any = {};
  @Input() page: string;
  viewType: string = "MIN";
  headerTitle;
  user: any = [];
  commonDatahide:any={}
  @Output()  commonFunction = new EventEmitter<string>();
  @Input() widgetDesc: string;

  constructor(private util: UtilService,private a_route: ActivatedRoute, private api: ApiService,private router:Router) {
   }
  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.menu = this.widgetDesc;
    dataPass.masterMenu =  this.inputData;
    dataPass.widgetName = "SimilarBusinessNearYouComponent";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }


  ngOnInit() {




  this.headerTitle=this.widgetDesc;

     this.a_route.queryParams.subscribe((res) => {
      if(res.master && res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
      }
   });

    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
     }
     this.util.startLoader()
    if (this.inputData && this.inputData != "") {
      this.api.query("business/similar/"+localStorage.getItem('userId')+"/"+localStorage.getItem('businessId'))
      .subscribe((res)=>{
        this.util.stopLoader()
        if(res!=null  && res.data!=null && res.data.businessList!=null && res.data.businessList.length!==0){
          if (res['data'] && res['data'] != null && res['data'].businessList != null && res['data'].businessList.length != 0){
            this.user = res.data.businessList;
          }else{
            this.hide(true)
          }
         }else{
            this.hide(true)
         }

        },err => {
          this.util.stopLoader()
          //if(err.status==500){
            this.hide(true)
         // }

        });
   }
  }

  hide(flag){
    this.commonDatahide.widgetName="SimilarBusinessNearYouComponent";
    this.commonDatahide.hide=flag;
    this.commonFunction.emit(this.commonDatahide);
  }
}
