import { Component, OnInit } from '@angular/core';
import { error } from 'util';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { NetsolinService } from '../../services/netsolin.service';
import { NetsolinApp } from '../../shared/global';
import { environment } from '../../../environments/environment';

declare function init_plugins();

@Component({
  selector: 'app-rutas',
  providers   : [NetsolinService],
  templateUrl: './rutas.component.html',
  styles: []
})

//Aqui debe cambiar Modelo por identificardo del modulo principal
export class RutasComponent implements OnInit {
  
  title = 'app';
  constructor(
    private service: NetsolinService,
    private httpc: HttpClient
 ) {
   // console.log('constructo app.componet');
  }
  htmlheader = "";
  htmlfooter = "";
  titulo='Netsolin Modelo';
  oapp = null;
  cargando=true;
  errorcargando = false;
  //para errores que no sean de carga eje inicio sesión
  errorcargandoxsesion = false; 
  menerror="";
  nom_empresa="";
  nit_empresa="";
  cuserid="";

  ngOnInit() {
    // console.log('ngOnInit app.componet');
    this.httpc.get('assets/dist/netsolin_ini.json').subscribe(data => {
      NetsolinApp.urlNetsolin =  data['url_netsolins'];
      NetsolinApp.url_netsolin_alterna = data['url_netsolin_alterna'];
      console.log("ngoninit urlNetsolin:"+NetsolinApp.urlNetsolin );
      localStorage.setItem('urlNetsolin',NetsolinApp.urlNetsolin);      
      this.loadhtmlNetsolinbase()
        .then(respuesta => {
            if (!respuesta) {
              console.log('No se encontro con dirección base cambiar a alterna');
              this.cargando=false;
              this.menerror='';
              this.errorcargando = false;
              this.errorcargandoxsesion = false;  
              NetsolinApp.urlNetsolin =  data['url_netsolin_alterna'];
              NetsolinApp.url_netsolin_alterna = data['url_netsolins'];
              localStorage.setItem('urlNetsolin',NetsolinApp.urlNetsolin);    
              console.log('llamar con nueva direccion:',NetsolinApp.urlNetsolin); 
              this.loadhtmlNetsolinbase()
                .then(respuesta =>{
                    if (!respuesta){
                      console.log('No se encontro con dirección base cambiar a alterna');                      
                    }
                });   
        
            }
        });   
      // this.loadhtmlmenuslice();         
    
    // init_plugins();

  });      
  }


  loadhtmlNetsolinbase(): any {
    this.cargando=true;
    return new Promise((resolve)=>{
    //  console.log("loadhtmlNetsolinbase  urlNetsolin:"+NetsolinApp.urlNetsolin );
    this.service.getNetsolinhtmlbase()
        .subscribe( result => {
          console.log(result);
          if (typeof result.isCallbackError != "undefined") {
            this.errorcargando = true;
            this.errorcargandoxsesion = true;
            console.log("loadhtmlNetsolinbase Error");
            this.cargando=false;
            this.menerror=result.message;
            resolve(false);
            return;
          }
  
           console.log("getNetsolinhtmlbase result");
           console.log(result);
           console.log('result.oapp');
          //  console.log(result.oapp);
            let var1 = JSON.stringify(result.oapp);
            // console.log("var 1");
            // console.log(var1);
            localStorage.setItem('OappNetsolin',var1);
            this.oapp = result.oapp;
            NetsolinApp.objtitmodulo.titulo = 'Rutas';
            NetsolinApp.iniNetsolin = true;
            NetsolinApp.oapp.cuserid = this.oapp.cuserid;
            NetsolinApp.oapp.cuserpsw = this.oapp.cuserpsw;
            NetsolinApp.oapp.nomusuar = this.oapp.nomusuar;
            NetsolinApp.oapp.superusuar = this.oapp.superusuar;
            NetsolinApp.oapp.nom_empresa = this.oapp.nom_empresa;
            NetsolinApp.oapp.nit_empresa = this.oapp.nit_empresa;
            NetsolinApp.oapp.prefijo_sqlbd = this.oapp.prefijo_sqlbd;
            NetsolinApp.oapp.num_version = this.oapp.num_version;
            if (environment.production) {
              NetsolinApp.oapp.en_prod = 'ENPROD';
              NetsolinApp.objenvrest.en_prod = 'ENPROD';
              NetsolinApp.objenvrestddtabla.en_prod = 'ENPROD';
              NetsolinApp.objenvrestsolcomobog.en_prod = 'ENPROD';
              NetsolinApp.objenvrestcrud.en_prod = 'ENPROD';
            } else {
              NetsolinApp.oapp.en_prod = 'NOPROD';              
              NetsolinApp.objenvrest.en_prod = 'NOPROD';              
              NetsolinApp.objenvrestddtabla.en_prod = 'NOPROD';              
              NetsolinApp.objenvrestsolcomobog.en_prod = 'NOPROD';              
              NetsolinApp.objenvrestcrud.en_prod = 'NOPROD';              
              NetsolinApp.oapp.cuserid = 'NETSDESAA';              
              NetsolinApp.objenvrest.usuario = 'NETSDESAA';              
              NetsolinApp.objenvrestddtabla.usuario = 'NETSDESAA';              
              NetsolinApp.objenvrestsolcomobog.usuario = 'NETSDESAA';              
              NetsolinApp.objenvrestcrud.usuario = 'NETSDESAA';              
            }

            NetsolinApp.oapp.motor = this.oapp.motor;
            this.nom_empresa = NetsolinApp.oapp.nom_empresa; 
            this.nit_empresa = NetsolinApp.oapp.cuserid;
            this.cuserid = NetsolinApp.oapp.nit_empresa;
            //modificar objetos para comunicación con Netsolin con datos que llegan
            // console.log('this.oapp');
            // console.log(this.oapp);
            NetsolinApp.objenvrest.usuario =  this.oapp.cuserid;
            NetsolinApp.objenvrest.psw =  this.oapp.cuserpsw;
            NetsolinApp.objenvrest.prefijobd =  this.oapp.prefijo_sqlbd;
            NetsolinApp.objenvrestddtabla.usuario =  this.oapp.cuserid;
            NetsolinApp.objenvrestddtabla.psw =  this.oapp.cuserpsw;
            NetsolinApp.objenvrestddtabla.prefijobd =  this.oapp.prefijo_sqlbd;
            NetsolinApp.objenvrestsolcomobog.usuario =  this.oapp.cuserid;
            NetsolinApp.objenvrestsolcomobog.psw =  this.oapp.cuserpsw;
            NetsolinApp.objenvrestsolcomobog.prefijobd =  this.oapp.prefijo_sqlbd;
            NetsolinApp.objenvrestcrud.usuario =  this.oapp.cuserid;
            NetsolinApp.objenvrestcrud.psw =  this.oapp.cuserpsw;
            NetsolinApp.objenvrestcrud.prefijobd =  this.oapp.prefijo_sqlbd;
            console.log('getNetsolinhtmlbase NetsolinApp:',NetsolinApp);            
    
            // console.log(NetsolinApp.iniNetsolin);
            // console.log(NetsolinApp.oapp.cuserid);
            // console.log(NetsolinApp.oapp.nomusuar);
            // console.log(NetsolinApp.oapp.superusuar);
            // console.log(NetsolinApp.oapp.nom_empresa);
            // console.log(NetsolinApp.oapp.nit_empresa);
            // console.log('oapp en loadbase');
            // console.log(this.oapp);
            // console.log(NetsolinApp);
            this.cargando=false;  
            resolve(true);          
           }, error => {
             console.log('error loadhtmlNetsolinbase');
             console.log(error.message);
            // this.showError(error);
            this.cargando=false;
            this.menerror=error.message;
            this.errorcargando = true;
            this.errorcargandoxsesion = false;
            resolve(false);
        });
      });
  }
}
