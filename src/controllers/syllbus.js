import CourseModel from "../models/courseModel.js";
import SyllabusModle from "../models/syllbusModel.js";
import TopicModle from "../models/topicModel.js";
const addSyllabus = async (req, res) => {
  try {
    const syllabus = await SyllabusModle.findOne({ title: req.body.title });
    if (!syllabus) {
      await SyllabusModle.create(req.body);
      res.status(200).send({
        message: "Syllabus Added Successfully",
      });
    } else {
      res.status(400).send({
        message: "This syllabus already exist",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getAllSyllabus = async (req, res) => {
  try {
    const syllabus = await SyllabusModle.find();
    const topic = [];
      for (let i in syllabus) {
        topic.push(...(await TopicModle.find(
            { $and: [{ syllabus_id: syllabus[i]._id }] },
            { _id: 0, topic_video_id: 0, visibility: 0, createdAt: 0, topic_video: 0}
          ))
        );
      }

      for (let i in syllabus) {
        for (let y in topic) {
          if (`${syllabus[i]._id}` === `${topic[y].syllabus_id}`) {
            syllabus[i].items.push(topic[y]);
          }
        }
      }

    if (syllabus) {
      res.status(200).send({
        message: "syllabus featched Successfully",
        syllabus,
      });
    } else {
      res.status(404).send({
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
const getSyllabus = async (req, res) => {
  try {
    const syllabus = await SyllabusModle.find(
      { visibility: true },
      { visibility: 0 }
    );
    if (syllabus) {
      res.status(200).send({
        message: "Syllabus featched Successfully",
        syllabus,
      });
    } else {
      res.status(404).send({
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
const delSyllabus = async (req, res) => {
  try {
    const syllabus = await SyllabusModle.findById({ _id: req.params.id });
    if (syllabus) {
      await SyllabusModle.deleteOne({ _id: req.params.id });
      res.status(200).send({
        message: "Syllabus Deleted Successfully",
      });
    } else {
      res.status(400).send({
        message: `Invalid User Id`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
const editSyllabus = async (req, res) => {
  try {
    const { title, author, category, visibility, description, thumbnail } =
      req.body;
    const syllabus = await SyllabusModle.findOne({ _id: req.params.id });
    const BodyThumbnail = await SyllabusModle.findOne({
      thumbnail: req.body.thumbnail,
    });
    if (!syllabus) {
      return res.status(404).send({
        message: "Not Found",
      });
    }
    if (thumbnail === syllabus.thumbnail || thumbnail !== syllabus.thumbnail) {
      if (!BodyThumbnail || thumbnail === syllabus.thumbnail) {
        syllabus.title = title;
        syllabus.author = author;
        syllabus.category = category;
        syllabus.visibility = visibility;
        syllabus.description = description;
        syllabus.thumbnail = thumbnail;
        await syllabus.save();
        return res.status(200).send({
          message: "Updated Successfully",
        });
      } else {
        res.status(400).send({
          message: "This thubnail already exist",
        });
      }
    } else {
      return res.status(501).send({
        message: "Not Implemented",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getSyllabusByCourseId = async (req, res) => {
  try {
    const syllabus = await SyllabusModle.find({ course_id: req.params.id });
    if (syllabus) {
      const syllabus = await SyllabusModle.find({$and: [{course_id: req.params.id}, {visibility: true}]}, {createdAt: 0});
      const topic = [];
      for (let i in syllabus) {
        topic.push(...(await TopicModle.find(
            { $and: [{ syllabus_id: syllabus[i]._id }, {visibility: true}] },
            { _id: 0, topic_video_id: 0, visibility: 0, createdAt: 0, topic_video: 0}
          ))
        );
      }

      for (let i in syllabus) {
        for (let y in topic) {
          if (`${syllabus[i]._id}` === `${topic[y].syllabus_id}`) {
            syllabus[i].items.push(topic[y]);
          }
        }
      }
      res.status(200).send({
        message: "syllabus featched Successfully",
        syllabus,
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
};
const getSyllabusByCourseIdAdmin = async (req, res) => {
  try {
    const syllabus = await SyllabusModle.find({ course_id: req.params.id });
    if (syllabus) {
      const syllabus = await SyllabusModle.find({$and: [{course_id: req.params.id}, {visibility: true}]});
      const topic = [];
      for (let i in syllabus) {
        topic.push(...(await TopicModle.find(
            { $and: [{ syllabus_id: syllabus[i]._id }, {visibility: true}] },
            { _id: 0, topic_video_id: 0, visibility: 0, createdAt: 0, topic_video: 0}
          ))
        );
      }

      for (let i in syllabus) {
        for (let y in topic) {
          if (`${syllabus[i]._id}` === `${topic[y].syllabus_id}`) {
            syllabus[i].items.push(topic[y]);
          }
        }
      }
      res.status(200).send({
        message: "syllabus featched Successfully",
        syllabus,
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
};
const getSyllabusByCourseIdNormal = async (req, res) => {
  try {
    const syllabus = await SyllabusModle.find({ course_id: req.params.id });
    if (syllabus) {
      const syllabus = await SyllabusModle.find({$and: [{course_id: req.params.id}, {visibility: true}]},{createdAt:0});
      const topic = [];
      for (let i in syllabus) {
        topic.push(
          ...(await TopicModle.find(
            { $and: [ { syllabus_id: syllabus[i]._id }, {visibility: true}] },
            { _id: 0, topic_video_id: 0, visibility: 0, createdAt: 0, topic_video: 0}
          ))
        );
      }

      for (let i in syllabus) {
        for (let y in topic) {
          if (`${syllabus[i]._id}` === `${topic[y].syllabus_id}`) {
            syllabus[i].items.push(topic[y]);
          }
        }
      }
      res.status(200).send({
        message: "syllabus featched Successfully",
        syllabus,
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
};
const getSyllabusById = async (req, res) => {
  try {
    const syllabus = await SyllabusModle.findOne({ _id: req.params.id });
    if (syllabus) {
      const syllabus = await SyllabusModle.findOne(
        { _id: req.params.id },
        { _id: 0, createdAt: 0 }
      );
      res.status(200).send({
        message: "syllabus featched Successfully",
        syllabus,
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
};

export default {
  addSyllabus,
  getAllSyllabus,
  getSyllabus,
  delSyllabus,
  editSyllabus,
  getSyllabusById,
  getSyllabusByCourseId,
  getSyllabusByCourseIdAdmin,
  getSyllabusByCourseIdNormal,
};
