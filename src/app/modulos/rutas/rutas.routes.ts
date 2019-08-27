import { RouterModule, Routes } from '@angular/router';

import { RutasComponent } from './rutas.component';
import { MonitorPrinRutasComponent } from './monitores/monitorprinrutas.component';
import { NopagesfoundComponent } from '../../shared/nopagesfound/nopagesfound.component';


import { EditregcliepotenComponent } from './mantablasbasicas/clientepotencial/editar/editar.component';
import { VerregcliepotenComponent } from './mantablasbasicas/clientepotencial/ver/ver.component';
import { MonitorClientepotenciaComponent } from './monitores/clienpotenrutas/monitor.component';
import { MonitorObjetotablaComponent } from './monitores/objetotabla/monitor.component';
import { MonitorVendedorComponent } from './monitores/vendedor/monitor.component';
import { MonitorVisitaComponent } from './monitores/visita/monitor.component';
import { MonitorGeneralComponent } from './monitores/general/monitor.component';
import { Netsmantcliepotenmodal } from './mantablasbasicas/clientepotencial/netsmantcliepotenmodal.componet';
import { AddregcliepotenComponent } from './mantablasbasicas/clientepotencial/adicionar/adicionar.component';
import { Netsrutasbusqueda } from './componentes/rutasbusqueda/rutasbusquedamodal.componet';
import { MantBasicaComponent } from '../../mantablasbasicas/tbasica/mantbasica.component';
import { AddregtbasicaComponent } from '../../mantablasbasicas/tbasica/adicionar/adicionar.component';
import { VerregtbasicaComponent } from '../../mantablasbasicas/tbasica/ver/ver.component';
import { EditregtbasicaComponent } from '../../mantablasbasicas/tbasica/editar/editar.component';
import { MenuTbasComponent } from '../../mantablasbasicas/tbasica/menumtablas/menumtablas.component';

//Op marzo 7 18 Modelo rutas del modulo principal
//cambiar palabra modelo
//Incluya las rutas hijas

const rutasRoutes: Routes = [
    {
        path: '',
        component: RutasComponent,
        children: [
            { path: 'home', component: MonitorPrinRutasComponent, data: { titulo: 'Monitor Principal' } },
            {path: 'menutbas', component: MenuTbasComponent, data: { titulo: 'Menu Principal' }},
            { path: 'monitorprinrutas', component: MonitorPrinRutasComponent, data: { titulo: 'Monitor Principal' } },
            
            { path: 'mantbasica/:objeto', component: MantBasicaComponent, data: { titulo: 'Mantenimiento' }},
            { path: 'addregtbasica/:varParam', component: AddregtbasicaComponent, data: { titulo: 'Adicionar registro' }},
            { path: 'verregtbasica/:varParam/:id', component: VerregtbasicaComponent, data: { titulo: 'Consultar registro' }},
            { path: 'editregtbasica/:varParam/:id', component: EditregtbasicaComponent, data: { titulo: 'Editar registro' }},

            { path: 'addregtcliepoten/:varParam', component: AddregcliepotenComponent, data: { titulo: 'Adicionar Cliente potencial' }},
            { path: 'editregtcliepoten/:varParam/:id', component: EditregcliepotenComponent, data: { titulo: 'Editar Cliente potencial' }}, 
            { path: 'verregtcliepoten/:varParam/:id', component: VerregcliepotenComponent, data: { titulo: 'Consulta Cliente potencial' }}, 
        
            { path: 'monitorvendedor/:varParam/:id', component: MonitorVendedorComponent, data: { titulo: 'Monitor Vendedor' }}, 
            { path: 'monitorvisita/:cod_tercer/:cod_vended/:id_ruta/:id_periodo/:id_visita', component: MonitorVisitaComponent, data: { titulo: 'Monitor Visita' } },
            { path: 'monitorcliepoten/:id_cliepoten/:cod_vended', component: MonitorClientepotenciaComponent, data: { titulo: 'Monitor Cliente Potencial' } },
            { path: 'monitorgeneral', component: MonitorGeneralComponent, data: { titulo: 'Monitor General' }}, 
            { path: 'monitorobjtabla/:varParam/:id', component: MonitorObjetotablaComponent, data: { titulo: 'Monitor panel tabla' }}, 
                       
            // { path: 'cotizacion/:varParam/:pid/:pidcliepote/:pidcuentacrm/:ptipomant/:pcod_dcotiz/:pnum_dcotiz', component: MantcotizacionComponent, data: { titulo: 'Cotización' }}, 
            // var pruta = `/monitorvisita/${dataItem.cod_tercer}/${this.regVendedor.cod_vended}/${dataItem.id_ruta}/${dataItem.id_reffecha}/${dataItem.id_visita}/`;

       
            {path: '', redirectTo: '/home', pathMatch: 'full'},
            { path: '**', component: NopagesfoundComponent }
            // { path: '', redirectTo: '/monitorprinrutas', pathMatch: 'full' }
        ]
    }
];


export const CRM_ROUTES = RouterModule.forChild( rutasRoutes);
