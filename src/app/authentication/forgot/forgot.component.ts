import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  forgotForm: FormGroup;
  loading = false;
  submitted = false;
  // returnUrl: string;
  invalid_forgot = false;
  success_forgot = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public api: ApiService
    //   private authenticationService: AuthenticationService,
    //   private alertService: AlertService
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //     this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgotForm.controls; }

  onSubmit() {


    this.submitted = true;
    // reset alerts on submit
    //   this.alertService.clear();
    // stop here if form is invalid
    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    this.invalid_forgot = false;
    //   this.authenticationService.forgot(this.f.email.value)    

    //       .pipe(first())
    //       .subscribe(
    //           data => {

    //               // this.router.navigate([this.returnUrl]);
    //               console.log("Forgot Response",JSON.stringify(data))
    //               // // var response = JSON.stringify(data);    
    //               if(data.success == "1"){
    //               //     localStorage.setItem('currentUser', JSON.stringify(data));
    //                  this.success_forgot = true;
    //                  setTimeout(() => {
    //                   this.router.navigate(['/']);
    //                  }, 1000);

    //               }else{
    //                   this.invalid_forgot = true;
    //                   this.loading = false;

    //               }

    //           },
    //           error => {
    //               this.alertService.error(error);
    //               this.invalid_forgot =true;
    //               this.loading = false;
    //           });
  }

}
