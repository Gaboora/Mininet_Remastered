const { response } = require("express")
const userModel = require("../models/user.model")


const addUser = async (req, res) => {
    const existingUser = await userModel.findOne({clerkId:req.body.clerkId}).populate("topologies")
    if(existingUser) {
        res.json(existingUser.topologies)
        return null
    }
    const newUser = new userModel(req.body);
    await newUser.save();
}
module.exports = {
   
    addUser,
};