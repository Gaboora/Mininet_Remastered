const Topo = require('../models/topo.model');
const Device = require('../models/device.model');
const userModel = require('../models/user.model');
const getTopoById = async (req, res) => {
    const topo = await Topo.findById(req.params.id).populate("pcs").populate("sws").populate("laptops").populate("routers").populate("links").populate("controllers");
    res.json(topo);
}
const addTopology = async (req, res) => {
    const user = await userModel.findOne({ clerkId: req.body.clerkId }).populate("topologies");
    const newTopo = new Topo({ name: req.body.topoName });
    newTopo.members.push(user._id);
    newTopo.creator = user._id;
    console.log(newTopo);
    await newTopo.save();
    user.topologies.push(newTopo._id)
    await user.save();
    res.json(user.topologies)
}
        const updateTopo = async (req, res) => {
            console.log(req.params.id);
            console.log(req.body);
            const { id, remoteController, remoteControllerPort } = req.body
            await Topo.findByIdAndUpdate(id, { remoteController: remoteController });
            await Topo.findByIdAndUpdate(id, { remoteControllerPort: remoteControllerPort });
        }

module.exports = {
    getTopoById,
    addTopology,
    updateTopo
}   