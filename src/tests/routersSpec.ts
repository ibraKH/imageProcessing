import supertest from 'supertest';
import fs from 'fs';
import app from '../index';
import resize from '../resize';

const request = supertest(app);

// Test if resize return a path of resized image
describe('Testing resize module', () => {
  it('gets path to resized image', async () => {
    const path = await resize('test', 400, 400);

    expect(path).toEqual('resized/test_400x400.jpg');
  });
});

describe('Resize page with get method', () => {
  it('gets a resized image', async () => {
    const res = await request.get('/resize/img/name=test&width=500&height=500');

    expect(res.statusCode).toEqual(200);
  });
});

// Resize with file name thats never stored
describe('Resize page with get method', () => {
  it('gets errot status', async () => {
    const res = await request.get(
      '/resize/img/name=test&width=500&height=-500'
    );

    expect(res.statusCode).toEqual(404);
  });
});

// Resize with negative params
describe('Get Resize page with get method', () => {
  it('gets errot status', async () => {
    const res = await request.get(
      '/resize/img/name=test&width=500&height=-500'
    );

    expect(res.statusCode).toEqual(404);
  });
});

// Get img with required params
describe('Testing for displaying img', () => {
  it('gets error status', async () => {
    const res = await request.get('/img/name=test&width=500&height=500');

    expect(res.statusCode).toEqual(200);
  });
});

// Get img with new name : expect error
describe('Testing for displaying img', () => {
  it('gets error status', async () => {
    const res = await request.get('/img/name=Riyadh&width=500&height=700');

    expect(res.statusCode).toEqual(404);
  });
});
