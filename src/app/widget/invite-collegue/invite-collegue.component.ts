import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { PageType } from 'src/app/services/pageTypes';
import { ProfilePhoto } from 'src/app/services/profilePhoto';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invite-collegue',
  templateUrl: './invite-collegue.component.html',
  styleUrls: ['./invite-collegue.component.scss']
})
export class InviteCollegueComponent implements OnInit {

  modalRef: BsModalRef;
  connectionRequest: UntypedFormGroup;
  landingPageUserDatails: any;
  inviteDisable: boolean = false;
  splitPattern = new RegExp('[\,\;\:]');
  public errorMessages = {
    'emailValid': 'Please enter valid email id'
  }

  headerTitle
  validators = [this.emailValid];
  userId: string;
  userDetailsLanding: any;
  userName: any;
  img: any = {};
  @Input() maxMin: any = {};
  @Input() page: string;
  viewType: string = "MIN";
  showflag: boolean = false;
  @Input() inputData: string;
  @Input() widgetDesc: string;
  userType:any;
  constructor(
    private modalService: BsModalService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private a_route: ActivatedRoute,
    private profilePhoto: ProfilePhoto,
    private util: UtilService,
    private pageType: PageType,
    private API: ApiService,
  ) {
    this.userType =localStorage.getItem('userType');
  }

  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.menu = this.widgetDesc;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "InviteCollegueComponent";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }


  ngOnInit() {

    this.userType =localStorage.getItem('userType');
    this.headerTitle = this.widgetDesc;
    this.userType =localStorage.getItem('userType');
    this.a_route.queryParams.subscribe((res) => {
      if (res.master && res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }
    })


    // this.showflag=false;
    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
    }
    this.connectionRequest = this.fb.group({
      email: [null, Validators.required],
      msg: [null]
    });
    this.userId = localStorage.getItem('userId');
    this.API.query('user/' + this.userId).subscribe(res => {
      this.util.stopLoader()
      this.showflag = true;

      this.userDetailsLanding = res
      this.userName = res.username
      localStorage.setItem('userName', this.userName);
    }, err => {
      this.util.stopLoader();
    });

    this.landingPageUser();
  }

  routeToReferal() {
    var data1: any = {}
    data1.userId = localStorage.getItem('userId')
    this.router.navigate(['personalProfile'], { queryParams: data1 })
    setTimeout(() => {
      var data: any = {}
      data.pages = 'referrals'
      this.pageType.setPageName(data)
    }, 2000);
  }

  openModal(template: TemplateRef<any>) {
    this.connectionRequest.reset();
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static'
    });
  }

  closeInviteModal() {
    this.modalRef.hide();
    this.connectionRequest.reset();
  }

  // emailValid(control: AbstractControl) {
  // //   //// console.log(control);
  //   if (Validators.email(new FormControl(control.value))) {
  //   //  //// console.log(true);
  //     return {
  //           'emailValid': true
  //       };
  //   }
  // }

  emailValid(control: AbstractControl) {
    //   console.log(control);
    var pattern: string = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+){1,2}$";
    //if (Validators.email(new FormControl(control.value))) {
    const control1 = new UntypedFormControl(control.value, Validators.pattern(pattern));
    if (control1.errors != null) {
      //  console.log(true);
      return {
        'emailValid': true
      };
    }
  }




  invitation() {

    // i changed sinle line

    const input = {
      userId: this.landingPageUserDatails.userId,
      firstName: this.landingPageUserDatails.firstName,
      lastName: this.landingPageUserDatails.lastName,
      inviteEmailList: this.connectionRequest.value.email,
      message: this.connectionRequest.value.msg

    };
    /// this.landingPageUserDatails.inviteeEmail = this.InvitationForm;
    this.inviteDisable = true;
    this.util.startLoader();
    this.API.create('home/inviteeUser', input).subscribe(res => {
      this.util.stopLoader()
      if (res) {
        this.closeInviteModal();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Invite sent successfully',
          showConfirmButton: false,
          timer: 2000
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          //  //// console.log("login redirect")
          //  //// console.log("login redirect" +result.isConfirmed)
          if (result.isConfirmed) {
          }
        });

      } else {

      }
      this.inviteDisable = false;
    }, err => {
      this.util.stopLoader();
    });
  }

  landingPageUser() {
    this.util.startLoader()
    this.API.queryPassval('home/' + this.userId, this.userDetailsLanding).subscribe(res => {
      this.util.stopLoader()
      this.landingPageUserDatails = res;
      this.img = {}
      // if (res.photo != undefined) {
      //   this.profilePhoto.setPhoto(res.photo)
      // }
      // if (res.photo === null) {
      //   this.img = {}
      //   this.profilePhoto.setPhoto(null)
      // }
    }, err => {
      this.util.stopLoader();
    });

  }




}
