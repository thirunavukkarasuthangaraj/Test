import { TeamComponent } from "./../../../page/homepage/team/team.component";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import Swal from "sweetalert2";
import { Subscription } from "rxjs";
import { SearchData } from "src/app/services/searchData";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { UtilService } from "src/app/services/util.service";
import { AppSettings } from "src/app/services/AppSettings";

@Component({
  selector: "app-team-header-bar",
  templateUrl: "./team-header-bar.component.html",
  styleUrls: ["./team-header-bar.component.scss"],
})
export class TeamHeaderBarComponent implements OnInit {
  pathdata;
  membersForm: UntypedFormGroup;
  conditionList: any = [];
  conditionSelectedItems: any;
  modalRef: BsModalRef;
  tempData: any = [];
  membersData: any = [];
  ownerFlag = false;
  memberflag = false;
  response
  clickEventsubscription: Subscription;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileUploadName
  @ViewChild('myFileInput') myFileInput;
  fileToUpload: File;
  photoId
  url=AppSettings.photoUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private net: TeamComponent,
    private fb: UntypedFormBuilder,
    private commonValues: SearchData,
    private util: UtilService,
    private modalService: BsModalService,
    private api: ApiService,
    private searchData: SearchData
  ) {
    this.clickEventsubscription = commonValues.getTeamdata().subscribe(res => {
      this.response = res;
    })
  }

  ngOnInit() {
    window.scrollTo(0,0);
    this.route.queryParams.subscribe((res) => {
      this.pathdata = res;
      if (localStorage.getItem("userId") == this.pathdata.teamsOwnerId) {
        this.ownerFlag = true;
        this.memberflag = false;
      } else {
        this.memberflag = true;
        this.ownerFlag = false;
      }
    });
  }

  modelhide() {
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    // }
    this.modalRef.hide()
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
      this.modalclose();
      this.updateimg()
      formData.delete('file');
      if (res.fileId) {
       }
      },err => {
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
    data.teamId = this.pathdata.teamId;
    data.teamName = this.response.teamName;
    data.description = this.response.description;
    data.bannerImage = this.photoId;
    this.util.startLoader();
    this.api.updatePut('teams/update', data).subscribe(res => {
    this.util.stopLoader();
    this.response.bannerImage= this.photoId;
    this.commonValues.setTeamdata(this.response);

  },err => {
    this.util.stopLoader();
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
          text: "You will still be able to retrieve the team after deactivation, if you change your mind.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.api
              .delete("teams/deactivate/" + this.pathdata.teamId)
              .subscribe((res) => {
                if (res.code === "00000") {
                  this.router.navigate(["landingPage/team"]);

                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Team deactivated successfully.",
                    // showConfirmButton: true,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  this.net.ngOnInit();
                }
              },err => {
                this.util.stopLoader();
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {

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
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {

              this.api.delete(
                "teams/delete/member?userId=" +
                  localStorage.getItem("userId") +"&type=LEFT"+
                  "&teamId=" +
                  this.pathdata.teamId
              )
              .subscribe((res) => {
                if (res.code == "00000") {
                  this.router.navigate(["landingPage/team"]);
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Left successfully ",
                    // showConfirmButton: true,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  this.net.ngOnInit();
                }
              },err => {
                this.util.stopLoader();
              });
            } else if (result.dismiss === Swal.DismissReason.cancel) {

            }
          });


    }
  }

  mgsBtn() {
    const datas: any = {};
    // datas.groupId = this.pathdata.teamId;
    datas.refererId = this.pathdata.teamId;
    datas.teamId = this.pathdata.teamId;

    datas.type = "TEAM";
    this.api
      .query("message?type=TEAM&groupId" + datas.groupId)
      .subscribe((res) => {
        // //// console.log('Message data :', res)
        this.router.navigate(["message"], { queryParams: datas });
      },err => {
        this.util.stopLoader();
      });
  }

  commonVariables: any = {}
  menuclick(name) {
     let values:any={};
     let x = JSON.parse(JSON.stringify(this.pathdata));
     values=x
     values.menu=name;
    this.router.navigate(["teamPage/" + name], { queryParams:values });
     if (name == "members") {
      // this.membermenuflag = false;

    }
    // const usId = localStorage.getItem("userId");
    // this.api.query("network/invite/sent/" + this.pathdata.networkId).subscribe((res) => {
    //   this.commonVariables.pendingCount = res.data.SentRequests.length;
    //   this.searchData.setCommonVariables(this.commonVariables);
    //   // localStorage.setItem("pendingCount", res.data.Teams.length);
    // });

  }
}
