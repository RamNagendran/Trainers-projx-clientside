import axios from "axios"
import { base_url } from "../config"
import { notification } from "antd";

export function getUsers (authToken:string) {

    return new Promise (async(resolve, reject) => {
        try {
            const response = await axios.get(`${base_url}/getAll-users`, {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            })
            if (response?.data) {
                resolve(response.data)
            }
        } catch (err: any) {
            notification.error({
                message: err?.message
            })
        }
    })
}

export async function getuserBatches (props:any) {
    const {emailId, authToken} = props;
    return new Promise (async(resolve, reject) => {
        try {
            const response = await axios.get(`${base_url}/selectedUser/batches/${emailId}`, {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            })
            if (response?.data) {
                resolve(response.data)
            }
        } catch (err:any) {
            notification.error({
                message: err?.message
            })
        }
    }) 
}

export async function getAllTasks (authToken:string) {
    return new Promise<any>(async(resolve, reject) => {
        try {
            const response = await axios.get(`${base_url}/getAll-tasks`, {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            })
            if (response?.data) {

                resolve(response.data);
            }
        } catch (err:any) {
            notification.error({
                message: err.message
            })
        }
    })
} 