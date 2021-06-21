import {Avatar, Col, Dropdown, Menu, notification, Row, Space} from "antd";
import 'antd/dist/antd.css';
import "./appHeader.css";
import {Header} from "antd/lib/layout/layout";
import {
    BarChartOutlined,
    ClockCircleOutlined,
    CoffeeOutlined,
    DownOutlined,
    LoginOutlined,
    PhoneOutlined,
    PoweroffOutlined,
    SnippetsOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {getUser, setUserLang} from "../../store/reducer/user";
import {apiUrl} from "../../config/const";
import {getCookie, removeCookie, setCookie} from "../../util/cookie";
import axios from "axios";

function AppHeader({user_data, lang, textConstants, getUser, setUserLang}) {
    const logout = () => {
        axios.post(`${apiUrl}/call-center/auth/login`, {
            headers: {
                common: {
                    Authorization: getCookie("token")
                }
            }
        }).then(res => {
            if (res.status === 200 && res.data === 1) {
                removeCookie("token");
                removeCookie("lang");
                removeCookie("userInfo");
            } else {
                notification.error({
                    message: "ошибка выхода",
                    description: "произошла ошибка при выходе из системы"
                });
            }
        }).catch(err => {
            console.log(err);
        });

        removeCookie("token");
        removeCookie("lang");
        removeCookie("userInfo");
        window.location = "/login";
    }

    const setLang = (langCode) => {
        setCookie("lang", langCode);
        setUserLang(langCode);
    }

    const langs = (
        <Menu>
            <Menu.Item onClick={() => {
                setLang("uz")
            }}>
                ўзбек
            </Menu.Item>
            <Menu.Item onClick={() => {
                setLang("ru")
            }}>
                рус
            </Menu.Item>
        </Menu>
    );

    const accountSettingMenu = (
        <Menu>
            <Menu.Item onClick={logout} style={{fontWeight: "bold", color: "red"}} icon={<LoginOutlined/>}>
                {textConstants.EXIT}
            </Menu.Item>
        </Menu>
    );

    const userSettingMenu = (
        <Menu>
            <Menu.Item style={{fontWeight: "bold", color: "black"}} icon={<CoffeeOutlined/>}>
                перерыв
            </Menu.Item>
            <Menu.Item style={{fontWeight: "bold", color: "black"}} icon={<PoweroffOutlined/>}>
                выключен
            </Menu.Item>
        </Menu>
    );

    return (
        <Header className={"app-header"}>
            <Row style={{height: "100%"}}>
                <Col xs={24} md={12} style={{height: "100%"}}>
                    <Space size={"large"} style={{float: "left", height: "100%"}}>
                        {
                            user_data.typeOperator == 0 ?
                                <ul style={{listStyle: "none", margin: 0, padding: 0}}>
                                    <li style={{float: "left", margin: "0 10px"}}>
                                        <Link to="/dashboard" style={{color: "black"}}>
                                            <p style={{fontSize: "16px", height: "100%", marginBottom: 0}}>
                                                <BarChartOutlined/>
                                                <b> {textConstants.STATISTICS}</b></p>
                                        </Link>
                                    </li>
                                    <li style={{float: "left", margin: "0 10px"}}>
                                        <Link to="/reports" style={{color: "black"}}>
                                            <p style={{fontSize: "16px", height: "100%", marginBottom: 0}}>
                                                <SnippetsOutlined/>
                                                <b> {textConstants.REPORTS.charAt(0).toUpperCase() + textConstants.REPORTS.slice(1)}</b>
                                            </p>
                                        </Link>
                                    </li>
                                    <li style={{float: "left", margin: "0 10px"}}>
                                        <Link to="/call-history" style={{color: "black"}}>
                                            <p style={{fontSize: "16px", height: "100%", marginBottom: 0}}>
                                                <ClockCircleOutlined/>
                                                <b> {textConstants.CALL_HISTORY.charAt(0).toUpperCase() + textConstants.CALL_HISTORY.slice(1)}</b>
                                            </p>
                                        </Link>
                                    </li>
                                </ul> :
                                <Link to="/calls" style={{color: "black"}}>
                                    <p style={{fontSize: "16px", height: "100%", marginBottom: 0}}><PhoneOutlined/>
                                        <b> {textConstants.CALL_CENTER}</b></p>
                                </Link>
                        }
                    </Space>
                </Col>
                <Col xs={24} md={12} style={{height: "100%"}}>
                    <Space size={"large"} style={{float: "right", height: "100%"}}>
                        <p style={{fontSize: "16px", height: "100%", marginBottom: 0, cursor: "pointer"}}>
                            <Dropdown overlay={langs} placement="bottomRight" arrow>
                                <p className="ant-dropdown-link" style={{color: "#C4C4C4"}}>
                                    {lang} <DownOutlined/>
                                </p>
                            </Dropdown>
                        </p>
                        {user_data.typeOperator === 0
                            ? null
                            : <p style={{fontSize: "16px", height: "100%", marginBottom: 0, cursor: "pointer"}}>
                                <Dropdown overlay={userSettingMenu} placement="bottomRight" arrow>
                                    <Space>
                                        <Avatar style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>
                                    </Space>
                                </Dropdown>
                            </p>
                        }
                        <p style={{fontSize: "16px", height: "100%", marginBottom: 0, cursor: "pointer"}}>
                            <Dropdown overlay={accountSettingMenu} arrow>
                                <Space><b>{user_data.name}</b><Avatar
                                    icon={<UserOutlined/>}/></Space>
                            </Dropdown>
                        </p>
                    </Space>
                </Col>
            </Row>
        </Header>
    );
}

const mapStateToProps = (state) => ({
    user_data: state.user.user_data,
    lang: state.user.lang,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getUser, setUserLang}
)(AppHeader);