import { v2 } from 'cloudinary';
import { CLOUDINARY } from 'src/constants/upload';

export const UploadProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'dqhkmhosw',
      api_key: '292548231199665',
      api_secret: 'TG_c4Dq6L1fZ6o-tUbK2a7eOKyo',
    });
  },
};
