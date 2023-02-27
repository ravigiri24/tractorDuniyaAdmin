import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from "../../services/api.service";
import { SharedataService } from "../../services/sharedata.service";
import { MatSnackBar } from '@angular/material/snack-bar';
declare const $;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router, private share: SharedataService, private snackBar: MatSnackBar) { }
  checkprint:any=1
  print_type:any
  staff_rfid:any
  take_away_table_name:any
  product_detail_bill:any
  restaurent_details:any
 
  report_dates: FormGroup

  ngOnInit(): void {
    
    this.staff_rfid = sessionStorage.getItem('Staff_rfid');
 
    this.take_away_table_name = this.share.get_take_away_table_name()
    if (this.staff_rfid == undefined) {
      this.router.navigate(['login']);
    }
    this.report_dates=this.formBuilder.group({

      start_date:new FormControl('',Validators.required),
    
      end_date:new FormControl('',Validators.required),  
  
     
    
       });


  }
   
  reports_type(x){
    this.apiname='';
    this.report_dates.reset()
    this.print_type=x
   if(x==1){
    this.apiname="sales_report_branchwise"

   }
   if(x==2){
    this.apiname="finalproduct_bill"

   }
   if(x==3){
    this.apiname="expense_report"

   }
   if(x==4){
    this.apiname="rooms_report_branchwise"

   }
  }

reporsttype:any
apiname:any

  get_reports() {

    let staff_detail = {
      "staff_rfid": this.staff_rfid,
      "dates":this.report_dates.value

    }

   this.api.postapi(this.apiname,staff_detail).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.restaurent_details = res
          document.getElementById("close_restaurent_report").click()
          if(this.print_type==1){
            this.getPrintDataaa(1)

          }
          if(this.print_type==2){
            this.getPrintDataaa(2)

          }
          if(this.print_type==3){
            this.getPrintDataaa(3)

          }
          if(this.print_type==4){
            this.getPrintDataaa(4)

          }
       
        }
        else {


        }
      }
    );
 

  }
  rechargeRecieptData:any;
  getPrintDataaa(x){
  
      if(x==1){
 
 this.rechargeRecieptData =this.restaurent_details 
      
    this.checkprint = 2
  this.share.setLogoTitle(1)
      setTimeout(() => {
      window.print(); 
       setTimeout(() => {
        this.checkprint =1;
        this.rechargeRecieptData = null
        this.share.setLogoTitle(0)
       
    
    
      }, 20);
    
     }, 20);
    }
       
    if(x==2){
 
      this.rechargeRecieptData =this.restaurent_details 
            this.checkprint = 3
         this.share.setLogoTitle(1)
          setTimeout(() => {
           window.print(); 
            setTimeout(() => {
             this.checkprint =1;
             this.rechargeRecieptData = null
             this.share.setLogoTitle(0)
            
         
         
           }, 20);
         
          }, 20);
         }
         if(x==3){
 
          this.rechargeRecieptData =this.restaurent_details 
                this.checkprint = 4
             this.share.setLogoTitle(1)
              setTimeout(() => {
               window.print(); 
                setTimeout(() => {
                 this.checkprint =1;
                 this.rechargeRecieptData = null
                 this.share.setLogoTitle(0)
                
             
             
               }, 20);
             
              }, 20);
             }
             if(x==4){
 
              this.rechargeRecieptData =this.restaurent_details 
                    this.checkprint = 5
                 this.share.setLogoTitle(1)
                  setTimeout(() => {
                   window.print(); 
                    setTimeout(() => {
                     this.checkprint =1;
                     this.rechargeRecieptData = null
                     this.share.setLogoTitle(0)
                    
                 
                 
                   }, 20);
                 
                  }, 20);
                 }
                

  }
}
