import { PlanFeatureComponent } from './components/Price-subscritions/plan_feature/plan-feature/plan-feature.component';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from "@angular/material/icon"
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConnectionServiceModule } from 'ng-connection-service';
import { OnlyNumber } from './components/credit/membership-credit/onlynumber.directive';
import { BreadcrumbComponent } from './directives/breadcrumb/breadcrumb.component';
import { EncrytDecryptDirective } from './directives/encryt-decrypt.directive';
import { ConnectionComponent } from "./page/homepage/connection/connection.component";
import { MyFilterPipe } from "./pipe/MyFilterPipe.pipe";
import { DndDirective } from './services/dnd.directive';
import { JobSubmitSkillfilterComponent } from './widget/job-submit-skillfilter/job-submit-skillfilter.component';
import { PeopleWithSimilarNameComponent } from "./widget/people-with-similar-name/people-with-similar-name.component";
// import {NgAutoCompleteModule} from "ng-auto-complete";

// Components
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
//import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from "./components/footer/footer.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { SignUpPage2Component } from "./components/sign-up-page2/sign-up-page2.component";
// Services
// import { dateFormat } from './services/dateFormat';
// import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

//Angular component for Google reCAPTCHA
import { RecaptchaModule } from "ng-recaptcha";
import { NgCircleProgressModule } from "ng-circle-progress";
// Third Party Plugin
import {


  // MatBadgeModule,
  // MatButtonModule,
  // MatDialogModule,
  // MatExpansionModule,
  // MatIconModule,
  // MatInputModule,
  // MatMenuModule,
  // MatRadioModule,
  // MatRippleModule,
  // MatCheckboxModule,
  // MatSelectModule,
  // MatSnackBarModule,
  // MatTabsModule,
  // MatTooltipModule
} from "@angular/material/";


import {MatRadioModule}  from "@angular/material/radio";
import {MatMenuModule}  from "@angular/material/menu";
import {MatInputModule}  from "@angular/material/input";
import {MatExpansionModule }  from "@angular/material/expansion";
import {MatSelectModule }  from "@angular/material/select";
import {MatBadgeModule}  from "@angular/material/badge";
import {MatTabsModule}  from "@angular/material/tabs";
import {MatSnackBarModule}  from "@angular/material/snack-bar";

import { MatAutocompleteModule } from "@angular/material/autocomplete";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { NgxSpinnerModule } from "ngx-spinner";
import { AppAccessComponent } from "./components/app-access/app-access.component";
import { FogetPasswordAppUserComponent } from "./components/foget-password-app-user/foget-password-app-user.component";
import { HeaderComponent } from "./components/header/header.component";
import { MembersDirectoryComponent } from "./components/members-directory/members-directory.component";
import { MenuComponent } from "./components/menu/menu.component";
import { PasswordResetConfirmedComponent } from "./components/password-reset-confirmed/password-reset-confirmed.component";
import { PasswordStrengthComponent } from "./components/password-strength/password-strength.component";
import { PersonalProfileEditComponent } from "./components/personal-profile-edit/personal-profile-edit.component";
import { SecuritySettingsComponent } from "./components/security-settings/security-settings.component";
import { SocialMediaAccessComponent } from "./components/social-media-access/social-media-access.component";
//image crop package
import { CropperModule } from "ngx-cropper";
import { ImageCropperModule } from "ngx-image-cropper";


import {
  CommonModule,
  DatePipe
} from "@angular/common";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { AdminPanelAlertComponent } from "./components/forgot-password/admin-panel-alert/admin-panel-alert.component";
import { NewFooterComponent } from "./components/forgot-password/new-footer/new-footer.component";
import { PinStrengthComponent } from "./components/pin-strength/pin-strength.component";
import { dateFormat } from "./services/dateFormat";
// import { NavigationHeaderComponent } from './components/navigation-header/navigation-header.component';

import { TagInputModule } from "ngx-chips";
import { CookieService } from "ngx-cookie-service";
//Search Pipe Filter using ng2-search-filter
import { Ng2SearchPipeModule } from "ng2-search-filter";

import { NgSelectModule } from "@ng-select/ng-select";
//import { TestComponent, WikipediaService } from './Testing/test/test.component';
//auto complete
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgxSummernoteModule } from "ngx-summernote";
import { BusinessUserComponent } from "./components/Search-list-UI/business-user/business-user.component";
import { CommunitiesComponent } from "./components/Search-list-UI/communities/communities.component";
import { PeopleComponent } from "./components/Search-list-UI/people/people.component";
import { PostComponent } from "./components/Search-list-UI/post/post.component";
import { SearchListFilterComponent } from "./components/Search-list-UI/search-list-filter/search-list-filter.component";
import { SearchMenuComponent } from "./components/Search-list-UI/search-menu/search-menu.component";
import { CommunityBannerComponent } from "./components/communitypages/community-banner/community-banner.component";
import { CommunityCreateComponent } from "./components/communitypages/community-create/community-create.component";
import { CommunityPageadminComponent } from "./components/communitypages/community-pageadmin/community-pageadmin.component";
import { CommunityComponent } from "./components/communitypages/community/community.component";
import { NavheadercommunityComponent } from "./components/communitypages/navheadercommunity/navheadercommunity.component";
import { RequestComponent } from "./components/communitypages/request/request.component";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { SearchListComponent } from "./components/search-list/search-list.component";
import { UserDetailsComponent } from "./components/user-details/user-details.component";

import { AllUserListComponent } from "./components/Search-list-UI/all-user-list/all-user-list.component";
import { BusinessActiveInActiveComponent } from "./components/bussinesspages/business-active-in-active/business-active-in-active.component";
import { BusinessAdminComponent } from "./components/bussinesspages/business-admin/business-admin.component";
import { BusinessAnalyticsComponent } from "./components/bussinesspages/business-analytics/business-analytics.component";
import { BusinessBannerComponent } from "./components/bussinesspages/business-banner/business-banner.component";
import { BusinessEmployeeComponent } from "./components/bussinesspages/business-employee/business-employee.component";
import { BusinessFollowerComponent } from "./components/bussinesspages/business-follower/business-follower.component";
import { BusinessProfileComponent } from "./components/bussinesspages/business-profile/business-profile.component";
import { BusinessComponent } from "./components/bussinesspages/business/business.component";
//import { CreateBusinessComponent } from './components/bussinesspages/create-business/create-business.component';
import { InvitesendComponent } from "./components/communitypages/invitesend/invitesend.component";

import { ManagepageComponent } from "./components/communitypages/managepage/managepage.component";
import { MembersComponent } from "./components/communitypages/members/members.component";
import { MessagepageComponent } from "./components/messagepage/messagepage.component";

import { CarouselModule } from "ngx-bootstrap/carousel";
import { CacheService } from "src/app/services/cache.service";
import { BusinessCommunityComponent } from "./components/bussinesspages/business-community/business-community.component";
import { BussinessPeoplepostComponent } from "./components/bussinesspages/bussiness-peoplepost/bussiness-peoplepost.component";
import { CommunityCardComponent } from "./components/cards/community-card/community-card.component";
import { UserCardComponent } from "./components/cards/user-card/user-card.component";
import { CommunityProfileComponent } from "./components/communitypages/community-profile/community-profile.component";
import { FormDirective } from "./components/form.directive";
import { LangdingPageNavBarComponent } from "./components/langding-page-nav-bar/langding-page-nav-bar.component";
import { MessagescrollDirective } from "./directives/messagescroll.directive";
import { PageNotFoundComponent } from "./errorPage/page-not-found/page-not-found.component";
import { AppHttpInterceptor } from "./interceptor/AppHttpInterceptor";
import { TruncatePipe } from "./pipe/TruncatePipe.pipe";
import { MessageuniquePipe } from "./pipe/messageunique.pipe";
import { MessageService } from "./services/message.service";
import { MessageComponent } from "./services/message/message.component";
//import { BusinessCardComponent } from './components/cards/business-card/business-card.component';
//import { CommonpageSearchComponent } from './components/Search-list-UI/commonpage-search/commonpage-search.component';
import { BlockCopyPasteDirective } from  "./components/Helper/copy-past-block";
// import { BusinessSearchComponent } from './components/bussinesspages/business-search/business-search.component';
// import { BusinessEmployeeSearchComponent } from './components/bussinesspages/business-employee-search/business-employee-search.component';
// import { BusinessAdminSearchComponent } from './components/bussinesspages/business-admin-search/business-admin-search.component';
// import { BusinessCommunitySearchComponent } from './components/bussinesspages/business-community-search/business-community-search.component';
import { CountdownGlobalConfig, CountdownModule } from "ngx-countdown";
import { PersonalProfileComponent } from "./components/account-settings/personal-profile/personal-profile.component";
import { ProfileNavigationHeaderComponent } from "./components/account-settings/profile-navigation-header/profile-navigation-header.component";
import { ProfileSuggestionsComponent } from "./components/account-settings/profile-suggestions/profile-suggestions.component";
import { DeactivateBusinessComponent } from "./components/bussinesspages/deactivate-business/deactivate-business.component";
import { DeactivateCommunityComponent } from "./components/communitypages/deactivate-community/deactivate-community.component";
import { PageListComponent } from "./components/page-list/page-list.component";
import { NameFilterPipe } from "./pipe/name-filter.pipe";



import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from "ngx-perfect-scrollbar";
import { UserBadgeComponent } from "./components/landing-page/user-badge/user-badge.component";
import { NoWhitespaceDirective } from "./directives/nowhitespace.directive";
import { NamePipe } from "./pipe/NamePipe.pipe";
import {
  BusinessToFollowComponent,
  CareonlineTodayComponent,
  CollegueYouMayKnowComponent,
  CommonProfileInfoComponent,
  CommunitiesYouMayLikeComponent,
  CommunityAdminComponent,
  ConnectionsComponent,
  FollowCareonlineComponent,
  HashtagsYouMayLikeComponent,
  InviteCollegueComponent,
  JobsYouMightBeIntrestedInComponent,
  PeopleYouMayKnowComponent,
  ProfileCompletionComponent,
  ScrollToTopComponent,
  SimilarBusinessNearYouComponent,
  SimilarCommunityComponent,
  TrendingCommunityComponent,
  TrendingHashtagComponent,
  TrendingPostComponent,
  VisitorsComponent,
  WidgetComponent,
} from "./widget";
import { CommonWidgetComponent } from "./widget/common-widget/common-widget.component";
import { DynamicModule } from "ng-dynamic-component";
import { IndexComponent } from "./page/component/index/index.component";
import { BusinessListComponent } from "./page/homepage/business-list/business-list.component";
import { HashtagComponent } from "./page/homepage/hashtag/hashtag.component";
import { TeamComponent } from "./page/homepage/team/team.component";
import { EmptyWidgetComponent } from "./widget/empty-widget/empty-widget.component";
import { HashtagsToFollowComponent } from "./widget/hashtags-to-follow/hashtags-to-follow.component";
import { PeopleInyourNetworkComponent } from "./widget/people-inyour-network/people-inyour-network.component";
import { PromotedAdsComponent } from "./widget/promoted-ads/promoted-ads.component";
import { SponsoredAdsComponent } from "./widget/sponsored-ads/sponsored-ads.component";

import { TeamAboutAsPageComponent } from "./components/TeamPages/team-about-as-page/team-about-as-page.component";
import { TeamHeaderBarComponent } from "./components/TeamPages/team-header-bar/team-header-bar.component";
import { TeamHomePageComponent } from "./components/TeamPages/team-home-page/team-home-page.component";
import { TeamMembersPageComponent } from "./components/TeamPages/team-members-page/team-members-page.component";
import { TeamRoutePageComponent } from "./components/TeamPages/team-route-page/team-route-page.component";
import { TeamSideBarNavComponent } from "./components/TeamPages/team-side-bar-nav/team-side-bar-nav.component";
import { BusinessCardComponent } from "./components/cards/business-card/business-card.component";
import { NetworkCardComponent } from "./components/cards/network-card/network-card.component";
import { TeamcardComponent } from "./components/cards/teamcard/teamcard.component";
import { NetAboutpageComponent } from "./components/networkpages/net-aboutpage/net-aboutpage.component";
import { NetHeaderpageComponent } from "./components/networkpages/net-headerpage/net-headerpage.component";
import { NetHomepageComponent } from "./components/networkpages/net-homepage/net-homepage.component";
import { NetMemberspageComponent } from "./components/networkpages/net-memberspage/net-memberspage.component";
import { NetNavbarpageComponent } from "./components/networkpages/net-navbarpage/net-navbarpage.component";
import { NetNetworkComponent } from "./components/networkpages/net-network/net-network.component";
import { NewMessagePageComponent } from "./components/new-message-page/new-message-page.component";
import { CommunityListComponent } from "./page/homepage/community-list/community-list.component";
import { NewNavBarComponent } from "./page/homepage/new-nav-bar/new-nav-bar.component";
import { PostListComponent } from "./page/homepage/post-list/post-list.component";
import { CreateteamModelComponent } from "./page/model/createteam-model/createteam-model.component";
import { ModalContentComponent } from "./page/model/modal-content/modal-content.component";
// import { CopywriteComponent } from './widget/copywrite/copywrite.component';
import { BusinessEmployeeRequestsComponent } from "./components/bussinesspages/business-employee-requests/business-employee-requests.component";
import { BusinessFollowersRequestSentComponent } from "./components/bussinesspages/business-followers-request-sent/business-followers-request-sent.component";
import { BusinessFollowersRequestComponent } from "./components/bussinesspages/business-followers-request/business-followers-request.component";
import { MessageContactPipe } from "./pipe/message-contact.pipe";
import { CopywriteComponent } from "./widget/copywrite/copywrite.component";

import { IndexLayoutComponent } from "./page/layout/index-layout/index-layout.component";
import { NodataFoundComponent } from "./widget/nodata-found/nodata-found.component";
// import { NavigationHeaderComponent } from './components/navigation-header/navigation-header.component';

import { NgDynamicBreadcrumbModule } from "ng-dynamic-breadcrumb";
// import { CreateBusinessComponent } from './components/bussinesspages/create-business/create-business.component';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from "ngx-pagination";
import { TeamInviteSentComponent } from "./components/TeamPages/team-invite-sent/team-invite-sent.component";
import { CreateBusinessComponent } from "./components/bussinesspages/create-business/create-business.component";
import { PostCardComponent } from "./components/cards/post-card/post-card.component";
import { InviteMemberComponent } from './components/networkpages/invite-member/invite-member.component';
import { AddPipe, NotificationComponent, StripHtmlTagsPipe } from './components/notification/notification.component';
import { SuggestionsComponent, countProvider } from "./components/suggestions/suggestions.component";
import { NetworkComponent } from "./page/homepage/network/network.component";
import { SuggestionsMenuComponent } from "./page/layout/suggestions-menu/suggestions-menu.component";
import { PreviousRouteService } from "./services/PreviousRouteService";
import { BusinessbusinessComplteDataComponent } from "./widget/business-profile-complete/business-profile-complete.component";
import { CommunityProfileCompleteComponent } from "./widget/community-profile-complete/community-profile-complete.component";
// import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
// import { ScrollToTopComponent } from './widget/scroll-to-top/scroll-to-top.component';
import { PersonalProfileCommunityComponent } from './components/account-settings/personal-profile-community/personal-profile-community.component';
import { ProfileBannerComponent } from './components/account-settings/profile-banner/profile-banner.component';
import { BussinessPostComponent, GlobalCommunity } from "./components/bussiness-post/bussiness-post.component";
import { CandidatesPageComponent } from './components/candidate-module/candidates-page/candidates-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { FlagComponent } from './components/flag/flag.component';
import { JobProfileDetailComponent } from './components/job-module/job-profile-detail/job-profile-detail.component';
import { JobsComponent } from './components/job-module/job/job.component';
import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
import { JobPortfolioComponent } from './page/homepage/layout-jobs/job-portfolio/job-portfolio.component';
import { UserLayoutComponent } from './page/layout/user-layout/user-layout.component';
import { SearchPipe } from './pipe/SearchFilter/SearchPipe';
import { FilterPipe } from './pipe/SearchFilter/filter.pipe';
import { BToFollowComponent } from './widget/b-to-follow/b-to-follow.component';
import { CToFollowComponent } from './widget/c-to-follow/c-to-follow.component';
import { CardComponent } from './widget/card/card.component';
import { FeaturedJobsComponent } from './widget/featured-jobs/featured-jobs.component';
import { FollowerComponent } from './widget/follower/follower.component';
import { SocialMediaComponent } from './widget/social-media/social-media.component';
// import { JobAppliedCandidatesComponent } from './components/job-module/jobs-applied/job-applied-candidates.component';
import { BusinessJobsComponent } from './components/bussinesspages/business-jobs/business-jobs.component';
import { BusinessSecuritySettingsComponent } from './components/bussinesspages/business-security-settings/business-security-settings.component';
import { NavigationHeaderComponent } from './components/bussinesspages/navigation-header/navigation-header.component';
import { CandidateJobInviteComponent } from './components/candidate-module/candidate-job-invite/candidate-job-invite.component';
import { CandidateLikeComponent } from './components/candidate-module/candidate-like/candidate-like.component';
import { CandidateProfileSummaryComponent } from './components/candidate-module/candidate-profile-summary/candidate-profile-summary.component';
import { CandidateRequestsReceivedComponent } from './components/candidate-module/candidate-requests-received/candidate-requests-received.component';
import { CandidateViewedByComponent } from './components/candidate-module/candidate-viewed-by/candidate-viewed-by.component';
import { CandidatesProfileDetailsComponent } from './components/candidate-module/candidates-profile-details/candidates-profile-details.component';
import { CandidateCardComponent } from './components/cards/candidate-card/candidate-card.component';
import { CandidateJobBothCardComponent } from './components/cards/candidate-job-both-card/candidate-job-both-card.component';
import { JobCardComponent } from './components/cards/job-card/job-card.component';
import { CreditModelComponent } from './components/credit/credit-model/credit-model.component';
import { MembershipCreditComponent } from './components/credit/membership-credit/membership-credit.component';
import { ReferralsComponent } from './components/credit/referrals/referrals.component';
import { CandiatesInvitedComponent } from './components/job-module/candiates-invited/candiates-invited.component';
import { JobApplicantsComponent } from './components/job-module/job-applicants/job-applicants.component';
import { JobInvitedListComponent } from './components/job-module/job-invited-list/job-invited-list.component';
import { JobRequestsReceivedComponent } from './components/job-module/job-requests-received/job-requests-received.component';
import { JoblikedListComponent } from './components/job-module/jobliked-list/jobliked-list.component';
import { JobsAppliedcandidateComponent } from './components/job-module/jobs-applied/jobs-applied.component';
import { JobsViewedByComponent } from './components/job-module/jobs-viewed-by/jobs-viewed-by.component';
import { MessagemodelComponent } from './components/messagemodel/messagemodel.component';
import { UserClassificationComponent } from './components/user-classification/user-classification.component';
import { CandidatePortfolioComponent } from './page/homepage/candidate/candidate-portfolio/candidate-portfolio.component';
import { NewCandidateComponent } from './page/homepage/candidate/new-candidate/new-candidate.component';
import { NewJobComponent } from './page/homepage/layout-jobs/new-job/new-job.component';
import { CandidateActivityWidgetComponent } from './widget/candidate-activity-widget/candidate-activity-widget.component';
import { CandidateInviteComponent } from './widget/candidate-invite/candidate-invite.component';
import { CandidateYouMightBeIntrestedInComponent } from './widget/candidate-you-might-be-intrested-in/candidate-you-might-be-intrested-in.component';
import { FeaturedCandidateComponent } from './widget/featured-candidate/featured-candidate.component';
import { InvitesCerditsComponent } from './widget/invites-cerdits/invites-cerdits.component';
import { JobActivityWidgetComponent } from './widget/job-activity-widget/job-activity-widget.component';
import { JobInviteComponent } from './widget/job-invite/job-invite.component';
import { MessageWidgetComponent } from './widget/message-widget/message-widget.component';
import { ResumeRequestComponent } from './widget/resume-request/resume-request.component';
import { SuggestedCandidateComponent } from './widget/suggested-candidate/suggested-candidate.component';
import { SuggestedJobComponent } from './widget/suggested-job/suggested-job.component';
import { WelcomeWidgetComponent } from './widget/welcome-widget/welcome-widget.component';
// import { SearchjobComponent } from './components/Search-list-UI/searchjob/searchjob.component';
import { SeachtagsComponent } from './components/Search-list-UI/seachtags/seachtags.component';
import { SearchcandidateComponent } from './components/Search-list-UI/searchcandidate/searchcandidate.component';
import { SearchjobComponent } from './components/Search-list-UI/searchjob/searchjob.component';
import { ListingJobCardComponent } from './components/cards/listing-job-card/listing-job-card.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { BillingHistroyComponent } from './components/credit/billing-histroy/billing-histroy.component';
import { CancelComponent } from './components/credit/cancel/cancel.component';
import { CheckoutComponent } from './components/credit/checkout/checkout.component';
import { MembershipComponent } from './components/credit/membership/membership.component';
import { SuccessComponent } from './components/credit/success/success.component';
import { FaqComponent } from './components/faq/faq.component';
import { QueryDOMDirective } from './directives/QueryDOM.directive';
import { SpliterPipe } from './spliter.pipe';
//import { StreamRouter } from './services/streamRouter';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GtagModule } from 'angular-gtag';
import { environment } from 'src/environments/environment';
import { ModelPriceComponent } from './components/Price-subscritions/model-price/model-price.component';
import { PlanQuotaComponent } from './components/Price-subscritions/plan_quota/plan-quota/plan-quota.component';
import { PriceAddOnComponent } from './components/Price-subscritions/price-add-on/price-add-on.component';
import { PriceBackButtonenableComponent } from './components/Price-subscritions/price-back-buttonenable/price-back-buttonenable.component';
import { PriceSummaryComponent } from './components/Price-subscritions/price-summary/price-summary.component';
import { PriceTableComponent } from './components/Price-subscritions/price-table/price-table.component';
import { PricePlanService } from './components/Price-subscritions/priceplanService';
import { CandidateJobDetailsComponent } from './components/candidate-job-details/candidate-job-details.component';
import { CandidateFilterTemplateComponent } from './components/candidate-module/candidate-filter-template/candidate-filter-template.component';
import { CandidateVerticalFilterTemplateComponent } from './components/candidate-module/candidate-vertical-filter-template/candidate-vertical-filter-template.component';
import { JobInvitesFilterComponent } from './components/candidate-module/job-invites-filter/job-invites-filter.component';
import { JobsAppliedFilterComponent } from './components/candidate-module/jobs-applied-filter/jobs-applied-filter.component';
import { HelpModuleComponent } from './components/help-module/help-module.component';
import { HelpSearchComponent } from './components/help-search/help-search.component';
import { CandidateInvitedForJobFilterComponent } from './components/job-module/candidate-invited-for-job-filter/candidate-invited-for-job-filter.component';
import { JobApplicantFilterComponent } from './components/job-module/job-applicant-filter/job-applicant-filter.component';
import { JobFilterTemplateComponent } from './components/job-module/job-filter-template/job-filter-template.component';
import { JobFilterVerticalTemplateComponent } from './components/job-module/job-filter-vertical-template/job-filter-vertical-template.component';
import { ResumeRequestSentComponent } from './components/job-module/resume-request-sent/resume-request-sent.component';
import { PlanDowngradeModelComponent } from './components/plan-downgrade-model/plan-downgrade-model.component';
import { PlanUsageTrackingComponent } from './components/plan-usage-tracking/plan-usage-tracking.component';
import { HandlingValue } from './directives/HandlingValue';
import { WorkexperienceModalComponent } from './page/model/workexperience-modal/workexperience-modal.component';
 import { CandidateService } from './services/CandidateService';
import { DraggableCarouselDirective } from './services/DraggableCarouselDirective';
import { GigsumoService } from './services/gigsumoService';
import { JobService } from './services/job.service';
import { SummernoteValidatorDirective } from './services/summernote-validator.directive';
 import { ConnectionTemplateComponent } from './templates/connection-template/connection-template.component';
import { NotifierComponent } from './templates/notifier/notifier.component';
import { SvgTemplatesComponent } from './templates/svg-templates/svg-templates.component';
 import { JobInviteSentComponent } from './widget/job-invite-sent/job-invite-sent.component';
import { JobsAppliedByTheUserComponent } from './widget/jobs-appliedBy-The-user/jobs-appliedBy-The-user.component';
import { PriceAvilalbleComponent } from './widget/price-avilalble/price-avilalble.component';
import { CommonSkeletonComponent } from './skeleton/common-skeleton/common-skeleton.component';
import { TimesPipe } from './pipe/TimesPipe';
import { CommunicationService } from 'src/shared/services/CommunicationService';
import { TimelineComponent } from './templates/timeline/timeline.component';
import { JobsCandidatesSlideFilterComponent } from './components/jobs-candidates-slide-filter/jobs-candidates-slide-filter.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { JoyrideModule } from 'ngx-joyride';
import { TourService } from './services/TourService';
import { GlobalKeyboardHandlerComponent } from './services/GlobalKeyboardHandlerComponent';


const WIDGETS = [
  BToFollowComponent,
  ConnectionTemplateComponent,
  ModelPriceComponent,
  JobsAppliedByTheUserComponent,
  JobInviteSentComponent,
  BusinessToFollowComponent,
  CareonlineTodayComponent,
  CollegueYouMayKnowComponent,
  CommunitiesYouMayLikeComponent,
  CToFollowComponent,
  CommunityAdminComponent,
  ConnectionsComponent,
  FollowCareonlineComponent,
  HashtagsYouMayLikeComponent,
  InviteCollegueComponent,
  PeopleYouMayKnowComponent,
  ProfileCompletionComponent,
  SimilarBusinessNearYouComponent,
  SimilarCommunityComponent,
  TrendingCommunityComponent,
  TrendingHashtagComponent,
  TrendingPostComponent,
  VisitorsComponent,
  WidgetComponent,
  JobsYouMightBeIntrestedInComponent,
  CandidateYouMightBeIntrestedInComponent,
  CommonProfileInfoComponent,
  PromotedAdsComponent,
  SponsoredAdsComponent,
  PeopleInyourNetworkComponent,
  HashtagsToFollowComponent,
  EmptyWidgetComponent,
  NetHomepageComponent,
  NetAboutpageComponent,
  NetMemberspageComponent,
  NetNavbarpageComponent,
  PeopleWithSimilarNameComponent,
  NetHeaderpageComponent,
  CreateteamModelComponent,
  ModalContentComponent,
  CreditModelComponent,
  MessagemodelComponent,
  CopywriteComponent,
  BusinessbusinessComplteDataComponent,
  CommunityProfileCompleteComponent,
  ScrollToTopComponent,
  SocialMediaComponent,
  ResumeRequestSentComponent,
  FollowerComponent,
  CardComponent,
  WelcomeWidgetComponent,
  SuggestedJobComponent,
  SuggestedCandidateComponent,
  FeaturedCandidateComponent,
  FeaturedJobsComponent,
  ResumeRequestComponent,
  JobInviteComponent,
  CandidateInviteComponent,
  PriceAvilalbleComponent, PlanDowngradeModelComponent
];

const PAGE = [
  NewNavBarComponent,
  ConnectionComponent,
  BusinessListComponent,
  BusinessCardComponent,
  CommunityListComponent,
  PostComponent,
  CommunityComponent,

];

@NgModule({
    declarations: [
        AppComponent,
        JobsViewedByComponent,
        JobsAppliedByTheUserComponent,
        JobsAppliedcandidateComponent,
        FormDirective,
        LoginComponent,
        JobsComponent,
        IntersectionObserverDirective,
        SignUpComponent,
        PersonalProfileComponent,
        ProfileNavigationHeaderComponent,
        // NavBarComponent,
        FooterComponent,
        ForgotPasswordComponent,
        SignUpPage2Component,
        BusinessEmployeeRequestsComponent,
        HeaderComponent,
        MembersDirectoryComponent,
        LandingPageComponent,
        PersonalProfileEditComponent,
        LangdingPageNavBarComponent,
        UserDetailsComponent,
        PasswordStrengthComponent,
        SecuritySettingsComponent,
        AppAccessComponent,
        SocialMediaAccessComponent,
        MenuComponent,
        FogetPasswordAppUserComponent,
        PasswordResetConfirmedComponent,
        AdminPanelAlertComponent,
        NewFooterComponent,
        PinStrengthComponent,
        BusinessComponent,
        NavigationHeaderComponent,
        BusinessBannerComponent,
        BussinessPeoplepostComponent,
        BussinessPostComponent,
        CreateBusinessComponent,
        BusinessProfileComponent,
        BusinessFollowerComponent,
        BusinessEmployeeComponent,
        BusinessActiveInActiveComponent,
        BusinessAdminComponent,
        BusinessAnalyticsComponent,
        SearchListComponent,
        SearchMenuComponent,
        SearchListFilterComponent,
        PeopleComponent,
        PostComponent,
        CommunitiesComponent,
        BusinessUserComponent,
        CommunityComponent,
        CommunityCreateComponent,
        CommunityProfileComponent,
        CommunityBannerComponent,
        CommunityPageadminComponent,
        RequestComponent,
        NavheadercommunityComponent,
        AllUserListComponent,
        InvitesendComponent,
        MembersComponent,
        ManagepageComponent,
        InvitesendComponent,
        MessagepageComponent,
        MessageuniquePipe,
        MessagescrollDirective,
        QueryDOMDirective,
        BusinessCommunityComponent,
        MessageComponent,
        CommunityCardComponent,
        UserCardComponent,
        TruncatePipe,
        PageNotFoundComponent,
        //     BusinessCardComponent,
        //     CommonpageSearchComponent,
        BlockCopyPasteDirective,
        NoWhitespaceDirective,
        SummernoteValidatorDirective,
        DraggableCarouselDirective,
        //  BusinessSearchComponent,
        // BusinessEmployeeSearchComponent,
        // BusinessAdminSearchComponent,
        // BusinessCommunitySearchComponent,
        ProfileSuggestionsComponent,
        PageListComponent,
        DeactivateBusinessComponent,
        DeactivateCommunityComponent,
        NameFilterPipe,
        NamePipe,
        UserBadgeComponent,
        //TestComponent
        ...WIDGETS,
        ...PAGE,
        CommonWidgetComponent,
        PromotedAdsComponent,
        SponsoredAdsComponent,
        PeopleInyourNetworkComponent,
        HashtagsToFollowComponent,
        EmptyWidgetComponent,
        MyFilterPipe,
        IndexLayoutComponent,
        IndexComponent,
        ConnectionComponent,
        NetworkComponent,
        TeamComponent,
        HashtagComponent,
        BusinessListComponent,
        BusinessCardComponent,
        CommunityListComponent,
        PostListComponent,
        NewMessagePageComponent,
        NetworkCardComponent,
        ModalContentComponent,
        CreditModelComponent,
        MessagemodelComponent,
        NetHomepageComponent,
        NetAboutpageComponent,
        NetMemberspageComponent,
        NetNavbarpageComponent,
        NetHeaderpageComponent,
        NetNetworkComponent,
        TeamHomePageComponent,
        TeamAboutAsPageComponent,
        TeamHeaderBarComponent,
        TeamMembersPageComponent,
        TeamRoutePageComponent,
        TeamSideBarNavComponent,
        CreateteamModelComponent,
        TeamcardComponent,
        MessageContactPipe,
        BusinessFollowersRequestComponent,
        BusinessFollowersRequestSentComponent,
        NodataFoundComponent,
        SuggestionsMenuComponent,
        SuggestionsComponent,
        PeopleWithSimilarNameComponent,
        CommunityProfileCompleteComponent,
        PostCardComponent,
        TeamInviteSentComponent,
        InviteMemberComponent,
        NotificationComponent,
        CarouselComponent,
        SocialMediaComponent,
        FollowerComponent,
        FilterPipe,
        ProfileBannerComponent,
        PersonalProfileCommunityComponent,
        CardComponent,
        UserLayoutComponent, SearchPipe, BToFollowComponent, CToFollowComponent,
        CandidatesPageComponent,
        DndDirective,
        FeaturedJobsComponent,
        JobSubmitSkillfilterComponent,
        FlagComponent,
        JobPortfolioComponent,
        JobProfileDetailComponent,
        JobApplicantsComponent,
        CandidateActivityWidgetComponent,
        JobActivityWidgetComponent,
        UserClassificationComponent,
        CandidatePortfolioComponent,
        CandidatesProfileDetailsComponent,
        CandidateProfileSummaryComponent,
        WelcomeWidgetComponent,
        CandidateYouMightBeIntrestedInComponent,
        FeaturedCandidateComponent,
        SuggestedJobComponent,
        SuggestedCandidateComponent,
        CandidateViewedByComponent,
        CandidateRequestsReceivedComponent,
        JobRequestsReceivedComponent,
        MembershipCreditComponent,
        ReferralsComponent,
        InvitesCerditsComponent,
        OnlyNumber,
        CreditModelComponent,
        MessagemodelComponent,
        CandidateJobInviteComponent,
        JoblikedListComponent,
        JobInvitedListComponent,
        JobCardComponent,
        CandidateCardComponent,
        CandidateLikeComponent,
        NewJobComponent,
        NewCandidateComponent,
        BreadcrumbComponent,
        JobInviteComponent,
        ResumeRequestComponent,
        CandiatesInvitedComponent,
        CandidateJobBothCardComponent,
        CandidateInviteComponent,
        MessageWidgetComponent,
        BusinessJobsComponent,
        EncrytDecryptDirective,
        HandlingValue,
        BusinessSecuritySettingsComponent,
        SearchjobComponent,
        SearchcandidateComponent,
        SeachtagsComponent,
        SpliterPipe,
        AddPipe,
        StripHtmlTagsPipe,
        ListingJobCardComponent,
        FaqComponent,
        MembershipComponent,
        CheckoutComponent,
        SuccessComponent,
        CancelComponent,
        BillingHistroyComponent,
        ChangePasswordComponent,
        HelpModuleComponent,
        WorkexperienceModalComponent,
        PlanQuotaComponent,
        PlanFeatureComponent,
        PriceAddOnComponent,
        PriceAvilalbleComponent,
        PriceSummaryComponent,
        PriceTableComponent,
        ModelPriceComponent,
        ResumeRequestSentComponent,
        PlanUsageTrackingComponent,
        JobInviteSentComponent,
        JobFilterTemplateComponent,
        CandidateFilterTemplateComponent,
        CandidateJobDetailsComponent,
        SvgTemplatesComponent,
        JobApplicantFilterComponent,
        CandidateInvitedForJobFilterComponent,
        JobsAppliedFilterComponent,
        JobInvitesFilterComponent,
        ConnectionTemplateComponent,
        JobFilterVerticalTemplateComponent,
        CandidateVerticalFilterTemplateComponent,
        PlanDowngradeModelComponent,
        NotifierComponent,
        HelpSearchComponent,
        PriceBackButtonenableComponent,
        CommonSkeletonComponent,
        TimesPipe,
        TimelineComponent,
        JobsCandidatesSlideFilterComponent,
        GlobalKeyboardHandlerComponent
        // CopywriteComponent,
        // TeamComponent,
        // SchoolCollegeComponent,
        // NewlandingPageComponent,
        // NewbusinessComponent,
        // NewCommunityComponent,
        // ModalContentComponent,
        // HashTagComponent,
        // CommonNavComponent
    ],
    imports: [
        TagInputModule,
        PerfectScrollbarModule,
        InfiniteScrollModule,
        NgxSummernoteModule,
        // NgxExtendedPdfViewerModule,
        BrowserModule.withServerTransition({ appId: "serverApp" }),
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        MatIconModule,
        MatRadioModule,
        MatBadgeModule,
        MatRippleModule,
        MatInputModule,
        MatTooltipModule,
        // PdfViewerModule,
        MatMenuModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatDialogModule,
        RecaptchaModule,
        NgxSpinnerModule,
        AccordionModule.forRoot(),
        // NgAutoCompleteModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        CollapseModule.forRoot(),
        ModalModule.forRoot(),
        TypeaheadModule.forRoot(),
        // NgMultiSelectDropDownModule.forRoot(),
        AngularMultiSelectModule,
        FormsModule,
        ImageCropperModule,
        CropperModule,
        SelectDropDownModule,
        Ng2SearchPipeModule,
        NgSelectModule,
        AutocompleteLibModule,
        TooltipModule.forRoot(),
        // ShowHidePasswordModule
        CarouselModule.forRoot(),
        // NgMultiSelectDropDownModule.forRoot(),
        CountdownModule,
        NgCircleProgressModule.forRoot({
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#34495e",
            innerStrokeColor: "#ffffff",
            animationDuration: 300,
            showImage: true,
        }),
        DynamicModule.withComponents([...WIDGETS]),
        NgDynamicBreadcrumbModule,
        NgxPaginationModule, MatSelectModule, ConnectionServiceModule, MatTabsModule, MatSnackBarModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.name == 'QA' }),
        GtagModule.forRoot({ trackingId: 'G-KLZHM4F5RV', trackPageviews: true }),
        JoyrideModule.forRoot(),
        // StoreModule.forRoot({ app: appReducer }),
        CommonModule
        // BackButtonDisableModule.forRoot()
    ],
    providers: [
        DatePipe, TimesPipe,
        GlobalCommunity,TourService,
        PricePlanService,
        CandidateService,
        JobService,
        countProvider,
        GigsumoService,
        CommunicationService,
        // MatMenuTrigger,
        //  { provide:LocationStrategy,useClass:HashLocationStrategy},
        // { provide:LocationStrategy,useClass:PathLocationStrategy},
        // MatMenuTrigger,
        //  { provide:LocationStrategy,useClass:HashLocationStrategy},
        // { provide:LocationStrategy,useClass:PathLocationStrategy},
        { provide: CountdownGlobalConfig, useValue: undefined },
        // {
        //   provide: PERFECT_SCROLLBAR_CONFIG,
        //   useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        // },
        // {provide : "PLAN_USAGE" , useClass : PlanUsageTrackingComponent},
        dateFormat,
        CookieService,
        NewJobComponent,
        PreviousRouteService,
        DatePipe,
        BusinessListComponent,
        BusinessProfileComponent,
        BussinessPostComponent,
        BusinessEmployeeRequestsComponent,
        BusinessEmployeeComponent,
        BusinessBannerComponent,
        BToFollowComponent,
        HeaderComponent,
        BusinessAnalyticsComponent,
        CreateBusinessComponent,
        BusinessFollowerComponent,
        BusinessAdminComponent,
        CommunityProfileComponent,
        CandidateCardComponent,
        LangdingPageNavBarComponent,
        BusinessComponent,
        CommunityCreateComponent,
        BusinessCommunityComponent,
        NavheadercommunityComponent,
        CommunityComponent,
        NavigationHeaderComponent,
        InvitesendComponent,
        CacheService,
        MessageService,
        NetworkCardComponent,
        NetworkComponent,
        TeamcardComponent,
        TeamComponent,
        ModelPriceComponent,
        BusinessFollowersRequestComponent,
        SuggestionsComponent,
        UserBadgeComponent,
        BusinessFollowersRequestSentComponent,
        CreateteamModelComponent,
        CarouselComponent, CreditModelComponent,
        NewCandidateComponent, PlanDowngradeModelComponent,
        //WikipediaServiceCreditModelComponent
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AppHttpInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private cacheService: CacheService) {
    if (
      cacheService.getValue("userId") != undefined &&
      cacheService.getValue("userId") != null &&
      cacheService.getValue("userId") != ""
    ) {
      localStorage.setItem("userId", cacheService.getValue("userId"));
    }
    if (
      cacheService.getValue("userName") != undefined &&
      cacheService.getValue("userName") != null &&
      cacheService.getValue("userName") != ""
    ) {
      localStorage.setItem("userName", cacheService.getValue("userName"));
    }
  }
}
// imports: [BrowserModule, FormsModule, HttpClientModule, NgbModule],
// declarations: [NgbdTypeaheadHttp],
// exports: [NgbdTypeaheadHttp],
// bootstrap: [NgbdTypeaheadHttp]
// })
