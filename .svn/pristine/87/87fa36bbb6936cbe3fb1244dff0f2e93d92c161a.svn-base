import { ActivatedRoute } from '@angular/router';
import { WidgetService } from './../../services/widget.service';
import { UtilService } from './../../services/util.service';
import { Component, Output,EventEmitter,OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-people-with-similar-name',
  templateUrl: './people-with-similar-name.component.html',
  styleUrls: ['./people-with-similar-name.component.scss']
})
export class PeopleWithSimilarNameComponent implements OnInit {

  @Input('title') title: string = 'People most active in your network';
  commonDatahide:any={}
  @Output()  commonFunction = new EventEmitter<string>();
  headerTitle: string = 'People most active in your network';
  peopelData: any = [];
  @Input() inputData: string;
  @Input() widgetDesc: string;

  constructor(private auth: ApiService,private a_route: ActivatedRoute, private util: UtilService, private widget: WidgetService) {
   }

  ngOnInit() {
    this.headerTitle=this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      if(res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
      }
   })
    this.getSimilarName();
  }

  getSimilarName() {
    if (this.inputData && this.inputData != "") {
      if (this.inputData == "BUSINESS") {
        this.auth.query("business/followed/network/" + localStorage.getItem('businessId'))
          .subscribe((res) => {
           if(res!=null && res.length!=0){
            this.peopelData = res;
           } else{
              this.commonDatahide.widgetName="PeopleWithSimilarNameComponent";
              this.commonFunction.emit(this.commonDatahide);
           }
          },err => {
            if(err.status==500){
              this.commonDatahide.widgetName="PeopleWithSimilarNameComponent";
              this.commonFunction.emit(this.commonDatahide);
              // //// console.log("log in datas")
            }

            // //// console.log(err)
          });
      } else if (this.inputData == "COMMUNITY") {
        this.auth.query("community/joined/network/" + localStorage.getItem('communityId'))
          .subscribe((res) => {
            if(res!=null && res.length!=0){
              this.peopelData = res;
             } else{
                this.commonDatahide.widgetName="PeopleWithSimilarNameComponent";
                this.commonFunction.emit(this.commonDatahide);
             }
            },err => {
              if(err.status==500)
                this.commonDatahide.widgetName="PeopleWithSimilarNameComponent";
                this.commonFunction.emit(this.commonDatahide);
              // //// console.log(err)
            });
      }
    }


  }

  connect(user: any) {
    this.widget.connectService(user.userId).subscribe(conData => {
      this.util.stopLoader();
      if (conData.code === '00000') {
        this.widget.removeUserConnectionSuggesion(user['id']).subscribe(res => {
          if (res.code === '00000') {
            this.getSimilarName();
          }
        })
        Swal.fire({
          position: 'center',
              icon: 'success',
              title:"Connection request",
              text: 'Connection request sent successfully',
              showConfirmButton: false,
              timer: 2000
        })
      } else if (conData.code === '88888') {
        Swal.fire({
          position: 'center',
              icon: 'error',
              title:"Connection request",
              text: 'Connection request failed. Please try again later.',
              showConfirmButton: false,
              timer: 3000
        })
      }
    });
  }


}








