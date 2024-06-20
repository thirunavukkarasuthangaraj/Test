import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-widget',
  templateUrl: './empty-widget.component.html',
  styleUrls: ['./empty-widget.component.scss']
})
export class EmptyWidgetComponent implements OnInit {
  @Input() widgetDesc: string;
  headerTitle;
  constructor( private a_route: ActivatedRoute) { }

  ngOnInit() {
    this.headerTitle=this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      if(res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
    }
 })
}
}
