import * as supertest from 'supertest';
import baseConfig from "../config/base.config";
import { Blob } from 'buffer';
import { ReadStream } from 'fs';
const request = supertest(baseConfig.baseUrl)


class FileUploadController 
{
    postFileUploadSingle(filepath : string )
    {
        return request.post('/upload/single')
                      .attach('single',filepath)
    }
    postFileUpload11Multi1ple(files: string[])
    {
        const req= request.post('/upload/multiple')
        files.forEach(filename =>{
            req.attach('multiple',filename)
        })
        return req
    }
                      
    postFileUploadMultiple(files: string[]) {
        const req = request
          .post('/upload/multiple')
    
        files.forEach(file => {
          req.attach('multiple', file)
        })
    
        return req;
      }
}
export default new FileUploadController();
