import {message, Modal, Pagination, Table} from "antd";
import "./clientCallHistory.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../../config/const";
import {connect} from "react-redux";
import {getUser, setUserLang} from "../../../store/reducer/user";

function ClientCallHistory({
                               clientCallHistoryModalVisible,
                               setClientCallHistoryModalVisible,
                               item,
                               user_data,
                               lang,
                               textConstants,
                               getUser,
                               setUserLang
                           }) {
    const columns = [
        {
            title: textConstants.ROW_NUMBER,
            width: 50,
            align: "left",
            render(text, record, index) {
                return {
                    props: {
                        style: {fontWeight: "bold"}
                    },
                    children: <div>{(index + 1 + ((page === 1 ? page : page - 1) * (page === 1 ? 0 : pageSize)))}</div>
                };
            }
        },
        {
            title: textConstants.ID,
            dataIndex: 'id',
            width: 70,
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
            title: textConstants.REGISTRATION_DATE,
            dataIndex: 'regDate',
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
            title: textConstants.TIN,
            dataIndex: 'tin',
            width: 150,
            align: "center",
            render(text) {
                return {
                    children: <a style={{textDecoration: "underline"}}>{text}</a>
                };
            }
        },
        {
            title: textConstants.APPLICANT_NAME,
            dataIndex: 'applicantName',
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
            title: textConstants.ADDRESS,
            dataIndex: 'address',
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
            title: textConstants.APPLICATION_DESCRIPTION,
            dataIndex: 'applicationDescription',
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
            dataIndex: 'phoneNumber',
            align: "center",
            render(text) {
                return {
                    props: {
                        style: {fontWeight: "bold"}
                    },
                    children: <a style={{textDecoration: "underline"}}>{text}</a>
                };
            }
        },
        {
            title: textConstants.COMMENTARY,
            dataIndex: 'note',
            align: "center",
            render(text) {
                return {
                    props: {
                        style: {fontWeight: "bold"}
                    },
                    children: <div>{text}</div>
                };
            }
        }
    ];

    const [list, setList] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const closeFormWindow = e => {
        setClientCallHistoryModalVisible(false);
    };

    const errorMessage = () => {
        message.error({
            content: textConstants.RETRIEVE_DATA_ERROR,
            className: 'custom-class',
            style: {
                marginTop: '20vh',
            },
        });
    };

    useEffect(() => {
        if (clientCallHistoryModalVisible) {
            setLoading(true);
            axios.get(`${apiUrl}/call-center/reg-applicant/get-call-history?phone_number=${item}&page=${page}&size=${pageSize}`).then(res => {
                if (res.status === 200 && res.data) {
                    setList(res.data);
                    setTotal(res.data[0].cnt);
                }
                setLoading(false);
            }).catch(err => {
                errorMessage();
                setLoading(false);
            });
        }
    }, [page, pageSize, item]);

    return (
        <Modal
            class="client-call-history"
            title={textConstants.CLIENT_CALL_HISTORY}
            visible={clientCallHistoryModalVisible}
            width={1200}
            onCancel={closeFormWindow}
            footer={false}
        >
            <Table
                locale={{emptyText: textConstants.NO_DATA_FOUND}}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                        }
                    };
                }}
                loading={loading}
                columns={columns} dataSource={list} pagination={false}
                className={"client-call-history-table"}>
            </Table>
            <br/>
            <div style={{display: "flex", justifyContent: "flex-end"}}>
                <Pagination pageSize={pageSize} current={page} total={total}
                            onChange={p => setPage(p)}
                            onShowSizeChange={(c, size) => setPageSize(size)}/>
            </div>
        </Modal>
    );
};

const mapStateToProps = (state) => ({
    user_data: state.user.user_data,
    lang: state.user.lang,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getUser, setUserLang}
)(ClientCallHistory);