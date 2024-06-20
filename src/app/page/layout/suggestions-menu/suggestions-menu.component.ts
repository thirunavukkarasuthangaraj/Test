import { Router } from '@angular/router';
import { UtilService } from './../../../services/util.service';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SearchData } from 'src/app/services/searchData';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
@Component({
  selector: 'app-suggestions-menu',
  templateUrl: './suggestions-menu.component.html',
  styleUrls: ['./suggestions-menu.component.scss']
})
export class SuggestionsMenuComponent implements OnInit , OnDestroy {
  divHeight
  //Dev Code
  @ViewChild('landingside1') menuElement: ElementRef;
  @ViewChild('landingside2') menuElement1: ElementRef;
  @Input() page: any;


  landingsidesticky1: boolean = false;
  landingsidesticky2: boolean = false;
  csshide: Boolean = false
  elementPosition: any;
  WidgetList: any = [];
  userId: any = localStorage.getItem('userId');
  userType: any = localStorage.getItem('userType');
  pathData: any;
  selectedmenu: any;


  constructor(private api: ApiService, private provider : countProvider,
    private route: ActivatedRoute, private util: UtilService) { }

  ngOnDestroy(): void {
    this.provider.clear();
  }

  ngOnInit() {
//window.scroll(0, 0);
    this.route.queryParams.subscribe((res) => {
      this.page = res.master;
      this.pathData = res;
      this.selectedmenu = { 'menu': this.pathData.menu, 'widgetName': this.pathData.widgetName };
      this.pathData.menu;
      this.apicall();
    });


    if (window.innerHeight == 500 && window.innerWidth == 1093) {
      this.csshide = true;
    } else if (window.innerHeight > 500 && window.innerWidth > 1093) {
      this.csshide = true;
    } else if (window.innerHeight < 500 && window.innerWidth < 1093) {
      this.csshide = true;
    }

  }

  showPage:boolean=true;
  clickmenu(item) {
    this.showPage=false;
    this.provider.clear();
    // reset object
    this.selectedmenu = { 'menu': item.widgetDesc, 'widgetName': item.widgetName };
    this.selectedmenu ={...this.selectedmenu};
    setTimeout(() => {
      this.showPage=true
    }, 200);

   }

  // @HostListener('window:scroll')
  // handleScroll() {
  //   const windowScroll = window.pageYOffset;
  //   if (windowScroll >= 24) {
  //     this.landingsidesticky1 = true;
  //     this.landingsidesticky2 = true;

  //   } else {
  //     this.landingsidesticky1 = false;
  //     this.landingsidesticky2 = false;
  //   }
  // }

  @HostListener("window:resize")
  onResize() {
    if (window.innerHeight == 500 && window.innerWidth == 1093) {
      //this.landingsidesticky1 = false;
      //this.landingsidesticky2 = true;
      this.csshide = true;
    } else if (window.innerHeight > 500 && window.innerWidth > 1093) {
      //this.landingsidesticky1 = false;
      // this.landingsidesticky2 = true;
      this.csshide = true;
    } else if (window.innerHeight < 500 && window.innerWidth < 1093) {
      this.csshide = false;
    }
  }

  get isBENCHorJOBEEKER() : boolean {
    return this.userType == 'BENCH_RECRUITER' || this.userType === "JOB_SEEKER"
  }

  apicall() {

    if (this.page && this.page != "" && this.page != null && this.page != undefined) {
      let data: any = {}
      data.page = this.page;
      // this.util.startLoader();
      this.api.create('widget/list', data).subscribe(res => {
        this.WidgetList = [];

        if (res != undefined) {
          res.forEach(element => {
            if (element.viewType == true) {
              this.WidgetList.push(element)

              if (this.isBENCHorJOBEEKER && element.widgetId == "CANDIDATE_INVITE") {
                this.WidgetList.pop();
              }
              else if (this.userType == 'RECRUITER' && element.widgetId == "RESUME_REQUEST") {
                this.WidgetList.pop();
              }
              else if (this.userType == 'RECRUITER' && element.widgetId == "JOB_APPLIEDBY_CANDIDATES") {
                this.WidgetList.pop();
              }
              else if (this.userType == 'RECRUITER' && element.widgetId == "JOB_INVITES") {
                //console.log(element.widgetId +"gfhgghg");
                this.WidgetList.pop();
              }
              else if (this.userType == 'RECRUITER' && element.widgetId == "FEATURED_JOB") {
                this.WidgetList.pop();
              }
              else if (this.userType == 'RECRUITER' && element.widgetId == "SUGGESTED_JOB") {
                this.WidgetList.pop();
              }
              else if (this.isBENCHorJOBEEKER && element.widgetId == "SUGGESTED_CANDIDATE") {
                this.WidgetList.pop();
              }
              else if (this.isBENCHorJOBEEKER && element.widgetId == "RESUME_REQUEST_SENT") {
                this.WidgetList.pop();
              }
              else if (this.isBENCHorJOBEEKER && element.widgetId == "JOB_INVITE_SENT") {
                this.WidgetList.pop();
              }
              else if (this.isBENCHorJOBEEKER && element.widgetId == "FEATURED_CANDIDATE") {
                this.WidgetList.pop();
              }
              else if ( this.userType == "JOB_SEEKER" && element.widgetId == "CANDIDATE_INVITE") {
                this.WidgetList.pop();
              }else if ( this.isBENCHorJOBEEKER && element.widgetId == "CANDIDATE_YOU_MIGHT_BE_INTERESTED_IN") {
                this.WidgetList.pop();
              }else if (this.userType == 'RECRUITER' && element.widgetId == "JOBS_YOU_MIGHT_BE_INTERESTED_IN") {
                this.WidgetList.pop();
              }
            }

            if (this.page == "GIG_HOME_PAGE") {
              if ( this.isBENCHorJOBEEKER   && (element.widgetId == "JOBS_YOU_MIGHT_BE_INTERESTED_IN" || element.widgetId == "SUGGESTED_JOB" || element.widgetId == "FEATURED_JOB")) {
                 this.WidgetList.push(element);
              }
              if (this.userType == 'RECRUITER' && (element.widgetId == "CANDIDATE_YOU_MIGHT_BE_INTERESTED_IN" || element.widgetId == "FEATURED_CANDIDATE" || element.widgetId == "SUGGESTED_CANDIDATE")) { this.WidgetList.push(element)}
              if ((this.userType == 'FREELANCE_RECRUITER' || this.userType == 'MANAGEMENT_TALENT_ACQUISITION') && (element.widgetId == "SUGGESTED_JOB" || element.widgetId == "FEATURED_JOB" ||
               element.widgetId == "SUGGESTED_CANDIDATE" || element.widgetId == "FEATURED_CANDIDATE" || element.widgetId == "JOBS_YOU_MIGHT_BE_INTERESTED_IN" || element.widgetId == "CANDIDATE_YOU_MIGHT_BE_INTERESTED_IN")) {this.WidgetList.push(element)}
            }
          });



          // this.util.stopLoader();
        }
      }, err => {
        // this.util.stopLoader();
      });
    }
  }
}
