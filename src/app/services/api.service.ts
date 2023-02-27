import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  rootUrl;
  project;
  @Output() myOutputValue: EventEmitter<any> = new EventEmitter<any>();
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    //this.rootUrl = 'https://thefoodiescartel.com/billing/admin/dsoi_api_pos/';
    //this.rootUrl = 'http://localhost/newhotel/dsoi_api_pos/';
    this.rootUrl = 'http://localhost/backend/RkApi/';
    this.rootUrl = environment.rooturl;
    this.project = environment.projectdetails;

  }

  setstorage(x, y) {
    localStorage.setItem(x, JSON.stringify(y));
  }

  getstorage(x) {
    return JSON.parse(localStorage.getItem(x));
  }

  removestorage(x) {
    localStorage.removeItem(x);
  }

  clearStorage() {
    localStorage.clear();
    // this.router.navigate(["/authentication/signin"]);
  }

  setsession(x, y) {
    sessionStorage.setItem(x, JSON.stringify(y));
  }

  getsession(x) {
    return JSON.parse(sessionStorage.getItem(x));
  }

  removesession(x) {
    sessionStorage.removeItem(x);
  }

  clearsession() {
    sessionStorage.clear();
    // this.router.navigate(["/authentication/signin"]);
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }




  getpushnotification(x) {
    this.myOutputValue.emit(x);
  }

  postapi(x, object): any {
    return this.http.post(this.rootUrl + x, object).pipe(map(res => res));
  }


  getapi(x): Observable<any> {
    return this.http.get<any>(this.rootUrl + x).pipe(map(res => res));
  }

}
