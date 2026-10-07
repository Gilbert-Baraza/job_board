import {prisma} from '../config/db.js'
import bcrypt from 'bcrypt'

const findUserByEmail = async (email)=>{
    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    })

    return user
}

const registerUser = async (name,email,password,role)=>{
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await prisma.user.create({
        data:{
            name: name,
            email:email,
            role:role,
            password:hashedPassword
        }
    }) 

    return {
        id: user.id,
        name: user.name,
        email: user.email
    }
}

const getAllUsers = async ()=>{
    const users = prisma.user.findMany({
        include:{
            applications:true
        }
    })
    return users
}

const findUserById = async (id)=>{
    return  await prisma.user.findUnique({
        where:{
            id:id
        }
    })
}
const deleteUserById= async (id)=>{
    const user =  await  prisma.user.delete({
        where:{
            id:id
        }
    })
    console.log(user)
    return user
}



export { registerUser,getAllUsers,deleteUserById,findUserByEmail,findUserById }