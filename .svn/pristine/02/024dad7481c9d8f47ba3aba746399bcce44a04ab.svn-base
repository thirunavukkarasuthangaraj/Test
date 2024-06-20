import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hashtags-you-may-like',
  templateUrl: './hashtags-you-may-like.component.html',
  styleUrls: ['./hashtags-you-may-like.component.scss']
})
export class HashtagsYouMayLikeComponent implements OnInit {

  @Input('title') title: string = '# Hashtags To Follow';
  @Input() widgetDesc: string;

  headerTitle: string = '# Hashtags To Follow';
  user: any = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

  constructor(private a_route: ActivatedRoute) {
   }

  ngOnInit() {
    this.headerTitle=this.widgetDesc;
     this.a_route.queryParams.subscribe((res) => {
      if(res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
      }
   })
  }

}
