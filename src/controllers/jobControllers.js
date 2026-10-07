import { 
    getAllJobs,
    createJob,
    getJobsByCompanyId, 
    updateJob,
    deleteJob,
    getJobById
    } 
    from '../services/jobServices.js'
import {findCompanyByUserId} from '../services/companyServices.js'


//Fetch All jobs
const getJobsController= async (req,res,next)=>{
    try{
        const {search,location,minSalary,maxSalary} = req.query
        let jobs = await getAllJobs(search, location, minSalary, maxSalary)

        res.status(200).json({
            success:true,
            data:jobs
        })
        
    }catch(error){
        next(error)
    }
}

const getJobByIdController = async (req,res,next)=>{
    try {
        const id = +req.params.id
        const job = await getJobById(id)
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        res.status(200).json({
            success:true,
            data:job
        })
    } catch (error) {
        next(error)
    }
}

//Fetch jobs for specific company
const getJobsByCompanyIdController = async (req,res,next)=>{
    try{
        const userId = req.user.id
        const company = await findCompanyByUserId(userId) 
        if(!company){
            return res.status(404).json({
                success:true,
                message:`You do not have a company`
            })
        }
        const jobs = await getJobsByCompanyId(company.id)
        if(!jobs){
            return  res.status(404).json({
                success:true,
                message:`You have not posted any job`,
                data:jobs
            })
        }
        res.status(200).json({
            success:true,
            data:jobs
        })
    }catch(error){
        next(error)
    }
}

//create job
const createJobController = async (req,res,next)=>{
    try {
        const {title, location, salary,description} = req.body
        
        const userId = req.user.id
        const company = await findCompanyByUserId(userId)
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'You do not have a company'
            });
        }
        const job = await createJob(title, location, salary,description,company.id)
        res.status(201).json({
            success:true,
            message: 'Job created successfully',
            data:job
    })
    } catch (error) {
        next(error)
    } 
}

//update job
const updateJobController = async(req,res,next)=>{
    try {
        const {title,location,salary,description} = req.body
        const jobId = +req.params.id
        const userId = req.user.id
        const company = await findCompanyByUserId(userId) 
        const jobs = await getJobsByCompanyId(company.id)
       if(!jobs){
            return res.status(404).json({
                success:false,
                message:"You don't have any job"
            })
        }
        const job = jobs.find(job => job.id === jobId)
         
        if(!job){
            return res.status(404).json({
                success:false,
                message:"Job doesn't exist"
            })
        }
        const updatedJob = await updateJob(job.id,title,location,salary,description)
        res.status(200).json({
            success:true,
            message:"Job updated successfully",
            data:updatedJob
        })
        


    } catch (error) {
        next(error)
    }
}
 
const deleteJobController = async (req,res,next)=>{
    try {
        const jobId = +req.params.id
        const userId = req.user.id
        const company = await findCompanyByUserId(userId) 
        await deleteJob(jobId,company.id)
        res.status(200).json({
            success:true,
            message:"Job deleted successfully",
            
        })
    } catch (error) {
        next(error)
    }
}

export {
    getJobsController,
    createJobController,
    getJobsByCompanyIdController,
    updateJobController,
    deleteJobController,
    getJobByIdController
    
}
