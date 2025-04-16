import { BadRequestException } from '@nestjs/common';

export const multerOptions = {
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
      cb(
        new BadRequestException(
          'Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.',
        ),
        false,
      );
    } else {
      cb(null, true);
    }
  },
};
