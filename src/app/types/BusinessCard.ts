export class BusinessCard {
  businessId: string;
  userId: string;
  claimable: boolean;
  organisationId: String;
  organizationType: String;
  businessOwner: string;
  industryClassification: string;
  facilityPracticeType: string;
  businessName: string;
  tagLine: string;
  businessLogo: string;
  businessBanner: string;
  companyType: string;
  yearStarted: string;
  companySize: number;
  aboutCompany: string;
  followerCnt: number;
  followersCnt:number;
  employeesCnt: number;
  businessEmail: string;
  businessLocation:string;
  isSuperAdmin:boolean;
  businessStatus:string;
  isAdmin:boolean;
  status:string;
  empCnt:string;
  others:string;
  ownerFullName:string;
  postCnt: number;
  followed: boolean;
  isFollower:boolean;
  isEmployee:boolean;
  data :companyLocationDetails[];


}
export interface companyLocationDetails
{
  city:string;
  country:string;
}
