import express from 'express'
import {acceptApplicationController} from '../controllers/hiringController.js'
import authenticate from '../middlewares/auth.js'
import { getMyApplicationsController } from '../controllers/applicationController.js'
import authorize from '../middlewares/authorize.js'
const route = express.Router()

route.get('/me',authenticate,getMyApplicationsController)
route.patch('/:id/accept',authenticate,authorize('company'),acceptApplicationController)
export default route