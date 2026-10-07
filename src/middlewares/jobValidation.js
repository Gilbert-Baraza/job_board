import {body,validationResult} from 'express-validator'

const createJobValidation = [
    body('title').trim().notEmpty().withMessage('Job title is required'),
    body('description').trim().notEmpty().withMessage('Job description is required'),
    body('location').optional().trim(),
    body('salary').optional().isFloat({min:0}).withMessage('Salary must be a positive number'),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                errors: errors.array()
            });
        };
        next()
    }
]

export {createJobValidation};