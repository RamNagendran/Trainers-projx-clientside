import React, { useState } from "react"
import { Image } from "react-bootstrap";
import Popover from 'react-bootstrap/Popover';
import { useLocation } from "react-router-dom";
import MenuBar from '../../assets/SVGs/menu.svg';
import UserIcon from "../../assets/SVGs/user.svg";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useSelector } from "react-redux";

const MutatedHeader = (props: any) => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const {userDetails} = useSelector( (state:any) => state.userSession)
    console.log(userDetails)

    const popover = (
        <Popover id="popover-basic" >
            <Popover.Header as="h3">{userDetails?.first_name + " " + userDetails?.last_name}</Popover.Header>
            <Popover.Body>
            <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold" style={{fontSize:"12px", marginRight:"10px"}}>USER NAME : </span> 
                    <span >{userDetails?.user_name}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold" style={{fontSize:"12px", marginRight:"10px"}}>USER ID : </span> 
                    <span>{userDetails?.user_id}</span>
                </div>
                <div className="d-flex flex-column align-items-start mt-3">
                    <span className="fw-bold" style={{fontSize:"12px", marginRight:"10px"}}>EMAIL : </span> 
                    <span >{userDetails?.user_emailId}</span>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <React.Fragment>
            <div className="p-1 p-sm-1 pt-4 pb-4  d-flex align-items-center justify-content-between" style={{background:"rgb(0, 91, 197)", height: "35px" }} >
                <div className="d-flex align-items-center" >
                    <div
                        onClick={() => setOpen(true)}
                        style={{ background: "white", borderRadius: "5px" }}
                        className="d-flex d-sm-none align-items-center justify-content-center p-1"
                    >
                        <Image src={MenuBar} fluid height={20} width={20} ></Image>
                    </div>
                    <div style={locationStyle}>
                        {location.pathname.slice(1).split('/')[1]}
                    </div>
                </div>
                <OverlayTrigger trigger="click" placement="bottom-end" overlay={popover}>
                    <div title={userDetails?.user_name} className="d-flex align-items-center"
                        style={userWrapper}>
                        <Image src={UserIcon} fluid
                            style={userIconStyle}
                        />
                        {/* <div className="d-none d-md-block" style={userNameStyle}>{userDetails.user_name}</div> */}
                    </div>
                </OverlayTrigger>
            </div>
        </React.Fragment>
    )
}

export default MutatedHeader;

const locationStyle: any = {
    marginLeft: "10px",
    color: "white",
    textTransform: "upperCase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700
}

const userWrapper = {
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
}

const userIconStyle = {
    background: "white",
    borderRadius: "25px",
    height: "22px",
    marginRight: "20px"
}