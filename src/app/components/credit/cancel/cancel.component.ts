import { UtilService } from './../../../services/util.service';
import { ApiService } from './../../../services/api.service';
import { UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss']
})
export class CancelComponent implements OnInit {

  constructor(private http: HttpClient,private router: Router, private route: ActivatedRoute, private api: ApiService, private fb: UntypedFormBuilder, private util: UtilService) { }

  ngOnInit() {
     this.route.queryParams.subscribe((res) => {
      // console.log(res.id)
      this.sessionAPicall(res.id);
    });

    window.scrollTo(0,0);
  }



  async sessionAPicall(data){
    this.util.startLoader();
    let planbenefits: any = await this.api.lamdaFunctionsget("payment/checkoutCancelled/" + data);
    this.util.stopLoader();
  }

  back(){
    this.router.navigate(['/plan-quota']);
   }

}
