import mongoose from "./index.js";

const videoSchema = new mongoose.Schema(
  {
    filename: String,
    video_src: String,
  },
  {
    versionKey: false,
    collation: "videos",
  }
);

const VideoModel = mongoose.model("videos", videoSchema);

export default VideoModel;
