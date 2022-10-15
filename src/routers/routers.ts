import express, { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// get method to resize and filtter image , Request body shoud contain image file , width , height
// Here if you want to store new image , if you have existed image try localhost:3004/resize/img/name=name&width=width&heigth=height
router.post('/resize', async (req: Request, res: Response): Promise<void> => {
  // send 404 when image file is empty
  if (!req.files) {
    const parentPath = path.resolve(__dirname, '..');
    return res.status(404).sendFile(parentPath + '/public/image.html');
  }

  // expected eslint warning here since its any , cannot change it to unknown beacuse it will show error
  const { image }: any = req.files;

  // convert from string to number since the req.body gets as string
  const width = parseInt(req.body.width);
  const height = parseInt(req.body.height);

  // send 404 when having negative numbers
  if (width < 0 || height < 0) {
    const parentPath = path.resolve(__dirname, '..');
    return res.status(404).sendFile(parentPath + '/public/image.html');
  }

  let blur = false;
  let gray = false;
  let flip = false;

  if (req.body.blur == 'on') {
    blur = true;
  }
  if (req.body.flip == 'on') {
    flip = true;
  }
  if (req.body.gray == 'on') {
    gray = true;
  }

  // create new file only if it does not exist already in the upload folder
  if (!fs.existsSync(`./build/upload/${image.name}`)) {
    await image.mv('./build/upload/' + image.name);
  }

  // using sharp to resize and filtering
  await sharp(`./build/upload/${image.name}`)
    .resize(width, height)
    .grayscale(gray)
    .flip(flip)
    .blur(blur ? 2 : 0.3)
    .toFile(
      `./build/images/${image.name.split('.')[0]}_${width}x${height}.jpg`,
      (err): void => {
        if (err) console.log(err);

        // redirect to display the image
        return res.redirect(
          `/img/name=${
            image.name.split('.')[0]
          }&width=${width}&height=${height}`
        );
      }
    );
});

// Resize without post method , with middleware to test if the file is exist
router.get(
  '/resize/img/?name=:name&width=:width&height=:height',
  (req: Request, res: Response, next: NextFunction): void => {
    const image: string = req.params.name;

    let match = false;

    // test if image name is stored
    fs.readdir('./build/upload/', (err, files): void => {
      files.forEach((file): void => {
        if (file.split('.')[0] == image) {
          match = true;
        }
      });

      if (!match) {
        const parentPath = path.resolve(__dirname, '..');
        return res.status(404).sendFile(parentPath + '/public/image.html');
      } else {
        next();
      }
    });
  },
  async (req: Request, res: Response): Promise<void> => {
    const image: string = req.params.name;

    // convert from string to number since the req.params gets as string
    const width = parseInt(req.params.width);
    const height = parseInt(req.params.height);

    // send 404 when having negative numbers
    if (width < 0 || height < 0) {
      const parentPath = path.resolve(__dirname, '..');
      return res.status(404).sendFile(parentPath + '/public/image.html');
    }

    // using sharp to resize and filtering
    await sharp(`./build/upload/${image}.jpeg`)
      .resize(width, height)
      .toFile(
        `./build/images/${image.split('.')[0]}_${width}x${height}.jpg`,
        (err): void => {
          if (err) console.log(err);

          // display the image
          const img = fs.readFileSync(
            `./build/images/${image}_${width}x${height}.jpg`
          );
          res.writeHead(200, { 'Content-Type': 'image/gif' });
          res.end(img);
        }
      );
  }
);

// displaying the image
router.get(
  '/img/?name=:name&width=:width&height=:height',
  (req: Request, res: Response): void => {
    interface Image {
      [image: string]: unknown;
    }

    const image: Image = req.params;

    // if the name of the image does not exist send 404 Or same name but different sizes than that stored
    if (
      !fs.existsSync(
        `./build/images/${image.name}_${image.width}x${image.height}.jpg`
      )
    ) {
      const parentPath = path.resolve(__dirname, '..');
      return res.status(404).sendFile(parentPath + '/public/image.html');
    }

    const img = fs.readFileSync(
      `./build/images/${image.name}_${image.width}x${image.height}.jpg`
    );
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(img);
  }
);

export default router;
