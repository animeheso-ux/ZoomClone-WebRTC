import express from "express"
import http from "http"
import path from "path"
import {exec} from "node:child_process"

import { fileURLToPath } from "node:url"


import DatabaseRouter from "./database.js"
import TokenRouter from "./token.js"
import LoginRouter from "./Login.js"
import MeetingRouter from "./MeetingHandler.js"
import websocketSetup from "./websocket.js"



const app = express()
const PORT = 3000

const server = http.createServer(app)


websocketSetup(server)


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)



app.use(express.json())
app.use(express.static(path.join(dirname,"myapp/dist")))


app.use(DatabaseRouter)
app.use(TokenRouter)
app.use(LoginRouter)
app.use(MeetingRouter)




app.get("/{*path}",(req,res)=> {
    res.sendFile(path.join(dirname,"myapp/dist","index.html"))
})



exec("cd myapp && npm run build",(err)=> {
    if (err) {
        throw err
    }

    console.log("react successfully built")
})





server.listen(PORT,() => console.log(`connected to http://localhost:${PORT}`),exec(`start http://localhost:${PORT}`))