import mongoose from './index.js'
// Custom validator function for URL format
function validateURL(url) {
    const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
    return urlRegex.test(url);
  }

const carouselSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
        validate: {
            validator: validateURL,
            message: 'Invalid URL format for image'
          }
      },
    imageAlt: {
       type: String,
       default: "image"
    },
    description: {
        type: String,
        default: ""
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },    
},
{
    collection : "carousel",
    versionKey: false
})

const CarouselModel = mongoose.model('carousel', carouselSchema);

export default CarouselModel;