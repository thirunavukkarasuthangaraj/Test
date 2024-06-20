import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-careonline-today',
  templateUrl: './careonline-today.component.html',
  styleUrls: ['./careonline-today.component.scss']
})
export class CareonlineTodayComponent implements OnInit {

  @Input('title') title: string = 'GigSumo Today ';
  headerTitle: string = 'GigSumo Today ';
  user: any = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
  @Input() maxMin: any = {};
  @Input() page: string;
  @Input() inputData: string;
  viewType: string = "MIN";
  @Input() widgetDesc: string;

  constructor( private router: Router,private a_route: ActivatedRoute) {
   }

  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.menu = this.widgetDesc;
    dataPass.masterMenu =  this.inputData;
    dataPass.widgetName = "CareonlineTodayComponent";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }

  ngOnInit() {
    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
     }
     this.headerTitle=this.widgetDesc;

     this.a_route.queryParams.subscribe((res) => {
      if(res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
      }
   })
  }

}
