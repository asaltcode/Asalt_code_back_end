import TopicModle from "../models/topicModel.js"
import SyllabusModle from "../models/syllbusModel.js"
const addTopic = async (req, res)=>{
 try {
  const topic = await TopicModle.findOne({topic_video: req.body.topic_video})
  if(!topic){
     const topic = await TopicModle.create(req.body)
     res.status(200).send({
        message: "Topic added successfully"
      })
  }else{
   res.status(400).send({
      message: "This Video areade exist"
   })
  }
 } catch (error) {
   res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
    });
 }
}

const get_topic_syllabus_id_by = async (req, res)=>{
   try {
      const syllabus = await SyllabusModle.findOne({_id: req.params.id})
   } catch (error) {
     res.status(500).send({
       message: "Internal Server Error",
       error: error.message,
     });
   }
 }

export default {addTopic, get_topic_syllabus_id_by}