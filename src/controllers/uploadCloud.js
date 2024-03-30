import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "../utils/cloudinary.js";
import VideoModel from "../models/videoModel.js";

const createCloudinaryStorage = (resourceType) => {
  return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
          folder: resourceType === 'image' ? 'profileImages' : 'courseVideo',
          resource_type: resourceType,
          allowed_formats: resourceType === 'image' ? ['jpg', 'jpeg', 'png'] : ['mp4'],
          public_id: (req, file) => file.fieldname + '-' + Date.now()
      }
  });
};

export const upload = (resourceType) => {
  const storage = createCloudinaryStorage(resourceType);

  return multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        console.log(file.mimetype)
          if ((resourceType === 'image' && ['jpg', 'jpeg', 'png'].includes(file.mimetype.split('/')[1]) )  || //&& ['jpg', 'jpeg', 'png'].includes(file.mimetype)
              (resourceType === 'video' && file.mimetype === 'video/mp4')) {
              cb(null, true);
          } else {
              cb(new Error(`Invalid file format. Only ${resourceType === 'image' ? 'images (jpg, jpeg, png)' : 'videos (mp4)'} are allowed.`));
          }
      }
  })
};

 const videoUpload = async (req, res) => {
  try {
    const video = await VideoModel.create({ filename: req.file.originalname, video_src: req.file.path, public_id: req.file.filename });
    cloudinary.uploader.upload(req.file.path, { resource_type: 'video' }, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send('An error occurred');
        } else {
            const duration = result?.duration;
            res.status(200).send({ url: req.file.path, id: video._id, duration, public_id: req.file.filename });
        }
    });
  } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
  }
}

  
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


