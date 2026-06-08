import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dojrorkrb",
  api_key: "978759491433125",
  api_secret: "r3bUQfjS4KWBSuZv4WQNE79kEv0",
});

fs.writeFileSync("test.pdf", "Dummy PDF content");

cloudinary.uploader.upload("test.pdf", { resource_type: "auto" })
  .then(res => {
    console.log("AUTO UPLOAD SUCCESS:", res);
    cloudinary.uploader.upload("test.pdf", { resource_type: "raw" })
      .then(res2 => console.log("RAW UPLOAD SUCCESS:", res2))
      .catch(err2 => console.error("RAW ERROR:", err2));
  })
  .catch(err => console.error("AUTO ERROR:", err));
