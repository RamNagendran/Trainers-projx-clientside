import React from "react";
import './index.css';
import { contentTitle } from "../common/helper functions/contentTitle";
import { useDispatch, useSelector } from "react-redux";
import Table from 'react-bootstrap/Table';
import moment from "moment";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export function BatchDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedBatch, courses } = useSelector((state: any) => ({
        selectedBatch: state.commonStates.selectedBatch,
        courses: state.commonStates.courses

    }));
    const data = courses?.filter((items: any) => {
        if (items.course_id === selectedBatch.course_id) {
            return items
        }
    })
    const startedDate = moment(selectedBatch?.start_date).format('DD MMM yyyy')
    const created_updated_at = moment(selectedBatch?.created_updated_at).format('DD MMM yyyy hh:mm A')

    function viewScheduledTasks() {
        dispatch({
            type: 'SCHEDULED_TASKS',
            data: selectedBatch.scheduled_tasks
        })
        navigate(`/home/scheduled-tasks/${selectedBatch.batch_name}` )   
    }

    return (
        <div className=" batch-details d-flex flex-column align-items-center" style={{ height: "calc(100vh - 150px)" }} >
            {contentTitle('BATCH DETAILS')}
            <div className="col-12 col-md-9 h-100 overflow-auto p-4 " >
                <div style={{
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    border: "1px solid lightgrey", padding: "20px", borderRadius: "10px", background: "white"
                }}>
                    <div className="mb-3 w-100 d-flex align-items-center justify-content-between">
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#6C6C6C" }} >Batch Id:</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#000" }} >{selectedBatch.batch_unique_id}</div>
                    </div>
                    <div className="mb-3 w-100 d-flex align-items-center justify-content-between">
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#6C6C6C" }} >Batch Name:</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#000", textTransform: "capitalize" }} >{selectedBatch.batch_name}</div>
                    </div>
                    <div className="h-0 w-100 mb-3" style={{ borderTop: "1px dashed lightgrey" }} ></div>
                    <div className="mb-3 w-100 d-flex align-items-center justify-content-between">
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#6C6C6C" }} >Started At:</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#000" }} >{startedDate}</div>
                    </div>
                    <div className="mb-3 w-100 d-flex align-items-center justify-content-between">
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#6C6C6C" }} >Timings:</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#000" }} >{selectedBatch.timings}</div>
                    </div>
                    <div className="mb-3 w-100 d-flex align-items-center justify-content-between">
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#6C6C6C" }} >Created / Updated At:</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#000" }} >{created_updated_at}</div>
                    </div>
                    <div className="h-0 w-100 mb-3" style={{ borderTop: "1px dashed lightgrey" }} ></div>
                    <div className="mb-3 w-100 d-flex align-items-center justify-content-between">
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#6C6C6C" }} >Course Name : </div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#000" }} >{data[0]?.course_name}</div>
                    </div>
                    <div className="mb-3 w-100 d-flex align-items-center justify-content-between">
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#6C6C6C" }} >Course Duration :</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#000" }} >{data[0]?.duration} Months</div>
                    </div>
                    <div className="w-100 d-flex justify-content-between">
                        <div className="d-flex align-items-center" >
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#6C6C6C" }}>Total tasks scheduled :</div>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#1b325f" }}>{selectedBatch?.scheduled_tasks?.length || 0}</div>
                        </div>
                        <Button onClick={viewScheduledTasks} style={{ fontSize: "13px", fontWeight: 600, background: "#c04848", color: "#fff" }} >VIEW TASKS</Button>
                    </div>
                </div>
                {studentList(JSON.parse(selectedBatch.students))}
            </div>
        </div>
    )
}


function studentList(studentList: any) {
    return (
        <div style={{

            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            marginTop: "20px", border: "1px solid lightgrey", padding: "20px", borderRadius: "10px", background: "white"
        }}>
            <div className="w-100 d-flex align-items-start" style={{ fontSize: "14px", fontWeight: 900, color: "#000" }} >STUDENTS LIST :</div>
            <Table responsive bordered hover >
                <thead>
                    <tr >
                        <th>SI NO</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.map((items: any, index: number) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td >{items.name}</td>
                                <td >{items.email}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}