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
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// get method to resize and filtter image , Request body shoud contain image file , width , height
// Here if you want to store new image , if you have existed image try localhost:3004/resize/img/name=name&width=width&heigth=height
router.post('/resize', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // send 404 when image file is empty
    if (!req.files) {
        const parentPath = path_1.default.resolve(__dirname, '..');
        return res.status(404).sendFile(parentPath + '/public/image.html');
    }
    // expected eslint warning here since its any , cannot change it to unknown beacuse it will show error
    const { image } = req.files;
    // convert from string to number since the req.body gets as string
    const width = parseInt(req.body.width);
    const height = parseInt(req.body.height);
    // send 404 when having negative numbers
    if (width < 0 || height < 0) {
        const parentPath = path_1.default.resolve(__dirname, '..');
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
    if (!fs_1.default.existsSync(`./build/upload/${image.name}`)) {
        yield image.mv('./build/upload/' + image.name);
    }
    // using sharp to resize and filtering
    yield (0, sharp_1.default)(`./build/upload/${image.name}`)
        .resize(width, height)
        .grayscale(gray)
        .flip(flip)
        .blur(blur ? 2 : 0.3)
        .toFile(`./build/images/${image.name.split('.')[0]}_${width}x${height}.jpg`, (err) => {
        if (err)
            console.log(err);
        // redirect to display the image
        return res.redirect(`/img/name=${image.name.split('.')[0]}&width=${width}&height=${height}`);
    });
}));
// Resize without post method , with middleware to test if the file is exist
router.get('/resize/img/?name=:name&width=:width&height=:height', (req, res, next) => {
    const image = req.params.name;
    let match = false;
    // test if image name is stored
    fs_1.default.readdir('./build/upload/', (err, files) => {
        files.forEach((file) => {
            if (file.split(".")[0] == image) {
                match = true;
            }
        });
        if (!match) {
            const parentPath = path_1.default.resolve(__dirname, '..');
            return res.status(404).sendFile(parentPath + '/public/image.html');
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
    // send 404 when having negative numbers
    if (width < 0 || height < 0) {
        const parentPath = path_1.default.resolve(__dirname, '..');
        return res.status(404).sendFile(parentPath + '/public/image.html');
    }
    // using sharp to resize and filtering
    yield (0, sharp_1.default)(`./build/upload/${image}.jpeg`)
        .resize(width, height)
        .toFile(`./build/images/${image.split('.')[0]}_${width}x${height}.jpg`, (err) => {
        if (err)
            console.log(err);
        // display the image
        const img = fs_1.default.readFileSync(`./build/images/${image}_${width}x${height}.jpg`);
        res.writeHead(200, { 'Content-Type': 'image/gif' });
        res.end(img);
    });
}));
// displaying the image
router.get('/img/?name=:name&width=:width&height=:height', (req, res) => {
    const image = req.params;
    // if the name of the image does not exist send 404 Or same name but different sizes than that stored
    if (!fs_1.default.existsSync(`./build/images/${image.name}_${image.width}x${image.height}.jpg`)) {
        const parentPath = path_1.default.resolve(__dirname, '..');
        return res.status(404).sendFile(parentPath + '/public/image.html');
    }
    const img = fs_1.default.readFileSync(`./build/images/${image.name}_${image.width}x${image.height}.jpg`);
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(img);
});
exports.default = router;
