import { UserModel, UserSocialPresence } from "./userModel";

export interface ServiceOptions{


  accreditionCode:string;
  accredition:string;
  serviceType:string[];
  insuranceAccepted:string[];
  medicareCertified:boolean;
  acceptingNewPatients:boolean;
  privatePayAccepted:boolean;

}
export interface BusinessRevokeUserEntity extends UserModel {

  busRevokeId:string;
  businessId:string;
  userId:string;
  status:string;
  type:string;
  revokedOn:Date;
  isAdmin:boolean;
  action:string;
}

export interface  WorkingHours {

  monFromTime:string;
  monToTime:string;
  monWorking:boolean;
  applyAll:string;
  tueFromTime:string;
  tueToTime:string;
  tueWorking:boolean;
  wedFromTime:string;
  wedToTime:string;
  wedWorking:boolean;
  thrFromTime:string;
  thrToTime:string;
  thrWorking:boolean;
  friFromTime:string;
  friToTime:string;
  friWorking:boolean;
  satFromTime:string;
  satToTime:string;
  satWorking:boolean;
  sunFromTime:string;
  sunToTime:string;
  sunWorking:boolean;
}

export interface  OtpEntity {

 id:string;
 entityType:string;
 entityId:string;
 otpFor:string;
 otp:string;
 otpStatus:string;
 otpExpirationTime:Date;
 type:string;
}

export interface TagsEntity {

  tagId:string;
  tagType:string;
  tagName:string;
  tagOwner:string;
  tagOwnerId:string;
  createdBy:string;
  createdOn:Date;
  tagOrder:string;
  type:string;

}

export interface  BusinessAdminEntity extends UserModel {

  businessAdminId:string;
  userId:string;
  businessId:string;
  status:string;
  type:string;
  assignedOn:Date;
  businessUserType:string;
  isAdmin:boolean;
  userData:UserModel;
  action:string;

}

export interface  BusinessFollowersEntity extends UserModel {

	busFollowerId:string;
	businessId:string;
	userId:string;
	status:string;
  followedOn:Date;
	businessUserType:string;
  isFollower:boolean;
	action:string;
}

export interface BusinessEmployeeEntity extends UserModel {

	busEmpId:string;
	businessId:string;
	userId:string;
	status:string;
  joinedOn:Date;
	businessUserType:string;
  isEmployee:boolean;
	action:string;
}

export interface  CompanyLocationDetails {

	locationId:string;
	address1:string;
	searchAddress1:string;
	address2:string;
	searchAddress2:string;
	company:string;
	state:string;
	searchState:string;
	city:string;
	searchCity:string;
	country:string;
	searchCountry:string;
	zipCode:string;
	searchZipcode:string;
	headquarters:boolean;
	businessPhone:string;
	cellPhone:string;
	businessEmail:string;
	website:string;
	street:string;
	searchStreet:string;
	primary:boolean;
	businessId:string;
	action:string;

}

export interface BusinessModal{

  businessId:string;
  platformBusinesId:string;
  businessOwner:string;
  industryClassification:string;
  searchIndustryClassification:string;
  facilityPracticeType:string;
  businessName:string;
  npiNo:string;
  searchBusinessName:string;
  Line:string;
  businessLogo:string;
  businessBanner:string;
  companyType:string;
  yearStarted:string;
  companySize:string;
  aboutCompany:string;
  organizationType:string;
  applicable:string;
  serviceOptions:ServiceOptions;
  userSocialPresence:UserSocialPresence;
  workingHours:WorkingHours;
  followersCnt:number;
  employeesCnt:number;
  adminCnt:number;
  verified:string;
  offlineVerification:boolean;
  others:string;
  organisationId:string;
  completePercene:number;
  phone:string;
  businessEmail:string;
  suggestedTo:string[];
  profileId:string;
  otp : OtpEntity[];
  revoke :BusinessRevokeUserEntity[];
  tags :TagsEntity[];
  admin :BusinessAdminEntity[];
  followers :BusinessFollowersEntity[];
  employees:BusinessEmployeeEntity[];
  companyLocationDetails : CompanyLocationDetails[];
  createdOn:Date;
  modifiedOn:Date;
  status:string;
  subscriptionType:string;
  action:string;
  actionBy:string;

}
