import React from "react";
import SLA from '../../assets/image/sla.jpeg';
import { Row, Col, Image } from "react-bootstrap";
import RRPROJX from '../../assets/SVGs/rrprojx.svg';

const Footer = () => {
    return (
        <React.Fragment>
            <Row
                className="d-flex align-items-center justify-content-center"
                style={{ borderTop: "1px solid lightgrey" }}>
                <Col className="p-4 d-flex align-items-center justify-content-between" style={{ height: "60px" }} >
                    <Image src={SLA} fluid style={{ height: "60px", width: "60px" }} />
                    <div className="d-flex align-items-center">
                        <span style={{ fontSize: "10px", marginRight: "5px", color: "#a6a6a6" }}>Powered by</span>
                        <Image src={RRPROJX} style={{ height: "12px" }}></Image>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}



export default Footer;