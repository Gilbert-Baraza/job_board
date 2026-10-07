import express from 'express'
import 'dotenv/config'
import {errorHandler} from './middlewares/errorHandler.js'
import jobsRouters from './routes/jobRoutes.js'
import companyRoutes from  './routes/companyRoutes.js'
import userRoutes from './routes/userRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
const app = express();

app.use(helmet())
app.use(cors())
app.use(express.json({
    limit:'10kb'
}))

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100
})


app.use(apiLimiter)
app.use('/jobs',jobsRouters)
app.use('/companies',companyRoutes)
app.use('/users',userRoutes)
app.use('/applications',applicationRoutes)

app.use(errorHandler)

export  default app