import {Button, Col, DatePicker, Layout, Row, Select, Space} from "antd";
import 'antd/dist/antd.css';
import "./dashboard.css";
import {Option} from "antd/lib/mentions";
import Cards from "./Cards";
import Graphs from "./graphs/Graphs";
import {connect} from "react-redux";
import {getDashboardFilter, setDashboardFilter} from "../../store/reducer/dashboard";
import {useEffect, useState} from "react";
import moment from "moment";

const {Content} = Layout;
const dateFormat = 'DD.MM.YYYY';

function Dashboard({dashboard_filter, setDashboardFilter, textConstants}) {
    const [fromDate, setFromDate] = useState(moment(Date.now()));
    const [toDate, setToDate] = useState(moment(Date.now()));
    const [callCenterTypeId, setCallCenterTypeId] = useState(0);
    const [dashboardFilterSetting, setDashboardFilterSetting] = useState({
        "fromDate": fromDate.format(dateFormat),
        "toDate": toDate.format(dateFormat),
        "regionId": 0,
        "categoryId": 0,
        "subCategoryId": 0,
        "callCenterTypeId": 0
    });

    // const interval = setInterval(() => {
    //     setFilter();
    // }, 150000);

    useEffect(() => {
        setDashboardFilter(dashboardFilterSetting);
    }, [dashboardFilterSetting]);

    const setDateByPeriod = item => {
        if (item == 1) {
            setFromDate(moment().subtract(0, 'd'));
        } else if (item == 2) {
            setFromDate(moment().subtract(7, 'd'));
        } else if (item == 3) {
            setFromDate(moment(new Date()).subtract(1, 'M'));
        }
    }

    const setCallCenterType = item => {
        setCallCenterTypeId(item);
    }

    const handleSelectFromDate = date => {
        setFromDate(date);
    }

    const handleSelectToDate = date => {
        setToDate(date);
    }

    const setFilter = () => {
        setDashboardFilterSetting({
            "fromDate": fromDate.format(dateFormat),
            "toDate": toDate.format(dateFormat),
            "regionId": 0,
            "categoryId": 0,
            "subCategoryId": 0,
            "callCenterTypeId": callCenterTypeId
        });
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
                            <DatePicker suffixIcon="" className={"dashboard-filter-item"} allowClear={false}
                                        value={fromDate}
                                        format={dateFormat}
                                        onChange={(date, str) => handleSelectFromDate(date)}/>
                            <DatePicker suffixIcon="" className={"dashboard-filter-item"} allowClear={false}
                                        value={toDate}
                                        format={dateFormat}
                                        onChange={(date, str) => handleSelectToDate(date)}/>
                            <Select defaultValue={textConstants.DAY_TODAY} className={"dashboard-filter-item"}
                                    onChange={item => setDateByPeriod(item)} allowClear={false}>
                                <Option key={1} value="1">{textConstants.DAY_TODAY}</Option>
                                <Option key={2} value="2">{textConstants.WEEK}</Option>
                                <Option key={3} value="3">{textConstants.MONTH}</Option>
                            </Select>
                            <Button type={"primary"} onClick={() => {
                                setFilter()
                            }}>{textConstants.FILTER}</Button>
                        </Space>
                    </Col>
                </Row>
                {/* Cards */}
                <Cards/>
                {/* Graphs */}
                <Graphs/>
            </div>
        </Content>
    </>);
}

const mapStateToProps = (state) => ({
    dashboard_filter: state.dashboard.filter,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getDashboardFilter, setDashboardFilter}
)(Dashboard);
