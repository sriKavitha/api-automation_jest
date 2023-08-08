const supertest=require('supertest')
const request = supertest('https://jsonplaceholder.typicode.com')
// https://sdetunicorns.com/test/api-docs/ - SWAGGER
describe('POC API tests', () => {
    describe.only('GET requests', () => {
        it('GET all /posts', async () => {
            const res = await request.get('/posts')
            console.log('respose:::',res)
            expect(res.statusCode).toBe(200); // status code is 200
            expect(res.body).not.toBe(null); // res bosy is not null
            expect(res.body[1].id).toBe(2); // second id is 2
        });
        
        it('GET /posts', async () => {
            const res = await request.get('/posts/2')
            console.log('respose:::',res)
            expect(res.statusCode).toBe(200); // status code is 200
            expect(res.body).not.toBe(null); // res bosy is not null
        });
    
        it('GET /comments  query parameters', async () => {
            const res = await request
            .get('/comments')
            .query({postId:2, limit:3})
            console.log(res)
        });
    }); 
    describe.only('POST requests', () => {
        it('POST /posts', async() => {
            const data =
            {
                title: 'My title',
                body: 'My test',
                userId: 306
            }
            const res = await request
            .post('/posts')
            .send(data)
        console.log(res.body)
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe(data.title)
    });
    });
    describe.only('PUT requests', () => {
        it('PUT /posts/{2}', async() => {
            const data =
            {
                title: 'Updated with new title',
                body: 'Updated with new test',
                userId: 306
            }
            const res = await request
            .put('/posts/2')
            .send(data)
        console.log(res.body)
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe(data.title)
    });
    });
    describe.only('PATCH requests', () => {
        it('PATCH /posts{id}', async() => {
            const data =
            {
                title: 'Update only my title'
            }
            const res = await request
            .patch('/posts/2')
            .send(data)
        console.log(res.body)
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe(data.title)
    });
    });
    describe.only('DELETE requests', () => {
        it('DELETE /posts{id}', async() => {
        const res = await request
            .delete('/posts/2')
        console.log(res.body)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({})
    });    
    });
});

