import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from './../../../services/util.service';
import { UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { setInterval } from 'timers';
import { environment } from 'src/environments/environment';
//import { StreamRouter } from 'src/app/services/streamRouter';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  sess_response: any = [];
  sessionExpired = false;
  routeto: string;

  constructor(private http: HttpClient, private router: Router,
    private route: ActivatedRoute, private api: ApiService, private fb: UntypedFormBuilder, private util: UtilService) {

  }

  ngOnInit() {
    this.StripeApi();
  }

  StripeApi() {
    this.util.startLoader();
    window.scrollTo(0, 0);
    const Secretkey = environment.Sec_key;
    this.route.params.subscribe((params) => {
      const stripeURLs: string = 'https://api.stripe.com/v1/checkout/sessions/' + params.Id;
      this.api.getStripeSession(stripeURLs, Secretkey).subscribe((response:any) => {
        console.log('Stripe response:', response);

        if(response.payment_status=='paid'){

          localStorage.setItem("MemberShipType" , "Team");
          this.util.stopLoader();
          setTimeout(() => {
            let data: any = {};
            data.userId = localStorage.getItem('userId');
            data.menu = 'billing';
            this.router.navigate(["personalProfile"], { queryParams: data });

          }, 1000);
        }

      }, (error) => {

        console.error('Error fetching Stripe Balance:', error);

      })

    })
  }


}




// let data: any = {};
// data.userId = localStorage.getItem('userId');
// data.menu = 'billing';
// setTimeout(() => {
//   this.query(data);
// }, 2000);






// query(data) {

//   this.util.startLoader();
//   this.api.query("user/" + localStorage.getItem('userId')).subscribe((res) => {
//     if (res && res.code === "00000") {
      // localStorage.setItem("MemberShipType" , res.memberShipType);
//       this.util.stopLoader();
//       this.router.navigate(["personalProfile"], { queryParams: data });
//     }
//   }, err => {
//     this.util.stopLoader();
//   });

// }


// back() {
// let data: any = {};
// data.userId = localStorage.getItem('userId');
// data.menu = 'billing';

//   if (localStorage.getItem('gotolist') != undefined && localStorage.getItem('gotolist') == 'JOB') {
//     localStorage.removeItem('gotolist');
//     this.router.navigate(["newjobs"])
//   }
//   else if (localStorage.getItem('gotolist') != undefined && localStorage.getItem('gotolist') == 'CANDIDATE') {
//     localStorage.removeItem('gotolist');
//     this.router.navigate(["newcandidates"]);
//   }

//   else {

// this.router.navigate(["personalProfile"], { queryParams: data });

//   }

// }






//   sessionAPicall(date) {
//   this.util.startLoader();
//   let planbenefits: any = await this.api.lamdaFunctionsget("payment/checkoutSuccess/" + date);
//   this.util.stopLoader();
// let data: any = {};
// data.userId = localStorage.getItem('userId');
// data.menu = 'billing';
// this.router.navigate(["personalProfile"], { queryParams: data });


// }


// }
