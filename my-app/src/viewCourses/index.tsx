import './index.css';
import moment from "moment";
import courseFields from "./courseFields";
import RenderCourses from "./renderCourses";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { Button, FloatButton, Modal, notification } from "antd";
import { contentTitle } from "../common/helper functions/contentTitle";
import { deleteContent } from "../common/helper functions/deleteContent";
import { addCourse, deleteCourse, getCourses, updateCourse } from "./courseApis";


interface CourseDetails {
    course_id: string;
    course_name: string;
    duration: string;
    description: string;
}

interface EditDetails {
    course_id: string;
    courseName?: string;
    courseDuration?: string;
    description?: string
}

const initialStates = {
    forShowModal: {
        edit: false,
        delete: false,
        addCourse: false,
        deleteCred: {
            courseName: '',
            course_id: ''
        }
    },
    forCourseDetails: {
        course_id: '',
        courseName: '',
        courseDuration: '',
        description: ''
    }
}

function ViewCourses(props: any) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [apiData, setApiData] = useState<any>({});
    const [showModalFor, setShowModalFor] = useState(initialStates.forShowModal);
    const prevCourseDetails = useRef<EditDetails>(initialStates.forCourseDetails);
    const { userDetails, authToken, selectedCourse } = useSelector((state: any) => ({
        userDetails: state.userSession.userDetails,
        authToken: state.userSession.authToken,
        selectedCourse: state.commonStates.selectedCourse,
      }));
    const [courseDetails, setCourseDetails] = useState(initialStates.forCourseDetails);

    useEffect(() => {
        const hasCourseNameChanged = (courseDetails.courseName !== prevCourseDetails.current?.courseName)
        const hasCourseDescriptionChanged = (courseDetails.description !== prevCourseDetails.current?.description)
        const hasCourseDurationChanged = (courseDetails.courseDuration !== prevCourseDetails.current?.courseDuration)

        if (hasCourseNameChanged) {
            setApiData((prevState: any) => ({ ...prevState, courseName: courseDetails.courseName }))
        }
        if (hasCourseDurationChanged) {
            setApiData((prevState: any) => ({ ...prevState, courseDuration: courseDetails.courseDuration }))
        }
        if (hasCourseDescriptionChanged) {
            setApiData((prevState: any) => ({ ...prevState, description: courseDetails.description }))
        }
    }, [courseDetails])
    useEffect(() => {
        getCourses({ dispatch, authToken })
    }, [authToken, dispatch])


    const handleAdd = async () => {
        if (courseDetails.courseName !== '' && courseDetails.courseDuration !== '') {
            const response = await addCourse({ courseDetails, userDetails, authToken });
            if (response) {
                setShowModalFor(initialStates.forShowModal)
                dispatch({ type: 'MID_CONTENT', data: { mid_content: 'viewCourses', course_id: '' } })
                setCourseDetails(initialStates.forCourseDetails)
                getCourses({ authToken, dispatch })
            }
        } else {
            notification.error({
                message: "Course name and Course duration should not be empty!!"
            })
        }
    }

    const onEdit = (selectedCourse: CourseDetails) => {
        const courseData = {
            course_id: selectedCourse.course_id,
            courseName: selectedCourse.course_name,
            courseDuration: selectedCourse.duration,
            description: selectedCourse.description
        };
        prevCourseDetails.current = courseData;
        setCourseDetails(courseData);
        setApiData({ ...apiData, course_id: selectedCourse.course_id })
        setShowModalFor({ ...showModalFor, edit: true, delete: false })
    }

    const handleEdit = () => {
        const { courseName, courseDuration, description } = apiData;
        if (courseName !== '' && courseDuration !== '' && description !== '') {
            let obj = {
                apiData,
                updatedBy: userDetails?.user_name,
                updatedAt: moment().format('YYYY-MM-DD HH:mm')
            }
            updateCourse({ obj, authToken }).then((res) => {
                if (res) {
                    setShowModalFor({ ...showModalFor, edit: false, delete: false })
                    getCourses({ authToken, dispatch })
                    setApiData({});
                    setCourseDetails(initialStates.forCourseDetails)
                    prevCourseDetails.current = initialStates.forCourseDetails;
                }
            }).catch((err) => {
                notification.error({
                    message: err?.message
                })
            })
        } else {
            notification.error({
                message: "Fields should not be empty!"
            })
        }
    }

    const handleDelete = async () => {
        deleteCourse({ deleteCourseId: showModalFor.deleteCred.course_id }).then((res) => {
            if (res) {
                getCourses({ authToken, dispatch })
                setShowModalFor(initialStates.forShowModal)
            }
        });
    }

    const handleCancel = () => {
        setCourseDetails(initialStates.forCourseDetails);
        setApiData({});
        prevCourseDetails.current = initialStates.forCourseDetails;
        setShowModalFor(initialStates.forShowModal);
    }

    function onCardClick (courseDetails: any)  {
        dispatch({
            type: 'SELECTED_COURSE',
            data: courseDetails
        });
        navigate(`/home/tasks/${courseDetails?.course_id}`)
    }

    return (
        <React.Fragment>
            <div className="course">
                {contentTitle('COURSES')}
                <div title="Add New Batch" >
                    <FloatButton type="primary" className="batch-float"
                        style={{ width: "60px", height: "60px" }}
                        icon={<PlusOutlined />}
                        onClick={() => { setShowModalFor({ ...showModalFor, addCourse: true }) }}
                    />
                </div>
                <div className="mt-3 mt-md-3 col-12 d-flex align-items-start justify-content-center" style={{ overflowX: "auto", height: "calc(100vh - 185px)" }}>
                    <RenderCourses onEdit={onEdit} onCardClick={onCardClick}
                        showModalFor={showModalFor} setShowModalFor={setShowModalFor}
                    />
                </div>
            </div>
            <Modal
                title={<div style={MODAL_TITLE}>
                    {showModalFor.edit ? `EDIT COURSE` : showModalFor.delete ? `DELETE COURSE` : `ADD COURSE`}
                </div>
                }
                closable={false}
                open={showModalFor.edit || showModalFor.delete || showModalFor.addCourse}
                footer={
                    <div>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button
                            style={{ 
                                background: showModalFor.delete ? "red" : "#1677ff",
                                color: "white", fontWeight: 700
                            }}
                            onClick={() => showModalFor.edit ? handleEdit() : showModalFor.delete ? handleDelete() : handleAdd()}>
                            {showModalFor.edit ? `EDIT` : showModalFor.delete ? `DELETE` : `ADD`}
                        </Button>
                    </div>
                }
            >
                {showModalFor.edit && courseFields(courseDetails, setCourseDetails)}
                {showModalFor.delete && deleteContent(showModalFor.deleteCred.courseName)}
                {showModalFor.addCourse && courseFields(courseDetails, setCourseDetails)}
            </Modal>
        </React.Fragment>
    )
}

export default ViewCourses;

const MODAL_TITLE = { color: "#005bc5", fontSize: "14px", fontWeight: 700 };