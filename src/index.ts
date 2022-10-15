import express, { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import routers from './routers/routers';

const app = express();

// https://www.npmjs.com/package/express-fileupload
// package to help with files in express
app.use(fileUpload());

// to use static file , image , html pages
app.use(express.static('./build/public'));

app.use('/', routers);

const port = 3004;

// Home Page
app.get('/', (req: Request, res: Response): void => {
  // rendering html page as main page
  res.render('index.html');
});

// Block unused pages
app.get('*', (req: Request, res: Response): void => {
  res.status(404).sendFile(__dirname + '/public/notFound.html');
});

app.listen(port, (): void => console.log(`Listening on port : ${port}`));

export default app;
