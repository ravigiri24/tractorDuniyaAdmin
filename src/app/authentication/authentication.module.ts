import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffloginComponent } from './stafflogin/stafflogin.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KotstaffloginComponent } from './kotstafflogin/kotstafflogin.component';

@NgModule({
  declarations: [LoginComponent, ForgotComponent, StaffloginComponent, KotstaffloginComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthenticationModule { }
