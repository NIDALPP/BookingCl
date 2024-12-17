import axios from 'axios'
import * as dotenv from "dotenv";

dotenv.config()
const dbUrl: any = process.env.DB_URL

interface obj {
    [key: string]: any;
}


class controllerService {
    constructor() {
        this.find = this.find.bind(this)
    }
    async find(model: string, filter: obj = {}) {
        try {

            const result = await axios.post(dbUrl + '/findAll', { model: model, filter: filter })
            return result?.data || null
        } catch (error: any) {
            console.error("Error in find:", error.message || error)
            throw new Error("Unable to retrieve data")
        }
    }
    async findOne(model: string, filter: obj) {
        try {
            const result = await axios.post(dbUrl + '/findOne', { model: model, filter: filter })
            return result?.data || null

        } catch (error: any) {
            console.error("Error in FindOne:", error.message || error)
            throw new Error("unable to retrieve data")


        }
    }
    async create(model: string, data: obj) {
        try {
            const result = await axios.post(dbUrl + '/create', { model: model, data: data })
            return result?.data || null

        } catch (error: any) {
            console.error("Error in creating :", error.message || error)
            throw new Error("unable to retrieve data")

        }
    }
    async deleteOne(model: string, filter: obj) {
        try {
            const result = await axios.post(dbUrl + '/deleteOne', { model: model, filter: filter })
            return result?.data || null
        } catch (error: any) {
            console.error("Error in deleteOne:", error.message || error)
            throw new Error("unable to retrieve data")

        }
    }
    async updateOne(model: string, filter: obj, data: obj) {
        try {
            const result = await axios.post(dbUrl + '/updateOne', { model: model, filter: filter, data: data })
            return result?.data || null
        } catch (error: any) {
            console.error("Error in updateOne:", error.message || error)
            throw new Error("Unable to retrieve data")

        }
    }
    async aggregate(model: string, query: obj) {
        try {
            const result = await axios.post(dbUrl + '/records', {
                model, query
            })
            console.log(result)
            return result?.data || null
        } catch (error: any) {
            console.error("Error in aggregate:", error.message || error)

        }
    }
}
export default controllerService;
