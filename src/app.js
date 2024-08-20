import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app=express()

/* cors allows client web applications to interact with resources
   from different domains */


/*  *which is useful for applications that use third-party APIs and resources.
    *  For example, an application might use CORS to pull videos from a video
    *  platform API, use fonts from a public font library, or display weather 
    * data from a national weather database. */

/*   *Express.js is a popular and minimalist web application framework for Node.js.
     *  It simplifies the process of building web applications and APIs by providing
     *  a set of robust features and utilities. */

/**Here's what Express.js does: **/
//1.Handles HTTP requests and responses:
//2.Routing 
//3.Middleware
//4.templating engine
//5.static file srving

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes 

import userRouter from './routes/user.routes.js'

//routes declaration


app.use("/api/v1/users",userRouter)


//http://localhost:8000/api/v1/users/register


export {app}