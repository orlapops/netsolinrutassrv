import { Component, OnInit, Input, ViewChild } from "@angular/core";
import {FormControl,FormGroup,FormBuilder,Validators} from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { TabStripComponent } from "@progress/kendo-angular-layout";
import {PanelBarExpandMode,PanelBarItemModel} from "@progress/kendo-angular-layout";
import { NetsolinApp } from "../../../../shared/global";
import { MantbasicaService } from "../../../../services/mantbasica.service";
import { MantablasLibreria } from "../../../../services/mantbasica.libreria";
import { varGlobales } from "../../../../shared/varGlobales";
import { NetsolinService } from "../../../../services/netsolin.service";
import { DomSanitizer } from "@angular/platform-browser";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { APP_ID_RANDOM_PROVIDER } from "@angular/core/src/application_tokens";
import { containerRefreshEnd } from "@angular/core/src/render3/instructions";
import { map } from "rxjs/operators";
import { dateFieldName } from "@telerik/kendo-intl";

// import { NetsolinService } from '../../../../netsolinlibrerias/servicios/netsolin.service';

@Component({
  selector: "monitor-vendedor",
  templateUrl: "./monitor.component.html",
  styleUrls: ["./monitor.component.css"]
})
export class MonitorVendedorComponent implements OnInit {
  @ViewChild("tabstrip") public tabstrip: TabStripComponent;
  @Input() vparcaptura: string;
  @Input() vid: any;
  ptablab: string;
  paplica: string;
  pcampollave: string;
  pclase_nbs: string;
  pclase_val: string;
  pcamponombre: string;
  title: string;
  subtitle = "(Monitor)";
  varParam: string;
  rutamant: string;
  id: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  message = "";
  cargando = false;
  resultados = false;
  crearcotiza = false;
  nom_empre: string;
  cargovendedor = false;
  regVendedor: any;
  cargocontacto = false;
  regContacto: any;
  vvalocategoria: string;
  filtroactividades: string = "";
  filtrocotiza: string = "";
  //ruta
  latrecorrido: number;
  lngrecorrido: number;
  lat: number;
  lng: number;
  init = false;
  visitas: Array<any> = [];
  visitas_cumplidas: Array<any> = [];
  visitas_xllamada: Array<any> = [];
  visitas_pendientes: Array<any> = [];
  visitas_encurso: Array<any> = [];
  // Manejo panel de informacion
  infopanelselec: string;
  mostrarmensaje = false;
  collapse = false;
  esconder = false;
  //Enviar variable a graficos
  clasegrafico: string;
  linkmonivended: string = "";
  public openedestadis = false;
  public personas: Array<any> = [];
  id_ruta: any;
  id_periodo: any;
  //rutas
  // visitas: any;
  cargovisitas = false;
  visitalocation: string;
  user: any = {};
  fechahoy = Date();
  recoano = "";
  recmes = "";
  recdia = "";
  resumano = "";
  resummes = "";
  resumdia = "";

  pcod_vended = "";

  pruebavininumbuscombog: string = "";
  llamabusqueda = false;
  pruellegallabusque: string = "";
  anosrecorrido: Array<any> = [];
  cargo_anosrecorido = false;
  historialrecorrido: Array<any> = [];
  cargo_historialrecorido = false;
  mesesrecorrido: Array<any> = [];
  cargo_mesesrecorido = false;
  diasrecorrido: Array<any> = [];
  cargo_diasrecorido = false;
  cargo_trayectonetsolin = false;
  trayectodia: Array<any> = [];
  men_proceso = '';
  repro_solomes = true;

  anosresum: Array<any> = [];
  cargo_anosresum = false;
  mesesresum: Array<any> = [];
  cargo_mesesresum = false;
  diasresum: Array<any> = [];
  cargo_diasresum = false;
  cierrecajaresum: Array<any> = [];
  cierrecajaefe: Array<any> = [];
  cierrecajachd: Array<any> = [];
  cierrecajapbcs: Array<any> = [];
  cierrecajapbtr: Array<any> = [];
  cargo_cierrecajaresum = false;
  recibosresum: Array<any> = [];
  cargo_recibosresum = false;
  consignacionesresum: Array<any> = [];
  cargo_consignacionesresum = false;
  visitasresum: Array<any> = [];
  cargo_visitasresum = false;
  visicumplidiaresum : Array<any> = [];
  cargoclienpoten = false;
  clientespotenrepor : Array<any> = [];
  usuario =  '';
  //id usuario actual onesignal
  ididOnesignalact = '';
  enviar_a = 'Todos';
  idokOnesignal = false;
  actusuarenviar = false;
  public listenviara: Array<string> = [
    'Todos', 'Usuario'
  ];
  public openedmensaje = false;
  public idonesignalenviar = "";
  mensajeenviar="";
  asuntomensajeenviar="";
  
  constructor(
    private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    public service: NetsolinService,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private db: AngularFirestore
  ) {
    this.usuario = NetsolinApp.oapp.cuserid;
    this.vglobal.mostrarbreadcrumbs = false;
    const fechahoy = new Date();
    const ano = fechahoy.getFullYear();
    const mes = fechahoy.getMonth() + 1;
    const dia = fechahoy.getDate();

    this.recoano = ano.toString();
    this.recmes = mes.toString();
    this.recdia = dia.toString();
    this.resumano = ano.toString();
    this.resummes = mes.toString();
    this.resumdia = dia.toString();
  }

  public onPanelChange(data: Array<PanelBarItemModel>): boolean {
    // // public onPanelChange(event: any) {
    // console.log("onPanelChange: ", event);
    // console.log("onPanelChange");
    // let focusedEvent: PanelBarItemModel = data.filter(
    //   item => item.focused === true
    // )[0];
    // console.log("focusedEvent.id: " + focusedEvent.id);
    // this.infopanelselec = focusedEvent.id;
    // if (focusedEvent.id !== "info") {
    //   this.selectedId = focusedEvent.id;
    //   console.log("selec id: ") + this.selectedId;
    //   //  this.router.navigate(["/" + focusedEvent.id]);
    // }

    return false;
  }
  public stateChange(data: Array<PanelBarItemModel>): boolean {
    // console.log("stateChange");
    // let focusedEvent: PanelBarItemModel = data.filter(
    //   item => item.focused === true
    // )[0];
    // console.log("focusedEvent.id: " + focusedEvent.id);

    // if (focusedEvent.id !== "info") {
    //   this.selectedId = focusedEvent.id;
    //   console.log("selec id: ") + this.selectedId;
    //   //  this.router.navigate(["/" + focusedEvent.id]);
    // }

    return false;
  }

  ngOnInit() {
    console.log("en ngOnInit monitor vendedor 1");
    if(!this.service.cargaDhome){
      this.service.cargasidebarmenu = false;
    }
    this.activatedRouter.params.subscribe(parametros => {
      // this.varParam = parametros['varParam'];
      // this.id = parametros['id'];
      if (this.vparcaptura) {
        this.varParam = this.vparcaptura;
      } else {
        this.varParam = parametros["varParam"];
      }
      console.log("en ngOnInit monitor vendedor 2 ",this.varParam);
      // this.id = parametros['id'];
      if (this.vparcaptura) {
        this.id = this.vid;
      } else {
        this.id = parametros["id"];
      }
    //Traer personas           
    this.getPersonas()
    .subscribe((datosper: any) => {
      this.personas = [];
       datosper.forEach(elementper  => {
         if (elementper.idOnesignal) {
            if (elementper.cod_person === this.id) {
                this.idokOnesignal = true;
                this.idonesignalenviar = elementper.idOnesignal;
            }
            this.personas.push(elementper);
          }
        });
       console.log('this.personas',this.personas);
    });

      //ASEGURARSE QUE ESTA VAR PARAMETROS EN LOCALSTORAGE
      this.service.verificaVpar("CRMVENDEDOR", "VPARVENDEDORES").subscribe(
        resultado => {
          let lvart: any;
          lvart = localStorage.getItem(this.varParam);
          let lobjpar = JSON.parse(lvart);
          this.title = "Monitor vendedor";
          this.rutamant = "";
          this.paplica = "0";
          this.ptablab = "VENDEDORES";
          this.pcampollave = "cod_vended";
          this.pcamponombre = "detalle";
          this.pclase_nbs = "";
          this.pclase_val = "";
          let lvar = "";
          lvar = localStorage.getItem("DDT" + this.ptablab);
          this.mantbasicaService
            .getregTabla(
              this.id,
              this.ptablab,
              this.paplica,
              this.pcampollave,
              this.pclase_nbs,
              this.pclase_val,
              this.pcamponombre
            )
            .subscribe(
              regTabla => {
                var result0 = regTabla[0];
                if (typeof result0 != "undefined") {
                  this.enlistaerror = true;
                  this.listaerrores = regTabla;
                } else {
                  this.regVendedor = regTabla;
                  console.log("Trae regvendedor");
                  console.log(this.regVendedor);
                  this.filtroactividades =
                    "usuario='" + regTabla.cod_vended + "'";
                  this.linkmonivended =
                    "../EjeConsultaLis.wss?VRCod_obj=MONITORVENDTLTE&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_VENDED='" +
                    regTabla.cod_vended +
                    "',PVXIANO=" +
                    "2018";
                        //cargar anos recorrido persona
                        this.getanosrecorrido(regTabla.cod_vended).subscribe(
                          (datosrec: any) => {
                            this.anosrecorrido = datosrec;
                            this.cargo_anosrecorido = true;
                            console.log("aÑOS cargados ", this.anosrecorrido);
                          //cargar mese ano seleccionado recorrido persona
                          this.getmesesrecorrido(regTabla.cod_vended,this.recoano)
                          .subscribe((datosmes: any) => {                          
                            this.mesesrecorrido = datosmes;
                            this.cargo_mesesrecorido = true;
                            if (datosmes.length > 0){
                                //asignar el ultimo mes valido 
                                console.log('Se asigna mes ', datosmes, datosmes.length);
                                this.recmes = datosmes[datosmes.length-1].id;
                                console.log('Se asigna mes ',this.recmes)
                            }
                            console.log("meses 2019 cargados ", datosmes);
                            //cargar dias  ano mes seleccionado recorrido persona
                            this.getdiasrecorrido(regTabla.cod_vended,this.recoano,this.recmes)
                                .subscribe((datosdias: any) => {
                                  this.diasrecorrido = datosdias;
                                  this.cargo_diasrecorido = true;
                                  // console.log("dias 2019 cargados ", datosdias);
                                  if (datosdias.length > 0){
                                    //asignar el ultimo mes valido 
                                    console.log('Se asigna dia ', datosdias, datosdias.length);
                                    this.recdia = datosdias[datosdias.length-1].id;
                                    console.log('Se asigna dia ',this.recdia)
                                }    
                                  console.log('v 1');
                                  //cargar historial  ano mes dia seleccionado recorrido persona
                                  this.gethistorialrecorrido(regTabla.cod_vended,this.recoano,this.recmes,this.recdia
                                  ).subscribe((datoshis: any) => {
                                    // console.log('datoshis', datoshis);
                                    this.historialrecorrido = datoshis;
                                    if (datoshis.length > 0) {
                                      this.latrecorrido = datoshis[0].latitud;
                                      this.lngrecorrido = datoshis[0].longitud;
                                      this.cargo_historialrecorido = true;
                                    }
                                  });          
                                  this.gettrayectonetsolinesta(regTabla.cod_vended,this.recoano,this.recmes,this.recdia)
                                    .then(resesta => {
                                      if (resesta){
                                        console.log('Res trayecto esta netsolin', resesta);
                                        console.log('Esta trayectodia:',this.trayectodia);
                                      }
                                  })
                                  .catch(error => {
                                    this.cargo_trayectonetsolin = false;
                                    console.error('Error al traer esta:', error);
                                  });                      
                                });                            
                          });
                          }
                        );                        
                        console.log('v 2');
                        //para resumen diario
                        //cargar anos recorrido persona
                        this.getanosresumen(regTabla.cod_vended).subscribe(
                          (datosrec: any) => {
                            this.anosresum = datosrec;
                            this.cargo_anosresum = true;
                            console.log("aÑOS cargados resum ", this.anosresum);
                            console.log('v 3');
                            //cargar mese ano seleccionado recorrido persona
                            this.getmesesresumen(regTabla.cod_vended,this.resumano
                            ).subscribe((datosmesres: any) => {
                              this.mesesresum = datosmesres;
                              this.cargo_mesesresum = true;
                              console.log("meses 2019 cargados  resum", datosmesres);
                              console.log('v 4');
                              //cargar dias  ano mes seleccionado recorrido persona
                              this.getdiasresumen(regTabla.cod_vended,this.resumano,this.resummes)
                              .subscribe((datosdias: any) => {
                                this.diasresum = datosdias;
                                this.cargo_diasresum = true;
                                console.log("dias 2019 cargados resume ", datosdias);
                                console.log('v 5');
                                //cargar ciere caja  ano mes dia seleccionado recorrido persona
                                if (datosdias.length > 0 ){
                                  this.actcierrecajaresumen();
                                  this.actrecibosresumen();
                                  this.actconsignacionesresumen();
                                }
                                      });
                                  });
                              }
                        );
                    // this.paramtabvendrutas.cod_vended=regTabla.cod_vended;
                    //carga personas
                    this.pcod_vended = regTabla.cod_vended;
                    this.service
                    .cargaPeriodoUsuar(regTabla.cod_vended)
                    .then(cargo => {
                      if (cargo) {
                        console.log(cargo, this.service);
                        this.id_ruta = this.service.id_ruta;
                        this.id_periodo = this.service.id_periodo;

                        //aqui
                        const lruta = `/personal/${regTabla.cod_vended}/rutas/${
                          this.id_ruta
                        }/periodos/${this.id_periodo}/visitas`;
                        console.log(lruta);
                        this.db.collection(lruta)
                          .valueChanges()
                          .subscribe((data: any) => {
                            console.log("trae visitas vendedor de firebase", data);
                            this.visitas = [];
                            this.visicumplidiaresum = [];
                            this.visitas_cumplidas = [];
                            this.visitas_encurso = [];
                            this.visitas_pendientes = [];
                            this.visitas_xllamada = [];
                            this.visitas = data;
                            //recorrer visitas si latitud y longitud estan en 0 dejar la de boccherini
                            // console.log(this.visitas);
                            this.visitas.map(function(dato){
                                if(dato.latitud == 0){
                                    dato.latitud = 4.6529392;
                                    dato.longitud = -74.1230245;
                                }  
                            });
                            // console.log(this.visitas);
                            if (data.length>0 ){
                              this.lat = data[0].latitud;
                              this.lng = data[0].longitud;
                            } else{
                              console.log('No tiene visitas '+`/personal/${regTabla.cod_vended}/rutas/${this.id_ruta}/periodos/${this.id_periodo}/visitas`);
                              this.lat = 4.6529392;
                              this.lng = -74.1230245;
                            } 
                              console.log('clasificando visitas 1',this.visitas);
                            this.visitas_xllamada = this.visitas.filter(
                              reg => reg.llamada === true
                            );
                            this.visitas_cumplidas = this.visitas.filter(
                              reg => reg.estado === "C" && !reg.llamada
                            );
                            this.visitas_encurso = this.visitas.filter(
                              regc => regc.estado === "A"
                            );
                            this.visitas_pendientes = this.visitas.filter(
                              regP => regP.estado === "P" || regP.estado === ""
                            );
                          console.log('Visitas x llamada:',this.visitas_xllamada);
                          //   onSearch() {
                          //     fechasFiltradas = this.myDates
                          //            .filter((date: Date) => pickerDate.getTime() < date.getTime() < pickerDate2.getTime());
                          //  }

                            this.visitas_cumplidas.forEach((visiData: any) => {
                              const fecierres = visiData.fechahora_cierre;
                              const fmiliseg = Date.parse(fecierres);
                              const fecierre = new Date(fmiliseg);
                              // console.log('visitas cumplidas ', visiData);
                              // console.log('vicumpli1 fecierre fmili', fecierres, fecierre);
                              const ano = fecierre.getFullYear();
                              const mes = fecierre.getMonth() + 1;
                              const dia = fecierre.getDate();
                              if ( this.resumano === ano.toString() && this.resummes === mes.toString() && this.resumdia === dia.toString()){
                                  this.visicumplidiaresum.push(visiData);
                              }
                            });  
                            console.log('visitas del dia', this.visicumplidiaresum);
                            if (!this.init) {
                              if (data.length>0){
                              this.lat = data[0].latitud;
                              this.lng = data[0].longitud;
                              }
                              this.init = true;
                            }
                          });
                        //cargar clientes potenciales del vendedor
                        this.clientespotenrepor = [];
                        this.getClientespotenciales(regTabla.cod_vended)
                        .subscribe((data: any) => {
                          console.log("trae clientes potenciales de firebase", data);
                          this.cargoclienpoten = true;
                          this.clientespotenrepor = data;
                        });
                      } else {
                        console.log("ngOnInit home NO CARGO cargaPeriodoUsuar");
                      }
                    })
                    .catch(error => {
                      console.log("error en cargaPeriodoUsuar ", error);
                    });
                  var fecha = new Date();
                  var ano = fecha.getFullYear();
                  var mes = fecha.getMonth();
                  this.cargovendedor = true;
                  this.inicializaMonitor(regTabla);
                }
              },
              error => {
                this.showError(error);
              }
            );
        },
        error => {
          this.showError(error);
        }
      );
    });
  }

  inicializaMonitor(preg: any) {
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    this.cargando = true;
    this.resultados = false;
    var cbus = preg.cod_vended;
    this.filtrocotiza = "c.cod_vended='" + cbus + "'";
    console.log("this.filtrocotiza:" + this.filtrocotiza);
    // this.filtrocotiza=preg.id_cliepote.toString();
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    this.cargando = false;
    this.resultados = true;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {}

  retornaRuta() {
    // console.log(this.rutamant);
    return "/" + this.rutamant;
  }

  onSubmit() {
    this.enerror = false;
    // this.grabo = false;
  }

  showError(msg) {
    this.message = msg;
    this.enerror = true;
    // console.log(this.message);
  }

  showMensaje(msg) {
    this.message = msg;
    this.enerror = false;
    // console.log(this.message);
  }

  retornaRutaAcampana() {
    // addregtbasica/VPARCOMPETENCIA
  }

  openconsulta(ptipo) {
    if (ptipo == "llamabusqueda") {
      this.llamabusqueda = true;
    }
  }
  public closeconsulta(ptipo) {}
  public closebusquellama(event) {
    console.log("en moni cliepote llega sde bus prod:" + event);
    this.pruellegallabusque = event;
    this.llamabusqueda = false;
  }

  openeditar(ptipo) {}
  public closeeditar(ptipo) {}

  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
    if (ptipo == "cotiza") {
      this.crearcotiza = true;
    }
  }
  //maneja el control para cerrar

  public closeadicion(ptipo) {
    if (ptipo == "cotiza") {
      this.crearcotiza = false;
    }
  }

  conmutacollapse() {
    this.collapse = !this.collapse;
  }
  esconderpanel() {
    this.esconder = true;
  }

  cleanURL(oldURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
  }

  public monitorClick(dataItem): void {
    var pruta = `/monitorvisita/${dataItem.cod_tercer}/${
      this.regVendedor.cod_vended
    }/${dataItem.id_ruta}/${dataItem.id_reffecha}/${dataItem.id_visita}/`;
    // const lruta = `/personal/${regTabla.cod_vended}/rutas/${this.service.id_ruta}/periodos/${this.service.id_periodo}/visitas`;

    console.log("ir a monitor visita pruta:" + pruta);
    // this.router.navigate([pruta, dataItem]);
    this.router.navigate([pruta]);
  }
  public monitorClickcliepoten(dataItem): void {
    var pruta = `/monitorcliepoten/${dataItem.id}/${this.regVendedor.cod_vended}/`;
    console.log("ir a monitor clienpoten pruta:" + pruta);
    // this.router.navigate([pruta, dataItem]);
    this.router.navigate([pruta]);
  }
   //Obtiene actividades de la visita actual
public getClientespotenciales(cod_vended) {
    return this.db.collection(`/personal/${cod_vended}/clientespoten`)
    .snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data };
      })
        )
    ) 
  }   
  
  retornaRutacotiza() {
    // console.log('ruta cotiza');
    // console.log('/cotizacion'+ '/VARPARCOTIZACRM_C/0' +  '/' + this.regCliepote.id_cliepote+ '/' + this.regCliepote.id_cliepote+'/A');
    return "/cotizacion" + "/VPARCOTIZACRM_C/0" + "/" + "0/" + "0/A/na/na";
  }
  //Trae años recorrido peronal
  public getanosrecorrido(ppersona: string) {
    return this.db
      .collection(`/personal/${ppersona}/recorrido`)
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  //Trae meses recorrido peronal
  public getmesesrecorrido(ppersona: string, ano: string) {
    console.log('getmesesrecorrido ppersona:', ppersona);
    return this.db
      .collection(`/personal/${ppersona}/recorrido/${ano}/meses`)
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  //Trae dias recorrido peronal
  public getdiasrecorrido(ppersona: string, ano: string, mes: string) {
    console.log('getdiasrecorrido ppersona:', ppersona);
    return this.db
      .collection(`/personal/${ppersona}/recorrido/${ano}/meses/${mes}/dias`)
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  //Trae historial recorrido peronal
  public gethistorialrecorrido(
    ppersona: string,
    ano: string,
    mes: string,
    dia: string
  ) {
    console.log('gethistorialrecorrido ppersona:', ppersona);
    return this.db
      .collection(
        `/personal/${ppersona}/recorrido/${ano}/meses/${mes}/dias/${dia}/historial`
      ).valueChanges();
  //     .stateChanges()
  //     .pipe(
  //       map(actions =>
  //         actions.map(a => {
  //           console.log('hist statechange 1', a);
  //           const data = a.payload.doc.data();
  //           const id = a.payload.doc.id;
  //           console.log('hist statechange 1', id, data);
  //           return { id, ...data };
  //         })
  //       )
  //     );
  // }
  // /cambiar año de acuerdo al seleccionado
      }

  //Trae trayecto estadistica Netsolin
  public gettrayectonetsolinesta(
    ppersona: string,
    ano: string,
    mes: string,
    dia: string
  ) {
    console.log('gettrayectonetsolinesta ppersona:', ppersona);
    const paramfiltro = {
      // datos_gen: this._visitas.visita_activa_copvdet.datosgen,
      asesor: ppersona,
      ano: ano,
      mes: mes,
      dia: dia
    };
    this.cargo_trayectonetsolin = false;
    return new Promise((resolve)=>{
    NetsolinApp.objenvrest.filtro = "";
    NetsolinApp.objenvrest.parametros = paramfiltro;
    const url = NetsolinApp.urlNetsolin +"netsolin_servirestgo.csvc?VRCod_obj=APPESTATRAYECTO";
    this.http.post(url, NetsolinApp.objenvrest).subscribe((data: any) => {
      console.log(" genera_estadisitca_netsolin data:", data);
      if (data.error) {
        console.error(" genera_estadisitca_netsolin ", data.men_error);
      } else {
        if (data.isCallbackError || data.error) {
          console.error(" Error genera_estadisitca_netsolin ",data.messages[0].menerror);
          resolve(false);
        } else {
          this.cargo_trayectonetsolin = true;
          this.trayectodia = data.trayecto;  
          console.log('Esta trayectodia:',this.trayectodia);
          resolve(true);
        }
      }
      console.log(" genera_estadisitca_netsolin 4");
    });
  });
  }
      

  selecanorecorrido(ano) {
    this.historialrecorrido = [];
    this.recoano = ano.id.toString();
    console.log("cambio año a ", this.recoano);
                          //cargar mese ano seleccionado recorrido persona
                          this.getmesesrecorrido(this.pcod_vended,this.recoano)
                          .subscribe((datosmes: any) => {                          
                            this.mesesrecorrido = datosmes;
                            this.cargo_mesesrecorido = true;
                            console.log("meses 2019 cargados ", datosmes);
                            //cargar dias  ano mes seleccionado recorrido persona
                            this.getdiasrecorrido(this.pcod_vended,this.recoano,this.recmes)
                                .subscribe((datosdias: any) => {
                                  this.diasrecorrido = datosdias;
                                  this.cargo_diasrecorido = true;
                                  // console.log("dias 2019 cargados ", datosdias);
                                  console.log('v 1');
                                  //cargar historial  ano mes dia seleccionado recorrido persona
                                  this.gethistorialrecorrido(this.pcod_vended,this.recoano,this.recmes,this.recdia
                                  ).subscribe((datoshis: any) => {
                                    console.log('datoshis', datoshis);
                                    this.historialrecorrido = datoshis;
                                    if (datoshis.length > 0) {
                                      this.latrecorrido = datoshis[0].latitud;
                                      this.lngrecorrido = datoshis[0].longitud;
                                      this.cargo_historialrecorido = true;
                                    }
                                  });
                                  this.gettrayectonetsolinesta(this.pcod_vended,this.recoano,this.recmes,this.recdia)
                                    .then(resesta => {
                                      if (resesta){
                                        console.log('Res trayecto esta netsolin', resesta);
                                        console.log('Esta trayectodia:',this.trayectodia);
                                      }
                                  })
                                  .catch(error => {
                                    this.cargo_trayectonetsolin = false;
                                    console.error('Error al traer esta:', error);
                                  });                      

                                });                            
                          });
  }
  selecmesrecorrido(mes) {
    this.historialrecorrido = [];
    this.recmes = mes.id.toString();
    console.log("cambio mes a, vend ", this.recmes,this.pcod_vended);
                            //cargar dias  ano mes seleccionado recorrido persona
                            this.getdiasrecorrido(this.pcod_vended,this.recoano,this.recmes)
                                .subscribe((datosdias: any) => {
                                  this.diasrecorrido = datosdias;
                                  this.cargo_diasrecorido = true;
                                  // console.log("dias 2019 cargados ", datosdias);
                                  console.log('v 1');
                                  //cargar historial  ano mes dia seleccionado recorrido persona
                                  this.gethistorialrecorrido(this.pcod_vended,this.recoano,this.recmes,this.recdia
                                  ).subscribe((datoshis: any) => {
                                    console.log('datoshis', datoshis);
                                    this.historialrecorrido = datoshis;
                                    if (datoshis.length > 0) {
                                      this.latrecorrido = datoshis[0].latitud;
                                      this.lngrecorrido = datoshis[0].longitud;
                                      this.cargo_historialrecorido = true;
                                    }
                                  });
                                  this.gettrayectonetsolinesta(this.pcod_vended,this.recoano,this.recmes,this.recdia)
                                    .then(resesta => {
                                      if (resesta){
                                        console.log('Res trayecto esta netsolin', resesta);
                                        console.log('Esta trayectodia:',this.trayectodia);
                                      }
                                  })
                                  .catch(error => {
                                    this.cargo_trayectonetsolin = false;
                                    console.error('Error al traer esta:', error);
                                  });                      

                                });                            

  }
  selecdiarecorrido(dia) {
    this.historialrecorrido = [];
    this.recdia = dia.id.toString();
    this.cargo_historialrecorido = false;
    console.log("cambio dia a ", this.recdia);
    //cargar historial  ano mes dia seleccionado recorrido persona
    this.gethistorialrecorrido(
      this.pcod_vended,
      this.recoano,
      this.recmes,
      this.recdia
    ).subscribe((datoshis: any) => {
      console.log('act histo reco x dia', datoshis,datoshis.length);
      if (datoshis.length > 0) {
        this.historialrecorrido = datoshis;
        this.latrecorrido = datoshis[0].latitud;
        this.lngrecorrido = datoshis[0].longitud;
        console.log('historial recorrido a pintar:',this.historialrecorrido);
        this.cargo_historialrecorido = true;
      }
    });
    this.gettrayectonetsolinesta(this.pcod_vended,this.recoano,this.recmes,this.recdia)
    .then(resesta => {
      if (resesta){
        console.log('Res trayecto esta netsolin', resesta);
        console.log('Esta trayectodia:',this.trayectodia);
      }
  })
  .catch(error => {
    this.cargo_trayectonetsolin = false;
    console.error('Error al traer esta:', error);
  });                      

  }

  //Trae años resumen peronal
  public getanosresumen(ppersona: string) {
    return this.db
      .collection(`/personal/${ppersona}/resumdiario`)
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  //Trae meses resumen peronal
  public getmesesresumen(ppersona: string, ano: string) {
    console.log(ppersona,ano);
    return this.db
      .collection(`/personal/${ppersona}/resumdiario/${ano}/meses`)
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  //Trae dias resumen peronal
  public getdiasresumen(ppersona: string, ano: string, mes: string) {
    return this.db
      .collection(`/personal/${ppersona}/resumdiario/${ano}/meses/${mes}/dias`)
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

    //Trae vendedores  firebase
    public getvendedores() {    
      return this.db
      .collection(`personal`)
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
    }

  //Trae rutas vendedor
  public getrutasvend(ppersona: string) {
    return this.db
      .collection(`/personal/${ppersona}/rutas`)
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  //Trae periodos una ruta vendedor
  public getperiodorutavend(ppersona: string,idruta) {
    return this.db
      .collection(`/personal/${ppersona}/rutas/${idruta}/periodos`)
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  //Trae visitas periodo una ruta vendedor
  public getvisitasperiodorutavend(ppersona: string,idruta,pperido) {
    return this.db
      .collection(`/personal/${ppersona}/rutas/${idruta}/periodos/${pperido}/visitas`)
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  //Trae cierrecaja resumen peronal
  public getcierrecajaresumen(
    ppersona: string,
    ano: string,
    mes: string,
    dia: string
  ) {
    return this.db
      .collection(
        `/personal/${ppersona}/resumdiario/${ano}/meses/${mes}/dias/${dia}/cierrecaja`
      ).valueChanges();
      }
  
  //Trae visitas cerradas resumen personal
  public getvisitascerradaresumen(
    ppersona: string,
    ano: string,
    mes: string,
    dia: string
  ) {
    return this.db
      .collection(
        `/personal/${ppersona}/resumdiario/${ano}/meses/${mes}/dias/${dia}/cierrevisita`
      ).valueChanges();
      }
        
      //Trae recibos resumen peronal
  public getrecibosresumen(
    ppersona: string,
    ano: string,
    mes: string,
    dia: string
  ) {
    return this.db
      .collection(
        `/personal/${ppersona}/resumdiario/${ano}/meses/${mes}/dias/${dia}/recibos`
      ).valueChanges();
      }

//Trae consignaciones resumen peronal
public getconsignacionesresumen(ppersona: string,ano: string,mes: string,dia: string) {
  return this.db
    .collection(
      `/personal/${ppersona}/resumdiario/${ano}/meses/${mes}/dias/${dia}/consignaciones`
    ).valueChanges();
}

      //actualiza cierre caja de firebas
  actcierrecajaresumen(){
    this.getcierrecajaresumen(
      this.pcod_vended,
      this.resumano,
      this.resummes,
      this.resumdia
    ).subscribe((datoshis: any) => {
      console.log('act cierre caja reco x ano', datoshis);
      this.cierrecajaresum = datoshis;
      this.clasificaCierre();
      this.cargo_cierrecajaresum = true;
    });
  }
  //actualiza recibos de firebas
  actrecibosresumen(){
    this.getrecibosresumen(
      this.pcod_vended,
      this.resumano,
      this.resummes,
      this.resumdia
    ).subscribe((datoshis: any) => {
      console.log('act recibos reco x ano', datoshis);
      this.recibosresum = datoshis;
      this.cargo_recibosresum = true;
    });
  }
//actualiza consignaciones de firebas
actconsignacionesresumen(){
  this.getconsignacionesresumen(
    this.pcod_vended,
    this.resumano,
    this.resummes,
    this.resumdia
  ).subscribe((datoshis: any) => {
    this.consignacionesresum = datoshis;
    console.log('act consig reco x ano', this.consignacionesresum);
    this.cargo_consignacionesresum = true;
  });
}
//actualiza cierre vistas (cumplidas) de firebas
actvisitascumplidasresumen(){
  this.visicumplidiaresum = [];
  this.getvisitascerradaresumen(
    this.pcod_vended,
    this.resumano,
    this.resummes,
    this.resumdia
  ).subscribe((datoshis: any) => {
    this.visicumplidiaresum = datoshis;
    console.log('act actvisitascumplidasresumen', this.visicumplidiaresum);
    // this.cargo_consignacionesresum = true;
  });
}


//actualiza visitas cumplidas de firebas
actvisitascumplidasresumenAnterior(){
  this.visicumplidiaresum = [];
  console.log('getvisitascumplidasresumen ',this.visicumplidiaresum,this.visitas_cumplidas)
    this.visitas_cumplidas.forEach((visiData: any) => {
      const fecierres = visiData.fechahora_cierre;
      const fmiliseg = Date.parse(fecierres);
      const fecierre = new Date(fmiliseg);
      console.log('visitas cumplidas ', visiData);
      console.log('vicumpli1 fecierre fmili', fecierres, fecierre);
      const ano = fecierre.getFullYear();
      const mes = fecierre.getMonth() + 1;
      const dia = fecierre.getDate();
      console.log(this.resumano,ano.toString(),this.resummes,mes.toString(),this.resumdia,dia.toString());
      if ( this.resumano === ano.toString() && this.resummes === mes.toString() && this.resumdia === dia.toString()){
          this.visicumplidiaresum.push(visiData);
      }
    });  
}
selecanoresum(ano) {
    this.cierrecajaresum = [];
    this.resumano = ano.id.toString();
    console.log("cambio año a ", this.resumano);
    //cargar mese ano seleccionado recorrido persona
    this.getmesesresumen(this.pcod_vended,this.resumano
    ).subscribe((datosmesres: any) => {
         this.mesesresum = datosmesres;
         this.cargo_mesesresum = true;
         console.log("meses 2019 cargados  resum", datosmesres);
         console.log('v 4');
         //cargar dias  ano mes seleccionado recorrido persona
         this.getdiasresumen(this.pcod_vended,this.resumano,this.resummes)
         .subscribe((datosdias: any) => {
              this.diasresum = datosdias;
              this.cargo_diasresum = true;
              console.log("dias 2019 cargados resume ", datosdias);
              console.log('v 5');
             //cargar ciere caja  ano mes dia seleccionado recorrido persona
              this.actcierrecajaresumen();
              this.actrecibosresumen();
              this.actconsignacionesresumen();
              this.actvisitascumplidasresumen();
        });
   });
}
  selecmesresum(mes) {
    this.cierrecajaresum = [];
    this.resummes = mes.id.toString();
    console.log("cambio mes a ", this.resummes);
    this.getdiasresumen(this.pcod_vended,this.resumano,this.resummes)
      .subscribe((datosdias: any) => {
        this.diasresum = datosdias;
        this.cargo_diasresum = true;
        console.log("dias 2019 cargados resume ", datosdias);
        console.log('v 5');
        //cargar ciere caja  ano mes dia seleccionado recorrido persona
        this.actcierrecajaresumen();
        this.actrecibosresumen();
        this.actconsignacionesresumen();
        this.actvisitascumplidasresumen();
    });
}
  selecdiaresum(dia) {
    this.cierrecajaresum = [];
    this.resumdia = dia.id.toString();
    console.log("cambio dia a ",this.resumano,this.resummes, this.resumdia);
    this.actcierrecajaresumen();
    this.actrecibosresumen();
    this.actconsignacionesresumen();
    this.actvisitascumplidasresumen();
}

  linkrecibo(cod_docume,num_docume, fecha) {    
    const linkrecibo = "../EjeConsultaLis.wss?VRCod_obj=MONIDOCCONTA&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_DOCUME='"
          + cod_docume+"',PVXINUM_DOCUME='"+num_docume+"',PVXIFECHA='" + this.service.fechacad(fecha) + "'";
          console.log('linkrecibo ', linkrecibo);
          return this.cleanURL(linkrecibo);
    }
  linkconsigna(cod_docume,num_docume, fecha) {    
      const linkconsig = "../EjeConsultaLis.wss?VRCod_obj=MONIDOCCONTA&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_DOCUME='"
            + cod_docume+"',PVXINUM_DOCUME='"+num_docume+"',PVXIFECHA='" + this.service.fechacad(fecha) + "'";
            console.log('linkconsig ', linkconsig);
            return this.cleanURL(linkconsig);
      }
    onValuechangeverifica(value,recibo)
    {
      console.log('change verifica ',value,recibo );
      //Actualizar Verificado
      const idrecibo = recibo.cod_docume.trim() + recibo.num_docume.trim();
      const now = new Date();
      this.db
      .collection(
        `/personal/${this.regVendedor.cod_vended}/resumdiario/${this.resumano}/meses/${this.resummes}/dias/${this.resumdia}/recibos`
      )
      .doc(idrecibo)
      .update({ verificado: value,
         codusua_verifica: NetsolinApp.oapp.cuserid,
        nomusua_verifica: NetsolinApp.oapp.nomusuar,
        fecha_verifica: now});
    }
    onValuechangeverificaconsig(value,consig)
    {
      console.log('change verifica ',value,consig );
      //Actualizar Verificado
      const idconsig = consig.cod_docume.trim() + consig.num_docume.trim();
      const now = new Date();
      this.db
      .collection(
        `/personal/${this.regVendedor.cod_vended}/resumdiario/${this.resumano}/meses/${this.resummes}/dias/${this.resumdia}/consignaciones`
      )
      .doc(idconsig)
      .update({ verificado: value,
         codusua_verifica: NetsolinApp.oapp.cuserid,
        nomusua_verifica: NetsolinApp.oapp.nomusuar,
        fecha_verifica: now});
    }

    clasificaCierre() {
        this.cierrecajaefe = this.cierrecajaresum.filter(reg => reg.formpago === 'EFE');
        this.cierrecajachd = this.cierrecajaresum.filter(reg => reg.formpago === 'CHD');
        this.cierrecajapbcs = this.cierrecajaresum.filter(reg => reg.formpago === 'PBCS');
        this.cierrecajapbtr = this.cierrecajaresum.filter(reg => reg.formpago === 'PBTR');
    }
    totalforpago(arrayfp){
      let total = 0;
      if (arrayfp){
              if (arrayfp.length > 0) {
                arrayfp.forEach((val, i) => {
                  total += val.valor;
              });
          }
        }
      return total;
    }
    totalconsig(arrayfp){
      let total = 0;
      console.log('array asumar',arrayfp);
      if (arrayfp){
        if (arrayfp.length > 0) {
                arrayfp.forEach((val, i) => {
                  total += val.valor;
              });
          }
        }
      return total;
    }
    public close(status) {
      console.log(`Dialogo result: ${status}`,this.mensajeenviar);
      const now = new Date();
      // Notificar por pushnotification
      this.service.pushNotification(this.asuntomensajeenviar,this.mensajeenviar,this.actusuarenviar,this.idonesignalenviar);
      if (this.actusuarenviar ) {
        this.db.collection(`/personal/${this.regVendedor.cod_vended}/mensajes`)
        .add({ asunto: this.asuntomensajeenviar,
          mensaje: this.mensajeenviar,
          cod_person: NetsolinApp.oapp.cuserid,
          envaidopor: NetsolinApp.oapp.nomusuar,
          read: false,
          fecha_enviado: now});
      } else { 
        // Todos
        this.personas.forEach(elementper  => {
          this.db.collection(`/personal/${elementper.cod_person}/mensajes`)
          .add({ asunto: this.asuntomensajeenviar,
            mensaje: this.mensajeenviar,
            cod_person: NetsolinApp.oapp.cuserid,
            envaidopor: NetsolinApp.oapp.nomusuar,
            read: false,
            fecha_enviado: now});
        });
    } 
      this.openedmensaje = false;
    }

    public open() {
      this.openedmensaje = true;
    }    

    public closeesta(status) {
      console.log(`Dialogo reporcesar estadist: ${status}`, this.resumano , this.resummes, this.resumdia, this.repro_solomes);
      if (status !== 'no'){
        this.men_proceso = 'Procesando..';
        // this.getPersonas()
        // .subscribe((datosper: any) => {
        //   datosper.forEach(elementper => {
            let lmescon = 0;
            // this.men_proceso = 'Procesando..'+elementper.cod_person;
            // this.getmesesresumen(elementper.cod_person,this.resumano)
            this.men_proceso = 'Procesando..'+this.pcod_vended;
            if (this.repro_solomes){
              //Por prueba arreglo
              // this.reprocesames(this.pcod_vended,this.resummes);
              this.arreglarutavendedor();
            } else {
            this.getmesesresumen(this.pcod_vended,this.resumano)
            .subscribe((datosmeses: any) => {
              datosmeses.forEach(elementm => {
                lmescon = elementm.mes;          
                // this.men_proceso = 'Procesando a reprocesar mes:'+elementper.cod_person+'-'+elementper.cod_person;
                // this.reprocesames(elementper.cod_person,lmescon);
                this.men_proceso = 'Procesando a reprocesar mes:'+this.pcod_vended;
                this.reprocesames(this.pcod_vended,lmescon);
              });
            });     
          }         
        //         });
        // });              
    }
    this.openedestadis = false;
  }

public reprocesames(pcod_vended,pmes){
  const now = new Date();
  let ldiacon = 0;
  
  this.men_proceso="Reprocesando mes: "+pcod_vended+'-'+this.resumano+'-'+pmes;
  this.getdiasresumen(pcod_vended,this.resumano,pmes)
  .subscribe((datosdias: any) => {
    datosdias.forEach(elementd => {
      ldiacon = elementd.dia;          
      this.men_proceso="Reprocesando mes: "+pcod_vended+'-'+this.resumano+'-'+pmes+'-'+elementd.dia.toString();
      console.log('Traer visitas dia:', pcod_vended,this.resumano,pmes,elementd);
      this.getvisitascerradaresumen(pcod_vended,this.resumano,pmes,elementd.dia
        ).subscribe((datosvisdia: any) => {
          // console.log('datosvisdia:',pcod_vended,this.resumano,pmes,elementd, datosvisdia);
          datosvisdia.forEach(element => {
            //carga visita
            console.log('cargo visita element: ',element);
            this.men_proceso="Reprocesando mes: "+pcod_vended+'-'+this.resumano+'-'+pmes+'-'+elementd.dia.toString()+'-'+element.id_visita.toString();
            this.getVisita(pcod_vended,element.id_ruta,element.id_reffecha,element.id_visita.toString()).subscribe((datosvisita: any) => {
              this.men_proceso="Reprocesando mes Cargandio visitas: "+pcod_vended+'-'+this.resumano+'-'+pmes;
              // console.log('cargo visita: ',datosvisita);
            //cargar  persona actual (vendedor)
              this.getPersonalVisita(pcod_vended).subscribe((datosactp: any) => {
                // console.log('cargo persona: ',datosactp);
                //cargar  direccion visita
              this.getDireccionActual(element.id_dir, element.cod_tercer).subscribe((datosdir: any) => {
                // console.log('cargo datosdir: ',datosdir);
                  this.getPedidosVisita(element.id_visita, element.cod_tercer).subscribe((datosped: any) => {
                    // console.log('cargo datosped: ',datosped);
                    //cargar facturas ojo con el id_visita
                    this.getFacturasVisita(element.id_visita, element.cod_tercer).subscribe((datosfac: any) => {
                      // console.log('cargo datosfac: ',datosfac);
                      //cargar recibos ojo con el id_visita
                      this.getRecibosVisita(element.id_visita, element.cod_tercer).subscribe((datosrec: any) => {
                        // console.log('datosdia, element visita:', ldiacon,element);
                        // console.log('persona cargada ', datosactp);
                        // console.log('Direccion cargada ', datosdir);
                        // console.log('pedidos cargados ', datosped);
                        // console.log('Recibos cargados ', datosrec);
                        // console.log('Facturas cargados ',datosfac);
                        element.fechaing = new Date(element.fechaing);
                        element.fechacierre = new Date(element.fechacierre);
                        if (typeof datosvisita !== "undefined" && typeof datosvisita.llamada !== "undefined") {
                          element.llamada = datosvisita.llamada;
                        } else {
                          element.llamada = false;
                        }
                        const paramgrab = {
                          // datos_gen: this._visitas.visita_activa_copvdet.datosgen,
                          dvisita: element,
                          pedidos: datosped,
                          facturas: datosfac,
                          recibos: datosrec,
                          usuario: datosactp
                        };
                        // console.log('Reprocesando:',this.resumano,pmes,ldiacon,paramgrab);
                        NetsolinApp.objenvrest.filtro = "";
                        NetsolinApp.objenvrest.parametros = paramgrab;
                        const url = NetsolinApp.urlNetsolin +"netsolin_servirestgo.csvc?VRCod_obj=APPREPROESTACIERRE";
                        this.http.post(url, NetsolinApp.objenvrest).subscribe((data: any) => {
                          if (data.error) {
                            this.men_proceso=" genera_estadisitca_netsolin "+data.men_error;
                            console.error(" genera_estadisitca_netsolin ", data.men_error);
                          } else {
                            if (data.isCallbackError || data.error) {
                              this.men_proceso="Error genera_estadisitca_netsolin "+data.messages[0].menerror;
                              console.error("Error genera_estadisitca_netsolin ",data.messages[0].menerror, element.id_visita, element.cod_tercer, paramgrab );
                            } else {
                              this.men_proceso='Se genero_estadisitca_netsolin: Año:'
                                + this.resumano+' Mes: '+pmes+' día:'+ldiacon.toString()+' Visita:'+element.id_visita.toString();
                              console.log("Se genero_estadisitca_netsolin:", this.resumano,pmes,ldiacon,element.id_visita);
                              // console.log('Se actualizo estadistica visita');
                            }
                          }
                          // console.log(" genera_estadisitca_netsolin 4");
                        });                  
                      });
                    });
                  });                 
              });        
            });        
          });        
        });
      });                 
    });
 });
} 

getarreglosNetsolin(){

}
  public arreglarutavendedor() {
    //Op Agosto 20 19
    let pcod_vended='';
    let lruta = '';
    let lperiodo = '';
    let lvisita= '';
                        NetsolinApp.objenvrest.filtro = "";
                        NetsolinApp.objenvrest.parametros = "";
                        const url = NetsolinApp.urlNetsolin +"netsolin_servirestgo.csvc?VRCod_obj=RESTVISIARREGLAR";
                        console.log('A consultar visitas a arrgelar netsolin',NetsolinApp.objenvrest, url);
                        this.http.post(url, NetsolinApp.objenvrest).subscribe((data: any) => {
                          if (data.error) {
                            console.log("errotrae errore para arreglar ", data.men_error);
                          } else {
                            if (data.isCallbackError || data.error) {
                              console.error("error traer arreglo_netsolin ",data.messages[0].menerror);
                            } else {
                              console.log("Datos a arreglar visitas:", data);
                              data.visitas.forEach(elemvis => {
                                pcod_vended =  elemvis.cod_person;
                                lruta = elemvis.id_ruta;
                                lperiodo = elemvis.id_reffecha;
                            lvisita = elemvis.id_visita;
                            console.log('elemvis verifica si actualiza:', elemvis);
                            if (!elemvis.llamada) {
                              console.log('elemvis a actualizar:', elemvis);
                              const datactvisita = {
                                llamada: false
                              };
                              console.log('Actualizar pcod_vended elemvis.id_ruta, elemvis.id,:'
                              ,pcod_vended, lruta, lperiodo ,lvisita);
                              this.db.collection(`/personal/${pcod_vended}/rutas/${lruta}/periodos/${lperiodo}/visitas`)
                              .doc(lvisita.toString()).update({llamada: false, arreglada: 'Llamada a falso Agos 20 19'});
                            }
                          });

                              // console.log('Se actualizo estadistica visita');
                            }
                          }
                          console.log(" genera_estadisitca_netsolin 4");
                        });                  

    // this.getvendedores()
    //   .subscribe((datospersona: any) => {
    //     datospersona.forEach(elementper => {
    //       pcod_vended = elementper.id;
    //         console.log('Vendedor a verificar:',pcod_vended);
    //       this.getrutasvend(pcod_vended)
    //         .subscribe((datosruta: any) => {
    //           // console.log('datosruta:',datosruta);
    //           datosruta.forEach(element => {
    //             // console.log('element a get periodos',element);
    //             lruta = element.id;
    //             this.getperiodorutavend(pcod_vended, lruta)
    //               .subscribe((datosper: any) => {
    //                 // console.log('datosper:',datosper);
    //                 datosper.forEach(elemper => {
    //                   lperiodo = elemper.id;
    //                   // console.log('peridodo:',elemper);          
    //                   this.getvisitasperiodorutavend(pcod_vended, lruta, lperiodo)
    //                     .subscribe((datosvis: any) => {
    //                       // console.log('datosvis:',datosvis);
    //                       datosvis.forEach(elemvis => {
    //                         lvisita = elemvis.id;
    //                         console.log('elemvis verifica si actualiza:', elemvis);
    //                         if (!elemvis.llamada) {
    //                           console.log('elemvis a actualizar:', elemvis);
    //                           const datactvisita = {
    //                             llamada: false
    //                           };
    //                           console.log('Actualizar pcod_vended elemvis.id_ruta, elemvis.id,:'
    //                           ,pcod_vended, lruta, lperiodo ,lvisita);
    //                           // this.db.collection(`/personal/${pcod_vended}/rutas/${lruta}/periodos/${lperiodo}/visitas`)
    //                           // .doc(lvisita).update({llamada: false, arreglada: 'Llamada a falso Agos 20 19'});
    //                         }
    //                       });
    //                     });
    //                 });
    //               });
    //           });
    //         });
    //     });
    //   });
  }
    public openesta() {
      this.openedestadis = true;
    }    

  //Trae direccion firebase
  public getDireccionActual(id, pcliente) {
    return this.db
    .collection(`/clientes/${pcliente}/direcciones`)
    .doc(id.toString()).valueChanges();
  }
  //Trae pedidos visita actual firebase
  public getPedidosVisita(id: number, pcliente) {
    // console.log('getPedidosVisita ', pcliente, id);
    return this.db
    .collection(`/clientes/${pcliente.trim()}/pedidos`, ref => ref.where('id_visita', '==', id))
    .valueChanges();
  }
  //Trae facturas visita actual firebase
  public getFacturasVisita(id: number, pcliente) {    
    // console.log('getFacturasVisita ', pcliente, id);
    return this.db
    .collection(`/clientes/${pcliente.trim()}/facturas`, ref => ref.where('id_visita', '>=', id))
    .valueChanges();
  }
  //Trae recibos visita actual firebase
  public getRecibosVisita(id: number, pcliente) {    
    return this.db
    .collection(`/clientes/${pcliente.trim()}/recibos`, ref => ref.where('id_visita', '>=', id))
    .valueChanges();
  }
  //Trae personal vendedor  actual firebase
  public getPersonalVisita(id: string) {    
    return this.db
    .collection(`/personal`)
    .doc(id).valueChanges();
  }
    //Trae personas  firebase
  public  getPersonas() {    
      return this.db
      .collection(`personal`)
      .valueChanges();
    }
  //get una visita firebase para act estadistica
  public getVisita(pusuario: string , idruta: string, idperiodo: string , idvisita: string) {    
    // /personal/1014236804/rutas/117/periodos/0508201905082019/visitas/9991565022262408
    // console.log(`/personal/${pusuario.trim()}/rutas/${idruta}/periodos/${idperiodo}/visitas`,idvisita);
    return this.db
    .collection(`/personal/${pusuario.trim()}/rutas/${idruta}/periodos/${idperiodo}/visitas`)
    .doc(idvisita.trim()).valueChanges();
  }

  handleEnviarChange(value) {
    console.log('this.enviar_a, value',this.enviar_a,value);
    if (value === 'Usuario'){
      this.actusuarenviar = true;
    } else {
      this.actusuarenviar = false;
    }
  }

}
