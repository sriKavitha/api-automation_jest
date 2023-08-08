import catcontroller from '../controller/categories.controller';
import adminController from '../controller/admin.controller';
import baseConfig from '../config/base.config';

describe('Categories', () => {
    describe('Fetch Categories', () => {

        it('GET categories - Fetch all categories', async() => {
            const res = await catcontroller.getCategories();

            expect(res.statusCode).toEqual(200)
            expect(res.body.length).toBeGreaterThan(1)
            expect(res.body).not.toEqual({})
            expect(Object.keys(res.body[0])).toEqual(["_id","name"]);        
        });
    
        it('GET/{id} categories - Fetch individual category', async() => {
            const res = await catcontroller.getCategoriesId('63448f0500b2931578c0a5b3')

            expect(res.statusCode).toEqual(200)
            expect(res.body).not.toEqual({})
        });
    });

    describe('Create Categories', () => {
        let token;
        beforeAll(async()=>{
            const data = {"email":baseConfig.email, "password": baseConfig.password}
            const res = await adminController.postAdminLogin(data)
            token = res.body.token
        });
        it('POST - Add a new category', async () => {
            const body =  { "name" : "Mac laptop" + Math.floor(Math.random()*10000)}
            
            const res = await catcontroller.postCategories(body)
                                           .set("Authorization", "Bearer "+token);
            
            expect(res.statusCode).toEqual(200)
            expect(res.body.error).not.toEqual('Access denied. User does not have permissions.')
            expect(res.body.name).toEqual(body.name)
        });
    });

    describe('Update Categories', () => {
        let token, postCategoryId;
        
        beforeAll(async()=>{
            const creds = {"email":baseConfig.email, "password": baseConfig.password}
            const res = await adminController.postAdminLogin(creds)
            token = res.body.token

            const body =
            {
                "name" : "Mac simple laptop - " + Math.floor(Math.random()*10000)
            }
            const postRes = await catcontroller
                                    .postCategories(body)
                                    .set("Authorization", "Bearer "+token);
            
            postCategoryId = postRes.body._id
            console.log("created id for updates..",postCategoryId)
        });
        it('PUT - /categories/{id} - Update a category', async () => {
            const putData =
            {
                "name" : "Mac simple update " + Math.floor(Math.random()*10000)
            }
            console.log("after created id for updates..",postCategoryId)

            const res = await catcontroller.putCategories(postCategoryId, putData)
                                           .set("Authorization", "Bearer "+token);
            
            expect(res.statusCode).toEqual(200)
            expect(res.body.error).not.toEqual('Access denied. User does not have permissions.')
            expect(res.body.name).toEqual(putData.name)
        });
    });

    describe('Delete Categories', () => {
        let token, postCategoryId;
        beforeAll(async()=>{
            const creds = {"email":baseConfig.email, "password": baseConfig.password}
            const res = await adminController.postAdminLogin(creds)
            token = res.body.token
            const data =
            {
                "name" : "Mac simple" + Math.floor(Math.random()*10000)
            }
            const postRes = await catcontroller.postCategories(data)
                                         .set("Authorization", "Bearer "+token);
            postCategoryId = postRes.body._id
            console.log("postCategoryId for deletion", postCategoryId)
        });
        it('DELETE - /delete - Delete a category', async () => {
            const res = await catcontroller.deleteCategories(postCategoryId)
                                           .set("Authorization", "Bearer "+token);
            
            expect(res.statusCode).toEqual(200)
            expect(res.body.error).not.toEqual('Access denied. User does not have permissions.')
            console.log("deleted: ",postCategoryId)
            console.log(res.statusCode)
            console.log(res.body.error);
        });
    });
});