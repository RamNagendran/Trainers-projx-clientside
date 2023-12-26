import { notification } from "antd";
import axios from "axios";
import moment from "moment";
import { base_url } from "../config";

interface AddTaskDetails {
    taskCredentials: any;
    userDetails: any;
    authToken: string;
}

interface IScheduleTask {
    batchId: string;
    taskId: string;
    taskName: string;
    authToken: string;
}


// ------------------------------Task crud functions-------------------------------------------------------

export const addNewTask = async (props: AddTaskDetails) => {
    const { taskCredentials, userDetails, authToken } = props;
    let newTaskCred = {
        ...taskCredentials,
        createdBy_updatedBy: userDetails?.user_name,
        createdAt_updatedAt: moment().format("YYYY-MM-DD HH:mm")
    }
    try {
        const result = await axios.post(`${base_url}/addNew-task`, newTaskCred, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        });
        if (result) {
            notification.success({
                message: "Task added successfully!!"
            })
            return result;
        }
    } catch (error: any) {
        notification.error({
            message: error?.message,
        })
        return null;
    }
}


export async function getAllTasks(props: any) {
    const { offset, maxResults, authToken, selectedCourse_id } = props;
    try {
        const result = await axios.get(`${base_url}/view-tasks/${selectedCourse_id}?offset=${offset}&maxResults=${maxResults}`, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        })
        if (result.data) {
            return result.data;
        }
    } catch (error: any) {
        notification.error({
            message: error?.message,
        })
        return null;
    }
}


export function editTasks(props: any) {
    const { selectedTask_id, taskCredentials, authToken} = props;
    return new Promise(async(resolve, reject) => {
        try {
            const result = await axios.put(`${base_url}/edit-task/${selectedTask_id}`, taskCredentials, {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            })
            if (result) {
                resolve(result);
            }
        } catch (error: any) {
            reject(error);
        }
    })
}

export function deleteTask(props:any) {
    const {selectedTask_id, authToken} = props;
    return new Promise(async(resolve, reject) => {
        try {
            const result = await axios.delete(`${base_url}/delete-task/${selectedTask_id}`, {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            })
            if (result) {
                resolve(result);
            }
        } catch (error) {
            reject(error);
        }
    })
}

// ------------- schedule tasks --------------------------------

export function scheduleTask(props: IScheduleTask) {
    const { taskId, taskName, batchId, authToken } = props;

    return new Promise(async (resolve, reject) => {
        try {
            const payload = {
                task: {
                    taskId: taskId,
                    taskName: taskName,
                    dateTime: new Date()
                },
                batchId
            }
            const result = await axios.post(`${base_url}/scheduleTask`, payload, {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            })
            if (result) {
                resolve(result);
            }
        } catch (err) {
            reject(err)
        }
    })
}
