import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { StaffloginComponent } from './stafflogin/stafflogin.component';
import { KotstaffloginComponent } from './kotstafflogin/kotstafflogin.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  { path: "login", component: LoginComponent },
  { path: "forgot", component: ForgotComponent },
  { path: 'stafflogin', component: StaffloginComponent },
  { path: 'kitchenstaff', component: KotstaffloginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
