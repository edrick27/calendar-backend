/*
    Rutas de los eventos
    host + /api/events
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const { check } = require('express-validator');
const { filedValidator } = require('../middlewares/validate-fields');
const { isDate } = require('../helpers/isDate');

const router = Router();

router.use(validateJWT);


router.get(
    '/',  
    getEvents
);

router.post(
    '/create',  
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start is requiered').custom(isDate),
        filedValidator
    ],
    createEvent
);

router.put('/:id', updateEvent);

router.delete('/:id',deleteEvent);

module.exports = router;