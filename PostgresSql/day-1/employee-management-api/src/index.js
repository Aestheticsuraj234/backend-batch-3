import express from "express";
import dotenv from "dotenv";
import { Pool } from "pg";


dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'comapny_db',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

pool.connect((err , client , release)=>{
    if(err){
        console.log(`❌ Error connecting to the database:` , err.stack)
    }
    else{
        console.log('✅ Connected to PostgreSQL database');
        release()
    }
})


app.get("/api/employees" , async (req , res)=>{
    try {
        const result = await pool.query(
            'SELECT * FROM employees ORDER BY emp_id ASC'
        )

        console.log(result)

        res.json({
            succcess:true,
            data:result.rows,
            count:result.rowCount
            
        })
    } catch (error) {
         console.error('Error fetching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employees',
            error: error.message
        });
    }
})

app.listen(process.env.PORT , ()=>{
    console.log("Server is running on http://localhost:8080")
})