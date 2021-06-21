import "./login.css";
import {Content} from "antd/es/layout/layout";
import {Button, Checkbox, Col, Form, Input, notification, Progress, Row} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import {apiUrl} from "../../config/const";
import {getCookie, removeCookie, setCookie} from "../../util/cookie";
import {useEffect, useState} from "react";

function Login() {
    const [percent, setPercent] = useState(0);
    const [values, setValues] = useState([]);

    const openNotification = () => {
        notification.error({
            message: "ошибка авторизации",
            description: "Введен неверный логин или пароль. Попробуй еще раз"
        });
    };

    useEffect(() => {
        if (percent === 100) {
            setPercent(0);
            onFinish(values);
        }
    }, [percent]);

    const onFinishProgress = (values) => {
        setValues(values);
        let counter = 1;
        const interval = setInterval(() => {
            counter++;
            setPercent(counter);
            if (counter === 100) {
                clearInterval(interval);
            }
        }, 10);
    }

    const onFinish = (values) => {
        axios.post(`${apiUrl}/call-center/auth/login`, {
            login: values.username,
            password: values.password
        }).then(res => {
            if (res.status === 200 && res.data) {
                setCookie("token", "Bearer " + res.data);

                axios.get(`${apiUrl}/call-center/auth/getUser`, {
                    headers: {
                        common: {
                            Authorization: getCookie("token")
                        }
                    }
                }).then(res => {
                    if (res.status === 200 && res.data) {
                        setCookie("userInfo", JSON.stringify(res.data));
                        setCookie("lang", "ru");

                        window.location = "/";
                    } else {
                        removeCookie("token");
                        removeCookie("userInfo");
                        removeCookie("lang");
                        openNotification();
                    }

                }).catch(err => {
                    console.log(err);
                });
            } else {
                removeCookie("token");
                removeCookie("userInfo");
                removeCookie("lang");
                openNotification();
            }
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <Content>
            <div className="site-layout-content">
                <Progress
                    strokeColor={{
                        '0%': '#A9A9A9',
                        '100%': '#4079FE',
                    }}
                    percent={percent}
                    size={"small"}
                    showInfo={false}
                />
                <Row style={{margin: "auto", marginTop: 200}}>
                    <Col xs={24} md={4} className={"login-area"}>
                        <Form
                            name="login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinishProgress}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Введите свой логин!',
                                    },
                                ]}
                            >
                                <Input className={"login-input"} size={"large"}
                                       prefix={<UserOutlined className="site-form-item-icon"/>}
                                       placeholder="Логин"/>
                            </Form.Item>
                            <br/>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Введите свой пароль!',
                                    },
                                ]}
                            >
                                <Input
                                    size={"large"}
                                    className={"login-input"}
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="Парол"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Запомнить логин и пароль</Checkbox>
                                </Form.Item>
                            </Form.Item>

                            <Form.Item>
                                <Button type={"primary"} htmlType="submit" className="login-form-button">
                                    вход
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Content>
    );
}

export default Login;