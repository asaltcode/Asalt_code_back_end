import PurchaseModel from "../models/purchaseModel";

const addPurchase = async (req, res) =>{
    try {
        
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}
const delPurchase = async (req, res) =>{
    try {
        
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}
const addToCard = async (req, res) =>{
    try {
        
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });
    }
}

export default { addPurchase, delPurchase, addToCard }