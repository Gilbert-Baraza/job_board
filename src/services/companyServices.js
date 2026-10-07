import {prisma} from '../config/db.js'


const createCompany = async (name,userId)=>{
    const company = await prisma.company.create({
        data:{
            name:name,
            userId: userId
        }
    });
    return company;
}

const getAllCompanies = async ()=>{
    const companies = await prisma.company.findMany({
        include:{
            jobs:{
                include:{
                    applications:{
                        select:{
                           user:{
                            select:{
                                name:true
                            }
                           } 
                        }
                    }
                }
            }
        }
    })
    return companies
}

const findCompanyByUserId = async (userId)=> {
    const company = await prisma.company.findUnique({
        where:{
            userId:userId
        }
    })
    return company
}
export {createCompany,getAllCompanies,findCompanyByUserId}