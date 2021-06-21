import {Button, Col, message, Row} from "antd";
import {FileExcelOutlined, RollbackOutlined} from "@ant-design/icons";
import {useState} from "react";
import axios from "axios";
import {apiUrl} from "../../../config/const";
import {connect} from "react-redux";
import {getDashboardFilter, setDashboardFilter} from "../../../store/reducer/dashboard";
import moment from "moment";
import LineGraph from "./LineGraph";
import DonutGraphBySubCategory from "./DonutGraphBySubCategory";
import GraphByApplicantType from "./GraphByApplicantType";
import GraphByCategory from "./GraphByCategory";
import TableByTerritory from "./TableByTerritory";

function Graphs({dashboard_filter, textConstants, setDashboardFilter}) {
    const [isLoadingXlsByCategory, setIsLoadingXlsByCategory] = useState(false);
    const [isLoadingXlsByTerritory, setIsLoadingXlsByTerritory] = useState(false);
    const [regionId, setRegionId] = useState(0);

    const downloadAsExcelByCategory = () => {
        setIsLoadingXlsByCategory(true);
        axios.post(`${apiUrl}/call-center/reports/report-by-category`, {
                fromDate: dashboard_filter.fromDate,
                toDate: dashboard_filter.toDate,
                callCenterTypeId: dashboard_filter.callCenterTypeId
            },
            {
                responseType: 'blob',
            }).then(res => {
            if (res.status === 200) {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "по категориям".replace(" ", "_") + moment(new Date()).format("DD.MM.YYYY_HH-mm-ss") + ".xlsx");
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

    const downloadAsExcelByTerritory = () => {
        setIsLoadingXlsByTerritory(true);
        axios.post(`${apiUrl}/call-center/reports/report-by-reg-applicants`, {
                regionId: regionId,
                dashboardSetting: {
                    fromDate: dashboard_filter.fromDate,
                    toDate: dashboard_filter.toDate,
                    callCenterTypeId: dashboard_filter.callCenterTypeId
                }
            },
            {
                responseType: 'blob',
            }).then(res => {
            if (res.status === 200) {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "по категориям".replace(" ", "_") + moment(new Date()).format("DD.MM.YYYY_HH-mm-ss") + ".xlsx");
                document.body.appendChild(link);
                link.click();
            } else {
                message.warning(textConstants.RETRIEVE_DATA_ERROR);
            }
            setIsLoadingXlsByTerritory(false);
        }).catch(err => {
            setIsLoadingXlsByTerritory(false);
            console.log(err);
            message.warning(textConstants.RETRIEVE_DATA_ERROR);
        });
    }

    return (
        <>
            <Row gutter={[70, 70]}>
                <Col xs={24} md={12} style={{display: "flex", justifyContent: "flex-start"}}>
                    <Row style={{width: "100%"}}>
                        <Col xs={24} md={24}>
                            <Row style={{width: "100%"}}>
                                <Col xs={24} md={24}>
                                    <h2 style={{
                                        textAlign: "left",
                                        fontSize: 18
                                    }}>{textConstants.BY_TAXPAYERS.toUpperCase()}</h2>
                                </Col>
                            </Row>
                            <GraphByApplicantType/>
                        </Col>
                        <Col xs={24} md={24}>
                            <Row style={{width: "100%"}}>
                                <Col xs={24} md={12}>
                                    <h2 style={{
                                        textAlign: "left",
                                        fontSize: 18
                                    }}>{textConstants.BY_CATEGORY.toUpperCase()}</h2>
                                </Col>
                                <Col xs={24} md={12} style={{margin: "auto"}}>
                                    <Button type="primary" size="small" style={{float: "right"}}
                                            onClick={downloadAsExcelByCategory}
                                            loading={isLoadingXlsByCategory}>
                                        {textConstants.DOWNLOAD} <FileExcelOutlined/>
                                    </Button>
                                    {(dashboard_filter.categoryId === 0 || !dashboard_filter.categoryId) ? null : (
                                        <Button type="danger" size="small" style={{float: "right", marginRight: 10}}
                                                onClick={() => {
                                                    dashboard_filter.subCategoryId != 0 ?
                                                        setDashboardFilter({
                                                            "fromDate": dashboard_filter.fromDate,
                                                            "toDate": dashboard_filter.toDate,
                                                            "regionId": dashboard_filter.regionId,
                                                            "categoryId": dashboard_filter.categoryId,
                                                            "subCategoryId": 0,
                                                            "callCenterTypeId": dashboard_filter.callCenterTypeId
                                                        }) :
                                                        setDashboardFilter({
                                                            "fromDate": dashboard_filter.fromDate,
                                                            "toDate": dashboard_filter.toDate,
                                                            "regionId": dashboard_filter.regionId,
                                                            "categoryId": 0,
                                                            "subCategoryId": 0,
                                                            "callCenterTypeId": dashboard_filter.callCenterTypeId
                                                        })
                                                }}
                                                loading={isLoadingXlsByTerritory}>
                                            {dashboard_filter.subCategoryId != 0 ? textConstants.BACK_TO_SUB_CATEGORY_LEVEL : textConstants.BACK_TO_CATEGORY_LEVEL}
                                            <RollbackOutlined/>
                                        </Button>)}
                                </Col>
                            </Row>
                            <GraphByCategory/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} md={12} style={{display: "flex", justifyContent: "flex-start"}}>
                    <Row style={{width: "100%"}}>
                        <Col xs={24} md={24}>
                            <Row style={{width: "100%"}}>
                                <Col xs={24} md={12}>
                                    <h2 style={{
                                        textAlign: "left",
                                        fontSize: 18
                                    }}>{textConstants.BY_TERRITORY.toUpperCase()}</h2>
                                </Col>
                                <Col xs={24} md={12} style={{margin: "auto"}}>
                                    <Button type="primary" size="small" style={{float: "right"}}
                                            onClick={downloadAsExcelByTerritory}
                                            loading={isLoadingXlsByTerritory}>
                                        {textConstants.DOWNLOAD} <FileExcelOutlined/>
                                    </Button>
                                    {(dashboard_filter.regionId === 0 || !dashboard_filter.regionId) ? null : (
                                        <Button type="danger" size="small" style={{float: "right", marginRight: 10}}
                                                onClick={() => {
                                                    setDashboardFilter({
                                                        "fromDate": dashboard_filter.fromDate,
                                                        "toDate": dashboard_filter.toDate,
                                                        "regionId": 0,
                                                        "categoryId": dashboard_filter.categoryId,
                                                        "subCategoryId": dashboard_filter.subCategoryId,
                                                        "callCenterTypeId": dashboard_filter.callCenterTypeId
                                                    })
                                                }}
                                                loading={isLoadingXlsByTerritory}>
                                            {textConstants.BACK_TO_REPUBLIC} <RollbackOutlined/>
                                        </Button>)}
                                </Col>
                            </Row>
                            <TableByTerritory/>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {/* Line graph and doughnut */}
            <Row gutter={[70, 70]}>
                <Col xs={24} md={15} style={{display: "flex", justifyContent: "flex-start"}}>
                    <Row style={{width: "100%"}}>
                        <Col xs={24} md={24}>
                            <Row style={{width: "100%"}}>
                                <Col xs={24} md={12}>
                                    <h2 style={{
                                        textAlign: "left",
                                        fontSize: 18
                                    }}>{textConstants.BY_TAXPAYERS.toUpperCase()}</h2>
                                </Col>
                            </Row>
                            <LineGraph/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} md={9} style={{display: "flex", justifyContent: "flex-start"}}>
                    <Row style={{width: "100%"}}>
                        <Col xs={24} md={24}>
                            <Row style={{width: "100%"}}>
                                <Col xs={24} md={24}>
                                    <h2 style={{
                                        textAlign: "left",
                                        fontSize: 18
                                    }}>{textConstants.SUB_CATEGORY.toUpperCase()}</h2>
                                </Col>
                            </Row>
                            <DonutGraphBySubCategory/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

const mapStateToProps = (state) => ({
    dashboard_filter: state.dashboard.filter,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getDashboardFilter, setDashboardFilter}
)(Graphs);