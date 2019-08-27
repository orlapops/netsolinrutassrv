import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import { APP_ROUTES } from './app.routes';

// Modulos
import { RutasModule } from './modulos/rutas/rutas.module';
// import { TiendaModule } from './modulos/tienda/tienda.module';


// temporal
import { FormsModule } from '@angular/forms';

// Servicios
import { ServiceModule } from './services/service.module';




// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { varGlobales } from './shared/varGlobales';
// import { GuardService } from './shared/servicios/guard.service';
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AppConfigService } from './app.config.service';

// export function initializeApp(appConfig: AppConfigService) {
//   return appConfig.fireConfig()
// }

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    //Modulo principal cambie aqui por el modulo pruncipla la palabra modelo
    RutasModule,
    // TiendaModule,
    FormsModule,
    ServiceModule,
  // AngularFirestoreModule,
  AngularFireModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule // imports firebase/firestore, only needed for database features

  ],
  providers: [
    // AppConfigService,
    // {
    //   provide: FirebaseOptionsToken,
    //   deps: [AppConfigService],
    //   useFactory: initializeApp
    // },
    varGlobales,
    AngularFirestore 
    // GuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
