export type USER_TYPE = "RECRUITER" | "BENCH_RECRUITER"
  | "FREELANCE_RECRUITER" | "MANAGEMENT_TALENT_ACQUISITION" | "JOB_SEEKER";

  export type BUSINESS_STATUS_CODE = "00000" | "10001" | "10002" | "10000" | "10003";


export class GigsumoConstants {

  static readonly ACTIVE = "ACTIVE";
  static readonly INACTIVE = "INACTIVE";
  static readonly DRAFTED = "DRAFTED";
  static readonly INACTIVE_DUE_TO_LOW_CREDITS = "INACTIVE_DUE_TO_LOW_CREDITS";
  static readonly AWAITING_HOST = "AWAITING HOST";
  static readonly DEACTIVATED = "DEACTIVATED";
  static readonly BLOCKED = "BLOCKED";
  static readonly PENDING = "PENDING";
  static readonly OPEN = "Open";
  static readonly VERIFIED = "VERIFIED";
  static readonly NOT_VERIFIED = "NOT VERIFIED";
  static readonly ON_HOLD = "ON HOLD";
  static readonly FILLED = "FILLED";
  static readonly CLOSED = "CLOSED";
  static readonly DIRECT_HIRE = "Direct Hire";
  static readonly PLAN_DOWNGRADE = "DOWNGRADE";
  static readonly PLAN_PROMOTIONAL = "PROMOTIONAL";

  static readonly SUCESSCODE = "00000";
  static readonly FAILURECODE = "99999";
  static readonly NO_ADMIN_BUSINESS_FOUND = "10000";
  static readonly CHANGING_CURRENORG = "99998";
  static readonly CURRENTORGANIZATION_NEED = "99996";
  static readonly SUPERADMIN_BUSINESS_NO_MEMBERS = "10001";
  static readonly SUPERADMIN_BUSINESS_HAS_MEMBERS = "10002";
  static readonly NO_BUSINESS = "10003";

  static readonly FREE_PLAN_JOB_CANDIDATE_COUNT = 5;
  static readonly FREE_PLAN_TEAM_COUNT = 1;
  static readonly FREE_PLAN_NETWORK_COUNT = 1;


  //user roles

  static readonly JOB_SEEKER = "JOB_SEEKER";
  static readonly RECRUITER = "RECRUITER";
  static readonly BENCH_RECRUITER = "BENCH_RECRUITER";
  static readonly FREELANCE_RECRUITER = "FREELANCE_RECRUITER";
  static readonly MANAGEMENT_TALENT_ACQUISITION = "MANAGEMENT_TALENT_ACQUISITION";
  static readonly STUDENT = "STUDENT";

  //Job appy status

  static readonly SHORTLISTED = "SHORTLISTED";
  static readonly REJECTED = "REJECTED";
  static readonly INTERVIEW_SCHEDULED = "INTERVIEW SCHEDULED";
  static readonly INTERVIEW_REJECTED = "INTERVIEW REJECTED";
  static readonly SELECTED = "SELECTED";
  static readonly OFFERED = "OFFERED";
  static readonly PREONBOARDED = "PREONBOARDED";
  static readonly ONBOARDED = "ONBOARDED";
  static readonly OFFER_WITHDRAWN = "OFFER WITHDRAWN";
  static readonly OFFER_DECLINED = "OFFER DECLINED";



  static readonly JOB_LIST_STATUS = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'INTERVIEW SCHEDULED', 'REJECT', 'SELECTED', 'OFFERED', 'PREONBOARDED', 'ONBOARDED', 'OFFER WITHDRAWN', 'OFFER DECLINED', 'WITHDRAW', 'ACCEPT', 'OFFER ACCEPTED']
  static readonly Days = [7, 15, 30];
  static readonly Daya_LABEL = ["Last 7 Days", "Last 15 Days", "Last 30 Days"];
  // static readonly CANDIDATE_SATATUS_FOR_FILTER = ['INITIATED', 'ACCEPTED', 'REJECTED'];
  // static readonly CANDIDATE_SATATUS_FOR_FILTER_INVITE = ['INITIATED', 'ACCEPTED', 'REJECTED'];
  static readonly CANDIDATE_SATATUS_FOR_FILTER = ['INITIATED', 'ACCEPTED', 'REJECTED', 'APPLIED', 'SHORTLISTED', 'INTERVIEW SCHEDULED', 'REJECT', 'SELECTED', 'OFFERED', 'PREONBOARDED', 'ONBOARDED', 'OFFER WITHDRAWN', 'OFFER DECLINED', 'WITHDRAW', 'ACCEPT', 'OFFER ACCEPTED'];
  static readonly CANDIDATE_SATATUS_FOR_FILTER_INVITE = ['INITIATED', 'ACCEPTED', 'APPLIED', 'SHORTLISTED', 'REJECTED', 'INTERVIEW SCHEDULED', 'REJECT', 'SELECTED', 'OFFERED', 'PREONBOARDED', 'ONBOARDED', 'OFFER WITHDRAWN', 'OFFER DECLINED', 'WITHDRAW', 'ACCEPT', 'OFFER ACCEPTED'];

  static readonly FILTER_TYPE = ['JOB_APPLICATION', 'CANDIDATE_INVITATION'];
  static readonly FILTER_TYPE_LABEL = ['Job Applicants', 'Candidates Invited'];

  // Default job invites for candidate module
  static readonly JOB_INVITES_DEFAULT_STAGES = ["INITIATED", "ACCEPTED", "REJECTED"];
  static readonly JOB_APPLIED_DEFAULT_STAGES = ["JOB-APPLIED", "CANDIDATE-SHORTLISTED", "INTERVIEW-SCHEDULED", "OFFERED", "ONBOARDED"];


  static readonly INCLUDED_CONVERSATIONS = "INCLUDED_CONVERSATIONS";
  static readonly RESUME_VIEWS = "RESUME_VIEWS";
  static readonly ACTIVE_INTERACTIONS = "ACTIVE_INTERACTIONS";
  static readonly TEAM_WORKSPACES = "TEAM_WORKSPACES";
  static readonly JOB_CANDIDATE_POSTINGS = "JOB_CANDIDATE_POSTINGS";
  static readonly PERSONAL_NETWORKS = "PERSONAL_NETWORKS";
  static readonly UPGRADE_JOBS = "UPGRADE_JOBS";
  static readonly UPGRADE_CANDIDATES = "UPGRADE_CANDIDATES";



  static readonly ACCEPTED = "ACCEPTED";
  static readonly APPLIED = "APPLIED";
  static readonly INITIATED = "INITIATED";
  static readonly INTETEREST_SHOWN = "INTETEREST_SHOWN";


  /** API */
  static readonly findUserInvites = "home/findUserInvites";

  /** Team Status */
  static readonly TEAM_DEACTIVATED = "TEAM_DEACTIVATED";
  static readonly LEFT_TEAM = "LEFT_TEAM";
  static readonly LEFT_TEAM_BY_ORG_CHANGE = "LEFT_TEAM_BY_ORG_CHANGE";
  static readonly TEAM_INACTIVE = "TEAM_INACTIVE";

  /** Experience Levels*/
  static readonly EXPERIENCE_ANY = "Any (Years)";
  static readonly EXPERIENCE_JUNIOR = "1-3 Years (Junior)";
  static readonly EXPERIENCE_MID_LEVEL = "4-6 Years (Mid-level)";
  static readonly EXPERIENCE_SENIOR = "6-10 Years (Senior)";
  static readonly EXPERIENCE_ARCHITECT = "10+ Years (Principal/Architect)";

   /** Posted days range*/
   static readonly POSTED_ANY = "Any (Days)";
   static readonly POSTED_TODAY= "Today";
   static readonly POSTED_LAST_7_DAYS = "Last 7 days";
   static readonly POSTED_LAST_14_DAYS = "Last 14 days";
   static readonly POSTED_LAST_30_DAYS = "Last 30 days";

   /** Posted by list */
   static readonly POSTED_BY_ANY = null
  //  static readonly POSTED_BY_ANY = "Any"
   static readonly POSTED_BY_VENDOR_OR_STAFFING_AGENCY = "Vendor/ Staffing Agency"
   static readonly POSTED_BY_EMPLOYER = "Employer"
   static readonly POSTED_BY_SYSTEMS_INTEGRATOR = "Systems Integrator"
   static readonly POSTED_BY_PRIME_VENDOR = "Prime Vendor"
}
