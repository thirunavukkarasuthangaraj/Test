import { ApiService } from './../../services/api.service';
//import { UtilService } from './../../../services/util.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-invites-cerdits',
  templateUrl: './invites-cerdits.component.html',
  styleUrls: ['./invites-cerdits.component.scss']
})
export class InvitesCerditsComponent implements OnInit {
  id:any="1";
  invitesdata
  loadAPIcall:boolean=false;
  constructor(private apiService:ApiService,private util: UtilService) { }

  ngOnInit() {

    this.getinviteData();
  }

  activeTab(getid){
    this.id=getid;
    this.getinviteData()
 }
 refershIvitesCount(){
  this.getinviteData()

 }

 getinviteData(){
  //this.util.startLoader();
  this.loadAPIcall=true
  this.apiService.query("home/getReferralCountsAndPoints/"+localStorage.getItem('userId') ).subscribe((res) => {
    this.loadAPIcall=false
    this.util.stopLoader();


     if (res.code == "00000") {
    this.invitesdata=res;
     }
  this.util.stopLoader();
}, err => {
  this.util.stopLoader();

  })

}

}
