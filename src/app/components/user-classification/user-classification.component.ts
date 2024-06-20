import { SocketService } from 'src/app/services/socket.service';
import { Validators } from '@angular/forms';
import { UntypedFormBuilder } from '@angular/forms';
import { UntypedFormGroup } from '@angular/forms';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute,NavigationStart } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';
import { CacheService } from 'src/app/services/cache.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { AppSettings } from 'src/app/services/AppSettings';
import { CommonValues } from 'src/app/services/commonValues';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { LocationStrategy } from '@angular/common';
import { SocketServiceStream } from 'src/app/services/SocketServiceStream';
import { FormValidation } from 'src/app/services/FormValidation';
import { JobService } from 'src/app/services/job.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-user-classification',
  templateUrl: './user-classification.component.html',
  styleUrls: ['./user-classification.component.scss']
})
export class UserClassificationComponent extends FormValidation implements OnInit {
  active;
  photoId: any;
  img;
  userId: any;
  userClassificationForm: UntypedFormGroup

  constructor(private cookieService: CookieService,
    private api: ApiService,
    private commonValues: CommonValues,
    private modalService: BsModalService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private util: UtilService,
    private route: ActivatedRoute,
    private cache: CacheService,
    private location: LocationStrategy,
    private _socket: SocketService,​
    private _socket_stream: SocketServiceStream,
    private jobService: JobService
  ) {
    super()
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
   });

   this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
    // Check if the navigation is triggered by the back button
    if (event.navigationTrigger === 'popstate') {
      console.log("back clicked")
      // Perform your action here, like showing a dialog or staying on the same page
      // For example, to stay on the same page, you might do nothing or navigate to the current route
    }
  });


}


    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
      history.pushState(null, null, window.location.href); // Push on popstate event
    }

  ngOnInit() {




    this.route.queryParams.subscribe((prevData) => {
      this.userId = prevData.userId;
      localStorage.setItem("userId", this.userId);
      this.cookieService.set("userId", this.userId);
      this.cache.setValue("userId", this.userId);
      this.getData()
    });

    this.userClassificationForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.pattern(this.FIRST_Name.pattern)]],
      lastName: [null, [Validators.required, Validators.pattern(this.LAST_NAME.pattern)]],
      email: null,
      purpose: null,
      photo: null,
      userType: null,
      clientType: null
    })

  }

  get e() {
    return this.userClassificationForm.controls
  }

  prompt() {
    // this.userClassificationForm.get('firstName').markAsTouched()
    // this.userClassificationForm.get('firstName').updateValueAndValidity()
    // this.userClassificationForm.get('lastName').markAsTouched()
    // this.userClassificationForm.get('lastName').updateValueAndValidity()
    Swal.fire({
      icon: "info",
      title: "None Selected",
      text: 'Select any options on how you will use GigSumo',
      showConfirmButton: false,
      timer: 4000,
    })
  }

  prompt1() {
    Swal.fire({
      icon: "info",
      title: "None Selected",
      text: 'Select your business classification.',
      showConfirmButton: false,
      timer: 4000,
    })
  }

  getInitialstwo(firstname: string,lastname: string): string {
    return this.jobService.getInitialsparam(firstname,lastname);
  }

  getColortwo(firstname: string,lastname: string): string {
    return this.jobService.getColorparam(firstname,lastname);
  }

  source: any = null;
  profileId: any = null;
  firstName: any;
  lastName: any;
  getData() {
    this.util.startLoader();
    this.api.query("user/" + this.userId).subscribe((res) => {
      if (res.code == '00000') {
        this.util.stopLoader();
        this.userClassificationForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          userId: this.userId,
          purpose: null,
          clientType: null,
        });
        this.firstName = res.firstName
        this.lastName = res.lastName

        if (res.source != null) {
          this.source = res.source;
        }
        if (res.profileId != null) {
          this.profileId = res.profileId;
          // this.getBusinessProfileDetail(this.profileId);
        }
        localStorage.setItem("userName", res.email);
        this.cache.setValue("email", res.email);
      }
    })
  }

  prompt2() {
    Swal.fire({
      icon: "info",
      title: "None Selected",
      text: 'Select your user type.',
      showConfirmButton: false,
      timer: 4000,
    })
  }

  qwe(value) {
   }

  uploadPhotoHere() {
    this.myFileInput.nativeElement.click()
  }
  fileUploadName: any = "";

  modalRef: BsModalRef;
  @ViewChild("myFileInput") myFileInput;
  imageChangedEvent: any = "";
  fileChangeEvent(event, popupName): void {
    this.imageChangedEvent = event;
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;

      this.myFileInput.nativeElement.value; //assigning the file through viewchild
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (!acceptedImageTypes.includes(event.target.files[0].type)) {
        Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
        // this.myFileInput.nativeElement.value = "";
        this.modalRef.hide();
      } else {
        this.PopupServicevlaues(popupName);
      }
    }
  }

  PopupServicevlaues(templatePhoto: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templatePhoto, {
      animated: true,
      backdrop: "static",
      class: "second",
      keyboard: false,
    });
  }


  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }


  fileToUpload: File;
  croppedImage: any = "";
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //// console.log("this.v-- "+this.croppedImage.name);\
    //// console.log("this.croppedImage-- "+this.croppedImage);

    const byteString = window.atob(
      event.base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
    );
    // const byteString = window.atob(event.base64);
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
  count = 0

  data9: any = {}
  imageLoaded() {
    this.util.startLoader()
    this.closePhoto()
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    this.api.create("upload/image", formData).subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.photoId = res.fileId;
          localStorage.setItem('profilePhoto', this.photoId)
          this.util.stopLoader()
          this.img = {
            src: AppSettings.photoUrl + this.photoId,
          };
        }, 2000);
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


  closePhoto() {
    this.modalRef.hide();
    this.fileUploadName = "";
    // this.myFileInput.nativeElement.value = '';
  }


  passValue(values) {
     this.util.startLoader()
    var object: any = {}
    object.clientType = values.clientType
    object.userType = values.userType
    object.purpose = values.purpose
    object.firstName = values.firstName
    object.lastName = values.lastName
    object.email = values.email
    object.username = values.email
    object.photo = this.photoId
    object.skipValidation = true
    object.firstLogin = true
    object.userId = this.userId
    object.workExperience = []
    this.api.create("user/saveUser", object).subscribe(res => {
      if (res.code == '00000') {
        localStorage.setItem('userType', values.userType);
        localStorage.setItem('GSSID', res.gigsumoNo);

        if (this.source != null) {
          var data: any = {};
          data.source = this.source;
          data.showWelcomePost = true
          setTimeout(() => {
            this.router.navigate(["landingPage"], { queryParams: data });
          }, 2000);
        } else {
          var data: any = {};
          data.showWelcomePost = true
          setTimeout(() => {
            this.router.navigate(["landingPage"], { queryParams: data });
          }, 2000);
        }
      } else {
        this.util.stopLoader()
        Swal.fire({
          icon: "info",
          title: "Oops..",
          text: 'Something went wrong. Please, try after some time.',
          showConfirmButton: false,
          timer: 3000,
        })
      }
    }, err => {
      this.util.stopLoader()
    })
  }



  onLogout() {
    this.util.startLoader();
    this.api.onLogout().subscribe((res) => {
      this.util.stopLoader();
      if (res) {
        if (res.code === "00000") {
          this.cookieService.deleteAll();
          let allCookies = document.cookie.split(";");
          if (allCookies) {
            for (let i = 0; i < allCookies.length; i++) {
              document.cookie =
                allCookies[i] + "=;expires=" + new Date(0).toUTCString();
            }
          }
          localStorage.clear();
          this._socket.ngOnDestroy();​
          this._socket_stream.ngOnDestroy();​
          this.router.navigate(["/login"]);
        }
      }
    });
  }


  onItemSelect(item: any) {
    //// console.log(item);
    //// console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    //// console.log(item);
    //// console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    //// console.log(items);
  }
  onDeSelectAll(items: any) {
    //// console.log(items);
  }

  onHidden(): void {
    // console.log('Dropdown is hidden');
  }
  onShown(): void {
    // console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    // console.log('Dropdown state is changed');
  }

}
