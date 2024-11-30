
const EventModel = require('../models/EventModel');

const getEvents = async (req, res) => {

    const events = await EventModel.find()
                                   .populate('user', 'name');
    res.json({
        ok: true,
        events
    });
}

const createEvent = async (req, res) => {

    const event = new EventModel(req.body);
    
    try {

        event.user = req.uid;
        const newEvent = await event.save();

        res.status(201).json({
            ok: true,
            newEvent
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: 'Please contact the administrator'
        });
    }
}

const updateEvent = async (req, res) => {

    const eventId = req.params.id;

    try {

        const event = await EventModel.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                message: 'Event not found'
            });
        }

        if (event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                message: 'You do not have the necessary permissions'
            });
        }

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const updatedEvent = await EventModel.findByIdAndUpdate(eventId, newEvent, { new: true });

        res.json({
            ok: true,
            updatedEvent
        });
        
    } catch (error) {

        res.status(500).json({
            ok: false,
            message: 'Please contact the administrator'
        });
    }
}

const deleteEvent = async (req, res) => {

    const eventId = req.params.id;

    try {

        const event = await EventModel.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                message: 'Event not found'
            });
        }

        if (event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                message: 'You do not have the necessary permissions'
            });
        }

        await EventModel.findByIdAndDelete(eventId);

        res.json({ ok: true });
        
    } catch (error) {

        console.log(error);
        

        res.status(500).json({
            ok: false,
            message: 'Please contact the administrator'
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
}
