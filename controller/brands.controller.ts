import baseConfig from "../config/base.config";
const supertest=require('supertest')
const request = supertest(baseConfig.baseUrl)
// const request = supertest('https://sdetunicorns.com/api/test')


class BrandController 
{
    getBrands() {
      return request.get('/brands');
    }

    getBrandById(id: string)
    {
        return request.get(`/brands/${id}`);
    }
    postBrand(data:{[key:string]:string | number})
    {
        return request.post('/brands')
                      .send(data)
    }
    putBrand(id: string, data:{[key:string]:string})
    {
        return request.post('/brands')
                      .send(data)
    }
    deleteBrand(id:string)
    {
        return request.delete(`/brands/`+id)
    }
}
export default new BrandController();