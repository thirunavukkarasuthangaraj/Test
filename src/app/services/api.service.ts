
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { AppSettings } from './AppSettings';
import { CommonValues } from './commonValues';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpBackend, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';



if (localStorage.getItem('userId') == null || localStorage.getItem('userId') == '') {
  const id = '';
} else {
  const id = localStorage.getItem('userId');
}

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': AppSettings.HTTP_CONTENT_TYPE,
//     'Access-Control-Allow-Origin': AppSettings.HTTP_ACCESS_CONTROL_ALLOW_ORIGIN,
//     //'userId': id
//   })
// };

const commonHeader = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    "Access-Control-Allow-Headers": "Origin, X-Requested-ith, Content-Type, Accept, Authorization"
  })
};
@Injectable({
  providedIn: 'root'
})

export class ApiService {
  // errorCount: number;
  private byPassCall: HttpClient
  private loadAPIcallValueSubject = new BehaviorSubject<boolean>(true);
  loadAPIcallValue$ = this.loadAPIcallValueSubject.asObservable();
  httpHeaders: { headers: HttpHeaders; };
  constructor(
    private http?: HttpClient, private util?: UtilService, private commonvalues?: CommonValues, private spinner?: NgxSpinnerService, private byPassReq?: HttpBackend) {
    this.byPassCall = new HttpClient(byPassReq);
    this.httpHeaders = {
      headers: new HttpHeaders().set('Platform', 'GIGSUMO_APP'),
    };
  }

  startLoader() {
    this.spinner.show();
  }

  stopLoader() {
    this.spinner.hide();
  }
  // login(u, User): Observable<any> {
  //   const url = AppSettings.ServerUrl + u;
  //   return this.http.post<any>(url , User).pipe(
  //     retry(2),
  //     // return this.http.post<any>(url , User , commonHeader).pipe(
  //     catchError(this.handleError1));
  // }

  userLogin(u, User): Observable<any> {

    let url = AppSettings.ServerUrl + u;
    var credentials = btoa(User.username + ":" + User.password);
    const httpOptionslogin = {
      headers: new HttpHeaders({ 'Authorization': 'Basic ' + credentials })
    };

    return this.http.post<any>(url, {}, httpOptionslogin).pipe();
  }


  creditPurches(u, commonHeader): Observable<any> {
    const url = AppSettings.ServerUrl + u;
    return this.http.post<any>(url, {}, commonHeader).pipe();
  }


  create(u, User, errorMessage?: string): Observable<any> {
    const url = AppSettings.ServerUrl + u;
    return this.http.post<any>(url, User , {headers : this.httpHeaders.headers}).pipe(
      catchError(this.handleError<any>(errorMessage))
    )
  }

  exportToExcelWithStyling(data: any[], filename: string) {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Define custom styles (e.g., font color, size, and logo)
    const style = {
      font: { color: { rgb: 'FF0000FF' }, size: 14 },
      fill: { fgColor: { rgb: 'FFFF00FF' } },
      logo: 'assets/icon/gigsumologo_bigface.png',
    };

    // Apply styles to the worksheet
    worksheet['!cols'] = [{ wch: 20 }, { wch: 10 }, /* ...add more as needed */];
    worksheet['!margins'] = { left: 0.5, right: 0.5, top: 1, bottom: 1 };
    worksheet['!page'] = { sheetPr: { tabColor: { rgb: 'FFFF00FF' } } };

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Create a Blob representing the XLSX file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

// Lamda Function URL

async lamdaFunctionsget(path,postvalue?:String): Promise<any> {

    const url = AppSettings.LAMDA_URL + path;
    return await fetch(url).then(result=>{
        return result.json();
    }).then(data =>{
      return data
    });
 }
 async lamdaFunctionsPost(path,data?:any): Promise<any> {
  const url = AppSettings.LAMDA_URL + path;
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(data),
  };
  return await fetch( url, requestOptions).then(result=>{
      return result.json();
  }).then(data =>{
    return data
  });


}






getStripeSession(urls,authId) {
  const headers = {
    Authorization: `Bearer ${authId}`,
  };

  return this.http.get(urls, { headers });
}



  query(u: string, errorMessage?: string): Observable<any> {
    const url = AppSettings.ServerUrl + u;
    // if(adData.loaderAnderror){
    return this.http.get<any>(url , {headers : this.httpHeaders.headers}).pipe(
      catchError(this.handleError<any>(errorMessage)));
    // }else{
    //   return this.byPassCall.get<any>(url).pipe(
    //     );
    // }

  }

  queryPassval(u, data, errorMessage?: string): Observable<any> {
    const url = AppSettings.ServerUrl + u;
    return this.http.get<any>(url, data).pipe(
      catchError(this.handleError<any>(errorMessage))
    );
  }



  updatePut(u, secData, errorMessage?: string) {
    const url = AppSettings.ServerUrl + u;
    return this.http.put<any>(url, secData , {headers : this.httpHeaders.headers}).pipe(
      catchError(this.handleError<any>(errorMessage))
    );
  }



  delete(data, errorMessage?: string) {
    const url = AppSettings.ServerUrl + data;
    return this.http.delete<any>(url, data).pipe(
      catchError(this.handleError<any>(errorMessage))
    );
  }



  AuthToken(u, auth): Observable<any> {
    const url = AppSettings.ServerUrl + u;
    return this.http.get<any>(url, auth);
  }

  AuthValidation(u, vaildation): Observable<any> {
    const url = AppSettings.ServerUrl + u;
    return this.http.post<any>(url, vaildation).pipe(
      // return this.http.post<any>(url , vaildation , commonHeader).pipe(
      catchError(this.handleError<any>('Token Validation Check'))
    );
  }


  onLogout() {
    const url = AppSettings.ServerUrl + 'home/logout';
    return this.http.post<any>(url, {}).pipe(
      catchError(this.handleError<any>('communityDetails'))
    );
  }


  logout() {
    // const url = AppSettings.ServerUrl + "sso/logout";
    let url = AppSettings.ServerUrl + "sso/logout?redirect_url=" + window.location.href;
    // //// console.log("url---- "+url);
    window.location.href = url;
    //  return this.http.get<any>(url).pipe(
    // );
  }
  // Message page services
  messagePageService(method: string, path: string, data?: any, upload?: any, operation?: any) {
    const url = AppSettings.ServerUrl + path;
    if (method === 'GET') {
      return this.http.get(url , {headers : this.httpHeaders.headers}).pipe(catchError(this.handleError<any>(operation)));
    } else if (method === 'POST') {
      return this.http.post(url, data, {headers : this.httpHeaders.headers}).pipe(catchError(this.handleError<any>(operation)));
    } else if (method === 'PUT') {
      return this.http.put(url, data, {headers : this.httpHeaders.headers}).pipe(catchError(this.handleError<any>(operation)));
    } else if (method === 'DELETE') {
      return this.http.delete(url).pipe(catchError(this.handleError<any>(operation)));
    }
  }

  // Error msg

  errorCount = 0
  public handleError<T>(operation, result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 500) {
        this.util.stopLoader()
        if (operation != undefined) {
          Swal.fire(operation);
        }
        throw error;
      } else if (error.status === 0) {
        this.util.stopLoader()
        throw error;
      } else if (error.status === 400 || error.status === 401) {
        this.util.stopLoader();
        throw error;
      } else if (error.status === 404 || error.status === 440) {
        this.util.stopLoader()

        throw error;
      } else if (error.status === 303) {
        this.util.stopLoader()
        throw error;
      }
      return of(result as T);
    };
  }

  public handleErrorOld<T>(operation = 'operation', result?: T) {



    return (error: any): Observable<T> => {
      if (error.status === 0) {
        if (this.errorCount === 0) {
          Swal.fire('Server is not reachable. Please contact system admin');
          this.errorCount++;
        }
      } else if (error.status === 401) {
        if (this.errorCount === 0) {
          Swal.fire('Timeout error. Please try again');
          this.errorCount++;
          return;
        }
      } else if (error.status === 500 || error.status === 501) {
        if (this.errorCount === 0) {
          Swal.fire('Internal Server Error. Please try again');
          this.errorCount++;
          return;
        }
      } else if (error.status === 400) {
        if (this.errorCount === 0) {
          Swal.fire('Bad request');
          localStorage.clear();
        }
      }
      return of(result as T);
    };
  }

  handleError1(error: HttpErrorResponse) {
    return throwError(error);
  }
  setLoadAPIcall(value: boolean) {
    this.loadAPIcallValueSubject.next(value);
  }

  getLoadAPIcall() {
    return this.loadAPIcallValueSubject.value;
  }
}
