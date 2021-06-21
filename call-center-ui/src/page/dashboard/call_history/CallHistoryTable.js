import ReactPlayer from "react-player";
import {useEffect, useState} from "react";
import {message, Pagination, Table} from "antd";
import axios from "axios";
import {apiUrl} from "../../../config/const";
import {connect} from "react-redux";
import {getUser, setUserLang} from "../../../store/reducer/user";

function CallHistoryTable({textConstants, searchedVal, searchType}) {
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
            title: textConstants.TIN,
            dataIndex: 'tin',
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
        if (searchedVal.toString().length > 0) {
            setLoading(true);
            axios.post(`${apiUrl}/call-center/reports/get-applicants-by-searched-value`, {
                size: pageSize,
                pageNumber: page,
                searchType: searchType,
                searchedVal: searchedVal
            }).then(res => {
                if (res.status === 200 && res.data && res.data.length > 0) {
                    setList(res.data);
                    setTotal(res.data[0].cnt);
                } else {
                    setList(null);
                    setTotal(0);
                }
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
        }
    }, [page, pageSize, searchedVal]);

    useEffect(() => {
        setPage(1);
    }, [searchedVal, searchType]);

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
                columns={columns} dataSource={list} pagination={false}
                className={"applicants-table"}>
            </Table>
            <br/>
            <div style={{display: "flex", justifyContent: "flex-end"}}>
                <Pagination pageSize={pageSize} current={page} total={total}
                            onChange={p => setPage(p)}
                            onShowSizeChange={(c, size) => setPageSize(size)}/>
            </div>
        </>
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
)(CallHistoryTable);