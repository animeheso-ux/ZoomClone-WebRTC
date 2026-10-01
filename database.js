import express from "express"
import pg from "pg"

import "dotenv/config"



const { Pool } = pg
const DatabaseRouter = express.Router()



export const mydb = new Pool({

    user: "postgres",
    host: "localhost",
    database: "zoomify",
    password: process.env.DB_PASSWORD,
    port: 5432
})









export default DatabaseRouter