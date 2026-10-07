import { registerUser, getAllUsers, deleteUserById,findUserById, findUserByEmail} from '../services/userServices.js'
import bcrypt  from 'bcrypt'
import { application } from 'express'
import jwt from 'jsonwebtoken'

const getAllUsersController = async (req,res,next)=>{
    try {
        const users = await getAllUsers()
        const user = users.map(user=>{
            return {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                applications:user.applications
            }
        })
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error)
    } 
}

const findUserByIdController = async (req,res)=>{
    const id = req.user.id
    const user = await findUserById(id)
    if(!user){
        return res.status(401).json({
                success: false,
                message: 'User does not exist'
            });
    }

    res.status(200).json({
        userId:user.id,
        email:user.email
    })
}

const  registerUserController = async (req,res,next)=>{
    try {
        const {name,email,password,role} = req.body
        const existingUser = await findUserByEmail(email)
        if(existingUser){
           return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }
        const createdUser = await registerUser(name,email,password,role)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: createdUser
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message: "Failed to create user"
        });
        next(error)
    }  
}

const loginUser = async (req,res,next)=>{
    try {
        const {email,password} = req.body
    if(!email){
        return res.status(400).json({
            success:false,
            message: "Email field required"
        })
    }
    if(!password || password === ""){
        return res.status(400).json({
            success:false,
            message: "Password field required"
        })
    }
    const user = await findUserByEmail(email)
    if(!user){
        return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
    }
    const hasMatchedPassword = await bcrypt.compare(password,user.password)
        if(!hasMatchedPassword){
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const token = jwt.sign({
            id: user.id,
            email: user.id,
            role:user.role
        },
            process.env.JWT_SECRET,
        {
            expiresIn:"1h"
        })
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token
        });
    } catch (error) {
        next(error)
    }
    
}

const deleteUserByIdController = async (req,res)=>{
    const id = req.params.id
    //const id = req.user.id
    const user = await findUserById(id)
    if(!user){
        return res.status(401).json({
                success: false,
                message: `User ${id} does not exist`
            });
    }
    if(user.role === "admin"){
        return res.status(403).json({
                success: false,
                message: `Cannot delete admin`
            });
    }

    await deleteUserById(id)
    res.json({
        success:true,
        message:"User deleted successfully"
    })
}

export {getAllUsersController,registerUserController,loginUser,deleteUserByIdController,findUserByIdController}
