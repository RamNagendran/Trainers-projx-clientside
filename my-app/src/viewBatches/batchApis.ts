import { notification } from "antd";
import axios from "axios";
import { base_url } from "../config";
import { sortByDataTime } from "../common/helper functions/sortDateTime";

interface IStatusDetails {
    batchId: string;
    status: string;
    authToken: string;
}

export async function addNewBatch(props: any) {
    const { authToken, finalObj } = props;
    try {
        const result = await axios.post(`${base_url}/addNew-batch`, finalObj, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        })
        if (result.data) {
            notification.success({
                message: "New batch added successfully!!"
            })
            return result.data;
        }
    } catch (error: any) {
        notification.error({
            message: error?.message,
        })
        return null;
    }
}

export async function getBatches(props: any) {
    const { dispatch, authToken, userId } = props;
    try {
        const response = await axios.get(`${base_url}/userId/${userId}/getBatches`, 
        {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        }
        );
        if (response.data) {
            response.data.sort(sortByDataTime)
            dispatch({
                type: 'ALL_BATCH_DATA',
                data: response.data
            })
        }
    } catch (e: any) {
        notification.error({
            message: e.message
        })
    }
}

export async function editBatch (props:any) {

    const {authToken, editBatchDetails, setShowModalFor, modalInitials, dispatch, userEmailId} = props;

    try {
        const result: any = await axios.put(`${base_url}/edit-batch`, editBatchDetails, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        })
        if (result?.status === 200) {
            notification.success({
                message: result?.data?.message
            })
            setShowModalFor(modalInitials);
            getBatches({ dispatch, authToken, userId: userEmailId })
        }
    } catch (err: any) {
        notification.error({
            message: err.message
        })
    }
}

export function changeBthStatus (props:IStatusDetails) {
    const {authToken, status, batchId} = props
    return new Promise(async(resolve, reject) => {
        const data = {
            batchId,
            status
        }
        try {
            const result:any = await axios.put(`${base_url}/batch/change-status`, data, {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            })
            if (result.data) {
                resolve(result.data)
            }
        } catch (err:any) {
            notification.error({
                message: err.message
            })
        }
    })
}

export async function deleteBatch (props:any) {

    const {showModalFor, authToken, setShowModalFor, modalInitials, dispatch, userEmailId } = props;

    try {
        const batchId = showModalFor.selectedBatchforDelete.batchUniqueId
        const result = await axios.delete(`${base_url}/delete-batch/?batchId=${batchId}`, {
            headers: {
                authorizations: `Bearer ${authToken}`
            }
        })
        if (result?.status === 200) {
            notification.success({
                message: "Batch deleted successfully!!"
            })
        }
        setShowModalFor(modalInitials);
        getBatches({ dispatch, authToken, userId: userEmailId })
    } catch (err:any) {
        notification.error({
            message: err?.message
        })
    }
}