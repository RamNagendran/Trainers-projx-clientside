import './index.css';
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logout from '../../assets/SVGs/logout.svg';
import AddTaskIcon from '../../assets/SVGs/icn_addTask';
import ViewBatchIcon from '../../assets/SVGs/icn_viewBatches';
import ViewCourseIcon from '../../assets/SVGs/icn_viewCourse';
import AnalyzeIcon from '../../assets/SVGs/analyze_data';
import { useDispatch, useSelector } from 'react-redux';


function MenuBar(props: any) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const {userDetails} = useSelector((state:any) => ({
        userDetails: state.userSession.userDetails
    }))

    function logout() {
        dispatch({
            type: 'LOGIN_CREDENTIALS',
            userDetails: null,
            authToken: null,
        })
        dispatch({
            type: 'LOGOUT'
        })
        navigate('/')
    }

    return (
        <React.Fragment>
            <div className="menuBar d-none d-sm-flex flex-column align-items-center justify-content-between p-3" >
                <div className="mt-4" >
                    {!userDetails?.is_admin && <div style={{margin: "15px 0px"}} onClick={() => navigate('/home/batch')} title="batch" 
                        className={(location.pathname === '/home/batch' || (location.pathname).includes('/home/selected-batch')) ? "icon-box" : "preSelect-box"}>
                        <ViewBatchIcon stroke={(location.pathname === '/home/batch' || (location.pathname).includes('/home/selected-batch')) ? "#0a2463" : "#fff"} />
                    </div>}
                    <div style={{ margin: "15px 0px" }} title="course"
                        onClick={() => navigate('/home/course')}
                        className={
                            (location.pathname === '/home/course' ||
                                (location.pathname).includes('/home/tasks') ||
                                (location.pathname).includes('/home/view-task')
                            ) ? "icon-box" : "preSelect-box"
                        }
                    >
                        <ViewCourseIcon
                            stroke={
                                (location.pathname === '/home/course' ||
                                    (location.pathname).includes('/home/tasks') ||
                                    (location.pathname).includes('/home/view-task')
                                ) ? "#0a2463" : "#fff"
                            }
                        />
                    </div>
                    {!userDetails?.is_admin && <div
                        style={{ margin: "15px 0px" }} onClick={() => navigate('/home/add-task')} title="Add task" className={location.pathname === '/home/add-task' ? "icon-box" : "preSelect-box"}>
                        <AddTaskIcon stroke={location.pathname === '/home/add-task' ? "#0a2463" : "#fff"} />
                    </div>}
                    {userDetails?.is_admin && <div
                        style={{ margin: "15px 0px" }} onClick={() => navigate('/home/analytics')} title="Analytics" 
                        className={(location.pathname === '/home/analytics' || (location.pathname).includes('/home/selectedUser/batches')) ? "icon-box" : "preSelect-box"}>
                        <AnalyzeIcon stroke={(location.pathname === '/home/analytics' || (location.pathname).includes('/home/selectedUser/batches')) ? "#0a2463" : "#fff"} />
                    </div>}
                </div>
                <div onClick={logout} className="icon-box d-flex align-items-center justify-content-center">
                    <img src={Logout} height={25} width={25} alt="vw-course-icon" />
                </div>
            </div>
        </React.Fragment>
    )
}

export default MenuBar;
