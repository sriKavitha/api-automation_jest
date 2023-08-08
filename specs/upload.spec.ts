import fileUploadController from '../controller/fileUpload.controller';

describe('File upload', () => {
    it('POST /upload/single - Upload single file', async() => {
        const res = await fileUploadController.postFileUploadSingle('data/bar1.png')
        let fname= res.body.filename
        console.log(fname)
        expect(res.body.filename).toEqual('bar1.png')
    });

    it('POST /upload/multiple - Upload multiple files', async() => {
        
        const files = ['data/bar1.png','data/barcode1.jpg','data/images1.jpg']
        const res = await fileUploadController.postFileUploadMultiple(files)
        
        expect(res.body.length).toBe(files.length)
        for(var i=0;i<res.body.length;i++)
        {
            console.log(res.body[i].filename)
            expect(res.body[i].filename).toEqual(files[i].substring(5,))
            console.log(files[i].substring(5,))
        }
    });
});
