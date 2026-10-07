import { application } from "express";
import  {applyJob,getMyApplications,getApplicationsForJob}  from "../services/applicationService.js";

const applyJobController = async(req,res,next)=>{
    try{
        const userId = req.user.id
    const jobId = +req.params.id
    const application = await applyJob(userId,jobId)
    res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    }catch(error){
        if(error.code === 'P2002'){
            return res.status(409).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }
        if (error.code === 'P2003') {
            return res.status(404).json({
                success: false,
                message: 'Job or user not found'
            });
        }
        next(error)
    }
}

const getMyApplicationsController = async(req,res,next)=>{
    try {
        const userId = req.user.id
        const result = await  getMyApplications(userId)
        console.log(result)
        res.status(200).json({
            success: true,
            count: result.length,
            data: result.map(application =>{
                return {
                    applicationId:application.id,
                    status: application.status,
                    jobId:application.jobId,
                    userId: application.userId,
                    jobTitle: application.job.title,
                    location:application.job.location,
                    salary:application.job.salary,
                    companyId:application.user.company.id,
                    companyId:application.user.company.name
                }
            })
            
        })
    } catch (error) {
        next(error)
    }
}

const getApplicationsForJobController = async (req,res,next)=>{
    try {
        const userId = req.user.id
        const jobId = +req.params.id
        const result = await getApplicationsForJob(jobId,userId)
        res.status(200).json({
            success: true,
            job: result.jobResult,
            count: result.applications.length,
            data: result.applications
        })
    } catch (error) {
        next(error)
    }

}

export {applyJobController,getMyApplicationsController,getApplicationsForJobController}