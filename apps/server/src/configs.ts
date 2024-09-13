process.loadEnvFile();
export const AppName: string = 'WAS';
export const MongoDBUri: string =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/' + AppName;
export const PortApp: number = process.env.PORT
  ? Number(process.env.PORT)
  : 3000;
