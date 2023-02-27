import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, NavigationExtras, Data } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from "../../services/api.service";
import { SharedataService } from "../../services/sharedata.service";
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-addmember',
  templateUrl: './addmember.component.html',
  styleUrls: ['./addmember.component.scss']
})
export class AddmemberComponent implements OnInit {
  addMemberForm: FormGroup
  memberList:any=[]
  form_status:any = 'new'
  edit_member:any=[]
  f1web: any = 0;
  web_status: any = 0;
  croppedImage: any = 'assets/imgs/default-pic.png';
  imageChangedEvent: any = '';
  public webcamImage: WebcamImage = null;
  adhar:any
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private share: SharedataService,
    private snackBar: MatSnackBar) { }
  generatecard_loading: false;
  addupdate_loading: false;
staff_rfid:any
  ngOnInit() {
   this.staff_rfid = sessionStorage.getItem('Staff_rfid');
    this.addMemberForm = this.formBuilder.group({
      myFile: [],
      document: [],
      document_back: [],
      fName: [],
      mobile: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      dob: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      id_prof: ['',Validators.required],
      gender: [],
      id_no: [],
      address: [],
      ref_Id: [],
      staff_rfid: [],
    })
let obj={
"staff_rfid":this.staff_rfid
}
    this.api.postapi("memberlist",obj).subscribe(res=>{
      
        this.memberList= res
        console.log("memberlist", this.memberList)
      
    })
  //   fName:new FormControl('',Validators.required),
  //   //lName:new FormControl('',Validators.required),
   
  //   mobile:new FormControl('',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
  //   dob:new FormControl(''),
  //     file:new FormControl(''),
  //        fileSource: new FormControl(''),
  //   email:new FormControl(''),
  //    gender:new FormControl('Male',Validators.required),  
  //   address:new FormControl('',Validators.required),
  //   ref_Id:new FormControl(''),
  //   id_prof:new FormControl('ADHAR CARD',Validators.required),
  // id_no:new FormControl('',Validators.required),
  //   f1:[''],
  //       f2:[''],
  //       f3:new FormControl('')

    if (this.share.get_member_id()) {
      this.form_status = 'update'
      this.edit_member = this.share.get_member_id()
      console.log('edit_member', this.edit_member)

      
      this.addMemberForm.controls.fName.setValue(this.edit_member.member_fname)
      this.addMemberForm.controls.mobile.setValue(this.edit_member.member_mobile)
      this.addMemberForm.controls.ref_Id.setValue(this.edit_member.reference_name)
      this.addMemberForm.controls.dob.setValue(this.edit_member.member_dob)
     
    }
  }
  closeWidge() {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be remove this widget!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#5e72e4',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, remove  it!',
    // }).then((result) => {
    //   if (result.value) {
    //     Swal.fire('Remove!', 'Widget has been removed.', 'success');
    //   }
    // });
  }

  fileChangeEvent(event) {
    
    this.imageChangedEvent = event.imageAsDataUrl;
    // console.log( " this.imageChangedEvent",this.imageChangedEvent)
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  private trigger: Subject<void> = new Subject<void>();
  triggerSnapshot(): void {
    this.trigger.next();
    console.log("this.trigger", this.trigger)
  }

  handleImage(webcamImage: WebcamImage): void {
    console.info('Saved webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.f1web = this.webcamImage.imageAsDataUrl;
    this.web_status = 1;
  }
  
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.f1web = event.base64
    console.log("f1web", this.f1web)
  }

  imageLoaded() {

  }

  cropperReady() {

  }

  loadImageFailed() {

  }

  adharcard(){
    if(this.addMemberForm.get('id_no').value.length == 4 || this.addMemberForm.get('id_no').value.length == 9){ 
     
     this.adhar=this.addMemberForm.get('id_no').value+'-'
  this.addMemberForm.controls['id_no'].setValue(this.adhar);
    }
// if(this.addMemberForm.get('id_no').value.length >12 ){
//   this.id_msg=""

// }
    
  }

  type_doc_status:any=1
  type_doc(e){
    if(e == "ADHAR CARD"){

     this.type_doc_status=1;
    }
    else{
      this.type_doc_status=0;

    }

  }

  doc_front:any=1
  doc_back:any=1
  done_front_status:any=0
  done_back_status:any=0
  front_done(){
    this.doc_front=sessionStorage.getItem("img")
    this.done_front_status=1
  }

  Back_done(){
    this.doc_back=sessionStorage.getItem("img")
    this.done_back_status=1
  }

  register_member(){
    this.addMemberForm.controls.myFile.setValue(this.f1web)
    this.addMemberForm.controls.document.setValue(this.doc_front)
    this.addMemberForm.controls.document_back.setValue(this.doc_back)
    this.api.postapi("insertMember12",this.addMemberForm.value).subscribe(res=>{
      if(res.status==1){
        console.log("insertMember12",this.addMemberForm)
        console.log("res",res)
      }
    })
  }
  
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

}
