import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CloudinaryResponse } from './dto/response.dto';

@Injectable()
export class ImagesService {

  constructor() {}

  async uploadImage(file: Express.Multer.File) {
    return new Promise((resolve: (value: CloudinaryResponse) => void, reject) => {
      cloudinary.uploader.upload_stream((error: UploadApiErrorResponse, result: UploadApiResponse) => {
        if (error || !result) {
          return reject(error || new Error('Error desconocido al subir la imagen.'));
        }

        const response: CloudinaryResponse = {
          url: result.secure_url
        };

        resolve(response);
      }).end(file.buffer);
    });
  }
}
