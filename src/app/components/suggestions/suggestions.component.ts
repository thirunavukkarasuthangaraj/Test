import { JobsAppliedByTheUserComponent } from './../../widget/jobs-appliedBy-The-user/jobs-appliedBy-The-user.component';
import { JobInviteComponent } from './../../widget/job-invite/job-invite.component';
import { ResumeRequestComponent } from './../../widget/resume-request/resume-request.component';
import { InvitesCerditsComponent } from './../../widget/invites-cerdits/invites-cerdits.component';
import { FeaturedJobsComponent } from './../../widget/featured-jobs/featured-jobs.component';
import { FeaturedCandidateComponent } from './../../widget/featured-candidate/featured-candidate.component';
import { SuggestedCandidateComponent } from './../../widget/suggested-candidate/suggested-candidate.component';
import { SuggestedJobComponent } from './../../widget/suggested-job/suggested-job.component';
import { CandidateYouMightBeIntrestedInComponent } from './../../widget/candidate-you-might-be-intrested-in/candidate-you-might-be-intrested-in.component';
import { JobSubmitSkillfilterComponent } from './../../widget/job-submit-skillfilter/job-submit-skillfilter.component';
import { SponsoredAdsComponent } from './../../widget/sponsored-ads/sponsored-ads.component';
import { PromotedAdsComponent } from './../../widget/promoted-ads/promoted-ads.component';
import { PeopleWithSimilarNameComponent } from './../../widget/people-with-similar-name/people-with-similar-name.component';
import { CToFollowComponent } from './../../widget/c-to-follow/c-to-follow.component';
import { WelcomeWidgetComponent } from './../../widget/welcome-widget/welcome-widget.component';
import { ApiService } from './../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, HostListener, Injectable, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CareonlineTodayComponent, CollegueYouMayKnowComponent, CommunitiesYouMayLikeComponent, CommunityAdminComponent, ConnectionsComponent, FollowCareonlineComponent, HashtagsYouMayLikeComponent, InviteCollegueComponent, PeopleYouMayKnowComponent, ProfileCompletionComponent, SimilarBusinessNearYouComponent, SimilarCommunityComponent, TrendingCommunityComponent, TrendingHashtagComponent, TrendingPostComponent, VisitorsComponent, WidgetComponent, JobsYouMightBeIntrestedInComponent, CommonProfileInfoComponent } from 'src/app/widget';
import { SocialMediaComponent } from 'src/app/widget/social-media/social-media.component';
import { CopywriteComponent } from 'src/app/widget/copywrite/copywrite.component';
import { EmptyWidgetComponent } from 'src/app/widget/empty-widget/empty-widget.component';
import { HashtagsToFollowComponent } from 'src/app/widget/hashtags-to-follow/hashtags-to-follow.component';
import { NodataFoundComponent } from 'src/app/widget/nodata-found/nodata-found.component';
import { PeopleInyourNetworkComponent } from 'src/app/widget/people-inyour-network/people-inyour-network.component';
import { BusinessbusinessComplteDataComponent } from 'src/app/widget/business-profile-complete/business-profile-complete.component';
import { CommunityProfileCompleteComponent } from 'src/app/widget/community-profile-complete/community-profile-complete.component';
import { FollowerComponent } from 'src/app/widget/follower/follower.component';
import { CardComponent } from 'src/app/widget/card/card.component';
import { BToFollowComponent } from 'src/app/widget/b-to-follow/b-to-follow.component';
import { CandidateInviteComponent } from 'src/app/widget/candidate-invite/candidate-invite.component';
import { ResumeRequestSentComponent } from 'src/app/components/job-module/resume-request-sent/resume-request-sent.component';
import { JobInviteSentComponent } from 'src/app/widget/job-invite-sent/job-invite-sent.component';
import { SearchData } from 'src/app/services/searchData';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit  , OnDestroy {
  searchMenudata;
  pathData;
  user;
  @Input()selectedMenu : any;
   widget:any;
   sendWidgetInfo: any = {};
   countSubscription !: Subscription;
   landingsidesticky1: boolean = false;
   landingsidesticky2: boolean = false;

  constructor( private route: ActivatedRoute , public provider : countProvider) {


  }

  ngOnDestroy(): void {
    this.provider.clear();
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
  ngOnInit() {
    const body = document.body;
    body.style.overflow = 'hidden'
      this.route.queryParams.subscribe((res) => {
      this.pathData= res.master;
      this.sendWidgetInfo = {
         maxMin: {"viewType":"MAX","master":res.masterMenu},
       };

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
        "CardComponent":CardComponent,
        "JobSubmitSkillfilterComponent":JobSubmitSkillfilterComponent,
        "CandidateYouMightBeIntrestedInComponent":CandidateYouMightBeIntrestedInComponent,
        "SuggestedJobComponent":SuggestedJobComponent,
        "SuggestedCandidateComponent":SuggestedCandidateComponent,
        "FeaturedCandidateComponent":FeaturedCandidateComponent,
        "FeaturedJobsComponent":FeaturedJobsComponent,
        "InvitesCerditsComponent":InvitesCerditsComponent,
        "ResumeRequestComponent":ResumeRequestComponent,
        "JobInviteComponent":JobInviteComponent,
        "CandidateInviteComponent":CandidateInviteComponent,
        "ResumeRequestSentComponent" : ResumeRequestSentComponent,
        "JobInviteSentComponent" : JobInviteSentComponent,
        "JobsAppliedByTheUserComponent" : JobsAppliedByTheUserComponent
       };




    });
  }



  // communitytofollow(){
  //   this.auth.query("widget/community/suggestion?userId="+localStorage.getItem('userId')+"&page=0&size=4")
  //     .subscribe((res)=>{
  //     this.user = res;0
  // })
  //}
}




@Injectable({
  providedIn :'root'
})
export class countProvider  {

  private totalCount : number = 0;
  private benefitsData : any = {};

  constructor(){}

  setCount(val :number){
    this.totalCount = val;
  }

  getCount(){
     return this.totalCount;
  }

  setBenefits(data :any){
    this.benefitsData = data;
  }

  getBenefits(){
     return this.benefitsData;
  }

  clearBenefits(){
    this.benefitsData = {};
  }

  clear(){
    this.totalCount = 0;
  }

}
