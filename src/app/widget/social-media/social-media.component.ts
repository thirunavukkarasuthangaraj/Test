import { ActivatedRoute } from '@angular/router';
import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {

 @Input('title') title: string = 'Follow GigSumo';
 @Input() widgetDesc: string;

  headerTitle: string = 'Follow GigSumo ';
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
