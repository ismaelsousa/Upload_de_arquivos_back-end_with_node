const mongoose = require('mongoose')
const aws = require('aws-sdk')
const path = require('path')
//lib para lê, escrever arquivos
const fs = require('fs')
//converte uma função de forma antiga de callback para lidar com programaçao asyncrona
//para nova forma para poder usar async, await , ...
const {promisify} = require('util')

const s3 = new aws.S3();

const PostSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
    createdAt:{
        type:Date,
        default: Date.now
    }
})

PostSchema.pre('save', function(){
    if(!this.url){
        this.url = `${process.env.APP_URL}/files/${this.key}`
    }
})


PostSchema.pre('remove', function(){
    console.log("no remove ________________________")
    console.log(this.key)
    var params = {
        Bucket: 'upload-eeee',
        Key: this.key
      /* where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext' - full path name to your file without '/' at the beginning */
    };
    if(process.env.STORAGE_TYPE == 's3'){    
        return s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          }).promise()
    }else{
        return promisify(fs.unlink)(
            path.resolve(__dirname, '..','..','tmp', 'uploads', this.key))
    }
})

module.exports = mongoose.model('Post', PostSchema);