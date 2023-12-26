import React, { useEffect, useState } from "react";
import { contentTitle } from "../common/helper functions/contentTitle";
import { taskFields } from "./taskFields";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Popover, Select, notification } from "antd";
import { deleteTask, editTasks, scheduleTask } from "./apiFunctions";
import { deleteContent } from "../common/helper functions/deleteContent";
import { useNavigate } from "react-router-dom";

function ViewTask(props: any) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [enableEdit, setEnableEdit] = useState(false);
    const [enableDelete, setEnableDelte] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [editorType, setEditorType] = useState('text');
    const [images, setImages] = useState([]);
    const [openImage, setOpenImage] = useState<any>(null);
    const [selectedBatch, setSelectedBatch] = useState<any>(null);
    const { selectedTask, selectedCourse, authToken, courses, batches } = useSelector((state: any) => ({
        selectedTask: state.commonStates.selectedTask,
        selectedCourse: state.commonStates.selectedCourse,
        authToken: state.userSession.authToken,
        courses: state.commonStates.courses,
        batches: state.commonStates.batches
    }));
    const [taskCredentials, setTaskCredentials] = useState({
        course_id: selectedTask.course_id,
        taskName: selectedTask.task_name,
        taskDescription: selectedTask.description,
        languageType: selectedTask.language_type,
        solution: selectedTask.solution,
        imageList: selectedTask?.image_list ? JSON.parse(selectedTask?.image_list) : null
    });

    useEffect(() => {
        if (selectedTask && selectedTask?.image_list && JSON.parse(selectedTask?.image_list)) {
            setImages(JSON.parse(selectedTask?.image_list))
        }
        if (selectedTask?.language_type && selectedTask?.language_type === 'text') {
            setEditorType('text')
        } else {
            setEditorType('codeEditor')
        }
    }, [selectedTask]);

    useEffect(() => {
        if (images.length) {
            setTaskCredentials(prev => ({ ...prev, imageList: images }))
        }
    }, [images])

    async function saveTask() {
        const result: any = await editTasks({ selectedTask_id: selectedTask.task_unique_id, taskCredentials, authToken })
        if (result.status === 200) {
            dispatch({
                type: 'SELECTED_TASK',
                data: {
                    course_id: taskCredentials.course_id,
                    solution: taskCredentials.solution,
                    task_name: taskCredentials.taskName,
                    description: taskCredentials.taskDescription,
                    language_type: taskCredentials.languageType,
                    image_list: JSON.stringify(taskCredentials.imageList)
                }
            })
            setEnableEdit(false);
            notification.success({
                message: 'Task edited successfully!!'
            })
        } else {
            notification.error({
                message: result
            })
        }
    }

    async function handleDeleteTask() {
        const result: any = await deleteTask({ selectedTask_id: selectedTask.task_unique_id, authToken })
        if (result.status === 200) {
            navigate(`/home/tasks/${selectedCourse.course_id}`)
        }
    }
    
    async function handleScheduleTask () {
        try {
            const response:any = await scheduleTask({taskId: selectedTask.task_unique_id, taskName: selectedTask.task_name, batchId: selectedBatch, authToken})
            if (response?.data.status === 'success') {
                notification.success({
                    message: response?.data?.message
                });
                setPopoverOpen(false);
                setSelectedBatch(null)
            } else {
                notification.warning({
                    message: response?.data?.message
                });
                setSelectedBatch(null);
            }
        } catch (err:any) {
            notification.error({
                message: err?.message
            })
        }
    }


    function scheduleTaskContent () {
        const filterOption = (input:any, option:any) =>
            (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
        const { Option } = Select;

        return (
            < >
                <Select
                    style={{ textAlign: "start", width: "100%", height: "35px" }}
                    showSearch
                    placeholder="CHOOSE BATCH *"
                    optionFilterProp="children"
                    onChange={(e) => {setSelectedBatch(e)}}
                    value={selectedBatch || null}
                    filterOption={filterOption}
                >
                    {(batches && batches?.length > 0) && batches?.map((batch:any, index:number) => {
                        return <Option key={index} value={batch.batch_unique_id}>{batch.batch_name}</Option>
                    })}
                </Select>
                <div className="d-flex align-items-center justify-content-between w-100"  >
                    <Button style={{fontWeight:600, border:"none", color:"#fa2a00", fontSize:"12px"}} onClick={() => setPopoverOpen(false)} >CLOSE</Button>
                    <Button type="primary"  
                        style={{ backgroundColor:"#0b2e59", fontWeight:600, fontSize:"14px"}}
                        onClick={() => {handleScheduleTask()}}
                    >SCHEDULE</Button>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="d-flex flex-column align-items-center" style={{ height: "calc(100vh - 150px)" }} >
                {contentTitle('VIEW TASK')}
                <div className="col-12 col-md-9 h-100 overflow-auto p-4" >
                    {taskFields({
                        setOpenImage,
                        images,
                        setImages,
                        taskCredentials,
                        setTaskCredentials,
                        setEnableEdit,
                        editorType,
                        setEditorType,
                        courseName: selectedCourse.course_name,
                        disabled: !enableEdit,
                        courses
                    })}
                    <div className="d-flex align-items-center justify-content-between my-2 py-1 w-100"
                    >
                        <div>
                            <Popover
                                placement="topRight"
                                content={
                                <div className="d-flex flex-column align-items-start justify-content-between" style={{height:"100px", width:"250px"}} >
                                     {popoverOpen && scheduleTaskContent()}
                                </div>
                            }
                                title="Title"
                                trigger="click"
                                open={popoverOpen}
                            >
                                <Button
                                    onClick={() => {setPopoverOpen(true) }}
                                    style={{ backgroundColor: "#2a044a", color: "#fff", boxShadow: "rgba(42, 4, 74, 0.25) 0px 13px 27px -5px, rgba(42, 4, 74, 0.3) 0px 8px 16px -8px" }}
                                    className="fw-bold"
                                >SCHEDULE TASK</Button>
                            </Popover>
                        </div>
                        <div>
                            <Button style={{
                                color: enableEdit ? "#000" : "white",
                                background: enableEdit ? "" : "#bd1550",
                                border: "none",
                                boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
                            }}
                                onClick={() => enableEdit ? setEnableEdit(false) : setEnableDelte(true)}
                                className="fw-bold"
                            >{enableEdit ? "CANCEL" : "DELETE TASK"}</Button>
                            <Button
                                onClick={() => { !enableEdit ? setEnableEdit(true) : saveTask() }}
                                style={{ marginLeft: "15px", boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px" }}
                                type="primary" className="fw-bold"
                            >{enableEdit ? "SAVE" : "EDIT TASK"}</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                width={"80%"}
                closable={false}
                open={(openImage || enableDelete) && true}
                footer={
                    <>
                        <Button onClick={() => { setOpenImage(null); setEnableDelte(false); }} >Cancel</Button>
                        {enableDelete && <Button onClick={handleDeleteTask} style={{ backgroundColor: "#bd1550", color: "#fff" }} >Delete</Button>}
                    </>
                }
            >
                {openImage && <img src={openImage} alt="selected-image" style={{ height: "100%", width: "100%" }} />}
                {enableDelete && deleteContent(selectedTask.task_name)}
            </Modal>
        </>
    )
}

export default ViewTask;