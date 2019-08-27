
import { IAppConfig } from "./i.app.config";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class AppConfigService {
    static settings: IAppConfig;
    constructor() {}
    fireConfig() {
      AppConfigService.settings = window['config'];
      return window['firebase_config']
    }
  }