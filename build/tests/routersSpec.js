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
const index_1 = __importDefault(require("../index"));
const resize_1 = __importDefault(require("../resize"));
const request = (0, supertest_1.default)(index_1.default);
// Test if resize return a path of resized image
describe('Testing resize module', () => {
    it('gets path to resized image', () => __awaiter(void 0, void 0, void 0, function* () {
        const path = yield (0, resize_1.default)('test', 400, 400);
        expect(path).toEqual('resized/test_400x400.jpg');
    }));
});
describe('Resize page with get method', () => {
    it('gets a resized image', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/resize/img/name=test&width=500&height=500');
        expect(res.statusCode).toEqual(200);
    }));
});
// Resize with file name thats never stored
describe('Resize page with get method', () => {
    it('gets errot status', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/resize/img/name=test&width=500&height=-500');
        expect(res.statusCode).toEqual(404);
    }));
});
// Resize with negative params
describe('Get Resize page with get method', () => {
    it('gets errot status', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/resize/img/name=test&width=500&height=-500');
        expect(res.statusCode).toEqual(404);
    }));
});
// Get img with required params
describe('Testing for displaying img', () => {
    it('gets error status', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/img/name=test&width=500&height=500');
        expect(res.statusCode).toEqual(200);
    }));
});
// Get img with new name : expect error
describe('Testing for displaying img', () => {
    it('gets error status', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/img/name=Riyadh&width=500&height=700');
        expect(res.statusCode).toEqual(404);
    }));
});
