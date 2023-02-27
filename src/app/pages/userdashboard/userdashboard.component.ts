import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import 'datatables.net';
import * as $ from 'jquery';
import 'jqueryui';
import 'datatables.mark.js'
import { AdmItem } from 'src/app/data-access/entities/admitem.entity';
import { AdmFile } from 'src/app/data-access/entities/admfile.entity';
import { DatabaseService } from 'src/app/data-access/database.service';
import { ConfirmationDialogService } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Epg } from 'src/app/data-access/entities/epg.entity';
import { Subnet } from 'src/app/data-access/entities/subnet.entity';
import { Tenants } from 'src/app/data-access/entities/tenants.entity';
import { Vrf } from 'src/app/data-access/entities/vrf.entity';
import { Bd } from 'src/app/data-access/entities/bd.entity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

var ipRangeCheck = require("ip-range-check");

import * as XLSX from 'xlsx';
import { Apicintegration } from 'src/app/data-access/entities/apicintegration.entity';
import { Pushfilter } from 'src/app/data-access/entities/pushfilter.entity';
import { Ports } from 'src/app/data-access/entities/ports.entity';

type AOA = any[][];

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.scss']
})
export class UserdashboardComponent implements OnInit {

  public records: any[] = [];
  public fileName = "Select .csv or .xlsx file";
  public uploadProgress = "";
  public alert_show = "";
  public uploading: boolean = false;
  public isViewFileRecords: boolean = false;
  @ViewChild('csvReader', { static: false }) csvReader: any;
  @ViewChild('closebutton', { static: false }) closebutton;
  @ViewChild('closebutton_apic', { static: false }) closebutton_apic;
  @ViewChild('closebutton_tenants', { static: false }) closebutton_tenants;
  public tableWidget: any;
  subnetsList: Subnet[] = [];
  admItemsList: AdmItem[] = [];
  newAdmItemsList: AdmItem[] = [];
  missAdmItemsList: AdmItem[] = [];

  admFilesList: AdmFile[] = [];
  insertedId: number = 0;
  isValue: number = 0;

  tenantsData: any[] = [];
  vrfData: any[] = [];
  epgData: any[] = [];
  epgBdData: any[] = [];
  epgSubnetData: any[] = [];
  bdData: any[] = [];
  bdSubnetData: any[] = [];
  apic_sync_success = false;
  apic_sync_fail = false;
  apic_syncing = false;
  apic_settings_success = false;
  push_filter_success = false;
  push_filter_fail = false;
  loading = false;
  submitted = false;
  source_epg = 'Select';
  dest_epg = 'Select';
  main_filter = 'Filter';
  // apicForm: FormGroup;

  profileName = '';
  profileEmail = '';
  lastUploadData = '';
  lastAPICSyncdata = '';
  isInitCalled = false;

  //excel 
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  // fileNameXl: string = 'Select .xlsx file';

  localTenantsList: Tenants[] = [];
  selectTenant = "No Tenants Found"
  selectedPushTenant = "";
  admItemSelectedList: AdmItem[] = [];
  pushFiltersList: Pushfilter[] = [];
  pushCheckedFiltersList: Pushfilter[] = [];
  masterSelected: boolean;

  localEPGsList: Epg[] = [];
  selectedFilterSourceEPG: Epg[] = [];
  selectedFilterDestEPG: Epg[] = [];

  // constructor(private translate: TranslateService, private appservice: AppService,private router: Router) {
  //   translate.setDefaultLang('en');
  // }
  constructor(private databaseService: DatabaseService, private router: Router, private confirmationDialogService: ConfirmationDialogService, private http: HttpClient, private formBuilder: FormBuilder) {
    this.masterSelected = false;
  }

  ngOnInit(): void {
    console.log('component initialized');
    // this.appservice.getItems().subscribe((items) => (this.itemList = items));

    $(document).ready(function () {
      let modalContent: any = $('.modal-content');
      let modalHeader = $('.modal-header');
      modalHeader.addClass('cursor-all-scroll');
      modalContent.draggable({
        handle: '.modal-header'
      });
    });


    this.getRecords();
    this.getLocalTenantsData();
    this.getLocalEPGsData();

    // this.init();

    // this.apicForm = this.formBuilder.group({
    //   ip: ['', Validators.required],
    //   uname: ['', Validators.required],
    //   pass: ['', Validators.required],
    // });

    // this.apicForm.controls['ip'].setValue(localStorage.getItem("apic_ip"));
    // this.apicForm.controls['uname'].setValue(localStorage.getItem("apic_uname"));
    // this.apicForm.controls['pass'].setValue(localStorage.getItem("apic_pass"));

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.profileName = currentUser.name;
    this.profileEmail = currentUser.email;

    let lastDate = localStorage.getItem("lastUploadData");
    this.lastUploadData = lastDate;
    console.log(lastDate)

    let lastAPICDate = localStorage.getItem("lastAPICSyncdata");
    this.lastAPICSyncdata = lastAPICDate;

    let isFirstTime = localStorage.getItem("isFirstTime");
    // alert(isFirstTime);
    if (isFirstTime === 'true') {
      document.getElementById("openModalButton").click();
    }

  }

  // get f() { return this.apicForm.controls; }
  initialize() {
    //$('.multiselect').select2();
    // this.searchFilters();
  }

  resetFilters(){
      this.reset(0)
      this.source_epg = "Select"
      this.dest_epg = "Select"

  }


  initDatatable(): void {

    $.fn.dataTable.ext.errMode = 'none';
    let viewrecord: any = $('#viewrecord').DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      mark: true,
      pageLength: 200,
      lengthMenu: [0, 5, 10, 20, 50, 100, 200, 500, 1000, 5000, 10000, 100000],
    });

    // $('.dataTables_filter input').unbind().bind('keyup', function () {
    //   var searchTerm = this.value.toLowerCase(),
    //     regex = '\\b' + searchTerm + '\\b';
    //   viewrecord.rows().search(regex, true, false).draw();
    // })



    // // Setup - add a text input to each footer cell
    $('#viewrecord thead tr').clone(false).appendTo('#viewrecord thead');
    $('#viewrecord thead tr:eq(1) th').each(function (i) {

      /*if (i == 0) {

        $(this).html('<div class="custom-control custom-control-alternative custom-checkbox"> \
      <input class="custom-control-input" id="check_list_all" type="checkbox"> \
      <label class="custom-control-label" for="check_list_all"> \
      </label> \
      </div>');

        // Handle click on "Select all" control
        $('#check_list_all').on('click', function () {
          // Check/uncheck all checkboxes in the table
          var rows = viewrecord.rows({ 'search': 'applied' }).nodes();
          $('input[type="checkbox"]', rows).prop('checked', this.checked);
        });


      } else {*/
      var title = $(this).text();
      $(this).html('<input type="text" placeholder="Search ' + title + '" style="width:80%" />');

      $('input', this).unbind().bind('keyup change clear', function () {
        if (viewrecord.columns(i).search() !== this.value) {

          // .search("^" + $(this).val() + "$", true, false, true)
          viewrecord.column(i).search($(this).val() ? '^' + $(this).val() + '$' : '', true, false).draw();
          // viewrecord.column(i).search( $(this).val()).draw();
        }
      });
      // }
    });


    //  viewrecord.columns().every(function() {
    //   var that = this;

    //   $('input', this.header()).on('keyup change', function() {
    //     if (that.search() !== this.value) {
    //       that
    //         .search(this.value)
    //         .draw();
    //     }
    //   });
    // });

  }

  


  checkUncheckAll() {
    for (var i = 0; i < this.pushFiltersList.length; i++) {
      this.pushFiltersList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.pushFiltersList.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.pushCheckedFiltersList = [];
    for (var i = 0; i < this.pushFiltersList.length; i++) {
      if (this.pushFiltersList[i].isSelected)
        this.pushCheckedFiltersList.push(this.pushFiltersList[i]);
    }
    this.pushCheckedFiltersList = this.pushCheckedFiltersList;
    console.log("getCheckedItemList : ", this.pushCheckedFiltersList)
  }

  getLocalTenantsData(): void {

    this.databaseService
      .connection
      .then(() => Tenants.find())
      .then(localTenants => {
        this.localTenantsList = localTenants;
        if (this.localTenantsList.length > 0) {
          this.selectTenant = "Select Tenant"
        }
      })

  }

  getLocalEPGsData(): void {

    this.databaseService
      .connection
      .then(() => Epg.find())
      .then(localEPGs => {
        this.localEPGsList = localEPGs;

      })

  }

  filterSourceEPG(epg) {
    this.source_epg = epg;
    this.selectedFilterSourceEPG = epg
  }

  filterDestEPG(epg) {
    this.dest_epg = epg;
    this.selectedFilterDestEPG = epg
  }

  searchFilters() {

    this.admItemsList.splice(0, this.admItemsList.length);
    this.admItemSelectedList.splice(0, this.admItemSelectedList.length);
    
    this.databaseService
      .connection
      .then(() => AdmItem.find({
        where: [{
          sepg: this.selectedFilterSourceEPG,
          depg: this.selectedFilterDestEPG
        },
        {
          sepg: this.selectedFilterDestEPG,
          depg: this.selectedFilterSourceEPG
        }
        ]
      }))
      .then(admitems => {
        this.admItemsList = admitems;
        for (let itemIndx in this.admItemsList) {
          this.admItemSelectedList.push(this.admItemsList[itemIndx]);
          console.log("admItemSelectedList>> : " + JSON.stringify(this.admItemSelectedList));
        }
        this.filterRationalizationFunction();
      })

      // let viewrecord: any = $('#viewrecord').DataTable()
      // // viewrecord.columns().search(this.selectedFilterSourceEPG,this.selectedFilterDestEPG).draw();

      // viewrecord.columns().every(function() {
      //     var that = this;
    
          
      //       // if (that.search() !== this.value) {
      //         that.search(this.selectedFilterSourceEPG).draw();
      //       // }
      //   });
    


    // setTimeout(() => {
    //   for (let itemIndx in this.admItemsList) {
    //     this.admItemSelectedList.push(this.admItemsList[itemIndx]);
    //     console.log("admItemSelectedList>> : " + JSON.stringify(this.admItemSelectedList));
    //   }
    //   this.filterRationalizationFunction();
    // }, 2000);
  }


  updateItem(e, type) {
    if (e.target.checked) {
      this.admItemSelectedList.push(type);
      console.log("admItemSelectedList>> : " + JSON.stringify(this.admItemSelectedList));

    }
    else {
      let updateItem = this.admItemSelectedList.find(this.findIndexToUpdate, type);

      let index = this.admItemSelectedList.indexOf(updateItem);

      this.admItemSelectedList.splice(index, 1);
      console.log("admItemSelectedList>> : " + JSON.stringify(this.admItemSelectedList));

    }

    this.filterRationalizationFunction();
  }

  findIndexToUpdate(type) {
    return type === this;
  }

  filterRationalizationFunction() {

    this.pushFiltersList = [];
    // let sport = "";
    // let dport = "";
    // let protocol = "";
    var sips = [];
    var sports = [];
    var dports = [];
    var dips = [];
    var protocols = [];

    var arr_sportsip = [];
    var arr_dportsip = [];
    var arr_sdports = [];

    var arr_dportsip_unique = [];
    var arr_s_sort_check = [];
    var arr_d_sort_check = [];
    var filter_arr_sdports = [];

    sips.splice(0, sips.length);
    sports.splice(0, sports.length);
    dips.splice(0, dips.length);
    dports.splice(0, dports.length);
    protocols.splice(0, protocols.length);
    this.pushFiltersList.splice(0, this.pushFiltersList.length);

    arr_sportsip.splice(0, arr_sportsip.length);
    arr_dportsip.splice(0, arr_dportsip.length);

    arr_sdports.splice(0, arr_sdports.length);

    arr_dportsip_unique.splice(0, arr_dportsip_unique.length);
    arr_s_sort_check.splice(0, arr_s_sort_check.length);
    arr_d_sort_check.splice(0, arr_d_sort_check.length);

    filter_arr_sdports.splice(0, filter_arr_sdports.length);

    //sort

    
    var sorted = this.admItemSelectedList.sort((a, b) => {
      return a.sport.localeCompare(b.sport)
    });
    console.log("sorted>> " + JSON.stringify(sorted))

    //push values
    for (const admitem of this.admItemSelectedList) {
      // protocols.push(Object.values(admitem)[1]+"_"+Object.values(admitem)[5]);

      if (!protocols.includes(Object.values(admitem)[1] + "_" + Object.values(admitem)[5])) {
        protocols.push(Object.values(admitem)[1] + "_" + Object.values(admitem)[5])
      }

      // sips.push(Object.values(admitem)[4]);
      // sports.push(Object.values(admitem)[2]);
      // dips.push(Object.values(admitem)[7]);
      // dports.push(Object.values(admitem)[5]);
      // console.log("sports>> " + Object.values(admitem)[2] + " | length: " + sports.length)
      // console.log("dports>> " + Object.values(admitem)[5] + " | length: " + dports.length)

      var protocol = Object.values(admitem)[1]
      var sport = Object.values(admitem)[2]
      var sip = Object.values(admitem)[4]
      var dport = Object.values(admitem)[5]
      var dip = Object.values(admitem)[7]

      // var sport_dport = "sport_" + sport + "_" + sip + "_dport_" + dport + "_" + dip
      // var dport_sport = "sport_" + dport + "_" + dip + "_dport_" + sport + "_" + sip

      // console.log("sport_dport : " + sport_dport + " | dport_sport : " + dport_sport)

      // var spip ={ protocol: protocol, sport: sport, sip: sip }  

      // arr_sportsip.push(protocol + "_" + sport + "_" + sip)
      // arr_dportsip.push(protocol + "_" + dport + "_" + dip)

      // arr_sportsip.push(protocol + "_" + sip + ":" + sport + "_" + dip + ":" + dport)
      // arr_dportsip.push(protocol + "_" + dip + ":" + dport + "_" + sip + ":" + sport)

      arr_sportsip.push(protocol + "_" + sport + "_" + dport)
      arr_dportsip.push(protocol + "_" + dport + "_" + sport)
      // console.log("arr_dportsip : " + protocol + "_" + dport)



      var spip = { protocol: protocol, sport: sport, sip: sip, key: protocol + "_" + sip + "_" + sport }
      if (!arr_s_sort_check.includes(spip)) {
        arr_s_sort_check.push(spip)
      }

      // if(!arr_d_sort_check.includes(protocol+ "_" + dip + "_" + dport)){
      //   arr_d_sort_check.push(protocol+ "_" + dip + "_" + dport)
      // }

    }

    console.log("arr_s_sort_check : " + JSON.stringify(arr_s_sort_check))
    // arr_s_sort_check = this.unique(arr_s_sort_check, "key")
    // console.log("arr_s_sort_check unique: " + JSON.stringify(arr_s_sort_check))


    const key = arr_s_sort_check[0].key;
    const count = arr_s_sort_check.filter((obj) => obj.key === key).length;
    console.log("count : " + count)


    if (count > 1) {
      arr_dportsip_unique = arr_sportsip.concat(arr_dportsip.filter((item) => arr_sportsip.indexOf(item) < 0))
      console.log("arr_sportsip unique : " + arr_dportsip_unique);
    }

    else {
      arr_dportsip_unique = arr_dportsip.concat(arr_sportsip.filter((item) => arr_dportsip.indexOf(item) < 0))
      console.log("arr_dportsip unique : " + arr_dportsip_unique);
    }

    for (let i = 0; i < arr_dportsip_unique.length; i++) {
      let dtemp = arr_dportsip_unique[i].split("_")
      let dp = dtemp[0]
      let d1 = dtemp[1]
      let d2 = dtemp[2]

      for (let j = 0; j < arr_dportsip_unique.length; j++) {
        let stemp = arr_dportsip_unique[j].split("_")
        let sp = dtemp[0]
        let s1 = stemp[1]
        let s2 = stemp[2]

        if (d1 === s2 && d2 === s1) {
          console.log("compare>> sp > " + d1 + "----" + s2 + " && " + d2 + "-----" + s1)
          // if(!arr_sdports.includes(dp+"_"+d1+"_"+d2)){
          //   arr_sdports.push(dp+"_"+d1+"_"+d2)
          //   }
          var index = arr_dportsip_unique.indexOf(sp + "_" + s1 + "_" + s2);
          arr_dportsip_unique.splice(index, 1);

        }
      }

    }


    console.log("arr_dportsip_unique_filter : " + arr_dportsip_unique)

    //check sort works start
    var checkPorts = [];
    checkPorts.splice(0, checkPorts.length);

    for (var iunique in arr_dportsip_unique) {

      let dtemp = arr_dportsip_unique[iunique].split("_")
      let dp = dtemp[0]
      let d1 = dtemp[1]
      let d2 = dtemp[2]

      checkPorts.push(d1)
    }  

    // const allEqual = arr => arr.every( v => v === arr[0] )
    // if(allEqual(checkPorts)){
    //   alert("allEqual")
    // }



    //check sort works end
    
    //end

    // $data = [[158, 159], [158, 159], [159, 158]];

    // $unique = array_unique(array_map(function ($item) {
    //     sort($item); return $item;
    // }, $data), SORT_REGULAR);

    // dump($unique); // This will output [[158, 159]]

    // var arr = [[7,3], [7,3], [3,8], [7,3], [7,3], [1,2]];

    // arr.map(JSON.stringify).reverse().filter(function (e, i, a) {
    //     return a.indexOf(e, i+1) === -1;
    // }).reverse().map(JSON.parse) // [[7,3], [3,8], [1,2]]


    // fetch max destination port 

    // const myArr = [{ type: 'one', number: 1, fiedld: 'aaa' }, { type: 'one', number: 2, field: 'bb' }, { type: 'two', number: 2, field: 'xxx' }, { type: 'two', number: 1, field: 'zz' }, { type: 'two', number: 3, field: 'y' }]

    // var result = Object.values(myArr.reduce(function (r, e) {
    //   if (!r[e.type]) r[e.type] = e;
    //   else if (e.number > r[e.type].number) r[e.type] = e;
    //   return r;
    // }, {}))

    // console.log(result)

    /*var counts = {};
    // arr_sportsip.forEach(function (x) {
    //   counts[x] = (counts[x] || 0) + 1;
    // });
    arr_dportsip.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    var jsonText = JSON.stringify(counts)
    console.log("jsonText : " + jsonText);

    var arr_max = [];
    console.log("protocols : " + protocols)

    for (let pindex in protocols) {

      var data = JSON.parse(jsonText)
      var maxProp = null
      var maxValue = -1
      for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
          if (protocols[pindex] === prop.split("_")[0]+"_"+prop.split("_")[1]) {
            var value = data[prop]
            if (value > maxValue) {
              maxProp = prop
              maxValue = value
            }
          }
        }
      }
      if (!arr_max.includes(maxProp)) {
        arr_max.push(maxProp)
      }


      // console.log("maxProp : " + maxProp + " maxValue : " + maxValue)

    }
    console.log("arr_max : " + arr_max)*/


    //end 

    this.pushFiltersList.splice(0, this.pushFiltersList.length);
    for (var iunique in arr_dportsip_unique) {

      let dtemp = arr_dportsip_unique[iunique].split("_")
      let dp = dtemp[0]
      let d1 = dtemp[1]
      let d2 = dtemp[2]


      var sparr = [];
      sparr.splice(0, sparr.length);

      for (let j = 0; j < arr_dportsip_unique.length; j++) {
        let stemp = arr_dportsip_unique[j].split("_")
        let sp = stemp[0]
        let s1 = stemp[1]
        let s2 = stemp[2]

        if (dp === sp && d1 === s1) {
          console.log("dp : " + dp + " | sp : " + sp)
          sparr.push(s2)
        }

      }

      console.log("sparr>> " + sparr)

      if (Object.values(sparr).every((val, i, arr) => val === arr[0])) {
        d2 = sparr[0];
      } else {
        d2 = "any"
      }

      let createFilterName = "sport_" + d2 + "_dport_" + d1
      console.log("createFilterName dport same >> " + createFilterName + " | " + sports);

      protocol = dp;

      // var i_s_d = prop.split("_")

      let pushfilter = new Pushfilter();
      pushfilter.filtername = createFilterName;
      pushfilter.ethertype = "ip";
      pushfilter.protocol = protocol;
      if (d2 == "any") {
        d2 = "any"
      }
      pushfilter.sport = d2;
      pushfilter.dport = d1;
      pushfilter.key = protocol + "_" + d1
      pushfilter.isSelected = true
      this.pushFiltersList.push(pushfilter)

    }

    console.log("pushFiltersList>>" + JSON.stringify(this.pushFiltersList));


    /*   for (var prop in data) {
         if (data.hasOwnProperty(prop)) {
           var value = data[prop]
   
           if (value != maxValue) {
   
             if (Object.values(sports).every((val, i, arr) => val === arr[0])) {
               sport = sports[0];
             } else {
               sport = "any"
             }
   
             // let createFilterName = "sport_" + prop.split("_")[0] +"_dport_" + maxProp.split("_")[0]
             let createFilterName = "sport_" + sport + "_dport_" + maxProp.split("_")[0]
             console.log("createFilterName dport same >> " + createFilterName + " | " + sports);
   
             protocol = protocols[0];
   
             var i_s_d = prop.split("_")
   
             let pushfilter = new Pushfilter();
             pushfilter.filtername = createFilterName;
             pushfilter.ethertype = "ip";
             pushfilter.protocol = protocol;
             pushfilter.sport = i_s_d[0];
             pushfilter.dport = maxProp.split("_")[0];
             this.pushFiltersList.push(pushfilter)
   
           }
         }
       }*/


    /*  for (let index in arr_sdports) {
  
        let createFilterName = arr_sdports[index]
        console.log("createFilterName dport same >> " + createFilterName + " | " + sports);
  
        protocol = protocols[0];
        var i_s_d = arr_sdports[index].split("_")
  
        let pushfilter = new Pushfilter();
        pushfilter.filtername = createFilterName;
        pushfilter.ethertype = "ip";
        pushfilter.protocol = protocol;
        pushfilter.sport = i_s_d[0];
        pushfilter.dport = i_s_d[1];
        this.pushFiltersList.push(pushfilter)
  
      }*/

    setTimeout(() => {
      
      this.pushFiltersList = this.unique(this.pushFiltersList, "key")
      console.log("pushFiltersList Unique length>>" + this.pushFiltersList.length);
      this.getCheckedItemList();
    }, 2000);

    // for (let i =0 ; i < arr_sdports.length ; i++){
    //   var i_s_d = arr_sdports[i].split("_")    
    //   console.log("i_s_d : " + i_s_d[0] + " | " +i_s_d[1])


    //   for (let j =0 ; j < arr_sdports.length ; j++){
    //     var j_s_d = arr_sdports[j].split("_")
    //     console.log("j_s_d : " + j_s_d[0] + " | " +j_s_d[1])

    //     if((i_s_d[0] == j_s_d[0]) && (i_s_d[0] == j_s_d[0])){
    //       console.log("i_s_d == j_s_d")

    //     }
    //     else if((i_s_d[0] != j_s_d[1]) && (i_s_d[1] != j_s_d[0])){

    //       filter_arr_sdports.push(arr_sdports[i])

    //     }

    //   }

    // }

    // console.log("filter_arr_sdports : " + filter_arr_sdports)


    /* if (Object.values(sports).every((val, i, arr) => val === arr[0])) {
       sport = sports[0];
       //here need to add condition for well known port for sport
 
       this.databaseService
         .connection
         .then(() => Ports.find({
           where: [{ port: sport }]
         }))
         .then(port => {
           if (port.length > 0)
             sport = port[0].name
         })
 
     } else {
       sport = "any";
     }
 
     if (Object.values(dports).every((val, i, arr) => val === arr[0])) {
       if (dports.length > 0) {
         
         protocol = protocols[0];
         //here need to add condition for well known port for dport
 
         this.databaseService
           .connection
           .then(() => Ports.find({
             where: [{ port: dports[0] }]
           }))
           .then(port => {
             if (port.length > 0) {
               dport = port[0].name
             }else{
               dport = dports[0];
             }
 
             let createFilterName = "sport_" + sport + "_dport_" + dport;
             console.log("createFilterName dport same >> " + createFilterName + " | " + sports);
 
             let pushfilter = new Pushfilter();
             pushfilter.filtername = createFilterName;
             pushfilter.ethertype = "ip";
             pushfilter.protocol = protocol;
             pushfilter.sport = sport;
             pushfilter.dport = dports[0];
             this.pushFiltersList.push(pushfilter)
           })
 
 
 
       }
 
     } else {
       // dport = "any";
 
       for (let index in dports) {
         
 
         this.databaseService
           .connection
           .then(() => Ports.find({
             where: [{ port: dports[index] }]
           }))
           .then(port => {
             if (port.length > 0) {
               dport = port[0].name
             }
             else {
               dport = dports[index]
             }
 
         
 
         let createFilterName = "sport_" + sport + "_dport_" + dport;
         console.log("createFilterName dport diff>> " + createFilterName + " | " + sports);
 
             let pushfilter = new Pushfilter();
             pushfilter.filtername = createFilterName;
             pushfilter.ethertype = "ip";
             pushfilter.protocol = protocols[index];
             pushfilter.sport = sport;
             pushfilter.dport = dports[index];
 
             this.pushFiltersList.push(pushfilter)
           })
 
       }
 
       setTimeout(() => {
         this.pushFiltersList = this.unique(this.pushFiltersList, "dport")
       console.log("pushFiltersList Unique length>>"+this.pushFiltersList.length);
       }, 2000);
       
     }*/


  }

  unique(array, propertyName) {
    return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
  }

  onItemChange(value) {
    console.log(" Value is : ", value);
    this.selectedPushTenant = value;
  }

  pushSelectedFilterAPIC(): void {
    if (this.selectedPushTenant != "") {

      this.databaseService
        .connection
        .then(() => Apicintegration.find({
          where: [{ isDefaultAPIC: 1 }]
        }))
        .then(apic => {

          this.http
            .post('https://' + apic[0].ip + '/api/aaaLogin.json',
              {
                "aaaUser": {
                  "attributes": {
                    // "name": localStorage.getItem("apic_uname"),
                    // "pwd": localStorage.getItem("apic_pass")
                    "name": apic[0].uname,
                    "pwd": apic[0].pass
                  }
                }
              }
            )
            .subscribe((res: any) => {
              //do something with the response here
              console.log(res);

              for (const pushfilter of this.pushCheckedFiltersList) {
                let rn = 'flt-' + pushfilter.filtername;
                let dn = this.selectedPushTenant + '/' + rn;
                let name = pushfilter.filtername;
                let e_rn = 'e-' + pushfilter.filtername;
                let e_dn = dn + '/' + e_rn;
                let etherT = pushfilter.ethertype;
                let dFromPort = pushfilter.dport;
                let dToPort = pushfilter.dport;
                let prot = pushfilter.protocol;


                this.http
                  .post('https://' + apic[0].ip + '/api/node/mo/' + dn + '.json',
                    {
                      "vzFilter": {
                        "attributes": {
                          "dn": dn,
                          "name": name,
                          "rn": rn,
                          "status": "created,modified"
                        },
                        "children": [
                          {
                            "vzEntry": {
                              "attributes": {
                                "dn": e_dn,
                                "name": name,
                                "nameAlias": name,
                                "etherT": etherT,
                                "prot": prot,
                                "dFromPort": dFromPort,
                                "dToPort": dToPort,
                                "rn": e_rn,
                                "status": "created,modified"
                              },
                              "children": []
                            }
                          }
                        ]
                      }
                    }
                  )
                  .subscribe((res: any) => {
                    //do something with the response here
                    console.log(res);
                    // alert("Filters pushed successfully!")
                    this.push_filter_success = true
                    this.closebutton_tenants.nativeElement.click();
                  }, (error) => {                              //Error callback
                    // console.error('error caught in component')
                    // this.errorMessage = error;
                    // this.loading = false;
                    console.log(error);
                    this.push_filter_success = false


                    if (error.status == 401 || error.status == 400 || error.status == 0) {
                      let imdata: any = JSON.stringify(error.error.imdata[0]);
                      alert("Error : " + JSON.parse(imdata).error.attributes.text)
                      return;
                    }

                  })
              }

            }, (error) => {                              //Error callback
              // console.error('error caught in component')
              // this.errorMessage = error;
              // this.loading = false;
              console.log(error);
              // let imdata =error.imdata[0];

              if (error.status == 401 || error.status == 400 || error.status == 0) {
                // alert("Authentication failed!")
                this.push_filter_fail = true
                setTimeout(() => {
                  this.push_filter_fail = false  
                }, 5000);
                
                return;
              }

            })
        })


    } else {
      alert("Please select tenant.")
    }
  }



  // onSubmit() {
  //   this.submitted = true;

  //   // reset alerts on submit
  //   // this.alertService.clear();


  //   this.apic_settings_success = false;

  //   // stop here if form is invalid
  //   if (this.apicForm.invalid) {
  //     return;
  //   }

  //   this.databaseService
  //     .connection
  //     .then(() => {
  //       // let apic = new Apic();
  //       // apic.ip=this.f.ip.value;
  //       // apic.uname=this.f.uname.value;
  //       // apic.pass=this.f.pass.value;
  //       // apic.save()      


  //       localStorage.setItem('apic_ip', this.f.ip.value);
  //       localStorage.setItem('apic_uname', this.f.uname.value);
  //       localStorage.setItem('apic_pass', this.f.pass.value);
  //       this.apic_settings_success = true

  //     })
  //     .then(() => {
  //       setTimeout(() => {
  //         // this.router.navigate(['/userdashboard']);
  //         this.closebutton_apic.nativeElement.click();
  //         this.apic_settings_success = false;
  //       }, 1000);


  //     })

  // }

  next(): void {
    this.uploadProgress = "";
    this.closebutton.nativeElement.click();
    // if(!this.isInitCalled)
    // this.getRecords();
  }

  finish(): void {
    this.closebutton_apic.nativeElement.click();
    //this.getTenantsData();
    this.syncAPICData();
  }

  /* init(): void {
     // this.appservice.getAdmItems().subscribe((admitems) => (this.admItemsList = admitems));
     // this.appservice.getAdmFiles().subscribe((admfiles) => (this.admFilesList = admfiles));
     this.databaseService
       .connection
       .then(() => AdmItem.find())
       .then(admitems => {
         this.admItemsList = admitems;
         console.log("admItemsList : " + this.admItemsList.length)
         setTimeout(() => {
           if (admitems.length > 0 && !this.isInitCalled) {
             this.initDatatable()
             this.isInitCalled = true;
           }
 
         }, 2000);
       })
       .then(() => AdmItem.find({
         where: {
           isNewDupMiss: 1, // new flows since last sync
         }
       }))
       .then(newadmitems => {
         this.newAdmItemsList = newadmitems;
       })
       .then(() => AdmItem.find({
         where: {
           isNewDupMiss: 0, // absent flows since last sync
         }
       }))
       .then(missadmitems => {
         this.missAdmItemsList = missadmitems;
       })
 
   }*/

  getRecords(): void {
    // alert("getRecords")
    // this.appservice.getAdmItems().subscribe((admitems) => (this.admItemsList = admitems));
    // this.appservice.getAdmFiles().subscribe((admfiles) => (this.admFilesList = admfiles));
    this.databaseService
      .connection
      .then(() => AdmItem.find())
      .then(admitems => {
        this.admItemsList = admitems;

        setTimeout(() => {
          if (this.admItemsList.length > 0 && this.isInitCalled != true) {
            this.initDatatable()
            this.isInitCalled = true;
          }
        }, 5000);

        console.log("admItemsList : " + this.admItemsList.length)
      })
      .then(() => AdmItem.find({
        where: {
          isNewDupMiss: 1, // new flows since last sync
        }
      }))
      .then(newadmitems => {
        this.newAdmItemsList = newadmitems;
      })
      .then(() => AdmItem.find({
        where: {
          isNewDupMiss: 0, // absent flows since last sync
        }
      }))
      .then(missadmitems => {
        this.missAdmItemsList = missadmitems;
      })

    this.databaseService
      .connection
      .then(() => AdmFile.find({
        order: {
          uploaddate: "DESC"
        },
        take: 10
      }))
      .then(admfiles => {
        this.admFilesList = admfiles;
      })

    console.log('recent data', this.admFilesList);
  }

  // addItem(): void {
  //   let item = new Item();
  //   item.name = 'Item ' + this.itemList.length;
  //   this.appservice.addItem(item).subscribe((items) => (this.itemList = items));
  // }

  uploadData(): void {
    // console.log('data', this.records[0].protocol);
    // console.log('length', this.records.length);



    if (this.records.length > 0) {
      this.uploading = true;

      let admfile = new AdmFile();
      admfile.filename = this.fileName;
      admfile.totalrecords = this.records.length;
      admfile.filepath = "/assets/data/uploads/" + admfile.filename;
      const current = new Date();
      admfile.uploaddate = current;
      // let a = this.appservice.addAdmFile(admfile);
      // console.log("addAdmFile : " + a);

      this.databaseService
        .connection
        .then(() => AdmItem.find())
        .then(admitemlist => {
          admitemlist.forEach(admitem => {
            admitem.isNewDupMiss = 0; // update to missed record
            AdmItem.save(admitem);
          });

        })
        .then(() => admfile.save())
        .then(admfile => {
          this.insertedId = admfile.id
          console.log("insertedId : " + admfile.id)

          for (let i = 0; i <= this.records.length; i++) {
            let rec = this.records[i];
            if (rec) {
              let admitem = new AdmItem();
              admitem.protocol = rec.protocol;
              admitem.sport = rec.sport;
              admitem.saddr = rec.saddr;
              admitem.sepg = rec.sepg;
              admitem.dport = rec.dport;
              admitem.daddr = rec.daddr;
              admitem.depg = rec.depg;
              admitem.admfile = admfile;
              admitem.file_id = this.insertedId;
              // this.appservice.addAdmItem(admitem);

              this.databaseService
                .connection
                .then(() => AdmItem.find({
                  where: {
                    protocol: rec.protocol,
                    sport: rec.sport,
                    saddr: rec.saddr,
                    dport: rec.dport,
                    daddr: rec.daddr
                  }
                })
                )
                .then(item => {
                  setTimeout(() => {

                    if (item.length > 0) {
                      console.log("duplicateitem>>>>" + item[0].id);
                      item[0].isNewDupMiss = 2; // update duplicate
                      AdmItem.save(item);
                    } else {
                      admitem.isNewDupMiss = 1; // new
                      admitem.save();
                    }

                    this.uploadProgress = i + " of " + this.records.length + " records uploaded."
                    if ((i + 1) === this.records.length) {
                      this.reset(i)
                    }
                  }, 500);

                })

            }
          }

        })
        .then(() => {
          const current = new Date();
          this.lastUploadData = current.toLocaleString();
          localStorage.setItem("lastUploadData", current.toLocaleString());
        })
    } else {
      alert("Upload Error! Please upload valid file.")
    }
  }

  reset(i: number): void {


    setTimeout(() => {
      this.fileReset();
      this.getRecords();
      this.uploading = false;
      this.alert_show = "alert_show";
      this.uploadProgress = "FILE UPLOADED SUCCESSFULLY";
      this.admItemSelectedList = [];
    }, 1000);

  }


  // deleteItem(): void {
  //   const item = this.itemList[this.itemList.length - 1];
  //   this.appservice
  //     .deleteItem(item)
  //     .subscribe((items) => (this.itemList = items));
  // }

  fileChooseListener($event: any): void {

    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      this.uploadListener($event);
    } else if (this.isValidXLFile(files[0])) {
      this.onFileChange($event);
    }
  }

  uploadListener($event: any): void {

    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);



        let headersRow = this.getHeaderArray(csvRecordsArray);

        console.log("headersRow : " + headersRow);



        // this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length, headersRow);

        this.fileName = files[0].name;

      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  //import excel start
  onFileChange($event: any) {

    let files = $event.srcElement.files;

    if (this.isValidXLFile(files[0])) {


      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>($event.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
        console.log("this.data : " + this.data);


        this.getDataRecordsArrayFromXLFile(this.data);

        this.fileName = files[0].name;

      };
      reader.readAsBinaryString(target.files[0]);

    } else {
      alert("Please import valid .xlsx file.");
      this.fileReset();
    }
  }

  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
  //import excel end


  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any, headersRow: any) {

    let sip = ["source ip address", "sip", "source ip", "sourceip", "srcip", "srcaddr"]
    let dip = ["destination ip address", "dip", "destination ip", "destinationip", "dstip", "dstaddr"]
    let sp = ["source Port", "sport", "srcport"]
    let dp = ["destination port", "dport", "dstport"]
    let p = ["protocol", "proto", "prot"]

    let isip = 0
    if (sip.includes(headersRow[0].toLowerCase())) {
      isip = 0
    } else if (sip.includes(headersRow[1].toLowerCase())) {
      isip = 1
    } else if (sip.includes(headersRow[2].toLowerCase())) {
      isip = 2
    } else if (sip.includes(headersRow[3].toLowerCase())) {
      isip = 3
    } else if (sip.includes(headersRow[4].toLowerCase())) {
      isip = 4
    }


    let idip = 0
    if (dip.includes(headersRow[0].toLowerCase())) {
      idip = 0
    } else if (dip.includes(headersRow[1].toLowerCase())) {
      idip = 1
    } else if (dip.includes(headersRow[2].toLowerCase())) {
      idip = 2
    } else if (dip.includes(headersRow[3].toLowerCase())) {
      idip = 3
    } else if (dip.includes(headersRow[4].toLowerCase())) {
      idip = 4
    }

    let isp = 0
    if (sp.includes(headersRow[0].toLowerCase())) {
      isp = 0
    } else if (sp.includes(headersRow[1].toLowerCase())) {
      isp = 1
    } else if (sp.includes(headersRow[2].toLowerCase())) {
      isp = 2
    } else if (sp.includes(headersRow[3].toLowerCase())) {
      isp = 3
    } else if (sp.includes(headersRow[4].toLowerCase())) {
      isp = 4
    }

    let idp = 0
    if (dp.includes(headersRow[0].toLowerCase())) {
      idp = 0
    } else if (dp.includes(headersRow[1].toLowerCase())) {
      idp = 1
    } else if (dp.includes(headersRow[2].toLowerCase())) {
      idp = 2
    } else if (dp.includes(headersRow[3].toLowerCase())) {
      idp = 3
    } else if (dp.includes(headersRow[4].toLowerCase())) {
      idp = 4
    }

    let ip = 0
    if (p.includes(headersRow[0].toLowerCase())) {
      ip = 0
    } else if (p.includes(headersRow[1].toLowerCase())) {
      ip = 1
    } else if (p.includes(headersRow[2].toLowerCase())) {
      ip = 2
    } else if (p.includes(headersRow[3].toLowerCase())) {
      ip = 3
    } else if (p.includes(headersRow[4].toLowerCase())) {
      ip = 4
    }

    this.databaseService
      .connection
      .then(() => Subnet.find())
      .then(subnets => {
        console.log("subnets" + subnets);

        // let csvArr = [];
        for (let i = 1; i < csvRecordsArray.length; i++) {
          let curruntRecord = (<string>csvRecordsArray[i]).split(',');



          if (curruntRecord.length == headerLength) {
            let admItem: AdmItem = new AdmItem();
            admItem.protocol = curruntRecord[ip].trim();
            admItem.sport = curruntRecord[isp].trim();
            admItem.saddr = curruntRecord[isip].trim();
            admItem.dport = curruntRecord[idp].trim();
            admItem.daddr = curruntRecord[idip].trim();

            for (let s = 0; s < subnets.length; s++) {
              // if (admItem.saddr != null && subnets[s].ip && subnets[s].ip.includes(admItem.saddr)) {
              //   admItem.sepg = subnets[s].epg_name;
              // }
              // if (admItem.daddr != null && subnets[s].ip && subnets[s].ip.includes(admItem.daddr)) {
              //   admItem.depg = subnets[s].epg_name;
              // }

              if (admItem.saddr != null && subnets[s].ip != null && ipRangeCheck(admItem.saddr, subnets[s].ip)) {
                admItem.sepg = subnets[s].epg_name;
              }

              if (admItem.daddr != null && subnets[s].ip != null && ipRangeCheck(admItem.daddr, subnets[s].ip)) {
                admItem.depg = subnets[s].epg_name;
              }
            }

            // csvRecord.mobile = curruntRecord[5].trim();  
            // csvArr.push(admItem);
            this.records.push(admItem);
          }
        }
        // return csvArr;
      })
  }

  getDataRecordsArrayFromXLFile(xlRecordsArray: any) {

    let headersRow = xlRecordsArray[0];
    let sip = ["source ip address", "sip", "source ip", "sourceip", "srcip", "srcaddr"]
    let dip = ["destination ip address", "dip", "destination ip", "destinationip", "dstip", "dstaddr"]
    let sp = ["source Port", "sport", "srcport"]
    let dp = ["destination port", "dport", "dstport"]
    let p = ["protocol", "proto", "prot"]

    console.log("sip>>>>"+ sip + " | " +headersRow[0].toLowerCase())

    let isip = 0
    if (sip.includes(headersRow[0].toLowerCase())) {
      isip = 0
    } else if (sip.includes(headersRow[1].toLowerCase())) {
      isip = 1
    } else if (sip.includes(headersRow[2].toLowerCase())) {
      isip = 2
    } else if (sip.includes(headersRow[3].toLowerCase())) {
      isip = 3
    } else if (sip.includes(headersRow[4].toLowerCase())) {
      isip = 4
    }


    let idip = 0
    if (dip.includes(headersRow[0].toLowerCase())) {
      idip = 0
    } else if (dip.includes(headersRow[1].toLowerCase())) {
      idip = 1
    } else if (dip.includes(headersRow[2].toLowerCase())) {
      idip = 2
    } else if (dip.includes(headersRow[3].toLowerCase())) {
      idip = 3
    } else if (dip.includes(headersRow[4].toLowerCase())) {
      idip = 4
    }

    let isp = 0
    if (sp.includes(headersRow[0].toLowerCase())) {
      isp = 0
    } else if (sp.includes(headersRow[1].toLowerCase())) {
      isp = 1
    } else if (sp.includes(headersRow[2].toLowerCase())) {
      isp = 2
    } else if (sp.includes(headersRow[3].toLowerCase())) {
      isp = 3
    } else if (sp.includes(headersRow[4].toLowerCase())) {
      isp = 4
    }

    let idp = 0
    if (dp.includes(headersRow[0].toLowerCase())) {
      idp = 0
    } else if (dp.includes(headersRow[1].toLowerCase())) {
      idp = 1
    } else if (dp.includes(headersRow[2].toLowerCase())) {
      idp = 2
    } else if (dp.includes(headersRow[3].toLowerCase())) {
      idp = 3
    } else if (dp.includes(headersRow[4].toLowerCase())) {
      idp = 4
    }

    let ip = 0
    if (p.includes(headersRow[0].toLowerCase())) {
      ip = 0
    } else if (p.includes(headersRow[1].toLowerCase())) {
      ip = 1
    } else if (p.includes(headersRow[2].toLowerCase())) {
      ip = 2
    } else if (p.includes(headersRow[3].toLowerCase())) {
      ip = 3
    } else if (p.includes(headersRow[4].toLowerCase())) {
      ip = 4
    }


    this.databaseService
      .connection
      .then(() => Subnet.find())
      .then(subnets => {
        console.log("subnets" + subnets);

        // let csvArr = [];
        for (let i = 1; i < xlRecordsArray.length; i++) {
          let curruntRecord = (<string>xlRecordsArray[i]);
          console.log("curruntRecord : " + curruntRecord)
          // if (curruntRecord.length == headerLength) {
          let admItem: AdmItem = new AdmItem();
          admItem.protocol = curruntRecord[ip];
          admItem.sport = curruntRecord[isp];
          admItem.saddr = curruntRecord[isip];
          admItem.dport = curruntRecord[idp];
          admItem.daddr = curruntRecord[idip];

          for (let s = 0; s < subnets.length; s++) {
            // if (admItem.saddr != null && subnets[s].ip && subnets[s].ip.includes(admItem.saddr)) {
            //   admItem.sepg = subnets[s].epg_name;
            // }
            // if (admItem.daddr != null && subnets[s].ip && subnets[s].ip.includes(admItem.daddr)) {
            //   admItem.depg = subnets[s].epg_name;
            // }

            if (admItem.saddr != null && subnets[s].ip != null && ipRangeCheck(admItem.saddr, subnets[s].ip)) {
              admItem.sepg = subnets[s].epg_name;
            }

            if (admItem.daddr != null && subnets[s].ip != null && ipRangeCheck(admItem.daddr, subnets[s].ip)) {
              admItem.depg = subnets[s].epg_name;
            }
          }

          // csvRecord.mobile = curruntRecord[5].trim();  
          // csvArr.push(admItem);
          this.records.push(admItem);
          // }
        }
        // return csvArr;
      })
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  isValidXLFile(file: any) {
    return file.name.endsWith(".xlsx");
  }


  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.fileName = "Select .csv or .xlsx file";
    // this.fileNameXl = "Select .xlsx file";
    // this.uploadProgress = "";
    this.uploading = false;
    this.isViewFileRecords = false;
  }

  viewFileRecords() {
    // this.appservice.navigateDirectory();   
    // this.router.navigate(['/dashboard']);
    this.isViewFileRecords = true;
  }

  public openConfirmationDialog(id: number) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete ?')
      .then((confirmed) => {
        console.log('User confirmed:', confirmed)

        if (confirmed) {
          this.deleteFile(id);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  deleteFile(id) {
    this.databaseService
      .connection
      .then(() => AdmFile.find({
        where: [{ id: id }]
      }))
      .then(admfile => {
        AdmFile.remove(admfile);
        setTimeout(() => {
          this.getRecords()
        }, 2000);
      })
    // .then(() => this.initDatatable())

    // this.databaseService
    // .connection
    // .then(() => AdmFile.find())
    // .then(admfiles => {
    //     this.admFilesList = admfiles;
    // })

    //this.initDatatable();
  }

  downloadFileRecords(id: number): void {
    // this.appservice.getAdmItems().subscribe((admitems) => (this.admItemsList = admitems));
    // this.appservice.getAdmFiles().subscribe((admfiles) => (this.admFilesList = admfiles));
    this.databaseService
      .connection
      .then(() => AdmItem.find({
        where: [{ admfileId: id }]
      }))
      .then(admitems => {

        this.downloadFile(admitems)

      })
  }

  downloadFile(data, filename = 'data') {
    let csvData = this.ConvertToCSV(data, ['protocol', 'sport', 'saddr', 'dport', 'daddr']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 's.no,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];

        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }

  syncAPICData() {
    this.databaseService
      .connection
      .then(() => Apicintegration.find({
        where: [{ isDefaultAPIC: 1 }]
      }))
      .then(apic => {
        this.getTenantsData(apic[0].ip, apic[0].uname, apic[0].pass);
      })
  }

  // tenants
  getTenantsData(apic_ip, apic_uname, apic_pass) {

    this.apic_sync_success = false;
    this.apic_sync_fail = false;
    this.apic_syncing = true;
    this.databaseService
      .connection
      .then(async (connection) => {
        // if (process.env.NODE_ENV === 'development') {
        // await connection.dropDatabase();
        // await connection.synchronize();
        // }

        const entities = connection.entityMetadatas;

        for (const entity of entities) {
          if (entity.name === 'Tenants' || entity.name === 'Vrf' || entity.name === 'Epg' || entity.name === 'Subnet' || entity.name === 'Bd') {
            const repository = await connection.getRepository(entity.name);
            await repository.query(`DELETE FROM ${entity.tableName};`);
            await repository.query(`DELETE FROM sqlite_sequence WHERE name='${entity.tableName}'`);
          }
        }

      }).catch((err) => console.error(err))
      .then(() => {

        this.http
          .post('https://' + apic_ip + '/api/aaaLogin.json',
            {
              "aaaUser": {
                "attributes": {
                  // "name": localStorage.getItem("apic_uname"),
                  // "pwd": localStorage.getItem("apic_pass")
                  "name": apic_uname,
                  "pwd": apic_pass
                }
              }
            }
          )
          .subscribe((res: any) => {
            //do something with the response here
            console.log(res);


            this.http
              //Application EPGs 
              .get('https://' + apic_ip + '/api/node/class/fvTenant.json')

              .subscribe((res: any) => {
                //do something with the response here
                console.log(res);

                // let imdata =res.imdata[0];
                // console.log(imdata.fvBD.attributes.name);


                this.tenantsData = res.imdata;

                for (let i = 0; i < this.tenantsData.length; i++) {
                  let rec = this.tenantsData[i];
                  if (rec) {
                    let tenants = new Tenants();
                    tenants.name = rec.fvTenant.attributes.name;
                    tenants.dn = rec.fvTenant.attributes.dn;
                    this.databaseService
                      .connection
                      .then(() => tenants.save())
                      .then(tenants => {

                        this.insertedId = tenants.id;
                        console.log("insertedId : " + tenants.id);

                        this.getVrfsData(tenants, apic_ip);
                        setTimeout(() => {
                          this.getBDsData(tenants, apic_ip);
                        }, 5000);


                      })

                  }

                }

              });

          }, (error) => {                              //Error callback
            // console.error('error caught in component')
            // this.errorMessage = error;
            // this.loading = false;
            console.log(error);
            // let imdata =error.imdata[0];

            if (error.status == 401 || error.status == 400 || error.status == 0) {
              this.apic_sync_fail = true;
              this.apic_syncing = false
              return;
            }

          });

      })

  }


  //vrf
  getVrfsData(tenants, apic_ip) {

    this.http
      .get('https://' + apic_ip + '/api/node/mo/' + tenants.dn + '.json?query-target=subtree&target-subtree-class=fvAp&target-subtree-class=tagAliasInst&query-target=subtree')
      .subscribe((res: any) => {
        //do something with the response here
        console.log(res);

        this.vrfData = res.imdata;

        for (let i = 0; i < this.vrfData.length; i++) {
          let rec = this.vrfData[i];
          if (rec) {
            let vrf = new Vrf();
            vrf.dn = rec.fvAp.attributes.dn;
            vrf.name = rec.fvAp.attributes.name;
            vrf.tenants_id = tenants.id;
            vrf.tenants_name = tenants.name;
            vrf.tenants = tenants;

            this.databaseService
              .connection
              .then(() => vrf.save())
              .then(vrf => {

                this.insertedId = vrf.id;
                console.log("insertedId : " + vrf.id);

                this.getEPGsData(vrf, apic_ip);


              })

          }
        }

      });
  }




  //epg
  getEPGsData(vrf, apic_ip) {


    this.http
      //Application EPGs 
      .get('https://' + apic_ip + '/api/node/mo/' + vrf.dn + '.json?query-target=subtree&target-subtree-class=fvAEPg&query-target-filter=eq(fvAEPg.isAttrBasedEPg,"false")&query-target=subtree&target-subtree-class=fvRsProv,fvRsCons,tagAliasInst')

      .subscribe((res: any) => {
        //do something with the response here
        console.log(res);

        // let imdata =res.imdata[0];
        // console.log(imdata.fvBD.attributes.name);


        this.epgData = res.imdata;

        for (let i = 0; i < this.epgData.length; i++) {
          let rec = this.epgData[i];
          if (rec) {
            this.getEPGBDsData(vrf, rec, apic_ip);
          }

        }

      });

  }

  // epg bridge domain
  getEPGBDsData(vrf, epgrec, apic_ip) {

    this.http
      .get('https://' + apic_ip + '/api/node/mo/' + epgrec.fvAEPg.attributes.dn + '.json?query-target=children&target-subtree-class=fvRsBd')


      .subscribe((res: any) => {
        //do something with the response here
        console.log(res);

        // let imdata =res.imdata[0];
        // console.log(imdata.fvBD.attributes.name);


        this.epgBdData = res.imdata;

        for (let i = 0; i < this.epgBdData.length; i++) {
          let rec = this.epgBdData[i];
          if (rec) {
            let epg = new Epg();
            epg.name = epgrec.fvAEPg.attributes.name;
            epg.dn = epgrec.fvAEPg.attributes.dn;
            epg.vrf_id = vrf.id
            epg.vrf_name = vrf.name
            epg.vrf = vrf
            epg.bd_name = rec.fvRsBd.attributes.tnFvBDName

            this.databaseService
              .connection
              .then(() => epg.save())
              .then(epg => {

                this.insertedId = epg.id;
                console.log("insertedId : " + epg.id);

                this.getEPGSubnetsData(epg, apic_ip);

              })
          }

        }



      });

  }



  // epg subnets
  getEPGSubnetsData(epg, apic_ip) {

    this.http
      .get('https://' + apic_ip + '/api/node/mo/' + epg.dn + '.json?query-target=children&target-subtree-class=fvSubnet&query-target-filter=not(wcard(fvSubnet.dn,"__ui_"))')
      .subscribe((res: any) => {
        //do something with the response here
        console.log(res);

        this.epgSubnetData = res.imdata;

        for (let i = 0; i < this.epgSubnetData.length; i++) {


          let rec = this.epgSubnetData[i];
          if (rec) {
            let subnet = new Subnet();
            subnet.ip = rec.fvSubnet.attributes.ip;
            subnet.dn = rec.fvSubnet.attributes.dn;
            subnet.epg_id = epg.id;
            subnet.epg_name = epg.name;
            subnet.epg = epg;

            this.databaseService
              .connection
              .then(() => {
                subnet.save()
              })

          }



        }

      });

  }


  // bridge domains
  async getBDsData(tenants, apic_ip) {

    await this.http

      //Bridge Domains
      .get('https://' + apic_ip + '/api/node/mo/' + tenants.dn + '.json?query-target=children&target-subtree-class=fvBD&query-target-filter=not(wcard(fvBD.dn,"__ui_"))')

      .subscribe((res: any) => {
        //do something with the response here
        console.log(res);

        // let imdata =res.imdata[0];
        // console.log(imdata.fvBD.attributes.name);

        setTimeout(() => {
          this.apic_syncing = false
          this.apic_sync_success = true

          const current = new Date();
          this.lastAPICSyncdata = current.toLocaleString();
          localStorage.setItem("lastAPICSyncdata", current.toLocaleString());
          this.getLocalTenantsData();
          this.updateRecords();
        }, 2000);


        this.bdData = res.imdata;

        for (let i = 0; i < this.bdData.length; i++) {
          let rec = this.bdData[i];
          if (rec) {
            let bd = new Bd();
            bd.dn = rec.fvBD.attributes.dn;
            bd.name = rec.fvBD.attributes.name;
            bd.tenants_id = tenants.id;
            bd.tenants_name = tenants.name;
            bd.tenants = tenants;

            this.databaseService
              .connection
              .then(() => bd.save())
              .then(bd => {

                this.insertedId = bd.id;
                console.log("insertedId : " + bd.id);

                this.getBDSubnetsData(bd, apic_ip);


              })

          }
        }

      });


  }



  getBDSubnetsData(bd, apic_ip) {

    this.http

      .get('https://' + apic_ip + '/api/node/mo/' + bd.dn + '.json?query-target=children&target-subtree-class=fvSubnet&query-target-filter=not(wcard(fvSubnet.dn,"__ui_"))')

      .subscribe((res: any) => {

        //do something with the response here
        console.log(res);

        // let imdata =res.imdata[0];
        // console.log(imdata.fvBD.attributes.name);


        this.bdSubnetData = res.imdata;

        for (let i = 0; i < this.bdSubnetData.length; i++) {
          let rec = this.bdSubnetData[i];
          if (rec) {
            let subnet = new Subnet();
            subnet.ip = rec.fvSubnet.attributes.ip;
            subnet.dn = rec.fvSubnet.attributes.dn;

            this.databaseService
              .connection
              .then(() => Epg.find({
                where: { bd_name: bd.name }
              }))
              .then(epgs => {
                console.log("epg : " + epgs.length)

                for (i = 0; i < epgs.length; i++) {
                  let epg = epgs[i];
                  subnet.epg_id = epg.id;
                  subnet.epg_name = epg.name;
                  subnet.epg = epg;

                  this.databaseService
                    .connection
                    .then(() => {
                      subnet.save()
                    })

                }

              })


          }
        }

      });

  }




  // const headers = {
  //   'APIC-Cookie': 'AyUAAAAAAAAAAAAAAAAAAE5B6iwDPfU/FLK52X7EHuHfuR0bHDBEd1kdL/UWv5BllA8p3Ny8K/2p90v2GvR0nERLGjyrGyFRveJCrusnhfZ5dNNA+knCoA0eIjEzhen30SzbCap1CxMncXDOp8gATRMj/U/sh1ZylytBWG+5uiiEqorozpX1e609lWjw82HZctAoasQ/E0vQPBwe6DG5aA==',
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  //   'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
  // }
  // // const body = { title: '' }
  // this.http.get<any>('https://173.54.174.225:3512/api/node/mo/uni/tn-ford/ap-ford-app-vrf-1.json?query-target=subtree&target-subtree-class=fvAEPg', { headers }).subscribe(data => {
  //   // this.postId = data.id;
  //   console.log(data);
  // })

  // }
  onFilterButtonClick($event) {
    let clickedElement = $event.target || $event.srcElement;
    if (clickedElement.nodeName === "A") {
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      // if a Button already has Class: .active
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
      clickedElement.className += " active";
    }

  }
  onFilterRightClick($event) {
    let clickedElement = $event.target || $event.srcElement;
    if (clickedElement.nodeName === "A") {
      let isCertainButtonAlreadyActive = clickedElement.parentElement.parentElement.querySelector(".rightab_active");
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("rightab_active");
      }
      clickedElement.className += " rightab_active";
    }

  }
  filter(by) {
    if (by === '') {
      this.getRecords();
      this.main_filter = 'Total Unique Flows';
      //this.isValue = 1;
    } else {
      this.databaseService
        .connection
        .then(() => AdmItem.find({
          where: {
            isNewDupMiss: by,
          }
        }))
        .then(admitems => {
          this.admItemsList = admitems;
          console.log("admItemsList : " + this.admItemsList.length)
        })

    }
  }


  //update records when APIC sync

  updateRecords() {
    this.databaseService
      .connection
      .then(() => AdmItem.find())
      .then(admitems => {
        this.admItemsList = admitems;
      })
      .then(() => Subnet.find())
      .then(subnets => {
        this.subnetsList = subnets;
      })
      .then(() => {
        console.log("subnetsList :" + JSON.stringify(this.subnetsList));
        console.log("admItemsList :" + JSON.stringify(this.admItemsList));

        // let csvArr = [];
        for (let i = 0; i <= this.admItemsList.length; i++) {
          let curruntRecord = this.admItemsList[i];
          if (curruntRecord) {
            console.log("curruntRecord :" + JSON.stringify(this.admItemsList[i]));
            let admItem: AdmItem = new AdmItem();
            admItem.id = curruntRecord.id;
            admItem.protocol = curruntRecord.protocol.trim();
            admItem.sport = curruntRecord.sport.trim();
            admItem.saddr = curruntRecord.saddr.trim();
            admItem.dport = curruntRecord.dport.trim();
            admItem.daddr = curruntRecord.daddr.trim();

            for (let s = 0; s < this.subnetsList.length; s++) {
              // if (admItem.saddr != null && subnets[s].ip && subnets[s].ip.includes(admItem.saddr)) {
              //   admItem.sepg = subnets[s].epg_name;
              // }
              // if (admItem.daddr != null && subnets[s].ip && subnets[s].ip.includes(admItem.daddr)) {
              //   admItem.depg = subnets[s].epg_name;
              // }

              if (admItem.saddr != null && this.subnetsList[s].ip != null && ipRangeCheck(admItem.saddr, this.subnetsList[s].ip)) {
                admItem.sepg = this.subnetsList[s].epg_name;
              }

              if (admItem.daddr != null && this.subnetsList[s].ip != null && ipRangeCheck(admItem.daddr, this.subnetsList[s].ip)) {
                admItem.depg = this.subnetsList[s].epg_name;
              }
            }

            // csvRecord.mobile = curruntRecord[5].trim();  
            // csvArr.push(admItem);
            // this.records.push(admItem);

            setTimeout(() => {
              console.log("admItem : " + JSON.stringify(admItem))
              AdmItem.save(admItem)


              if ((i + 1) === this.admItemsList.length) {
                this.getRecords();
              }
            }, 500);

          }
        }
        // return csvArr;
      })
  }

}
