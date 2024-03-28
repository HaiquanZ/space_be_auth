const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');

//register user
exports.register = async (req, res, next) => {
    try{
        const{
            name,
            email,
            password
        } = req.body;

        const user = {
            name,
            email,
            password
        }

        //check if the user already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                status: 'fail',
                data: {
                    message: 'User already exists'
                }
            });
        }
        if(!isValidEmail(user.email)){
            return res.status(400).json({
                status: 'fail',
                data: {
                    message: 'Invalid email'
                }
            });
        }

        const userID = await userModel.createUser(user);

        res.status(200).json({
            status: 'success',
            data: {
                message: 'User created successfully! Login to continue.',
                userID: userID
            }
        });
    }catch (err){
        next(err);
    }
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email) {
    return emailRegex.test(email);
}

//login user
exports.login = async (req, res, next) => {
    try{
        const {
            email, password
        } = req.body;

        //check if email is not already exist
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                data: {
                    message: 'Email is not existing'
                }
            });
        }

        //compare password and hashedPassword
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'fail',
                data: {
                    message: 'Password is incorrect'
                }
            });
        }

        //jwt authentication
        const token = jwt.sign({
            user: user,
        }, JWT_SECRET);

        //login success
        res.status(200).json({
            status: 'success',
            data: {
                token,
                id: user.id,
                name: user.name,
                email: user.email,
                roleId: user.role_id
            }
        });
    }catch(err){
        next(err);
    }
}

//send mail
exports.sendOTP = async (req, res, next) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // Email content
    let mailOptions = {
        from: 'hqz.kim@gmail.com', 
        to: req.body.email, 
        subject: 'OTP forgot password', 
        text: 'This is a test email sent from Node.js using nodemailer.'
        // html: '<b>Hello world?</b>'
    };

    // Sending the email
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error('err: ',error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//get Information user by Id
exports.getUserById = async (req, res, next) => {
    try{
        const user = await userModel.getUserById(req.params.id);
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                data: {
                    message: 'User is not existing'
                }
            });
        }
        delete user.password;
        delete user.token;
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    }catch(err){
        next(err);
    }
}

//update profile
exports.updateUser = async (req, res, next) => {
   try{
        const data = req.body;
        data.id = req.user.id;
        await userModel.updateUser(req.body);
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Update information successfully!'
            }
        });
   }catch(err){
    next(err); 
   } 
}