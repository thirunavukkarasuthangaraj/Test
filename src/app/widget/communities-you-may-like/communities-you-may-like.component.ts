import { UtilService } from './../../services/util.service';
import { ApiService } from './../../services/api.service';
import { Component, Input, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-communities-you-may-like',
  templateUrl: './communities-you-may-like.component.html',
  styleUrls: ['./communities-you-may-like.component.scss']
})
export class CommunitiesYouMayLikeComponent implements OnInit {

  commonDatahide: any = {}
  @Output() commonFunction = new EventEmitter<string>();
  user: any = [];
  @Input('title') title: string = 'Community to Follow ';
  headerTitle: string = 'Community to Follow ';
  viewType: string = "MIN";
  @Input() page: string;
  @Input() inputData: string;

  // get min max from view more click from sugg component
  @Input() maxMin: any = {};
  @Input() widgetDesc: string;

  communitydata:any;

  constructor(private auth: ApiService,private a_route: ActivatedRoute, private util:UtilService, private router: Router ) {
   }

  modelopen(data) {
   let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.masterMenu =  this.inputData;
    dataPass.menu = this.widgetDesc;
    dataPass.widgetName = "CommunitiesYouMayLikeComponent";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }

  ngOnInit() {
     this.headerTitle=this.widgetDesc;
     this.a_route.queryParams.subscribe((res) => {
      if(res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
      }
    })

    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
     }
        this.util.startLoader();
        const data:any={};
        data.userId =localStorage.getItem('userId');
        data.limit = 4;

      this.auth.create('widget/community/suggestion',data).subscribe((res)=>{
        this.util.stopLoader();

        if (res.data != null && res.data.communitysuggestion != null  &&res.data.communitysuggestion.length !== 0) {
            this.communitydata =  res.data.communitysuggestion;
        } else {
          this.hide(true)
        }
      }, err => {
        this.util.stopLoader();
        this.hide(true)


        // //// console.log(err)
      });


  }
  hide(flag){
    this.commonDatahide.widgetName="CommunitiesYouMayLikeComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }

}
