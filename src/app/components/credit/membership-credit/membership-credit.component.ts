import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ApiService } from './../../../services/api.service';
import { UtilService } from './../../../services/util.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AppSettings } from 'src/app/services/AppSettings';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-membership-credit',
  templateUrl: './membership-credit.component.html',
  styleUrls: ['./membership-credit.component.scss']
})
export class MembershipCreditComponent implements OnInit {
  modalRef: BsModalRef;
  creditform: UntypedFormGroup;
  creditformnew !: UntypedFormGroup;
  submited: boolean = false;
  points: any = [];
  loadAPIcall:boolean=false
  availableredim: any = [];
  redeimform: UntypedFormGroup;
  messageShow = false;
  message: any;
  createdOn: any;
  id = "1";
  month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  getName: any = AppSettings;
  public envName: any = environment.name;
  project = { duration: '1' };
  userType = localStorage.getItem('userType');
  faqresponse: any;
  creditPoint:any='0';
  paymentResponse:any;
  constructor(
    private modalService: BsModalService, private http: HttpClient,
    private api: ApiService, private fb: UntypedFormBuilder, private util: UtilService) { }
  ngOnInit() {
    this.generateYears();
    this.redeimform = this.fb.group({
      available: [null],
      gigsumocredit: [null, Validators.required],
    });
    this.apicall();
  }

  activeTab(id) {
    this.id = id;
    this.apicall();
    if (id == 3) {
      this.FAQList();
    }

  }
  years: any = []
  date: any = []
  generateYears() {
    this.years = []
    this.date = []
    for (var i = 2023; i <= 2040; i++) {
      this.years.push(i);
    }
  }


  FAQList() {
    let data: any = {};
    data.module = "Credits";
   // this.util.startLoader();
    this.api.create("home/findFAQs", data).subscribe(
      (res) => {
        this.util.stopLoader();
        if (res.code == "00000") {
          this.faqresponse = res.data;
        }
      },
      (err) => {
        this.util.stopLoader();
      }
    );
  }

  apicall() {
    this.loadAPIcall=true
    var data: any = {}
    data.userId = localStorage.getItem('userId');
    data.userType = localStorage.getItem('userType');
    this.api.create('user/profileDetails', data).subscribe(res => {
      this.loadAPIcall=false
      this.points = res.data;

    })
  }


  getelement(key) {
    return this.points.creditConsumptions.find(item => item.creditType === key);
  }

  change(event: any) {
     if (this.creditform.value.point.length != 0) {
      this.submited = false;
    } else if (this.creditform.value.point.length == 0) {
      this.submited = true;
    }
  }
  checkReferalpoint(event: any) {
   }


  RedeemPoint() {

    if (this.redeimform.value.gigsumocredit == null || this.redeimform.value.gigsumocredit == "") {
      this.messageShow = true;
      this.message = "Please enter redeem to gigSumo credits";
    } else if (
      this.redeimform.value.gigsumocredit == "0"
      || this.redeimform.value.gigsumocredit == "00"
      || this.redeimform.value.gigsumocredit == "000"
      || this.redeimform.value.gigsumocredit == "0000"
      || this.redeimform.value.gigsumocredit == "00000"
      || this.redeimform.value.gigsumocredit == "000000") {
      this.messageShow = true;
      this.message = "Please enter valid input";
    }
    else if (this.points.userCredits < this.redeimform.value.gigsumocredit) {
      this.messageShow = true;
      this.message = "You've exceeded the available credits for redeeming";
    } else {

      this.messageShow = false;
      if (this.points.userCredits != 0 && this.redeimform.value.gigsumocredit != null) {
        var data: any = {}
        data.userId = localStorage.getItem('userId');
        data.pointsToRedeem = this.redeimform.value.gigsumocredit;


        this.api.create('credits/redeemCredits', data).subscribe(res => {
          this.util.stopLoader();
          this.availableredim = res.data;
          this.modalRef.hide();

          Swal.fire({
            icon: "success",
            title: "Redeem Successfully",
            showDenyButton: false,
            showConfirmButton: false,

            timer: 2000,
            // confirmButtonText: `ok`,
            // timer: 3500,
          })

          setTimeout(() => {
            this.apicall();
          }, 1000)
        })

      }

    }
  }





  get credit() {
    return this.creditform.controls
  }


  calcredit(credit: string) {
    const credits = +credit;
    this.creditPoint=credit;
    let discount;
    switch (credits) {
      case 50:
        discount = (credits / 5) - 0.5;
        discount = '$' + discount;
        this.creditformnew.patchValue({
          cost: discount,
          amount: String(credits)
        });
        break;
      case 100:
        discount = (credits / 5) - 1;
        discount = '$' + discount;
        this.creditformnew.patchValue({
          cost: discount,
          amount:String(credits)
        });
        break;
      case 200:
        discount = (credits / 5) - 2;
        discount = '$' + discount;
        this.creditformnew.patchValue({
          cost: discount,
          amount:String(credits)
        });
        break;
      case 500:
        discount = (credits / 5) - 5;
        discount = '$' + discount;
        this.creditformnew.patchValue({
          cost: discount,
          amount:String(credits)
        });
        break;
      case 1000:
        discount = (credits / 5) - 10;
        discount = '$' + discount;
        this.creditformnew.patchValue({
          cost: discount,
          amount:String(credits)
        });
        break;
      default:
        break;
    }

  }


  getcardtoken() {
    (<any>window).Stripe.card.createToken({
    number: this.creditformnew.value.cardNumber,
    exp_month: this.creditformnew.value.expMonth,
    exp_year: this.creditformnew.value.expYear,
    cvc: this.creditformnew.value.cvc

  }, (status: number, response: any) => {

    if (status === 200) {
       this.chargeCard( response.id);
    } else {
     }
  });
}


  chargeCard(token: string) {
    let amount: string = this.creditformnew.value.amount;
     const commonHeader = {
      headers: new HttpHeaders({
        'amount': amount,
        'token': token,
      })
    };
    this.api.creditPurches('credit/payment/charge', commonHeader)
      .subscribe(response => {
         if (response.status == "succeeded") {
          this.buycredit(response);
        }
      })
  }



  buycredit(response) {
    let data: any = {};
    data.userId = localStorage.getItem('userId'),
    data.totalPoints =  this.creditPoint;
   // this.util.startLoader();
    this.api.create("credits/buyCredits", data).subscribe(res => {
      this.util.stopLoader();
      // this.modalRef.hide();
      if (res.code == "00000") {
        // (this.points.creditPoints)+(this.creditPoint);
        this.creditPoint="1";
        this.paymentResponse=response;
      }
    }, err => {
      this.util.stopLoader();
    })
  }



  closemodel(){
    this.modalRef.hide();
    this.creditPoint="0";
  }

  openModal(template: TemplateRef<any>) {
    this.creditformnew = this.fb.group({
      selectedcredits: [null],
      cost: [null, Validators.required],
      amount: [null, Validators.required],
      nameoncard: [null, Validators.required],
      cardNumber: [null, Validators.required],
      cvc: [null, Validators.required],
      expMonth: [null, Validators.required],
      expYear: [null, Validators.required],
    });
    this.modalRef = this.modalService.show(template, { class: 'modal-md', backdrop: 'static', keyboard: false });
  }

  RedeeModel(template: TemplateRef<any>) {
    this.redeimform.reset();
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.redeimform.patchValue({ 'available': this.points.userCredits })
  }


}
