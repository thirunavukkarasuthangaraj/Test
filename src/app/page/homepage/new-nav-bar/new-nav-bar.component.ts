import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { DOCUMENT } from "@angular/common";
import { ApiService } from "src/app/services/api.service";
import { PreviousRouteService } from "src/app/services/PreviousRouteService";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { BusinessListComponent } from "../business-list/business-list.component";
import { UtilService } from "src/app/services/util.service";
import { CookieService } from "ngx-cookie-service";
import { SearchData } from "src/app/services/searchData";
import { Subscription } from "rxjs";
import Swal from 'sweetalert2';

@Component({
  selector: "app-new-nav-bar",
  templateUrl: "./new-nav-bar.component.html",
  styleUrls: ["./new-nav-bar.component.scss"],
})
export class NewNavBarComponent implements OnInit {
  navMenuSelected: any
  bsModalRef: BsModalRef;
  isModalShown: boolean = false;
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    show: true,
  };
  clickEventsubscription: Subscription;
  @ViewChild("autoShownModal")
  autoShownModal: ModalDirective;
  previousUrl: string;
  constructor(
    private modalService: BsModalService,
    private api: ApiService,
    private previousRouteService: PreviousRouteService,
    private route: ActivatedRoute,
    private businessListComponent: BusinessListComponent,
    private menuName: SearchData,
    private util: UtilService,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private _cookie: CookieService) {
    // this.router.events.subscribe((evt) => {
    //   if (evt instanceof NavigationEnd) {
    //     this.router.navigated = false;
    //     // window.scrollTo(0, 0);
    //   }
    // });


  }

  ngOnInit() {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    var url2: any;
    var id: any = localStorage.getItem("userId");
    var res = this.router.url
    var path=  res.substring(13, res.length);
    this.navMenuSelected = path;

    // this.util.startLoader();
    // setTimeout(() => {
    //   this.api.query("user/" + id).subscribe((res) => {
    //     this.util.stopLoader();
    //     if (res.profileStatus == "INCOMPLETED" || res.profileStatus == null) {
    //       var data: any = {};
    //       data.userId = this._cookie.get("userId");
    //       this.router.navigate(["userClassification"], { queryParams: data });
    //     }
    //   },err => {
    //     this.util.stopLoader();
    //   });
    // }, 3000);
    this.route.queryParams.subscribe((res) => {
      if (res.source) {
        url2 = res.source;
      }
    });
    if (url2 != "businessOrganizationDirectory") {
      var url = this.previousRouteService.getPreviousUrl();
    }
    if (url == "/login" || url2 == "businessOrganizationDirectory") {
      var id: any = localStorage.getItem("userId");
      this.util.startLoader();
      this.api.query("user/" + id).subscribe((res) => {
        this.util.stopLoader();
        if (res.source == "businessOrganizationDirectory") {
          this.util.startLoader();
          this.api
            .query(
              "profile/activity/status/" + res.userId + "/" + res.profileId
            )
            .subscribe((res) => {
              this.util.stopLoader();
              if (res.directoryPending == true) {
                this.isModalShown = true;
              }
            },err => {
              this.util.stopLoader();
            });
        }
      },err => {
        this.util.stopLoader();
      });
    }

    this.menuclick('');
  }

  showModal(): void {
    this.isModalShown = true;
    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }

  onSubmit(value) {
    var id = localStorage.getItem("userId");
    var busId: any;
    if(value == "NOTIFY"){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary'
        },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: 'Business claim',
        text: "By canceling, you are disavowing the business claim process and you will not be able to claim the business page. Are you sure you want to continue?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'Go back',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.util.startLoader();
      this.api.query("user/" + id).subscribe((res) => {
        this.util.stopLoader();
        busId = res.profileId;
        var data: any = {};
        data.status = "IGNORED";
        data.source = "businessOrganizationDirectory";
        this.api
          .create(
            "profile/activity/" +
            res.userId +
            "/" +
            res.profileId +
            "/" +
            busId,
            data
          )
          .subscribe((res) => { });
      });
      this.hideModal();
        }
      })
    } else if (value == "COMPLETED") {
      this.util.startLoader();
      this.api.query("user/" + id).subscribe((res) => {
        this.util.stopLoader();
        busId = res.profileId;
        localStorage.setItem("businessProfileId", busId);
        var data: any = {};
        data.status = "COMPLETED";
        data.source = "businessOrganizationDirectory";
        this.api
          .create(
            "profile/activity/" +
            res.userId +
            "/" +
            res.profileId +
            "/" +
            busId,
            data
          )
          .subscribe((res) => { });
      });
      this.businessListComponent.BusniessCreatePage();
      this.hideModal();
    }

    // else if (value == "CANCEL") {
    //   var busId: any = localStorage.getItem("organizationId");
    //   this.api.query("user/" + id).subscribe((res) => {
    //     busId = res.profileId;
    //     var data: any = {};
    //     data.status = "CANCEL";
    //     data.source = "businessOrganizationDirectory";
    //     this.util.startLoader();
    //     this.api
    //       .create(
    //         "profile/activity/" +
    //         res.userId +
    //         "/" +
    //         res.profileId +
    //         "/" +
    //         busId,
    //         data
    //       )
    //       .subscribe((res) => {
    //         this.util.stopLoader();
    //       });
    //   });
    //   this.hideModal();
    // }

    // else if (value == "IGNORED") {
    //   this.util.startLoader();
    //   this.api.query("user/" + id).subscribe((res) => {
    //     this.util.stopLoader();
    //     busId = res.profileId;
    //     var data: any = {};
    //     data.status = "IGNORED";
    //     data.source = "businessOrganizationDirectory";
    //     this.api
    //       .create(
    //         "profile/activity/" +
    //         res.userId +
    //         "/" +
    //         res.profileId +
    //         "/" +
    //         busId,
    //         data
    //       )
    //       .subscribe((res) => { });
    //   });
    //   this.hideModal();
    // }

  }

  menuclick(value) {
     var res = this.router.url
     var path=  res.substring(13, res.length);
     this.navMenuSelected = path;

  }


  routePage(menuName) {

    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['landingPage/'+ menuName]);
    });
    this.navMenuSelected = menuName;
  }


  reload(value) {
    // reload current page after menu click
    var a = this.route.snapshot.root["_routerState"].url;
    var b = a.substring(a.indexOf("/") + 13);
    // RouterModule.forRoot(a, {onSameUrlNavigation: 'reload'})
    if (b == value) {
      this._document.defaultView.location.reload();
    }
  }
}
