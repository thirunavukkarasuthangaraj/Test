import { ApiService } from './../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-widget',
  templateUrl: './welcome-widget.component.html',
  styleUrls: ['./welcome-widget.component.scss']
})
export class WelcomeWidgetComponent implements OnInit {
  showWelcomePost: boolean = false
  @Input() widgetDesc: string;
  headerTitle;
  following: boolean = false
  constructor( private a_route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {

    this.headerTitle=this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      if(res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
    }
    if(res.showWelcomePost=="true"){
      this.showWelcomePost = true

    }
  })
  }

  follow(){
    var data: any = {}
    data.userId = localStorage.getItem('userId')
    data.followerUserId = localStorage.getItem('userId')


    this.api.create('user/followUser', data).subscribe(res=>{
      if(res.code == '00000'){
        this.following = true
      }
    })
  }


  // profileStatus() {
  //   let datas: any = {};
  //   datas.userId = localStorage.getItem('userId')
  //   this.api.query("user/profile/complete/" + localStorage.getItem('userId')).subscribe(res => {

  // })

  // }
}
