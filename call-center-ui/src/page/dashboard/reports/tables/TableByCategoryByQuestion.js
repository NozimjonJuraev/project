import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import {Button, Col, message, Row, Table} from "antd";
import {connect} from "react-redux";
import {getReportFilter, setReportFilter} from "../../../../store/reducer/report";
import axios from "axios";
import {apiUrl} from "../../../../config/const";
import moment from "moment";
import {FileExcelOutlined} from "@ant-design/icons";
import "./reportTable.css";
import {formatNumber} from "../../../../util/numberUtil";

function TableByCategoryByQuestion({lang, report_filter, setReportFilter, textConstants}) {
    const [tableData, setTableData] = useState([{}]);
    const [regionId, setRegionId] = useState(0);
    const [isLoadingXlsByCategory, setIsLoadingXlsByCategory] = useState(false);
    const [totalData, setTotalData] = useState({});

    const setRegion = (regionId) => {
        setRegionId(regionId);
        setReportFilter({
            "date": report_filter.date
        })
    }

    const getCategory = () => {
        if (!Object.keys(report_filter).length == 0) {
            if (!report_filter.regionId > 0) {
                axios.post(`${apiUrl}/call-center/reports/report-by-category-by-questions`, {
                    regionId: report_filter.regionId,
                    date: report_filter.date,
                    callCenterTypeId: report_filter.callCenterTypeId
                }).then(res => {
                    if (res.status === 200 && res.data) {
                        setTableData(res.data.dataList);
                        setTotalData(res.data.totalData);
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }

    useEffect(() => {
        getCategory();
    }, [report_filter]);


    const columns = [
        {
            title: textConstants.ROW_NUMBER,
            key: 'sub_category_id',
            width: 70,
            align: "center",
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
            title: textConstants.TAX_TYPE,
            key: 'sub_category_id',
            dataIndex: lang == "uz" ? "nameUz" : "nameRu",
            width: 230,
            align: "left",
            render(text) {
                return {
                    children: text
                };
            }
        },
        {
            title: textConstants.MONTH_1,
            key: 'sub_category_id',
            dataIndex: "month_1",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_2,
            key: 'sub_category_id',
            dataIndex: "month_2",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_3,
            key: 'sub_category_id',
            dataIndex: "month_3",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: "1 - " + textConstants.QUARTER,
            key: 'sub_category_id',
            dataIndex: "quarter_1",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_4,
            key: 'sub_category_id',
            dataIndex: "month_4",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_5,
            key: 'sub_category_id',
            dataIndex: "month_5",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_6,
            key: 'sub_category_id',
            dataIndex: "month_6",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: "2 - " + textConstants.QUARTER,
            key: 'sub_category_id',
            dataIndex: "quarter_2",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_7,
            key: 'sub_category_id',
            dataIndex: "month_7",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_8,
            key: 'sub_category_id',
            dataIndex: "month_8",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_9,
            key: 'sub_category_id',
            dataIndex: "month_9",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: "3 - " + textConstants.QUARTER,
            key: 'sub_category_id',
            dataIndex: "quarter_3",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_10,
            key: 'sub_category_id',
            dataIndex: "month_10",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_11,
            key: 'sub_category_id',
            dataIndex: "month_11",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.MONTH_12,
            key: 'sub_category_id',
            dataIndex: "month_12",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: "4 - " + textConstants.QUARTER,
            key: 'sub_category_id',
            dataIndex: "quarter_4",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.STATE_TOTAL,
            key: 'sub_category_id',
            fixed: 'right',
            dataIndex: "total",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        },
        {
            title: textConstants.PERCENT,
            key: 'id',
            fixed: 'right',
            dataIndex: "percent",
            align: "center",
            render(text) {
                return {
                    children: formatNumber(text)
                };
            }
        }
    ];

    const downloadAsExcelByCategory = () => {
        setIsLoadingXlsByCategory(true);
        axios.post(`${apiUrl}/call-center/reports/report-xls-by-category-by-questions`, {
                regionId: report_filter.regionId,
                date: report_filter.date,
                callCenterTypeId: report_filter.callCenterTypeId
            },
            {
                responseType: 'blob',
            }).then(res => {
            if (res.status === 200) {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "распределение вопросы по содержанию_".replace(" ", "_") + moment(new Date()).format("DD.MM.YYYY_HH-mm-ss") + ".xlsx");
                document.body.appendChild(link);
                link.click();
            } else {
                message.warning(textConstants.RETRIEVE_DATA_ERROR);
            }
            setIsLoadingXlsByCategory(false);
        }).catch(err => {
            setIsLoadingXlsByCategory(false);
            console.log(err);
            message.warning(textConstants.RETRIEVE_DATA_ERROR);
        });
    }

    return (
        <Content>
            <div>
                <Row>
                    <Row style={{width: "100%"}}>
                        <Col xs={24} md={12}>
                            <h2 style={{
                                textAlign: "left",
                                fontSize: 18
                            }}>{textConstants.REPORT_DISTRIBUTE_QUESTIONS_BY_CATEGORIES.charAt(0).toUpperCase() + textConstants.REPORT_DISTRIBUTE_QUESTIONS_BY_CATEGORIES.slice(1)}</h2>
                        </Col>
                        <Col xs={24} md={12}>
                            <Button type="primary" size="small" style={{float: "right"}}
                                    onClick={downloadAsExcelByCategory}
                                    loading={isLoadingXlsByCategory}>
                                {textConstants.DOWNLOAD} <FileExcelOutlined/>
                            </Button>
                        </Col>
                    </Row>
                    <Col xs={24} md={24}>
                        <Table className={"report-table"}
                               columns={columns}
                               dataSource={tableData}
                               pagination={false}
                               scroll={{y: 650}}
                               onRow={(record) => ({
                                   onClick: () => {
                                   }
                               })}
                               bordered
                               summary={() => {
                                   return (
                                       <>
                                           <Table.Summary.Row style={{fontWeight: "bold", fontSize: 13}}>
                                               <Table.Summary.Cell align={"center"}>#</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{textConstants.STATE_TOTAL}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_1)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_2)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_3)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.quarter_1)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_4)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_5)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_6)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.quarter_2)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_7)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_8)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_9)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.quarter_3)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_10)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_11)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.month_12)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.quarter_4)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.total)}</Table.Summary.Cell>
                                               <Table.Summary.Cell
                                                   align={"center"}>{formatNumber(totalData.percent)}</Table.Summary.Cell>
                                           </Table.Summary.Row>
                                       </>
                                   );
                               }}
                        />
                    </Col>
                </Row>
            </div>
        </Content>
    );
}

const mapStateToProps = (state) => ({
    report_filter: state.report.filter,
    textConstants: state.user.textConstants,
    lang: state.user.lang
});

export default connect(
    mapStateToProps,
    {getReportFilter, setReportFilter}
)(TableByCategoryByQuestion);