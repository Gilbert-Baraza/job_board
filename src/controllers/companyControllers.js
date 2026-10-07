import {createCompany,getAllCompanies,findCompanyByUserId} from '../services/companyServices.js'


const createCompanyController = async (req,res,next)=>{
    try {
        const {name} = req.body
        const userId = req.user.id
        const company = await createCompany(name,userId)
        res.status(200).json({
            success:true,
            data:company
    })
    } catch (error) {
        next(error)
    }
    
}

const getAllCompaniesController = async (req,res,next)=>{
    try {
        const companies = await getAllCompanies()
        if(companies.length === 0){
            return  res.status(404).json({
                success:true,
                companies
            })
        }
            res.status(200).json({
                success:true,
                companies
            })

    } catch (error) {
        next(error)
    }
}

const findCompanyByUserIdController =  async(req,res)=>{
    try {
        const userId = +req.params.id
    const company = await findCompanyByUserId(userId)
    res.status(200).json({
        success:true,
        company
    })
    } catch (error) {
        next(error)
    }
    
}



export {createCompanyController,getAllCompaniesController,findCompanyByUserIdController}