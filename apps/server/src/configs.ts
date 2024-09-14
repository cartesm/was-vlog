process.loadEnvFile();
export const AppName: string = 'WAS';
export const MongoDBUri: string =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/' + AppName;
export const PortApp: number = process.env.PORT
  ? Number(process.env.PORT)
  : 3000;

export const JwtSecret: string = process.env.JSWT_SECRET || 'metallica_rules';
export const ExpiresInJwt: string = '6h'; // ?6 horas en segundos
