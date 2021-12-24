declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: 'development' | 'production' | 'test';
    SECRET_KEY?: string;
    EXPIRES_IN?: string;
    CORS_ORIGIN?: string;
  }
}
