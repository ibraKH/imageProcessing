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
const supertest_1 = __importDefault(require("supertest"));
const fs_1 = __importDefault(require("fs"));
const index_1 = __importDefault(require("../index"));
const request = (0, supertest_1.default)(index_1.default);
describe('Post Resize page', () => {
    it('gets a resized image', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.post("/resize").set('content-type', 'multipart/form-data')
            .attach('image', fs_1.default.readFileSync(`./build/upload/test.jpeg`))
            .field('width', '400')
            .field('height', "400");
        // 302 since the api redirect to display the image
        expect(res.statusCode).toEqual(302);
    }));
});
describe('Testing for empty image', () => {
    it('gets error status', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.post("/resize").send({ width: '500', height: '500' });
        expect(res.statusCode).toEqual(404);
    }));
});
describe('Testing for negative numbers', () => {
    it('gets error status', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.post("/resize").set('content-type', 'multipart/form-data')
            .attach('image', fs_1.default.readFileSync(`./build/upload/test.jpeg`))
            .field('width', '-400')
            .field('height', "400");
        expect(res.statusCode).toEqual(404);
    }));
});
