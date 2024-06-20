import { MemberData } from "./../../../types/NetworkUser";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, TemplateRef, Input, ViewChild, HostListener } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import Swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subscription } from "rxjs";
import { SearchData } from "src/app/services/searchData";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { UtilService } from "src/app/services/util.service";
import { AppSettings } from "src/app/services/AppSettings";

@Component({
  selector: "app-net-headerpage",
  templateUrl: "./net-headerpage.component.html",
  styleUrls: ["./net-headerpage.component.scss"],
})
export class NetHeaderpageComponent implements OnInit {
  pathdata;
  membersForm: UntypedFormGroup;
  conditionList: any = [];
  conditionSelectedItems: any;
  modalRef: BsModalRef;
  tempData: any = [];
  membersData: any = [];
  @Input()
  userDataInput: string;
  ownerFlag = false;
  memberflag = false;
  pathnetworkid: any;
  clickEventsubscription: Subscription;
  response;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileUploadName
  @ViewChild('myFileInput') myFileInput;
  fileToUpload: File;
  photoId
  url = AppSettings.photoUrl;
  stopMenuScroll: boolean;
  constructor(
    private route: ActivatedRoute,
    private Router: Router,
    private fb: UntypedFormBuilder,
    private util: UtilService,
    private commonValues: SearchData,
    private modalService: BsModalService,
    private api: ApiService
  ) {
    this.clickEventsubscription = commonValues.getNetdata().subscribe(res => {
      this.response = res;
    })
  }

  ngOnInit() {

    this.route.queryParams.subscribe((res) => {
      // this.menus=this.userDataInput;
      this.pathdata = res;
      this.pathnetworkid = res.networkId;
      //this.pathdata = res.networkName.replace(/ /g, "_").toUpperCase()

      // if (this.pathdata == "BENCH_SALES_NETWORK")
      //   this.pathdata = "BENCH_RECRUITER"
      // else if (this.pathdata == "FREELANCE_RECRUITER_NETWORK")
      //   this.pathdata = "FREELANCE_RECRUITER"
      // else if (this.pathdata == "MANAGEMENT_TALENT_ACQUISITION_NETWORK")
      //   this.pathdata = "MANAGEMENT_TALENT_ACQUISITION"
      // else if (this.pathdata == "RECRUITER_NETWORK")
      //   this.pathdata = "RECRUITER"
      if (localStorage.getItem("userId") === this.pathdata.networkOwnerId && this.pathdata.isDefaultNetwork=='false') {
        this.ownerFlag = true;
        this.memberflag = false;
      } else {
        this.memberflag = true;
        this.ownerFlag = false;
      }
    });
    this.formNetworkModal();
  }
  // networkMenuStick: boolean = false
  // @HostListener('window:scroll')
  // handleScroll(){
  //   const windowScroll = window.pageYOffset;
  //   if(windowScroll >= 330){
  //     this.networkMenuStick = true;
  //   } else {
  //     this.networkMenuStick = false;
  //   }
  // }

  modelhide() {
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    // }
    this.modalRef.hide()
  }

  @HostListener('window:scroll')
  handleScroll() {
    const YoffSet = window.pageYOffset
    if (YoffSet >= 25) {
      this.stopMenuScroll = true
    } else {
      this.stopMenuScroll = false
    }
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
    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
      this.myFileInput.nativeElement.value = "";
      this.modalRef.hide();
    } else {
      this.PopupServicevlaues(popupName);
    }
  }

  PopupServicevlaues(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static'
    });
  }

  closePhoto() {
    this.modalRef.hide()
    // this.fileUploadName = ''
    this.myFileInput.nativeElement.value = '';
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
    this.util.startLoader()
    this.api.create('upload/image', formData).subscribe(res => {
      this.util.stopLoader()
      this.photoId = res.fileId;
      this.updateimg();
      this.modalclose();

      formData.delete('file');
      if (res.fileId) {
      }
    }, err => {
      this.util.stopLoader();

    });

  }

  modalclose() {
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    // }
    this.modalRef.hide()
    this.myFileInput.nativeElement.value = ''
  }

  updateimg() {
    let data: any = {};
    data.networkId = this.pathdata.networkId;
    data.networkName = this.response.networkName;
    data.description = this.response.description;
    data.bannerImage = this.photoId;
    this.util.startLoader();
    this.api.updatePut('network/update', data).subscribe(res => {
      this.util.stopLoader();
      this.response.bannerImage = this.photoId;
      this.commonValues.setNetdata(this.response);

    }, err => {
      this.util.stopLoader();
    });
  }

  addmember(template: TemplateRef<any>) {
    this.conditionSelectedItems = null;
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
  }
  formNetworkModal() {
    this.membersForm = this.fb.group({
      addconnection: this.pathdata.networkName,
      Description: this.pathdata.description,
    });
  }

  deletenet(value) {
    if (value == "delete") {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure you want to deactivate?",
          text: "You will still be able to retrieve the network after deactivation, if you change your mind.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.api
              .delete("network/delete/" + this.pathdata.networkId)
              .subscribe((res) => {

                if (res.code === "00000") {
                  this.Router.navigate(["landingPage/network"]);

                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Network deacivated successfully",
                    // showConfirmButton: true,
                    showConfirmButton: false,
                    timer: 2000,
                  }).then((result) => {
                    // this.Router.navigate(['landingPage/network'])
                  });
                }
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Swal.fire({
            //   position: "center",
            //   icon: "success",
            //   title: "Network is safe",
            //   // showConfirmButton: true,
            //   showConfirmButton: false,
            //   timer: 1500,
            // });
          }
        });
    } else if (value == "leave") {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "Do you want to leave this network?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.api
              .delete(
                "network/delete/member?status=LEFT&userId=" +
                localStorage.getItem("userId") +
                "&networkId=" +
                this.pathdata.networkId
              )
              .subscribe((res) => {
                if (res.code == "00000") {
                  this.Router.navigate(["landingPage/network"]);
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Left successfully ",
                    // showConfirmButton: true,
                    showConfirmButton: false,
                    timer: 2000,
                  }).then((result) => { });
                }
              }, err => {
                this.util.stopLoader();
              });
          }
        });
    }
    if (value == "message") {
    }
  }

  submit() {
    let data: any = {};
    (data.memberUserId = this.conditionSelectedItems.userId),
      (data.networkId = this.pathdata.networkId);

    this.api.create("network/member/save", data).subscribe((res) => {
      if (res != undefined && res != null) {
        if (res.code == "00000") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Member created successfully",
            showConfirmButton: false,
            showCancelButton: false,
            timer: 2000,
          })
          // .then((result) => {
          //   if (result.isConfirmed) {
          //   }
          // });
          this.modelhide();
        } else if (res.code == "99999") {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Member creation failed",
            showConfirmButton: true,
            showCancelButton: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.modelhide();
            }
          });
        }
      }
    }, err => {
      this.util.stopLoader();

    });

  }
  commonVariables: any = {};
  mgsBtn() {
    const datas: any = {};
    datas.networkId = this.pathnetworkid;
    datas.recipientId = this.pathnetworkid;
    datas.refererId = this.pathnetworkid;

    datas.type = "NETWORK";
    this.api
      .query("message?type=NETWORK&groupId=" + datas.groupId)
      .subscribe((res) => {
        // //// console.log('Message data :', res)
        this.Router.navigate(["message"], { queryParams: datas });
      }, err => {
        this.util.stopLoader();
      });
  }


  menuclick(name) {
    let values: any = {};
    let x = JSON.parse(JSON.stringify(this.pathdata));
    values = x
    values.menu = name;
    this.Router.navigate(["networkPage/" + name], { queryParams: values });
    if (name == "members") {
      // this.membermenuflag = false;

    }
    const usId = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.query("network/invite/sent/" + this.pathdata.networkId).subscribe((res) => {
      this.util.stopLoader();
      this.commonVariables.pendingCount = res.data.SentRequests.length;
      this.commonValues.setCommonVariables(this.commonVariables);
      // localStorage.setItem("pendingCount", res.data.Teams.length);
    }, err => {
      this.util.stopLoader();
    });

  }
}
