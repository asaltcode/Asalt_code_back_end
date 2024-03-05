import CourseModel from "../models/courseModel.js"
const addCourse = async(req, res) =>{
    try {
       const course = await CourseModel.findOne({thumbnail: req.body.thumbnail})
       if(!course){
        await CourseModel.create(req.body)
        res.status(200).send({
            message : "Course Added Successfully"
        })
       }else{
        res.status(400).send({
            message: 'This course already exist'
        })
       }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}
const getAllCourse = async(req, res) =>{
    try {
        const courses = await CourseModel.find()
        if(courses){
            res.status(200).send({
                message: "course featched Successfully",
                courses
            })
        }else{
            res.status(404).send({
                message: "Not Found"
            })
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}
const getCourse = async(req, res) =>{
    try {
        const course = await CourseModel.find({visibility: true}, {visibility: 0})
        if(course){
            res.status(200).send({
                message: "course featched Successfully",
                course
            })
        }else{
            res.status(404).send({
                message: "Not Found"
            })
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}
const delCourse = async(req, res) =>{
    try {
        const course = await CourseModel.findById({ _id: req.params.id });
        if (course) {
          await CourseModel.deleteOne({ _id: req.params.id });
          res.status(200).send({
            message: "Course Deleted Successfully",
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
}
const editCourse = async(req, res) =>{
    try {
        const {title, author, price, category, visibility, description, thumbnail} = req.body
        const course = await CourseModel.findOne({ _id: req.params.id });   
        const BodyThumbnail = await CourseModel.findOne({thumbnail: req.body.thumbnail})     
        if(!course){
          return res.status(404).send({
            message: "Not Found"
          })
        } 
        if(thumbnail === course.thumbnail || thumbnail !== course.thumbnail){
        if(!BodyThumbnail ||  thumbnail === course.thumbnail){
            course.title = title
            course.author = author
            course.price = price
            course.category = category
            course.visibility = visibility
            course.description = description
            course.thumbnail = thumbnail
            await course.save()
            return res.status(200).send({
                message: "Updated Successfully"
               })
        }else{
             res.status(400).send({
                message : "This thubnail already exist"
         })
        }  
    } else{
        return res.status(501).send({
          message : "Not Implemented",
          error: error.message,
        })
      }   
        
      } catch (error) {
        res.status(500).send({
          message: "Internal Server Error",
          error: error.message,
        });
      }
}
const getCourseById = async(req, res) =>{
    try {
        const course = await CourseModel.findOne({ _id: req.params.id });        
        if(course){
            const course = await CourseModel.findOne({ _id: req.params.id },{createdAt: 0}); 
           res.status(200).send({
            message: 'Course featched Successfully',
            course
           })
        }else{
            return res.status(404).send({
                message: "Not Found"
              })
            } 
        
      } catch (error) {
        res.status(500).send({
          message: "Internal Server Error",
          error: error.message,
        });
      }
}

export default {addCourse, getCourse, getAllCourse, delCourse, editCourse, getCourseById}

