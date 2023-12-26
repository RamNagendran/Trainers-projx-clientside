import './index.css';
import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { getAllTasks } from "./apiFunctions";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { CaretRightOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const Tasks = (props: any) => {
    const { authToken, selectedCourse } = useSelector((state: any) => ({
        authToken: state.userSession.authToken,
        selectedCourse: state.commonStates.selectedCourse
    }));
    const [showModalFor, setShowModalFor] = useState({
        edit: false,
        delete: false,
    });
    const [allTasks, setAllTasks] = useState<any>([]);
    const maxResults = 15;
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getTasks = async () => {
        const tasks: any = await getAllTasks({ offset, maxResults, authToken, selectedCourse_id: selectedCourse?.course_id })
        if (tasks && tasks?.length > 0) {
            setAllTasks((prevData: any) => [...prevData, ...tasks])
            dispatch({ type: 'ALL_TASKS_DATA', data: tasks });
            setOffset(offset + maxResults)
        }
        if (tasks?.length < 15) {
            setHasMore(false);
        }
    }

    useEffect(() => {
        if (selectedCourse?.course_id) {
            getTasks();
        }
    }, [])

    const handleCancel = () => {
        setShowModalFor({
            edit: false,
            delete: false,
        });
    }

    const onTaskClick =  (task:any) => {
        dispatch({
            type: 'SELECTED_TASK',
            data: task
        })
        navigate(`/home/view-tasks/${task.task_unique_id}`)
    }

    return (
        <React.Fragment>
            <div
                className="tasks"
                id="scrollableDiv"
            >
                <InfiniteScroll
                    className="d-flex align-items-center flex-column justify-content-center"
                    dataLength={allTasks?.length}
                    next={getTasks}
                    hasMore={hasMore}
                    loader={<h4 style={{ fontWeight: 500, fontSize: "18px", color: "rgb(123 123 123)", textAlign: 'center' }} >Loading...  </h4>}
                    endMessage={
                        allTasks?.length > 0 && <p style={{ fontWeight: 500, fontSize: "18px", color: "rgb(123 123 123)", textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    scrollableTarget="scrollableDiv"
                >
                    <div
                        className="taskContent d-flex flex-column align-items-center w-100"
                    >
                        <div className="col-md-7 col-lg-7 col-sm-11 col-11">
                            {
                                (allTasks && allTasks?.length > 0) ? allTasks?.map((data: any, index: number) => {
                                    const delay = index * 0.1 + "s";
                                    return (
                                        <div key={index} onClick={() => onTaskClick(data)}>
                                            <div
                                                // style={{animation: `slideIn .1s forwards ${delay}`}} 
                                                className="taskCard">
                                                <div className="taskName" >{data.task_name}</div>
                                                <CaretRightOutlined />
                                            </div>
                                        </div>
                                    )
                                }) : <Empty style={{ height: "calc(100vh - 150px)" }} className="d-flex flex-column align-items-center justify-content-center" />
                            }
                        </div>
                    </div>
                </InfiniteScroll>
            </div>
        </React.Fragment>
    )

}

export default Tasks;       