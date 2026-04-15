import axios from "axios"
const apiBAseUrl = import.meta.env.VITE_API_URL

const API = axios.create({

    baseURL: apiBAseUrl

})

API.interceptors.request.use(async (req) => {

    const token = localStorage.getItem("token")

    if (token) {

        req.headers.Authorization = token

    }

    return req

})

export default API