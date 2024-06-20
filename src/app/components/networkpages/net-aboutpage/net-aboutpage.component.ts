import { Subscription } from 'rxjs';
import { UtilService } from './../../../services/util.service';
import { values } from 'lodash';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { SearchData } from 'src/app/services/searchData';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormValidation } from 'src/app/services/FormValidation';
import { CustomValidator } from './../../../components/Helper/custom-validator';
declare var $: any

@Component({
  selector: 'app-net-aboutpage',
  templateUrl: './net-aboutpage.component.html',
  styleUrls: ['./net-aboutpage.component.scss']
})
export class NetAboutpageComponent extends FormValidation implements OnInit {

  modalRef: BsModalRef ;
  modalRefImg: BsModalRef ;
  clickEventsubscription: Subscription;
  pathdata:any;
  networkModalForm:UntypedFormGroup;
  isDisabled=false;
  ownerFlag: boolean = false;
  pesponseDisplay
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileUploadName
  loadAPIcall:boolean=false;
  @ViewChild('myFileInput') myFileInput;
  @ViewChild('myFileInputbanner') myFileInputbanner;
  fileToUpload: File;
  bannerFileToUpload: File;
  photoIdBanner=null;
  photoId=null;
  config = {
    placeholder: 'Description',
    tabsize: 2,
    height: '100px',
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: {
      onKeydown(e) {
        const limiteCaracteres = 1000;
        const caracteres = e.currentTarget.innerText;
        const totalCaracteres = caracteres.length;
        if (totalCaracteres >= limiteCaracteres) {
          if (e.keyCode !== 8 && e.keyCode !== 37
            && e.keyCode !== 38 && e.keyCode !== 39
            && e.keyCode !== 40 && e.keyCode !== 65) { e.preventDefault(); }
        }
      },
      onKeyup(e) {
        const t = e.currentTarget.innerText;
     //   //// console.log(t.length);
      },
      onPaste(e) {
        const buffertext = ((e.originalEvent || e).clipboardData).getData('text');
        e.preventDefault();
        const all = buffertext.trim();
        document.execCommand('insertText', false, all.substring(0, 1000));
        //$('#maxcontentpost').text(400 - t.length);
      }
    }
  }
  constructor(private modalService: BsModalService,  private commonValues: SearchData,
         private util:UtilService, private route: ActivatedRoute,private api: ApiService,
         private fb:UntypedFormBuilder,private router: Router) {
          super();
         this.clickEventsubscription = commonValues.getNetdata().subscribe(res => {
         this.pesponseDisplay = res
      })
   }

  ngOnInit() {

    this.isDisabled=false;
    this.netWorkData();
    this.formNetworkModal();
   this. refresh();
    this.Modaldata();
    if (localStorage.getItem('userId') == this.pathdata.networkOwnerId && this.pathdata.isDefaultNetwork=='false') {
      this.ownerFlag = true;
   } else {
      this.ownerFlag = false;
   }
  }

  editBasic(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static',
     });
     this.networkModalForm.patchValue(this.pesponseDisplay);

  }


  submit(){
    if( this.networkModalForm.valid ){
      this.isDisabled=true;
      let data:any ={};
      data.networkId=this.pathdata.networkId;
      data.networkName=this.networkModalForm.value.networkName;
      data.description=this.networkModalForm.value.description;

      if (this.photoId == null) {
        data.logo = this.pesponseDisplay.logo;
      } else {
        data.logo = this.photoId;
      }

      if (this.photoIdBanner == null) {
        data.bannerImage = this.pesponseDisplay.bannerImage;
      } else {
        data.bannerImage = this.photoIdBanner;
      }
      this.util.startLoader();
      this.api.updatePut('network/update', data).subscribe(res=>{
       this.util.stopLoader();

       if(res.code=="00000"){
        this.commonValues.setNetdata(res.data.network);
        this.modelhide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Updated successfully ',
          //showConfirmButton: true,
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1500
        }).then((result) => {

          // this.refresh()
        })
       }else if(res.code=="99998"){
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Network name exists",
          text: "There is a similar network name exists already. Please choose a different network name.",
          showConfirmButton: false,
          timer: 5000,
          });

       }
      },err => {
        this.util.stopLoader();
      });
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Oops..',
        text: "Please enter network name",
        //showConfirmButton: true,
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 3000
      })
    }


  }

  netWorkData(){
    this.route.queryParams.subscribe((res) => {
      this.pathdata = res;

    });
  }

  formNetworkModal(){
    this.networkModalForm = this.fb.group({

      networkName : [null, [Validators.required, Validators.pattern(this.TEAM_NAME.pattern), CustomValidator.teamminmaxLetters(this.TEAM_NAME.min, this.TEAM_NAME.max)]],
      description: [null, [CustomValidator.maxwords(this.TEAM_DESCRIPTION.max)]]
     })

  }

  Modaldata(){

  }

  close(){
    this.networkModalForm.reset();
    this.modelhide();
    this.networkModalForm.patchValue(this.pesponseDisplay);
  }

  modelhide() {

    this.modalRef.hide()
  }




  refresh() {
this.loadAPIcall=true
    this.api.query("network/get/" +this.pathdata.networkId).subscribe((res) => {
      this.loadAPIcall=false
      this.util.stopLoader();
      if (res != undefined && res != null) {
         this.commonValues.setNetdata(res.data.Network)
         this.pesponseDisplay=res.data.Network;
      }
    },err => {
      this.util.stopLoader();
    });
  }

  get f() {
    return this.networkModalForm.controls
  }

  fileChangeEventlogo(event, popupName): void {

     this.photoId=null;
    this.imageChangedEvent = event;

    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;

    }
     const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');

      this.myFileInput.nativeElement.value=''

    } else {
      this.PopupServicevlaues(popupName);
    }
  }

  fileChangeEventBanner(event, popupName): void {

     this.photoIdBanner=null;
     this.imageChangedEvent = event;

    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;

    }

    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');

      this.myFileInputbanner.nativeElement.value=''
    } else {
      this.PopupServicevlaues(popupName);
    }
  }

  PopupServicevlaues(template: TemplateRef<any>) {
    this.modalRefImg = this.modalService.show(template, {
      animated: true,
      backdrop: 'static'
    });
  }

  closePhoto() {
    this.modalRefImg.hide()
    $("#myFileInput")[0].value = '';
    $("#myFileInputbanner")[0].value = '';

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
      this.modalRefImg.hide();
      formData.delete('file');
      if (res.fileId) {
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
  }


   imageCroppedBanner(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    const byteString = window.atob(event.base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    this.bannerFileToUpload = new File([blob], this.fileUploadName, { type: 'image/jpeg' });
  }

  imageLoadedBanner() {
   const formData: FormData = new FormData();
    formData.append('file', this.bannerFileToUpload, this.fileUploadName);
    this.util.startLoader()
    this.api.create('upload/image', formData).subscribe(res => {
      this.util.stopLoader()
      this.photoIdBanner = res.fileId;
      this.modalRefImg.hide();
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
