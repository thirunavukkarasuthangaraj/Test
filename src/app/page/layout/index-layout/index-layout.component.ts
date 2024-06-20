import { Subscription } from 'rxjs';
import { CommonValues } from './../../../services/commonValues';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MessagemodelComponent } from './../../../components/messagemodel/messagemodel.component';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from './../../../services/api.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { SearchData } from 'src/app/services/searchData';
declare var $: any;

@Component({
  selector: 'app-index-layout',
  templateUrl: './index-layout.component.html',
  styleUrls: ['./index-layout.component.scss']
})
export class IndexLayoutComponent implements OnInit {
  userDetailsLanding: any = [];
  userId;
  divHeight
  //Dev Code
  @ViewChild('landingside1') menuElement: ElementRef;
  @ViewChild('landingside2') menuElement1: ElementRef;

  landingsidesticky1: boolean = true;
  landingsidesticky2: boolean = false;
  csshide:Boolean=false
  elementPosition: any;
  bsModalRef: BsModalRef;
  messageData:any = {};
  messagemodelflag:Boolean=false;
  totalmsgcount: Subscription;
  connectionSubScription : Subscription;
  totalmsgcounts:any;
  loadAPIcall:boolean=false;


  constructor(private API: ApiService,private commonvalues: CommonValues,private searchData : SearchData,private modalService: BsModalService,) {

    this.totalmsgcount = this.commonvalues.getmsgcountJob().subscribe((res) => {
      this.totalmsgcounts=res;
    });

    this.connectionSubScription = this.searchData.getContactCount().subscribe(res=>{
      if(res){
         this.messageData  = {
          userId : localStorage.getItem('userId'),
          id : null,
          removeConnection : true,
          owner : true,
         };
      }
    });
   }

  ngOnInit() {
    this.loadAPIcall=true
    setTimeout(() => {
      this.loadAPIcall=false;
    }, 2000);
    if(window.innerHeight==500 && window.innerWidth==1093){
      this.csshide=true;
    } else if(window.innerHeight>500 && window.innerWidth>1093){
      this.csshide=true;
    } else if(window.innerHeight<500 && window.innerWidth<1093){
      this.csshide=true;
    }

    this.userId = localStorage.getItem('userId');

    setTimeout(() => {
        this.checkSecondaryMailCheck();
    }, 5000);
   }

  ngAfterViewInit(){
    window.scrollTo(0, 0);
   // this.elementPosition = this.menuElement.nativeElement.offsetTop;
   }

  @HostListener('window:scroll')
    handleScroll(){
      const windowScroll = window.pageYOffset;
      if(windowScroll >= 24){
        // this.landingsidesticky1 = true;
        this.landingsidesticky2 = true;

      } else {
        // this.landingsidesticky1 = false;
        this.landingsidesticky2 = false;
      }
    }

    @HostListener("window:resize")
    onResize() {
         if(window.innerHeight==500 && window.innerWidth==1093){
          //this.landingsidesticky1 = false;
          //this.landingsidesticky2 = true;
          this.csshide=true;
        }else  if(window.innerHeight>500 && window.innerWidth>1093){
          //this.landingsidesticky1 = false;
         // this.landingsidesticky2 = true;
          this.csshide=true;
        }else  if(window.innerHeight<500 && window.innerWidth<1093){
          this.csshide=false;
        }
     }

     modelopen() {
      const initialState: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'xl',
      };
      this.bsModalRef = this.modalService.show(MessagemodelComponent, initialState);
      this.bsModalRef.content.closeBtnName = 'Close';
    }



  chatbottom() {
    let seletedItem:any={};
    // this._socket.ngOnDestroy();
    // this._socket.connections();
    // this._socket.connections_stream();

    seletedItem.owner=true;
    this.messagemodelflag=true;
    seletedItem.userId = localStorage.getItem('userId');
    seletedItem.id = null;
    this.messageData = seletedItem;


  }
  closeMessage(event) {
    this.messagemodelflag = false;
    // this._socket.ngOnDestroy();
    // this._socket.connections_stream();

  }

  notificationTitle: string = "";
  notificationContent: string = "";
  showSecondaryAlert: boolean = false;
  checkSecondaryMailCheck() {
    this.API.query("home/checkSecondaryIsNonGenericMail").subscribe((res) => {
      if (res && res.data.show) {
        this.notificationTitle = res.data.isSecondaryNull ? "Secondary Email Required" : "Secondary Email Change"
        this.notificationContent = res.data.isSecondaryNull ?
        "Secondary email address is missing in your profile. It is mandatory to maintain your account on the platform. Please update your profile with a secondary email address."
         : "Please change your secondary email address to a generic one (Hotmail, Gmail etc) in the profile";
        this.showSecondaryAlert = true;
      }
    });

  }

}
