const Link = require('../models/link.model');
const Topo = require('../models/topo.model');
const addLink = async (req, res) => {
    const newLink = new Link(req.body);
    console.log(req.body);
    await newLink.save();
    const topo = await Topo.findById(req.body.topoId);
    topo.links.push({ from: newLink.link.from, to: newLink.link.to });
    await topo.save();
    res.json("link is created successfully")
}
module.exports = {
  addLink,
}