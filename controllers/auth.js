const { response } = require('express');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');

const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        let user = await UserModel.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                message: 'User already exists'
            });
        }

        user = new UserModel(req.body);

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();
        const token = await generateJWT(user.id, user.name);



        res.status(201).json({
            ok: true,
            message: 'Register new User',
            token,
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Por favor hable con el administrador'
        });
    }
}

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'User not found'
            });
        }

        // Confirm password
        const validPassword = bcrypt.compareSync(password, user.password);
        
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Password incorrect',
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id, user.name);


        res.json({
            ok: true,
            message: 'Login',
            uid: user.id,
            name: user.name,
            token,
        });

    } catch (error) {

        console.log(error);
        

        res.status(500).json({
            ok: false,
            message: 'Por favor hable con el administrador'
        });        
    }
}


const renewToken = async (req, res = response) => {

    const { uid, name } = req;

    const token = await generateJWT(uid, name);

    res.json({
        message: 'renew token',
        token,
    });
}



module.exports = {
    createUser,
    loginUser,
    renewToken,
}