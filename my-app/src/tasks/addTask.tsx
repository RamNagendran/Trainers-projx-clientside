import React, { useEffect, useState } from "react";
import { taskFields } from "./taskFields";
import { useSelector } from "react-redux";
// import { contentTitle } from "../common/helper functions/contentTitle";
import { Button, notification } from "antd";
import { addNewTask } from "./apiFunctions";
import { contentTitle } from "../common/helper functions/contentTitle";

const inital_states = {
    course_id: '',
    taskName: '',
    taskDescription: '',
    languageType: 'text',
    solution: '',
    imageList: []
}

function AddTask(props: any) {
    const { courses, userDetails, authToken } = useSelector((state: any) => ({
        courses: state.commonStates.courses,
        userDetails: state.userSession.userDetails,
        authToken: state.userSession.authToken
    }))
    const [editorType, setEditorType] = useState('text');
    const [images, setImages] = React.useState([]);
    const [taskCredentials, setTaskCredentials] = useState(inital_states);

    function handleEditorValidation(markers: any) {
        markers.forEach((marker: any) => {
            console.warn(marker);
        });
    }

    useEffect(() => {
        if (images.length > 0) {
            setTaskCredentials(prev => ({ ...prev, imageList: images }))
        }
    }, [images]);

    async function addTask() {
        if (
            taskCredentials.taskName !== '' &&
            taskCredentials.course_id !== '' &&
            taskCredentials.solution !== ''
        ) {
            const res: any = await addNewTask({ taskCredentials, userDetails, authToken })
            if (res?.status === 200) {
                setTaskCredentials(inital_states)
                setImages([]);
            }
        } else {
            notification.error({
                message: 'Course Name, Task Name, and Solution are mandatory!!!'
            })
        }
    }


    return (
        < >
            <div className="d-flex flex-column align-items-center" style={{ height: "calc(100vh - 150px)" }} >
                {contentTitle('ADD TASK')}
                <div className="col-12 col-md-9 h-100 overflow-auto p-4" >
                    {taskFields({
                        images,
                        setImages,
                        courses,
                        editorType,
                        setEditorType,
                        taskCredentials,
                        setTaskCredentials,
                        handleEditorValidation,
                    })}
                    <div className="d-flex align-items-center justify-content-end my-2 py-1 w-100"

                    >
                        <Button style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px" }}
                            onClick={addTask} type="primary" className="fw-bold"
                        >ADD TASK</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddTask;