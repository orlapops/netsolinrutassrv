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
  selector: "monitor-cliepoten",
  templateUrl: "./monitor.component.html",
  styleUrls: ["./monitor.component.css"]
})
export class MonitorClientepotenciaComponent implements OnInit {
  @ViewChild("tabstrip") public tabstrip: TabStripComponent;
  @Input() id_cliepoten: string;
  @Input() cod_vended: string;

  pid_cliepoten: string;
  pcod_vended: string;

  // { path: 'monitorcliepoten/:cod_tercer/:cod_vended/:id_ruta/:id_periodo/:id_cliepoten', component: MonitorVisitaComponent, data: { titulo: 'Monitor Visita' } },
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
    // Manejo panel de informacion
  infopanelselec: string;
  mostrarmensaje = false;
  collapse = false;
  esconder = false;
  //rutas
  persona: any = {};
  cargo_persona = false;
  user: any = {};
  clienpoten: any = {};
  pedidos: Array<any> = [];
  cargo_pedidos = false;
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
    console.log("onPanelChange: ", event);
    return false;
  }
  public stateChange(data: Array<PanelBarItemModel>): boolean {
    console.log("stateChange");
    return false;
  }

  ngOnInit() {
    // console.log("en ngOnInit editregCliepotecial");
    this.cargando = true;
    this.resultados = false;
    this.activatedRouter.params.subscribe(parametros => {
      this.pid_cliepoten = parametros['id_cliepoten'];
      this.pcod_vended = parametros['cod_vended'];
      //cargar visita
      this.db
      .collection(`/personal/${this.pcod_vended}/clientespoten`)
      .doc(this.pid_cliepoten)
      .valueChanges()
      .subscribe( ( data: any ) => {
        console.log('trae cliepoten de firebase', data);
        this.clienpoten = data;
        this.cargando = false;
        this.resultados = true;
       });
       //cargar  persona actual (vendedor)
       this.getPersonalVisita(this.pcod_vended).subscribe((datosactp: any) => {
          this.persona = datosactp;
          this.cargo_persona = true;
          console.log('persona cargada ', this.persona);
       });        
      
    });
  }

  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {}

  onSubmit() {
    this.enerror = false;
    // this.grabo = false;
  }
  onValuechangeverifica(value)
  {
    console.log('change verifica ',value);
    //Actualizar Verificado
    const now = new Date();
    this.db
    .collection(
      `/personal/${this.pcod_vended}/clientespoten`
    )
    .doc(this.pid_cliepoten)
    .update({ verificado: value,
       codusua_verifica: NetsolinApp.oapp.cuserid,
      nomusua_verifica: NetsolinApp.oapp.nomusuar,
      fecha_verifica: now});
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
  //Trae personal vendedor  actual firebase
  public getPersonalVisita(id: string) {    
    return this.db
    .collection(`/personal`)
    .doc(id).valueChanges();
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
  retornaRuta(ptipo: string) {
    // console.log('Retorna ruta '+ptipo+' '+this.prefopermant);
    if (ptipo == 'V') {
      return '/monitorvendedor/VPARVENDEDORES/' + this.pcod_vended;
    } 
  }

}
