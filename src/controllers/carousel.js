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
        const image = await CarouselModel.find({})
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
        
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}
const editCrousel = async(req, res) =>{
    try {
        
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}

export default {addCrousel, getCrousel, delCrousel, editCrousel,}