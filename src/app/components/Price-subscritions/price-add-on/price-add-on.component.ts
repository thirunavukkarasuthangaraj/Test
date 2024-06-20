import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price-add-on',
  templateUrl: './price-add-on.component.html',
  styleUrls: ['./price-add-on.component.scss']
})
export class PriceAddOnComponent  implements OnInit {
  Plan: boolean = false;
  constructor() { }


  contactsJson = [
    {
      "price": 25,
      "contacts": 1000,
      "mostPopular": true,
      "checked": false
    },
    {
      "price": 50,
      "contacts": 2500,
      "mostPopular": false,
      "checked": false
    }, {
      "price": 100,
      "contacts": 5000,
      "mostPopular": true,
      "checked": false
    }, {
      "price": 250,
      "contacts": 10000,
      "mostPopular": false,
      "checked": false
    }
  ]


  ActiveConversation = [
    {
      "price": 100,
      "contacts": 1000,
      "mostPopular": true,
      "checked": false
    },
    {
      "price": 250,
      "contacts": 2500,
      "mostPopular": false,
      "checked": false
    }, {
      "price": 500,
      "contacts": 5000,
      "mostPopular": true,
      "checked": false
    }, {
      "price": 1000,
      "contacts": 10000,
      "mostPopular": false,
      "checked": false
    },
  ]




  resumeViews  = [
    {
      "price": 25,
      "contacts": 1000,
      "mostPopular": true,
      "checked": false
    },
    {
      "price": 50,
      "contacts": 2500,
      "mostPopular": false,
      "checked": false
    }, {
      "price": 100,
      "contacts": 5000,
      "mostPopular": true,
      "checked": false
    }, {
      "price": 250,
      "contacts": 10000,
      "mostPopular": false,
      "checked": false
    }
  ]

  jobCandidate  = [
    {
      "price": 10,
      "contacts": 5,
      "mostPopular": true,
      "checked": false
    },
    {
      "price": 10,
      "contacts": 25,
      "mostPopular": false,
      "checked": false
    }, {
      "price": 25,
      "contacts": 50,
      "mostPopular": true,
      "checked": false
    }, {
      "price": 50,
      "contacts": 100,
      "mostPopular": false,
      "checked": false
    }
  ]


  enterPrice  = [
    {
      "price": 10,
      "contacts": 5,
      "mostPopular": true,
      "checked": false
    },
    {
      "price": 10,
      "contacts": 25,
      "mostPopular": false,
      "checked": false
    }, {
      "price": 25,
      "contacts": 50,
      "mostPopular": true,
      "checked": false
    }, {
      "price": 50,
      "contacts": 100,
      "mostPopular": false,
      "checked": false
    }
  ]






  ngOnInit() {


  }

  clickitem(contacts,index){
    if(contacts=='contacts'){
      if(this.contactsJson[index].checked){
        this.contactsJson.forEach(item => item.checked = false);
      }else{
        this.contactsJson.forEach(item => item.checked = false);
        this.contactsJson[index].checked=true;
      }

    }


    if(contacts=='conversation'){
      if(this.ActiveConversation[index].checked){
        this.ActiveConversation.forEach(item => item.checked = false);
      }else{
        this.ActiveConversation.forEach(item => item.checked = false);
        this.ActiveConversation[index].checked=true;
      }

    }



    if(contacts=='resume'){
      if(this.resumeViews[index].checked){
        this.resumeViews.forEach(item => item.checked = false);
      }else{
        this.resumeViews.forEach(item => item.checked = false);
        this.resumeViews[index].checked=true;
      }

    }


    if(contacts=='job'){
      if(this.jobCandidate[index].checked){
        this.jobCandidate.forEach(item => item.checked = false);
      }else{
        this.jobCandidate.forEach(item => item.checked = false);
        this.jobCandidate[index].checked=true;
      }

    }



  }

  toggleclick(event){

    if (event.target.checked) {
      this.Plan = true;
    } else if (event.target.checked == false) {
      this.Plan = false;
    }

  }

}
