import Chart from 'react-apexcharts';
import "./graphs.css";
import {useEffect, useState} from "react";
import {connect} from "react-redux";
import {getDashboardFilter} from "../../../store/reducer/dashboard";
import axios from "axios";
import {apiUrl} from "../../../config/const";
import ApplicantsByApplicantType from "./ApplicantsByApplicantType";

function GraphByApplicantType({dashboard_filter, textConstants}) {
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const [applicantsListTableVisible, setApplicantsListTableVisible] = useState(false);
    const [item, setItem] = useState(-1);

    useEffect(() => {
        if (!Object.keys(dashboard_filter).length == 0) {
            axios.post(`${apiUrl}/call-center/dashboard/getStatisticsByTypeTin`, {
                regionId: dashboard_filter.regionId,
                dashboardSetting: {
                    fromDate: dashboard_filter.fromDate,
                    toDate: dashboard_filter.toDate,
                    callCenterTypeId: dashboard_filter.callCenterTypeId
                }
            }).then(res => {
                if (res.status === 200 && res.data) {
                    setChartData(res.data);

                    res.data.forEach(obj => {
                        if (obj.count > maxValue) {
                            setMaxValue(obj.count);
                        }
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }, [dashboard_filter]);

    const series = [
        {
            name: textConstants.COUNT,
            data: chartData.map(item => item.count)
        }
    ];

    const createArrayName = (arrayName) => {
        const nameArray = arrayName.split(" ");
        const nameArray2 = new Array();

        if (nameArray.length > 2) {
            nameArray2.push(nameArray[0]);
            nameArray2.push(nameArray[1] + " " + nameArray[2]);
            return nameArray2;
        } else {
            return nameArray;
        }
    }

    const options = {
        colors: ["#4079FE"],
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false
            },
            events: {
                click: function (event, chartContext, config) {
                    setApplicantsListTableVisible(true);
                    setItem(chartData[config.dataPointIndex]);
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
            colors: ['#fff']
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        yaxis: {
            labels: {
                show: true,
                align: 'center',
                style: {
                    fontSize: '12px',
                    fontWeight: "bold",
                    cssClass: 'apexcharts-yaxis-label',
                }
            }
        },
        xaxis: {
            categories: chartData.map(item => item.applicantTypeName).map(name => createArrayName(name)),
            labels: {
                show: true,
                align: 'center',
                style: {
                    colors: [],
                    fontSize: '11px',
                    fontWeight: "bold",
                    cssClass: 'apexcharts-yaxis-label',
                }
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 10
            }
        },
    };

    return (
        <>
            <Chart options={options} series={series} type="bar" className={"dashboard-chart"} height={320}/>
            <ApplicantsByApplicantType isVisible={applicantsListTableVisible}
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
    {getDashboardFilter}
)(GraphByApplicantType);