import { ResumeRequestComponent } from './../resume-request/resume-request.component';
import { InvitesCerditsComponent } from './../invites-cerdits/invites-cerdits.component';
import { ActivatedRoute } from '@angular/router';
import { WelcomeWidgetComponent } from './../welcome-widget/welcome-widget.component';
import { JobSubmitSkillfilterComponent } from './../job-submit-skillfilter/job-submit-skillfilter.component';
import { PeopleWithSimilarNameComponent } from './../people-with-similar-name/people-with-similar-name.component';
import { UtilService } from './../../services/util.service';
import { EmptyWidgetComponent } from './../empty-widget/empty-widget.component';
import { HashtagsToFollowComponent } from './../hashtags-to-follow/hashtags-to-follow.component';
import { PeopleInyourNetworkComponent } from './../people-inyour-network/people-inyour-network.component';
import { SponsoredAdsComponent } from './../sponsored-ads/sponsored-ads.component';
import { PromotedAdsComponent } from './../promoted-ads/promoted-ads.component';
import { CommonProfileInfoComponent } from './../common-profile-info/common-profile-info.component';
import { JobsYouMightBeIntrestedInComponent } from './../jobs-you-might-be-intrested-in/jobs-you-might-be-intrested-in.component';
import { VisitorsComponent } from './../visitors/visitors.component';
import { TrendingPostComponent } from './../trending-post/trending-post.component';
import { TrendingHashtagComponent } from './../trending-hashtag/trending-hashtag.component';
import { TrendingCommunityComponent } from './../trending-community/trending-community.component';
import { SimilarCommunityComponent } from './../similar-community/similar-community.component';
import { SimilarBusinessNearYouComponent } from './../similar-business-near-you/similar-business-near-you.component';
import { ProfileCompletionComponent } from './../profile-completion/profile-completion.component';
import { PeopleYouMayKnowComponent } from './../people-you-may-know/people-you-may-know.component';
import { InviteCollegueComponent } from './../invite-collegue/invite-collegue.component';
import { HashtagsYouMayLikeComponent } from './../hashtags-you-may-like/hashtags-you-may-like.component';
import { FollowCareonlineComponent } from './../follow-careonline/follow-careonline.component';
import { ConnectionsComponent } from './../connections/connections.component';
import { CommunityAdminComponent } from './../community-admin/community-admin.component';
import { CommunitiesYouMayLikeComponent } from './../communities-you-may-like/communities-you-may-like.component';
import { CollegueYouMayKnowComponent } from './../collegue-you-may-know/collegue-you-may-know.component';
// import { BusinessToFollowComponent } from './../business-to-follow/business-to-follow.component';
import { SocialMediaComponent } from './../social-media/social-media.component';
import { WidgetComponent } from './../widget/widget.component';
import { ApiService } from './../../services/api.service';
import { CareonlineTodayComponent } from '../careonline-today/careonline-today.component';
import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { CopywriteComponent } from '../copywrite/copywrite.component';
import { NodataFoundComponent } from '../nodata-found/nodata-found.component';
import { BusinessbusinessComplteDataComponent } from '../business-profile-complete/business-profile-complete.component';
import { CommunityProfileCompleteComponent } from '../community-profile-complete/community-profile-complete.component';
import { CommonValues } from 'src/app/services/commonValues';
import { Subscription } from 'rxjs';
import { SearchData } from 'src/app/services/searchData';
import { debug } from 'console';
import { FollowerComponent } from '../follower/follower.component';
import { PageType } from 'src/app/services/pageTypes';
import { CardComponent } from '../card/card.component';
import { BToFollowComponent } from '../b-to-follow/b-to-follow.component';
import { CToFollowComponent } from '../c-to-follow/c-to-follow.component';
import { IntersectionStatus } from 'src/app/directives/from-intersection-observer';
import { CandidateYouMightBeIntrestedInComponent } from '../candidate-you-might-be-intrested-in/candidate-you-might-be-intrested-in.component';
import { FeaturedCandidateComponent } from '../featured-candidate/featured-candidate.component';
import { FeaturedJobsComponent } from '../featured-jobs/featured-jobs.component';
import { SuggestedCandidateComponent } from '../suggested-candidate/suggested-candidate.component';
import { SuggestedJobComponent } from '../suggested-job/suggested-job.component';
import { JobInviteComponent } from '../job-invite/job-invite.component';
import { CandidateInviteComponent } from '../candidate-invite/candidate-invite.component';
import { PriceAvilalbleComponent } from '../price-avilalble/price-avilalble.component';

@Component({
  selector: 'app-common-widget',
  templateUrl: './common-widget.component.html',
  styleUrls: ['./common-widget.component.scss']
})



export class CommonWidgetComponent implements OnInit {
  @Input() page: any;
  @Input() inputData: any;
  @Input() showflag: any;
  @Input() hideCompelte: any;
  @Input() showsuggJobsData: any;

  //@Input() userType: any;
  @Input() timeout: any = 0;
  WidgetList: any = [];
  inputs: any;
  userBasedmenu: any = {};
  widget: any;
  _userType: String = null;
  viewByMembers: Boolean = null;
  clickEventsubscription: Subscription;
  subscription: Subscription
  subscription1: Subscription
  lastWidget: any;
  commondata: any = {};
  @Input() set userType(userType: String) {
    this._userType = userType;
    // this.apicall();
    if (this._userType != null && this.WidgetList.length > 0) {
      this.refresh();
    }
  }


  @Input() set viewByMember(userFlag: boolean) {
    this.viewByMembers = userFlag;
    if (this.viewByMembers != null && this.WidgetList.length > 0) {
      this.viewadmin();
    }
  }


  // get hide component value
  outputs = {
    commonFunction: widgetsData => {
      this.hideComponent(widgetsData);
    }
  };

  showWelcomePostWidget: boolean = false
  loopCount = Array(6).fill(0).map((x, i) => i);
  constructor(private api: ApiService, private a_route: ActivatedRoute, private commonvalues: CommonValues,
    private util: UtilService, private pageType: PageType, private searchData: SearchData) {
    this.clickEventsubscription = this.commonvalues.getbusinessid().subscribe((res) => {
      this.commondata = res;
    });

    this.subscription = this.pageType.getPageName().subscribe(res => {
      this.Widgetlist(null);
      this.apicall();
    })

    this.subscription1 = this.pageType.getsuggjob().subscribe(res => {
      this.Widgetlist(null);
      this.apicall();
    })

    // console.log("changesaaa",this.showsuggJobsData)

  }

  ngOnInit() {
    this.a_route.queryParams.subscribe((res) => {
      if (res.showWelcomePost == 'true') {
        this.showWelcomePostWidget = true
      } else {
        this.showWelcomePostWidget = false
      }
    })
    this.Widgetlist(null);
    this.apicall();


  }



  onVisibilityChanged(index: number, status: IntersectionStatus) {
    // this.visibilityStatus[index] = status;
    if (status) {
      var val: any = {}
      val.position = window.pageYOffset;
      this.searchData.setSticky(val)
    }
  }

  trackByIndex(index: number) {
    return index;
  }


  Widgetlist(removecomp) {
    this.widget = {

      "BusinessToFollowComponent": BToFollowComponent,
      "CommunityProfileCompleteComponent": CommunityProfileCompleteComponent,
      "BusinessProfileCompleteComponent": BusinessbusinessComplteDataComponent,
      "CareonlineTodayComponent": CareonlineTodayComponent,
      "CollegueYouMayKnowComponent": CollegueYouMayKnowComponent,
      "WelcomeWidgetComponent": WelcomeWidgetComponent,
      "CToFollowComponent": CToFollowComponent,
      "CommunityAdminComponent": CommunityAdminComponent,
      "ConnectionsComponent": ConnectionsComponent,
      "FollowCareonlineComponent": FollowCareonlineComponent,
      "HashtagsYouMayLikeComponent": HashtagsYouMayLikeComponent,
      "InviteCollegueComponent": InviteCollegueComponent,
      "PeopleYouMayKnowComponent": PeopleYouMayKnowComponent,
      "ProfileCompletionComponent": ProfileCompletionComponent,
      "SimilarBusinessNearYouComponent": SimilarBusinessNearYouComponent,
      "SimilarCommunityComponent": SimilarCommunityComponent,
      "TrendingCommunityComponent": TrendingCommunityComponent,
      "TrendingHashtagComponent": TrendingHashtagComponent,
      "PeopleWithSimilarNameComponent": PeopleWithSimilarNameComponent,
      "TrendingPostComponent": TrendingPostComponent,
      "VisitorsComponent": VisitorsComponent,
      "WidgetComponent": WidgetComponent,
      "JobsYouMightBeIntrestedInComponent": JobsYouMightBeIntrestedInComponent,
      "CommonProfileInfoComponent": CommonProfileInfoComponent,
      "PromotedAdsComponent": PromotedAdsComponent,
      "SponsoredAdsComponent": SponsoredAdsComponent,
      "PeopleInyourNetworkComponent": PeopleInyourNetworkComponent,
      "HashtagsToFollowComponent": HashtagsToFollowComponent,
      "EmptyWidgetComponent": EmptyWidgetComponent,
      "CopywriteComponent": CopywriteComponent,
      "NodataFoundComponent": NodataFoundComponent,
      "SocialMediaComponent": SocialMediaComponent,
      "FollowerComponent": FollowerComponent,
      "CardComponent": CardComponent,
      "JobSubmitSkillfilterComponent": JobSubmitSkillfilterComponent,
      "CandidateYouMightBeIntrestedInComponent": CandidateYouMightBeIntrestedInComponent,
      "SuggestedJobComponent": SuggestedJobComponent,
      "SuggestedCandidateComponent": SuggestedCandidateComponent,
      "FeaturedCandidateComponent": FeaturedCandidateComponent,
      "FeaturedJobsComponent": FeaturedJobsComponent,
      "InvitesCerditsComponent": InvitesCerditsComponent,
      "ResumeRequestComponent": ResumeRequestComponent,
      "JobInviteComponent": JobInviteComponent,
      "CandidateInviteComponent": CandidateInviteComponent,
      "PriceAvilalbleComponent": PriceAvilalbleComponent,
    };

    if (removecomp != null) {
      delete this.widget.removecomp;
      this.apicall();
    }

  }
  loadAPIcall=false;
  apicall() {
    setTimeout(() => {


      if (this.page && this.page != "") {
        let data: any = {}
        data.page = this.page;
        // this.util.startLoader();
        this.loadAPIcall=true
        this.api.create('widget/list', data).subscribe(res => {
          if (res != undefined && res) {
            // this.util.stopLoader();
            this.loadAPIcall=false;
            this.WidgetList = [];
            res.forEach((element, i) => {
              element.show = true;
              if (element.userType === "ALL") {
                element.show = true;
              } else {
                element.show = false;
              }

              if (element.widgetId == 'WELCOME_WIDGET' && this.showWelcomePostWidget == false) {
                element.show = false
              } else if (element.widgetId == 'WELCOME_WIDGET' && this.showWelcomePostWidget == true) {
                element.show = true
              }

              if (this._userType == 'ADMIN') {
                element.show = true;
              }

              if (this.commondata.adminviewnavigation == true && element.userType == 'ADMIN') {
                element.show = true;
              } else if (this.commondata.adminviewnavigation == false && element.userType == 'ADMIN') {
                element.show = false;
              } else if (localStorage.getItem('viewAsadmin') == 'true' && element.userType == 'ADMIN') {
                element.show = true;
              }
              else if (localStorage.getItem('viewAsadmin') == 'false' && element.userType == 'ADMIN') {
                element.show = false;
              }

              if (this.hideCompelte == 'LandingBusiness' && element.widgetName == 'BusinessProfileCompleteComponent' && element.userType == 'ALL') {
                element.show = false;
              }

              if (this.hideCompelte == 'LandingCommunity' && element.widgetName == 'CommunityProfileCompleteComponent' && element.userType == 'ALL') {
                element.show = false;
              }

              if (this.inputData == 'COMMUNITY_CREATE_PAGE') {
                element.show = true;
              }

              if (this.inputData == 'BUSINESS_CREATION') {
                element.show = true;
              }
              //  if (this.showflag == false && element.widgetId=='FEATURED_JOB'){
              //   element.show = true;
              // }



              element.ready = true;

              this.inputs = {
                inputData: this.inputData,
                page: this.page


              };

              this.inputs.widgetDesc = element.widgetDesc;
              this.inputs.suggestion = this.showsuggJobsData;


              element.widgetData = this.inputs;

              this.WidgetList.push(element)
              var temp = [];
              temp = this.duplicate(this.WidgetList);
              this.WidgetList = temp;
            });
            // console.log("this.WidgetList")
            // console.log(this.WidgetList[this.WidgetList.length-1].widgetId)

            if (this.WidgetList.length != 0) {
              this.lastWidget = this.WidgetList[this.WidgetList.length - 1].widgetId
            }

          }
        }, err => {
          // this.util.stopLoader();
          if (err.status == 500) {
            // this.util.stopLoader();
          }
          // //// console.log(err)
        });
      }
    }, this.timeout);
  }

  OnDestroy() {
    if (this.subscription1) {
      this.subscription1.unsubscribe()
    }
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
  // ngAfterViewIn()it(){

  // }



  // getOffset() {
  //   const rect = document.getElementById('shaktiman').getBoundingClientRect();
  //   console.log(rect.left + window.scrollX)
  //   console.log(rect.top + window.scrollY)
  //   return {
  //     left: rect.left + window.scrollX,
  //     top: rect.top + window.scrollY
  //   };
  // }

  refresh(): void {
    var temp = [];
    temp = this.duplicate(this.WidgetList);
    this.WidgetList = temp;
    this.WidgetList.forEach(element => {
      if (element.userType != "ALL" && element.userType == this._userType || element.userType == 'ADMIN') {
        element.show = true;
      }

      if (this.commondata.adminviewnavigation == true && element.userType == 'ADMIN') {
        element.show = true;
      } else if (this.commondata.adminviewnavigation == false && element.userType == 'ADMIN') {
        element.show = false;
      }

      if (this.commondata.adminviewnavigation == true && element.userType == 'ADMIN') {
        element.show = true;
      }


      if (this.inputData == 'COMMUNITY_CREATE_PAGE') {
        element.show = true;
      }

      if (this.inputData == 'BUSINESS_CREATION') {
        element.show = true;
      }

      // if (this.showflag == false && element.widgetId=='FEATURED_JOB'){
      //   element.show = true;
      // }

      if (this.inputData == 'PROFILE_CREATE_PAGE') {
        element.show = true;
      }
    });
  }

  viewadmin() {
    this.WidgetList.forEach(element => {
      if (this.commondata.adminviewnavigation == true && element.userType == 'ADMIN') {
        element.show = true;
      } else if (this.commondata.adminviewnavigation == false && element.userType == 'ADMIN') {
        element.show = false;
      }

      if (this.viewByMembers == true && element.userType == 'ADMIN') {
        element.show = true;
      }
      if (this.viewByMembers == false && element.userType == 'ADMIN') {
        element.show = false;
      }

    });

  }

  duplicate(data) {
    var temp = [];
    var arr = data.filter(function (el) {
      // If it is not a duplicate, return true
      if (temp.indexOf(el.widgetId) == -1) {
        temp.push(el.widgetId);
        return true;
      }
      return false;
    });
    return arr;
  }


  hideComponent(type): void {
    this.WidgetList.forEach(element => {
      if (element.widgetName == type.widgetName) {
        if (type.hide == true) {
          element.show = false;
        }
        else if (type.hide == false) {
          element.show = true;
        }

      }

    });

    this.viewadmin();
  }

}
