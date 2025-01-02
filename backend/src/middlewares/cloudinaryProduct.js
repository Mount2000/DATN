import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storageProduct = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
      folder: 'products',
    }
  });
  
export  const uploadCloudProduct = multer({ storage: storageProduct });
