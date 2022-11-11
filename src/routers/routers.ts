import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

import resize from '../resize';

const router = express.Router();

// Resize without post method , with middleware to test if the file is exist
router.get(
  '/resize/img/?name=:name&width=:width&height=:height',
  (req: Request, res: Response, next: NextFunction): void => {
    const image: string = req.params.name;

    let match = false;
    
    // test if image name is stored
    fs.readdir('./upload/', (err, files): unknown => {
      const filesNames: string[] = [];
      files.forEach((file): void => {
        const fname = file.split('.')[0];
        filesNames.push(fname);
        if (file.split('.')[0] == image) {
          match = true;
        }
      });

      if (!match) {
        return res
          .status(404)
          .send(
            `Please enter the name of the file correctly , if the file you looking for does not exist use these one that already stored ${filesNames}`
          );
      } else {
        next();
      }
    });
  },
  async (req: Request, res: Response): Promise<unknown> => {
    const image: string = req.params.name;

    // convert from string to number since the req.params gets as string
    const width = parseInt(req.params.width);
    const height = parseInt(req.params.height);

    // send 404 when having negative numbers or characters
    if (
      width < 0 ||
      height < 0 ||
      req.params.width.match('[a-zA-Z]+') ||
      req.params.height.match('[a-zA-Z]+')
    ) {
      return res
        .status(404)
        .send('Please enter only postive numbers in width , height');
    }

    // calling resize function that resize the image
    const imageName = image;
    const resizeImagePath = await resize(imageName, width, height);

    // display the image
    const parentPath = path.resolve(resizeImagePath);
    const img = fs.readFileSync(parentPath);
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(img);
  }
);

// displaying the image
router.get(
  '/img/?name=:name&width=:width&height=:height',
  (req: Request, res: Response): unknown => {
    interface Image {
      [image: string]: unknown;
    }

    const image: Image = req.params;

    // if the name of the image does not exist send 404 Or same name but different sizes than that stored
    if (
      !fs.existsSync(
        `./resized/${image.name}_${image.width}x${image.height}.jpg`
      )
    ) {
      return res.status(404).send('Please enter the name of the stored image');
    }

    const img = fs.readFileSync(
      `./resized/${image.name}_${image.width}x${image.height}.jpg`
    );
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(img);
  }
);

export default router;
