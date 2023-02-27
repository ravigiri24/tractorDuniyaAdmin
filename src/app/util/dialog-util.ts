import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogType } from '../shared/components/delete-dialog/dialog-type.enum';
import { Observable } from 'rxjs';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { AddIconComponent } from '../shared/json-form-builder/add-icon/add-icon.component';

export class DialogUtil {
  constructor(public dialogAnimation: NgDialogAnimationService) {
  }

  public static showConfirmationDialog(title, message, dialogType: DialogType, dialog: MatDialog): Observable<boolean> {
    const data = {
      title,
      message,
      dialogType
    };
    const dialogRef = dialog.open(DeleteDialogComponent, {
      width: '400PX',
      disableClose: true,
      data,
    });
    return dialogRef.afterClosed();
  }

  static showMediumDialog(dialog: any, successCallback, pannelClass) {
    const dialogRef1 = dialog.open(AddIconComponent, {
      disableClose: true,
      maxWidth: '98%',
      panelClass: pannelClass,
      position: {
        top: '10px',
      }
    });
    dialogRef1.afterClosed().subscribe(result => {
      successCallback(result);
    });
  }

  static showOverallAnimationDialoge(dialogAnimation: any, component, successCallback, pannelClass, animation) {
    const dialogRef = dialogAnimation.open(component, {
      disableClose: true,
      maxWidth: '98%',
      panelClass: pannelClass,
      animation: { to: animation },
      position: {
        top: '0px',
        right: '0px',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      successCallback(result);
    });
  }

  static showOverallrightDialoge(dialogAnimation: any, component, successCallback, pannelClass, animation,data) {
    const dialogRef = dialogAnimation.open(component, {
      disableClose: true,
      maxWidth: '98%',
      panelClass: pannelClass,
      animation: { to: animation },
      position: {
        top: '10px',
        right: '10px',
      },
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      successCallback(result);
    });
  }

  static showOverallrightSideDialoge(dialogAnimation: any, component, successCallback, pannelClass, animation, data?) {
    const dialogRef = dialogAnimation.open(component, {
      disableClose: true,
      maxWidth: '98%',
      panelClass: pannelClass,
      animation: { to: animation },
      position: {
        top: '10px',
        right: '10px',
      },
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      successCallback(result);
    });
  }

  static showOverallDialoge(dialog: any, component, successCallback, panelClass, data?) {
    const dialogRef = dialog.open(component, {
      disableClose: true,
      maxWidth: '98%',
      panelClass,
      position: {
        top: '10px',
      },
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      successCallback(result);
    });
  }

  static showPopupDialog(dialog: any, successcallback) {
    this.showMediumDialog(dialog, successcallback, 'global-dialog-medium');
  }

  static showGlobalMediumDialog(dialog: any, component: any, successcallback, data?) {
    this.showOverallDialoge(dialog, component, successcallback, 'global-dialog-medium', data);
  }

  static showSmallDialog(dialog: any, component: any, successcallback, data?) {
    this.showOverallDialoge(dialog, component, successcallback, 'global-dialog-small', data);
  }

  static showLargeDialog(dialog: any, component: any, successcallback, data?) {
    this.showOverallDialoge(dialog, component, successcallback, 'global-dialog-large', data);
  }

  static showRightDialog(dialog: any, component: any, successcallback, data?) {
    this.showOverallDialoge(dialog, component, successcallback, 'global-dialog-right', data);
  }

  static showRightLargeDialog(dialog: any, component: any, successcallback,data?) {
    this.showOverallrightDialoge(dialog, component, successcallback, 'global-dialog-right-big', 'left',data);
  }

  static showRightChatbotDialog(dialog: any, component: any, successcallback) {
    this.showOverallAnimationDialoge(dialog, component, successcallback, 'global-dialog-right-chatbot', 'left');
  }

  static showRightLargeWidthDialog(dialog: any, component: any, successcallback) {
    this.showOverallDialoge(dialog, component, successcallback, 'global-dialog-right-bigest');
  }

  static showRightSideLargeDialog(dialog: any, component: any, successcallback, data?) {

    
    this.showOverallrightSideDialoge(dialog, component, successcallback, 'global-dialog-right-bigest', 'right', data);
  }
}
