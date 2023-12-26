import React, { useEffect, useState } from "react";
import { contentTitle } from "../common/helper functions/contentTitle";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";
import { getAllTasks, getUsers } from "./analyticsApis";
import './index.css';
import { stringToHslColor } from "../common/helper functions/utils";
import { useNavigate } from "react-router-dom";

const defaultBShadow = "rgb(232 232 232) 3px 3px 6px 0px inset, rgb(237 234 234 / 50%) -3px -3px 6px 1px inset";
const hoverBoxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";


// const defaultBShadow = "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px";
// const hoverBoxShadow = "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px";

export function Analytics() {
    const { authToken } = useSelector((state: any) => ({
        authToken: state.userSession.authToken
    }))
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [users, setUsers] = useState<any>(null);
    const [hoveredUsers, setHoveredUsers] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const response = await getUsers(authToken)
            if (response) {
                setUsers(response)
            }
            const tResponse = await getAllTasks(authToken);
            if (tResponse) {
                dispatch({
                    type: "ALL_TASKS",
                    data: tResponse
                })
            }
        })()
    }, [])

    const onCardClick = (user:any) => {
        navigate(`/home/selectedUser/batches/${user.user_name}`)
        dispatch({
            type: "SELECTED_USER",
            data: user
        })
    }


    return (
        <React.Fragment>
            <div className="analytics d-flex flex-column align-items-center justify-content-center">
                {contentTitle('ANALYTICS (USERS)')}
                <div className="contents mt-3 mt-md-3 col-11 d-flex align-items-start justify-content-center" >
                    <div className="col-12 d-flex justify-content-start align-items-center flex-wrap" >
                        {users && users.length > 0 ? users.map((items: any, index: number) => {
                            const delay = index * 0.1 + "s";
                            const firstName = items?.first_name?.trim().charAt(0);
                            const lastName = items?.last_name?.trim().charAt(0);
                            const circleText = (firstName + lastName) || 'U'
                            return (
                                <div onClick={() => onCardClick(items)} key={index} onMouseEnter={() => setHoveredUsers(index)} onMouseLeave={() => setHoveredUsers(null)}
                                    className="d-flex flex-column align-items-center justify-content-center m-0 m-md-3 mt-3  slideIn"
                                    style={{
                                        ...bMainContent,
                                        animation: `slideIn .5s forwards ${delay}`,
                                        boxShadow: hoveredUsers === index ? hoverBoxShadow : defaultBShadow,
                                    }}>
                                    <div className="d-flex w-100 h-100">
                                        <div style={{ width: "18%" }}>
                                            <div style={{
                                                borderWidth: "2px",
                                                borderStyle: "solid",
                                                backgroundColor: stringToHslColor(circleText, 100, 60, 40),
                                                borderColor: stringToHslColor(circleText, 80, 60),
                                                color: stringToHslColor(circleText, 90, 30)
                                            }} className="user-circle" >{circleText}</div>
                                        </div>
                                        <div style={{ width: "82%" }} className="d-flex flex-column align-items-start "  >
                                            <div className="w-100 d-flex align-items-center justify-content-between" >
                                                <div className="userName" >{items?.first_name + " " + items?.last_name}</div>
                                                <div style={{ background: "#f0f2eb", padding: "0px 10px", height: "25px", borderRadius: "10px" }}
                                                    className="d-flex align-items-center justify-content-center">
                                                    <div className={items.is_admin ? "admin-dot" : "non-admin-dot"} ></div>
                                                    <div style={{
                                                        marginLeft: "8px",
                                                        color: items.is_admin ? "rgb(87, 181, 92)" : " rgb(181, 87, 87)",
                                                        fontWeight: 900, fontSize: "10px"
                                                    }} >{items.is_admin ? "ADMIN" : "USER"}</div>
                                                </div>

                                            </div>
                                            <div className="d-flex align-items-center justify-content-center" >
                                                <div style={{ fontWeight: 600, fontSize: "12px", color: "rgb(171, 171, 171)" }} >Username : </div>
                                                <div className="text-truncate" style={{ marginLeft: "10px", textAlign: "start", width: "180px", textTransform: "capitalize", fontWeight: 600, fontSize: "12px", color: "#000000" }} >{items?.user_name}</div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center" >
                                                <div style={{ fontWeight: 600, fontSize: "12px", color: "rgb(171, 171, 171)" }} >Email : </div>
                                                <div className="text-truncate" style={{ marginLeft: "10px", textAlign: "start", width: "220px", textTransform: "lowercase", fontWeight: 600, fontSize: "12px", color: "#000000" }} >{items?.email_id}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <div className="w-100 d-flex align-items-center justify-content-center">
                            <Skeleton className="w-75" active />
                        </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const bMainContent = {
    height: "100px",
    width: "385px",
    padding: "10px",
    cursor: "pointer",
    background: "#fff",
    borderRadius: "8px",
    border: "1px solid lightgrey",
};