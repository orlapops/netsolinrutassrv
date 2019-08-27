import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SettingsService,
  SidebarService,
  SharedService
 } from './service.index';
import { MantablasLibreria } from './mantbasica.libreria';
import { MantbasicaService } from './mantbasica.service';
import { NetsolinService } from './netsolin.service';
import { RutaService } from './ruta.service';
// import { AgmCoreModule } from '@agm/core';
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { AppConfigService } from '../app.config.service';

// export function initializeApp(appConfig: AppConfigService) {
//     return appConfig.fireConfig()
//   }

@NgModule({
  imports: [
    CommonModule,
  //   AgmCoreModule.forRoot({
  //     apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
  // }),
  // AngularFirestoreModule,
  AngularFireModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule // imports firebase/firestore, only needed for database features

  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    MantablasLibreria,
    MantbasicaService,
    NetsolinService,
    RutaService,
    // AppConfigService,
    // {
    //   provide: FirebaseOptionsToken,
    //   deps: [AppConfigService],
    //   useFactory: initializeApp
    // },
    AngularFirestore
  ],
  declarations: []
})
export class ServiceModule { }
