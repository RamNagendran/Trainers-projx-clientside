import { Button, Empty } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
interface CourseDetails {
    course_id: string;
    course_name: string;
    duration: string;
    description: string;
    createdby_updatedby: string;
    createdat_updatedat: string;
}
const HOVER_BOXSHADOW = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
const DEFAULT_BOXSHADOW = "rgb(232 232 232) 3px 3px 6px 0px inset, rgb(237 234 234 / 50%) -3px -3px 6px 1px inset";

function CourseContent(props: any) {
    const { setShowModalFor, onEdit, onCardClick } = props;
    const { courses } = useSelector((state: any) => state.commonStates)
    const [showEditDelete, setShowEditDelete] = useState<any>(null);

    return (
        <React.Fragment>
            <div className="courseContent col-11 col-md-12 d-block d-md-flex justify-content-center align-items-center flex-wrap" >
                {courses && courses?.length > 0 ? courses.map((course: CourseDetails, i: number) => {
                    const delay = i * 0.1 + "s";
                    return (
                        <div key={i} onMouseOver={() => setShowEditDelete(i)} onMouseLeave={() => setShowEditDelete(null)}
                            className="courseCard d-flex flex-column justify-content-between m-0 m-md-3 mt-3 col-12 col-md-3 slideIn"
                            style={{
                                animation: `slideIn .5s forwards ${delay}`,
                                boxShadow: showEditDelete === i ? HOVER_BOXSHADOW : DEFAULT_BOXSHADOW,
                            }}>
                            <div className="d-flex w-100 h-100 p-3" style={{overflow:"auto"}} >
                                {dotLine()}
                                <div onClick={() => onCardClick({course_id: course.course_id, course_name: course.course_name})} className="d-flex flex-column justify-content-between" style={nameDuration}>
                                    <div title={course.course_name} className="nameStyle text-start">
                                        {course.course_name}
                                    </div>
                                    <div className="w-100 text-truncate d-flex">
                                        <div style={durationStyle} >DURATION : </div>
                                        <div style={{...durationStyle, color: "rgb(171, 171, 171)"}} >{course.duration} Months</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-center justify-content-center">
                                    <Button
                                        className="editDelBtn d-flex align-items-center justify-content-center"
                                        onClick={() => onEdit(course)}
                                    >
                                        EDIT
                                    </Button>
                                    <Button
                                        className="editDelBtn d-flex align-items-center justify-content-center"
                                        onClick={() =>
                                            setShowModalFor({
                                                edit: false,
                                                delete: true,
                                                deleteCred: {
                                                    courseName: course.course_name,
                                                    course_id: course.course_id
                                                }
                                            })}
                                    >
                                        DELETE
                                    </Button>
                                </div>
                            </div>
                            <div onClick={() => onCardClick({course_id: course.course_id, course_name: course.course_name})} className="p-1 d-flex align-items-center justify-content-between">
                                <div style={footerStyle}>{course.createdby_updatedby}</div>
                                <div style={footerStyle}>{moment(course.createdat_updatedat, "YYYY-MM-DD HH:mm").format("ddd, MMM YYYY, hh:mm A")}</div>
                            </div>
                        </div>
                    )
                }) : <Empty />}
            </div>
        </React.Fragment>
    )
}

export default CourseContent;

function dotLine() {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="dots" ></div>
            <div style={centerLine}></div>
            <div className="dots" ></div>
        </div>
    )
}

const nameDuration = { width: "65%", marginLeft: "15px" };
const durationStyle = { fontWeight: 700, fontSize: "14px" };
const footerStyle = { color: "grey", fontSize: "12px", fontWeight: 700 };
const centerLine = { height: "70%", width: "0px", borderRight: "1px dashed #031634" };