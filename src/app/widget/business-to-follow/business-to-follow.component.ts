import { UtilService } from './../../services/util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from './../../services/api.service';
import { AuthServiceService } from './../../services/auth-service.service';
import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';
import Swal from "sweetalert2";

@Component({
  selector: 'app-business-to-follow',
  templateUrl: './business-to-follow.component.html',
  styleUrls: ['./business-to-follow.component.scss']
})
export class BusinessToFollowComponent implements OnInit {

  @Input('title') title: string = 'Business to Follow ';
  viewType: string = "MIN";
  headerTitle
  user: any = [];
  commonDatahide:any={}
  @Output()  commonFunction = new EventEmitter<string>();
  @Input() maxMin: any = {};
  @Input() page: string;
  @Input() inputData: string;

  bussinesssuggestion:any;
  currentPage:number=0;
  @Input() widgetDesc: string;
  pathdata:any;
  limit:number=4;
  totalCount: any;

  constructor(private auth: ApiService,private a_route: ActivatedRoute, private router: Router, private util: UtilService) {
   }

  route(data) {
    this.router.navigate(['business'], { queryParams: data, replaceUrl: true });
  }

  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.menu = this.widgetDesc;
    dataPass.masterMenu =  this.inputData;
    dataPass.widgetName = "BusinessToFollowComponent";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }

  ngOnInit() {

    this.headerTitle=this.widgetDesc;
    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
      this.limit=8;
     }

     this.a_route.queryParams.subscribe((res) => {
      if(res.master && res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
       }
    })

    this.getSuggestions();
}


   follow(id){
    this.util.startLoader();
    const data:any={};
    data.userId = localStorage.getItem('userId'),
    data.businessId = id
    this.auth.create('business/add/follower', data).subscribe((res) =>{
      this.util.stopLoader();
      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "You are a follower",
          text: "You are following this business page now.",
          showConfirmButton: false,
          timer: 2000,
        })
        this.ngOnInit();
      }

    },err => {
      this.util.stopLoader();
    });
   }

  hide(flag){
    this.commonDatahide.widgetName="BusinessToFollowComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }

  movePage(event) {
    this.currentPage = event;
    this.page = event;
    this.limit=8;
    this.getSuggestions();
  }
  noListMessage: boolean = false

  getSuggestions(){
    let data:any={};
    data.userId = localStorage.getItem('userId'),
    data.limit = this.limit,
    data.page=this.currentPage;
    this.util.startLoader();
    this.auth.create('widget/business/suggestion', data).subscribe((res) =>{
        this.util.stopLoader();
         if( res.data.bussinesssuggestion!=null&& res.data.bussinesssuggestion.length!==0){
            this.bussinesssuggestion = res.data.bussinesssuggestion;
            if( res.data.totalCount!=null){
              this.totalCount=res.data.totalCount;
            }
        }
         else{
           this.noListMessage = true
          this.hide(true);
        }

      },err => {
        this.util.stopLoader();

        this.hide(true);


      });

  }


}
