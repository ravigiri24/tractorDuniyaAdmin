import { Component, OnInit,ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, NavigationExtras, Data } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from "../../services/api.service";
import { SharedataService } from "../../services/sharedata.service";
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {



    updateprofileForm: FormGroup;
    changepassForm: FormGroup;
    
    id= '';
    loading = false;
    forgot_loading = false;
    forgot_submitted = false;
    submitted = false;
    
    profileletterblock= true;
    profileletter = 'S';
    // returnUrl: string;
    invalid_data = false;
    success_data = false;
    success_data_password = false;

    @ViewChild('closebutton_changepwd', { static: false }) closebutton_apic;

    constructor(
        private api: ApiService,
        private formBuilder: FormBuilder,
        private router: Router,
        private share: SharedataService,
        private snackBar: MatSnackBar,
        private routes: ActivatedRoute
        // private authenticationService: AuthenticationService,
        // private alertService: AlertService
    ) {
        // redirect to home if already logged in
        // if (this.authenticationService.currentUserValue) {
        //     this.router.navigate(['/']);
        // }
    }
 sessionData:any
    ngOnInit() {
     //   this.staff_rfid = sessionStorage.getItem('Staff_rfid');
this.sessionData =     this.share.get_staff_detail_session()
        this.updateprofileForm = this.formBuilder.group({
            name: ['', Validators.required],
            fatherName: [''],
            mobile: [''],
            email: [''],
            user_id: ['', Validators.required],
            
            address: [''],
            image: [''],
            img_type: [''],
         
        });

       this.getprofiledetails()

      
        this.changepassForm = this.formBuilder.group({
            newpassword: ['', Validators.required],
            prevpassword: ['', Validators.required],
            retypepass: ['', Validators.required]
        });
    //    this.getprofiledetails();
        // get return url from route parameters or default to '/'
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    showNotification(colorName, text, placementFrom, placementAlign) {
        this.snackBar.open(text, '', {
          duration: 2000,
          verticalPosition: placementFrom,
          horizontalPosition: placementAlign,
          panelClass: colorName
        });
      }
img:any
    get_staff_detail(){

    }

    onFileChange(event) {
        console.log('onchange fired', event)
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
          let file = event.target.files[0];
     
     
          
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.img= reader.result as string
            console.log('reader.result', reader.result)
            console.log('filename', file.name)
            console.log('filetype', file.type)
            var img
            if(file.type=="image/jpeg"){
                img=  reader.result.toString().replace('data:image/jpeg;base64,/', "")
                this.updateprofileForm.controls.img_type.setValue(1) 
            }
            else{
                img=  reader.result.toString().replace('data:image/png;base64,/', "")
                this.updateprofileForm.controls.img_type.setValue(0) 

            }
            this.updateprofileForm.controls.image.setValue(reader.result) 
            console.log("this.doctor_details.profileImage", this.updateprofileForm.value)
          }
        //   const reader1 = new FileReader();
        //   reader1.onload = () => {
        //     this.img = reader1.result as string;
        //     console.log(" this.img", this.img);
        //   }
        //   reader1.readAsDataURL(file)
          
        }
      }

    updateprofile(){
       
     this.updateprofileForm.patchValue(this.sessionData)
this.updateprofileForm.controls.image.setValue("");


    }
    getprofiledetails(){
  
     this.updateprofileForm.patchValue(this.sessionData)
this.updateprofileForm.controls.image.setValue("");
    }
    // convenience getter for easy access to form fields
    get f() { return this.updateprofileForm.controls; }
    get c() { return this.changepassForm.controls; }
    // onSubmit() {
    //     this.submitted = true;

    //     // reset alerts on submit
    //     this.alertService.clear();

    //     // stop here if form is invalid
    //     if (this.updateprofileForm.invalid) {
    //         return;
    //     }

    //     this.loading = true;
    //     this.invalid_data = false;
    //     let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //     this.id = currentUser.id;
    //     this.authenticationService.updateprofile(this.id, this.f.emailid.value, this.f.username.value, this.f.company.value)
    //         .pipe(first())
    //         .subscribe(
    //             data => {
    //                 // this.router.navigate([this.returnUrl]);
    //                 console.log("Update profile",data.success)
                    
                
    //                 // var response = JSON.stringify(data);    
    //                 if(data.success == "1"){
    //                     this.success_data = true;
    //                     this.loading = false;
    //                     this.submitted = false;    
    //                 }else{
    //                     this.invalid_data = true;
    //                     this.loading = false;
                     
    //                 }
                    
    //                 // this.success_data = false;
    //             },
    //             error => {
    //                 this.alertService.error(error);
    //                 this.loading = false;
    //             });
    // }
    // onChangeSubmit(){
    //     this.forgot_submitted = true;

    //     // reset alerts on submit
    //     this.alertService.clear();

    //     // stop here if form is invalid
    //     if (this.changepassForm.invalid) {
    //         return;
    //     }

    //     this.forgot_loading = true;
    //     this.invalid_data = false;
    //     let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //     this.id = currentUser.id;
    //     this.authenticationService.changepassword(this.id,this.c.newpassword.value, this.c.retypepass.value,this.c.prevpassword.value)
    //         .pipe(first())
    //         .subscribe(
    //             data => {
    //                 // this.router.navigate([this.returnUrl]);
    //                 console.log("Change Password",JSON.stringify(data))
                    
    //                 // var response = JSON.stringify(data);    
    //                 if(data.success == "1"){
    //                     // localStorage.setItem('currentUser', JSON.stringify(data));
    //                     // this.router.navigate(['/dashboard']);
    //                     this.success_data_password = true;
    //                 this.forgot_loading = false;
    //                 this.forgot_submitted = false;
    //                 this.closebutton_apic.nativeElement.click();
    //                 }else{
    //                     this.invalid_data = true;
    //                     this.loading = false;
                        
    //                 }
                    
    //             },
    //             error => {
    //                 this.alertService.error(error);
    //                 this.loading = false;
    //             });
    // }



}
