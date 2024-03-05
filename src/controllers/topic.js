import TopicModle from "../models/topicModel.js";
import SyllabusModle from "../models/syllbusModel.js";

const addTopic = async (req, res) => {
  try {
    const topic = await TopicModle.findOne({
      topic_video: req.body.topic_video,
    });
    if (!topic) {
      const topic = await TopicModle.create(req.body);
      res.status(200).send({
        message: "Topic added successfully",
      });
    } else {
      res.status(400).send({
        message: "This Video areade exist",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const get_topic_by_syllabus_id = async (req, res) => {
  try {
    const syllabus = await SyllabusModle.findOne({ _id: req.params.id });
    if (syllabus) {
      const topic = await TopicModle.find({ syllabus_id: syllabus._id });
      let total = topic.reduce((pre, cur) => pre.duration + cur.duration);

      res.status(200).send({
        message: "Topic get successfully",
        topic,
        total,
      });
    } else {
      res.status(400).send({
        message: "Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

 const editTopic = async(req, res) =>{
   try {
     const topic  = await TopicModle.findOne({ _id: req.params.id });
     if(topic){
       const { title, visibility, public_id} = req.body;
       topic.title = title
       topic.visibility = visibility
       topic.public_id = public_id
       await topic.save()
      res.status(200).send({
        message: "Updated Successfully",
      });
     }else{
      res.status(404).send({message: "Not Found"})
     }
   } catch (error) {
      res.status(500).send({
         message: "Internal Server Error",
         error: error.message,
       });
   }
 }
 const getTopicById = async(req, res) =>{
   try {
    const topic = await TopicModle.findOne({ _id: req.params.id });
    if (topic) {
      const topic = await TopicModle.findOne({ _id: req.params.id });
      res.status(200).send({
        message: "Topic featched Successfully",
        topic,
      });
    } else {
      return res.status(404).send({
        message: "Not Found",
      });
    }
   } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
   }
 }


export default { addTopic, get_topic_by_syllabus_id, editTopic, getTopicById };
