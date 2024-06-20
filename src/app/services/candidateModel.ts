import { UserModel } from './userModel';
interface UserAndTime {
  userId: string;
  date: Date;
}

interface ResumeRequestLog {
  jobId: string;
  date: Date;
  requestedBy: string;
  status: string;
  fileId: string;
  jobTitle: string;
  userId: string;
}

interface JobsApplied {
  jobId: string,
  appliedUserId: string,
  date: string,
  payType: string,
  primaryResume: boolean,
  resumeFileId: string,
  status: string,
  targetRate: number,
  userId: string,
}
interface CandidateWorkExperience {
  expId: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  badge: string;
  title: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  street: string;
  organisationName: string;
  businessLogo: string;
  currentOrganization: boolean;
  previousUserTpe: string;
  clientType: string;
  candidateId: string;
  streamAction: string;
}

interface CandidateEducationDetails {
  eduId: string;
  schoolName: string;
  degree: string;
  speciality: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  currentlyPursued: boolean;
  institutionId: string;
  showThisOnProfile: boolean;
  candidateId: string;
  streamAction: string;
}

interface CandidateCertifications {
  certificateId: string;
  certificationName: string;
  certificationOrganization: string;
  certificationLicenseNo: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  candidateId: string;
  certificationNameId: string;
  streamAction: string;
}

interface Media {
  fileId: string;
  postId: string;
  fileName: string;
  type: string;
  mimeType: string;
  status: string;
  size: number;
  url: string;
  orderBy: number;
  isDefault: boolean;
  createdOn: Date;
  action: string;
}

export type candidateModel = {
  tab: string;
  responseMessage: string;
  candidateId: string;
  call: boolean;
  candidateReferenceId: string;
  firstName: string;
  totalpoints: number,
  isSelected: boolean | any,
  remove: boolean | any,
  lastName: string;
  email: string;
  candidateEmailId: string;
  jobTitle: string;
  photo: string;
  availableIn: string;
  totalExperience: string;
  targetRate: number;
  payType: string;
  description: string;
  phone: string;
  city: string;
  lowerCaseCity: string;
  state: string;
  erCaseState: string;
  country: string;
  lowerCaseCountry: string;
  zipCode: string;
  remoteWork: boolean;
  payTypefortheJob: string;
  targetFortheJob: number;
  relocationRequired: boolean;
  securityClearance: boolean;
  workFromHome: boolean;
  otherPrefered: boolean;
  createCandidateOnPlatform: boolean;
  candidateStatus: boolean;
  resumes: Array<Media>;
  status: string;
  otherPreferedStates: Array<string>;
  availability: boolean,
  connectionStatus: string,
  targetRateFrom: string,
  targetRateTo: string,
  engagementType: string;
  primarySkills: Array<string>;
  secondarySkills: Array<string>;
  viewedBy: Array<UserAndTime>;
  resumeRequestLogs: Array<ResumeRequestLog>;
  interestShownLogs: Array<ResumeRequestLog>;
  jobsApplied: Array<JobsApplied>;
  likedBy: Array<UserAndTime>;
  viewedByCount: number;
  appliedToday: number;
  resumeRequestCount: number;
  interestShownCount: number;
  createdBy: string;
  createdByUserName: string;
  likesCount: number;
  workAuthorization: string;
  resumeSummary: string;
  createdOn: Date;
  enrolledOn: Date;
  updatedOn: Date;
  statusUpdatedOn: Date;
  featuredUpdatedOn: Date;
  timeToPay: Date;
  isFeatured: boolean;
  candidateIdForGlobalSearch: string;
  candidateInvitationStatus: string;
  candidateInvitationToken: string;
  createdByUserType: string;
  streamAction: string;
  actionBy: string;
  searchAfterKey: Object[];
  limit: number;
  pageNumber: number;
  user: UserModel;
  userId: string;
  primaryResumeId: string;
  isResumeAttached: boolean;
  resumeAttached: boolean;
  isResumeRequested: boolean;
  isInterestShown: boolean;
  isLiked: boolean;
  isApplied: boolean;
  isViewed: boolean;
  candidateName: string;
  jobId: string;
  searchText: string;
  myCandidates: boolean;
  currentStatus: string;
  refereshDatas: Date;
  points: number;
  jobsCount: number;
  consumptionType: string;
  parentType: string;
  findAll: boolean;
  inviteStatus: string;
  resumeRequestStatus: string;
  resumeFileId: string;
  activityOn: Date;
  nonSeenMessageCount: number;
  chatHistoryCount: number;
  newChatsCount: number;
  showAll: boolean;
  workExperiences: Array<CandidateWorkExperience>;
  educationDetails: Array<CandidateEducationDetails>;
  candidateCertifications: Array<CandidateCertifications>;
  likeStatus: string;
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
  createdByUserNameMatching: boolean;
  candidateIdMatching: boolean;
  matchingPrimarySkils: Array<string>;
  matchingSecondarySkils: Array<string>;
  matchingTitles: Array<string>;
  effectiveDate: Date | string;
  effectiveFor: number;
  effectiveUntil: Date | string;
  postedBehalfOf: string;

} & {}
