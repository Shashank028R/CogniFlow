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
fs.writeFileSync("test_upload.pdf", validPDF);

async function testUpload() {
  try {
    console.log("Uploading as auto...");
    const resAuto = await cloudinary.uploader.upload("test_upload.pdf", { resource_type: "auto", folder: "cogniflow" });
    console.log("AUTO RESULT:");
    console.log("resource_type:", resAuto.resource_type);
    console.log("format:", resAuto.format);
    console.log("url:", resAuto.secure_url);

    console.log("\nUploading as raw...");
    const resRaw = await cloudinary.uploader.upload("test_upload.pdf", { resource_type: "raw", folder: "cogniflow" });
    console.log("RAW RESULT:");
    console.log("resource_type:", resRaw.resource_type);
    console.log("format:", resRaw.format);
    console.log("url:", resRaw.secure_url);
  } catch (err) {
    console.error("UPLOAD ERROR:", err.message);
  }
}

testUpload();
