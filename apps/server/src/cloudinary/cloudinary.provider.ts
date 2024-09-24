import { v2 as cloudinary } from 'cloudinary';
import {
  CloudinaryApiKEY,
  CloudinaryApiSecret,
  CloudinaryCloudName,
} from 'src/configs';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: CloudinaryCloudName,
      api_key: CloudinaryApiKEY,
      api_secret: CloudinaryApiSecret,
    });
  },
};
