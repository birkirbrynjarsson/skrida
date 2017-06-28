import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  @ViewChild('myTable') table: any;
  @ViewChild('dateHdr') dateHdr: TemplateRef<any>;
  @ViewChild('idHdr') idHdr: TemplateRef<any>;
  @ViewChild('objectHdr') objectHdr: TemplateRef<any>;
  @ViewChild('descHdr') descHdr: TemplateRef<any>;
  @ViewChild('xHdr') xHdr: TemplateRef<any>;
  @ViewChild('yHdr') yHdr: TemplateRef<any>;
  @ViewChild('altHdr') altHdr: TemplateRef<any>;
  @ViewChild('zoneHdr') zoneHdr: TemplateRef<any>;
  @ViewChild('layerHdr') layerHdr: TemplateRef<any>;
  @ViewChild('regHdr') regHdr: TemplateRef<any>;

  rows = [];
  temp = [];
  columns = [];
  expanded: any = {};
  timeout: any;

  // FilterInputs
  filters = {
    all: "",
    date: "",
    ID: "",
    object: "",
    description: "",
    analysis: "",
    x: "",
    y: "",
    altitude: "",
    zone: "",
    mineralLayer: "",
    registration: "",
    registrationID: "",
    storage: ""
  };
  


  user : Observable<firebase.User>;
  data : FirebaseListObservable<any[]>;
  msgVal : string = '';
  filter : any = { registration: '' };

  public filterQuery : string = "";
  public rowsOnPage : number = 10;
  public sortBy : string = "email";
  public sortOrder : string = "asc";

  constructor(public afAuth : AngularFireAuth, public af : AngularFireDatabase) {
    this.data = af.list('/items');
    this.data.subscribe(snapshot => {
      this.temp = [...snapshot];
      this.rows = snapshot;
    });
    // console.log(this.items);

    this.user = this.afAuth.authState;

  }

  ngOnInit(){
    this.columns = [
      { headerTemplate: this.dateHdr, name: 'Dagsetning', prop: 'date', width: 95, canAutoResize: false },
      { headerTemplate: this.idHdr, name: '# ID', prop: 'ID', width: 100, canAutoResize: false }, 
      { headerTemplate: this.objectHdr, name: 'Munur', prop: 'object', minWidth: 100, canAutoResize: true },
      { headerTemplate: this.descHdr, name: 'Lýsing', prop: 'description', minWidth: 100, canAutoResize: true },
      { headerTemplate: this.xHdr, prop: 'x', width: 60, canAutoResize: false },
      { headerTemplate: this.yHdr, prop: 'y', width: 60, canAutoResize: false },
      { headerTemplate: this.altHdr, name: 'Z', prop: 'altitude', width: 60, canAutoResize: false },
      { headerTemplate: this.zoneHdr, name: 'Svæði', prop: 'zone', width: 70, canAutoResize: false },
      { headerTemplate: this.layerHdr, name: 'Jarðlag', prop: 'mineralLayer', width: 75, canAutoResize: false },
      { headerTemplate: this.regHdr, name: 'Skráð af', prop: 'registrationID', width: 100, canAutoResize: false },
    ];
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  onActivate(event) {
    console.log(event);
    if(event.type === 'click' || event.event.key === "Enter"){
      this.table.rowDetail.toggleExpandRow(event.row);
    } 
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  filterText(event){
    for(var key in this.filters){
      this.filters[key] = this.filters[key].toLowerCase();
    }
    // console.log(this.filters);
    const temp = this.temp.filter((data) => {
      return (!this.filters['date'] || data['date'].toLowerCase().indexOf(this.filters['date']) !== -1)
      && (!this.filters['ID'] || data['ID'].toLowerCase().indexOf(this.filters['ID']) !== -1)
      && (!this.filters['object'] || data['object'].toLowerCase().indexOf(this.filters['object']) !== -1)
      && (!this.filters['description'] || data['description'].toLowerCase().indexOf(this.filters['description']) !== -1)
      && (!this.filters['analysis'] || data['analysis'].toLowerCase().indexOf(this.filters['analysis']) !== -1)
      && (!this.filters['x'] || data['x'].toLowerCase().indexOf(this.filters['x']) !== -1)
      && (!this.filters['y'] || data['y'].toLowerCase().indexOf(this.filters['y']) !== -1)
      && (!this.filters['altitude'] || data['altitude'].toLowerCase().indexOf(this.filters['altitude']) !== -1)
      && (!this.filters['zone'] || data['zone'].toLowerCase().indexOf(this.filters['zone']) !== -1)
      && (!this.filters['mineralLayer'] || data['mineralLayer'].toLowerCase().indexOf(this.filters['mineralLayer']) !== -1)
      && (!this.filters['registrationID'] || data['registration'].toLowerCase().indexOf(this.filters['registrationID']) !== -1
      || !this.filters['registrationID'] || data['registrationID'].toLowerCase().indexOf(this.filters['registrationID']) !== -1)
      && (!this.filters['storage'] || data['storage'].toLowerCase().indexOf(this.filters['storage']) !== -1)
      && (!this.filters['all'] 
      || data['date'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['ID'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['object'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['description'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['analysis'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['x'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['y'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['altitude'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['zone'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['mineralLayer'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['registration'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['registrationID'].toLowerCase().indexOf(this.filters['all']) !== -1
      || data['storage'].toLowerCase().indexOf(this.filters['all']) !== -1)
    });

    // filter our data
    // const temp = this.temp.filter(function(d) {
    //   return d[prop].toLowerCase().indexOf(val) !== -1 || !val;
    // });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  login(){
    this.afAuth.auth.signInAnonymously();
  }

  logout(){
    this.afAuth.auth.signOut();
  }

  sendMessage(text) {
    var message = {
      message : text,
      displayName : "Birkir",
      email : "birkir@birkir.is",
      timestamp: Date.now()
    }
    this.data.push(message);
  }
}
