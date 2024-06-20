
export interface UserSocialPresence {
  twitter: string;
  facebook: string;
  linkedin: string;
  blogURL: string;
  alternamePageLink: string;
}

export type filterModel = {
  "source"?: {
    "all": boolean,
    "allPlatFormJobs": boolean,
    "myJobs": boolean,
    "teamJobs": boolean,
    "recruiterNetworkJobs": boolean,
    "freeLancerNetworkJobs": boolean,
    "mtaNetworkJobs": boolean,
    "featured": boolean,
    "suggestedJobs": boolean
  },
  "searchAfterKey"?: string,
  "organisationTypeParams"?: {
    "owner"?: boolean;
    "systemsIntergrator"?: boolean;
    "vendorStaffingAgency"?: boolean;
    "primeVendor"?: boolean;
  },
  "workType"?: {
    "all": boolean,
    "remoteWork": boolean,
    "relocationRequired": boolean,
    "workFromHome": boolean
  },
  "experienceFrom"?: string,
  "candidateId"?: string,
  "experienceTo"?: string,
  "postedFrom"?: number,
  "postedTo"?: number,
  "country"?: string,
  "state"?: string,
  "jobsToFilter"?: string,
  "city"?: string,
  "zipCode"?: string,
  "limit"?: number,
  "userId"?: string,
  "searchContent"?: string,
  "jobClassification"?: Array<string>,
  "clientType"?: Array<string>,
  "status"?: Array<string>,
}

export type CandidateFilterModel = {
  "source"?: {
    "all"?: boolean,
    "myCandidates"?: boolean,
    "allPlatFormCandidates"?: boolean,
    "teamCandidates"?: boolean,
    "benchNetworkCandidates"?: boolean,
    "freeLancerNetworkCandidates"?: boolean,
    "mtaNetworkCandidates"?: boolean,
    "jobSeekerNetworkCandidates"?: boolean,
    "featured"?: boolean,
    "suggestedCandidates"?: boolean
  },
  "workType"?: {
    "all"?: boolean,
    "remoteWork"?: boolean,
    "relocationRequired"?: boolean,
    "workFromHome"?: boolean
  },
  "workAuthorization"?: string[],
  "engagementType"?: string[],
  "availableIn"?: string[],
  "status"?: string[],
  "searchAfterKey"?: string | null,
  "city"?: string,
  "state"?: string,
  "country"?: string,
  "zipCode"?: string,
  "submissionFilters"?: string[],
  "postedFrom"?: number,
  "postedTo"?: number,
  "limit"?: number,
  "userId"?: string,
  "searchContent"?: string,
  "candidatesToFilter"?: string,

};


interface ApplicationAcess {
  healthPortal: boolean;
  physicianPortal: boolean;
  agencyPortal: boolean;
  billingPortal: boolean;
}

interface UserPrivacy {
  workExperience: boolean;
  educationDetail: boolean;
  certification: boolean;
  socialInfluence: boolean;
  communities: boolean;
  reviews: boolean;
}

export interface WorkExperience {
  businessLogo: string;
  expId: string;
  organisationName: string;
  lowerCaseOrganizationName: string;
  currentOrganization: boolean;
  title: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  street: string;
  lowerCaseStreet: string;
  city: string;
  lowerCaseCity: string;
  state: string;
  lowerCaseState: string;
  zipcode: string;
  country: string;
  lowerCaseCountry: string;
  lowerCaseZipCode: string;
  organisationId: string;
  businessId: string;
  badge: boolean;
  previousUserTpe: string;
  clientType: string;
  userId: string;
  action: string;
  addEmployee: boolean;

}

export interface EducationDetail {
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
  currentlyPursued: boolean
  institutionId: string;
  showThisOnProfile: boolean;
  userId: string;
  action: string;
}

export interface UserCertification {
  certificateId: string;
  certificationName: string;
  certificateOrganization: string;
  certificateLicenseNo: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  userId: string;
  certificateNameId: string;
  action: string;
}

export interface UserConnectedList {
  connectionId: string;
  userId: string;
  connectorid: string;
  status: string;
  connectedDate: Date;
  name: string;
  photo: string;
  action: string;
}
export interface UserModel {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  postCnt: string;
  secondaryEmail: string;
  phoneNo: string;
  password: string;
  candidatesCount: string;
  connectionCnt: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  aboutMe: string;
  title: string;
  nonApplicable: string;
  organisation: string;
  photo: string;
  banner: string;
  pitch: string;
  userType: string;
  npiNo: string;
  directoryProfileId: string;
  profileStatus: string;
  userStatus: string;
  profileId: string;
  source: string;
  socialPresence: UserSocialPresence;
  applicationAcess: ApplicationAcess;
  userPrivacy: UserPrivacy;
  conenctionCnt: number;
  followEnabled: boolean;
  completePercentage: number;
  online: string;
  purpose: string;
  clientType: string;
  memberShipType: string;
  jobsSkillsInNeed: Array<string>;
  candidateSkillsInNeed: Array<string>;
  previousMails: Array<string>;
  benefitsBalances: Array<benefitsObject>;
  workExperience: Array<WorkExperience>;
  educationDetail: Array<EducationDetail>;
  certification: Array<UserCertification>;
  connectedUser: Array<UserConnectedList>;
  token: string;
  fullname: string;
  tokenFor: string;
  createdOn: Date;
  modifiedOn: Date;
  referredBy: string;
  action: string;
  lastLoggedIn: Date;
  activityDate: Date;
  referralCode: string;
  school: string;
  candidateInvitation: boolean;
  timestamp: Date;

}

export type benefitsObject = {
  benefitKey: string;
  status: string;
  balance: number;
};

export type featureKeyValues = {
  item: string,
} & {
  Free: string,
  Pro: string,
} & {
  Business: string,
  Enterprise: string
}


export type SubscriptionPlans = {
  id: string,
  subcriptionType: string,
  description: string,
  payAsYouList: string,
  planBenefits: Array<benefitsObject>,
  monthlySubscriptionAmount: number,
  annualSubscriptionAmount: number,
  monthlysubscriptionForAnnual: number,
  annualDiscountRate: number,
  monthlyDiscountRate: number,
  validFrom: Date,
  validto: Date,
  status: string,
  order: number,
  seleted: boolean,
  popular: boolean
}

export type Benefits = {
  benefitId: string,
  benefitName: string,
  benefitDescription: string,
  type: string,
  status: string,
  order: number,
  createdOn: Date,
  updatedOn: Date
}
export type SubscriptionFeatures = {
  featureKeyValues: Array<featureKeyValues>,
  titles: Array<string>
}


