import 'bootstrap/dist/css/bootstrap.min.css';
import { Select, Button } from "antd";
import { FloatingLabel } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { Editor } from "@monaco-editor/react";
import ImageUploading from "react-images-uploading";

export const taskFields =
    ({
        setOpenImage = (data) => {},
        images = [],
        setImages = (data) => { },
        courseName = '',
        courses = null,
        editorType = '',
        setEnableEdit = (data) => { },
        setEditorType = (data) => { },
        taskCredentials,
        setTaskCredentials = (data) => { },
        handleEditorValidation = (e) => { },
        disabled = false}
    ) => {
        const maxNumber = 3;
        const filterOption = (input, option) =>
            (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
        const { Option } = Select;

        const languages = [
            "HTML", "CSS", "JavaScript", "XML", "PHP",
            "C#", "C++", "Java", "Powershell", "Python"
        ];

        const onChange = (imageList, addUpdateIndex) => {
            setImages(imageList);
        };

        return (
            <>
                <div style={{
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    marginTop: "10px", border: "1px solid lightgrey", padding: "20px", borderRadius: "10px", background: "white"
                }} >
                    <Select
                        disabled={disabled}
                        style={{ textAlign: "start", width: "100%", height: "50px" }}
                        showSearch
                        placeholder="CHOOSE COURSE *"
                        optionFilterProp="children"
                        onChange={(e) => setTaskCredentials({
                            ...taskCredentials,
                            course_id: e
                        })}
                        value={taskCredentials?.course_id || null}
                        filterOption={filterOption}
                    >
                        {(courses && courses?.length > 0) && courses?.map((course, index) => {
                            return <Option key={index} value={course?.course_id}>{course?.course_name}</Option>
                        })}
                    </Select>
                    <FloatingLabel
                        controlId="floatingEmailInput"
                        label="TASK NAME *"
                        className="w-100 mb-3 mt-3 "
                    >
                        <Form.Control required value={taskCredentials?.taskName}
                            disabled={disabled}
                            onChange={(e) => setTaskCredentials({
                                ...taskCredentials,
                                taskName: e.target.value
                            })}
                            type="text" placeholder="Enter task name"
                        />
                    </FloatingLabel>
                    <div className="form-floating mb-3">
                        <textarea
                            disabled={disabled}
                            value={taskCredentials?.taskDescription || ''}
                            onChange={(e) => setTaskCredentials({ ...taskCredentials, taskDescription: e.target.value })}
                            className="form-control"
                            placeholder="Describe the task in a more detailed manner"
                            style={{ height: "200px" }}
                        />
                        <label htmlFor="floatingTextarea2">DESCRIPTION</label>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                        <Select
                            disabled={disabled}
                            style={{ width: "40%" }}
                            placeholder="CHOOSE SOLUTION TYPE"
                            onChange={(e) => {
                                setEditorType(e); setTaskCredentials(
                                    { ...taskCredentials, languageType: e === 'text' ? 'text' : 'javascript' , solution: '' }
                                );
                            }}
                            value={editorType}
                        >
                            <Option value={"text"} >Text</Option>
                            <Option value={"codeEditor"} >Code Editor</Option>
                        </Select>
                        {editorType === 'codeEditor' && <Select
                            disabled={disabled}
                            style={{ width: "40%" }}
                            placeholder="CHOOSE LANGUAGE"
                            onChange={(e) => setTaskCredentials({
                                ...taskCredentials,
                                languageType: e
                            })}
                            value={taskCredentials?.languageType || 'javascript'}
                        >
                            {languages.map((lang, index) => {
                                return <Option key={index} value={lang}>{lang}</Option>
                            })}
                        </Select>}
                    </div>
                    {editorType === 'text' && <div className="form-floating mt-3">
                        <textarea
                            disabled={disabled}
                            value={taskCredentials?.solution || ''}
                            onChange={(e) => setTaskCredentials({
                                ...taskCredentials,
                                solution: e.target.value
                            })}
                            className="form-control"
                            placeholder="Your solution should be here..."
                            style={{ height: "150px" }}
                        />
                        <label htmlFor="floatingTextarea2">TASK SOLUTION</label>
                    </div>}
                    {
                        editorType === 'codeEditor' && <>
                            <Editor className="mt-3" theme="vs-dark" height={"300px"}
                                language={taskCredentials?.languageType?.toLowerCase() || 'javascript'}
                                onChange={(e) => setTaskCredentials({
                                    ...taskCredentials,
                                    solution: e
                                })}
                                options={{
                                    readOnly: disabled, 
                                    fontSize: "20px",
                                    scrollBeyondLastLine: false
                                }}
                                value={taskCredentials?.solution}
                                defaultValue="// your solution should be here..."
                                onValidate={handleEditorValidation}
                            />
                        </>
                    }
                    <div className='mt-4 d-flex flex-column align-items-start justify-content-center'>
                        <div>Image Uploads<span style={{ fontSize: "12px", fontWeight: 600 }} >(max - 3)</span>:</div>
                        <ImageUploading
                            multiple
                            value={images}
                            onChange={onChange}
                            maxNumber={maxNumber}
                            dataURLKey="data_url"
                            acceptType={["jpg", "png", "jpeg", 'pdf']}
                        >
                            {({
                                imageList,
                                onImageUpload,
                                onImageRemove,
                                isDragging,
                                dragProps
                            }) => (
                                <div className='mt-4 d-flex flex-column align-items-start justify-content-start' >
                                    <Button
                                        disabled={disabled || images.length === 3}
                                        type='primary'
                                        style={isDragging ? { color: "red" } : null}
                                        onClick={onImageUpload}
                                        {...dragProps}
                                    >
                                        Upload
                                    </Button>
                                    <div className='mt-4 d-flex align-items-center ' >
                                        {imageList.map((image, index) => (
                                            <div key={index} className="image-item">
                                                <div className='' style={{
                                                    position: "relative",
                                                    borderRadius: "10px",
                                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
                                                    border: "1px solid lightgrey", margin: "5px",
                                                }} >
                                                    <img onClick={() => setOpenImage(image.data_url)} src={image.data_url} alt="" width="100" className='m-2' />
                                                    <div onClick={() => {!disabled && onImageRemove(index)}} style={{...closeMark, cursor: disabled ? "not-allowed" : "pointer"}}>x</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </ImageUploading>
                    </div>
                </div>
            </>
        )
    }

const closeMark = {
    boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
    background: "red",
    color: "white",
    fontSize: "10px",
    position: "absolute",
    right: 0,
    top: 0,
    border: "1px solid white",
    borderRadius: "25px",
    height: "15px",
    width: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}
