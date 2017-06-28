import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { Ng2FilterPipeModule } from 'ng2-filter-pipe';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

export const firebaseConfig = {
  apiKey: "AIzaSyAr9kKXcDQtMAJINa5P1DshL2aVvIywcCo",
  authDomain: "skrida-crud.firebaseapp.com",
  databaseURL: "https://skrida-crud.firebaseio.com",
  projectId: "skrida-crud",
  storageBucket: "skrida-crud.appspot.com",
  messagingSenderId: "784239624873"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    Ng2FilterPipeModule,
    NgxDatatableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
