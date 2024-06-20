import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hashtags-to-follow',
  templateUrl: './hashtags-to-follow.component.html',
  styleUrls: ['./hashtags-to-follow.component.scss']
})
export class HashtagsToFollowComponent implements OnInit {
  @Input() widgetDesc: string;
  headerTitle;
  constructor(private a_route: ActivatedRoute) { }

  ngOnInit() {
    this.headerTitle=this.widgetDesc;

    this.a_route.queryParams.subscribe((res) => {
      if(res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
      }
   })

  }

}
