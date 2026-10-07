import express from 'express'
import {createJobController,getJobsController,deleteJobController,getJobByIdController,getJobsByCompanyIdController} from '../controllers/jobControllers.js'
import authenticate from '../middlewares/auth.js'
import { createJobValidation } from '../middlewares/jobValidation.js'
import { applyJobController,getApplicationsForJobController} from '../controllers/applicationController.js'
import authorize from '../middlewares/authorize.js'
const route = express.Router()

route.get('/',getJobsController)
route.get('/me/:id',getJobByIdController)
route.get('/me',authenticate,getJobsByCompanyIdController)
route.get('/:id/applications',authenticate,getApplicationsForJobController)

route.post('/:id/apply',authenticate,authorize('user'),applyJobController);
route.post('/',authenticate,createJobValidation,createJobController)

route.delete('/:id',authenticate,deleteJobController)




export default route