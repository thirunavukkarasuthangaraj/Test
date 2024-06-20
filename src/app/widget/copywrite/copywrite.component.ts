import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-copywrite',
  templateUrl: './copywrite.component.html',
  styleUrls: ['./copywrite.component.scss']
})

export class CopywriteComponent implements OnInit {
  showflag:boolean=false;
  @Input() widgetDesc: string;
  headerTitle;
  constructor( private a_route: ActivatedRoute) { }

  ngOnInit() {
    setTimeout(() => {
      this.showflag=true;
    }, 4000);

       this.headerTitle=this.widgetDesc;
       this.a_route.queryParams.subscribe((res) => {
        if(res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
          this.headerTitle=res.menu;
       }
    })
  }
}
