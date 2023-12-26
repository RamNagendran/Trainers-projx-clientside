import 'bootstrap/dist/css/bootstrap.min.css';
import { FloatingLabel } from "react-bootstrap";
import Form from 'react-bootstrap/Form';

const COURSE_NAME_LABEL = "COURSE NAME";
const COURSE_NAME_PLACEHOLDER = "Enter course name";
const COURSE_DURATION_LABEL = "COURSE DURATION (in months)";
const COURSE_DURATION_PLACEHOLDER = "Enter course duration";
const DESCRIPTION_PLACEHOLDER = "Describe the content of the course"

export default function courseFields  (obj, setterFunc) {
    return (
        <>
            <FloatingLabel
                controlId="floatingEmailInput"
                label={COURSE_NAME_LABEL}
                className="w-100 mb-3"
            >
                <Form.Control required value={obj.courseName}
                    onChange={(e) => setterFunc({ ...obj, courseName: e.target.value })}
                    type="text" placeholder={COURSE_NAME_PLACEHOLDER}
                />
            </FloatingLabel>
            <FloatingLabel
                controlId="floatingEmailInput"
                label={COURSE_DURATION_LABEL}
                className="w-100 mb-3 mt-3 "
            >
                <Form.Control required value={obj.courseDuration}
                    onChange={(e) => setterFunc({ ...obj, courseDuration: e.target.value })}
                    type="number" 
                    placeholder={COURSE_DURATION_PLACEHOLDER}
                />
            </FloatingLabel>
            <div className="form-floating">
                <textarea
                    value={obj.description || ''}
                    onChange={(e) => setterFunc({ ...obj, description: e.target.value })}
                    className="form-control" placeholder={DESCRIPTION_PLACEHOLDER} 
                    style={{ height: "150px" }}
                />
                <label htmlFor="floatingTextarea2">DESCRIPTION</label>
            </div>
        </>
    )
}