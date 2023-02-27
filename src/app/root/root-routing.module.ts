import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddmemberComponent } from '../pages/addmember/addmember.component';
import { ChangepasswordComponent } from '../pages/changepassword/changepassword.component';
import { UserprofileComponent } from '../pages/userprofile/userprofile.component';
import { RootComponent } from './root.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { CustomerComponent } from './customer/customer.component';
import { OffersComponent } from './offers/offers.component';
import { CollectmoneyComponent } from './collectmoney/collectmoney.component';
import { FixeddepositComponent } from './fixeddeposit/fixeddeposit.component';
import { ReportsComponent } from '../pages/reports/reports.component';
import { MemberlistComponent } from './memberlist/memberlist.component';
import { LoanlistComponent } from './loanlist/loanlist.component';
import { DailycollectionComponent } from './dailycollection/dailycollection.component';
import { BrandManagementComponent } from './brand-management/brand-management.component';
const routes: Routes = [
  {
    path: "", component: RootComponent,
    children: [
      {
        path: "",
        component: AdmindashboardComponent,
        redirectTo: "admindashboard",
        pathMatch: "full",        
      },
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      // },
      {
        path: 'admindashboard',
        component: AdmindashboardComponent
      },
      {
        path: 'memberslist',
        loadChildren: () => import('./members/members.module').then(m => m.MembersModule)
      },
      { path: 'customer', component: CustomerComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'collectmoney', component: CollectmoneyComponent },
      { path: 'fixeddeposit', component: FixeddepositComponent },
      { path: 'changepassword', component: ChangepasswordComponent },
      { path: 'proiledetails', component: UserprofileComponent },
      { path: 'addmember', component: AddmemberComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'members', component: MemberlistComponent},
      { path: 'loanlist', component: LoanlistComponent},
      { path: 'dailycollection', component: DailycollectionComponent},
      { path: 'brandManagement', component: BrandManagementComponent},
    ],

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootRoutingModule { }
