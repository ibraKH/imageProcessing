"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const resize_1 = __importDefault(require("../resize"));
const router = express_1.default.Router();
// get method to resize and filtter image , Request body shoud contain image file , width , height
// Here if you want to store new image , if you have existed image try localhost:3004/resize/img/name=name&width=width&heigth=height
router.post('/resize', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // send 404 when image file is empty
    if (!req.files) {
        return res.status(404).send('Please enter an image');
    }
    // expected eslint warning here since its any , cannot change it to unknown beacuse it will show error
    const { image } = req.files;
    // convert from string to number since the req.body gets as string
    const width = parseInt(req.body.width);
    const height = parseInt(req.body.height);
    // send 404 when having negative numbers
    if (width < 0 || height < 0) {
        return res.status(404).send('Please enter a postive number');
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
    if (!fs_1.default.existsSync(`./upload/${image.name}`)) {
        yield image.mv('./upload/' + image.name);
    }
    // calling resize function that resize the image
    const imageName = image.name.split('.')[0];
    const resizeImagePath = yield (0, resize_1.default)(imageName, width, height, blur, gray, flip);
    // display the image
    const parentPath = path_1.default.resolve(resizeImagePath);
    const img = fs_1.default.readFileSync(parentPath);
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(img);
}));
// Resize without post method , with middleware to test if the file is exist
router.get('/resize/img/?name=:name&width=:width&height=:height', (req, res, next) => {
    const image = req.params.name;
    let match = false;
    // test if image name is stored
    fs_1.default.readdir('./upload/', (err, files) => {
        const filesNames = [];
        files.forEach((file) => {
            const fname = file.split('.')[0];
            filesNames.push(fname);
            if (file.split('.')[0] == image) {
                match = true;
            }
        });
        if (!match) {
            return res
                .status(404)
                .send(`Please enter the name of the file correctly , if the file you looking for does not exist use these one that already stored ${filesNames}`);
        }
        else {
            next();
        }
    });
}, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.params.name;
    // convert from string to number since the req.params gets as string
    const width = parseInt(req.params.width);
    const height = parseInt(req.params.height);
    // send 404 when having negative numbers or characters
    if (width < 0 ||
        height < 0 ||
        req.params.width.match('[a-zA-Z]+') ||
        req.params.height.match('[a-zA-Z]+')) {
        return res
            .status(404)
            .send('Please enter only postive numbers in width , height');
    }
    // calling resize function that resize the image
    const imageName = image;
    const resizeImagePath = yield (0, resize_1.default)(imageName, width, height);
    // display the image
    const parentPath = path_1.default.resolve(resizeImagePath);
    const img = fs_1.default.readFileSync(parentPath);
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(img);
}));
// displaying the image
router.get('/img/?name=:name&width=:width&height=:height', (req, res) => {
    const image = req.params;
    // if the name of the image does not exist send 404 Or same name but different sizes than that stored
    if (!fs_1.default.existsSync(`./resized/${image.name}_${image.width}x${image.height}.jpg`)) {
        return res.status(404).send('Please enter the name of the stored image');
    }
    const img = fs_1.default.readFileSync(`./resized/${image.name}_${image.width}x${image.height}.jpg`);
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(img);
});
exports.default = router;
