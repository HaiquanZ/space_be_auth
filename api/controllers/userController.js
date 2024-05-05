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
        delete user.password;
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
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // Email content
    let OTP = await userModel.genOTP(req.body.email);

    let htmlContent = `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Space</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing Space. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
            <p style="font-size:0.9em;">Regards,<br />Space</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Space Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
            </div>
        </div>
    </div>
    `
    
    let mailOptions = {
        from: process.env.EMAIL_NAME, 
        to: req.body.email, 
        subject: 'OTP forgot password - Space', 
        // text: 'This is a test email sent from Node.js using nodemailer.',
        html: htmlContent
    };

    // Sending the email
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error('err: ',error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    return res.status(200).json({
        status: 'ok'
    })
}

//confirm OTP
exports.confirmOTP = async (req, res, next) => {
    try{
        const trueOTP = await userModel.confirmOTP(req.body.email);
        // console.log(trueOTP.token);
        if(req.body.otp === trueOTP.token){
            await userModel.setNewPassword(
                {password: req.body.password, email: req.body.email}
            )

            return res.status(200).json({
                status: 'success',
                data: {
                    message: 'Password changed, login to continue.'
                }
            })
        }else{
            return res.status(403).json({
                status: 'fail',
                data: {
                    message: "Invalid OTP token"
                }
            })
        }
    }catch(err){
        next(err);
    }
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

//search User
exports.searchUser = async (req, res, next) => {
    try{
        const result = await userModel.searchUser(req.query.keyword);

        return res.status(200).json({
            status: 'success',
            data:{
                users: result
            }
        })
    }catch(err){
        next(err);
    }
}