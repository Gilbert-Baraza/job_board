import {body, validationResult} from 'express-validator'

const registerUserValidation = [
    body('name').trim().notEmpty().withMessage("Name is required"),
    body('email').notEmpty().isEmail().withMessage("Valid email is required"),
    (req,res,next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        };
        next()
    }
]

export {registerUserValidation}