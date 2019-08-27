import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { NetsolinApp } from '../shared/global';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

// import { MessageService } from '../message/message.service';
// import { ConsoleReporter } from 'jasmine';

@Injectable({
  providedIn: 'root'
})

export class RutaService {
    //AQUI CAMBIAR PARA QUE TRAIGA LA BODEGA QUE LE PERTENECE A LA RUTA
    bodega = 'VEH';
    id_ruta: number = 0;
    // visitaclienteactual: AngularFirestoreDocument<any>;
    // visitaclienteactual: any;
    visitas: any;
    room: any;
    profileUrl: Observable<string | null>;
    clienteFb: any;
    
    public visitaTodas: any;
    public visitasProximas: any;
    public visitasCumplidas: any;
    public visitasUltimas: any;
    public cargo_ruta = false;
    public error_cargarruta = false;
    public men_errorcargarruta = "";
    visitas_cumplidas: any[] = [];
    visitas_pendientes: any[] = [];
    visitas_incumplidas: any[] = [];
    visita_activa_copvdet: any;
    visita_activa: any;
    cargoInventarioNetsolin = false;
    inventario: Array<any> = [];
    public userId: string;
    public cargoidperiodo = false;
    public id_periodo: string;
    public cargo_clienteact = false;
    public direc_actual: any;
    public id_visita_activa: any;
      
    
    constructor(private fbDb: AngularFirestore,
        private firestore: AngularFirestore,
        private afStorage: AngularFireStorage,
        private http: HttpClient
        ) {
    }

      //trae de firebase la visita actual como obervable

      public getVisitaActual(id){
          return this.fbDb
          .collection(`/personal/${NetsolinApp.oapp.cuserid}/rutas/${this.id_ruta}/periodos/${this.id_periodo}/visitas`)
          .doc(id).valueChanges();
      }
  
  //Obtiene las visitas que corresponde a la fecha y ruta tomada de carga anterior en netsolin
  public getVisitasidrutper() {
      const lruta = `/personal/${NetsolinApp.oapp.cuserid}/rutas/${this.id_ruta}/periodos/${this.id_periodo}/visitas`;
    //   this._parempre.reg_log('getVisitasidrutper lruta ', lruta);
    return this.fbDb
    .collection(`/personal/${NetsolinApp.oapp.cuserid}/rutas/${this.id_ruta}/periodos/${this.id_periodo}/visitas`)
    .snapshotChanges();
    
  }      
  
    //Obtiene visita por id de la visita
  public getIdRegVisita(visitaId: string) {
      console.log('en getIdRegVisita');
    return this.fbDb.collection('reg_visitas').doc(visitaId).valueChanges();
  }      

 

  cargaVisitas(){
    // console.log('Ingreso a cargo visitas');
    return new Promise( (resolve, reject) => {
        // console.log('cargaVisitas 1');
        this.getVisitasidrutper().subscribe((datosv: any) => {
                    //   console.log('lo que llega de visitas de un id de fecha');
                    //   console.log(datosv);
                    // this._parempre.reg_log('cargaVisitas 1 ', 'datosv');
                    if(datosv.length > 0) {
                        // this._parempre.reg_log('cargaVisitas 2 ', 'datosv1');
                        let itemdato = datosv[0];
                        // console.log(itemdato);
                        // console.log(itemdato.payload);
                        // console.log(itemdato.payload.doc);
                        // console.log(itemdato.payload.doc.data());
                        // console.log(itemdato.payload.doc.id);
  
                        // console.log('cambia a cargo ruta');
                          this.cargo_ruta = true;
                          this.error_cargarruta = false;
                        //   this.visitaTodas = datosv;
                        this.visitaTodas = [];
                        datosv.forEach((visiData: any) => {
                            this.visitaTodas.push({
                              id: visiData.payload.doc.id,
                              cargocartera: false,
                              data: visiData.payload.doc.data()
                            });
                          });   
                        //   console.log('Todas las visitas con id');
                        //   console.log(this.visitaTodas);                     
                          this.clasificaVisitas();
                          resolve(true);
                      } else {
                        // this._parempre.reg_log('cargaVisitas 3 falso no cargo ruta ', 'no tiene visitas');
                        console.log('no hay datos en este id');
                          this.cargo_ruta = false;
                          this.error_cargarruta = true;
                          this.visitaTodas = null;
                          this.men_errorcargarruta = "No tiene visitas asignadas para esta ruta";          
                          resolve(false);
                      }
                  });        
        }); 
  }

 
  clasificaVisitas() {
    //   console.log('clasificando visitas 1');
      this.visitas_cumplidas = this.visitaTodas.filter(reg => reg.data.estado === 'C');
      this.visitas_pendientes = this.visitaTodas.filter(regP => regP.data.estado === 'P'
       || regP.data.estado === 'A' || regP.data.estado === '');
    // console.log('clasificando visitas 5');
    // console.log(this.visitas_pendientes);
    // console.log(this.visitas_cumplidas);
  }


 getAll() {
        return this.visitas;
    }

    //Retorna una visita especidica para ser mostrada en detalle visitas
    getItem(id) {        
        // this.cargocarteraNetsolin = false;
        for (var i = 0; i < this.visitaTodas.length; i++) {
            if (this.visitaTodas[i].id === id) {
                //cargar visita activa
                // console.log('En getItem id:' + id);
                // console.log(this.visitaTodas[i]);

                //pendiente actuvar va en otro lado el cargar visita
                // this.cargaVisitaActiva(this.visitaTodas[i]);
                return this.visitaTodas[i];
            }
        }
        return null;
    }


    remove(item) {
        this.visitas.splice(this.visitas.indexOf(item), 1);
    }

    findAll() {
        return Promise.resolve(this.visitas);
    }

    findById(id) {
        return Promise.resolve(this.visitas[id - 1]);
    }

    findByName(searchKey: string) {
        let key: string = searchKey.toUpperCase();
        return Promise.resolve(this.visitas.filter((property: any) =>
            (property.title + ' ' + property.address + ' ' + property.city + ' ' + property.description)
            .toUpperCase().indexOf(key) > -1));
    }

    findByCliente(searchKey: string) {
        // console.log('findByCliente searchKey:', searchKey);
        // console.log(this.visitaTodas);
         return Promise.resolve(this.visitaTodas.filter((item: any) =>
            item.data.nombre.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 
            || item.data.cod_tercer.toLowerCase().indexOf(searchKey.toLowerCase()) > -1));
    }


}
