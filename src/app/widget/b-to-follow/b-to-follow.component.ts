import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppSettings } from 'src/app/services/AppSettings';



@Component({
  selector: 'app-b-to-follow',
  templateUrl: './b-to-follow.component.html',
  styleUrls: ['./b-to-follow.component.scss']
})
export class BToFollowComponent implements OnInit {


    @Input('title') title: string = 'Business to Follow ';
    viewType: string = "MIN";
    headerTitle: "Business To Follow";
    user: any = [];
    commonDatahide:any={}
    // @Output()  commonFunction = new EventEmitter<string>();
    // @Input() maxMin: any = {};
    // @Input() inputData: string;
    modalRef: BsModalRef;
    bussinesssuggestion:any;
    bussinesssuggestionList:any;
    page:number=1;
    // @Input() widgetDesc: string;
    pathdata:any;
    limit:number=4;
    totalCount: any;
    selectedEntities: any = []
    checkedList: any = [];
    followers:any=[];
    searchName: any;
    imgUrl:any = AppSettings.photoUrl



    backdropConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: false,
    };
   beingTyped: boolean;
   theChecker: boolean;

    constructor(private auth: ApiService,private a_route: ActivatedRoute, private router: Router, private util: UtilService,private modalService: BsModalService) {
     }

    route(data) {
      this.router.navigate(['business'], { queryParams: data, replaceUrl: true });
      this.closeModal();
    }


    ngOnInit() {

      // this.headerTitle=this.widgetDesc;
      // if (this.maxMin.viewType != undefined) {
      //   this.viewType = "MAX";
      //   this.inputData = this.maxMin.master;
      //   this.limit=8;
      //  }

      //  this.a_route.queryParams.subscribe((res) => {
      //    if(res.menu!=null &&res.menu!=undefined){
      //     this.headerTitle=res.menu;
      //    }
      // // })

      this.getSuggestions();
  }




    getSuggestions(){
      let data:any={};
      data.userId = localStorage.getItem('userId'),
      data.limit =String( this.limit),
      data.page=this.page-1;
      this.util.startLoader();
      this.auth.create('widget/business/suggestion', data).subscribe((res) =>{
          this.util.stopLoader();
           if( res.data.bussinesssuggestion!=null&& res.data.bussinesssuggestion.length!==0){
              this.bussinesssuggestion = res.data.bussinesssuggestion;
              this.bussinesssuggestion.forEach(bus=>{

                if(this.checkedList.includes(bus.businessId)){
                  bus.checked=true;
                }
                else{
                  bus.checked=false;
                }

              });

              this.bussinesssuggestionList=res.data.bussinesssuggestion;


              if( res.data.totalCount!=null){
                this.totalCount=res.data.totalCount;
              }
          }
          //  else{
          //   this.hide(true);
          // }

        },err => {
          this.util.stopLoader();

          // this.hide(true);


        });

    }


   follow(businessId){
    this.util.startLoader();
    let userId=localStorage.getItem('userId')
        let data:any={};
        data.businessId=businessId;
        data.userId=userId;

    this.auth.create('business/add/follower', data).subscribe((res) =>{
      this.util.stopLoader();
      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Adding follower",
          text: "You are following this business page now.",
          showConfirmButton: false,
          timer: 2000,
        })
        this.ngOnInit();
        this.closeModal();
      }

    },err => {
      this.util.stopLoader();
    });
   }


    openModal(postTemplate: TemplateRef<any>) {
      this.modalRef = this.modalService.show(postTemplate, this.backdropConfig);
      this.limit=8;
      this.getSuggestions();
      this.viewType="MAX";
    }

    closeModal(){
      this.modalRef.hide();
      setTimeout(() => {
        this.page = 1;
        this.searchName = ''
        this.theChecker = false
        this.selectedEntities = []
        this.checkedList = []
      }, 1000);
      this.limit=4;

      this.getSuggestions();
      this.viewType="MIN"
    }

   onCheckboxChange(data, event) {

      if (event.target.checked) {
        if(!this.selectedEntities.includes(data.businessId)){
            this.selectedEntities.push(String(data.businessId))
            this.checkedList.push(String(data.businessId))
        }
      }

      else {
        for (var i = 0; i < this.selectedEntities.length; i++) {
          if (this.selectedEntities[i]== data.businessId) {
              this.checkedList.splice(i, 1);
              this.selectedEntities.splice(i,1);
          }
        }
        this.theChecker = false
      }
   }

  checkAll(event){
    if(event.target.checked == true){

      this.theChecker=true;
      this.bussinesssuggestion.forEach(ele=>{
        if(!this.selectedEntities.includes(ele.businessId)){
          ele.checked = true
          this.selectedEntities.push(String(ele.businessId))
          this.checkedList.push(String(ele.userId))
        }
      })
    }
    else if(event.target.checked == false){
      this.selectedEntities = []
      this.checkedList = []
      this.bussinesssuggestion.forEach(ele=>{
        ele.checked = false
      })
      this.theChecker=false;

    }
  }

  onSearch(event: any) {
    if(event.target.value!=''){
      this.beingTyped = true
    }else if(event.target.value == ''){
      this.beingTyped = false
    }
  }

  followAll(){
    this.util.startLoader();
    let userId=localStorage.getItem('userId')
    this.selectedEntities.forEach(bus=>{
        let data:any={};
        data.businessId=bus;
        data.userId=userId;
        this.followers.push(data);
    });


    this.auth.create('business/add/followers', this.followers).subscribe((res) =>{
      this.util.stopLoader();
      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "You are a follower",
          text: "You are following this business page now.",
          showConfirmButton: false,
          timer: 2000,
        })
        this.ngOnInit();
        this.closeModal();
      }

    },err => {
      this.util.stopLoader();
    });
   }



  movePage(event) {
    // console.log("page-->"+event);
    this.page =event;
    this.getSuggestions();
  }

}
