import * as supertest from 'supertest' 
const request = supertest('https://sdetunicorns.com/api/test')
import BrandsController from '../controller/brands.controller';

describe('Brands', () => {
    describe.only('Fetch all the Brands', () => 
    {
        it('GET /brands - Display all brands', async () => {
            // const res = await request.get('/brands');
            const res = await BrandsController.getBrands();
            const brandCount = await res.body.length;
            expect(res.statusCode).toBe(200);
            expect(res.body).not.toEqual({});
            expect(res.body.length).toBeGreaterThan(1);
            expect(Object.keys(res.body[0])).toEqual(["_id","name"]);
            console.log(res.statusCode);
            console.log(res.body);
            console.log(brandCount);
            console.log(Object.keys(res.body[0]));
        });
    
    });
    describe('Create the Brand', () => 
    {
        let postBrand;
        const data = {
            'name' : "A Plus "+Math.floor(Math.random()*10000),
            'description' : "My special Phone"
        }
        beforeAll(async()=>
        {       
                postBrand = await request.post('/brands')
                                     .send(data)
        });
        it('POST /brands - Will add a new unique brand', async () => 
        {
            await expect(postBrand.statusCode).toEqual(200);
            await expect(postBrand.body).toHaveProperty('createdAt');
            await expect(postBrand.body.name).toEqual(data.name);
        });
        it('Schema validations - Name is mandatory field to create a brand', async () => 
        {
                    const data = {
                        'name' : '',
                        'description' : 'My special Phone'
                    }
            
                    const res = await request.post('/brands')
                                         .send(data)

                    await expect(res.statusCode).toEqual(422);
                    await expect(res.body.error).toEqual('Name is required');
                
        });
        it('Schema validations - Minimum character length for name is >1', async () => 
        {
                    const data = {
                        'name' : 'a',
                        'description' : 'My special Phone'
                    }
            
                    const res = await request.post('/brands')
                                     .send(data)

                    await expect(res.statusCode).toEqual(422);
                    await expect(res.body.error).toEqual("Brand name is too short")
        });
        it('Schema validations - Brand name > 30 cannot be accepted', async () => 
        {
                    const data = {
                        'name' : 'Updated with greater than 30 characters',
                        'description' : "with long brand name"
                        }
                        const res = await request.post(`/brands`)
                                             .send(data)
            
                        await expect(res.statusCode).toEqual(422);
                        await expect(res.body.error).toContain('Brand name is too long')
        });
        it('Schema validations - Brand description must be string', async () => 
        {
                    const data = {
                        'name' : "Sample data",
                        'description' : 122
                        }

                        const res = await request.post(`/brands`)
                                                 .send(data)

                        await expect(res.statusCode).toEqual(422);
                        await expect(res.body.error).toEqual('Brand description must be a string')
                        // await expect(res.body.error).toEqual('Brand description must be a string');

        });
        it('Business validations - Duplicate brand entries are not allowed', async() => 
        {
                    const res = await request.post('/brands')
                                     .send(data)
                    await expect(res.statusCode).toEqual(422);
                    await expect(res.body.error).toContain('already exists');
        });
        afterAll(async()=>
        {
                await request.delete(`/brands/${postBrand.body._id}`);
        });
    });
    
    describe('Fetch Individual Brand', () => {
            let postBrand;
            const data = {
                'name' : "A Plus "+Math.floor(Math.random()*10000),
                'description' : "My special Phone"
            }
            beforeAll(async()=>
            {
                postBrand = await request.post('/brands')
                                     .send(data)
            })
            afterAll(async()=>
            {
                    await request.delete(`/brands/${postBrand.body._id}`);
            });
            it('GET /brands{_id} - Display the details of one brand and verify the name of the brand', async () => {
                const id = postBrand.body._id
                const res = await request.get(`/brands/${id}`);
                console.log("res::: ",res.body)
                expect(res.statusCode).toEqual(200);
                expect(res.body).not.toEqual({});
                expect(res.body.name).toEqual(postBrand.body.name);
            });
            it('GET /brands{_id} - Throw error when invalid brand is given', async () => 
            {
                const id = '63448f0500baaa15781115ae'; //invalid hexid brand
                const res = await request.get(`/brands/${id}`);
                console.log("res::: ",res.body)
                await expect(res.statusCode).toEqual(404);
                await expect(res.body.error).toContain('Brand not found');
            });
    });

    describe('Update Brands', () => 
    {
        let postBrand;
        const data = {
            'name' : "A Plus "+Math.floor(Math.random()*10000),
            'description' : "My special Phone"
        }
        beforeAll(async()=>{
                postBrand = await request.post('/brands')
                                     .send(data)
        })
        afterAll(async()=>
        {
                await request.delete(`/brands/${postBrand.body._id}`);
        });
        it('PUT /brands - Will update an existing brand', async () => {
            const data = {
                'name' : postBrand.body.name + ' Updated',
                'description' : "My special Phone updated"
                }
            const res = await request.put(`/brands/${postBrand.body._id}`)
                                 .send(data)
            console.log("API response after update::: ",res.body)

            await expect(res.statusCode).toEqual(200);
            await expect(res.body.name).toEqual(data.name);

            console.log(res.statusCode);
            console.log(res.body);
        });
        it('PUT /brands - Throw error when updating invalid brand', async () => {
            const invalidBrand = '64b420bf49e85607248eccb1'
            const data = {
                'name' : postBrand.name + ' Updated',
                'description' : "My special Phone updated"
                }
                const res = await request.put(`/brands/${invalidBrand}`)
                                         .send(data)
                                        
                await expect(res.statusCode).toEqual(404);
                await expect(res.body.error).toContain('Brand not found.');                            
        }); 
    });

    describe('Delete Brands', () => 
    {
        let postBrand;
        const data = {
            'name' : "A Plus "+Math.floor(Math.random()*10000),
            'description' : "My special Phone"
        }
        beforeAll(async()=>{
                postBrand = await request.post('/brands')
                                     .send(data)
        })
        it('DELETE /brands - Will delete an existing brand', async () => 
        {
            const res = await request.delete(`/brands/${postBrand.body._id}`)

            await expect(res.statusCode).toEqual(200);
            await expect(res.body).toEqual(null);

            console.log(res.statusCode);
            console.log(res.body);
        });
        it('DELETE /brands - Throw error when deleting invalid brand', async () => {
            const invalidBrand = '64b420bf49e85607248eccb1'
            const res = await request.delete(`/brands/${invalidBrand}`)
                                         
            await expect(res.statusCode).toEqual(404);
            await expect(res.body.error).toContain('Brand not found.')
        });
    });
});
