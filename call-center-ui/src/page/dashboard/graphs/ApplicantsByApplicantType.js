import {message, Modal, Pagination, Table} from "antd";
import "./applicantsByTable.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../../config/const";
import {connect} from "react-redux";
import {getUser, setUserLang} from "../../../store/reducer/user";
import firstToUpper from "../../../util/textUtil";
import ReactPlayer from "react-player";

function ApplicantsByApplicantType({isVisible, setIsVisible, item, dashboard_filter, textConstants}) {
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
                    children: <div>{(index + 1 + ((page == 1 ? page : page - 1) * (page == 1 ? 0 : pageSize)))}</div>
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
            title: textConstants.OPERATOR.toLowerCase(),
            dataIndex: 'operatorName',
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
            title: textConstants.TAXPAYER_TYPE,
            dataIndex: 'typeTaxpayers',
            width: 150,
            align: "center",
            render(text) {
                return {
                    children: <a style={{textDecoration: "underline"}}>{text}</a>
                };
            }
        },
        {
            title: textConstants.PHONE_NUMBER,
            dataIndex: 'phoneNumber',
            width: 150,
            align: "center",
            render(text) {
                return {
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: textConstants.REGION,
            dataIndex: 'regionName',
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
            title: textConstants.DISTRICT,
            dataIndex: 'districtName',
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
            title: textConstants.APPLICATION_RESULT,
            dataIndex: 'resultName',
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
            title: textConstants.REGISTRATION_DATE,
            dataIndex: 'regDate',
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
            title: textConstants.CALL_DURATION,
            dataIndex: "callDuration",
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
            dataIndex: "applicationDescription",
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
            title: textConstants.CALL_VOICE,
            dataIndex: "recfileFull",
            align: "center",
            render(text) {
                return <ReactPlayer
                    url={text}
                    width="250px"
                    height="28px"
                    style={{margin: "auto"}}
                    playing={playing}
                    controls={true}
                />
            }
        }
    ];

    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [playing, setPlaying] = useState(false);

    const closeFormWindow = e => {
        setIsVisible(false);
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
        if (!Object.keys(dashboard_filter).length == 0) {
            setLoading(true);
            axios.post(`${apiUrl}/call-center/dashboard/getRegisteredApplicantsByApplicantType`, {
                applicantTypeId: item.applicantTypeId,
                size: pageSize,
                pageNumber: page,
                dashboardSetting: {
                    fromDate: dashboard_filter.fromDate,
                    toDate: dashboard_filter.toDate,
                    callCenterTypeId: dashboard_filter.callCenterTypeId
                }
            }).then(res => {
                if (res.status === 200 && res.data) {
                    setList(res.data);
                    setTotal(res.data[0].cnt);
                }
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
        }
    }, [page, pageSize, item]);

    return (
        <Modal
            class="client-call-history"
            title={firstToUpper(textConstants.BY_TAXPAYERS)}
            visible={isVisible}
            width={1660}
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
                className={"applicants-table"}>
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
    dashboard_filter: state.dashboard.filter,
    user_data: state.user.user_data,
    lang: state.user.lang,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getUser, setUserLang}
)(ApplicantsByApplicantType);