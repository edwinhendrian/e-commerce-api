import { Injectable } from '@nestjs/common';
import cloudinary from 'src/config/cloudinary.config';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      return cloudinary.uploader
        .upload_stream({ folder: 'e-commerce' }, (error, result) => {
          if (error) {
            reject(new Error(error.message));
          } else {
            resolve(result?.secure_url);
          }
        })
        .end(file.buffer);
    });
  }

  async uploadImages(
    files: Express.Multer.File[],
  ): Promise<(string | undefined)[]> {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  }
}
