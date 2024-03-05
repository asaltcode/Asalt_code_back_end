import CarouselModel from "../models/carouselModel.js"

const addCrousel = async(req, res) =>{
    try {
       const image = await CarouselModel.findOne({imageUrl: req.body.imageUrl})
       if(!image){
        await CarouselModel.create(req.body)
        res.status(200).send({
            message : "Image Added Successfully"
        })
       }else{
        res.status(400).send({
            message: 'This image already exist'
        })
       }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}
const getCrousel = async(req, res) =>{
    try {
        const image = await CarouselModel.find({visibility: true})
        if(image){
            res.status(200).send({
                message: "image featched Successfully",
                image
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
const getAllCrousel = async(req, res) =>{
    try {
        const image = await CarouselModel.find()
        if(image){
            res.status(200).send({
                message: "image featched Successfully",
                image
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
const delCrousel = async(req, res) =>{
    try {
        const carousel = await CarouselModel.findById({ _id: req.params.id });
        if (carousel) {
          await CarouselModel.deleteOne({ _id: req.params.id });
          res.status(200).send({
            message: "Carousel Deleted Successfully",
          });
        } else {
          res.status(404).send({
            message: `NOt Found`,
          });
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}
const getCrouselById = async(req, res) =>{
    try {
        const carousel = await CarouselModel.findOne({ _id: req.params.id });
        if (carousel) {
          res.status(200).send({
            message: "Carousel fetched Successfully",
            carousel
          });
        } else {
          res.status(404).send({
            message: `NOt Found`,
          });
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}
const editCrousel = async(req, res) =>{
    try {
        const carousel = await CarouselModel.findById({ _id: req.params.id });
        if (carousel) {
            const {imageUrl, imageAlt, description, visibility} = req.body
            carousel.imageUrl = imageUrl
            carousel.imageAlt = imageAlt
            carousel.description = description
            carousel.visibility = visibility
            await carousel.save()
          res.status(200).send({
            message: "Syllabus Deleted Successfully",
          });
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}

export default {addCrousel, getCrousel, getAllCrousel, delCrousel, editCrousel, getCrouselById}