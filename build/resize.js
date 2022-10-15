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
const sharp_1 = __importDefault(require("sharp"));
// using sharp to resize and filtering
const resize = (fileName, width, height, blur, gray, flip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, sharp_1.default)(`upload/${fileName}.jpeg`)
            .resize(width, height)
            .grayscale(gray)
            .flip(flip)
            .blur(blur ? 2 : 0.3)
            .toFile(`resized/${fileName}_${width}x${height}.jpg`);
    }
    catch (err) {
        console.log(err);
    }
    return `resized/${fileName}_${width}x${height}.jpg`;
});
exports.default = resize;
