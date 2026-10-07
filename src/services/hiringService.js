import {pool} from '../config/db.js'
import { randomUUID } from 'node:crypto'


const acceptApplication = async (applicationId,userId)=>{
    const client = await pool.connect();
    try{
      await client.query('BEGIN');
      
      const updateResult = await client.query(
        `UPDATE "Application" AS a
            SET status = 'accepted'
            FROM "Job" AS j
            JOIN "Company" AS c
               ON c.id = j."companyId"
            WHERE a.id = $1
               AND a."jobId" = j.id
              AND c."userId" = $2
               AND a.status IN (
                   'pending',
                   'reviewing',
                   'shortlisted'
               )
             RETURNING a.id`,
        [applicationId, 'ec6727c1-6505-40e8-a575-f1ce66d6cda5']
      );
      console.log(updateResult)
        if (updateResult.rows.length === 0) {
            const error = new Error(
                'Application not found, not owned, or not eligible for acceptance'
            );
            error.status = 404;
            throw error;
        } 
        
        const hiringResult = await client.query(
            `INSERT INTO "HiringRecord" (id, application_id)
             VALUES ($1, $2)
             RETURNING *`,
            [randomUUID(), applicationId]
        );

        await client.query('COMMIT');

        return {
            applicationId,
            hiringRecord: hiringResult.rows[0]
        };
      
    }catch(error){
        await client.query('ROLLBACK');
        throw error;
        

    }finally{
        client.release();
    }
}


export {acceptApplication}
