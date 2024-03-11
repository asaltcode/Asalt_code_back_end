import mongoose from "./index.js";

const imageSchema = new mongoose.Schema(
  {
    filename: String,
    image_src: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
  },
  
  {
    versionKey: false,
    collation: "videos",
  }
);

const ImageModel = mongoose.model("videos", imageSchema);

export default ImageModel;