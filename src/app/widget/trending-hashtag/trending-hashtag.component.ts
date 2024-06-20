import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trending-hashtag',
  templateUrl: './trending-hashtag.component.html',
  styleUrls: ['./trending-hashtag.component.scss']
})
export class TrendingHashtagComponent implements OnInit {

  @Input('title') title: string = 'Trending # Hashtags ';

  headerTitle
  user: any = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
  @Input() widgetDesc: string;

  constructor(private a_route: ActivatedRoute) {
  }
  ngOnInit() {

    this.headerTitle=this.widgetDesc;
     this.a_route.queryParams.subscribe((res) => {
      if(res.menu!=null &&res.menu!=undefined){
       this.headerTitle=res.menu;
      }
   })
  }

}
