import { title } from "process"
import {prisma} from "../config/db.js"
import {findCompanyByUserId} from './companyServices.js'

const applyJob = async(userId,jobId)=>{
    const result = await prisma.application.create({
        data:{
            jobId:jobId,
            userId:userId
        }
    })
    return result
}
`"application_id": 12,
      "status": "pending",
      "applied_at": "2026-10-02T08:00:00.000Z",
      "job_id": 5,
      "job_title": "Junior Backend Developer",
      "location": "Nairobi",
      "salary": "45000.00",
      "company_id": 2,
      "company_name": "Example Technologies"`
      
const getMyApplications = async(userId)=>{
    const applications = prisma.application.findMany({
        where:{
            userId:userId
        },
        include:{
            job:true,
            user:{
                select:{
                    company:true
                }
            }
        }
    })

    return applications
} 

const getApplicationsForJob = async (jobId,userId) => {
    // Confirm that this job belongs to the authenticated user.
    const company = await findCompanyByUserId(userId)
    const jobResult = await prisma.job.findMany({
        where:{
            AND:[
                {id:jobId},
                {companyId:company.id}
            ]
        }
    });

    const applications = await prisma.application.findMany({
        where:{
            jobId:jobId
        }
    });
    console.log(applications)
    return {
        jobResult,
        applications
    };
}

export {applyJob,getMyApplications,getApplicationsForJob}
