import cloudinaryPkg from 'cloudinary';
const { v2: cloudinary } = cloudinaryPkg;

import { config as dotenvConfig } from 'dotenv';
dotenvConfig()

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export default cloudinary;
