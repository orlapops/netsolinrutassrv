import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { PanelBarExpandMode, PanelBarItemModel } from '@progress/kendo-angular-layout';

import { NetsolinApp } from '../../../shared/global';
import { MantbasicaService } from '../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../services/mantbasica.libreria';
import { varGlobales } from '../../../shared/varGlobales';
import { environment } from '../../../../environments/environment';

//Firebase Oct 4 18
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NetsolinService } from '../../../services/netsolin.service';

@Component({
  selector: 'app-monitorprinrutas',
  templateUrl: './monitorprinrutas.component.html',
  styleUrls: ['./monitorprinrutas.component.css']
})
export class MonitorPrinRutasComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Input() vparcaptura: string;
  @Input() vid: any;
//mapas
  title = 'app';
  lat: number;
  lng: number;
  init = false;

  personas: Array<any> = [];
  personasenvmsg: Array<any> = [];
  siguiendoA: string = null;
  siguiendoNombre: string = null;
  //
  labelOptions = {
    color: '#ee4646',
    fontFamily: '',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing:'0.5px',
    // text: 'Plan Pagado/No pagado'
  };


  ptablab: string;
  paplica: string;
  pcampollave: string;
  pclase_nbs: string;
  pclase_val: string;
  pcamponombre: string;
  subtitle = '(Monitor)';
  varParam: string;
  rutamant: string;
  id: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  message = "";
  cargando = false;
  resultados = false;
  nom_empre: string;
  cargousuario = false;
  regUsuario: any;
  cargocontacto = false;
  regContacto: any;
  vvalocategoria: string;
  filtrocontacto: string;
  filtroactividades:string="";
  filtrocotiza:string="";
  id_terconsulta: string;s
  id_cliepoten: string;
  // Manejo panel de informacion
  infopanelselec: string;
  mostrarmensaje=false;
  puedecrearcotizacion= false;

  pruebavininumbuscombog:string = "";
  llamabusqueda = false;
  pruellegallabusque:string="";
  items: Observable<any[]>;
  redirigiramonitor = "";
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
  cod_personenvmsg = "";
    


  constructor(private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private pf: FormBuilder,
    public service: NetsolinService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient,
    private db: AngularFirestore
  ) {
    this.lat =  4.625749001284896;
    this.lng = -74.078441;
    this.siguiendoA = '1014236804';
    this.siguiendoNombre = '1014236804';
    db.collection('personal').valueChanges()
    .subscribe( ( data: any ) => {
      // console.log('trae personal de firebase', data);
      this.personas = data;
      this.personasenvmsg = [];
      data.forEach(elementper  => {
        if (elementper.idOnesignal) {
          //  if (elementper.cod_person === this.id) {
            //  console.log('Se cambia idokOnesignal',this.idokOnesignal);
               this.idokOnesignal = true;
               console.log('Se cambia idokOnesignal',this.idokOnesignal);
              //  this.idonesignalenviar = elementper.idOnesignal;
          //  }
           this.personasenvmsg.push(elementper);
         }
       });


      if ( !this.init ) {
        this.lat = data[0].latitud;
        this.lng = data[0].longitud;
        this.siguiendoA = data[0].cod_person;
        this.siguiendoNombre = data[0].nombre;
        this.init = true;
      }
      if ( this.siguiendoA ) {
        data.forEach( persona => {
          if ( persona.cod_perrson === this.siguiendoA ) {
            this.lat = persona.latitud;
            this.lng = persona.longitud;
            // console.log('ubica constructor', this.lat, this.lng, persona);

          }
        });
      }
    });
    this.vglobal.mostrarbreadcrumbs = false;
    // this.items = db.collection('categorias').valueChanges();
  }

  public onPanelChange(data: Array<PanelBarItemModel>): boolean {
    // // public onPanelChange(event: any) { 
    // //console.log("onPanelChange: ", event); 
    // //console.log("onPanelChange");
    // let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    // //console.log("focusedEvent.id: "+focusedEvent.id);
    // this.infopanelselec = focusedEvent.id;
    // if (focusedEvent.id !== "info") {
    //    this.selectedId = focusedEvent.id;
    //    //console.log("selec id: ")+this.selectedId;
    //   //  this.router.navigate(["/" + focusedEvent.id]);
    // }

    return false;
  }
  public stateChange(data: Array<PanelBarItemModel>): boolean {
    //console.log("stateChange");
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    //console.log("focusedEvent.id: "+focusedEvent.id);

    if (focusedEvent.id !== "info") {
      //  this.selectedId = focusedEvent.id;
       //console.log("selec id: ")+this.selectedId;
      //  this.router.navigate(["/" + focusedEvent.id]);
    }

    return false;
}


  ngOnInit() {
    // console.log("en ngOnInit editregCliepotecial");
    this.activatedRouter.params
      .subscribe(parametros => {
        // this.varParam = parametros['varParam'];
        // this.id = parametros['id'];
        this.id = NetsolinApp.oapp.cuserid;

        let lvart: any;
        this.title = 'Monitor Principal';
        this.rutamant = '';
        this.paplica = '0';
        this.ptablab = 'XGTS02';
        this.pcampollave = 'xgts2c7';
        this.pcamponombre = 'xgts2c2';
        this.pclase_nbs = '';
        this.pclase_val = '';
        let lvar = '';
        console.log('ngOnInit monitorprinrutas this.ptablab:',this.ptablab);
        // lvar = localStorage.getItem("DDT" + this.ptablab);
        this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
          .subscribe(regTabla => {
            console.log('ngOnInit monitorprinrutas getregTabla regTabla:',regTabla);
            var result0 = regTabla[0];
            if (typeof (result0) != "undefined") {
              this.enlistaerror = true;
              this.listaerrores = regTabla;
            } else {
              this.regUsuario = regTabla;
              console.log('Trae regUsuario');
              console.log(this.regUsuario);
              // console.log('NetsolinApp.oapp');
              // console.log(NetsolinApp.oapp);
              this.filtroactividades = "usuario='"+NetsolinApp.oapp.cuserid+"'";
              this.cargousuario = true;
              this.inicializaMonitor(regTabla);
            }
          }, error => {
            console.error(error);
            this.showError(error);
          })
      });
  }

  inicializaMonitor(preg: any) {
    console.log('inicializaMonitor');
    console.log(preg);
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    this.cargando = true;
    this.resultados = false;
    var cbus=preg.xgts2c7;
    //Mientras prueba
    if (!environment.production) {
      cbus='NETSOLIN   '
    }
    // this.filtrocotiza = "c.usuar_crea='" + cbus+"'" ;
    // console.log('this.filtrocotiza:'+this.filtrocotiza);
    // this.filtrocotiza=preg.id_cliepote.toString();
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    this.cargando = false;
    this.resultados = true;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
  }

  retornaRuta() {
    // console.log(this.rutamant);
    return '/' + this.rutamant;
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


 
 
  openconsulta(ptipo){
    if (ptipo == 'llamabusqueda') {
      this.llamabusqueda = true;
    }   
    
  }
  public closeconsulta(ptipo) {
  }
  public closebusquellama(event){
    // console.log('en moni cliepote llega sde bus prod:'+event);
    this.pruellegallabusque=event;
    this.llamabusqueda = false;

  }

  openeditar(ptipo){
  }
  public closeeditar(ptipo) {
  }
  
  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
    if (ptipo == 'cotiza') {
      // this.crearcotiza = true;
    } 
  }
  //maneja el control para cerrar

  public closeadicion(ptipo) {
    if (ptipo == 'cotiza') {
      // this.crearcotiza = false;
    } 
  }

  retornaRutacotiza() {
    return '/cotizacion'+ '/VPARCOTIZACRM_C/0' +  '/' +  '0/' + '0/A/na/na';
  }

  seguir( persona: any ) {
    console.log('seguir persona:', persona);
    this.siguiendoA = persona;
    this.personas.forEach(elementper  => {
    if (elementper.cod_person === persona) {
          this.siguiendoA = elementper.cod_person;
          this.siguiendoNombre = elementper.nombre;      
          this.lat = elementper.latitud;
          this.lng = elementper.longitud;
          console.log('sIGUIENDO A :',this.siguiendoA,this.siguiendoNombre,this.lat,this.lng);
    }
  });
    // this.siguiendoNombre = persona.nombre;

    // console.log('ubica', this.lat, this.lng);
  }

  dejarDeSeguir() {
    this.siguiendoA = null;
    this.siguiendoNombre = null;
  }  

  retornaRutaVendedor(ppersona) {
    //  console.log('Retorna ruta ', ppersona);
      return '/monitorvendedor/VPARVENDEDORES/' + ppersona.cod_person;
  }
  handleRedirigirChange(value) {
    console.log('handleRedirigirChange',value);
    this.service.cargaDhome = true;
    this.router.navigate(['/monitorvendedor/VPARVENDEDORES/' + value]);
  }
  handleEnviarChange(value) {
    console.log('handleEnviarChange this.enviar_a, value',this.enviar_a,value);
    if (value === 'Usuario'){
      this.actusuarenviar = true;
    } else {
      this.actusuarenviar = false;
    }
  }
  public handleAsesorEnviarChange(value) {
    console.log('handleAsesorEnviarChange  value',value);
    //buscar en personas para tener cod_person
    this.personasenvmsg.forEach(elementper  => {
      // if (elementper.idOnesignal) {
        if (elementper.cod_person === value) {
            this.cod_personenvmsg = elementper.cod_person;
            this.idonesignalenviar = elementper.idOnesignal;
        }
        this.personas.push(elementper);
      // }    
    });
  }
  public close(status) {
    console.log(`Dialogo result: ${status}`,this.mensajeenviar);
    const now = new Date();
    // Notificar por pushnotification
    this.service.pushNotification(this.asuntomensajeenviar,this.mensajeenviar,!this.actusuarenviar,this.idonesignalenviar);
    if (this.actusuarenviar ) {
      this.db.collection(`/personal/${this.cod_personenvmsg}/mensajes`)
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

}
