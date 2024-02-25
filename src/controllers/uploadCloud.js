import multer from "multer";
import path from 'path'
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "../helper/cloudinary.js";
import VideoModel from "../models/videoModel.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "courseVideo",
      resource_type: 'video',
      allowed_formats: ['mp4'],
      // public_id: (req, file) => file.originalname.split('.')[0]
      public_id: (req, file) => file?.fieldname + '-' + Date.now()
    }
  });
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
        cb(null, true);
    } else {
        return cb(new Error('Invalid file format. Only MP4 files are allowed.'));
    }
}}).single('topic')

 const videoUpload = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred');
        } else {
             const video = await VideoModel.create({filename: req?.file?.originalname, video_src: req?.file?.path})
            res.status(200).send({url: req?.file?.path, id: video._id });
        }
    });
  }
 const thumbnailUpload = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred');
        } else {
            res.send({url: req.file.path });
        }
    });
  }
  
export default {videoUpload, thumbnailUpload}


