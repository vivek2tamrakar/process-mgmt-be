import { diskStorage } from 'multer';
import  { FileFilterCallback } from 'multer';

export const fileUploadOptions: any = {
  limits: {
    fileSize: 1024 * 1024 * 8,
    files: 1,
  },
  fileFilter: (req: Request, file: File, acceptFile: FileFilterCallback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
    ];
    acceptFile(null, allowedMimeTypes.includes(file['mimetype']));
  },
  
  storage: diskStorage(
    {
    destination: (req: any, file: any, cb: any) => {
      cb(null, './src/public/uploads');
    },
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
  }),
};