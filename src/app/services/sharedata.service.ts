import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedataService {
staff_n:any=""
staff_image:any=""
  title = new BehaviorSubject(0);
  staff = new BehaviorSubject(0);
  staff_na = new BehaviorSubject(this.staff_n);
  staff_img = new BehaviorSubject(this.staff_image);


  getLogoTitle() {
    return this.title
  }


  setLogoTitle(title: any) {
    this.title.next(title);
  }
  setchange_name(s_name:any){
this.staff_na.next(s_name)

  }

  setchange_image(img:any){
    this.staff_img.next(img)

  }

  set_staff_name(staff) {

  }
  get_staff_name() {

    return this.staff

  }
  constructor() { }
  staff_detail: any
  set_session(staff_detail) {
    this.staff_detail = staff_detail
    console.log("before",  this.staff_detail);
    this.staff_n=staff_detail.staff_fname
    this.staff_image=staff_detail.staff_img
    var staff_all_detail=JSON.stringify( this.staff_detail)
    sessionStorage.setItem('Staff_rfid', this.staff_detail.staff_rfid);
    localStorage.setItem('Staff_all_detail',staff_all_detail);
  }

  set_subscription_session(subscription_detail){
    var subscription_details:any
    subscription_details=JSON.stringify(subscription_detail)
    sessionStorage.setItem('subscription_detail',subscription_details);
  }

  staff_detailQr: any
  set_session_staffQR(staff_detail) {
    this.staff_detail = staff_detail
    sessionStorage.setItem('Staff_rfidQr', this.staff_detail.staff_rfid);
    sessionStorage.setItem('Staff_nameQr', this.staff_detail.staff_fname);


  }
  takeaway_table: any = "TAKEAWAY"
  get_take_away_table_name() {
    return this.takeaway_table

  }

  // setprintstatus(title: any) {
  //   this.title.next(title);
  // }
  // getprintstatus(): Observable<any> {
  //   return this.title$;
  // }

  gettitle() {

    return this.title
  }
  table_no: any
  setTable(table) {
    //this.table_no=table
    sessionStorage.setItem('table_for_customer', JSON.stringify(table));

    this.table_no = JSON.parse(sessionStorage.getItem('table_for_customer'));

    console.log(this.table_no, "session_table")

  }
set_staff_detail_session(data){

   localStorage.setItem('setSession', JSON.stringify(data));
}
get_staff_detail_session(){

 return JSON.parse( sessionStorage.getItem('setSession'))
}

  setdefaultfocus(x) {
    setTimeout(() => {
      document.getElementById(x).focus();
    }, 200);
  }

  get_table() {
    return this.table_no
  }
  member_detail: any
  setmember(member_detail) {
    this.member_detail = member_detail

  }

  getmember() {
    return this.member_detail


  }
  branch_detail: any
  setBranch(branch) {
    this.branch_detail = branch

  }
  getBranch() {

    return this.branch_detail

  }

  member_id: any = 0
  set_member_id(x) {
    this.member_id = x
  }

  get_member_id() {
    return this.member_id
  }

  alreadybookeddata:any;
  globalData:any;
globalDataMethod(){
  return  this.globalData = {
"name":"Sukoon Resort",
"city":"JABALPUR",

  }
}



staffData:any;
getStaffRFID(x){
this.staffData = x
}

sendStaffRFID(){
  this.staffData= sessionStorage.getItem('Staff_rfid');
  return  this.staffData;
}

rechargeShow:any;
getRechargeOnlyShow(x){
this.rechargeShow = x
}
sendRechargeOnlyShow(){
 return this.rechargeShow 
}


  alreadybooked(x){
  this.alreadybookeddata = x;
  }

  getalreadybookeddata(){
    return this.alreadybookeddata;
  }

  topShow(x){
  
  }

  logOutHide(x){
 
  }

  DevloperOption(x){

    
 
  }
ordedata:any[] = [];
billdata:any;
  printdata(x,res){
this.ordedata = x;
this.billdata =res;

  }

  getprintdata(){
 return this.ordedata;
  }

  getbillData(){
    return this.billdata;
  }


  rechargeDate:any;
  getRechargeData(x){
this.rechargeDate = x
  }

  sendrechargeData(){
   return this.rechargeDate
      }
    

      printSalesReportData:any;
      printTotalObject:any;
      getPrintSalesReportData(x){
    this.printSalesReportData = x;
    
      }
      sendPrintSalesReportData(){
        return this.printSalesReportData;
      }
      printProductCountSalesData:any;
      getPrintProductCountSalesData(x){
        this.printProductCountSalesData = x;
      }
    
      sendPrintProductCountSalesData(){
        return this.printProductCountSalesData;
      }

      
      printRechargeData:any;
      getPrintRechargeReportData(x){
      this.printRechargeData = x;
      }
    
      sendPrintRechargeData(){
        return this.printRechargeData;
      }



      memberData:any;
      getMemberDetails(x){
this.memberData = x
      }
      sendMemberDetails(){
      return this.memberData
    }

     sendAllMemberInformationMethod(){
   return this.AllMemberInformation 
 }
 sendParticularMember(){
  return this.particularMember
 }
  particularMember:any;
  getParticularMember(x){
    this.particularMember = x
  }
  AllMemberInformation:any;
 getAllMemberInformationMethod(x){
this.AllMemberInformation =x
 }



}
