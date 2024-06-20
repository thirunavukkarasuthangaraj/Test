import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { forEach } from 'lodash';
import { UtilService } from './../../../services/util.service';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './../../../services/AppSettings';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  userId: string = localStorage.getItem('userId');
  stripePromise = loadStripe(AppSettings.stripekey);
  creditreponse: any = [];
  sufficient: any;
  JobOrCandidate: string
  path: any;
  colurclass: any = ["p-green", "p-yel", "p-red", "p-theme", "p-violet", "p-green", "p-yel", "p-red", "p-theme", "p-violet", "p-green", "p-yel", "p-red", "p-theme", "p-violet", "p-green", "p-yel", "p-red", "p-theme", "p-violet", "p-green", "p-yel", "p-red", "p-theme", "p-violet", "p-green", "p-yel", "p-red", "p-theme", "p-violet", "p-green", "p-yel", "p-red", "p-theme", "p-violet"]

  modalRef?: BsModalRef;
  amounts: number = 100.00;
  constructor(private http: HttpClient, private rout: Router, private _location: Location, private route: ActivatedRoute, private util: UtilService, private api: ApiService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(res => {
      this.path = res.path;
      this.sufficient = res.sufficient;
      this.JobOrCandidate = res.routingBack;


    });
    this.findcredit();
    window.scrollTo(0, 0);
    setTimeout(() => {
      localStorage.removeItem('getPrevious');
    }, 2000);
  }

  back() {

    if (this.path != undefined && this.path.indexOf("newjobs") == 1) {
      this.rout.navigate(["newjobs"]);
    } else if (this.path != undefined && this.path.indexOf("newcandidates") == 1) {
      this.rout.navigate(["newcandidates"]);
    } else if (this.path != undefined && this.path.indexOf("personalProfile") == 1) {
      let data: any = {};
      data.userId = localStorage.getItem('userId');
      data.menu = 'billing';
      this.rout.navigate(["personalProfile"], { queryParams: data });
    } else {
      this._location.back();
    }
  }

  findcredit() {

    let data: any = { "module": "Purchase" };
    this.util.startLoader()
    this.api.create('credits/findCredits', data).subscribe((res) => {
      this.util.stopLoader()
      this.creditreponse = res.data.credit;
      this.creditreponse.forEach(element => {
        this.sortDate(this.creditreponse);
      });
    })


  }
  sortDate(data) {
    return data.sort((a, b) => {
      return a.points - b.points;
    });
  }

  async pay(amount: any, item): Promise<void> {
    let payment: any = {

      // name: 'Purchasing Credit Points : ' + item.points,
      // currency: 'usd',
      // point: item.points,
      // sourceId: item.points,
      // descrition: item.description,
      // amount: amount,
      // userId: this.userId,
      // quantity: 1,
      // cancelUrl: 'http://localhost:4200/cancel',
      // successUrl: 'http://localhost:4200/success',



      /// new impl
      name: 'Pro Plan',
      plan: 'Pro',
      billType: 'monthly',
      currency: 'usd',
      pincode:'12345',
      descrition: item.description,
      amount: 2500,
      userId: this.userId,
      quantity: 1,
      cancelUrl: 'http://localhost:4200/cancel',
      successUrl: 'http://localhost:4200/success',



    };

    const stripe = await this.stripePromise;
    this.util.startLoader();
     this.http.post(AppSettings.ServerUrl + "subscription/payment/createCheckout", payment)
      .subscribe((res: any) => {
        stripe.redirectToCheckout({
          sessionId: res.data.sessionID,
        });
        this.util.stopLoader();

      });
  }
}


