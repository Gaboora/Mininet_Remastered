const mongoose = require('mongoose');
const Topo = require('../models/topo.model')
const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    position: {
        type: Object,
    },
    type: String,
    topoId: {
        type: String
    },
    ipAddress: {
        type: String
    },
    defaultGateWay: {
        type: String
    },
})

deviceSchema.pre('deleteOne', async function (next) {
    const deviceId = this.getQuery()["_id"];
    // Find all Topo documents containing the PC ID in their 'pcs' array
    const topologies = await Topo.find({ $or: [{ "pcs": deviceId }, { "sws": deviceId }, { "routers": deviceId }, {"laptops":deviceId}, { "controllers": deviceId }] });
    // Update each Topo document to remove the PC ID from the 'pcs' array
    for (const topo of topologies) {
        if (topo.pcs.includes(deviceId)) {
            topo.pcs.pull(deviceId);
        }
        if (topo.sws.includes(deviceId)) {
            topo.sws.pull(deviceId);
        }
        if (topo.routers.includes(deviceId)) {
            topo.routers.pull(deviceId);
        }
        if (topo.controllers.includes(deviceId)) {
            topo.controllers.pull(deviceId);
        }
        if (topo.laptops.includes(deviceId)) {
            topo.laptops.pull(deviceId);
        }
        await topo.save();
    }
    next();
});
module.exports = mongoose.model('Device', deviceSchema);