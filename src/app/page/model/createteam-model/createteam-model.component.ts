import { FormValidation } from 'src/app/services/FormValidation';
import { CustomValidator } from './../../../components/Helper/custom-validator';

import { UtilService } from "./../../../services/util.service";
import { Component, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import Swal from "sweetalert2";
import { AppSettings } from "src/app/services/AppSettings";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { WorkExperience } from 'src/app/services/userModel';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: "app-createteam-model",
  templateUrl: "./createteam-model.component.html",
  styleUrls: ["./createteam-model.component.scss"],
  inputs : ["CurrentOrganizationData"]
})
export class CreateteamModelComponent extends FormValidation implements OnInit {
  teamForm: UntypedFormGroup;
  conditionList: any = [];
  CurrentOrganizationData : WorkExperience;
  businesslistData: any;
  orgFlag: Boolean = false;
  conditionSelectedItems: any;
  orgselected: any;
  tempData: any = [];
  bsModalRef: BsModalRef;
  modalRef: BsModalRef;
  pathdata: any;
  isDisabled = true;
  submit: boolean = false;
  organizationList = [];
  businessExistList = [];
  businessId: String = null;
  organizationId: String = null;
  url = AppSettings.photoUrl;
  showList: boolean = false;
  noWhitespaceValidator: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileUploadName
  public FORMERROR = super.Form;
  @ViewChild('myFileInput') myFileInput;
  fileToUpload: File;
  photoId

  config = {
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
    public fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private util: UtilService,
    private modalService: BsModalService,
    private JobServicecolor: JobService
  ) {
    super();
    this.teamForm = this.fb.group({
      teamName: [null, [Validators.required, Validators.pattern(this.TEAM_NAME.pattern), CustomValidator.teamminmaxLetters(this.TEAM_NAME.min, this.TEAM_NAME.max)]],
      addconnection: [null, [Validators.required]],
      organizationId: [null, [Validators.required]],
      description: [null, [CustomValidator.maxwords(this.TEAM_DESCRIPTION.max)]],
    });
    this.route.queryParams.subscribe((res) => {
      this.pathdata = res;
    });
    const initialState = {
      backdrop: "static",
      keyboard: false,
    };
  }
  ngOnInit() {
    // console.log("CurrentOrganization is : " , this.CurrentOrganizationData);
    this.teamForm.get('organizationId').disable();
    this.teamForm.get('organizationId').patchValue(this.CurrentOrganizationData.organisationName);
    this.teamFormSubmit();
  }

  get f() {
    return this.teamForm.controls;
  }

  getInitialstwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname,lastname);
  }

  getColortwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname,lastname);
  }

  teamFormSubmit() {
    this.util.startLoader();
    this.teamForm.patchValue({ organizationId: this.CurrentOrganizationData.organisationName })
    this.teamForm.get("organizationId").disable();
    this.organizationId = this.CurrentOrganizationData.organisationId;
    this.util.stopLoader();
    this.orgFlag = true;
      //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
      //Add '${implements OnChanges}' to the class.
    this.api
      .query("teams/member/suggestion?userId=" + localStorage.getItem("userId"))
      .subscribe((res) => {
        if (res) {

          this.util.stopLoader()
          res.data.userDatas.forEach((element) => {
            element.userName = element.firstName + " " + element.lastName;
          });
          this.conditionList = this.sort_by_key(res.data.userDatas, "userName");
          this.pathdata.teamId = null;
        }
        else {
          this.util.stopLoader()
        }
      }, err => {
        this.util.stopLoader();
      });
  }

  // connectedlist() {
  //   this.api.query("teams/member/suggestion?userId=" + localStorage.getItem('userId') + "&teamId=" + this.pathdata.teamId+"&orgId="+null).subscribe(res => {
  //     this.conditionList = res.data.consuggetions;
  //   });
  // }
  singleOrg: boolean = false;
  singleOrgId: any;
  save() {

    this.submit = true;
    this.isDisabled = false;
    this.tempData = [];

    if (this.conditionSelectedItems != undefined) {
      if (this.conditionSelectedItems != 0) {
        this.conditionSelectedItems.forEach((element) => {
          this.tempData.push({
            memberUserId: element,
          });
        });
      }
    }

    // if (this.orgselected != undefined && !this.singleOrg) {
    //   if (this.orgselected.length!= 0) {
    //     businessId = this.orgselected.organizationId;
    //   }
    // }

    // if(this.singleOrg){
    //   businessId = this.singleOrgId
    // }

    if (this.teamForm.valid) {
        let datas: any = {};
      datas.teamsOwnerId = localStorage.getItem("userId");
      datas.description = this.teamForm.value.description;
      datas.teamName = this.teamForm.value.teamName.trim();
      // datas.organizationId = this.businesslistData && this.businesslistData[0].organizationId;
      datas.organizationId = this.CurrentOrganizationData.organisationId;
      datas.logo = this.photoId;
      datas.members = this.tempData;
      this.util.startLoader();

      this.pathdata = "";
      this.api.create("teams/save", datas).subscribe((res) => {
        this.util.stopLoader();
        if (res.code == "00000") {
          this.pathdata = res.data.TEAM;
          this.modelhide();
          this.conditionSelectedItems = "";
          localStorage.setItem('teamId', res.data.TEAM.teamId),
            this.router
              .navigateByUrl("/clear", { skipLocationChange: true })
              .then(() => {
                let values: any = {};
                let x = JSON.parse(JSON.stringify(this.pathdata));
                values = x
                values.menu = "home";
                this.router.navigate(["teamPage/home"], {
                  queryParams: values,
                });
              });

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Team created successfully",
            //showConfirmButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 2000,
          }).then((result) => {
            // if(result.isConfirmed){
            //     this.modelhide();
            // } e
          });
        } else if (res.code == "99998") {
          this.util.stopLoader();
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Oops...",
            text: "Team name exists already. Please try with a different one.",
            // showConfirmButton: true,
            showConfirmButton: false,
            timer: 4000,
          })
        }
      }, err => {
        this.util.stopLoader();
        if (err.status == 500) {

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Something went wrong while saving team. Please, try again later.',
            showDenyButton: false,
            confirmButtonText: `ok`,
          })
        }
      });
    }
    // else {
    //   if (
    //     this.teamForm.value.teamName == undefined &&
    //     this.teamForm.value.teamName == null
    //   ) {
    //     Swal.fire({
    //       position: "center",
    //       icon: "error",
    //       title: "Team name required",
    //       text: "Please enter team name",
    //       // showConfirmButton: true,
    //       showConfirmButton: false,
    //       timer: 3000,
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //       }
    //     });
    //   } else if (
    //     this.teamForm.value.businessId == undefined &&
    //     this.teamForm.value.businessId == null
    //   ) {
    //     Swal.fire({
    //       position: "center",
    //       icon: "error",
    //       title: "Current organization required",
    //       text: "Please select one current organization",
    //       // showConfirmButton: true,
    //       showConfirmButton: false,
    //       timer: 3000,
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //       }
    //     });
    //   }
    // }
  }
  routeToTeam(teamId) { }
  teamlist: any = [];
  queryteams() {
    this.util.startLoader();
    this.api
      .query(
        "teams/home?userId=" +
        localStorage.getItem("userId") +
        "&limit=6&offset=0"
      )
      .subscribe((res) => {
        this.teamlist = res.data.teams;
      }, err => {
        this.util.stopLoader();
      });
    this.util.stopLoader();
  }

  //  teamOwnerId: String;
  teamId: any;
  // teamName: String;
  // description: String;
  // status: String;
  // viewCnt: String;
  // postCnt: String;
  // memberCnt: String;
  // name: String;
  // teamsOwnerId: String;
  // members: MemberData[];

  getCurrentOrganizationList() {
    // this.api
    //   .query("business/check/" + localStorage.getItem("userId"))
    //   .subscribe((res) => {
    //     if (res.data != null && res) {
    //       this.businesslistData = res.data.businessExist;
    //       this.businesslistData.showList = true;

    //     }
    //     this.teamFormSubmit();

    //   }, err => {
    //     this.util.stopLoader();
    //   });
    this.api.query('business/check/orgname/' + localStorage.getItem("userId")).subscribe(res => {
      this.util.stopLoader();
      if (res.code == '00000' || '10008') {
        if (res.data != null && res.data.organisation != null && res.data.organisation.length != 0) {
          this.businesslistData = res.data.organisation;

        }
        this.teamFormSubmit();
      }

    });

  }



  //  this method is not used now as we now can create team without business
  ngOnChanges(): void {
    this.util.startLoader();
    this.conditionSelectedItems = null;

    if (this.orgselected != null) {
      this.orgFlag = true;

      //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
      //Add '${implements OnChanges}' to the class.

      let queryText: string = "teams/member/suggestion?userId=" + localStorage.getItem("userId");

      if (this.pathdata.teamId != null && this.pathdata.teamId != undefined) {
        queryText = queryText + "&teamId=" + this.pathdata.teamId;
      }
      this.api
        .query(
          "teams/member/suggestion?userId=" + localStorage.getItem("userId")
        )
        .subscribe((res) => {
          this.util.stopLoader();
          res.data.consuggetions.forEach((element) => {
            element.userName = element.firstName + " " + element.lastName;
          });
          this.conditionList = this.sort_by_key(res.data.consuggetions, "userName");
        });
    } else {
      this.util.stopLoader();
      this.orgFlag = false;
      this.conditionList = null;
      this.conditionSelectedItems = null;
    }
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

  fileChangeEvent(event, popupName): void {
    const checkSize = super.checkImageSize(event.target.files[0])
    // this.formData.append('file',this.fileToUpload, this.fileUploadName);
    // this.formData.delete('file');
    this.photoId = null;
    this.imageChangedEvent = event;

    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;
      // this.myFileInput.nativeElement.value//assigning the file through viewchild
    }

    const acceptedImageTypes = this.IMAGE_TYPE;
    if (!acceptedImageTypes.includes(event.target.files[0].type)) {

      Swal.fire('', `${this.FORMERROR.IMAGE_TYPE_VALID}`, 'info');

      this.myFileInput.nativeElement.value = '';
      // this.modalRef.hide();
    }
    else if (checkSize > 10) {
      Swal.fire(`${this.IMAGE_ERROR}`);
      this.myFileInput.nativeElement.value = '';
    }
    else {
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
    this.modalRef.hide();
    // this.fileUploadName = ''
    // console.log("b4 close the file ", this.myFileInput);

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




}
