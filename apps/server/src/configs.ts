process.loadEnvFile();
export const AppName: string = 'WAS';
export const MongoDBUri: string =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/' + AppName;
export const PortApp: number = process.env.PORT
  ? Number(process.env.PORT)
  : 3000;

export const JwtSecret: string = process.env.JSWT_SECRET || 'metallica_rules';
export const ExpiresInJwt: string = '6h'; // ?6 horas en segundos

export const GoogleClientId: string = process.env.GOOGLE_CLIENT_ID;
export const GoogleClientSecret: string = process.env.GOOGLE_CLIENT_SECRET;

export const sixHoursInMiliseconds: number = 21600000;

export const frontUrl: string =
  process.env.FRONT_BASE_URL || 'http://localhost:4000';

export const CloudinaryApiSecret: string = process.env.CLOUDINARY_API_SECRET;
export const CloudinaryApiKEY: string = process.env.CLOUDINARY_API_KEY;
export const CloudinaryCloudName: string = process.env.CLOUDINARY_CLOUD_NAME;
