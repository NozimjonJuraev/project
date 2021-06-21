import {Pagination, Table} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../config/const";
import {connect} from "react-redux";
import {getUser, setUserCurrentCall} from "../../store/reducer/user";
import Registration from "./registration/Registration";
import openSocket from 'socket.io-client';

function CurrentCallTable({reload, user_data, textConstants, currentCall, setUserCurrentCall}) {
    const columns = [
        {
            title: textConstants.ROW_NUMBER,
            width: 150,
            align: "left",
            render(text, record, index) {
                return {
                    props: {
                        style: {fontWeight: "bold"}
                    },
                    children: <div>{index + 1}</div>
                };
            }
        },
        {
            title: textConstants.ID,
            dataIndex: 'id',
            width: 150,
            align: "left",
            render(text) {
                return {
                    props: {
                        style: {fontWeight: "bold"}
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: textConstants.DIRECTION,
            dataIndex: 'direction',
            width: 150,
            align: "center",
            render(text) {
                return {
                    props: {
                        style: {fontWeight: "bold"}
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: textConstants.PHONE_NUMBER,
            dataIndex: 'snum',
            width: 150,
            align: "center",
            render(text) {
                return {
                    children: <a style={{textDecoration: "underline"}}>{text}</a>
                };
            }
        },
        {
            title: textConstants.HOLD_TIME,
            dataIndex: 'holdTime',
            align: "center",
            render(text) {
                return {
                    props: {
                        style: {fontWeight: "bold"}
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: textConstants.CALL_DURATION,
            dataIndex: 'duration',
            align: "center",
            render(text) {
                return {
                    props: {
                        style: {fontWeight: "bold"}
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: textConstants.CALL_CENTER_TYPE,
            dataIndex: 'inf2',
            align: "center",
            render(text) {
                return {
                    props: {
                        style: {fontWeight: "bold"}
                    },
                    children:
                        <a style={{textDecoration: "underline"}}>{text === "6000" ? textConstants.CALL_CENTER : textConstants.TRUST_PHONE}</a>
                };
            }
        }
    ];

    const [visibleModal, setVisibleModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [callsList, setCallsList] = useState([]);
    const [callsPage, setCallsPage] = useState(1);
    const [callsPageSize, setCallsPageSize] = useState(10);
    const [callsTotal, setCallsTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(currentCall)
        //if (currentCall.CallerIDNum == user_data.login) {
        getCallsList(callsPage, callsPageSize);
        //}
    }, [callsPage, callsPageSize, reload, currentCall]);

    const getCallsList = (page, pageSize) => {
        setLoading(true);
        axios.get(`${apiUrl}/call-center/call/getCallsByOperatorId?operator_id=${user_data.login}&is_history=0&page=${page}&size=${pageSize}`).then(res => {
            if (res.status === 200 && res.data) {
                setCallsList(res.data);
                setCallsTotal(res.data[0].cnt);

                setCurrentItem(res.data[0]);
                setVisibleModal(true);
            }

            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }

    const [newChannel, setNewChannel] = useState();
    const [callerPhoneNumber, setCallerPhoneNumber] = useState(0);
    const [currentRingId, setCurrentRingId] = useState(0);

    useEffect(() => {
        const socket = openSocket("http://localhost:5000");

        axios.get("http://localhost:5000/").then()
        socket.on("dojob", data => {
            if (data.call) {
                if (data.call.ChannelStateDesc === 'Ring' && data.call.CallerIDNum != undefined) {
                    console.log("RING CURRENT USER: ", data.call.linkedId);
                    setCallerPhoneNumber(data.call.CallerIDNum);
                    setCurrentRingId(data.call.Linkedid);
                }
                if (data.call.ChannelStateDesc === 'Down' && data.call.CallerIDNum != undefined) {
                    console.log(data);
                    if (parseInt(data.call.CallerIDNum) === parseInt(user_data.login) && data.call.Linkedid == currentRingId) {
                        console.log("DOWN CURRENT USER: ", data);
                        setCurrentItem({
                            "id": 0,
                            "linkedId": data.call.Linkedid,
                            "recFile": "",
                            "snum": callerPhoneNumber
                        });
                    }
                }
            }
        });
    }, []);

    return (
        <>
            <Table
                locale={{emptyText: textConstants.NO_DATA_FOUND}}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setVisibleModal(true);
                            setCurrentItem(record);
                        }
                    };
                }}
                loading={loading}
                columns={columns} dataSource={callsList} pagination={false}
                className={"call-list-table"}>
            </Table>
            <br/>
            <div style={{display: "flex", justifyContent: "flex-end"}}>
                <Pagination pageSize={callsPageSize} current={callsPage} total={callsTotal}
                            onChange={p => setCallsPage(p)}
                            onShowSizeChange={(c, size) => setCallsPageSize(size)}/>
            </div>
            {visibleModal && currentItem && (
                <Registration inf2={0} visible={visibleModal} setvisible={setVisibleModal} item={currentItem}/>)}
        </>
    );
}

const mapStateToProps = (state) => ({
    user_data: state.user.user_data,
    textConstants: state.user.textConstants,
    currentCall: state.user.currentCall
});

export default connect(
    mapStateToProps,
    {getUser, setUserCurrentCall}
)(CurrentCallTable);