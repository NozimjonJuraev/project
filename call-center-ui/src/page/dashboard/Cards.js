import {Avatar, Card, Col, Row} from "antd";
import {
    AppstoreOutlined,
    CheckOutlined,
    HistoryOutlined,
    NodeIndexOutlined,
    PhoneOutlined,
    RollbackOutlined,
    SisternodeOutlined,
    VerticalAlignTopOutlined
} from "@ant-design/icons";
import {connect} from "react-redux";
import {getDashboardFilter} from "../../store/reducer/dashboard";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../config/const";

function Cards({dashboard_filter, textConstants}) {
    const [mainStatisticsData, setMainStatisticsData] = useState({});
    const [sourceStatisticsData, setSourceStatisticsData] = useState({});

    useEffect(() => {
        if (!Object.keys(dashboard_filter).length == 0) {
            axios.post(`${apiUrl}/call-center/dashboard/getStatisticsByMain`, {
                fromDate: dashboard_filter.fromDate,
                toDate: dashboard_filter.toDate,
                callCenterTypeId: dashboard_filter.callCenterTypeId
            }).then(res => {
                if (res.status === 200 && res.data) {
                    setMainStatisticsData({...res.data});

                    axios.post(`${apiUrl}/call-center/dashboard/getStatisticsBySource`, {
                        fromDate: dashboard_filter.fromDate,
                        toDate: dashboard_filter.toDate,
                        callCenterTypeId: dashboard_filter.callCenterTypeId
                    }).then(res => {
                        if (res.status === 200 && res.data) {
                            setSourceStatisticsData({...res.data});
                        }
                    })
                }
            });
        }
    }, [dashboard_filter]);
    return (
        <Row gutter={[33, 30]} style={{marginTop: 10, marginBottom: 20}}>
            <Col xs={24} md={8}>
                <Row>
                    <Col xs={24} md={24} style={{display: "flex", justifyContent: "flex-start"}}>
                        <h2 style={{fontSize: 18}}>{textConstants.BY_CALL.toUpperCase()}</h2>
                    </Col>
                    <Col xs={24} md={24}>
                        <Row gutter={[30, 30]}>
                            <Col xs={24} md={8}>
                                <Card className={"dashboard-info-card"}>
                                    <Row style={{padding: 15}}>
                                        <Col xs={24} md={10} style={{margin: "auto"}}>
                                            <Avatar style={{
                                                backgroundColor: "#EAF8FE",
                                                verticalAlign: 'middle'
                                            }} size={55}
                                                    icon={<NodeIndexOutlined style={{color: "#4079FE"}}/>}/>
                                        </Col>
                                        <Col xs={24} md={14}>
                                            <h3 style={{
                                                textAlign: "left",
                                                margin: 0,
                                                fontSize: "20px"
                                            }}>{mainStatisticsData.busy ? mainStatisticsData.busy : 0}</h3>
                                            <p style={{
                                                textAlign: "left",
                                                margin: 0,
                                                color: "#A9A9A9"
                                            }}>{textConstants.STATE_BUSY}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} md={8}>
                                <Card className={"dashboard-info-card"}>
                                    <Row style={{padding: 15}}>
                                        <Col xs={24} md={10} style={{margin: "auto"}}>
                                            <Avatar style={{
                                                backgroundColor: "#EAF8FE",
                                                verticalAlign: 'middle'
                                            }} size={55}
                                                    icon={<SisternodeOutlined style={{color: "#4079FE"}}/>}/>
                                        </Col>
                                        <Col xs={24} md={14}>
                                            <h3 style={{
                                                textAlign: "left",
                                                margin: 0,
                                                fontSize: "20px"
                                            }}>{/*mainStatisticsData.missed ? mainStatisticsData.missed : */0}</h3>
                                            <p style={{
                                                textAlign: "left",
                                                margin: 0,
                                                color: "#A9A9A9"
                                            }}>{textConstants.STATE_NOT_BUSY}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} md={8}>
                                <Card className={"dashboard-info-card"}>
                                    <Row style={{padding: 15}}>
                                        <Col xs={24} md={10} style={{margin: "auto"}}>
                                            <Avatar style={{
                                                backgroundColor: "#EAF8FE",
                                                verticalAlign: 'middle'
                                            }} size={55}
                                                    icon={<HistoryOutlined style={{color: "#4079FE"}}/>}/>
                                        </Col>
                                        <Col xs={24} md={14}>
                                            <h3 style={{
                                                textAlign: "left",
                                                margin: 0,
                                                fontSize: "20px"
                                            }}>{mainStatisticsData.waited ? mainStatisticsData.waited : 0}</h3>
                                            <p style={{
                                                textAlign: "left",
                                                margin: 0,
                                                color: "#A9A9A9"
                                            }}>{textConstants.STATE_WAIT}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col xs={24} md={16}>
                <Row>
                    <Col xs={24} md={24} style={{display: "flex", justifyContent: "flex-start"}}>
                        <h2 style={{fontSize: 18}}>{textConstants.BY_WAIT.toUpperCase()}</h2>
                    </Col>
                    <Col xs={24} md={24}>
                        <Row gutter={[30, 30]}>
                            <Col xs={24} md={4}>
                                <Card className={"dashboard-info-card"}>
                                    <Row style={{padding: 15}}>
                                        <Col xs={24} md={10} style={{margin: "auto"}}>
                                            <Avatar style={{
                                                backgroundColor: "#EAF8FE",
                                                verticalAlign: 'middle'
                                            }} size={55}
                                                    icon={<AppstoreOutlined style={{color: "#4079FE"}}/>}/>
                                        </Col>
                                        <Col xs={24} md={14}>
                                            <h3 style={{
                                                textAlign: "left",
                                                margin: 0,
                                                fontSize: "20px"
                                            }}>{(mainStatisticsData.missed + mainStatisticsData.answered)
                                                ? (mainStatisticsData.missed + mainStatisticsData.answered)
                                                : 0}</h3>
                                            <p style={{
                                                textAlign: "left",
                                                margin: 0,
                                                color: "#A9A9A9"
                                            }}>{textConstants.STATE_TOTAL}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} md={5}>
                                <Card className={"dashboard-info-card"}>
                                    <Row style={{padding: 15}}>
                                        <Col xs={24} md={10} style={{margin: "auto"}}>
                                            <Avatar style={{
                                                backgroundColor: "#EAF8FE",
                                                verticalAlign: 'middle'
                                            }} size={55}
                                                    icon={<VerticalAlignTopOutlined
                                                        style={{color: "#4079FE"}}/>}/>
                                        </Col>
                                        <Col xs={24} md={14}>
                                            <h3 style={{
                                                textAlign: "left",
                                                margin: 0,
                                                fontSize: "20px"
                                            }}>{mainStatisticsData.answered ? mainStatisticsData.answered : 0}</h3>
                                            <p style={{
                                                textAlign: "left",
                                                margin: 0,
                                                color: "#A9A9A9"
                                            }}>{textConstants.STATE_ANSWERED}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} md={5}>
                                <Card className={"dashboard-info-card"}>
                                    <Row style={{padding: 15}}>
                                        <Col xs={24} md={10} style={{margin: "auto"}}>
                                            <Avatar style={{
                                                backgroundColor: "#EAF8FE",
                                                verticalAlign: 'middle'
                                            }} size={55}
                                                    icon={<RollbackOutlined style={{color: "#4079FE"}}/>}/>
                                        </Col>
                                        <Col xs={24} md={14}>
                                            <h3 style={{
                                                textAlign: "left",
                                                margin: 0,
                                                fontSize: "20px"
                                            }}>{mainStatisticsData.missed ? mainStatisticsData.missed : 0}</h3>
                                            <p style={{
                                                textAlign: "left",
                                                margin: 0,
                                                color: "#A9A9A9"
                                            }}>{textConstants.STATE_MISSED}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} md={5}>
                                <Card className={"dashboard-info-card"}>
                                    <Row style={{padding: 15}}>
                                        <Col xs={24} md={10} style={{margin: "auto"}}>
                                            <Avatar style={{
                                                backgroundColor: "#EAF8FE",
                                                verticalAlign: 'middle'
                                            }} size={55}
                                                    icon={<PhoneOutlined style={{color: "#4079FE"}}/>}/>
                                        </Col>
                                        <Col xs={24} md={14}>
                                            <h3 style={{
                                                textAlign: "left",
                                                margin: 0,
                                                fontSize: "20px"
                                            }}>{sourceStatisticsData.callCenterCount ? sourceStatisticsData.callCenterCount : 0}</h3>
                                            <p style={{
                                                textAlign: "left",
                                                margin: 0,
                                                color: "#A9A9A9"
                                            }}>{textConstants.STATE_CALL_CENTER}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} md={5}>
                                <Card className={"dashboard-info-card"}>
                                    <Row style={{padding: 15}}>
                                        <Col xs={24} md={10} style={{margin: "auto"}}>
                                            <Avatar style={{
                                                backgroundColor: "#EAF8FE",
                                                verticalAlign: 'middle'
                                            }} size={55}
                                                    icon={<CheckOutlined style={{color: "#4079FE"}}/>}/>
                                        </Col>
                                        <Col xs={24} md={14}>
                                            <h3 style={{
                                                textAlign: "left",
                                                margin: 0,
                                                fontSize: "20px"
                                            }}>{mainStatisticsData.answered - sourceStatisticsData.callCenterCount}</h3>
                                            <p style={{
                                                textAlign: "left",
                                                margin: 0,
                                                color: "#A9A9A9"
                                            }}>{textConstants.STATE_TRUST_PHONE}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

const mapStateToProps = (state) => ({
    dashboard_filter: state.dashboard.filter,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getDashboardFilter}
)(Cards);