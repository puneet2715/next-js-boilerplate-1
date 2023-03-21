import handler from '@/pages/api/todo/index';
import app from '@/pages/api/todo/[id]';
const httpMocks = require('node-mocks-http')
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe("Testing with id route path",()=>{
    //starting the instance
    var mongoServer: MongoMemoryServer;
    var id: string;
    var mockData: any;

    beforeAll(async()=>{
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        //posting our testing data
        let request  = httpMocks.createRequest({
            method: 'POST',
            url: '/api/todo',
            body:{
                "task": "API",
                "priority": "High",
                "dueDate": "2025-10-08",
                "done": false
            }
        });
        let response = httpMocks.createResponse();
        await handler(request, response);
        //getting it's ID
        request = httpMocks.createRequest({
            method:"GET",
            url:'/api/todo'
        })
        await handler(request,response);
        mockData = response._getData()[0];
        id = String(mockData._id);
    })
    
    //closing the instance
    afterAll(async()=>{
        await mongoose.disconnect();
        await mongoose.connection.close();
        mongoServer.stop(); 
    })

    describe("GET/PUT/DELETE Common edge cases", ()=>{
        test('GET/PUT/DELETE request with _id format wrong',async ()=>{
            const request  = httpMocks.createRequest({
                query: { id:"anything" }
            });
            const response = httpMocks.createResponse();
            await app(request, response);
            const data = response._getData();
            expect(response.statusCode).toEqual(404)
            expect(data).toStrictEqual({message:"Todo Data with given id cannot be found!"})    
        })
        test('GET/PUT/DELETE request with _id not present',async ()=>{
                let id = String(new mongoose.Types.ObjectId());
                const request  = httpMocks.createRequest({ query:{id} }); 
                const response = httpMocks.createResponse();
                await app(request, response);
                const data = response._getData();
                expect(response.statusCode).toEqual(404)
                expect(data).toStrictEqual({message:"Todo Data with given id cannot be found!"})      
        })
        test('Request with METHOD not defined',async () => {
            const request  = httpMocks.createRequest({ method:'ANY', query:{id} }); 
            const response = httpMocks.createResponse();
            await app(request, response);
            const data = response._getData();
            expect(response.statusCode).toEqual(404)
            expect(data).toStrictEqual({message:"Request Method Not found"}) 
        })
    })

    describe("Get request with given id",()=>{
        test('GET successful request',async ()=>{
            const request  = httpMocks.createRequest({
                method: 'GET',
                query:{id}
            }); 
            const response = httpMocks.createResponse();
            await app(request, response);
            const data = response._getData();
            expect(response.statusCode).toEqual(200)
            expect(data).toStrictEqual(mockData)
        })
    })

    describe("PUT request with given id", ()=>{
        test("PUT successful request", async()=>{
            const request  = httpMocks.createRequest({
                method: 'PUT',
                query: {id},
                body: {
                    done:false
                }
            });
            const response = httpMocks.createResponse();
            await app(request, response);
            expect(response.statusCode).toEqual(200) 
        })
    })

    describe("DELETE request with given id", ()=>{
        test("DELETE successful request", async()=>{
            const request  = httpMocks.createRequest({
                method: 'DELETE',
                query: {id}
            });
            const response = httpMocks.createResponse();
            await app(request, response);
            expect(response.statusCode).toEqual(200) 
            expect(response._getData()).toStrictEqual({
                message:"Data deleted succesfully!"
            })
        })
    })

})