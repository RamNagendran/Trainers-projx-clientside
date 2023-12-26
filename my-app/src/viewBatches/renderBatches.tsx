import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from '../assets/SVGs/icn_Edit.svg';
import DeleteIcon from '../assets/SVGs/icn_Delete.svg';
import '../App.css';
import { Button, ConfigProvider, Empty, Modal, Progress, Segmented, Skeleton } from "antd";
import { changeBthStatus } from "./batchApis";
import CountUp from "react-countup";

interface BatchesDetails {
    batch_name: string;
    batch_unique_id: string;
    course_id: string;
    email_id: string;
    id: number;
    students: any;
    start_date: string;
    timings: string;
    batch_status: string;
}

interface PropsDetails {
    showModalFor: any;
    setShowModalFor: any;
    editBatchDetails: any;
    setEditBatchDetails: any;
    onCardClick: (data: any) => void;
    setStudentsList: any;
}

function RenderBatches(props: PropsDetails) {
    const { showModalFor, setShowModalFor, setEditBatchDetails, onCardClick, setStudentsList, } = props;
    const { batches, authToken, courses, allTasks } = useSelector((state: any) => ({
        batches: state.commonStates.batches,
        authToken: state.userSession.authToken,
        courses: state.commonStates.courses,
        allTasks: state.analyticsStates.allTasks,
    }));
    const dispatch = useDispatch();
    const [showSwitchModal, setShowSwitchModal] = useState<any>({
        isOpen: false,
        content: null
    });

    const [hoveredBatch, setHoveredBatch] = useState<any>(null);

    const defaultBShadow = 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px'
    const hoverBoxShadow = "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px";


    async function updateStatus() {
        const { batchId, status } = showSwitchModal?.content
        const response: any = await changeBthStatus({ batchId, status, authToken })
        const refreshedBatches = batches.map((items: BatchesDetails) => {
            if (items.batch_unique_id === response.data[0].batch_unique_id) {
                items.batch_status = response.data[0].batch_status
            }
            return items;
        })
        dispatch({ type: 'ALL_BATCH_DATA', data: refreshedBatches })
        setShowSwitchModal({
            isOpen: false,
            content: null
        })
    }

    return (
        <React.Fragment>
            <div className="col-10 col-md-12 d-flex justify-content-center align-items-center flex-wrap" >
                {batches && batches?.length > 0 &&
                    batches.map((items: any, index: number) => {
                        const courseName = courses?.filter((cItems: any) => cItems.course_id === items.course_id)[0].course_name
                        const courseDurationInDays = courses?.filter((cItems: any) => cItems.course_id === items.course_id)[0].duration * 30
                        const startedDate = moment(items.start_date).format('MMM Do, YYYY')
                        const studentsCount = JSON.parse(items?.students)?.length
                        const tasksCount = (items?.scheduled_tasks)?.length
                        const totalTasks = allTasks?.filter((tItems: any) => tItems.course_id === items.course_id).length
                        const today = moment();
                        const course_startedDate = moment(items.start_date)
                        const daysCompleted = today.diff(course_startedDate, 'days')
                        const progressCalc = Math.round((daysCompleted / courseDurationInDays) * 100) || 0
                        const taskPercentage = Math.round((tasksCount / totalTasks) * 100) || 0
                        const delay = index * 0.1 + "s";
                        return (
                            <div
                                onClick={() => onCardClick(items)} 
                                key={index} onMouseEnter={() => setHoveredBatch(index)} onMouseLeave={() => setHoveredBatch(null)}
                                className="d-flex flex-column align-items-center  m-0 m-md-3 mt-3  slideIn"
                                style={{
                                    ...bMainContent,
                                    animation: `slideIn .5s forwards ${delay}`,
                                    boxShadow: hoveredBatch === index ? hoverBoxShadow : defaultBShadow,
                                }}>
                                <div className="w-100" >
                                    <div title={items.batch_name} className="w-75 d-flex align-items-start text-truncate" style={{ fontWeight: 700, fontSize: "18px", color: "#000000", textTransform: "uppercase" }} >{items.batch_name}</div>
                                </div>
                                <div className="mb-1 mt-2 w-100 h-0" style={{ borderBottom: "1px dashed grey" }} />
                                <div className="mt-2 w-100 d-flex align-items-start justify-content-between " >
                                    <div style={{ textAlign: "start", width: "108px", fontWeight: 600, fontSize: "14px", color: "rgb(171, 171, 171)" }} >Timings :</div>
                                    <div
                                        style={{ textAlign: "start", fontWeight: 700, fontSize: "14px", color: "#000000", textTransform: "capitalize" }}
                                    >
                                        {items.timings}
                                    </div>
                                </div>
                                <div className="mb-2 mt-2 w-100 h-0" style={{ borderBottom: "1px dashed grey" }} />
                                <div className="d-flex align-items-center justify-content-between w-100 mt-2"
                                    style={{ padding: "0px 8px", height: "75px", borderRadius: "12px", backgroundColor: "rgb(235 235 235)" }}
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: "48%", height: "60px", backgroundColor: "#fff", borderRadius: "8px" }}
                                    >
                                        <div style={{ fontWeight: 600, fontSize: "12px" }} >STUDENTS COUNT</div>
                                        <CountUp style={{ color: "#384252", fontWeight: 900, fontSize: "25px" }} end={studentsCount} duration={4} />
                                    </div>
                                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: "48%", height: "60px", backgroundColor: "#fff", borderRadius: "8px" }}
                                    >
                                        <div style={{ fontWeight: 600, fontSize: "12px" }} >SCHEDULED TASKS</div>
                                        <div style={{ color: taskPercentage < 50 ? "#fe0557" : (taskPercentage > 50 && taskPercentage < 100) ? "#1677ff" : "#52c41a", fontWeight: 900, fontSize: "23px" }}
                                            className="d-flex align-items-end w-75 justify-content-end" >
                                            <CountUp end={tasksCount} duration={2} />
                                            <div style={{ opacity: 0.4, fontSize: "10px", fontWeight: 900, marginLeft: "5px" }} > out of {totalTasks}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 w-100 d-flex align-items-center justify-content-between" >
                                    <div className="d-flex flex-column align-items-start w-75">
                                        <div className="d-flex align-items-center justify-content-between w-100" >
                                            <div style={{ fontWeight: 600, fontSize: "14px", color: "rgb(171, 171, 171)" }} >Total number of days :</div>
                                            <div style={{ fontWeight: 600, fontSize: "14px", color: "#000000", marginLeft: "5px" }} >{courseDurationInDays} days</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <div style={{ fontWeight: 600, fontSize: "14px", color: "rgb(171, 171, 171)" }} >Days completed :</div>
                                            <div style={{ fontWeight: 600, fontSize: "14px", color: "#000000", marginLeft: "5px" }} >{daysCompleted} days</div>
                                        </div>
                                    </div>
                                    <Progress type="dashboard" format={(format) => `${progressCalc} %`} style={{ margin: 0 }} size={'small'} percent={progressCalc} status={progressCalc < 25 ? "exception" : (progressCalc > 25 && progressCalc < 75) ? "active" : "success"} />
                                </div>
                                <div className="mb-1 mt-3 w-100 h-0" style={{ borderBottom: "1px dashed grey" }} />
                                <div className="mt-2 w-100 d-flex align-items-center justify-content-between">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Segmented: {
                                                    itemSelectedBg: items.batch_status === "Active" ? "#e9f2f9" : "#ff4e50",
                                                    itemSelectedColor: items.batch_status === 'Active' ? "#036564" : "#fff",
                                                    colorBgLayout: "#cccccc",
                                                }
                                            }
                                        }}
                                    >
                                        <Segmented value={items.batch_status} style={{ fontWeight: 700, border: "none" }}
                                            onChange={(e: any) =>
                                                setShowSwitchModal({
                                                    isOpen: true,
                                                    content: {
                                                        batchId: items.batch_unique_id,
                                                        status: e,
                                                        courseCompleted: progressCalc,
                                                        tasksCount,
                                                        totalTasks,
                                                    }
                                                })}
                                            size='small' options={['Active', 'Over']}
                                        />
                                    </ConfigProvider>
                                    <div >
                                        {index === hoveredBatch && <>
                                            <img src={EditIcon} style={{borderBottom:"2px solid grey"}}
                                                onClick={(e: any) => {
                                                    e.stopPropagation();
                                                    setEditBatchDetails({
                                                        batchUniqueId: items.batch_unique_id,
                                                        batchName: items.batch_name,
                                                        startDate: items.start_date,
                                                        timings: items.timings,
                                                        courseId: items.course_id,
                                                        students: JSON.parse(items.students)
                                                    }); setStudentsList(JSON.parse(items.students))
                                                    setShowModalFor({ ...showModalFor, edit: true })
                                                }}
                                                alt="edit" height={25} width={25}
                                            />
                                            {/* <img src={DeleteIcon} onClick={() => {
                                                setShowModalFor({
                                                    ...showModalFor, delete: true, selectedBatchforDelete: {
                                                        batchName: batch.batch_name,
                                                        batchUniqueId: batch.batch_unique_id,
                                                    }
                                                })
                                            }} alt="delete" height={15} width={15} /> */}
                                        </>}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                {!batches && <div className="w-100 d-flex align-items-center justify-content-center" >
                    <Skeleton className="w-75" active />
                </div>}
                {batches && batches.length <= 0 && <div className="w-100 d-flex align-items-center justify-content-center" >
                    <Empty />
                </div>}

            </div>
            <Modal
                className="modal-md"
                title="Change Batch Status"
                closable={false}
                open={showSwitchModal.isOpen}
                footer={
                    <div>
                        <Button
                            onClick={() => setShowSwitchModal({
                                isOpen: false,
                                content: null
                            })}
                        >
                            Cancel
                        </Button>
                        <Button
                            style={{ 
                                background: showSwitchModal.content?.status === "Over" ?  "red" : "rgb(0, 91, 197)", 
                                color: "white", fontWeight: 700
                            }}
                            onClick={updateStatus}
                        >
                            {showSwitchModal?.content?.status === 'Over' ? "OVER" : "ACTIVE"}
                        </Button>
                    </div>
                }
            >
                {showSwitchModal.content?.status === 'Over' &&
                    <div>
                        <div style={{fontSize:"15px"}} >Only <span style={{fontWeight:700, color:'red'}} >{showSwitchModal.content?.courseCompleted}%</span> of course is completed.</div>
                        <div style={{fontSize:"15px"}} >Only <span style={{fontWeight:700, color:"rgb(0, 91, 197)"}} >{showSwitchModal.content?.tasksCount || 0} out of {showSwitchModal.content?.totalTasks}</span> are scheduled.</div>
                    </div>}
                <div className="mt-3" >Are you sure you want to change the status?</div>
            </Modal>
        </React.Fragment >
    )
}

export default RenderBatches;

export function cardContent(label: string, value: string) {
    return (
        <div style={cContent} className="col-12 d-flex align-items-center justify-content-between">
            <div style={cLabel}>{label} : </div>
            <div style={cValue} >
                {value}
            </div>
        </div>
    )
}

const cValue = { fontSize: "12px", fontWeight: 700, color: "#000000" };
const cLabel = { color: "#ababab", fontSize: "12px", marginRight: "5px", fontWeight: 600 };
const cContent = { textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" as const };

const bMainContent = {
    height: "340px",
    cursor: "pointer",
    width: "400px",
    padding: "20px",
    background: "#fff",
    borderRadius: "8px",
};
const bNameTruncate = {
    fontWeight: 700,
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis" as const,
    textTransform: "capitalize" as const,
};