import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as fs from 'fs';
import toStream from 'buffer-to-stream';

@Injectable()
export class UploadService {
  async uploadResource(file: Express.Multer.File): Promise<string> {
    try {
      // Read file from disk if buffer is not available
      const buffer = file.buffer || fs.readFileSync(file.path);
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          {
            folder: 'upload_nest',
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          },
        );

        toStream(buffer).pipe(upload);
      });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async deleteResource(avatarUrl: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(avatarUrl);

      await new Promise<void>((resolve, reject) => {
        v2.uploader.destroy(publicId, (error) => {
          if (error) {
            console.error('Error deleting resource:', error);
            return reject(error);
          }
          resolve();
        });
      });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  private extractPublicId(avatarUrl: string): string {
    const parts = avatarUrl.split('/');
    const publicId = parts.slice(-2).join('/');
    return publicId.split('.')[0];
  }
}
