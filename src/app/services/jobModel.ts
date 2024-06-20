import { candidateModel } from "./candidateModel";
import { UserModel } from "./userModel";


interface JobApplyLog {
  userId: string;
  date: Date;
  appliedUserId: string;
  status: string;
  targetRate: number;
  payType: string;
}

interface UserAndTime {
  userId: string;
  date: Date;
}
export type profileinput = {
  currentdate: any;
  featureddate: any;
  availablecredits: any;
  actualcredits: any;
  utilizedcredits: any;
  promotional: any
}

export type JobCandidate = {
  jobDetails: JobModel;
  candidateEntity: candidateModel;
}


export type JobModel = {
  targetRateTo: string;
  call: boolean;
  jobId: string;
  selectedCandidateId: string;
  jobReferenceId: string;
  parentType: string;
  jobPostedBehalfOf: string;
  totalpoints: number | any,
  isSelected: boolean | any,
  jobPostedBy: string;
  postedByUserName: string;
  jobClassification: string;
  candidatesApplied: Array<string>
  jobTitle: string;
  viewedBy: Array<UserAndTime>;
  primarySkills: Array<string>;
  secondarySkills: Array<string>;
  interestShownLogs: Array<JobApplyLog>;
  interestShownCount: number;
  experienceFrom: number;
  experienceTo: number;
  targetRate: number;
  payType: string;
  jobDescription: string;
  clientType: string;
  showClientType: boolean;
  isFeatured: boolean;
  clientName: string;
  showClientName;
  city: string;
  lowerCaseCity: string;
  state: string;
  lowerCaseState: string;
  country: string;
  lowerCaseCountry: string;
  zipCode: string;
  duration: number;
  durationType: string;
  remoteWork: boolean;
  relocationRequired: boolean;
  securityClearance: boolean;
  workFromHome: boolean;
  appliedBy: Array<JobApplyLog>;
  likedBy: Array<UserAndTime>;
  viewedByCount: number;
  statusUpdatedOn: Date;
  featuredUpdatedOn: Date;
  appliedToday: number;
  likesCount: number;
  appliedCount: number;
  status: string;
  postedOn: Date;
  createdOn: Date;
  updatedOn: Date;
  timeToPay: Date;
  jobIdForGlobalSearch: string;
  isLiked: boolean;
  isApplied: boolean;
  isViewed: boolean;
  isResumeRequested: boolean;
  isInterestShown: boolean;
  isRequestedResume: boolean;
  streamAction: string;
  actionBy: string;
  searchAfterKey: Object[];
  limit: number;
  pageNumber: number;
  user: UserModel;
  organisationId: string;
  userId: string;
  candidateId: string;
  searchText: string;
  myJobs: string;
  currentStatus: string;
  findAll: boolean;
  likeStatus: string;
  inviteStatus: string;
  nonSeenMessageCount: number;
  newChatsCount: number;
  chatHistoryCount: number;
  businessId: string;
  jobPostedByUserType: string;
  jobStatusToCandidate: string;
  candidateStatusToJob: string;
  activities: Array<JobApplyLog>;
  points: number;
  consumptionType: string;
  availability: boolean;
  connectionStatus: string;
  pageName?: string;
  targetRateFrom: string;
  isTitleMatching: boolean;
  isPrimarySKillsMatching: boolean;
  isSecondarySKillsMatching: boolean;
  isCityMatching: boolean;
  isStateMatching: boolean;
  isCountryMatching: boolean;
  isExperinenceMatching: boolean;
  isRelocationMatching: boolean;
  isRemoteWorkMatching: boolean;
  issecurityClearanceMatching: boolean;
  isWorkFromHomeMatching: boolean;
  postedByUserNameMatching: boolean;
  jobIdMatching: boolean;
  matchingPrimarySkils: Array<string>;
  matchingSecondarySkils: Array<string>;
  matchingTitles: Array<string>;
  effectiveDate: Date | string;
  effectiveFor: number;
  effectiveUntil: Date | string;
}


