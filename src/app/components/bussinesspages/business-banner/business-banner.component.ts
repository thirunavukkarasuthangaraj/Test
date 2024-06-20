import {
  Component,
  OnInit,
  TemplateRef,
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CommonValues } from "src/app/services/commonValues";
import { BusinessFollowerComponent } from "../business-follower/business-follower.component";
import { AppSettings } from "src/app/services/AppSettings";
import { BsModalService } from "ngx-bootstrap/modal";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { BussinessPostComponent } from "../../bussiness-post/bussiness-post.component";
import { UtilService } from "src/app/services/util.service";
import Swal from "sweetalert2";
import { SearchData } from "src/app/services/searchData";
import { BusinessbusinessComplteDataComponent } from "src/app/widget/business-profile-complete/business-profile-complete.component";

export interface Credentials {
  password: string;
  username: string;
}

@Component({
  selector: "app-business-banner",
  templateUrl: "./business-banner.component.html",
  styleUrls: ["./business-banner.component.scss"],
})
export class BusinessBannerComponent implements OnInit, OnDestroy {
  @ViewChild("myFileInput") myFileInput;

  bannerdata;
  admindata;
  industryClass: any;
  adminflag: Boolean;
  follwing: Boolean = true;
  bannerflag: Boolean = false;
  businessid;
  businessdata;
  viewasmembers: Boolean = false;
  clickEventsubscription: Subscription;
  bannerimg: any = "";
  businesslogs: any = "";
  banner;
  userData = [];
  values: any = { adminviewnavigation: false, employeeAndfollower: false };
  userId = localStorage.getItem("userId");
  fileUploadName;
  imageChangedEvent: any = "";
  croppedImage: any = "";
  modalRef: any;
  fileToUpload: File;
  photoId;
  img: { src: string };
  isAdmin: any;
  isSuperAdmin: any;
  @Output() onAdd = new EventEmitter();
  @Output() adminviewEmit = new EventEmitter<string>();
  commonDatahide: any = {}

  constructor(
    private util: UtilService,
    private follwer: BusinessFollowerComponent,
    private API: ApiService,
    private posts: BussinessPostComponent,
    private router: Router,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private commonvalues: CommonValues,
    private searchData: SearchData,
     private http: HttpClient
  ) {
    this.clickEventsubscription = this.commonvalues
      .getbusinessid()
      .subscribe((res) => {
        this.values = res;
      });
  }

  ngOnInit() {


    this.route.queryParams.subscribe((res) => {
      this.businessid = res.businessId;

      this.values.businessId = res.businessId;
      this.values.userId = res.businessId;
      if (res.menu == "about") {
        this.values.menu = "about";
      } else if (res.menu == "requestsReceived") {
        this.values.menu = "requestsReceived"
      } else if (res.menu == "follower") {
        this.values.menu = "follower"
      } else if (res.menu == "Jobs") {
        this.values.menu = "Jobs"

        this.commonvalues.businessid(this.values);
      }

    });

    this.companydetailsapicall();
  }

  ngOnDestroy(): void {
    if(this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
  }

  apicall(id) {
    this.util.startLoader();
    this.API.query('business/employee/request/pending/' + id).subscribe(res => {
      this.util.stopLoader();
      this.searchData.setRequestedEmployeeCount(res.data.pendingtList.length)
      localStorage.setItem("reqPendinCnt", res.data.pendingtList.length);

    }, err => {
      this.util.stopLoader();
    })
  }

  followers() {
    this.userData = [];
    const datas: any = {};
    datas.businessId = this.bannerdata.businessId;
    this.util.startLoader();
    this.API.create("business/followers", datas).subscribe((res) => {
      this.util.stopLoader();
      res.data.businessFollowers.forEach((element) => {
         if (element.status == "ACTIVE") {
            element.userName = element.firstName + " " + element.lastName,
            element.photo = element.photo,
            element.organisation = element.organisation,
            element.title = element.title,
            element.status = element.status,
            element.followedOn = element.followedOn
           this.userData.push(element);

           this.follwer.followerquary(this.userData);
        }

      });
    }, err => {
      this.util.stopLoader();
    });
   }

  companydetailsapicall() {
    this.viewasmembers = false;
    var data = this.businessid;
    if (this.businessid) {
      data = this.values.businessId;
    }

    this.util.startLoader();
    this.API.query("business/details/" + data).subscribe((res) => {
      this.util.stopLoader();
      this.bannerdata = res.data.businessModelList[0];

      if (this.bannerdata.companyLocationDetails[0].website == undefined) {
        this.bannerdata.companyLocationDetails[0].website == "http://"
      }
      this.apicall(data)
      if (
        this.bannerdata != null &&
        this.bannerdata.industryClassification != null &&
        this.bannerdata.industryClassification != undefined
      ) {

        this.industryClass = this.bannerdata.industryClassification;
      }

      this.values.userId = this.userId;

      if (res.data.businessModelList[0].businessBanner != 'undefined' || res.data.businessModelList[0].businessLogo != 'undefined') {
        this.businesslogs = { src: AppSettings.photoUrl + res.data.businessModelList[0].businessLogo };
        this.bannerimg = { src: AppSettings.photoUrl + res.data.businessModelList[0].businessBanner };
        localStorage.setItem("businessBannerImage", res.data.businessModelList[0].businessBanner)
      }
      this.bannerdata.employees.forEach(element => {
        if (element.userId == localStorage.getItem('userId')) {
          this.values.employeeAndfollower = true
          this.values.employeeAndfollowerview = false

        }
      });

      this.bannerdata.followers.forEach(element => {
        if (element.userId == localStorage.getItem('userId')) {
          this.values.employeeAndfollower = true
          this.values.employeeAndfollowerview = true

        }

      });


      this.checkadmin(res.data.businessModelList[0].businessId, this.userId, res.data.businessModelList[0].businessName);
    }, err => {
      this.util.stopLoader();
    });
  }

  editbussiness() {
    this.bannerflag = true;
  }

  businessupdatedata() {
    this.bannerdata.userId = localStorage.getItem("userId");
    this.bannerdata.businessOwner = localStorage.getItem("userId");
    this.viewasmembers = false;
    this.util.startLoader();

    this.API.updatePut("business/update", this.bannerdata).subscribe((res) => {

      this.util.stopLoader();
      this.values.userId = this.userId;
      // this.businesslogs = { src: AppSettings.photoUrl + res.businessLogo };
      // this.bannerimg = { src: AppSettings.photoUrl + res.businessBanner };

      this.companydetailsapicall();
      // BusinessbusinessComplteDataComponent.profileStatus()
      var obj: any = {}
      obj.boolean = true
      this.commonvalues.setProfo(obj)
    }, err => {
      this.util.stopLoader();
    });
  }

  fileChangeEvent(event, popupName): void {
    this.imageChangedEvent = event;
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;
      this.myFileInput.nativeElement.value;
    }

    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
      this.myFileInput.nativeElement.value = "";
      this.modalRef.hide();
    } else {
      this.PopupServicevlaues(popupName);
    }

  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // //// console.log("this.v-- "+this.croppedImage.name);
    // //// console.log("this.croppedImage-- "+this.croppedImage);

    const byteString = window.atob(
      event.base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
    );
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpeg" });

    this.fileToUpload = new File([blob], this.fileUploadName, {
      type: "image/jpeg",
    });
  }

  imageLoaded() {

    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    this.util.startLoader();
    this.API.create("upload/image", formData).subscribe((res) => {
      this.util.stopLoader();
      this.photoId = res.fileId;
      // this.modalRef.hide()
      this.modalclose();
      formData.delete("file");
      // this.bannerimg = {src :AppSettings.ServerUrl + 'download/' + this.photoId }
      if (res.fileId) {
        this.bannerdata.businessBanner = res.fileId;
        this.businessupdatedata();
        var commonData: any = {};
        commonData.bannerchanged = true;
        commonData.businessBanner = res.fileId;
        this.searchData.setBannerPhoto(commonData);
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
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

  modalclose() {
    this.modalRef.hide();
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    // }
    this.myFileInput.nativeElement.value = "";

  }

  closePhoto() {
    this.modalRef.hide();
    // this.fileUploadName = ''
    this.myFileInput.nativeElement.value = "";
  }

  PopupServicevlaues(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
  }

  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  sendEmployeeRequest() {
    var data: any = {}
    data.userId = localStorage.getItem('userId')
    data.businessId = this.values.businessId
    this.API.create("business/employee/request/send", data).subscribe(res => {
      if (res.code == "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Employee request sent successfully",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          this.commonvalues.businessid(this.values);
          this.ngOnInit();
        });
      } else if (res.code == '99999') {
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops...",
          text: "Sorry, something went wrong. Please try after some time.",
          showConfirmButton: false,
          timer: 5000,
        }).then((result) => {
          this.commonvalues.businessid(this.values);
          this.ngOnInit();
        });
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while sending employee request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
  }

  commonVariables: any = {}
  checkadmin(businessid, userId, businessName) {
    const datas: any = {};
    datas.businessId = this.values.businessId;
    datas.userId = localStorage.getItem("userId");
    this.util.startLoader();
    this.API.create("business/check/admin", datas).subscribe((res) => {

      this.util.stopLoader();
      this.admindata = res;
      localStorage.setItem('isAFollower', res.isFollow)
      this.searchData.setCommonVariables(this.commonVariables)
      this.values.basicDeatils = this.bannerdata;
      this.values.admin = res.isAdmin;
      this.values.isSuperAdmin = res.isSuperAdmin;
      this.isSuperAdmin = localStorage.setItem(
        "isSuperAdmin",
        res.isSuperAdmin
      );
      this.isSuperAdmin = localStorage.setItem("isAdmin", res.isAdmin);


      this.values.isEmployee = res.isEmployee;
      if (this.admindata.isSuperAdmin) {
        this.adminview(true);
        this.isAdmin = this.isSuperAdmin;
        this.values.employeeAndfollower = false

      } else if (this.admindata.isAdmin) {
        this.values.employeeAndfollower = false
        this.adminview(true);
      }
      // else if(res.isEmployee){
      //   this.values.isEmployee = true;
      //   this.values.menu = "Jobs";
      // }
      // else if(res.isFollow){
      //   this.values.menu = "Jobs";
      // }
      else {

        this.values.adminviewnavigation = false;
        this.admindata.isAdmin = false;
        this.admindata.isSuperAdmin = false;
        this.values.menu = "home";
      }

      if (this.admindata.isSuperAdmin) {
        this.values.admin = true;
       }
      this.values.viewadmin = false;
      this.values.bussinessName = businessName;

      this.route.queryParams.subscribe((res) => {
        this.businessid = res.businessId;
        this.values.businessId = res.businessId;
        this.values.userId = res.businessId;
        if (res.menu == "about") {
          this.values.menu = "about";
          this.values.admin = true;
        }
      });

      this.commonvalues.businessid(this.values);
      this.onAdd.emit(this.values);
      this.values.follow = res.isFollow;


    }, err => {
      this.util.stopLoader();
    });
  }

  adminview(val) {
    this.posts.ngOnInit();

    this.adminflag = val;
    this.viewasmembers = true;
    this.admindata.isAdmin = false;
    this.admindata.isSuperAdmin = true;
    if (this.values.menu == undefined) {
      this.values.menu = "home";
    }


    this.values.viewadmin = true;
    this.values.adminviewnavigation = true;
    localStorage.setItem('viewAsadmin', 'true');
    this.onAdd.emit(this.values);


    this.commonvalues.businessid(this.values);
    this.commonDatahide.adminview = false;
  }

  viewasmember(val) {
    this.values.viewadmin = false;
    this.values.adminviewnavigation = false;

    this.viewasmembers = false;
    this.admindata.isAdmin = true;
    this.values.admin = val;
    this.values.menu = "home";
    this.adminflag = false;
    localStorage.setItem("adminviewflag", "false");

    this.commonvalues.businessid(this.values);
    this.commonDatahide.adminview = false;
    localStorage.setItem('viewAsadmin', 'false');
    this.onAdd.emit(this.values);
  }

  updateQueryparam(updates: { [key: string]: any }) {
    this.route.queryParams.subscribe(params => {
      // Use the spread operator to merge existing params with the updates
      const updatedParams = { ...params, ...updates };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: updatedParams,
        queryParamsHandling: 'merge',
        preserveFragment: true
      });
    });
  }




  addfollower() {
    const datas: any = {};
    // datas.businessId = this.bannerdata.businessId;
    datas.businessId = localStorage.getItem('businessId')
    datas.userId = this.userId;
    this.util.startLoader();
    this.API.create("business/add/follower", datas).subscribe((res) => {
      this.util.stopLoader();
      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Follower added",
          text: "Now, you are following this business page",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          this.admindata.isFollow = true;
          localStorage.setItem('isAFollower', 'true')
          this.values.isFollow = true
          this.values.menu = "Jobs"
          this.commonvalues.businessid(this.values);
           this.updateQueryparam({ followed: 'true', isFollower: 'true' });

          //  this.ngOnInit();
        });
      }
    }, (err) => {

      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while adding follower. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }



  acceptFollowerRequest() {
    let data: any = {}
    data.businessId = this.bannerdata.businessId
    data.userId = this.userId
    this.API.create('business/follow/accept/request', data).subscribe(res => {

      if (res.code == '00000') {
        this.admindata.isFollowerInvited = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Follower Added',
          text: 'You are now following this business page.',
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          this.admindata.isFollow = true;
          this.commonvalues.businessid(this.values);
          this.ngOnInit();
        })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oops..',
          text: 'Something went wrong. Please try later.',
          showConfirmButton: false,
          timer: 3000
        })
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while accepting follower request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
  }

  rejectFollowerRequest() {
    let data: any = {}
    data.businessId = this.bannerdata.businessId
    data.userId = this.userId
    this.API.create('business/follow/reject/request', data).subscribe(res => {
      if (res.code == '00000') {
        this.admindata.isFollowerInvited = false;

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Follower Request Rejected',
          text: 'You have rejected the follower invite request.',
          showConfirmButton: false,
          timer: 4000
        }).then(() => {
          this.admindata.isFollow = false;
          this.commonvalues.businessid(this.values);
          this.ngOnInit();
        })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oops..',
          text: 'Something went wrong. Please try later.',
          showConfirmButton: false,
          timer: 3000
        })
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while rejecting follower request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
  }

  removefollower() {
    const datas: any = {};
    // datas.businessId = this.bannerdata.businessId;
    datas.businessId = localStorage.getItem('businessId')
    datas.userId = this.userId;
    this.util.startLoader();
    this.API.create("business/unfollow/follower", datas).subscribe((res) => {
      this.util.stopLoader();

      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Follower left",
          text: "You are not following this business page anymore.",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          this.admindata.isFollow = res.isFollower;
          this.values.basicDeatils = this.bannerdata;
          this.values.follow = false;
          this.values.isFollow = false;

          this.commonvalues.businessid(this.values);
          localStorage.setItem('isAFollower', 'false')
          this.updateQueryparam({ followed: 'false', isFollower: 'false' });




        });
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
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
    this.ngOnInit();
  }

  mgsBtn() {
    // alert('Message ')

    const datas: any = {};
    //datas.businessId = this.bannerdata.businessId;
    datas.refererId = this.bannerdata.businessId;
    datas.type = "BUSINESS";
    this.router.navigate(["message"], { queryParams: datas });
    /*this.API.query("message?type=BUSINESS&teamId=" + datas.businessId).subscribe(res => {
      //// console.log('Message data :' ,res)
      this.router.navigate(['message'], { queryParams: datas })
    });*/
  }
}
