import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-similar-community',
  templateUrl: './similar-community.component.html',
  styleUrls: ['./similar-community.component.scss']
})
export class SimilarCommunityComponent implements OnInit {

  @Input('title') title: string = 'Similar  Communities (Public search)';
  @Input() widgetDesc: string;

  headerTitle: string = 'Similar  Communities (Public search)';
  user: any = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

  constructor(private a_route: ActivatedRoute) {
   }

  ngOnInit() {

      this.headerTitle=this.widgetDesc;

      this.a_route.queryParams.subscribe((res) => {
        if(res.master && res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
          this.headerTitle=res.menu;
      }
   })
  }

}
