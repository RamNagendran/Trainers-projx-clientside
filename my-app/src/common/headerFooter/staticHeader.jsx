import React from "react";
import { Image } from "react-bootstrap";
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Popover from 'react-bootstrap/Popover';
import SLAICON from '../../assets/image/sla.jpeg'
import RRPROJX from '../../assets/SVGs/rrprojx.svg';

function StaticHeader() {


    return (
        <React.Fragment>
            <div className="p-1 p-sm-3 d-flex align-items-center justify-content-between" style={{ height: "40px" }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image src={SLAICON} fluid style={{ height: "50px", width: "60px" }} />
                </div>
                <div className="d-flex align-items-center">
                    <span style={{ fontSize: "10px", marginRight: "5px", color: "#a6a6a6" }}>Powered by</span>
                    <Image src={RRPROJX} style={{ height: "12px" }}></Image>
                </div>
            </div>
        </React.Fragment>
    )
}


export default StaticHeader;