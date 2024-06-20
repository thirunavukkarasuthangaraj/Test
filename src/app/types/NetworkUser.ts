export class NetworkUser {
  networkOwnerId: string;
  networkId: string;
  networkName: string;
  description: string;
  status: string;
  viewCnt: string;
  jobsCount:string;
  networkNameLowerCase:String;
  candidatesCount:string;
  postCnt: string;
  memberCnt: string;
  memberType: string;
  isAdmin: boolean;
  memberStatus: string;
  name: string;
  isDefaultNetwork:Boolean;
  members: MemberData[];

}


export interface MemberData {
  userId: string,
  username: string,
  firstName: string,
  lastName: string,
  title: string,
  photo: string,
  memberStatus: string;
  image: string,
  organisation: string,
  email: string,
  phoneNo: string,
  city: string,
  state: string,
  country: string,
  connected: false,
  isAdmin: boolean,
  connection: string,
  connectionStatus: string,
  connectionCnt: number,
  postCnt: number,
  userType: string,
  schoolName: string,
  searchText: string,
  status: string,
  networkMemberId: string,
  memberUserId: string,
  networkId: string,
  memberedOn: string,
  networkName: string
}
