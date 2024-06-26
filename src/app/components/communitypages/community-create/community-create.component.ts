import { Component, OnInit, TemplateRef, ElementRef, ViewChild, HostListener } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { validateHorizontalPosition } from "@angular/cdk/overlay";
import { CropperOption } from "ngx-cropper";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { AppSettings } from "src/app/services/AppSettings";
import { ApiService } from "src/app/services/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { CommonValues } from "src/app/services/commonValues";
import { UtilService } from "src/app/services/util.service";
import Swal from "sweetalert2";
import { ProfilePhoto } from "src/app/services/profilePhoto";
import { CustomValidator } from "../../Helper/custom-validator";
import { Subscription } from "rxjs";

declare var $: any;

@Component({
  selector: "app-community-create",
  templateUrl: "./community-create.component.html",
  styleUrls: ["./community-create.component.scss"],
})
export class CommunityCreateComponent implements OnInit {
  tagSelectedItems = [];
  communityForm: UntypedFormGroup;
  dara: any = {}
  submit: boolean = false;
  eventEmitter: Subscription;
  placeholder: any = "Add more";
  secondaryPlaceholder: any = "Option to add 3 #Tags";
  imageChangedEvent: any = "";
  croppedImage: any = "";
  fileUploadName: any = "";
  photoWindow = true;
  public cropperConfig: CropperOption;
  fileToUpload: File;
  photoId: any;
  aboutCommunity: any;
  communityGuidelines: any;
  img: any;
  charCountEmitter: Subscription;
  remainingAboutCount: any;
  remainingGuidelinesCount: any;
  modalRef: BsModalRef;
  config = {
    placeholder: "Brief about your Community",
    tabsize: 2,
    height: "100px",
    //uploadImagePath: '/api/upload',
    toolbar: [
      ["misc", ["codeview", "undo", "redo"]],
      // ['style', ['bold', 'italic', 'underline', 'clear']],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear",
        ],
      ],
      ["fontsize", ["fontname", "fontsize", "color"]],
      ["para", ["style", "ul", "ol", "paragraph", "height"]],
    ],
    fontNames: [
      "Helvetica",
      "Arial",
      "Arial Black",
      "Comic Sans MS",
      "Courier New",
      "Roboto",
      "Times",
    ],
    callbacks: {
      onKeydown(e) {
        const limiteCaracteres = 1000;
        const caracteres = e.currentTarget.innerText;
        const totalCaracteres = caracteres.length;
        if (totalCaracteres >= limiteCaracteres) {
          if (
            e.keyCode !== 8 &&
            e.keyCode !== 37 &&
            e.keyCode !== 38 &&
            e.keyCode !== 39 &&
            e.keyCode !== 40 &&
            e.keyCode !== 65
          ) {
            e.preventDefault();
          }
        }
      },
      onKeyup(e) {
        const t = e.currentTarget.innerText;
        // //// console.log(t.length);
      },
      onPaste(e) {
        const buffertext = (e.originalEvent || e).clipboardData.getData("text");
        e.preventDefault();
        const all = buffertext.trim();
        document.execCommand("insertText", false, all.substring(0, 1000));
        //$('#maxcontentpost').text(400 - t.length);
      },
    },
  };
  @ViewChild("myFileInput") myFileInput;
  config1 = {
    placeholder: "  Community Guidelines",
    tabsize: 2,
    height: "100px",
    //uploadImagePath: '/api/upload',
    toolbar: [
      ["misc", ["codeview", "undo", "redo"]],
      // ['style', ['bold', 'italic', 'underline', 'clear']],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear",
        ],
      ],
      ["fontsize", ["fontname", "fontsize", "color"]],
      ["para", ["style", "ul", "ol", "paragraph", "height"]],
    ],
    fontNames: [
      "Helvetica",
      "Arial",
      "Arial Black",
      "Comic Sans MS",
      "Courier New",
      "Roboto",
      "Times",
    ],
    callbacks: {
      onKeydown(e) {
        const limiteCaracteres = 4000;
        const caracteres = e.currentTarget.innerText;
        const totalCaracteres = caracteres.length;
        if (totalCaracteres >= limiteCaracteres) {
          if (
            e.keyCode !== 8 &&
            e.keyCode !== 37 &&
            e.keyCode !== 38 &&
            e.keyCode !== 39 &&
            e.keyCode !== 40 &&
            e.keyCode !== 65
          ) {
            e.preventDefault();
          }
        }
      },
      onKeyup(e) {
        const t = e.currentTarget.innerText;
        // //// console.log(t.length);
      },
      onPaste(e) {
        const buffertext = (e.originalEvent || e).clipboardData.getData("text");
        e.preventDefault();
        const all = buffertext.trim();
        document.execCommand("insertText", false, all.substring(0, 4000));
        //$('#maxcontentpost').text(400 - t.length);
      },
    },
  };

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: BsModalService,
    private api: ApiService,
    private router: Router,
    private cookieService: CookieService,
    private commonValues: CommonValues,
    private el: ElementRef,
    private aroute: ActivatedRoute,
    private util: UtilService,
    private profilePhoto: ProfilePhoto,
    private commonvalues: CommonValues,

  ) {
    this.eventEmitter = this.commonvalues.getCommuityData().subscribe(res=>{
        this.dara = res;
        if(this.photoId!=null){
          this.dara.logoExist = true
          this.dara.logo = AppSettings.ServerUrl + "download/" + this.photoId;
      }else{
          this.dara.logo = "assets/icon/comm.png"
          this.dara.logoExist = false
      }
      // this.commonvalues.setCommuityData(this.dara)
      // this.commonvalues.setCommuityData(this.dara)
    })

    this.charCountEmitter = this.commonvalues.getCharCount().subscribe(res=>{
      this.remainingAboutCount = res.aboutCountValue
      this.remainingGuidelinesCount = res.guidelinesCountValue
  })
  }

  ngOnInit() {
    this.bnrPhoto();
    this.validate();
    this.tagSelectedItems = [];
    localStorage.setItem('communityLogo', null)
  }

  bnrPhoto() {
    var us: any = localStorage.getItem("userId");
    this.api.query("user/" + us).subscribe((res) => {
      if (res.photo != null && res.photo != undefined && res.photo != "") {
        this.profilePhoto.setBannerPhoto(res.photo);
      } else if (
        res.photo == null ||
        res.photo == undefined ||
        res.photo == ""
      ) {
        this.profilePhoto.setBannerPhoto(null);
      }
    },err => {
      this.util.stopLoader();
    });
  }

  validate() {
    this.communityForm = this.fb.group({
      // communityName : [null, [Validators.required,Validators.maxLength(100),Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
      communityName: [null, [Validators.required, Validators.maxLength(100)]],

      //communityName: [null, [Validators.required, Validators.maxLength(100)]],
      tagLine: [null, [Validators.maxLength(140)]],
      communityType: [false],
      banner: [null],
      tags: [null],
      aboutCommunity: ['', Validators.compose([Validators.maxLength(1000)])],
      communityGuidelines: ['', Validators.compose([Validators.maxLength(4000)])],
    },
    {
      validators: CustomValidator.checkCommunityCompletion('communityName','tagLine', 'communityType','banner','tags','aboutCommunity','communityGuidelines',
       this.commonValues)
      // validator: CustomValidator.checkCommunityCharCount('aboutCommunity','communityGuidelines', this.commonValues)
    }
    );
  }

  save() {
    this.submit = true;
    if (
      this.communityForm.value.aboutCommunity != undefined &&
      this.communityForm.value.aboutCommunity != null &&
      this.communityForm.value.aboutCommunity != ""
    ) {
      let aboutCommunity;
      let type1: any;
      let type2: any;
      let type3: any;
      let content1: any;
      let content2: any;
      aboutCommunity = this.communityForm.value.aboutCommunity;
    }

    if (
      this.communityForm.value.communityGuidelines != undefined &&
      this.communityForm.value.communityGuidelines != null &&
      this.communityForm.value.communityGuidelines != ""
    ) {
      let communityGuidelines;

      communityGuidelines = this.communityForm.value.communityGuidelines;
    }
    if (this.communityForm.valid) {
      let data: any = {};
      data.communityName = this.communityForm.value.communityName;
      data.userId = localStorage.getItem("userId");
      data.tagLine = this.communityForm.value.tagLine;
      data.communityType = this.communityForm.value.communityType;
      data.banner = this.photoId;
      localStorage.setItem('communityLogo', this.photoId)
      data.tags = this.communityForm.value.tags;
      if (
        this.communityForm.value.communityGuidelines != undefined &&
        this.communityForm.value.communityGuidelines != null &&
        this.communityForm.value.communityGuidelines != ""
      ) {
        // var value1 = this.communityForm.value.communityGuidelines.replace(/\//g, '')
        var value1 = this.communityForm.value.communityGuidelines;
        var value2 = value1.replace(/<p>/g, "");
        // data.communityGuidelines = value2
        data.communityGuidelines = value1;
      }

      if (
        this.communityForm.value.aboutCommunity != undefined &&
        this.communityForm.value.aboutCommunity != null &&
        this.communityForm.value.aboutCommunity != ""
      ) {
        // var value3 = this.communityForm.value.aboutCommunity.replace(/\//g, '')
        var value3 = this.communityForm.value.aboutCommunity;
        var value4 = value3.replace(/<p>/g, "");
        // data.aboutCommunity = value4
        data.aboutCommunity = value3;
      }

      this.aroute.queryParams.subscribe((res) => {
        if (res["entityType"] != undefined) {
          data["entityType"] = res["entityType"];
          data["entityId"] = res["entityId"];
        } else {
          data["entityType"] = "USER";
        }
      });
      //// //// console.log("this is data")
      //// //// console.log(data)
      this.util.startLoader();
      this.api.create("community/create", data).subscribe((res) => {
        this.util.stopLoader();

        if (res) {
          if (res.data.Community.code === "00000") {
            //////// console.log('Create Community Res.remainingAboutCount.Community :', res.data.Community)
            res.data.Community.superAdmin = true
            this.router.navigate(["community"], { queryParams: res.data.Community });
            localStorage.setItem("communityId", res.data.communityId);
            localStorage.setItem("isSuperAdmin", "true");
            this.cookieService.set("communityId", res.data.communityId);
            this.commonValues.businessid(res.data.communityId);
          } else {
            Swal.fire(res.data.Community.message);
          }
        }
        //// //// console.log("This is community response")
        //// //// console.log(res)

        //  if(res.code=="00000"){
        //// //// console.log("community created sucessfully")
        //}
      },err => {
        this.util.stopLoader();
        if(err.status==500){
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while saving community. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
    } else {
      this.scrollToFirstInvalidControl();
    }
  }
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement =
      this.el.nativeElement.querySelector("form .ng-invalid");

    // firstInvalidControl.focus(); //without smooth behavior
    window.scroll({
      //smooth behaviur

      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: "smooth",
    });
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  clearformData() {
    this.communityForm.reset();
  }
  onHidden(): void {
    // //// console.log('Dropdown is hidden');
  }
  onShown(): void {
    // //// console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    // //// console.log('Dropdown state is changed');
  }

  get communityControl() {
    return this.communityForm.controls;
  }

  fileChangeEvent(event, popupName): void {
    this.imageChangedEvent = event;
    if (event.target.files && event.target.files[0]) {
      $("#profileimage").val;
      this.fileUploadName = event.target.files[0].name;
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (!acceptedImageTypes.includes(event.target.files[0].type)) {
        Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
        this.myFileInput.nativeElement.value = "";
        this.modalRef.hide();
      } else {
        this.PopupServicevlaues(popupName);
      }
    } else {
      $("#profileimage").val("");
    }
  }

  PopupServicevlaues(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //// //// console.log("this.v-- "+this.croppedImage.name);
    //// //// console.log("this.croppedImage-- "+this.croppedImage);
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

  modalclose() {
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    // }
    this.modalRef.hide()
    $("#profileimage").val("");
  }

  count = 0
  imageLoaded() {
    // $("#profileimage").val("")
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    this.util.startLoader();
    this.api.create("upload/image", formData).subscribe((res) => {
      this.util.stopLoader();
      this.photoId = res.fileId;
      localStorage.setItem('communityLogo', this.photoId)
      this.img = {
        src: AppSettings.ServerUrl + "download/" + this.photoId,
      };


      this.count = this.count + 1
      if(this.count === 1) {
        this.dara.completePercentage = this.dara.completePercentage + 15
      }
      this.dara.logoExist = true
      this.dara.logo = AppSettings.ServerUrl + "download/" + this.photoId
      this.commonvalues.setCommuityData(this.dara)

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
    this.modalRef.hide();
  }

  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  stopThere: boolean = false
  @HostListener('window:scroll')
  handleScroll(){
    const YoffSet = window.pageYOffset
    if(YoffSet>=25){
      this.stopThere = true
    }else{
      this.stopThere = false
    }
  }
}
