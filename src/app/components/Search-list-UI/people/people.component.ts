import { FormGroup, UntypedFormControl } from '@angular/forms';
import { SearchListComponent } from './../../search-list/search-list.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
 import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {


//   Alldata;

//   notscrolly = true;
//   notEmptyPost = true;
//   peopleData: string[];
//   photoId: any;
//   users;
//   communityPages;
//   offsetvalue;
//  count =0;
selColor: string;


   term;
   connected: boolean = false
   notConnected: boolean = false

//   title:string = "People"
//   Arraylength



  isAdmin
  photoId: any;


  constructor(
    private API: ApiService,
    private spinner: NgxSpinnerService,
    private serachComponent:SearchListComponent,
    private http: HttpClient,
    private router: Router ,
    private route: ActivatedRoute,
   private util: UtilService,
  ) {

  }
  colors: Array<any> = ['hgreen', 'hred', 'horange', 'hyellow'];

  randomColor(): void {
    this.selColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }


  connetedstatus(data){

  }

  removedata(data){

  }

  sendmsg(data){
    var userData: any= {}
    userData.userid  = data.userId
    this.router.navigate(['message'], {queryParams : userData})
 }



allpost;
notEmptyPost = true;
notscrolly = true;
offsetvalue;
count =0;

userData = true;
userData1 = false;

navaData;
  srarch;

selector: string = ".search-results";
// cls(){
//   ////// console.log('callback function ........s');
// };

lenght;
 ngOnInit() {
   this.route.queryParams.subscribe((data) =>{
     ////// console.log('People data : ', data);
     this.navaData = data.data;
     this.srarch = data.searchData;

     this.term = data.searchData
   })
   if(this.navaData != 'undefined' && this.srarch != 'undefined'){

    this.loadInitPost();
  }else{
    this.loadInitPost();
  }
  //  ////// console.log('this.navaData !=  && this.srarch != ', this.navaData ,this.srarch)
  //  if(this.navaData != 'undefined' && this.srarch != 'undefined'){
  //   // this.loadInitPost();
  //   this.loadUserData();
  //  }else {
  //   //  this.loadUserData();
  //   this.loadInitPost();
  //  }

}
// load the Initial 6 posts
loadInitPost() {
  const data = {'search': this.srarch,


    // 'searchContent':'ALL',
    'searchContent': 'ALL',
    'loginUserId':localStorage.getItem('userId'),
    'page': {
            'offSet': 0,
            'pageCount': 20
            }
    };
    this.util.startLoader()
 this.API.create('home/profiles/search' , data).subscribe(data => {
   this.util.stopLoader()
   ////// console.log("user data :",data.users);
   this.allpost = data.users;
   this.lenght = data.users.length;
   this.allpost.forEach(element => {
    element.userImage = AppSettings.photoUrl + element.photo;
    element.userColor =this.colors[Math.floor(Math.random() * this.colors.length)];
   });
       this.photoId = this.allpost.userImage

   ////// console.log(this.lenght);
  },err => {
    this.util.stopLoader();

   });

}

loadUserData(){
  const data = {'search': this.srarch,
    'searchContent':'ALL',
    // 'searchContent': 'USER',
    'loginUserId':localStorage.getItem('userId'),
    'page': {
            'offSet': 0,
            'pageCount': 50
            }
    };
 this.util.startLoader()
 this.API.create('home/profiles/searchAll' , data).subscribe(data => {
   this.util.stopLoader()
   ////// console.log("user data 2:",data.users);
   this.allpost = data.users;
   this.lenght = data.users.length;
   ////// console.log(this.lenght);
  },err => {
    this.util.stopLoader();

   });

}
onScroll() {
 // ////// console.log('Scrolling..........');

if (this.notscrolly === true && this.notEmptyPost === true) {
 ////// console.log('Scrolling..........')

 this.notscrolly = false;
 this.loadNextPost();
 this.offsetvalue = this.count++;
 ////// console.log('this.offsetvalue',this.offsetvalue)
}
}
// load th next 6 posts
loadNextPost() {
 const url = AppSettings.ServerUrl+ 'home/profiles/searchAll';

 const data2 = {'search': '',
    // 'searchContent':'ALL',
    'searchContent': 'ALL',
    'loginUserId':localStorage.getItem('userId'),
    'page': {
            'offSet': 1,
            'pageCount': 50
            }
    };

    ////// console.log('this.offsetvalue',this.offsetvalue)

 this.util.startLoader()
 this.API.create('home/profiles/searchAll' , data2)
 .subscribe( (data: any) => {
   this.util.stopLoader()
    const newPost = data.users;
    ////// console.log('newPost' , newPost);
    ////// console.log('newPost.length' , newPost.length);
    //this.spinner.hide();
    if (newPost.length === 5 ) {
      this.notEmptyPost =  false;
    }
    // add newly fetched posts to the existing post
    this.allpost = this.allpost.concat(newPost);
    this.notscrolly = true;
  },err => {
    this.util.stopLoader();

   });

}

clearInput = new UntypedFormControl();

clearData(){
  this.clearInput.reset();
////// console.log('cleare Data')
}

peopleData(user){

  this.userData = false;
  this.userData1 = true;

  const data = {
  'search': this.clearInput.value,


    // 'searchContent':'ALL',
    'searchContent': 'ALL',
    'loginUserId':localStorage.getItem('userId'),
    'page': {
            'offSet': 0,
            'pageCount': 50
            }
    };
    this.util.startLoader()
 this.API.create('home/profiles/search' , data).subscribe(data => {
   this.util.stopLoader()
   ////// console.log("user data :",data.users);
   this.allpost = data.users;
   this.lenght = data.users.length;
   this.allpost.forEach(element => {
    element.userImage = AppSettings.photoUrl + element.photo;
    element.userColor =this.colors[Math.floor(Math.random() * this.colors.length)];
   });
       this.photoId = this.allpost.userImage

   ////// console.log(this.lenght);
  },err => {
    this.util.stopLoader();

   });

}

connect(data){
  ////// console.log('connect data:' ,data)
  data.requestedBy = localStorage.getItem('userId')
  // this.util.startLoader()
  this.API.create('user/connect', data).subscribe(res=>{
    ////// console.log('connect data :' , res)
    // this.util.stopLoader()
    if(res.code=="00000"){

      if(res.message === "Connect request sent successfully"){
        this.notConnected = true
      }
      this.ngOnInit()
      //message to show connect request is sent successfully
      // this.requestSent = true
      // this.notConnected = false
      // this.connected = false

      // if()
      // setTimeout(function(){ Swal.fire("Request has been sent Successfully!"); }, 200);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Request sent successfully",
        showConfirmButton: false,
        timer: 2000,
        });

    }else if(res.code=="88888"){
      // this.requestSent = false
      // this.notConnected = false
      // this.connected = false
    }
  },err => {
    this.util.stopLoader();

   });

}

cancelConnectionRequest(data){
  ////// console.log('Cancel Connection Data', data)
  //  data.userId = localStorage.getItem('userId')
   ////// console.log('connData.userId',data.userId)
  this.util.startLoader()
  this.API.create('user/connect/cancel',data).subscribe(res =>{
    this.util.stopLoader()
    ////// console.log('Cancel Connection : ', res);
    if(res.code === '00000'){
      ////// console.log('Connect request cancelled successfully');
      // setTimeout(function(){ Swal.fire("Request has been sent Successfully!"); }, 200);
      // this.user.connectionStatus="NOT_CONNECTED";
      // this.initCard();
      // this.requestSent = false
      // this.notConnected = true
      // this.connected = false
      this.ngOnInit()
    }else if(res.code === '88888'){
      ////// console.log('Unable to Cancel connection');
    }
  },err => {
    this.util.stopLoader();

   });

}
dynamicdata(arg0: string, dynamicdata: any) {
  throw new Error("Method not implemented.");
}





}
