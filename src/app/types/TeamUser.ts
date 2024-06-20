export class TeamUser {
  teamOwnerId: string;
  teamId: string;
  teamName: string;
  description: string;
  status: any;
  isAdmin: boolean;
  viewCnt: string;
  postCnt: string;
  memberCnt: string;
  name: string;
  memberStatus: string;
  teamsOwnerId: string;
  members: MemberData[];
  memberType: string;
  isSelected: any;

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
  isAdmin: boolean,
  state: string,
  country: string,
  connected: false,
  connection: string,
  connectionStatus: string,
  connectionCnt: number,
  postCnt: number,
  userType: string,
  schoolName: string,
  searchText: string,
  status: string,
  teamMemberId: string,
  memberUserId: string,
  teamId: string,
  memberedOn: string,
  teamName: string
}
