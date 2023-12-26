import React, { useState } from "react";
import './index.css';
import { Image, Row, Col, Card, FloatingLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Image1 from '../assets/image/Image1.jpg';
import SLA from '../assets/image/sla.jpeg';
import RRPROJX from '../assets/SVGs/rrprojx.svg';
import { Button, notification } from 'antd'
import EyeOpen from '../assets/SVGs/eye-open.svg';
import EyeClosed from '../assets/SVGs/eye-closed.svg';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch } from "react-redux";
import { base_url } from "../config";

const boxShadow = "rgb(38, 57, 77) 0px 20px 30px -10px"


const LoginPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [emptyError, setEmptyError] = useState({
        emailId: false,
        password: false,
        invalidUser: false,
    });

    const loginFunc = async () => {
        if (emailId !== '' && password !== '') {
            let loginCredentials = {
                userEmailId: emailId,
                password: password
            }
            try {
                await axios.post(`${base_url}/authentication`, loginCredentials).then((res: any) => {
                    if (res.data.authentication === true) {
                        setEmptyError(prev => ({ ...prev, invalidUser: false }))
                        dispatch({
                            type: 'LOGIN_CREDENTIALS',
                            userDetails: res.data.userDetails,
                            token: res.data.token
                        })
                        navigate('/home/course')
                    } else {
                        setEmptyError(prev => ({ ...prev, invalidUser: true }))
                    }
                }).catch((err) => {
                    notification.error({ message: err?.message })
                })
            } catch (err: any) {
                console.error(err)
                notification.error({ message: err?.message })
            }

        } else {
            if (emailId === '') {
                setEmptyError(prevState => ({ ...prevState, emailId: true }))
            }
            if (password === '') {
                setEmptyError(prevState => ({ ...prevState, password: true }))
            }
        }
    }

    return (
        <React.Fragment>
            <Row style={{ position: "relative" }}
                className="vh-100 d-flex align-items-center justify-content-end" >
                <Col xs={0} sm={0} md={12} className="p-0 vh-100 d-none d-md-block"  >
                    <div className="h-100 d-flex align-items-center justify-content-center">
                        <Image src={Image1} fluid style={{ height: "100%", width: "100%" }} ></Image>
                    </div>
                </Col>
                <Col
                    className="position-absolute d-flex align-items-center  justify-content-center"
                    xs={12} sm={10} md={5}
                >
                    <Card className="col-md-9 col-sm-9 col-xs-12"
                        style={{ padding: "10px", borderRadius: "10px", boxShadow: boxShadow }}
                    >
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                            <Card.Title className="d-flex flex-column align-items-center justify-content-center">
                                <Image src={SLA} fluid className="w-50" />
                            </Card.Title>
                            <Card.Text className="d-flex flex-column w-100">
                                <span style={{ fontSize: "18px", fontWeight: 600 }} >Welcome back!</span>
                                <span style={{ fontSize: "14px", color: "#6c6c6c", fontWeight: 400 }}>
                                    Login with your email id and provided password.
                                </span>
                            </Card.Text>
                            <FloatingLabel
                                controlId="floatingEmailInput"
                                label="Email address"
                                className="w-100 mb-3"
                            >
                                <Form.Control required
                                    onChange={(e) => { setEmailId(e.target.value); setEmptyError({ ...emptyError, emailId: false }) }}
                                    type="email" placeholder="name@example.com"
                                />
                                {emptyError.emailId && <div style={{textAlign:"start", fontSize: "12px", fontWeight: 700, color: "red" }}>Enter your email id</div>}
                            </FloatingLabel>
                            <FloatingLabel
                                className="w-100 mb-3"
                                controlId="floatingPasswordInput"
                                label="Password"
                                style={{position: "relative", height: "40px" }}
                            >
                                <Form.Control required
                                    onChange={(e) => { setPassword(e.target.value); setEmptyError({ ...emptyError, password: false, invalidUser: false }) }}
                                    type={showPassword ? "text" : "password"} placeholder="Password"
                                />
                                <img src={showPassword ? EyeOpen : EyeClosed} onClick={() => setShowPassword(!showPassword)}
                                    style={{position:"absolute", top: 22, right: 22}}
                                />
                                {emptyError.password && <div style={{textAlign:"start", fontSize: "12px", fontWeight: 700, color: "red" }}>Enter your password</div>}
                                {emptyError.invalidUser && <div style={{textAlign:"start", fontSize: "12px", fontWeight: 700, color: "red" }}>Invalid login credentials!</div>}
                            </FloatingLabel>
                            <Card.Text className="w-100 mt-4">
                                <Button
                                    onClick={() => 
                                        {loginFunc();}
                                    }
                                    style={{ height: "50px", width: "100%", backgroundColor: "#005bc5", color: "white", fontWeight: 700 }}>
                                    LOGIN
                                </Button>
                            </Card.Text>
                            <div className="w-100 mt-4 d-flex align-items-center justify-content-end">
                                <span style={{ fontSize: "10px", marginRight: "5px", color: "#a6a6a6" }}>Powered by</span>
                                <Image src={RRPROJX} style={{ height: "12px" }}></Image>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default LoginPage;