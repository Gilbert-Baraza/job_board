import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg';
//prisma config
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({
    adapter
}); 

//psql config

import {Pool} from 'pg'

const pool = new Pool({
    // Keep the raw SQL pool on the same credentials used by Prisma.
    connectionString: process.env.DATABASE_URL,
});


export {prisma,pool}

