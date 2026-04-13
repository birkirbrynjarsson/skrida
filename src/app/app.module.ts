import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

export const firebaseConfig = {
  apiKey: 'AIzaSyAr9kKXcDQtMAJINa5P1DshL2aVvIywcCo',
  authDomain: 'skrida-crud.firebaseapp.com',
  databaseURL: 'https://skrida-crud.firebaseio.com',
  projectId: 'skrida-crud',
  storageBucket: 'skrida-crud.appspot.com',
  messagingSenderId: '784239624873'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxDatatableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
