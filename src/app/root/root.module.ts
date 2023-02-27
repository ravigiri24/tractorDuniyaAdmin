import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChartsModule as chartjsModule } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//for test components
import { UserprofileComponent } from '../pages/userprofile/userprofile.component';
import { ChangepasswordComponent } from '../pages/changepassword/changepassword.component';
import { AddmemberComponent } from '../pages/addmember/addmember.component';
//for test module
import { ImageCropperModule } from 'ngx-image-cropper';
import { WebcamModule } from 'ngx-webcam';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
//services
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { CustomerComponent } from './customer/customer.component';
import { OffersComponent } from './offers/offers.component';
import { CollectmoneyComponent } from './collectmoney/collectmoney.component';
import { FixeddepositComponent } from './fixeddeposit/fixeddeposit.component';
import { MemberlistComponent } from './memberlist/memberlist.component';
import { LoanlistComponent } from './loanlist/loanlist.component';
import { DailycollectionComponent } from './dailycollection/dailycollection.component';
import { BrandManagementComponent } from './brand-management/brand-management.component';


@NgModule({
  declarations: [RootComponent, UserprofileComponent,
    ChangepasswordComponent,
    AddmemberComponent,
    AdmindashboardComponent,
    CustomerComponent,
    OffersComponent,
    CollectmoneyComponent,
    FixeddepositComponent,
    MemberlistComponent,
    LoanlistComponent,
    DailycollectionComponent,
    BrandManagementComponent,
],
  imports: [
    CommonModule,
    RootRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    WebcamModule,
    MatButtonToggleModule,
    NgbModule,
    MatButtonModule,
    Ng2SearchPipeModule,
    AutocompleteLibModule,
    MatBadgeModule,
    MatListModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSliderModule,
    CommonModule,
    chartjsModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSortModule,
    MatToolbarModule,
    MatTabsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatSidenavModule,
    MatRadioModule,
    MatBottomSheetModule,
    Ng2SearchPipeModule,
  ]
})
export class RootModule { }
