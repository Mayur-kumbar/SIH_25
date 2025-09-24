import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
  cloud_name: "dqd1ddanr",
  api_key: "976489198897488",
  api_secret: "Xg8lArXH-iqHuIgDUBzj576Z9F0", 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log(uploadResult);
        fs.unlinkSync(localFilePath);
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localFilePath); 
        console.log(error);
        return null;
    }
};


export {uploadOnCloudinary}
