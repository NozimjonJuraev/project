import Chart from 'react-apexcharts';
import "./graphs.css";
import {connect} from "react-redux";
import {getDashboardFilter, setDashboardFilter} from "../../../store/reducer/dashboard";
import {useEffect, useState} from "react";
import {apiUrl} from "../../../config/const";
import axios from "axios";
import ApplicantsByTheme from "./ApplicantsByTheme";

function GraphByCategory({dashboard_filter, textConstants, setDashboardFilter}) {
    const [chartData, setChartData] = useState([{}]);
    const [applicantsListTableVisible, setApplicantsListTableVisible] = useState(false);
    const [item, setItem] = useState({});

    useEffect(() => {
        if (!Object.keys(dashboard_filter).length == 0) {
            if (dashboard_filter.categoryId === 0 && dashboard_filter.subCategoryId === 0) {
                axios.post(`${apiUrl}/call-center/dashboard/getStatisticsByCategory`, {
                    regionId: dashboard_filter.regionId,
                    dashboardSetting: {
                        fromDate: dashboard_filter.fromDate,
                        toDate: dashboard_filter.toDate,
                        callCenterTypeId: dashboard_filter.callCenterTypeId
                    }
                }).then(res => {
                    if (res.status === 200 && res.data) {
                        setChartData(res.data);
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else if (dashboard_filter.categoryId != 0 && dashboard_filter.subCategoryId === 0) {
                axios.post(`${apiUrl}/call-center/dashboard/getStatisticsBySubCategory`, {
                    regionId: dashboard_filter.regionId,
                    categoryId: dashboard_filter.categoryId,
                    dashboardSetting: {
                        fromDate: dashboard_filter.fromDate,
                        toDate: dashboard_filter.toDate,
                        callCenterTypeId: dashboard_filter.callCenterTypeId
                    }
                }).then(res => {
                    if (res.status === 200 && res.data) {
                        setChartData(res.data);
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                axios.post(`${apiUrl}/call-center/dashboard/getStatisticsByTheme`, {
                    regionId: dashboard_filter.regionId,
                    categoryId: dashboard_filter.categoryId,
                    subCategoryId: dashboard_filter.subCategoryId,
                    dashboardSetting: {
                        fromDate: dashboard_filter.fromDate,
                        toDate: dashboard_filter.toDate,
                        callCenterTypeId: dashboard_filter.callCenterTypeId
                    }
                }).then(res => {
                    if (res.status === 200 && res.data) {
                        setChartData(res.data);
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }, [dashboard_filter]);

    const series = [
        {
            name: textConstants.COUNT,
            data: chartData.map(item => ({
                x: (dashboard_filter.categoryId === 0 && dashboard_filter.subCategoryId === 0)
                    ? ((item.categoryName) ? (item.categoryName).split(" ") : (item.categoryName))
                    : ((dashboard_filter.categoryId != 0 && dashboard_filter.subCategoryId === 0)
                        ? ((item.subCategoryName) ? (item.subCategoryName) : (item.subCategoryName))
                        : ((item.themeName) ? (item.themeName) : (item.themeName))),
                y: item.count
            }))
        }
    ];

    const options = {
        colors: ["#4079FE"],
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false
            },
            events: {
                dataPointSelection: function (event, chartContext, config) {
                    if (dashboard_filter.categoryId === 0 && dashboard_filter.subCategoryId === 0) {
                        setDashboardFilter({
                            "fromDate": dashboard_filter.fromDate,
                            "toDate": dashboard_filter.toDate,
                            "regionId": dashboard_filter.regionId,
                            "categoryId": chartData[config.dataPointIndex].categoryId,
                            "subCategoryId": 0,
                            "callCenterTypeId": dashboard_filter.callCenterTypeId,
                        });
                    } else if (dashboard_filter.categoryId != 0 && dashboard_filter.subCategoryId === 0) {
                        setDashboardFilter({
                            "fromDate": dashboard_filter.fromDate,
                            "toDate": dashboard_filter.toDate,
                            "regionId": dashboard_filter.regionId,
                            "categoryId": dashboard_filter.categoryId,
                            "subCategoryId": chartData[config.dataPointIndex].subCategoryId,
                            "callCenterTypeId": dashboard_filter.callCenterTypeId,
                        });
                    } else {
                        setApplicantsListTableVisible(true);
                        setItem({
                            subCategoryId: dashboard_filter.subCategoryId,
                            themeId: chartData[config.dataPointIndex]
                        });
                    }
                }
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: 0,
            style: {
                fontSize: '14px',
                colors: ['white']
            }
        },
        stroke: {
            show: true,
            width: 1,
            curve: ['smooth', 'straight', 'stepline'],
            colors: ["#4079FE"]
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        plotOptions: {
            bar: {
                barHeight: "80%",
                horizontal: true,
                dataLabels: {
                    hideOverflowingLabels: true,
                    position: "center"
                },
                borderRadius: 10
            },
        },
        xaxis: {
            labels: {
                show: true,
                align: 'left',
                style: {
                    colors: [],
                    fontSize: '12px',
                    fontWeight: "bold",
                    cssClass: 'apexcharts-yaxis-label',
                }
            }
        },
        yaxis: {
            labels: {
                show: true,
                align: 'left',
                style: {
                    colors: [],
                    fontSize: '11px',
                    fontWeight: "bold",
                    cssClass: 'apexcharts-yaxis-label',
                }
            },
        },
    };

    return (
        <>
            <Chart options={options} series={series} type="bar" className={"dashboard-chart"} height={320}/>
            <ApplicantsByTheme isVisible={applicantsListTableVisible}
                               setIsVisible={setApplicantsListTableVisible}
                               item={item}/>
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
)(GraphByCategory);