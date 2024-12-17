import express, { Request, Response,NextFunction,Express } from 'express'
import morgan from 'morgan';
import * as dotenv from "dotenv";
import http from 'http'
import bookingRouter from './router/bookingRouter';
import { errorHandler } from './helpers/errorHandle';

dotenv.config()


// const app: Application = express();
// app.use(morgan('dev'))
// app.use(express.json())
// const router=express.Router()
// bookingRouter(router)

// app.use('/booking',router)
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//     res.status(err.status || 500).send({
//         error: {
//             status: err.status || 500,
//             message: err.message,
//         },
//     });
// });
// const port: any = process.env.PORT
// console.log('hello world')
// const server=http.createServer(app)

// server.listen(port, () => {

//     console.log(`connected successfully http://localhost:3002/ ,on the port ${port}`)
// })

class Application {
    #port:number|string
    #app:Express
    constructor(port:number|string){
        this.#port=port
        this.#app=express()
        this.#mountMiddlewares()
        this.#mountRouters()
        this.#mountErrorHandling()
    }
    #mountMiddlewares(){
        this.#app.use(morgan("dev"))
        this.#app.use(express.json())

    }
    #mountRouters(){
        const router=express.Router()
        bookingRouter(router)
        this.#app.use('/booking',router)
    }
    #mountErrorHandling(){
        this.#app.use(errorHandler)}


    init():void{
        this.#app.listen(this.#port,()=>console.log(`connected successfully http://localhost:3002/ ,on the port ${this.#port}`))
    }
}

const app = new Application(process.env.PORT||3002)
app.init()