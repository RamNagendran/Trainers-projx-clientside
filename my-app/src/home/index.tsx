import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import StaticHeader from "../common/headerFooter/staticHeader";
import MenuBar from "../common/menuBar";
import { Outlet } from "react-router-dom";
import MutatedHeader from "../common/headerFooter/mutatedHeader";
import { Col, Row } from "react-bootstrap";

const HomePage = (props: any) => { 
    return (
        <React.Fragment>
            <div className="vh-100 d-flex flex-column">
                <StaticHeader />
                <div className="h-100 d-flex">
                    <MenuBar />
                    <Row className="w-100 r g-0 d-flex flex-column" style={{ background: "rgb(231 231 231)" }}>
                        <Col>
                            <MutatedHeader />
                            <Outlet />
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    )
}

export default HomePage;



