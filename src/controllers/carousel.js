import { catchAsyncError } from "../middleware/catchAsyncError.js"
import CarouselModel from "../models/carouselModel.js"
import ErrorHandler from "../utils/errorHandler.js"

const addCarousel = async(req, res) =>{
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
const getCarousel = catchAsyncError(async(req, res, next) =>{
    const carousel = await CarouselModel.find({visibility: true})
    if(!carousel){
        return next(new ErrorHandler("Carousel not found", 404))
    }
    res.status(200).send({
        success: true,
        carousel
    })
})
const getAllCarousel = catchAsyncError(async(req, res, next) =>{    
    const carousels = await CarouselModel.find()   
    if(!carousels){
        return next(new ErrorHandler("Carousel not found", 404))
    }
    if(req.user.role !== "admin"){
        return next(new ErrorHandler("Unauthorised access", 401))
    }

    res.status(200).send({
        success: true,
        count: carousels.length,
        carousels
    })
})
const delCarousel = catchAsyncError(async(req, res, next) =>{
    const carousel = await CarouselModel.findByIdAndDelete({ _id: req.params.id });
        if (!carousel) {
            return next(new ErrorHandler("Caroulse not Found", 404))
        }
        res.status(204).send({
           success: true,   
           message: "Deleted Successfully!"
        });
})
const getCarouselById = catchAsyncError(async(req, res, next) =>{
    const carousel = await CarouselModel.findById({ _id: req.params.id });
        if (!carousel) {
            return next(new ErrorHandler("Caroulse not Found", 404))
        }
        res.status(200).send({
           success: true,   
           message: "Get Successfully!",
           carousel
        });
})
const editCarousel = catchAsyncError(async(req, res, next) =>{
    let carousel = await CarouselModel.findById({_id: req.params.id});
    if(!carousel) {
        return next(new ErrorHandler("Not found", 404))
    }
    carousel = await CarouselModel.findByIdAndUpdate(req.params.id, req.body,{new : true, runValidators: true})
    res.status(201).send({
        success: true,
        carousel
    })
})

export default {addCarousel, getCarousel, getAllCarousel, delCarousel, editCarousel, getCarouselById}