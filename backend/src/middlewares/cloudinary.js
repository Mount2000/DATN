import cloudinary from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'avatars',
  }
});

const uploadCloud = multer({ storage: storage });

export default uploadCloud;