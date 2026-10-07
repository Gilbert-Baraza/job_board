import { acceptApplication } from "../services/hiringService.js";

const acceptApplicationController = async (req,res,next)=>{
    try {
        const applicationId = Number(req.params.id);
        if(!Number.isInteger(applicationId) || applicationId < 1){
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID'
            });
        }
        const result = await acceptApplication(applicationId,req.user.id);
    } catch (error) {
        if(error.status === 404){
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error)
    }
};


export   {acceptApplicationController}