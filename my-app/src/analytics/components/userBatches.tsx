import React, { useEffect, useState } from "react";
import { contentTitle } from "../../common/helper functions/contentTitle";
import { useSelector } from "react-redux";
import { getuserBatches } from "../analyticsApis";
import { Empty, Progress, Skeleton } from "antd";
import moment from "moment";
import CountUp from "react-countup";


// const defaultBShadow = "rgb(232 232 232) 3px 3px 6px 0px inset, rgb(237 234 234 / 50%) -3px -3px 6px 1px inset";
// const hoverBoxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";

const defaultBShadow = 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px'
const hoverBoxShadow = "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px";



function UserBatches(props: any) {
    const { authToken, selectedUser, courses, allTasks, userDetails } = useSelector((state: any) => ({
        authToken: state.userSession.authToken,
        selectedUser: state.analyticsStates.selectedUser,
        courses: state.commonStates.courses,
        allTasks: state.analyticsStates.allTasks,
        userDetails: state.userSession.userDetails
    }))
    const [userBatches, setUserBatches] = useState<any>(null);
    const [hoveredBatch, setHoveredBatch] = useState<any>(null);
    useEffect(() => {
        (async () => {
            const response = await getuserBatches({ authToken, emailId: selectedUser.email_id })
            if (response) {
                setUserBatches(response)
            }
        })()
    }, [selectedUser])
    console.log({userDetails})
    return (
        <React.Fragment>
            <div className="analytics d-flex flex-column align-items-center justify-content-center">
                {contentTitle(`${(selectedUser?.first_name).toUpperCase() + " " + (selectedUser?.last_name).toUpperCase()} - BATCHES`)}
                <div className="contents mt-3 mt-md-3 col-12 d-flex align-items-start justify-content-center" >
                    <div className="col-12 d-flex justify-content-center align-items-center flex-wrap" >
                        {userBatches && userBatches?.length > 0 &&
                            userBatches.map((items: any, index: number) => {
                                const courseName = courses?.filter((cItems: any) => cItems.course_id === items.course_id)[0].course_name
                                const courseDurationInDays = courses?.filter((cItems: any) => cItems.course_id === items.course_id)[0].duration * 30
                                const startedDate = moment(items.start_date).format('MMM Do, YYYY')
                                const studentsCount = JSON.parse(items?.students)?.length
                                const tasksCount = (items?.scheduled_tasks)?.length
                                const totalTasks = allTasks?.filter((tItems:any) => tItems.course_id === items.course_id).length
                                const today = moment();
                                const course_startedDate = moment(items.start_date)
                                const daysCompleted = today.diff(course_startedDate, 'days')
                                const progressCalc = Math.round((daysCompleted/courseDurationInDays) * 100) || 0
                                const taskPercentage = Math.round((tasksCount/totalTasks) * 100) || 0
                                const delay = index * 0.1 + "s";
                                return (
                                    <div
                                        // onClick={() => onCardClick(items)} 
                                        key={index} onMouseEnter={() => setHoveredBatch(index)} onMouseLeave={() => setHoveredBatch(null)}
                                        className="d-flex flex-column align-items-center  m-0 m-md-3 mt-3  slideIn"
                                        style={{
                                            ...bMainContent,
                                            animation: `slideIn .5s forwards ${delay}`,
                                            boxShadow: hoveredBatch === index ? hoverBoxShadow : defaultBShadow,
                                        }}>
                                        <div className="w-100 d-flex align-items-start" >
                                            <div title={items.batch_name} className="text-truncate" style={{ fontWeight: 700, fontSize: "18px", color: "#000000", textTransform: "uppercase" }} >{items.batch_name}</div>
                                        </div>
                                        <div className="mb-2 mt-2 w-100 h-0" style={{ borderBottom: "1px dashed grey" }} />
                                        <div className="w-100 d-flex align-items-start justify-content-between" >
                                            <div style={{ textAlign: "start", width: "108px", fontWeight: 600, fontSize: "14px", color: "rgb(171, 171, 171)" }} >Course Name :</div>
                                            <div className="ms-2 text-truncate" title={courseName}
                                                style={{fontWeight: 700, fontSize: "14px", color: "#000000", textTransform: "capitalize" }}
                                            >
                                                {courseName}
                                            </div>
                                        </div>
                                        <div className="mt-2 w-100 d-flex align-items-start justify-content-between " >
                                            <div style={{ textAlign: "start", width: "108px", fontWeight: 600, fontSize: "14px", color: "rgb(171, 171, 171)" }} >Started at :</div>
                                            <div
                                                style={{ textAlign: "start", fontWeight: 700, fontSize: "14px", color: "#000000", textTransform: "capitalize" }}
                                            >
                                                {startedDate}
                                            </div>
                                        </div>
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
                                            style={{padding:"0px 8px", height:"75px", borderRadius:"12px", backgroundColor:"rgb(235 235 235)"}} 
                                        >
                                            <div className="d-flex flex-column align-items-center justify-content-center" style={{ width:"48%", height:"60px", backgroundColor:"#fff", borderRadius:"8px"}}
                                            >
                                                <div style={{fontWeight:600, fontSize:"12px"}} >STUDENTS COUNT</div>
                                                <CountUp style={{color:"#384252", fontWeight:900, fontSize:"25px"}} end={studentsCount} duration={4}  />
                                            </div>
                                            <div className="d-flex flex-column align-items-center justify-content-center" style={{width:"48%", height:"60px", backgroundColor:"#fff", borderRadius:"8px"}}
                                            >
                                                <div style={{fontWeight:600, fontSize:"12px"}} >SCHEDULED TASKS</div>
                                                <div style={{color: taskPercentage < 50 ? "#fe0557" : (taskPercentage > 50 && taskPercentage < 100) ? "#1677ff" : "#52c41a", fontWeight:900, fontSize:"23px"}}
                                                    className="d-flex align-items-end w-75 justify-content-end" >
                                                    <CountUp  end={tasksCount} duration={2} />
                                                    <div style={{opacity:0.4, fontSize:"10px", fontWeight:900, marginLeft:"5px"}} > out of {totalTasks}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 w-100 d-flex align-items-center justify-content-between" >
                                            <div className="d-flex flex-column align-items-start w-75">
                                                <div className="d-flex align-items-center justify-content-between w-100" >
                                                    <div style={{fontWeight: 600, fontSize: "14px", color: "rgb(171, 171, 171)"}} >Total number of days :</div>
                                                    <div style={{fontWeight: 600, fontSize: "14px", color: "#000000", marginLeft:"5px"}} >{courseDurationInDays} days</div>
                                                </div>
                                                <div  className="d-flex align-items-center justify-content-between w-100">
                                                    <div style={{fontWeight: 600, fontSize: "14px", color: "rgb(171, 171, 171)"}} >Days completed :</div>
                                                    <div style={{fontWeight: 600, fontSize: "14px", color: "#000000", marginLeft:"5px"}} >{daysCompleted} days</div>
                                                </div>
                                            </div>
                                            <Progress type="dashboard" format={(format) => `${progressCalc} %`} style={{margin:0}} size={'small'} percent={progressCalc} status={progressCalc < 25 ? "exception" : (progressCalc > 25 && progressCalc < 75) ?  "active"  : "success"} />
                                        </div>
                                    </div>
                                )
                            })}
                            {!userBatches && <div className="w-100 d-flex align-items-center justify-content-center" >
                                <Skeleton className="w-75" active />
                            </div>}
                            {userBatches && userBatches.length <= 0 && <div className="w-100 d-flex align-items-center justify-content-center" >
                                <Empty  />
                            </div>}

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserBatches;

const bMainContent = {
    height: "340px",
    cursor: "pointer",
    width: "400px",
    padding: "20px",
    background: "#fff",
    borderRadius: "8px",
    // border: "1px solid lightgrey",
};