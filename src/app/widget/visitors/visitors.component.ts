import { url } from 'inspector';
import { UtilService } from './../../services/util.service';
import { ApiService } from './../../services/api.service';
import { Component, Input,Output,EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { AppSettings } from 'src/app/services/AppSettings';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from "sweetalert2";
import { UserCardConfig } from 'src/app/types/UserCardConfig';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss']
})
export class VisitorsComponent implements OnInit {

  @Input('title') title: any = 'Visitors';
  visitorsData: Array<any> = [];
  @Input() inputData: string;
  headerTitle: any = 'Visitors';
  showUI=false;
  apicalled:boolean=false;
  searchName: any;
  admin: Array<any> = [{ src: '1.jpg' }, { src: '2.jpg' }, { src: '3.jpg' }, { src: '4.jpg' }, { src: '5.jpg' },
  { src: '6.jpg' }, { src: '7.jpg' }, { src: '8.jpg' }, { src: '9.jpg' }];
  userData: any[];
  commonDatahide:any={}
  @Output()  commonFunction = new EventEmitter<string>();
  @Input() maxMin: any = {};
  @Input() page: string;
  viewType: string = "MIN";
  url=AppSettings.photoUrl;
  loadAPIcall:boolean=false;
  id;
  userCardConfig: UserCardConfig[] = []
  @Input() widgetDesc: string;

  constructor(private auth: ApiService,
              private routes: ActivatedRoute,
              private a_route: ActivatedRoute,
              private util : UtilService,
              private router:Router,
              private modalService: BsModalService,
              private JobServicecolor: JobService) {
    this.headerTitle = this.title;
  }


  route(item){
    this.router.navigate(['personalProfile'], { queryParams: item });

  }

  ngOnInit() {
     this.headerTitle=this.widgetDesc;
     this.a_route.queryParams.subscribe((res) => {
      if(res.master && res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
      }
    })
    let invite : UserCardConfig = new UserCardConfig("Invite", this.inviteFollower, this.canShow, true);
    invite.source = this;
    this.userCardConfig.push(invite);
    this.routes.queryParams.subscribe((res) => {
    this.id = res.id;
    });

    if (this.maxMin.viewType != undefined) {
        this.viewType = "MAX";
        this.inputData = this.maxMin.master;
     }

     this.getVisitors();

  }
 // for first and last name
 getInitialName(firstname: string,lastname: string): string {
  return this.JobServicecolor.getInitialsparam(firstname,lastname);
}
 // for first and last name
 getColorName(firstname: string,lastname: string): string {
  return this.JobServicecolor.getColorparam(firstname,lastname);
}

  getVisitors() {
    this.loadAPIcall=true;
      if (this.inputData == "BUSINESS") {
        this.auth.query("business/visitor/" + localStorage.getItem('businessId'))
          .subscribe((res) => {
            this.loadAPIcall=false;
            this.visitorsData = []
            this.util.stopLoader();
            if (res != null  && res != undefined  && res.data!=null && res.length != 0 && res.data.visitedList != null && res.data.visitedList.length != 0 ) {
              this.showUI=true;
              res.data.visitedList.forEach(ele=>{
                  this.visitorsData.push(ele)
              })
             if(this.visitorsData.length==0){
                this.showUI=false;
              }
            }else{
              this.hide(true);
            }
          },err => {
            this.util.stopLoader();
           });
      } else if (this.inputData == "COMMUNITY") {
        var datas = {
          "communityId":localStorage.getItem('communityId'),
          "userId": localStorage.getItem('userId'),
          "page": {
            "offSet": 0,
            "pageCount": 100
          }
        }

        this.auth.create("community/members/visited", datas).subscribe((res) => {
          this.util.stopLoader();
          this.showUI=false;
            if (res != null  && res != undefined && res.data.visitorList.length != 0 ) {

               this.visitorsData = []
              res.data.visitorList.forEach(element => {
                if (element.userId != 'undefined' || element.userId != 'null' || element.userId != null || element.userId != '') {
                  this.auth.query('user/connection/' + element.userId).subscribe(response => {

                     if(element.status=='REQUEST SEND'){
                        element.status  = 'REQUEST_SENT'
                      }
                       this.showUI=true;
                       response.status  = element.status
                       this.visitorsData.push(response)
                     if(this.visitorsData.length==0){
                      this.showUI=false;
                    }

                   })
                 }
               })
             } else{
              this.hide(true);
            }

          },err => {
            this.util.stopLoader();
             this.hide(true);
          });
      } else {
        this.showUI=false
      }

  }

  storedPage:any;
  beingTyped: boolean = false
  onSearch(event: any) {
    if(event.target.value!=''){
      this.config.currentPage = 1
      this.beingTyped = true
    }else if(event.target.value == ''){
      this.config.currentPage = this.storedPage
      this.beingTyped = false
    }
  }

  // modelopen(data) {
  //   let dataPass: any = {};
  //   dataPass.data   = data;
  //   if(this.inputData == "COMMUNITY"){
  //   dataPass.id   = localStorage.getItem('communityId');
  //  }else  if(this.inputData == "BUSINESS"){
  //   dataPass.id   = localStorage.getItem('businessId');
  //  }
  //   dataPass.master =  this.page;
  //   dataPass.masterMenu = this.inputData;
  //   dataPass.menu   = "Visitors ";
  //   dataPass.widgetName = "VisitorsComponent";
  //   this.router.navigate(['suggestions'], { queryParams: dataPass })
  //  }

  page1
  config = {
    itemsPerPage: 5,
    currentPage: 1
  }

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
  };


  pagecount(count) {
    // this.page1 = count;
    this.config.currentPage = count
    this.storedPage = count
    // this.visitorsData = visitorsData
  }


  modelopen(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, this.backdropConfig);
  }

  onScrollDown(){ }

  userprofile(data) {
    var userData: any = {}
    userData.userId = data
    this.router.navigate(['personalProfile'], { queryParams: userData })
  }
  canShow(){ }



  selectedEntities: any = []
  checkedList: any = []
  // page1: number = 1;

  onCheckboxChange(data, event) {
    if (event.target.checked) {
      // (option.communityId){
        // String()
        this.selectedEntities.push(String(data.userId))
        this.checkedList.push(String(data.userId))
        // this.selectedEntities = this.duplicate(this.selectedEntities)
      // }
    } else {
      this.theChecker = false
      // data.checked = false;
      for (var i = 0; i < this.selectedEntities.length; i++) {
        if (data.userId == data.userId) {
          this.checkedList.splice(i, 1);
          this.selectedEntities.splice(i,1);
        }
      }
    }
  }
  modalRef: BsModalRef;
  dismiss(){
    this.modalRef.hide()
    this.selectedEntities = []
    this.checkedList = []
    setTimeout(() => {
      this.searchName = ''
      this.theChecker = false
      this.config.currentPage = 1
      this.visitorsData.forEach(ele=>{
        ele.checked = false
      })
    }, 1000);
  }

  theChecker:any;

  checkAll(event){
    if(event.target.checked == true){
      // alert('checked all')
      this.visitorsData.forEach(ele=>{
        ele.checked = true
        this.selectedEntities.push(String(ele.userId))
        this.checkedList.push(String(ele.userId))
      })
    } else if(event.target.checked == false){
      this.selectedEntities = []
      this.checkedList = []
      this.visitorsData.forEach(ele=>{
        ele.checked = false
      })
    }
  }

  closeModal(){
    this.modalRef.hide()
    this.selectedEntities = []
    this.checkedList = []
    setTimeout(() => {
      this.searchName = ''
      this.theChecker = false
      this.config.currentPage = 1
      this.visitorsData.forEach(ele=>{
        ele.checked = false
      })
    }, 1000);
  }


  tempcheckedList: any = []



  inviteAll() {
    this.apicalled=true
   if(this.inputData == 'BUSINESS'){
    var a = ''
    a = this.selectedEntities
    var busId = localStorage.getItem('businessId')
    this.util.startLoader();
    this.auth.create("business/visitor/send/requests?businessId=" + busId + "&users=" +  a  + "&source=VISITOR", null ).subscribe(res=>{
      this.util.stopLoader();
      this.apicalled=false
      if(res.code == '00000'){
      Swal.fire({
        position: 'center',
            icon: 'success',
            title: 'Invitation sent successfully',
            showConfirmButton: false,
            timer: 1500
      }).then(()=>{
        this.ngOnInit();
        this.modalRef.hide()
      })

      this.selectedEntities.forEach(element => {
        this.visitorsData.forEach((sub_element,i) => {
          if(element==sub_element.userId){
            this.visitorsData.splice(i,1);
          }
        })

        if(this.visitorsData.length==0){
          this.showUI=false;
        }
      },err => {
        this.util.stopLoader();

       });

      this.ngOnInit();

      }
    })
   } else if(this.inputData == 'COMMUNITY') {
    var data: any = {}
    var q: any = ""
    var p: any = ""
    p = this.selectedEntities
   this.selectedEntities.forEach((element, i) => {
     if(i != this.selectedEntities.length - 1){
       q =  q + element + ","
     } else {
       q = q + element
     }
   });
   data.userId = q
   data.entityId = localStorage.getItem('communityId')
   data.source = 'VISITOR'
   data.sentBy = localStorage.getItem('userId')
   this.util.startLoader()
    this.auth.create("community/send/invite", data).subscribe(res=>{
      this.apicalled=false
      this.util.stopLoader();
      if(res.code == '0000'){
      Swal.fire({
        position: 'center',
            icon: 'success',
            title: 'Invitation sent successfully',
            showConfirmButton: false,
            timer: 1500
      }).then(()=>{
        this.ngOnInit()
        this.modalRef.hide()
      })
      }else {
        Swal.fire({
          position: 'center',
              icon: 'info',
              title: 'Oops!',
              text: 'Something went wrong. Please, try again later',
              showConfirmButton: false,
              timer: 1500
        })
      }
    },err => {
      this.apicalled=false
      this.util.stopLoader();
    });



    // var data: any = {}
    // data.entityId = localStorage.getItem('communityId');
    // data.communityId = localStorage.getItem('communityId');
    // data.sentBy = localStorage.getItem('userId')
    // this.util.startLoader()
    // this.auth.create('community/send/invite', data).subscribe(res => {
    //   this.util.stopLoader()
    //   if (res.code = "00000") {
    //     // this.ngOnInit()
    //     Swal.fire({
    //       position: 'center',
    //           icon: 'success',
    //           title: 'Invite sent successfully',
    //           showConfirmButton: false,
    //           timer: 1500
    //     }).then(()=>{
    //       this.ngOnInit()
    //     })
    //   }else{
    //     Swal.fire({
    //       position: 'center',
    //           icon: 'error',
    //           title: 'Oops..',
    //           text: 'Something went wrong. Please try again later.',
    //           showConfirmButton: false,
    //           timer: 3000
    //     })
    //   }
    // })





   }
  }

  inviteFollower(user){

    let data: any = {}
    data.userId = user.userId;
    if (this.inputData == "COMMUNITY") {
      data.entityId = localStorage.getItem('communityId');
      data.communityId = localStorage.getItem('communityId');
      data.sentBy = localStorage.getItem('userId')
      this.util.startLoader()
      this.auth.create('community/send/invite', data).subscribe(res => {
        this.util.stopLoader()
        if (res.code = "00000") {
          // this.ngOnInit()
          Swal.fire({
            position: 'center',
                icon: 'success',
                title: 'Invite sent successfully',
                showConfirmButton: false,
                timer: 1500
          }).then(()=>{
            this.ngOnInit()
          })
        }else{
          Swal.fire({
            position: 'center',
                icon: 'error',
                title: 'Oops..',
                text: 'Something went wrong. Please try again later.',
                showConfirmButton: false,
                timer: 3000
          })
        }
      },err => {
        this.util.stopLoader();
      });
     }else  if(this.inputData == "BUSINESS"){
      data.businessId   = localStorage.getItem('businessId');
      this.util.startLoader();
      this.auth.create('business/visitor/send/request', data).subscribe(res=>{
        this.util.stopLoader();
        if(res.code=='00000'){
          Swal.fire({
            position: 'center',
                icon: 'success',
                title: 'Invite sent successfully',
                // text: 'Follower added successfully',
                showConfirmButton: false,
                timer: 1500
          }).then(()=>{
            this.ngOnInit()
          })

        }else{
          Swal.fire({
            position: 'center',
                icon: 'error',
                title: 'Oops..',
                text: 'Something went wrong. Please try again later.',
                showConfirmButton: false,
                timer: 3000
          })
        }
        // this.ngOnInit()
      },err => {
        this.util.stopLoader();
      });
     }

  }

  hide(flag){
    this.commonDatahide.widgetName="VisitorsComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }



}
