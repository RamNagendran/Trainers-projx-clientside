import { notification } from "antd";
import axios from "axios";
import moment from "moment";
import { base_url } from "../config";
import { sortByDataTime } from "../common/helper functions/sortDateTime";

interface AddCourseDetails {
    courseDetails: any;
    userDetails: any;
    authToken: string;
}

interface GetCoursesDetails {
    authToken: string;
    dispatch: (data: any) => void;
}

export const getCourses = async (props: GetCoursesDetails) => {
    const { dispatch, authToken } = props;
    try {
        const response = await axios.get(`${base_url}/view-courses`, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        })
        if (response.data) {
            response.data.sort(sortByDataTime)
            dispatch({
                type: "ALL_COURSE_DATA",
                data: response.data
            })
            return true;
        }
    } catch (error: any) {
        notification.error({
            message: error?.message,
        })
        return false;
    }
    return false;
}


export const addCourse = async (props: AddCourseDetails) => {
    const { courseDetails, userDetails, authToken } = props;
    let courseObj = {
        ...courseDetails,
        createdBy_updatedBy: userDetails?.user_name,
        createdAt_updatedAt: moment().format("YYYY-MM-DD HH:mm")
    }
    try {
        const result = await axios.post(`${base_url}/addNew-course`, courseObj, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        })
        if (result) {
            notification.success({
                message: "Course added successfully!!"
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

export function updateCourse(props: any) {
    const { obj, authToken } = props;
    return new Promise(async (resolve, reject) => {
        try {
            await axios.put(`${base_url}/update-course`, obj,
                {
                    headers: {
                        authorization: `Bearer ${authToken}`
                    }
                }
            )
            notification.success({
                message: "Course updated successfully!!"
            })
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

export function deleteCourse(props: any) {
    const {deleteCourseId} = props;
    return new Promise (async(resolve, reject) => {
        try {
            const result = await axios.delete(`${base_url}/delete-course/?courseId=${(deleteCourseId).toString()}`)
            if (result.status === 200) {
                notification.success({
                    message: "Course deleted successfully!"
                })
                resolve(true);
            }
        } catch (err:any) {
            reject(err);
            notification.error({
                message: err?.message
            })
        }
    });
};