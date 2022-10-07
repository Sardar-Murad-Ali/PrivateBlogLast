import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'
import fileUpload from "express-fileupload"

import connectDB from './db/connect.js'
import Auth from "./routes/AuthRoute.js"
import Blogs from "./routes/BlogRoute.js"
import Authenticate from "./middleware/auth.js"
import Comments from "./routes/CommentRoute.js"
import Chats from "./routes/ChatRoute.js"
import cors from "cors"
import ChatMessages from "./routes/ChatMessageRoute.js"
import { Server } from 'socket.io'
import socketServer from  "./socketServer.js"


import http from 'http'
let server=http.createServer(app)
app.use(cors())

import helmet from 'helmet'

import mongoSanitize from "express-mongo-sanitize"

import xssclean from "xss-clean"


import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'



// import Posts from "./routes/PostRoute.js"
// const cloudinary = require('cloudinary').v2

import cloudinary from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});





import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'
// import Auth from "../routes/AuthRoute.js"


if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(fileUpload({ useTempFiles: true }));


const __dirname = dirname(fileURLToPath(import.meta.url))
// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')))


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socketServer(io)

app.use(xssclean())
app.use(mongoSanitize())

app.use(
  [
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'https://*.stripe.com', 'https://res.cloudinary.com'],
      baseUri: ["'self'"],
      'script-src': ["'self'", ],
      'connect-src': ["'self'", ],
      'frame-ancestors': ["'self'",],
      'script-src': ["'self'", ],
    },
  })
  ]
)


app.use("/api/v1/auth",Auth)
app.use("/api/v1/blogs",Authenticate,Blogs)
app.use("/api/v1/blogs/comments",Authenticate,Comments)
app.use("/api/v1/chat",Authenticate,Chats)
app.use("/api/v1/chatMessages",Authenticate,ChatMessages)
// app.use("/api/v1/post",Posts)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
