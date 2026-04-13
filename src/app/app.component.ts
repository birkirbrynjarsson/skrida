import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  @ViewChild('myTable') table: any;
  @ViewChild('dateHdr') dateHdr!: TemplateRef<any>;
  @ViewChild('idHdr') idHdr!: TemplateRef<any>;
  @ViewChild('objectHdr') objectHdr!: TemplateRef<any>;
  @ViewChild('descHdr') descHdr!: TemplateRef<any>;
  @ViewChild('xHdr') xHdr!: TemplateRef<any>;
  @ViewChild('yHdr') yHdr!: TemplateRef<any>;
  @ViewChild('altHdr') altHdr!: TemplateRef<any>;
  @ViewChild('zoneHdr') zoneHdr!: TemplateRef<any>;
  @ViewChild('layerHdr') layerHdr!: TemplateRef<any>;
  @ViewChild('regHdr') regHdr!: TemplateRef<any>;

  rows: any[] = [];
  temp: any[] = [];
  columns: any[] = [];
  expanded: any = {};
  timeout?: ReturnType<typeof setTimeout>;

  // FilterInputs
  filters = {
    all: '',
    date: '',
    ID: '',
    object: '',
    description: '',
    analysis: '',
    x: '',
    y: '',
    altitude: '',
    zone: '',
    mineralLayer: '',
    registration: '',
    registrationID: '',
    storage: ''
  };

  user: Observable<firebase.User | null>;
  private readonly itemsRef: AngularFireList<any>;
  msgVal = '';

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {
    this.itemsRef = af.list('/items');
    this.itemsRef.valueChanges().subscribe(snapshot => {
      this.temp = [...snapshot];
      this.rows = snapshot;
    });
    this.user = this.afAuth.authState;
  }

  ngOnInit(): void {
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

  onPage(event: any): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      // console.log('paged!', event);
    }, 100);
  }

  onActivate(event: any): void {
    // console.log(event);
    if (event.type === 'click' || event.event?.key === 'Enter') {
      this.table.rowDetail.toggleExpandRow(event.row);
    }
  }

  toggleExpandRow(row: any): void {
    // console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event: any): void {
    console.log('Detail Toggled', event);
  }

  private fieldContains(data: any, field: string, filterValue: string): boolean {
    if (!filterValue) {
      return true;
    }
    const value = String(data?.[field] ?? '').toLowerCase();
    return value.indexOf(filterValue) !== -1;
  }

  filterText(_event: Event): void {
    for (const key of Object.keys(this.filters)) {
      const current = this.filters[key as keyof typeof this.filters];
      this.filters[key as keyof typeof this.filters] = current.toLowerCase();
    }

    const filtered = this.temp.filter((data: any) => {
      const regFilterMatch =
        !this.filters.registrationID ||
        this.fieldContains(data, 'registration', this.filters.registrationID) ||
        this.fieldContains(data, 'registrationID', this.filters.registrationID);

      return this.fieldContains(data, 'date', this.filters.date)
      && this.fieldContains(data, 'ID', this.filters.ID)
      && this.fieldContains(data, 'object', this.filters.object)
      && this.fieldContains(data, 'description', this.filters.description)
      && this.fieldContains(data, 'analysis', this.filters.analysis)
      && this.fieldContains(data, 'x', this.filters.x)
      && this.fieldContains(data, 'y', this.filters.y)
      && this.fieldContains(data, 'altitude', this.filters.altitude)
      && this.fieldContains(data, 'zone', this.filters.zone)
      && this.fieldContains(data, 'mineralLayer', this.filters.mineralLayer)
      && regFilterMatch
      && this.fieldContains(data, 'storage', this.filters.storage)
      && (
        !this.filters.all
        || this.fieldContains(data, 'date', this.filters.all)
        || this.fieldContains(data, 'ID', this.filters.all)
        || this.fieldContains(data, 'object', this.filters.all)
        || this.fieldContains(data, 'description', this.filters.all)
        || this.fieldContains(data, 'analysis', this.filters.all)
        || this.fieldContains(data, 'x', this.filters.all)
        || this.fieldContains(data, 'y', this.filters.all)
        || this.fieldContains(data, 'altitude', this.filters.all)
        || this.fieldContains(data, 'zone', this.filters.all)
        || this.fieldContains(data, 'mineralLayer', this.filters.all)
        || this.fieldContains(data, 'registration', this.filters.all)
        || this.fieldContains(data, 'registrationID', this.filters.all)
        || this.fieldContains(data, 'storage', this.filters.all)
      );
    });

    this.rows = filtered;
    this.table.offset = 0;
  }

  login(): void {
    this.afAuth.signInAnonymously();
  }

  logout(): void {
    this.afAuth.signOut();
  }

  sendMessage(text: string): void {
    const message = {
      message: text,
      displayName: 'Birkir',
      email: 'birkir@birkir.is',
      timestamp: Date.now()
    };
    this.itemsRef.push(message);
  }
}
