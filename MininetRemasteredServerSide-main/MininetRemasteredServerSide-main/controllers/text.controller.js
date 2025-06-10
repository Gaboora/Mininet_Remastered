const Text = require('../models/text.model')
const Topo = require('../models/topo.model')
const addText = async (req, res) => {
    const newText = new Text(req.body);
    await newText.save();
    const topo = await Topo.findById(req.body.topoId);
    topo.text.push(newText._id);
    await topo.save();
}

module.exports = {
    addText,
    
}