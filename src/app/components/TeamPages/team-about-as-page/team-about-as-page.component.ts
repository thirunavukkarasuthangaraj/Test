import { CustomValidator } from './../../Helper/custom-validator';
import { FormValidation } from 'src/app/services/FormValidation';
import { SearchData } from 'src/app/services/searchData';
 import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import Swal from "sweetalert2";
import { Subscription } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UtilService } from 'src/app/services/util.service';
declare var $ :any

@Component({
  selector: "app-team-about-as-page",
  templateUrl: "./team-about-as-page.component.html",
  styleUrls: ["./team-about-as-page.component.scss"],
})
export class TeamAboutAsPageComponent extends FormValidation implements OnInit {
  modalRef: BsModalRef;
  modalRefImg: BsModalRef ;
  pathdata: any;
  pesponseDisplay: any;
  teamModalForm: UntypedFormGroup;
  ownerFlag = false;
  clickEventsubscription: Subscription;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileUploadName
  @ViewChild('myFileInput') myFileInput;
  @ViewChild('myFileInputbanner') myFileInputbanner;
  fileToUpload: File;
  bannerFileToUpload: File;
  photoIdBanner=null;
  photoId=null;
  loadAPIcall:boolean=false
  public FORMERROR = super.Form;


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

      },
      onPaste(e) {
        const buffertext = ((e.originalEvent || e).clipboardData).getData('text');
        e.preventDefault();
        const all = buffertext.trim();
        document.execCommand('insertText', false, all.substring(0, 1000));

      }
    }
  }

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private util:UtilService,
    private commonValues: SearchData,
    private route: ActivatedRoute,
    private api: ApiService,
    private fb: UntypedFormBuilder ) {
    super();
    this.clickEventsubscription = commonValues.getTeamdata().subscribe(res => {
      this.pesponseDisplay = res
    })
  }
  ngOnInit() {

    this.teamdata();
    this.refresh();
    if (localStorage.getItem("userId") === this.pathdata.teamsOwnerId) {
      this.ownerFlag = true;
    } else {
      this.ownerFlag = false;
    }
    this.teamModalForm = this.fb.group({
      teamName: [null, [Validators.required ,Validators.pattern(this.TEAM_NAME.pattern),CustomValidator.teamminmaxLetters(this.TEAM_NAME.min,this.TEAM_NAME.max)]],
      description: [null, [CustomValidator.maxwords(this.TEAM_DESCRIPTION.max)]]

   });
  }

  get f() {
    return this.teamModalForm.controls;
  }

  close() {
    this.modelhide();
    this.teamModalForm.reset();
    this.teamModalForm.patchValue(this.pesponseDisplay);
  }

  editBasic(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
    this.teamModalForm.patchValue(this.pesponseDisplay);

  }

  modelhide() {

    this.modalRef.hide()
  }

  teamdata() {
    this.route.queryParams.subscribe((res) => {
      this.pathdata = res;
    });
  }

  Submit:boolean = false;
  submit() {
    this.Submit =true;

    if (this.teamModalForm.valid) {
      let data: any = {};
      data.teamId = this.pathdata.teamId;
      data.teamName = this.teamModalForm.value.teamName;
      data.description = this.teamModalForm.value.description;
      data.logo = this.photoId;
      data.bannerImage = this.photoIdBanner;

      if (this.photoId == null) {
        data.logo = this.pathdata.logo
      } else {
        data.logo = this.photoId;
      }

      if (this.photoIdBanner == null) {
        data.bannerImage = this.pathdata.bannerImage
      } else {
        data.bannerImage = this.photoIdBanner;
      }

      this.api.updatePut("teams/update", data).subscribe((res) => {

         if(res.code=="00000"){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Updated successfully",

          showConfirmButton: false,
          timer: 2000,
          allowOutsideClick: false,
        }).then((result) => {
          this.modelhide();
          this.refresh();
        });
      }
      else if(res.code=="99998"){
         Swal.fire({
          position: "center",
          icon: "error",
          title: "Team name exists",
          text: "Team name exists already. Please try with a different one.",
          showConfirmButton: false,
          timer: 5000,
          });
        }
      },err => {
        this.util.stopLoader();
      });
    }

  }

  refresh() {
    this.loadAPIcall=true;
    this.api.query("teams/get/" +this.pathdata.teamId).subscribe((res) => {
      this.loadAPIcall=false;
      if (res != undefined && res != null) {
         this.commonValues.setTeamdata(res.data.teams)
         this.pesponseDisplay=res.data.teams;

      }
    },err => {
      this.util.stopLoader();
    });

  }

  fileChangeEventlogo(event, popupName): void {


    const checkSize = super.checkImageSize(event.target.files[0])
     this.photoId=null;
    this.imageChangedEvent = event;

    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;

    }
    const acceptedImageTypes = this.IMAGE_TYPE;
    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      this.util.stopLoader()
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
      this.myFileInput.nativeElement.value='';

    }
    else if(checkSize>10){
      this.util.stopLoader()
      Swal.fire(`${this.IMAGE_ERROR}`);
      this.myFileInput.nativeElement.value = '';

    } else {
      this.util.stopLoader()
      this.PopupServicevlaues(popupName);
    }  }

  fileChangeEventBanner(event, popupName): void {
    const checkSize = super.checkImageSize(event.target.files[0])


     this.photoIdBanner=null;
     this.imageChangedEvent = event;

    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;

    }
    const acceptedImageTypes =this.IMAGE_TYPE;
    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
      this.myFileInputbanner.nativeElement.value='';

    } else if(checkSize>10){
      Swal.fire(`${this.IMAGE_ERROR}`);
      this.myFileInput.nativeElement.value = '';
    }
      else {
      this.PopupServicevlaues(popupName);
    }
  }

  PopupServicevlaues(template: TemplateRef<any>) {
    this.modalRefImg = this.modalService.show(template, {
      animated: true,
      backdrop: 'static'
    });
  }

  closePhoto(val) {

    this.modalRefImg.hide()

    if(val==='logo') $("#logoUpload").val("");
    else if(val === 'banner') $("#bannerUpload").val("");
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
