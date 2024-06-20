import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppSettings } from "./AppSettings";
import { GigsumoConstants } from "./GigsumoConstants";
import { ApiService } from "./api.service";
import { widgetData } from "./job.service";
import { UserModel, WorkExperience } from "./userModel";
import { UtilService } from "./util.service";

export type responseObject<Tdata =  any> = {
  status?: string;
  searchText?: string;
  userId?: string;
  userType ?: string;
  limit?: number;
  interactionType : "CANDIDATE_INVITED" |  "JOB_APPLIED" | "RESUME_REQUESTED" | "RESUME_DOWNLOADED";
  searchAfterKey?: Array<any>;
  pageNumber?: number;
  createdBy?: string;
  content ?: string ,
  data : Tdata ,
};

type PROFILE_DETAIL_PAYLOAD = Pick<responseObject , "userId" | "userType">;
export type PROFILE_LISTENER = Pick<responseObject<WorkExperience> , "content" |  "data">

@Injectable({
  providedIn: "root",
})
export class UserService {

  lablechangeclienttype:any;
  constructor(private API: ApiService,private util:UtilService) {}


  userConnection(data): Observable<any> {
    return this.API.create("user/connect", data);
  }


  async userProfileDetails(data : {} | any){
    this.util.startLoader();
      const profileResponse = await this.API.create('user/profileDetails' , data).toPromise();
      this.util.stopLoader();
      if(profileResponse.code != GigsumoConstants.SUCESSCODE){
        throw new Error("Server Exception");
      }
      return profileResponse.data;
  }

  userConnectionList(
    data: widgetData
  ): Observable<any> {

    return this.API.create("user/activeContatcts", data).pipe(
      map((connectionList) => {
        this.util.stopLoader();
        if(connectionList.code != "00000"){
          throw new Error("There is some issue with Server");
        }
        connectionList.data.activeContatcts.forEach(user => {
          user.page = "connectionList";
      });
        return connectionList.data;
      })
    );
  }
  async checkIfUserHasCurrentOrganization(value : PROFILE_DETAIL_PAYLOAD) : Promise<boolean>{
    this.util.startLoader();
    let hasCurrentOrganization : boolean = false;
    const profileData = await this.userProfileDetails(value);
    const { exeperienceList } =  profileData;
    this.util.stopLoader();
    if(Array.isArray(exeperienceList) && exeperienceList.length > 0){
        exeperienceList.forEach((element : WorkExperience)=>{
          if(element.currentOrganization){
            hasCurrentOrganization = true;
          }
        });
    }
    else  hasCurrentOrganization = false;

    return hasCurrentOrganization;
  }

  // querying the userComplete status functionality here
  userProfileComplete(userId : string) : Observable<UserModel> {
   return this.API.query("user/profile/complete/" + userId).pipe(
    map( userData=>{
      (userData.photo === null || userData.photo === undefined ||userData.photo === "") ?
        userData.photo = null :
        userData.photo = AppSettings.photoUrl + userData.photo;
       this.defaultLocalData(userData);
       return userData;
    })
   );

  }
  getuservalues(callback: (lablechangeclienttype: string) => void) {

    const userId = localStorage.getItem('userId');
    this.API.query('user/' + userId).subscribe(
      (res) => {

        callback(res.clientType);
      },
      (err) => {

      }
    );
  }

  // setting the userDetails in localStorage
  defaultLocalData(userData : UserModel){
    localStorage.setItem('currentOrganization', userData.organisation);
  }


  async sentOtpToMail(data : unknown) : Promise<any>{
    return await this.API.create("user/sendOtpToMailId", data).toPromise();
  }

  async verifyOtp(data : unknown) : Promise<any>{
    return await this.API.create("user/verifyOTP", data).toPromise();
  }





  onlineAPI(status:string){
    let url = 'user/onlineoroffline';
      let user = {
        userId: localStorage.getItem('userId'),
        online: status.toUpperCase()
      };
      this.util.startLoader()
      this.API.create(url, user).subscribe(res => {
        this.util.stopLoader()
      }, err => {
        this.util.stopLoader();

      });
  }


}
