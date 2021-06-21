import {Pagination, Table} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../config/const";
import {connect} from "react-redux";
import {getUser} from "../../store/reducer/user";

function FAPCallsTable({reload, user_data, textConstants, getUser}) {
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
                    children:
                        <div>{(index + 1 + ((callsPage === 1 ? callsPage : callsPage - 1) * (callsPage === 1 ? 0 : callsPageSize)))}</div>
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

    const [callsList, setCallsList] = useState([]);
    const [callsPage, setCallsPage] = useState(1);
    const [callsPageSize, setCallsPageSize] = useState(10);
    const [callsTotal, setCallsTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCallsList(callsPage, callsPageSize);
        const interval = setInterval(() => {
            getCallsList(callsPage, callsPageSize);
        }, 775000);
        return () => clearInterval(interval);
    }, [callsPage, callsPageSize, reload]);

    const getCallsList = (page, pageSize) => {
        setLoading(true);
        axios.get(`${apiUrl}/call-center/call/getAllCallsByOperatorId?operator_id=${user_data.login}&is_history=0&page=${page}&size=${pageSize}`).then(res => {
            if (res.status === 200 && res.data) {
                setCallsList(res.data);
                setCallsTotal(res.data[0].cnt);
            }

            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }

    return (
        <>
            <Table
                locale={{emptyText: textConstants.NO_DATA_FOUND}}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
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
        </>
    );
}

const mapStateToProps = (state) => ({
    user_data: state.user.user_data,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getUser}
)(FAPCallsTable);