import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-team-route-page',
  templateUrl: './team-route-page.component.html',
  styleUrls: ['./team-route-page.component.scss']
})
export class TeamRoutePageComponent implements OnInit {
  pathdata
  constructor(private api: ApiService,
    private router: ActivatedRoute,
    private util: UtilService,
    private commonValues: SearchData,
    ) { }

  ngOnInit() {
    // window.scrollTo(0, 0);
    this.router.queryParams.subscribe((res) => {
      this.pathdata = res;
         this.api.query("teams/get/" +this.pathdata.teamId).subscribe((res:any) => {
          if (res != undefined && res.data!=null &&  res != null || res.data.teams!=null) {
              this.commonValues.setTeamdata(res.data.teams)
          }
        },err => {
          this.util.stopLoader();
        });

    });

  }

}
