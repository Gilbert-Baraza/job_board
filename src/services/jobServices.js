import {prisma} from "../config/db.js";

//Fetch All jobs
const getAllJobs = async ( search, location, minSalary, maxSalary ) => {
  // 1. Build the dynamic WHERE clause object
  const where = {};


  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (location) {
    // Note: If you meant for location to be a partial match, use `contains` instead of `equals`
    where.location = { equals: location, mode: 'insensitive' }; 
  }

  if (minSalary !== undefined || maxSalary !== undefined) {
    where.salary = {};
    if (minSalary !== undefined) where.salary.gte = minSalary;
    if (maxSalary !== undefined) where.salary.lte = maxSalary;
  }
  // 2. Execute the Prisma query
  const jobs = await prisma.job.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      salary: true,
      createdAt: true, 
      company: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 3. Map the results to match the flat structure of your original raw SQL output
  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    salary: job.salary,
    created_at: job.created_at,
    company_name: job.company.name,
  }));
};

//Fetch job for specific company
const getJobsByCompanyId = async (companyId)=>{
    const jobs = await prisma.job.findMany({
        where:{
            companyId:companyId,
            
        }
    })
    return jobs
}

//Create job by authenticated user
const createJob = async (
    title,
    location,
    salary,
    description,
    companyId)=>{
    const job = await prisma.job.create({
        data:{
                title:title,
                location:location,
                salary:salary,
                description:description,
                companyId: companyId
        }
    })
    return job
}

const getJobById = async (id)=>{
    const job = await prisma.job.findUnique({
        where:{
            id:id,   
        },
        include:{
            company:true
            
        }
    })
    return job
}

//Update job 
const updateJob = async (jobId,title,location,salary,description)=>{
    const job = await prisma.job.update({
        where:{
            id:jobId
        },
        data:{
            title:title,
            location:location,
            description:description,
            salary:salary
        }
    })

    return job;
}

const deleteJob = async (id,companyId)=>{
    const job = await prisma.job.delete({
        where:{
            id:id,
            AND:[
                {companyId:companyId}
            ]
            
        }
    })
}


export {getAllJobs,createJob,getJobsByCompanyId,updateJob,deleteJob,getJobById}