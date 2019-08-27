//Op marzo 7 18
//Modelo de modulo principal de proyecto angular netsolin
//cambiar palabra modelo por identificardor del proeycto
//Incluir otros modulos si faltan
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CRM_ROUTES } from './rutas.routes';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';

//firebase feb 19 19 y agm para mapas google
// import { AngularFireModule } from 'angularfire2';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
//firebase prueba oct 4 18
import { AgmCoreModule } from '@agm/core';
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';

// ng2-charts
// import { ChartsModule } from 'ng2-charts';

import { RutasComponent } from './rutas.component';

import { MonitorPrinRutasComponent } from './monitores/monitorprinrutas.component';
import { NetsolinLibreriasModule } from '../../netsolinlibrerias/netsolin.librerias.module';
import { NetsolinMantablasModule } from '../../mantablasbasicas/netsolin.mantablas.module';
// import { TiendaModule } from '../tienda/tienda.module';
import { EditregcliepotenComponent } from './mantablasbasicas/clientepotencial/editar/editar.component';
import { VerregcliepotenComponent } from './mantablasbasicas/clientepotencial/ver/ver.component';

import { Netsmantcliepotenmodal } from './mantablasbasicas/clientepotencial/netsmantcliepotenmodal.componet';
import { AddregcliepotenComponent } from './mantablasbasicas/clientepotencial/adicionar/adicionar.component';
import { Netsrutasbusqueda } from './componentes/rutasbusqueda/rutasbusquedamodal.componet';
import { MonitorVendedorComponent } from './monitores/vendedor/monitor.component';
import { MonitorVisitaComponent } from './monitores/visita/monitor.component';
import { MonitorGeneralComponent } from './monitores/general/monitor.component';
import { MonitorObjetotablaComponent } from './monitores/objetotabla/monitor.component';


//Kendo
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
// Import the ButtonsModule
import { ButtonsModule } from '@progress/kendo-angular-buttons';
// Imports the AutoComplete module
import { AutoCompleteModule } from '@progress/kendo-angular-dropdowns';
// Imports the ComboBox module
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule,ExcelModule  } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ChartsModule } from '@progress/kendo-angular-charts';

import '@progress/kendo-angular-intl/locales/es/all';
import { AppmenuRutasComponent } from './componentes/appmenuizq/appmenu.component';
import { SharedModule } from '../../shared/shared.module';
import { MonitorClientepotenciaComponent } from './monitores/clienpotenrutas/monitor.component';
import { AppConfigService } from '../../app.config.service';
// export function initializeApp(appConfig: AppConfigService) {
//     return appConfig.fireConfig()
//   }
  
@NgModule({
    declarations: [
        RutasComponent,
        Netsrutasbusqueda,
        MonitorPrinRutasComponent,
        Netsmantcliepotenmodal,
        AddregcliepotenComponent,   
        EditregcliepotenComponent,
        VerregcliepotenComponent,
        MonitorClientepotenciaComponent,
        MonitorVendedorComponent,
        MonitorVisitaComponent,
        MonitorGeneralComponent,
        MonitorObjetotablaComponent,
        AppmenuRutasComponent,
    ],
    exports: [
        MonitorPrinRutasComponent,
        Netsrutasbusqueda,
        Netsmantcliepotenmodal,
        AddregcliepotenComponent,
        EditregcliepotenComponent,
        VerregcliepotenComponent,
        MonitorClientepotenciaComponent,
        MonitorVendedorComponent,
        MonitorVisitaComponent,
        MonitorGeneralComponent,
        MonitorObjetotablaComponent,
        AppmenuRutasComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        // TiendaModule,
        NetsolinLibreriasModule,
        CRM_ROUTES,
        FormsModule,
        ReactiveFormsModule,
        NetsolinMantablasModule,
        RouterModule,
        CommonModule,
        FormsModule,
        BrowserModule, 
        BrowserAnimationsModule, 
        ScrollViewModule,
        NoopAnimationsModule,
        InputsModule,
        DropDownsModule,
        ReactiveFormsModule,    
        ButtonsModule,
        DropDownsModule,
        AutoCompleteModule,    
        ComboBoxModule,
        DialogModule,
        LayoutModule,
        GridModule,
        ExcelModule,
        ChartsModule,
        AgmCoreModule.forRoot({
          //Abril 25 2019 habilitada facturacion
          apiKey: 'AIzaSyBSC-DvlUcEskduxwr0LHzjTU_OS4Hea4g'      
            // apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
        }),
        // AngularFirestoreModule,
        AngularFireModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule, // imports firebase/firestore, only needed for database features        
        // ChartsModule
    ],
    providers: [
        // AppConfigService,
        // {
        //   provide: FirebaseOptionsToken,
        //   deps: [AppConfigService],
        //   useFactory: initializeApp
        // },
        AngularFirestore
    ]
})
export class RutasModule { }
