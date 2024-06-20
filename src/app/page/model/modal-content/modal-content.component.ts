import { FormValidation } from 'src/app/services/FormValidation';
import { UtilService } from './../../../services/util.service';
import Swal from 'sweetalert2';
import { ApiService } from './../../../services/api.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, HostListener, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NetworkComponent } from '../../homepage/network/network.component';
import { ActivatedRoute, Router } from '@angular/router';

import { LocationStrategy, PlatformLocation } from '@angular/common';
import { AppSettings } from 'src/app/services/AppSettings';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CustomValidator } from './../../../components/Helper/custom-validator';
import { JobService } from 'src/app/services/job.service';
@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss']
})
export class ModalContentComponent extends FormValidation implements OnInit {

  networkForm: UntypedFormGroup;
  conditionList: any = [];
  conditionSelectedItems: any;
  tempData: any = [];
  bsModalRef: BsModalRef;
  modalRef: BsModalRef;
  pathdata:any={};
  isDisabled=false;
  submit: boolean = false;
  url=AppSettings.photoUrl;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileUploadName
  @ViewChild('myFileInput') myFileInput;
  fileToUpload: File;
  photoId
  config  = {
      height: 150,
      focus: true,
      placeholder: "Description",
      toolbar: [],
      link: [["link", ["linkDialogShow", "unlink"]]],
      insert: ["link", "picture", "video"],
      view: ["fullscreen", "codeview", "help"],
      style: "outline: none !important",
      disableDragAndDrop: true,
      blockquoteBreakingLevel: 1,

    };

  constructor(
    private net: NetworkComponent,
    public fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private util:UtilService,
    private JobServicecolor: JobService,
    private modalService: BsModalService,
   // location: PlatformLocation,
    private location: LocationStrategy
  ) {
    super();

    const initialState = {
      backdrop: 'static',
      keyboard: false
    };

    this.location.onPopState((w)=>{
      history.forward();
    })

  }


  ngOnInit() {
    this.isDisabled=false;
    this.route.queryParams.subscribe((res) => {
      this.pathdata = res;
      if(res!=undefined){
        if(res.networkId==undefined &&  this.pathdata!=null  &&  this.pathdata!=undefined){
          this.pathdata.networkId=null;
        }
      }

    });
    this.networksubmit();
    this.connectedlist();
  }
  networksubmit(){
    this.networkForm = this.fb.group({
      networkName : [null, [Validators.required, Validators.pattern(this.TEAM_NAME.pattern), CustomValidator.teamminmaxLetters(this.TEAM_NAME.min, this.TEAM_NAME.max)]],
     addconnection: [null, [Validators.required]],
     description: [null, [CustomValidator.maxwords(this.TEAM_DESCRIPTION.max)]]
    })
  }
    get f() {
    return this.networkForm.controls
  }
      // for first and last name
      getInitialName(firstname: string,lastname: string): string {
        return this.JobServicecolor.getInitialsparam(firstname,lastname);
      }
       // for first and last name
       getColorName(firstname: string,lastname: string): string {
        return this.JobServicecolor.getColorparam(firstname,lastname);
      }

  connectedlist() {
     this.util.startLoader();
     let queryText:string="network/member/suggestion?userId=" + localStorage.getItem("userId") ;

     if(this.pathdata. networkId   !=null && this.pathdata. networkId !=undefined){
       queryText=queryText+ "&networkId=" + this.pathdata.networkId;
     }
     this.api.query(queryText).subscribe(res => {
     this.util.stopLoader();
      res.data.userDatas.forEach(element => {
        element.userName= element.firstName +" "+element.lastName;
      });
      this.conditionList = this.sort_by_key( res.data.userDatas, "userName" );

    },err => {
      this.util.stopLoader();
    });
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  modelhide() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
        this.modalService.hide(i);
      }
      // this.PopupServicevlaues(null)
      // this.modalRef.hide()
  }

  save() {

    this.isDisabled=false;
    this.submit=true;
    this.tempData = [];
    if (this.conditionSelectedItems != undefined && this.conditionSelectedItems != null) {
      if (this.conditionSelectedItems !== 0) {
        this.conditionSelectedItems.forEach(element => {

          this.tempData.push({
            memberUserId: element
          })
        });
      }
    }
      if (this.networkForm.valid ) {
        let datas: any = {};
        datas.networkOwnerId = localStorage.getItem('userId');
        datas.description = this.networkForm.value.description;
        datas.networkName = this.networkForm.value.networkName;
        datas.logo =  this.photoId;

        datas.members = this.tempData;

        this.util.startLoader()
          this.api.create("network/save", datas).subscribe(res => {
            this.util.stopLoader()

            if (res.code == "99998") {

              Swal.fire({
                position: "center",
                icon: "error",
                title: "Network name exists already",
                text: "Network name exists already. Please try with a different name.",

                showConfirmButton: false,
                timer: 3000,
              })
            } else  if (res.code == "00000") {
            this.modelhide();
            this.conditionSelectedItems = "";
            this.router.navigateByUrl('/clear', { skipLocationChange: true }).then(() => {
              this.router.navigate(['landingPage/network'] );
            });

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Network created successfully',
              // showConfirmButton: true,
              allowOutsideClick: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000
              })
            }
          },err => {
            this.util.stopLoader();
            if(err.status==500){
             Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Something went wrong while saving network. Please, try again later.',
              showDenyButton: false,
              confirmButtonText: `ok`,
            })
          }
        })

      }else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Network name required",
          text: 'Please enter a network name.',
          // showConfirmButton: true,
          showConfirmButton: false,
          timer: 3000,
        }).then((result) => {
          if (result.isConfirmed) {

          }
        })
      }

  }


  fileChangeEvent(event, popupName): void {
    // this.formData.append('file',this.fileToUpload, this.fileUploadName);
    // this.formData.delete('file');
    this.photoId=null;
    this.imageChangedEvent = event;
    ////// console.log(event)
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;
      this.myFileInput.nativeElement.value//assigning the file through viewchild
    }
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
      this.myFileInput.nativeElement.value = '';
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
      this.modalRef.hide();
      formData.delete('file');
      if (res.fileId) {
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
   }


}
