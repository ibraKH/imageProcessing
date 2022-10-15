import sharp from 'sharp';

// using sharp to resize and filtering
const resize = async (
  fileName: string,
  width: number,
  height: number,
  blur?: boolean,
  gray?: boolean,
  flip?: boolean
): Promise<string> => {
  try {
    await sharp(`upload/${fileName}.jpeg`)
      .resize(width, height)
      .grayscale(gray)
      .flip(flip)
      .blur(blur ? 2 : 0.3)
      .toFile(`resized/${fileName}_${width}x${height}.jpg`);
  } catch (err) {
    console.log(err);
  }

  return `resized/${fileName}_${width}x${height}.jpg`;
};

export default resize;
