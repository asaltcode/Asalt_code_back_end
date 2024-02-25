import multer from "multer";
import path from 'path'
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'your-folder-name',
      resource_type: 'auto',
      public_id: (req, file) => file.originalname
    }
  });
  const upload = multer({storage: storage}).single('profile')
 const videoUpload = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred');
        } else {
            res.send({url: req.file.path });
        }
    });
  }

  
export default {videoUpload}

