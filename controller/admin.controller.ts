const supertest=require('supertest')
import baseConfig from "../config/base.config";
const request = supertest(baseConfig.baseUrl)

class AdminController 
{
    postAdminLogin(data: {[key:string] : string}) 
    {
      return request.post('/admin/login')
                    .send(data)
    }
}
export default new AdminController();