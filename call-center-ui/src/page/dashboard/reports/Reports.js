import {Button, Col, DatePicker, Row, Select, Space} from "antd";
import {Option} from "antd/lib/mentions";
import {Content} from "antd/es/layout/layout";
import Tables from "./Tables";
import {connect} from "react-redux";
import "./reports.css";
import {useEffect, useState} from "react";
import moment from "moment";
import {setReportFilter} from "../../../store/reducer/report";

const dateFormat = 'DD.MM.YYYY';

function Reports({report_filter, setReportFilter, textConstants}) {
    const [date, setDate] = useState(moment(Date.now()));
    const [reportFilterSetting, setReportFilterSetting] = useState({
        "date": moment(Date.now()).format(dateFormat),
        "regionId": 0,
        "callCenterTypeId": 0
    });
    const [callCenterTypeId, setCallCenterTypeId] = useState(0);

    useEffect(() => {
        setFilter();
        setReportFilterSetting(reportFilterSetting);
    }, [reportFilterSetting]);

    const setFilter = () => {
        setReportFilter({
            "regionId": 0,
            "date": date.format(dateFormat),
            "callCenterTypeId": callCenterTypeId
        });
    }

    const handleSelectToDate = date => {
        setDate(date);
    }

    const setCallCenterType = item => {
        setCallCenterTypeId(item);
    }

    return (<>
        <Content>
            <div className="site-layout-content">
                {/* Filter */}
                <Row style={{marginTop: 10, marginBottom: 20}}>
                    <Col xs={24} md={24}>
                        <Space style={{display: "flex", justifyContent: "flex-start"}}>
                            <Select defaultValue={textConstants.STATE_TOTAL}
                                    className={"dashboard-filter-item"}
                                    style={{minWidth: "140px", textAlign: "left"}}
                                    onChange={item => setCallCenterType(item)} allowClear={false}>
                                <Option key={0} value="0">{textConstants.STATE_TOTAL}</Option>
                                <Option key={6000} value="6000">{textConstants.CALL_CENTER + " (6000)"}</Option>
                                <Option key={6001} value="6001">{textConstants.TRUST_PHONE + " (6001)"}</Option>
                            </Select>
                            <DatePicker suffixIcon="" className={"dashboard-filter-item"} value={date}
                                        format={dateFormat} allowClear={false}
                                        onChange={(date, str) => handleSelectToDate(date)}/>
                            <Button type={"primary"} onClick={() => {
                                setFilter()
                            }}>{textConstants.FILTER}</Button>
                        </Space>
                    </Col>
                </Row>
                {/* Tables */}
                <Tables/>
            </div>
        </Content>
    </>);
}

const mapStateToProps = (state) => ({
    report_filter: state.report.filter,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {setReportFilter}
)(Reports);
