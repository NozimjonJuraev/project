import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import "./calls.css";
import {Badge, Button, Col, Radio, Row, Space} from "antd";
import {FormOutlined, ReloadOutlined} from "@ant-design/icons";
import CurrentCallTable from "./CurrentCallTable";
import NFAFCallTable from "./NFAFCallTable";
import FAPCallsTable from "./FAPCallsTable";
import Registration from "./registration/Registration";
import {connect} from "react-redux";
import {getUser, setUserLang} from "../../store/reducer/user";
import axios from "axios";
import {apiUrl} from "../../config/const";

function Calls({user_data, textConstants, currentCall}) {
    const [reloadCounter, setReloadCounter] = useState(0);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(1);
    const [visibleModal, setVisibleModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [totalCountsByCallTypes, setTotalCountsByCallTypes] = useState(null);

    const onMenuSelect = e => {
        if (e.target.value === 1) {
            setSelectedMenuIndex(1);
        } else if (e.target.value === 2) {
            setSelectedMenuIndex(2);
        } else if (e.target.value === 3) {
            setSelectedMenuIndex(3);
        }
    }
    const openRegistrationForm = () => {
        setCurrentItem({});
        setVisibleModal(true);
    }

    useEffect(() => {
        axios.get(`${apiUrl}/call-center/call/getTotalCountByCallTypes?operator_id=${user_data.login}`).then(res => {
            if (res.status === 200 && res.data) {
                setTotalCountsByCallTypes(res.data);
            }
        }).catch(err => {
            console.error(err);
        });
    }, [reloadCounter, currentCall]);

    return (
        <Content>
            <div className="site-layout-content">
                <Row style={{marginTop: 10, marginBottom: 20}}>
                    <Col xs={24} md={12} style={{margin: "auto"}}>
                        <Space size={"large"} style={{display: "flex", justifyContent: "flex-start"}}>
                            <Radio.Group onChange={onMenuSelect} value={selectedMenuIndex}>
                                <Radio value={1}>{textConstants.CURRENT_CALLS} <Badge
                                    count={totalCountsByCallTypes ? totalCountsByCallTypes.currentCallTotal : 0}
                                    offset={[0, -20]} showZero overflowCount={10000}/></Radio>
                                <Radio value={2}>{textConstants.NO_REGISTERED_CALLS} <Badge
                                    count={totalCountsByCallTypes ? totalCountsByCallTypes.nfafcallTotal : 0}
                                    offset={[0, -20]} overflowCount={10000}/></Radio>
                                <Radio value={3}>{textConstants.ALL_CALLS} <Badge
                                    count={totalCountsByCallTypes ? totalCountsByCallTypes.fapcallTotal : 0}
                                    offset={[0, -20]} overflowCount={10000}/></Radio>
                            </Radio.Group>
                        </Space>
                    </Col>
                    <Col xs={24} md={12}>
                        <Space style={{display: "flex", justifyContent: "flex-end"}}>
                            {selectedMenuIndex === 1 ?
                                <Button type={"primary"}
                                        onClick={openRegistrationForm}><FormOutlined/>{textConstants.REGISTRATE_APPLICATION}
                                </Button> : null}
                            <Button type={"primary"} onClick={() => {
                                setReloadCounter(reloadCounter + 1)
                            }}><ReloadOutlined/>{textConstants.REFRESH}</Button>
                        </Space>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24}>
                        {selectedMenuIndex === 1
                            ? <CurrentCallTable reload={reloadCounter}/>
                            : (selectedMenuIndex === 2
                                ? <NFAFCallTable reload={reloadCounter}/>
                                : <FAPCallsTable reload={reloadCounter}/>)
                        }
                    </Col>
                </Row>
            </div>
            {visibleModal && currentItem && (
                <Registration visible={visibleModal} setvisible={setVisibleModal} item={currentItem}/>)}
        </Content>
    );
}

const mapStateToProps = (state) => ({
    user_data: state.user.user_data,
    lang: state.user.lang,
    textConstants: state.user.textConstants,
    currentCall: state.user.currentCall
});

export default connect(
    mapStateToProps,
    {getUser, setUserLang}
)(Calls);