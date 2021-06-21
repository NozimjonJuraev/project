import {Table} from "antd";
import {connect} from "react-redux";
import {getDashboardFilter, setDashboardFilter} from "../../../store/reducer/dashboard";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../../config/const";

function TableByTerritory({dashboard_filter, setDashboardFilter, textConstants}) {
    const [tableData, setTableData] = useState([{}]);
    const [regionId, setRegionId] = useState(0);

    const setRegion = (regionId) => {
        setRegionId(regionId);
        setDashboardFilter({
            "fromDate": dashboard_filter.fromDate,
            "toDate": dashboard_filter.toDate,
            "regionId": regionId,
            "categoryId": dashboard_filter.categoryId,
            "subCategoryId": dashboard_filter.subCategoryId,
            "callCenterTypeId": dashboard_filter.callCenterTypeId
        })
    }

    const getTerritory = () => {
        if (!Object.keys(dashboard_filter).length == 0) {
            if (!dashboard_filter.regionId > 0) {
                axios.post(`${apiUrl}/call-center/dashboard/getStatisticsByRegion`, {
                    fromDate: dashboard_filter.fromDate,
                    toDate: dashboard_filter.toDate,
                    callCenterTypeId: dashboard_filter.callCenterTypeId
                }).then(res => {
                    if (res.status === 200 && res.data) {
                        setTableData(res.data);
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                axios.post(`${apiUrl}/call-center/dashboard/getStatisticsByDistrict`, {
                    regionId: regionId,
                    dashboardSetting: {
                        fromDate: dashboard_filter.fromDate,
                        toDate: dashboard_filter.toDate,
                        callCenterTypeId: dashboard_filter.callCenterTypeId
                    }
                }).then(res => {
                    if (res.status === 200 && res.data) {
                        setTableData(res.data);
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }

    useEffect(() => {
        getTerritory();
    }, [dashboard_filter]);

    const columns = [
        {
            title: textConstants.ROW_NUMBER,
            key: 'regionId',
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
            title: textConstants.REGION,
            key: 'regionId',
            dataIndex: dashboard_filter.regionId == 0 ? "regionName" : "districtName",
            width: 230,
            align: "left",
            render(text) {
                return {
                    children: <a style={{textDecoration: "underline"}}>{text}</a>
                };
            }
        },
        {
            title: textConstants.PREVIOUS_MONTH,
            key: 'regionId',
            dataIndex: 'lastMonthCount',
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
            title: textConstants.COUNT,
            key: 'regionId',
            dataIndex: 'count',
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
            title: textConstants.PERCENT,
            key: 'regionId',
            dataIndex: 'percent',
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

    return (
        <Table columns={columns} dataSource={tableData} pagination={false} scroll={{y: 650}}
               className={"dashboard-chart"}
               onRow={(record) => ({
                   onClick: () => {
                       if (dashboard_filter.regionId === 0) {
                           setRegion(record.regionId)
                       }
                   }
               })}/>
    );
}

const mapStateToProps = (state) => ({
    dashboard_filter: state.dashboard.filter,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getDashboardFilter, setDashboardFilter}
)(TableByTerritory);