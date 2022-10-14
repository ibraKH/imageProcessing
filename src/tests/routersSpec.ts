import supertest from "supertest";
import fs from "fs";
import app from "../index";


const request = supertest(app);

describe('Post Resize page', () => {
    it('gets a resized image', async () => {
        const res = await request.post("/resize").set('content-type', 'multipart/form-data')
        .attach('image', fs.readFileSync(`./build/upload/test.jpeg`))
        .field('width', '400')
        .field('height', "400")

        // 302 since the api redirect to display the image
        expect(res.statusCode).toEqual(302);
    });
});

// Post Resize without image file
describe('Testing for empty image', () => {
    it('gets error status', async () => {
        const res = await request.post("/resize").send({ width: '500', height: '500'});

        expect(res.statusCode).toEqual(404);
    });
});

// Post Resize with negative numbers
describe('Testing for negative numbers', () => {
    it('gets error status', async () => {
        const res = await request.post("/resize").set('content-type', 'multipart/form-data')
        .attach('image', fs.readFileSync(`./build/upload/test.jpeg`))
        .field('width', '-400')
        .field('height', "400")

        expect(res.statusCode).toEqual(404);
    });
});

// Get img with required params
describe('Testing for displaying img', () => {
    it('gets error status', async () => {
        const res = await request.get("/img/name=test&width=500&height=700")

        expect(res.statusCode).toEqual(200);
    });
});

// Get img with new name : expect error
describe('Testing for displaying img', () => {
    it('gets error status', async () => {
        const res = await request.get("/img/name=Riyadh&width=500&height=700")

        expect(res.statusCode).toEqual(404);
    });
});