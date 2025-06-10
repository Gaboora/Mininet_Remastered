const Device = require('../models/device.model');
const httpStatusText = require('../utils/httpStatusText');
const Topo = require('../models/topo.model');
const Link = require('../models/link.model');
const getAllDevice = async (req, res) => {
    const devices = await Device.findById(req.params.id);
    // console.log(devices);
    res.json(devices);
}
const addDevice = async (req, res) => {
    if (!req.body.name) {
        res.json("The device should has a host name")
    } else {
        const newDevice = new Device(req.body);
        // const existingDevices = await Device.find({ name: req.body.name })
        const existingDevices = await Device.find({ name: req.body.name, topoId: req.body.topoId })
        if (existingDevices.length == 0) {
            await newDevice.save();

            const topo = await Topo.findById(req.body.topoId);
            if (newDevice.type == "pc") {
                topo.pcs.push(newDevice._id);
            }
            else if (newDevice.type == "sw") {
                topo.sws.push(newDevice._id);
            }
            else if (newDevice.type == "ro") {
                topo.routers.push(newDevice._id);
            }
            else if (newDevice.type == "co") {
                topo.controllers.push(newDevice._id);
            }
            else if (newDevice.type == "la") {
                topo.laptops.push(newDevice._id);
            }
            await topo.save();
        } else {
            res.json({ msg: "Host name is taken" })
        }

    }
}
const removeDevice = async (req, res) => {
    const deviceId = req.params.id

    const device = await Device.findById(deviceId);
    console.log(device);
    await Device.deleteOne({ _id: deviceId })
    await Topo.updateOne(
        { _id: device.topoId },
        { $pull: { links: { from: device?.name } } }
    );
    await Topo.updateOne(
        { _id: device.topoId },
        { $pull: { links: { to: device?.name } } }
    );
    res.json({ msg: "Device is removed" })
}
const updateDevice = async (req, res) => {
    const deviceId = req.body.id;
    console.log(req.body);
    const newPosition = req.body.position;
    const newIp = req.body.ipAddress;
    const newIpGateWay = req.body.defaultGateWay;
    if (newPosition) {
        await Device.findByIdAndUpdate(deviceId, { position: newPosition });
    } else if (newIp && !newIpGateWay) {
        await Device.findByIdAndUpdate(deviceId, { ipAddress: newIp });
    } else if (newIpGateWay && newIp) {
        console.log("test");
        await Device.findByIdAndUpdate(deviceId, { ipAddress: newIp, defaultGateWay: newIpGateWay });
    } else if (newIpGateWay && !newIp) {
        console.log("test");
        await Device.findByIdAndUpdate(deviceId, { defaultGateWay: newIpGateWay });
    }
    res.json({ msg: "Device is removed" })
}
module.exports = {
    getAllDevice,
    addDevice,
    removeDevice,
    updateDevice
}