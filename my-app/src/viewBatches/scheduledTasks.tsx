import React from "react";
import { useSelector } from "react-redux";
import Table from 'react-bootstrap/Table';
import { contentTitle } from "../common/helper functions/contentTitle";
import { Empty } from "antd";
import moment from "moment";


export function ScheduledTasks() {

    const { scheduled_tasks } = useSelector((state: any) => ({
        scheduled_tasks: state.commonStates.scheduled_tasks
    }))

    return (
        <React.Fragment>
            <div className="d-flex flex-column align-items-center w-100" style={{ height: "calc(100vh - 150px)" }} >
                {contentTitle('SCHEDULED TASKS')}
                <div style={{
                    width:"75%",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    marginTop: "20px", border: "1px solid lightgrey", padding: "20px", borderRadius: "10px", background: "white"
                }}>
                    {scheduled_tasks ? <Table  responsive bordered hover >
                        <thead>
                            <tr >
                                <th>SI NO</th>
                                <th>TASK ID</th>
                                <th>TASK NAME</th>
                                <th>SCHEDULED AT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduled_tasks?.map((task: any, index: number) => {
                                const parsedData = JSON.parse(task)
                                const scheduledAt = moment(parsedData.dateTime).format('DD MMM YYYY, hh:mm A')
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td >{parsedData.taskId}</td>
                                        <td >{parsedData.taskName}</td>
                                        <td >{scheduledAt}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table> : <Empty />}
                </div>
            </div>
        </React.Fragment>
    )
}