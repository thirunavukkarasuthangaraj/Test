import { ApiService } from './../../../services/api.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-business-security-settings',
  templateUrl: './business-security-settings.component.html',
  styleUrls: ['./business-security-settings.component.scss']
})
export class BusinessSecuritySettingsComponent implements OnInit {
  @Input() commonemit
  values: any;
  loadAPIcall:boolean=false
  constructor(private api: ApiService) { }

  ngOnInit() {
    var businessId = localStorage.getItem('businessId')
this.loadAPIcall=true
    this.api.query('business/businessSecurityDetails/' + businessId).subscribe(res=>{
      this.loadAPIcall=false
      this.values = res.data.businessSecurityDetails

    })
  }

}
