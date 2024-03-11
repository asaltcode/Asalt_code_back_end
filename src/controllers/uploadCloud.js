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
             const video = await VideoModel.create({filename: req?.file?.originalname, video_src: req?.file?.path, public_id: req.file.filename})
               cloudinary.uploader.upload(req.file.path, { resource_type: 'video' }, (error, result) => {
                 if (error) {
                   console.error(error);
                   res.status(500).send('An error occurred');
                  } else {
                    console.log(req.file)
                    const duration = result?.duration;
                    res.status(200).send({url: req?.file?.path, id: video._id, duration, public_id: req.file.filename });        
                }
              });          
          
        }
    });
  }

  const cloudinaryStorage = () => {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "courseImages",
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => file?.fieldname + '-' + Date.now()
      }
    });
  };
  
  const imageUpload = multer({
    storage: cloudinaryStorage(),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
          cb(null, true);
      } else {
          return cb(new Error('Invalid file format. Only JPG and PNG files are allowed.'));
      }
    }
  }).single('image');
  
  const uploadImage = (req, res) => {
    imageUpload(req, res, async (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      } else {
        const image = await ImageModel.create({filename: req?.file?.originalname, image_src: req?.file?.path, public_id: req.file.filename})
        res.status(200).send({url: req?.file?.path, id: image._id, public_id: req.file.filename });        
      }
    });
  };
  
export default {videoUpload}


