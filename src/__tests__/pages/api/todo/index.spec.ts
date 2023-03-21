import handler from '@/pages/api/todo/index';
const httpMocks = require('node-mocks-http')
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as _ from 'lodash'; 
import mongoose from 'mongoose';

describe("test with instance",()=>{

    //starting the instance
    var mongoServer: MongoMemoryServer;
    beforeAll(async()=>{
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    })
    
    //closing the instance
    afterAll(async()=>{
        await mongoose.disconnect();
        await mongoose.connection.close();
        mongoServer.stop();
    })
 
    // ESY-191
    test('POST testing with Incomplete data',async () => {

        const request  = httpMocks.createRequest({
            method: 'POST',
            url: '/api/todo',
            body:{
            "task": "Work",
            "priority": "Low",
            "dueDate": "2025-09-22"
            }
        });

        const response = httpMocks.createResponse();
        await handler(request, response);
        const data = response._getData();
        expect(response.statusCode).toEqual(400);
        expect(data).toStrictEqual({message:"Fix following issues: done is not provided, "})
    });

    test('Simple POST testing with Complete Data',async () => {
        const request  = httpMocks.createRequest({
            method: 'POST',
            url: '/api/todo',
            body:{
            "task": "Work",
            "priority": "Low",
            "dueDate": "2025-09-22",
            "done": false
            }
        });

        const response = httpMocks.createResponse();
        await handler(request, response);
        expect(response.statusCode).toEqual(201);
    });

 
    // ESY-1589
    test('GET request to get all data',async () => {
        const request  = httpMocks.createRequest({
            method: 'GET',
            url: '/api/todo',
        });

        const response = httpMocks.createResponse();
        await handler(request, response);
        const data = response._getData();
        expect(response.statusCode).toEqual(200)
        expect(data[0].task).toEqual('Work')
        expect(data[0].priority).toEqual('Low')
        expect(data[0].dueDate).toStrictEqual(new Date('2025-09-22T00:00:00.000Z'))
        expect(data[0].done).toEqual(false) 
    });

    test('GET request with filters',async () => {
        const request  = httpMocks.createRequest({
            method: 'GET',
            url: '/api/todo?isFinished=false&dueDate=2025-09-22&priority=Low',
        });

        const response = httpMocks.createResponse();
        await handler(request, response);
        const data = response._getData();
        expect(response.statusCode).toEqual(200)
        expect(data[0].task).toEqual('Work')
        
    });

    test('Request with METHOD not defined',async () => {
        const request  = httpMocks.createRequest({ method:'ANY' }); 
        const response = httpMocks.createResponse();
        await handler(request, response);
        const data = response._getData();
        expect(response.statusCode).toEqual(404)
        expect(data).toStrictEqual({message:"Request Method Not found"}) 
    })

 
})

export {}