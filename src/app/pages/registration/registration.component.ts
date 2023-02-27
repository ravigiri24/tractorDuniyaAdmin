import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  // returnUrl: string;
  invalid_register = false;
  success_register = false;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      companyname: ['', Validators.required],
    });

  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.invalid_register = false;
    this.authenticationService.register(this.f.username.value, this.f.email.value, this.f.password.value, this.f.companyname.value)
      .pipe(first())
      .subscribe(
        data => {
          // this.router.navigate([this.returnUrl]);
          console.log("register", JSON.stringify(data))
          // var response = JSON.stringify(data);    
          if (data.status == "1") {
            setTimeout(() => {
              this.success_register = true;
              localStorage.setItem('currentUser', JSON.stringify(data));
              localStorage.setItem('isFirstTime', 'true');
              //this.router.navigate(['/dashboard']);
              this.router.navigate(['/root/dashboard']);
            }, 500);

          } else {
            this.invalid_register = true;
            this.loading = false;
          }

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
