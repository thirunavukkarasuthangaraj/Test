import { Component, OnInit, TemplateRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonValues } from 'src/app/services/commonValues';
import { AppSettings } from 'src/app/services/AppSettings';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
 import { BussinessPostComponent } from '../../bussiness-post/bussiness-post.component';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-community-banner',
  templateUrl: './community-banner.component.html',
  styleUrls: ['./community-banner.component.scss']
})
export class CommunityBannerComponent implements OnInit {
  @ViewChild('myFileInput') myFileInput;
  @Output()  updateFunction = new EventEmitter();
  communitydata;
  adminData
  adminflag: Boolean;
  follwing: Boolean = true;
  bannerflag: Boolean = false;
  communityId
  businessdata
  viewasmembers: Boolean = false
  clickEventsubscription: Subscription;
  bannerimg: any = "";
  businesslogs: any = "";
  banner
  userData = []
  values: any = { adminviewnavigation: false }
  userId = localStorage.getItem('userId')
  fileUploadName
  imageChangedEvent: any = '';
  croppedImage: any = '';
  modalRef: any;
  fileToUpload: File;
  photoId
  img: { src: string; };
  isAdmin: any
  isSuperAdmin: any
  @Output() onAddcommunity = new EventEmitter();
  formData: FormData;
  communityTypes
  communityName
  communitytag
  CisAdmin = false
  CisSuperAdmin = false
  cisJoined = false
  joinStatus: any
  Status: boolean = true
  isJoined: any
  eventEmitter2: Subscription;
  menu
  getcount
  constructor(
    private API: ApiService,
    private posts: BussinessPostComponent,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private commonvalues: CommonValues,
    private util: UtilService,
    private httpw: HttpClient,
    private router: Router,
  ) {
    this.clickEventsubscription = this.commonvalues.getcommunitydata().subscribe((res) => {
      this.values = res;

    })

    this.eventEmitter2 = this.commonvalues.getCommuityBoolean().subscribe(res=>{
      if(res.boolean == true){
        // this.ngOnInit()
        this.companydetailsapicall()
      }
  })


  }

  ngOnDestroy() {
    //this.router.routeReuseStrategy.shouldReuseRoute = () => true;
  }

  ngAfterViewInit( ): void {
    setInterval(() => {
      if(localStorage.getItem('communitycount')!=undefined && localStorage.getItem('communitycount')!=null){
         this.getcount= localStorage.getItem('communitycount');
      }

    }, 500);

  }


  ngOnInit() {
    // window.scrollTo(0, 0);
    if (this.isSuperAdmin) {
      this.isAdmin = this.isSuperAdmin
    }

    this.route.queryParams.subscribe((res) => {
      this.communityId = res.communityId;
      if(res.menu=="memberspage"){
        this.values.menu = "memberspage"
      }else if(res.menu=="request"){
        this.values.menu = "request"
      }else  if(res.menu=="communityabout"){
        this.values.menu = "communityabout"
      }
      this.values.communityId = res.communityId;
      this.values.userId = res.communityId;

      if(res){
        this.companydetailsapicall()
      }
    });
    ////// console.log("community banner ngOnInit");
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }


  addJoin() {
    let datas: any = {};
    datas.communityId = this.communityId
    datas.userId = localStorage.getItem('userId');
    this.util.startLoader()
    this.API.create("community/join", datas).subscribe(res => {
      this.util.stopLoader()
      if (res.code == "00000") {
        let alertTitle = 'Join request sent successfully';
        if (this.communityTypes == true) {
          alertTitle = 'Join request sent successfully';
        }
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: alertTitle,
          showConfirmButton: false,
          timer: 3000
        }).then((result) => {
          this.cisJoined = true;
          this.companyHome(this.communityId, this.communityTypes);
        })


      }
    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while processing your request. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  });
  }

  removeJoin() {
    let datas: any = {};
    datas.communityId = this.communityId
    datas.userId = localStorage.getItem('userId');
    this.util.startLoader()
    this.API.create("community/join/remove", datas).subscribe(res => {
      this.util.stopLoader()
      if (res.code == "00000") {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You have left the community',
          showConfirmButton: false,
          timer: 2000
        }).then((result) => {
          this.cisJoined = false;
          this.values.adminviewnavigation = false
          this.companyHome(this.communityId, this.communityTypes);
        });
      }
    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while processing your request. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  });
  }


  cancelrequest() {
    let datas: any = {};
    datas.communityId = this.communityId
    datas.userId = localStorage.getItem('userId');
    this.util.startLoader()
    this.API.create("community/join/cancel", datas).subscribe(res => {
      this.util.stopLoader()
      if (res.code == "00000") {
        this.cisJoined = false;
        this.companyHome(this.communityId, this.communityTypes);

      }

    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while processing your request. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  });
  }



  acceptInvite() {
    let datas: any = {};
    datas.entityId = this.communityId
    datas.userId = localStorage.getItem('userId');
    this.util.startLoader()
    this.API.create("community/accept/invite", datas).subscribe(res => {
      this.util.stopLoader()
      if (res.code == "00000") {
        this.cisJoined = false;
        this.companyHome(this.communityId, this.communityTypes);
      }
    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while accepting invitation. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  });
  }





  cancelinvite() {
    let datas: any = {};
    datas.entityId = this.communityId
    datas.userId = localStorage.getItem('userId');
    this.util.startLoader()
    this.API.create("community/reject/invite", datas).subscribe(res => {
      this.util.stopLoader()
      if (res.code == "00000") {
        this.cisJoined = false;
        this.companyHome(this.communityId, this.communityTypes);
      }
    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while processing your request. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  });
  }





  companydetailsapicall() {
    this.viewasmembers = false

    var data = this.communityId
    if (this.communityId) {
      data = this.values.communityId;
    }
    this.util.startLoader();
    this.API.query('community/details/' + data).subscribe(res => {
      this.util.stopLoader();
      this.communitydata = res.data.communityDetails;

      localStorage.setItem("communitycount",res.data.communityDetails.members.length);
      this.getcount= res.data.communityDetails.members.length;

      this.communityTypes = res.data.communityDetails.communityType;
      this.communityName = res.data.communityDetails.communityName;
      this.communitytag = res.data.communityDetails.tagLine;
      this.values.userId = this.userId
      this.businesslogs = { src: AppSettings.photoUrl + res.data.communityDetails.logo }
      this.bannerimg = { src: AppSettings.photoUrl + res.data.communityDetails.banner }
      this.companyHome(res.data.communityDetails.communityId, res.data.communityDetails.communityType)

      this.sendDataFunction();

    }, err => {
      this.util.stopLoader();

    });

  }

  sendingData : any;
  sendDataFunction(val ?: any) {
    this.sendingData = {
      communityName : this.communityName,
      communityTypes : this.communityTypes,
      communitytag : this.communitytag,
      adminview : this.adminview,
      viewasmembers : this.viewasmembers,
      viewasmember : this.viewasmember,
      getcount : this.getcount,
      addJoin : this.addJoin,
      members: this.members,
      cisJoined : this.cisJoined,
      CisAdmin : this.CisAdmin,
      CisSuperAdmin : this.CisSuperAdmin,
      Status : this.Status,
      cancelrequest : this.cancelrequest,
      acceptInvite : this.acceptInvite,
    }
    this.updateFunction.emit({
      ...this.sendingData,
      ...val
    });

  }

  companyHome(id, communityType) {
    //////// console.log("companyHome - " + id + " - " + communityType);
    let data: any = {}
    data.communityId = id;
    data.userId = localStorage.getItem('userId')
    this.util.startLoader()
    this.API.create('community/home', data).subscribe(res => {
      this.util.stopLoader()
      this.adminData = res.data.communityhome;
      if (res.data.isSuperAdmin) {
        this.adminData.isAdmin = true
      }
      this.adminData.isSuperAdmin = res.data.isSuperAdmin
      this.CisAdmin = res.data.isAdmin
      this.CisSuperAdmin = res.data.isSuperAdmin
      this.cisJoined = res.data.isJoined

      this.joinStatus = res.data.joinStatus;

      if (this.CisAdmin == true) {
        this.adminview(true)
      } else if (this.CisSuperAdmin == true) {
        this.adminview(true)
      } else if (this.cisJoined) {
        this.values.membersflage = false
        this.values.adminviewnavigation = true
        this.values.menu = "communityhome";
      } else if (!this.cisJoined) {
        this.values.menu = "communityhome";
      }

      this.values.communityId = this.communityId;
      this.values.communityType = communityType;
      this.values.communityName = res.data.communityName;
      this.values.isAdmin = res.data.isAdmin;
      this.values.isSuperAdmin = res.data.isSuperAdmin;

      localStorage.setItem('isJoined', res.data.isJoined);
      localStorage.setItem('communityAdmin', res.data.isAdmin);
      localStorage.setItem('communitySuperadmin', res.data.isSuperAdmin);
      this.commonvalues.communitydata(this.values);
      this.onAddcommunity.emit(this.values)
      this.callThis()
      //////// console.log("companyHome emitting values to onAddCommunity");


    }, err => {
      this.util.stopLoader();

    });


  }

  callThis(){
    this.isJoined = localStorage.getItem('isJoined')
    this.isAdmin = localStorage.getItem('communityAdmin');
    this.isSuperAdmin = localStorage.getItem('communitySuperadmin');
    this.sendDataFunction({
      isJoined : this.isJoined,
      isSuperAdmin : this.isSuperAdmin,
      isAdmin : this.isAdmin,
      joinStatus : this.joinStatus
    })
  }


  businessupdatedata() {
    this.viewasmembers = false
    this.communitydata.userId = localStorage.getItem('userId')
    this.communitydata.communityId = this.communityId
    this.util.startLoader()
    this.API.updatePut("community/update", this.communitydata).subscribe(res => {
      this.util.stopLoader()
      this.values.userId = this.userId

      this.businesslogs = { src: AppSettings.photoUrl + res.logo }
      this.bannerimg = { src: AppSettings.photoUrl + res.banner }
        if(res){
          this.companydetailsapicall()
          var obj: any = {}
          obj.boolean = true
          this.commonvalues.setCommuityBoolean(obj)
        }
      },err => {
        this.util.stopLoader();
      });

  }


  fileChangeEvent(event, popupName): void {
    // this.formData.append('file',this.fileToUpload, this.fileUploadName);
    // this.formData.delete('file');
    this.imageChangedEvent = event;
    ////// console.log(event)
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;
      this.myFileInput.nativeElement.value//assigning the file through viewchild
    }

    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!acceptedImageTypes.includes( event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
      this.myFileInput.nativeElement.value = "";

       this.modalRef.hide();
    }else{
    this.PopupServicevlaues(popupName);
    }
   }


  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    const byteString = window.atob(event.base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });

    this.fileToUpload = new File([blob], this.fileUploadName, { type: 'image/jpeg' });


  }


  imageLoaded() {

    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileUploadName);

    // this.formData.append('file', this.fileToUpload, this.fileUploadName);

    this.util.startLoader()
    this.API.create('upload/image', formData).subscribe(res => {
      this.util.stopLoader()
      this.photoId = res.fileId;
      this.modalclose();

      formData.delete('file');
      if (res.fileId) {
        this.communitydata.banner = res.fileId
        this.businessupdatedata()
      }

    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while uploading image. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  });

    this.bannerflag = false;



  }

  members() {
    this.values.menu = 'memberspage'
    this.commonvalues.communitydata(this.values);

  }

  modalclose() {
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    // }
    this.modalRef.hide()
    this.myFileInput.nativeElement.value = ''
  }
  closePhoto() {
    this.modalRef.hide()
    // this.fileUploadName = ''
    this.myFileInput.nativeElement.value = '';
  }

  PopupServicevlaues(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static'
    });
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  adminview(val) {
    this.posts.ngOnInit()

    this.adminflag = val;
    this.viewasmembers = true;
    this.adminData.isAdmin = false;
    this.CisAdmin = false;
    this.adminData.isSuperAdmin = true;
    this.CisSuperAdmin = true;
    this.values.viewadmin = true;
    this.values.membersflage = true;
    this.values.adminviewnavigation = true
    this.values.members = this.communitydata.members.length
    localStorage.setItem('adminviewflag', 'true')
    if (this.values.menu == undefined) {
      this.values.menu = 'communityhome'
    }

    this.onAddcommunity.emit(this.values);
    localStorage.setItem('viewAsadmin','true');


    //  this.communitybanner.ngOnInit()
    // var screen =  localStorage.getItem('screen')

    //  this.navidationData.forEach((element,i) => {
    //   if( element.page==screen){
    //        this.navidationData[i].admin='true'
    //    }
    //  });

    // this.navidationData.forEach(element => {
    //    if(element.page==screen){
    //      if(element.admin){
    //         this.navigationMenu.push(element)
    //       }
    //     }
    //  });

    //  this.values.navigationMenu=this.navigationMenu;
    this.commonvalues.communitydata(this.values);
    this.onAddcommunity.emit(this.values)

  }

  viewasmember(val) {
    ////// console.log(this.values)
    this.values.viewadmin = false;
    var isJoineddata = localStorage.getItem('isJoined');
    this.values.adminviewnavigation = false
    //  if(isJoineddata=='true'){

    //  }else{
    //   this.values.adminviewnavigation=false
    //  }
    this.values.membersflage = false;
    this.viewasmembers = false;
    this.adminData.isAdmin = true;
    this.CisAdmin = true;
    this.values.admin = val;
    this.values.menu = "communityhome";
    this.adminflag = false
    //    this.communitybanner.ngOnInit()
    // this.navigationMenu=[]
    // var screen =  localStorage.getItem('screen')
    // this.navidationData.forEach((element,i) => {
    //   if( element.page==screen){
    //        if(this.navidationData[i].name=='communitypageadmin'){
    //         this.navidationData[i].admin='false'
    //        }else if(this.navidationData[i].name=='members'){
    //         this.navidationData[i].admin='false'
    //        }
    //        else if(this.navidationData[i].name=='managePage'){
    //         this.navidationData[i].admin='false'
    //        }


    //    }
    //  });

    // this.navidationData.forEach(element => {
    //    if(element.page==screen){
    //      if(element.admin){
    //         this.navigationMenu.push(element)
    //       }
    //     }
    //  });

    //   this.values.navigationMenu=this.navigationMenu;
    //   this.values.selectedItem=this.navidationData[0];
    this.onAddcommunity.emit(this.values)
    this.commonvalues.communitydata(this.values);
    localStorage.setItem('viewAsadmin','false');




  }


  mgsBtn() {
    // alert('Message ')

    const datas: any = {};
    datas.refererId = this.communityId
    //datas.communityid = this.communityId
    datas.type = "COMMUNITY";
    this.router.navigate(['message'], { queryParams: datas })
    /*this.API.query("message?type=COMMUNITY&refererId=" + datas.communityid).subscribe(res => {
      ////// console.log('Message data :' ,res)
      this.router.navigate(['message'], { queryParams: datas })
    });*/
  }


}
