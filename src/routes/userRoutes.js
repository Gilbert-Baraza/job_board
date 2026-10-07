import express from 'express'
import {registerUserController,deleteUserByIdController,loginUser,getAllUsersController,findUserByIdController} from '../controllers/userControllers.js'
import {getJobsByCompanyIdController,updateJobController} from '../controllers/jobControllers.js'
import authenticate from '../middlewares/auth.js'
import authorize from '../middlewares/authorize.js'
import rateLimit from 'express-rate-limit'
//import { loginLimiter } from '../server.js'
const route = express.Router()

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    message: {
        success: false,
        message: 'Too many login attempts, please try again later'
    }
})
route.get('/',getAllUsersController)
route.get('/',authenticate,findUserByIdController)
route.put('/jobs/:id',authenticate,updateJobController)
route.get('/jobs',authenticate,getJobsByCompanyIdController)


route.post('/register',registerUserController)
route.post('/login',loginLimiter,loginUser)
route.delete('/:id',authenticate,authorize('admin'),deleteUserByIdController)

export default route