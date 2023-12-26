import { Button, DatePicker, DatePickerProps, Input, Select, TimePicker } from "antd";
import React from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { smallDivider } from "../common/helper functions/contentTitle";
import dayjs from 'dayjs'; 

interface NewBatchContents {
    batchName: string;
    startDate: string;
    timings: string;
    courseId: string;
    students: any[]
}

interface AddBatchDetails {
    studentsList: any[];
    setStudentsList: (data:any) => void;
    batchDetails: NewBatchContents;
    setBatchDetails: (batchDetails: any) => void;
    courses: any;
    emptyError: boolean;
    showModalFor: any;
    setShowModalFor: (data: any) => void;
    spreadSheetDetails?: any;
    setSpreadSheetDetails?: (data: any) => void;
}

const STUDENT_COUNT_LABEL = "NUMBER OF STUDENTS";
const STUDENT_COUNT_PLACEHOLDER = "Enter number of students";
const BATCH_LABEL = "BATCH NAME";
const BATCH_LABEL_PLACEHOLDER = "Enter batch name";
const START_DATE_PLACEHOLDER = "CHOOSE START DATE";
const CHOOSE_COURSE_PLACEHOLDER = "CHOOSE COURSE";

function BatchFields(props: AddBatchDetails) {
    const { batchDetails, setBatchDetails, courses, emptyError, showModalFor, setShowModalFor, setStudentsList, studentsList } = props;
    const { Option } = Select;
    
    const startTime = batchDetails.timings !== '' && dayjs(batchDetails?.timings?.split("-")[0]?.trim(), "hh:mm A");
    const endTime = batchDetails.timings !== '' && dayjs(batchDetails?.timings?.split("-")[1]?.trim(), "hh:mm A");
    const timingsValue:any = [startTime, endTime];

    const filterOption = (input: any, option: any) =>
        (option?.children ?? '').toLowerCase().includes(input.toLowerCase());

    const onDatePickerChange: DatePickerProps['onChange'] = (date: any, dateString: string) => {
        setBatchDetails({
            ...batchDetails,
            startDate: dateString,
        })
    }

    const handleTimeRangeChange = (timeRange: any) => {
        if (timeRange?.length > 0) {
            const formattedTiming = `${timeRange[0]?.format("HH:mm A")} - ${timeRange[1]?.format("HH:mm A")}`
            setBatchDetails({ ...batchDetails, timings: formattedTiming })
        }
    };

    return (
        <React.Fragment>
            {!showModalFor.addStudents && <>
                <FloatingLabel
                    controlId="floatingBatchNameInput"
                    label={BATCH_LABEL}
                    className="w-100 mb-3"
                >
                    <Form.Control required style={borderStyle}
                        value={batchDetails.batchName}
                        onChange={(e) => setBatchDetails({ ...batchDetails, batchName: e.target.value })}
                        type="text" placeholder={BATCH_LABEL_PLACEHOLDER}
                    />
                </FloatingLabel>
                {smallDivider('START DATE AND TIMINGS')}
                <div className="mb-3 w-100 d-flex flex-column flex-md-row align-items-center justify-content-between">
                    <div className="mx-1 mb-3 mb-md-0 w-100 w-md-50" >
                        <DatePicker
                            value={batchDetails.startDate !== '' ? dayjs(batchDetails.startDate) : null}
                            style={borderStyle}
                            className="w-100"
                            placeholder={START_DATE_PLACEHOLDER}
                            onChange={onDatePickerChange}
                        />
                    </div>
                    <div className="mx-1 w-100 w-md-50 d-flex align-items-center justify-content-end">
                        <TimePicker.RangePicker use12Hours className="w-100"
                            value={timingsValue}
                            format="hh:mm A" style={borderStyle}
                            onChange={handleTimeRangeChange}
                        />
                    </div>
                </div>
                {smallDivider('CHOOSE COURSES AND STUDENT COUNTS')}
                <Select
                    className="w-100 mb-3"
                    showSearch
                    placeholder={CHOOSE_COURSE_PLACEHOLDER}
                    optionFilterProp="children"
                    onChange={(e) => setBatchDetails({
                        ...batchDetails,
                        courseId: e
                    })}
                    value={batchDetails.courseId || null}
                    filterOption={filterOption}
                >
                    {courses?.map((course: any, index: number) => {
                        return <Option key={index} value={course.course_id}>{course.course_name}</Option>
                    })}
                </Select>
                    {/* <FloatingLabel
                        controlId="floatingBatchstudentCountInput"
                        label={STUDENT_COUNT_LABEL}
                        className="w-100 mb-3"
                    >
                        <Form.Control required style={borderStyle}
                            value={batchDetails.studentsCount}
                            onChange={(e) => setBatchDetails({ ...batchDetails, studentsCount: e.target.value })}
                            type="number" placeholder={STUDENT_COUNT_PLACEHOLDER}
                        />
                    </FloatingLabel> */}
                <div className=" w-100 d-flex  align-items-center justify-content-between" >
                    <Button style={addStudentText} onClick={() => setShowModalFor({ ...showModalFor, addStudents: true })} >STUDENTS</Button>
                    {studentsList.length > 0 && <div style={studentsCountStyle} >{studentsList.length} - {studentsList.length > 1 ? "STUDENTS" : "STUDENT"} ADDED</div>}
                </div>
                {emptyError && <div style={{ ...errorMsg, textAlign: "center" }}>All fields should be filled and atleast one student should be added!!</div>}
            </>}
            {showModalFor.addStudents && <>
                <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100" >
                    {studentsList.length > 0 && studentsList.map((items: any, index: number) => {
                        return (
                            <div key={index} style={{ marginBottom: "10px" }} className="d-flex align-items-center justify-content-between w-100">
                                <div style={{ width: "35px", fontSize: "14px" }} >{index + 1}.</div>
                                <Input
                                    value={items.name}
                                    onChange={(e) => {
                                        setStudentsList(studentsList.map((data: any, i: number) =>
                                            index === i ? { ...data, name: e.target.value } : data
                                        ))
                                    }}
                                    style={{ marginRight: "10px" }} placeholder="Enter Student Name" className="w-50" />
                                <Input
                                    value={items.email}
                                    onChange={(e) => {
                                        setStudentsList(studentsList.map((data: any, i: number) =>
                                            index === i ? { ...data, email: e.target.value } : data
                                        ))
                                    }}
                                    placeholder="Enter Student Email id" className="w-50" />
                                <div style={closeStyle}
                                    onClick={() => {
                                        setStudentsList(studentsList.filter((data: any, i: number) => index !== i))
                                    }}
                                >✕</div>
                            </div>
                        )
                    })}
                    <div style={{ borderTop: "1px solid lightgrey", paddingTop: "10px", marginTop: "10px" }}
                        className="d-flex align-items-center justify-content-start w-100">
                        <Button type="primary" className="d-flex align-items-center justify-content-center" style={{ fontSize: "15px" }}
                            onClick={() =>  setStudentsList((prev:any) => ([...prev, {name: '', email: ''}])) } >✚</Button>
                    </div>
                </div>
            </>}
        </React.Fragment>
    )
}

export default BatchFields;

const errorMsg = { fontSize: "12px", fontWeight: 600, color: "red" };
const borderStyle = { border: "1px solid lightgrey" };
const addStudentText = { cursor: "pointer", fontSize: "13px", fontWeight: 800, color: "#f27435",  }
const closeStyle = { marginLeft: "5px", fontWeight: 900, cursor: "pointer", fontSize: "10px", color: "#fff", height: "20px", width: "22px", backgroundColor: "red", borderRadius: "50px", display: "flex", alignItems: "center", justifyContent: "center" }
const studentsCountStyle = {display:"flex", justifyContent:"center", alignItems:"center", fontSize:"12px", color:"rgb(62 75 213)", fontWeight:900, width:"35%"}