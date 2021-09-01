import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { catchError, map, tap } from 'rxjs/operators';
import { NetsolinApp } from '../shared/global';
import { environment } from '../../environments/environment';
import { error } from 'util';

@Injectable()
export class NetsolinService {
	public cargo_ruta = false;
	public error_cargarruta = false;
	public men_errorcargarruta = "";
	public cargoidperiodo = false;
	public id_periodo: string;
	public id_ruta: number = 0;

	//Variables carga menu
	public cargaDhome = false;
	public cargasidebarmenu = true;
	constructor(private http: HttpClient) {
	}

//Consulta en Netsolin el usuario con la fecha para saber que ruta y periodo le corresponde
cargaPeriodoUsuar(pcod_usuar){
	console.log('cargaPeriodoUsuar 1',pcod_usuar);
	return new Promise((resolve)=>{
		console.log('cargaPeriodoUsuar 2',pcod_usuar);
		// if (this.cargoidperiodo){
		// 	console.log('cargaPeriodoUsuar 3',pcod_usuar);
		// 	resolve(true); 
		//  }
			NetsolinApp.objenvrest.filtro = pcod_usuar;
			let url= NetsolinApp.urlNetsolin + "netsolin_servirestgo.csvc?VRCod_obj=IDRUTAPERAPP";
			console.log('cargaPeriodoUsuar 4',pcod_usuar,url,NetsolinApp.objenvrest);
			this.http.post( url, NetsolinApp.objenvrest )   
			 .subscribe( (data:any) =>{ 
				console.log('cargaPeriodoUsuar 41',pcod_usuar);
				console.log('cargo periodo en netsolin', data);
				if( data.error){
					console.log('cargaPeriodoUsuar 42',pcod_usuar);
					console.error(" cargaPeriodoUsuar ", data.error);
					//   this._parempre.reg_log('Error en cargaPeriodoUsuar por netsolin ', 'data.error');
					 this.cargoidperiodo = false;
					 this.cargo_ruta = false;
					 this.error_cargarruta = true;
					 this.men_errorcargarruta = data.men_error;
					 resolve(false);
					} else{
						console.log('cargaPeriodoUsuar 43',pcod_usuar);
						// this._parempre.reg_log('coer', 'cargaPeriodoUsuar por netsolin ');
							console.log('cargaPeriodoUsuar 5',pcod_usuar,data.datos_ruta[0]);
							this.cargoidperiodo = true;
						this.id_ruta = data.datos_ruta[0].id_ruta;
						this.id_periodo = data.datos_periodo[0].id_per;
						resolve(true);
					}
			 });
		 });
}



	getNetsolinArchIni() {
	}
	getNetsolinhtmlbase(): Observable<any> {
		// return this.http.get(this.baseUrl+'todo2s.csvc').map(res => res.json());
		console.log('a netsolinbase traer');
		console.log('netsolinbase urlNetsolin NetsolinApp: '+NetsolinApp.urlNetsolin);
		var paramSolicitud: string="";

		if (environment.production) {
			paramSolicitud=NetsolinApp.urlNetsolin + "netsolinhtmlgenbase.csvc?VRprod=ENPROD";
		} else {
			paramSolicitud=NetsolinApp.urlNetsolin + "netsolinhtmlgenbase.csvc?VRprod=NOPROD";
		}
		
		// return this.http.get(NetsolinApp.urlNetsolin + "netsolinhtmlgenbase.csvc")
		return this.http.get(paramSolicitud)
			.pipe(
			map(resul => {
				return resul;
			})
			);

	}

	private handleError(error: HttpErrorResponse) {
		// console.error('Error en servidor:', error);
		if (error.error instanceof Error) {
			let errMessage = error.error.message;
			return Observable.throw(errMessage);
			// Use the following instead if using lite-server
			//return Observable.throw(err.text() || 'backend server error');
		}
		return Observable.throw(error || 'Node.js server error');
	}

	getNetsolinslide(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=MTB")
			.pipe(
			map(resul => {
				// console.log('map get');
				//  console.log(resul);
				return resul;
			}),
			catchError(this.handleError)
			);
	}


	getNetsolinMonitores(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=CRMI")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinMonitores');
				//  console.log(resul);
				return resul;
			})
			);
	}

	getNetsolinMantbas(ptipo, pmodulo): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=" + ptipo + "&VRModulo=" + pmodulo)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinMantbas');
				//  console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinAlertas(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=ALER")
			.pipe(
			map(resul => {
				console.log('map getNetsolinAlertas');
				 console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinUsuar(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=USUAR")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinAlertas');
				//  console.log(resul);
				return resul;
			})
			);
	}

	getNetsolinRecordatorio(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=SEG")
			.pipe(
			map(resul => {
				return resul;
			})
			);
	}

	getNetsolinProcesos(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=PROC")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinProcesos');
				//  console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinSolicitudes(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=SOLI")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinSolicitudes');
				//  console.log(resul);
				return resul;
			})
			);
	}


	getNetsolinMessages(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=MENS")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinMessages');
				//  console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinSolic(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=SOLI")
			.pipe(
			map(resul => {
				return resul;
			})
			);
	}
	/**************************************************/
	getNetsolinDictabla(ptabla, paplica, pobjeto): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = ptabla;
		NetsolinApp.objenvrestddtabla.aplica = paplica;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		// console.log('getNetsolinDictabla ant enviar ');	
		// console.log(NetsolinApp.objenvrestddtabla);
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTCONDDCAMTAB", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(resul => {
				// console.log('getNetsolinDictabla resaulta');
				// console.log(resul);
				return resul;
			})
			);
	}
	//seguridad objeto en netsolin 
	getNetsolinSegObj(pobjeto): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTCONSEGOBJ", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinSegObj');
				//  console.log(resul);
				//  console.log(resul[0]);
				return resul[0];
				// return resul;
			})
			);
	}
	//Lee objeto para mant tabla basica
	getNetsolinObjmantbasica(pobjeto): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTOBJMANTBASICA", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinObjmantbasica');
				//  console.log(resul);
				return resul;
				//  return resul[0]; 
				// return resul;
			})
			);
	}



	//Verifica si variable VPAR... que se usa como parametros en localsotrage este creada si no la crea
	//ejemplo para llamado en monitores sin que tengan que ingresar primero a la tabla basica
	verificaVpar(pobjeto,pvarParam): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTOBJMANTBASICA", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(result => {
				// console.log('map getNetsolinObjmantbasica');
				//  console.log(resul);
				var result0 = result[0];
				console.log(result0);
				// if (typeof (result.isCallbackError) != "undefined") {
				// 	var  orespuesta: any = {respuesta: "Error"};
				// 	return orespuesta;
				// }

				NetsolinApp.objpartablabas.aplica = parseInt(result0.aplica);
				NetsolinApp.objpartablabas.tabla = result0.tabla;
				NetsolinApp.objpartablabas.campollave = result0.campollave;
				NetsolinApp.objpartablabas.clase_val = result0.clase_val;
				NetsolinApp.objpartablabas.clase_nbs = result0.clase_nbs;        
				NetsolinApp.objpartablabas.camponombre = result0.camponombre;
				NetsolinApp.objpartablabas.titulo = result0.title;
				NetsolinApp.objpartablabas.subtitulo = "";
				NetsolinApp.objpartablabas.objeto = pobjeto;
				NetsolinApp.objpartablabas.rutamant = "mantbasica/" + pobjeto;
				NetsolinApp.objpartablabas.prefopermant = result0.prefomant;
				if (result0.campos_lista.length>2){
				  let var3 = JSON.parse(result0.campos_lista);
				  if (typeof(var3)=='object'){
					NetsolinApp.objpartablabas.campos_lista = var3;
				  }
				} 
				let var1 = JSON.stringify(NetsolinApp.objpartablabas);
				localStorage.setItem("VPAR" + result0.tabla, var1);		

				return result;
				//  return resul[0]; 
				// return resul;
			})
			);
	}

	verificaVparMal(pobjeto,pvarParam) : Observable<any> {
		let lvart: any;
        lvart = localStorage.getItem(pvarParam);
        if (lvart) {
		  // console.log('Existe');
			var  orespuesta: any = {respuesta: "Existe"};
		  	return orespuesta;
        } 
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		this.getNetsolinObjmantbasica(pobjeto)
		.subscribe(result =>{
				var result0 = result[0];
				console.log(result0);
				if (typeof (result.isCallbackError) != "undefined") {
					var  orespuesta: any = {respuesta: "Error"};
					return orespuesta;
				}
				NetsolinApp.objpartablabas.aplica = parseInt(result0.aplica);
				NetsolinApp.objpartablabas.tabla = result0.tabla;
				NetsolinApp.objpartablabas.campollave = result0.campollave;
				NetsolinApp.objpartablabas.clase_val = result0.clase_val;
				NetsolinApp.objpartablabas.clase_nbs = result0.clase_nbs;        
				NetsolinApp.objpartablabas.camponombre = result0.camponombre;
				NetsolinApp.objpartablabas.titulo = result0.title;
				NetsolinApp.objpartablabas.subtitulo = "";
				NetsolinApp.objpartablabas.objeto = pobjeto;
				NetsolinApp.objpartablabas.rutamant = "mantbasica/" + pobjeto;
				NetsolinApp.objpartablabas.prefopermant = result0.prefomant;
				if (result0.campos_lista.length>2){
				  let var3 = JSON.parse(result0.campos_lista);
				  if (typeof(var3)=='object'){
					NetsolinApp.objpartablabas.campos_lista = var3;
				  }
				} 
				let var1 = JSON.stringify(NetsolinApp.objpartablabas);
				localStorage.setItem("VPAR" + result0.tabla, var1);		
				var  orespuesta: any = {respuesta: "Creado"};
				return orespuesta;
			});
	}

	//llama busqueda por objeto envia objeto objenvrest
	getNetsolinObjbusqueda(pobjeto,pcadbus,pfiltroadi): Observable<any> {
		// console.log('getNetsolinObjbusqueda pobjeto:'+pobjeto+' pcadbus:'+pcadbus+' pfiltroadi: '+pfiltroadi);
        NetsolinApp.objenvrestsolcomobog.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestsolcomobog.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestsolcomobog.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestsolcomobog.tabla = "GENERAL";
		NetsolinApp.objenvrestsolcomobog.aplica = 0;
		NetsolinApp.objenvrestsolcomobog.filtro = pcadbus;
		NetsolinApp.objenvrestsolcomobog.filtroadi = pfiltroadi;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj="+pobjeto, NetsolinApp.objenvrestsolcomobog)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinObjbusqueda');
				//  console.log(resul);
				 var result0 = resul[0];
				//  console.log(result0);
				 //si hay error retorna lista de errores sino el registro solicitado
				 if (typeof (result0) == "undefined") {
					 return resul;
				 } else {
					 return resul;
				 }
			})
			);
	}
	//Ejecuta servicio rest en Netsolin con un objeto pparam que lleva parametros
	//retorna errores o cursor con resultado
	//Ejemplo de uso para retornar precio d eventa objeto: RESTCONLISTPREC
	///con parametro de llamado: "parametros":{"lista": "V01","cod_refven": "100    ","cod_tercer": "",
	///            "proc_ven": "016 ", "cantidad":10 }
	getNetsolinObjconParametros(pobjeto,pparam:any): Observable<any> {
		// console.log('getNetsolinObjconParametros pobjeto:'+pobjeto);
        NetsolinApp.objenvrest.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrest.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrest.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrest.filtro = "";
		NetsolinApp.objenvrest.parametros = pparam;
		if (NetsolinApp.objenvrest.tiporet != "OBJ")
			NetsolinApp.objenvrest.tiporet= "CON";
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj="+pobjeto, NetsolinApp.objenvrest)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinObjconParametros');
				//  console.log(resul);
				 var result0 = resul[0];
				//  console.log(result0);
				 //si hay error retorna lista de errores sino el registro solicitado
				 if (typeof (result0) == "undefined") {
					 return resul;
				 } else {
					 return resul;
				 }
			})
			);
	}

	async pushNotification(title: string, mensaje: string, ptodos, pidusuar) {
		console.log('pushNotification pidusuar ',pidusuar);
		const cheaders = {
			"Content-type": "application/json",
			"Authorization": "Basic Mzg2ZWFmMTYtZTM4Zi00MGFmLWEyMDUtNjA0YWI3ZWUwN2Uz",
		}
		let body='';
		if (ptodos) {	
		  body = JSON.stringify({
			"app_id" : "27ae219e-b05b-4a5a-b4e3-bca1a8651f86",
			"subtitle": {title: title},
			"contents": {"en": mensaje,"es": mensaje} ,
			"included_segments" : ["All"]
		});
	} else {
		  body = JSON.stringify({
			"app_id" : "27ae219e-b05b-4a5a-b4e3-bca1a8651f86",
			"subtitle": {title: title},
			"contents": {"en": mensaje,"es": mensaje} ,
			"include_player_ids": [pidusuar]
		});
	}

		// console.log('pushNotification 2',body,cheaders);
		// this.http.post(url, NetsolinApp.objenvrest)
	 this.http.post("https://onesignal.com/api/v1/notifications",body,{headers: cheaders})
	 .subscribe((data: any) => {
		console.log('pushNotification 3 data',data);		
	 });
	//  console.log('pushNotification 4 ');
	

		// return this.http.post("https://onesignal.com/api/v1/notifications",body,{headers: cheaders})
		// .pipe(
		// map(resul => {
		// 	 console.log('Result onesignal',resul);
		// 	return resul[0];
		// })
		// );
	}

//cadena formato AAAAMMDD A FECHA TIEMPO 0
cadafecha(cfecha){
  let ano = cfecha.slice(0,4);
  let mes = cfecha.slice(4,6);
  let dia = cfecha.slice(6,8);

  let dfecha = new Date(ano,mes-1,dia,0,0,0);
  return dfecha;
}

//recibe hora militar como numero y retorna cadena formato HH:MM AM/PM
cadhoramil(nhora){
  let ch = nhora.toString();
  let chh = '';
  let cmm = '';
  let campm = '';
  let nnh = 0;
  if (nhora < 1000) {
    chh = ch.slice(0,1);
    cmm = ch.slice(1,3); 
  } else {
    chh = ch.slice(0,2);
    cmm = ch.slice(2,4);  
  }
  if(nhora < 1200){
    campm = 'AM';      
  } else {
    nnh = parseInt(chh) - 12;
    chh = nnh.toString();
    campm = 'PM';      
  }

  return chh+':'+cmm+' '+campm;
}
//fecha a string para monitor en netsolin dd/mm/aa
fechacad(fechaf){
	console.log(fechaf);	
	// console.log(typeof(fechaf);	
	// console.log(fechaf.toDate());	
	// const fecha= fechaf.toDate();
	// console.log(fecha);
	// const dia = fecha.getDate();
	// const mes = fecha.getMonth() + 1;
	// const ano = fecha.getFullYear();

  const cfecha = fechaf.substring(8,10) + '/' + fechaf.substring(5,7) + '/' + fechaf.substring(0,4);
	console.log(cfecha);	
  return cfecha;
}
}
