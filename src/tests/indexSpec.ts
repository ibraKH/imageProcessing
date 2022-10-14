import supertest from "supertest";
import app from "../index";

const request = supertest(app);

describe('Test Home page response', () => {
    it('gets Home page', async () => {
        const res = await request.get("/");

        expect(res.statusCode).toEqual(200);
    });
});

describe('Test for unfound page response', () => {
    it('gets error status', async () => {
        // entering random page
        const res = await request.get("/re");

        
        expect(res.statusCode).toEqual(404);
    });
});
