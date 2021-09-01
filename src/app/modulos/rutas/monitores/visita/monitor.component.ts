import { Component, OnInit, Input, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { TabStripComponent } from "@progress/kendo-angular-layout";
import {
  PanelBarExpandMode,
  PanelBarItemModel
} from "@progress/kendo-angular-layout";
import { NetsolinApp } from "../../../../shared/global";
import { MantbasicaService } from "../../../../services/mantbasica.service";
import { MantablasLibreria } from "../../../../services/mantbasica.libreria";
import { varGlobales } from "../../../../shared/varGlobales";
import { NetsolinService } from "../../../../services/netsolin.service";
import { DomSanitizer } from "@angular/platform-browser";
// import { RutaService } from '../../../../services/ruta.service';
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";

// import { NetsolinService } from '../../../../netsolinlibrerias/servicios/netsolin.service';

@Component({
  selector: "monitor-visita",
  templateUrl: "./monitor.component.html",
  styleUrls: ["./monitor.component.css"]
})
export class MonitorVisitaComponent implements OnInit {
  @ViewChild("tabstrip") public tabstrip: TabStripComponent;
  @Input() cod_tercer: string;
  @Input() cod_vended: string;
  @Input() id_ruta: number;
  @Input() id_periodo: string;
  @Input() id_visita: number;

  pcod_tercer: string;
  pcod_vended: string;
  pid_ruta: number;
  pid_periodo: string;
  pid_visita: number;
  classxestado: string;

  // { path: 'monitorvisita/:cod_tercer/:cod_vended/:id_ruta/:id_periodo/:id_visita', component: MonitorVisitaComponent, data: { titulo: 'Monitor Visita' } },
  title: string;
  subtitle = "(Monitor)";
  varParam: string;
  rutamant: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  message = "";
  cargando = false;
  resultados = false;
  //ruta
  lat: number;
  lng: number;
  init = false;
  visitas: Array<any> = [];
  visitas_cumplidas: Array<any> = [];
  visitas_pendientes: Array<any> = [];
  visitas_encurso: Array<any> = [];
  // Manejo panel de informacion
  infopanelselec: string;
  mostrarmensaje = false;
  collapse = false;
  esconder = false;
  //rutas
  persona: any = {};
  cargo_persona = false;
  cargovisitas = false;
  visitalocation: string;
  user: any = {};
  visita: any = {};
  dir_visita: any = {};
  cargo_direc = false;
  pedidos: Array<any> = [];
  cargo_pedidos = false;
  facturas: Array<any> = [];
  cargo_facturas = false;
  recibos: Array<any> = [];
  cargo_recibos = false;
  actividades: Array<any> = [];
  cargo_actividades = false;
  fotos: Array<any> = [];
  cargo_fotos = false;
  public widthfotos = '100%';
  public heightfotos = '500px';

  constructor(
    private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    public service: NetsolinService,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient,
    // public _ruta: RutaService,
    private sanitizer: DomSanitizer,
    private db: AngularFirestore
  ) {
    this.vglobal.mostrarbreadcrumbs = false;
  }

  public onPanelChange(data: Array<PanelBarItemModel>): boolean {
    // public onPanelChange(event: any) {
    console.log("onPanelChange: ", event);
    console.log("onPanelChange");
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
    console.log("stateChange");
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
    // console.log("en ngOnInit editregCliepotecial");
    if(!this.service.cargaDhome){
      this.service.cargasidebarmenu = false;
    }
    this.cargando = true;
    this.resultados = false;
    this.activatedRouter.params.subscribe(parametros => {
      this.pcod_tercer = parametros['cod_tercer'];
      this.pcod_vended = parametros['cod_vended'];
      this.pid_ruta = parametros['id_ruta'];
      this.pid_periodo = parametros['id_periodo'];
      this.pid_visita = parametros['id_visita'];
      //cargar visita
      this.db
      .collection(`/personal/${this.pcod_vended}/rutas/${this.pid_ruta}/periodos/${this.pid_periodo}/visitas`)
      .doc(this.pid_visita.toString())
      .valueChanges()
      .subscribe( ( data: any ) => {
        console.log('trae visita de firebase', data);
        this.visita = data;
        //cambiar clase de acuerdo a estado
        if (data.estado === 'C'){
          this.classxestado = "widget-visita-header bg-primary";
        } else if (data.estado === 'A'){
          this.classxestado = "widget-visita-header bg-success";
        } else {
          this.classxestado = "widget-visita-header bg-danger";
        }
        
        this.cargando = false;
        this.resultados = true;
        
        //cargar  persona actual (vendedor)
        this.getPersonalVisita(this.pcod_vended).subscribe((datosactp: any) => {
          this.persona = datosactp;
          this.cargo_persona = true;
          console.log('persona cargada ', this.persona);
        });        
        //cargar  actividades visita
        this.getActividadesActual().subscribe((datosacti: any) => {
          this.actividades = datosacti;
          this.cargo_actividades = true;
          console.log('Actividades cargada ', this.actividades);
        });        
        //cargar  fotos visita
        this.getFotosActual().subscribe((datosfot: any) => {
          this.fotos = datosfot;
          this.cargo_fotos = true;
          console.log('fotos cargada ', this.fotos);
        });        
        //cargar  direccion visita
        this.getDireccionActual(data.id_dir).subscribe((datosdir: any) => {
          this.dir_visita = datosdir;
          this.cargo_direc = true;
          console.log('Direccion cargada ', this.dir_visita);
        });        
          //cargar pedidos ojo con el id_visita
          this.getPedidosVisita(data.id_visita).subscribe((datosped: any) => {
            this.pedidos = datosped;
            this.cargo_pedidos = true;
            console.log('pedidos cargados ', this.pedidos);
          });     
          //cargar facturas ojo con el id_visita
          this.getFacturasVisita(data.id_visita).subscribe((datosfac: any) => {
            this.facturas = datosfac;
            this.cargo_facturas = true;
            console.log('Facturas cargados ', this.facturas);
          });
          
          //cargar recibos ojo con el id_visita
          this.getRecibosVisita(data.id_visita).subscribe((datosrec: any) => {
            this.recibos = datosrec;
            this.cargo_recibos = true;
            console.log('Recibos cargados ', this.recibos);
          });

       });
    });
  }

  //Trae direccion firebase
  public getDireccionActual(id) {
    return this.db
    .collection(`/clientes/${this.pcod_tercer}/direcciones`)
    .doc(id.toString()).valueChanges();
  }
  //Trae actividades visita
  public getActividadesActual() {
    return this.db
    .collection(`/personal/${this.pcod_vended}/rutas/${this.pid_ruta}/periodos/${this.pid_periodo}/visitas/${this.pid_visita}/actividades`)
    .valueChanges();
  }
  //Trae fotos visita
  public getFotosActual() {
    return this.db
    .collection(`/personal/${this.pcod_vended}/rutas/${this.pid_ruta}/periodos/${this.pid_periodo}/visitas/${this.pid_visita}/fotos`)
    .valueChanges();
  }

  //Trae pedidos visita actual firebase
  public getPedidosVisita(id: number) {
    //     return this.fbDb.collection('manfechas', ref => ref.where('fecha', '==', fechats)).valueChanges();
//     //   .where('cod_person', '==', this._parempre.usuario.cod_usuar)).valueChanges();
    console.log('getPedidosVisita ', this.pcod_tercer, this.pid_visita);
    // .collection(`/clientes/${this.pcod_tercer}/pedidos`)
    // .collection(`/clientes/${this.pcod_tercer}/pedidos`, ref => ref.where('num_dpedid', '==', this.pid_visita))
    console.log (id);
    return this.db
    .collection(`/clientes/${this.pcod_tercer.trim()}/pedidos`, ref => ref.where('id_visita', '==', id))
    .valueChanges();
  }
  //Trae facturas visita actual firebase
  public getFacturasVisita(id: number) {    
    console.log('getFacturasVisita ', this.pcod_tercer, id);
    return this.db
    .collection(`/clientes/${this.pcod_tercer.trim()}/facturas`, ref => ref.where('id_visita', '>=', id))
    .valueChanges();
  }
  //Trae recibos visita actual firebase
  public getRecibosVisita(id: number) {    
    return this.db
    .collection(`/clientes/${this.pcod_tercer.trim()}/recibos`, ref => ref.where('id_visita', '>=', id))
    .valueChanges();
  }
  //Trae personal vendedor  actual firebase
  public getPersonalVisita(id: string) {    
    return this.db
    .collection(`/personal`)
    .doc(id).valueChanges();
  }


  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {}

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
      // this.llamabusqueda = true;
    }
  }
  public closeconsulta(ptipo) {}
  public closebusquellama(event) {
    console.log("en moni cliepote llega sde bus prod:" + event);
    // this.pruellegallabusque = event;
    // this.llamabusqueda = false;
  }

  openeditar(ptipo) {}
  public closeeditar(ptipo) {}

  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
    if (ptipo == "cotiza") {
      // this.crearcotiza = true;
    }
  }
  //maneja el control para cerrar

  public closeadicion(ptipo) {
    if (ptipo == "cotiza") {
      // this.crearcotiza = false;
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

  linkpedido(cod_dpedid,num_dpedid, fec_dpedid) {
    console.log('linkpedido', fec_dpedid);
    console.log('linkpedido', this.service.fechacad(fec_dpedid));

    const linkmoniped = "../EjeConsultaLis.wss?VRCod_obj=MONIDOCVENPEDIDO&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_DPEDID='"
        + cod_dpedid+"',PVXINUM_DPEDID='"+num_dpedid+"',PVXIFECHA='" + this.service.fechacad(fec_dpedid) + "'";
        console.log('linkpedido linkmoniped', linkmoniped);

        return this.cleanURL(linkmoniped);

  }
  
  linkfactura(cod_dfactu,num_dfactu, fecha) {    
    const linkfactura = "../EjeConsultaLis.wss?VRCod_obj=MONIDOCVENFACTURA&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_DFACTUR='"
          + cod_dfactu+"',PVXINUM_DFACTUR='"+num_dfactu+"',PVXIFECHA='" + this.service.fechacad(fecha) + "'";
          console.log('linkfactura ', linkfactura);
          return this.cleanURL(linkfactura);
    }
    linkrecibo(cod_docume,num_docume, fecha) {    
      const linkrecibo = "../EjeConsultaLis.wss?VRCod_obj=MONIDOCCONTA&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_DOCUME='"
            + cod_docume+"',PVXINUM_DOCUME='"+num_docume+"',PVXIFECHA='" + this.service.fechacad(fecha) + "'";
            console.log('linkrecibo ', linkrecibo);
            return this.cleanURL(linkrecibo);
      }
        
  totalpedido(items){
    let total = 0;
            if (items && items.length > 0) {
              items.forEach((val, i) => {
                total += val.valor_neto;
            });
        }
    return total;
  }
  totalfactura(items) {
    let total = 0;
            if (items && items.length > 0) {
              items.forEach((val, i) => {
                total += val.valor_neto;
            });
        }
    return total;
  }
  totalrecibo(items) {
    let total = 0;
            if (items && items.length > 0) {
              items.forEach((val, i) => {
                total += val.valor;
            });
        }
    return total;
  }
  retornaRuta(ptipo: string) {
    // console.log('Retorna ruta '+ptipo+' '+this.prefopermant);
    if (ptipo == 'V') {
      return '/monitorvendedor/VPARVENDEDORES/' + this.pcod_vended;
    } else if (ptipo == 'C') {
      return '/monitorcliente/' + this.pcod_tercer;
    }
  }
}
