import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

cloudinary.config({
  cloud_name: 'dojrorkrb',
  api_key: '978759491433125',
  api_secret: 'r3bUQfjS4KWBSuZv4WQNE79kEv0'
});

const app = express();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    const ext = file.originalname.split(".").pop();
    const baseName = file.originalname.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_");
    const publicId = isImage ? `${baseName}_${Date.now()}` : `${baseName}_${Date.now()}.${ext}`;

    return {
      folder: "cogniflow",
      resource_type: isImage ? "image" : "raw",
      public_id: publicId,    
    };
  },
});

const upload = multer({ storage: storage });

app.post('/test-upload', upload.single('file'), (req, res) => {
  res.json({
    fileUrl: req.file.secure_url || req.file.path,
    reqFile: req.file
  });
});

const server = app.listen(4001, async () => {
  console.log('Server testing on 4001');
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('test_upload.pdf'));
    const response = await fetch('http://localhost:4001/test-upload', { method: 'POST', body: form });
    const data = await response.json();
    console.log("FINAL URL:", data.fileUrl);
    console.log("CLOUDINARY FILE DATA:", data.reqFile);
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
});
