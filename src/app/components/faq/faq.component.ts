import { ApiService } from './../../services/api.service';
import { UtilService } from './../../services/util.service';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/services/AppSettings';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqresponse:any;
  title="General";
  creditData:any=[];
  getName:any =AppSettings;
  loadAPIcall:boolean=false;

  titleList=[]
  constructor(
     private api: ApiService,
    private util: UtilService,
    ) { }

  ngOnInit() {
   this.FAQList('General');
   this.creditConsumptions();
   }

   creditConsumptions(){
    var profiledata: any = {}
    profiledata.userId = localStorage.getItem('userId')
    profiledata.userType = localStorage.getItem('userType')
    this.util.startLoader()
    this.api.create('user/profileDetails', profiledata).subscribe(res => {
      this.util.stopLoader();

      this.creditData=res.data.creditConsumptions;

    })
   }

  getelement(key){
   return this.creditData.find(item => item.creditType === key);
  }

   clickitem(item,index){
    this.title=item;

    if(item==='GigSumo Credits'){
         this.FAQList('Credits');
    }
    else if(item==='General'){
         this.FAQList('General');
    }
    else if(item==='Referral FAQ'){
         this.FAQList('Referal_FAQ');
    }

  }

  FAQList(module) {
    let data: any = {};
    data.module = module;
    // this.util.startLoader();
    this.loadAPIcall=true;

    this.api.create("home/findFAQs", data).subscribe(
      (res) => {
        // this.util.stopLoader();
        this.loadAPIcall=false;

        if (res.code == "00000") {
          this.faqresponse = res.data;
          if(module==''){
            this.titleList=[];
            this.faqresponse.faqList.forEach(element => {
            this.titleList.push(element.module);
            this.removeDuplicates(this.titleList)

            });

          }
        }
      },
      (err) => {
        this.util.stopLoader();
      }
    );
  }

  removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}


}
