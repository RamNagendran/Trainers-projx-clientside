import React, { useEffect, useState } from "react";
import './index.css';
import { contentTitle } from '../common/helper functions/contentTitle'
import { Button, FloatButton, Modal, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import RenderBatches from "./renderBatches";
import { deleteContent } from "../common/helper functions/deleteContent";
import { getCourses } from "../viewCourses/courseApis";
import { addNewBatch, deleteBatch, editBatch, getBatches } from "./batchApis";
import BatchFields from "./batchFields";
import { useNavigate } from "react-router-dom";

const modalInitials = {
    addNew: false,
    edit: false,
    delete: false,
    addStudents: false,
    selectedBatchforDelete: {
        batchName: '',
        batchUniqueId: '',
    }
}
const batchDetails_initials = {
    batchName: '',
    startDate: '',
    timings: '',
    courseId: '',
    students: []
}
interface BatchContentInitials {
    batchUniqueId?: string;
    batchName: string;
    startDate: string;
    timings: string;
    courseId: string;
    students: any[];
}

function ViewBatches(props: any) {
    const {data} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [emptyError, setEmptyError] = useState(false);
    const [showModalFor, setShowModalFor] = useState(modalInitials);
    const { courses, batches, userDetails, authToken } = useSelector((state: any) => ({
        courses: state.commonStates.courses,
        batches: state.commonStates.batches,
        userDetails: state.userSession.userDetails,
        authToken: state.userSession.authToken
    }));
    const [newBatchDetails, setNewBatchDetails] = useState<BatchContentInitials>(batchDetails_initials);
    const [editBatchDetails, setEditBatchDetails] = useState<BatchContentInitials>(batchDetails_initials);
    const [studentsList, setStudentsList] = useState(newBatchDetails.students);

    useEffect(() => {
        getCourses({ dispatch, authToken })
        getBatches({ dispatch, authToken, userId: userDetails?.user_emailId });
    }, [authToken, dispatch, userDetails?.user_emailId])

    function setInitials() {
        setShowModalFor(modalInitials)
        setNewBatchDetails(batchDetails_initials)
        setStudentsList([])
        setEmptyError(false);
    }

    async function handleAddBatch() {
        if (
            newBatchDetails.batchName !== '' &&
            newBatchDetails.courseId !== '' &&
            newBatchDetails.startDate !== '' &&
            newBatchDetails.timings !== '' &&
            newBatchDetails.students.length > 0
        ) {
            let finalObj = {
                ...newBatchDetails,
                userId: userDetails?.user_emailId
            }
            try {
                const result = await addNewBatch({ authToken, finalObj })
                if (result) {
                    setInitials()
                    getBatches({ dispatch, authToken, userId: userDetails.user_emailId });
                }
            } catch (err: any) {
                notification.error({
                    message: err.message
                })
            }
        } else {
            setEmptyError(true);
        }
    }

    async function handleEdit() {
        if (
            editBatchDetails.batchName !== '' &&
            editBatchDetails.courseId !== '' &&
            editBatchDetails.startDate !== '' &&
            editBatchDetails.timings !== '' &&
            editBatchDetails.students.length !== 0
        ) {
            editBatch({
                authToken,
                editBatchDetails,
                setShowModalFor,
                modalInitials,
                dispatch,
                userEmailId: userDetails.user_emailId
            });
        } else {
            setEmptyError(true);
        }
    }

    async function handleDelete() {
        deleteBatch({
            showModalFor,
            authToken,
            setShowModalFor,
            modalInitials,
            dispatch,
            userEmailId: userDetails.user_emailId
        });
    }

    function handleCancel() {
        if (showModalFor.addStudents) {
            setShowModalFor(prev => ({ ...prev, addStudents: false }));
            if (showModalFor.edit) {
                setStudentsList(editBatchDetails.students)
            } else {
                setStudentsList(newBatchDetails.students)
            }
        } else {
            setInitials();
        }
    }
    useEffect(() => {
        dispatch({
            type: 'CLEAR_SCHEDULED_TASKS'
        })
    }, [])

    function onPlusClick() {
        const isLimitReached = batches.filter((items: any) => items.batch_status === 'Active')
        isLimitReached.length < 15 ? setShowModalFor({ ...showModalFor, addNew: true }) :
            notification.warning({
                message: "Your have reached the maximum number of batches!!",
                description: "Please delete completed batches and then add new."
            })
    }

    function onCardClick(batch: any) {
        dispatch({
            type: 'SELECTED_BATCH',
            data: batch
        })
        navigate(`/home/selected-batch/${batch.batch_unique_id}`)

    }

    function addStudents() {
        if (showModalFor.addNew) {
            if (studentsList.length > 0) {
                const emptyFilteredStudents = studentsList.filter((items: any) => items.name !== '' && items.email !== '')
                setNewBatchDetails((prev: any) => ({
                    ...prev,
                    students: emptyFilteredStudents
                }))
                setStudentsList(emptyFilteredStudents)
            }
        } else {
            if (studentsList.length > 0) {
                const emptyFilteredStudents = studentsList.filter((items: any) => items.name !== '' && items.email !== '')
                setEditBatchDetails((prev: any) => ({
                    ...prev,
                    students: emptyFilteredStudents
                }))
                setStudentsList(emptyFilteredStudents)
            }
        }
        setShowModalFor({ ...showModalFor, addStudents: false })
    }

    return (
        <React.Fragment>
            <div className="batch">
                {contentTitle('BATCHES')}
                <div title="Add New Batch" >
                    <FloatButton type="primary" className="batch-float"
                        style={{ width: "60px", height: "60px" }}
                        icon={<PlusOutlined />}
                        onClick={onPlusClick}
                    />
                </div>
                <div className="mt-3 mt-md-3 col-10 col-md-12 d-flex align-items-start justify-content-center" style={{ overflowX: "auto", height: "calc(100vh - 185px)" }}>
                    <RenderBatches setStudentsList={setStudentsList}
                        showModalFor={showModalFor} setShowModalFor={setShowModalFor} onCardClick={onCardClick}
                        setEditBatchDetails={setEditBatchDetails} editBatchDetails={editBatchDetails}
                    />
                </div>
            </div>
                <Modal
                    className="modal-md"
                    title={
                        <>
                            <div style={{ color: "#005bc5", fontSize: "14px", fontWeight: 700 }}>
                                {showModalFor.edit ? `EDIT BATCH` : showModalFor.delete ? `DELETE BATCH` : showModalFor.addStudents ? `ADD STUDENTS` : `ADD NEW BATCH`}
                            </div>
                        </>
                    }
                    closable={false}
                    open={showModalFor.edit || showModalFor.delete || showModalFor.addNew}
                    footer={
                        <div>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                style={{
                                    background: showModalFor.delete ? "red" : "#1677ff",
                                    color: "white", fontWeight: 700
                                }}
                                onClick={() => (showModalFor.edit && !showModalFor.addStudents) ? handleEdit() : showModalFor.delete ? handleDelete() : showModalFor.addStudents ? addStudents() : handleAddBatch()}>
                                {showModalFor.delete ? `DELETE` : (showModalFor.addNew && !showModalFor.addStudents) ? `ADD BATCH` : showModalFor.addStudents ? 'ADD STUDENTS' : `EDIT`}
                            </Button>
                        </div>
                    }
                >
                    {showModalFor.addNew && <BatchFields
                        setStudentsList={setStudentsList}
                        studentsList={studentsList}
                        setShowModalFor={setShowModalFor}
                        showModalFor={showModalFor}
                        emptyError={emptyError} batchDetails={newBatchDetails}
                        setBatchDetails={setNewBatchDetails} courses={courses}
                    />}
                    {showModalFor.edit && <BatchFields
                        setStudentsList={setStudentsList}
                        studentsList={studentsList}
                        setShowModalFor={setShowModalFor}
                        showModalFor={showModalFor}
                        emptyError={emptyError} batchDetails={editBatchDetails}
                        setBatchDetails={setEditBatchDetails} courses={courses}
                    />}
                    {showModalFor.delete && deleteContent(showModalFor.selectedBatchforDelete.batchName)}
                </Modal>
        </React.Fragment>
    )
}

export default ViewBatches;