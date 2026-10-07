import express from 'express'
import {createCompanyController,getAllCompaniesController,findCompanyByUserIdController} from '../controllers/companyControllers.js'
import authenticate from '../middlewares/auth.js'
const route = express.Router()

route.get('/',getAllCompaniesController)
route.get('/:id',findCompanyByUserIdController)
route.post('/',authenticate,createCompanyController)

export default route