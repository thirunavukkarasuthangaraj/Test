import { List } from "lodash"

export interface v2Job {
    actionBy: string,
    activities: string,
    appliedBy: string,
    appliedCount: number,
    appliedToday: number,
    businessId: string,
    candidateId: string,
    candidateStatusToJob: string,
    chatHistoryCount: number,
    city: string,
    cityMatching: boolean,
    clientName: string,
    clientType: string,
    consumptionType: string,
    country: string,
    countryMatching: boolean,
    createdOn: string,
    currentStatus: string,
    duration: number,
    durationType: string,
    effectiveDate: string,
    effectiveFor: number,
    effectiveUntil: string,
    experienceFrom: number,
    experienceTo: number,
    experinenceMatching: boolean,
    featuredUpdatedOn: string,
    findAll: boolean,
    interactionType: string,
    interestShownCount: number,
    interestShownLogs: string,
    inviteStatus: string,
    isApplied: boolean,
    isFeatured: boolean,
    isInterestShown: boolean,
    isLiked: boolean,
    isRequestedResume: boolean,
    isResumeRequested: boolean,
    isViewed: boolean,
    issecurityClearanceMatching: boolean,
    jobClassification: string,
    jobDescription: string,
    jobId: string,
    jobIdForGlobalSearch: string,
    jobIdMatching: boolean,
    jobPostedBehalfOf: string,
    jobPostedBy: string,
    jobPostedByUserType: string,
    jobReferenceId: string,
    jobStatusToCandidate: string,
    jobTitle: string,
    likeStatus: string,
    likedBy: string,
    likesCount: number,
    limit: number,
    lowerCaseCity: string,
    lowerCaseCountry: string,
    lowerCaseState: string,
    matchingPrimarySkils: List<string>,
    matchingSecondarySkils: List<string>,
    matchingTitles: List<string>,
    myJobs: boolean,
    newChatsCount: number,
    nonSeenMessageCount: number,
    organisationId: string,
    pageNumber: number,
    payType: string,
    points: number,
    postedByUserName: string,
    postedByUserNameMatching: boolean,
    postedOn: string,
    primarySKillsMatching: boolean,
    primarySkills: List<string>,
    relocationMatching: boolean,
    relocationRequired: boolean,
    remoteWork: boolean,
    remoteWorkMatching: boolean,
    searchAfterKey: string,
    searchText: string,
    secondarySKillsMatching: boolean,
    secondarySkills: List<string>,
    securityClearance: boolean,
    showClientName: boolean,
    showClientType: boolean,
    state: string,
    stateMatching: boolean,
    status: string,
    statusUpdatedOn: string,
    streamAction: string,
    targetRate: number,
    timeToPay: string,
    titleMatching: boolean,
    updatedOn: string,
    user: User,
    userId: string,
    viewedBy: string,
    viewedByCount: number,
    workFromHome: boolean,
    workFromHomeMatching: boolean,
    zipCode: string
}

interface User {
    aboutMe: string,
    action: string,
    activityDate: string,
    applicationAccess: string,
    banner: string,
    candidateInvitation: string,
    candidateSkillsInNeed: string,
    careOnlineNo: string,
    certification: string,
    city: string,
    clientType: string,
    completePercentage: string,
    connectedUser: string,
    connectionCnt: string,
    country: string,
    createdOn: string,
    directoryProfileId: string,
    educationDetail: string,
    email: string,
    firstName: string,
    followEnabled: string,
    fullname: string,
    gigsumoNo: string,
    jobSkillsInNeed: string,
    lastLoggedIn: string,
    lastName: string,
    memberShipType: string,
    modifiedOn: string,
    nonApplicable: string,
    npiNo: string,
    online: string,
    organisation: string,
    password: string,
    phoneNo: string,
    photo: string,
    pitch: string,
    planUsageTrackingId: string,
    previousMails: string,
    profileId: string,
    profileStatus: string,
    purpose: string,
    referralCode: string,
    referredBy: string,
    school: string,
    secondaryEmail: string,
    socialPresence: string,
    source: string,
    state: string,
    timeZone: string,
    timeZoneCountry: string,
    timestamp: string,
    title: string,
    token: string,
    tokenFor: string,
    userId: string,
    userPrivacy: string,
    userStatus: string,
    userType: string,
    username: string,
    workExperience: List<WorkExperience>
}


interface WorkExperience {
    action: string,
    badge: string,
    businessId: string,
    city: string,
    clientType: string,
    country: string,
    currentOrganization: string,
    endMonth: string,
    endYear: string,
    expId: string,
    lowerCaseCity: string,
    lowerCaseCountry: string,
    lowerCaseOrganizationName: string,
    lowerCaseState: string,
    lowerCaseStreet: string,
    lowerCaseZipCode: string,
    organisationId: string,
    organisationName: string,
    previousUserTpe: string,
    startMonth: string,
    startYear: string,
    state: string
    street: string,
    timeZone: string,
    title: string,
    userId: string,
    zipcode: string,
    businessLogo:string;
}