import { ValidateTokenGuard } from './validate-token.guard';
// import { Breadcrumb } from 'angular-crumbs';

import { NewCandidateComponent } from './page/homepage/candidate/new-candidate/new-candidate.component';
import { CandidateLikeComponent } from './components/candidate-module/candidate-like/candidate-like.component';
import { JoblikedListComponent } from './components/job-module/jobliked-list/jobliked-list.component';
import { CandidateJobInviteComponent } from './components/candidate-module/candidate-job-invite/candidate-job-invite.component';
import { CandidateViewedByComponent } from './components/candidate-module/candidate-viewed-by/candidate-viewed-by.component';
import { CandidateProfileSummaryComponent } from './components/candidate-module/candidate-profile-summary/candidate-profile-summary.component';
import { CandidatesProfileDetailsComponent } from './components/candidate-module/candidates-profile-details/candidates-profile-details.component';
import { CandidatePortfolioComponent } from './page/homepage/candidate/candidate-portfolio/candidate-portfolio.component';
import { UserClassificationComponent } from './components/user-classification/user-classification.component';
import { JobApplicantsComponent } from './components/job-module/job-applicants/job-applicants.component';
import { JobProfileDetailComponent } from './components/job-module/job-profile-detail/job-profile-detail.component';
import { JobPortfolioComponent } from './page/homepage/layout-jobs/job-portfolio/job-portfolio.component';
import { PeopleYouMayKnowComponent } from "./widget/people-you-may-know/people-you-may-know.component";
import { NetMemberspageComponent } from "./components/networkpages/net-memberspage/net-memberspage.component";
import { PostListComponent } from "./page/homepage/post-list/post-list.component";
import { AfterLoginGuard, AuthGuard } from "./guard";
import { PasswordResetConfirmedComponent } from "./components/password-reset-confirmed/password-reset-confirmed.component";
import { FogetPasswordAppUserComponent } from "./components/foget-password-app-user/foget-password-app-user.component";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { MembersDirectoryComponent } from "./components/members-directory/members-directory.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { SignUpPage2Component } from "./components/sign-up-page2/sign-up-page2.component";
import { UserDetailsComponent } from "./components/user-details/user-details.component";
import { CommunityCreateComponent } from "./components/communitypages/community-create/community-create.component";
import { CommunityComponent } from "./components/communitypages/community/community.component";
import { BusinessComponent } from "./components/bussinesspages/business/business.component";
import { BusinessProfileComponent } from "./components/bussinesspages/business-profile/business-profile.component";
import { BusinessAdminComponent } from "./components/bussinesspages/business-admin/business-admin.component";
import { BusinessAnalyticsComponent } from "./components/bussinesspages/business-analytics/business-analytics.component";
import { SearchListComponent } from "./components/search-list/search-list.component";
import { CreateBusinessComponent } from "./components/bussinesspages/create-business/create-business.component";
import { environment } from "../environments/environment";
import { MessagepageComponent } from "./components/messagepage/messagepage.component";
import { PageNotFoundComponent } from "./errorPage/page-not-found/page-not-found.component";
import { PersonalProfileComponent } from "./components/account-settings/personal-profile/personal-profile.component";
import { WidgetComponent } from "./widget";
import { IndexLayoutComponent } from "./page/layout/index-layout/index-layout.component";
import { ConnectionComponent } from "./page/homepage/connection/connection.component";
import { BusinessListComponent } from "./page/homepage/business-list/business-list.component";
import { TeamComponent } from "./page/homepage/team/team.component";
import { CommunityListComponent } from "./page/homepage/community-list/community-list.component";
import { NewMessagePageComponent } from "./components/new-message-page/new-message-page.component";
import { NetNetworkComponent } from "./components/networkpages/net-network/net-network.component";
import { NetHomepageComponent } from "./components/networkpages/net-homepage/net-homepage.component";
import { NetAboutpageComponent } from "./components/networkpages/net-aboutpage/net-aboutpage.component";
import { TeamRoutePageComponent } from "./components/TeamPages/team-route-page/team-route-page.component";
import { TeamHomePageComponent } from "./components/TeamPages/team-home-page/team-home-page.component";
import { TeamAboutAsPageComponent } from "./components/TeamPages/team-about-as-page/team-about-as-page.component";
import { TeamMembersPageComponent } from "./components/TeamPages/team-members-page/team-members-page.component";
import { SuggestionsMenuComponent } from "./page/layout/suggestions-menu/suggestions-menu.component";
import { SuggestionsComponent } from "./components/suggestions/suggestions.component";
import { TeamInviteSentComponent } from "./components/TeamPages/team-invite-sent/team-invite-sent.component";
import { NetworkComponent } from "./page/homepage/network/network.component";
import { InviteMemberComponent } from "./components/networkpages/invite-member/invite-member.component";
import { NotificationComponent } from "./components/notification/notification.component";
import { UserLayoutComponent } from "./page/layout/user-layout/user-layout.component";
 import { JobsViewedByComponent } from './components/job-module/jobs-viewed-by/jobs-viewed-by.component';
import { JobRequestsReceivedComponent } from './components/job-module/job-requests-received/job-requests-received.component';
import { CandidateRequestsReceivedComponent } from './components/candidate-module/candidate-requests-received/candidate-requests-received.component';
import { JobInvitedListComponent } from './components/job-module/job-invited-list/job-invited-list.component';
import { NewJobComponent } from './page/homepage/layout-jobs/new-job/new-job.component';
import { CandiatesInvitedComponent } from './components/job-module/candiates-invited/candiates-invited.component';
import { SearchcandidateComponent } from './components/Search-list-UI/searchcandidate/searchcandidate.component';
import { SearchjobComponent } from './components/Search-list-UI/searchjob/searchjob.component';
import { SeachtagsComponent } from './components/Search-list-UI/seachtags/seachtags.component';
import { FeaturedJobsComponent } from './widget/featured-jobs/featured-jobs.component';
import { FaqComponent } from './components/faq/faq.component';
import { SuccessComponent } from './components/credit/success/success.component';
import { CancelComponent } from './components/credit/cancel/cancel.component';
import { CheckoutComponent } from './components/credit/checkout/checkout.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { HelpModuleComponent } from './components/help-module/help-module.component';
import { PlanQuotaComponent } from './components/Price-subscritions/plan_quota/plan-quota/plan-quota.component';
import { PlanFeatureComponent } from './components/Price-subscritions/plan_feature/plan-feature/plan-feature.component';
import { PriceAddOnComponent } from './components/Price-subscritions/price-add-on/price-add-on.component';
import { PriceTableComponent } from './components/Price-subscritions/price-table/price-table.component';
import { PlanUsageTrackingComponent } from './components/plan-usage-tracking/plan-usage-tracking.component';
import { HelpSearchComponent } from './components/help-search/help-search.component';
import { PriceBackButtonenableComponent } from './components/Price-subscritions/price-back-buttonenable/price-back-buttonenable.component';


const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "widget", component: WidgetComponent },
  { path: "invite", component: SignUpComponent },
  { path: "changePassword", component: ChangePasswordComponent },
  {
    path: "",
    canActivateChild: [AfterLoginGuard],
    children: [
      { path: "login", component: LoginComponent },
      { path: "signUp", component: SignUpComponent },
      { path: "Forgotpassword", component: ForgotPasswordComponent },
      { path: "setPassword", component: SignUpPage2Component, resolve: [ValidateTokenGuard] },
      { path: "invite", component: SignUpComponent },
      { path: "SetNewPassword", component: FogetPasswordAppUserComponent },
      { path: "PasswordResetConfired", component: PasswordResetConfirmedComponent }
    ],
  },
  {
    path: "",
    component: UserLayoutComponent,
    canActivateChild: [AuthGuard],
    data: {
      breadcrumb: [
        {
          label: "Home",
          url: "/landingPage"
        }
      ]
    },
    children: [
      //Landingpage
      {
        path: "landingPage",
        component: IndexLayoutComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            }
          ]
        },
        children: [
          {
            path: "",
            component: LandingPageComponent,
          },
          {
            path: "connection",
            component: ConnectionComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Connection",
                  url: "/connection"
                }
              ]
            }
          },


          {
            path: "network",
            component: NetworkComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Network",
                  url: "/network"
                }
              ]
            }
          },
          {
            path: "team",
            component: TeamComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Team",
                  url: "/team"
                }
              ]
            }
          },

          {
            path: "business",
            component: BusinessListComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Business",
                  url: "/business"
                }
              ]
            }
          },
          {
            path: "communityList",
            component: CommunityListComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "CommunityList",
                  url: "/communitylist"
                }
              ]
            }
          },
          {
            path: "post",
            component: PostListComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Post",
                  url: "/post"
                }
              ]
            }
          }
        ],
      },
      { path: "faq", component: FaqComponent },
      { path: "help", component: HelpModuleComponent },
      { path: "helpSearch", component: HelpSearchComponent },
      { path: "planUsageTracking/:data", component: PlanUsageTrackingComponent },
      {
        path: "success/:Id",
        component: SuccessComponent,
      },

      {
        path: "cancel",
        component: CancelComponent
      },

      {
        path: "checkout",
        component: CheckoutComponent

      },

      //New candidates
      {
        path: "newcandidates",
        component: NewCandidateComponent,
        // children: [
        //   {
        //     path: "profileSummary",
        //     component: CandidateProfileSummaryComponent
        //   },
        //   {
        //     path: "candidateDetails",
        //     component: CandidatesProfileDetailsComponent
        //   },
        //   {
        //     path: "jobsApplied",
        //     component: JobsAppliedComponent,
        //     data: { childRouteChanged: new Date() },
        //   },
        //   {
        //     path: "joba",
        //     component: JobsAppliedComponent
        //   },
        //   {
        //     path: "views-received",
        //     component: CandidateViewedByComponent
        //   },
        //   {
        //     path: "Clike-like",
            // component: CandidateLikeComponent
        //   },
        //   {
        //     path: "requests-received",
        //     component: CandidateRequestsReceivedComponent
        //   },
        //   {
        //     path: "cInvited",
        //     component: CandidateJobInviteComponent,
        //     data: { childRouteChanged: new Date() },
        //   },
        //   {
        //     path: "jinv",
        //     component: CandidateJobInviteComponent,
        //   }
        // ]
      },

      //new jobs
      {
        path: "newjobs",
        component: NewJobComponent,
        // children: [
        //   {
        //     path: "job-details",
        //     component: JobProfileDetailComponent,
        //   },
        //   {
        //     path: "job-applicants",
        //     component: JobApplicantsComponent,
        //     data: { childRouteChanged: new Date() },
        //   },
        //   {
        //     path: "jobs-viewed",
            // component: JobsViewedByComponent,
        //   },
        //   {
        //     path: "job-requests-received",
        //     component: JobRequestsReceivedComponent
        //   },
        //   {
        //     path: "jobs-liked",
            // component: JoblikedListComponent,
        //   },
        //   {
        //     path: "jobs-invitedlist",
        //     component: JobInvitedListComponent,
        //   },
        //   {
        //     path: "candidates-invited",
            // component: CandiatesInvitedComponent,
        //     data: { childRouteChanged: new Date() },
        //   },
        //   {
        //     path: "candi-filter",
        //     component: CandiatesInvitedComponent
        //   }
        // ]
      },

      // NetWorkPage
      {
        path: "networkPage",
        component: NetNetworkComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Network",
              url: "/network"
            },
            {
              label: "NetworkPage",
              url: "/networkPage"
            }
          ]
        },
        children: [
          {
            path: "home",
            component: NetHomepageComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Network",
                  url: "/network"
                },
                {
                  label: "NetworkPage",
                  url: "/networkPage"
                },
                {
                  label: "HomePage",
                  url: ""
                }
              ]
            },
          },
          {
            path: "aboutus",
            component: NetAboutpageComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Network",
                  url: "/network"
                },
                {
                  label: "NetworkPage",
                  url: "/networkPage"
                },
                {
                  label: "About",
                  url: ""
                }
              ]
            },
          },
          {
            path: "members",
            component: NetMemberspageComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Network",
                  url: "/network"
                },
                {
                  label: "NetworkPage",
                  url: "/networkPage"
                },
                {
                  label: "Members",
                  url: ""
                }
              ]
            },
          },
          {
            path: "inviteSent",
            component: InviteMemberComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Network",
                  url: "/network"
                },
                {
                  label: "NetworkPage",
                  url: "/networkPage"
                },
                {
                  label: "InviteSent",
                  url: ""
                }
              ]
            },
          },
        ],
      },
      //TeamPage
      {
        path: "teamPage",
        component: TeamRoutePageComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Team",
              url: "/team"
            },
            {
              label: "TeamPage",
              url: "/teamPage"
            },
          ]
        },
        children: [
          {
            path: "home",
            component: TeamHomePageComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Team",
                  url: "/team"
                },
                {
                  label: "TeamPage",
                  url: "/teamPage"
                },
                {
                  label: "HomePage",
                  url: ""
                }
              ]
            },
          },
          {
            path: "aboutus",
            component: TeamAboutAsPageComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Team",
                  url: "/team"
                },
                {
                  label: "TeamPage",
                  url: "/teamPage"
                },
                {
                  label: "About",
                  url: ""
                }
              ]
            },
          },
          {
            path: "members",
            component: TeamMembersPageComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Team",
                  url: "/team"
                },
                {
                  label: "TeamPage",
                  url: "/teamPage"
                },
                {
                  label: "Members",
                  url: ""
                }
              ]
            },
          },
          {
            path: "inviteSent",
            component: TeamInviteSentComponent,
            data: {
              breadcrumb: [
                {
                  label: "Home",
                  url: "/landingPage"
                },
                {
                  label: "Team",
                  url: "/team"
                },
                {
                  label: "TeamPage",
                  url: "/teamPage"
                },
                {
                  label: "InviteSent",
                  url: ""
                }
              ]
            },
          },
        ],
      },
      // { path: "userDetail", component: UserDetailsComponent },
      {
        path: "userClassification", component: UserClassificationComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "UserClassification",
              url: ""
            }
          ]
        }
      },
      {
        path: "memberDirectory", component: MembersDirectoryComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "MemberDirectory",
              url: ""
            }
          ]
        }
      },
      {
        path: "suggestions", component: SuggestionsMenuComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Suggestions",
              url: ""
            }
          ]
        }
      },
      // { path: "user", component: UserDetailsComponent },
      {
        path: "personalProfile", component: PersonalProfileComponent,
      },
      // {path: 'personalProfile', component : PersonalProfileEditComponent},
      // { path: "socialAccess", component: PersonalProfileComponent },
      // { path: "appAccess", component: PersonalProfileComponent },
      // { path: "securitySettings", component: PersonalProfileComponent },
      { path: "PasswordResetConfired", component: PasswordResetConfirmedComponent, },
      {
        path: "createBusiness", component: CreateBusinessComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "CreateBusiness",
              url: ""
            }
          ]
        }
      },
      {
        path: "business", component: BusinessComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Business",
              url: ""
            }
          ]
        }
      },
      {
        path: "aboutUs", component: BusinessProfileComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Business",
              url: ""
            },
            {
              label: "About",
              url: ""
            }
          ]
        }
      },
      {
        path: "admin", component: BusinessAdminComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Business",
              url: ""
            },
            {
              label: "Admin",
              url: ""
            }
          ]
        }
      },
      {
        path: "businessAnalytics", component: BusinessAnalyticsComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Business",
              url: ""
            },
            {
              label: "BusinessAnalytics",
              url: ""
            }
          ]
        }
      },
      {
        path: "Search-list", component: SearchListComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Business",
              url: ""
            },
            {
              label: "Search-List",
              url: ""
            }
          ]
        }
      },
      {
        path: "createCommunity", component: CommunityCreateComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "CreateCommunity",
              url: "/createCommunity"
            },
          ]
        }
      },
      {
        path: "community", component: CommunityComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Community",
              url: "/"
            },
          ]
        }
      },
      { path: "featuredJob", component: FeaturedJobsComponent },
      //{ path: 'message', component: MessagepageComponent },
      { path: "message", component: NewMessagePageComponent },
      { path: "notification", component: NotificationComponent },
      { path: "clear", component: LandingPageComponent },
      { path: "searchjob", component: SearchjobComponent },
      { path: "seachcandidate", component: SearchcandidateComponent },
      { path: "Seachtags", component: SeachtagsComponent },
      {
        path: "message", component: NewMessagePageComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Message",
              url: "/message"
            },
          ]
        }
      },
      {
        path: "notification", component: NotificationComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
            {
              label: "Notification",
              url: "/"
            },
          ]
        }
      },
      {
        path: "clear", component: LandingPageComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
          ]
        }
      },
      {
        path: "searchjob", component: SearchjobComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
          ]
        }
      },
      {
        path: "seachcandidate", component: SearchcandidateComponent,
        data: {
          breadcrumb: [
            {
              label: "Home",
              url: "/landingPage"
            },
          ]
        }
      },
      //  subscritions
      { path: "plan-quota", component: PlanQuotaComponent },
      { path: "price-table", component: PriceTableComponent },
      { path: "price-seleted", component: PriceBackButtonenableComponent },
      { path: "plan-feature", component: PlanFeatureComponent },
      { path: "plan-addon", component: PriceAddOnComponent },
      { path: "plan-addon", component: PriceAddOnComponent },
    ],
  },

  // Health care Business organization
  { path: "404", component: PageNotFoundComponent },
  { path: "**", redirectTo: "/404", pathMatch: "full" },

];



@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule],
})
export class AppRoutingModule {
  static components = [
  ]
}
