import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { SearchData } from "src/app/services/searchData";

@Component({
  selector: "app-team-home-page",
  templateUrl: "./team-home-page.component.html",
  styleUrls: ["./team-home-page.component.scss"],
})
export class TeamHomePageComponent implements OnInit {
  commonVariables: any = {};
  constructor(private api: ApiService, private searchData: SearchData) {}

  ngOnInit() {

  }
}
