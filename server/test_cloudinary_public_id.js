import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dojrorkrb",
  api_key: "978759491433125",
  api_secret: "r3bUQfjS4KWBSuZv4WQNE79kEv0",
});

const validPDF = Buffer.from(
  "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\ntrailer<</Size 4/Root 1 0 R>>",
  "utf8"
);
fs.writeFileSync("real_test2.pdf", validPDF);

cloudinary.uploader.upload("real_test2.pdf", { resource_type: "image", public_id: "test_no_ext" })
  .then(res => {
    console.log("NO EXT UPLOAD SUCCESS:");
    console.log("format:", res.format);
    console.log("resource_type:", res.resource_type);
    console.log("secure_url:", res.secure_url);
  })
  .catch(err => console.error("NO EXT ERROR:", err));

cloudinary.uploader.upload("real_test2.pdf", { resource_type: "image", public_id: "test_with_ext.pdf" })
  .then(res => {
    console.log("WITH EXT UPLOAD SUCCESS:");
    console.log("format:", res.format);
    console.log("resource_type:", res.resource_type);
    console.log("secure_url:", res.secure_url);
  })
  .catch(err => console.error("WITH EXT ERROR:", err));
