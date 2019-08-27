export interface IAppConfig {
    production: boolean;
    name: string;
    firebase: {
      apiKey: string;
      authDomain: string;
      databaseURL: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
    };
  }