import "./graphs.css";
import {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import {apiUrl} from "../../../config/const";
import {connect} from "react-redux";
import {getDashboardFilter} from "../../../store/reducer/dashboard";
import apexchart from "apexcharts";

function LineGraph({dashboard_filter}) {
    let legalPersonCountDataList = new Array();
    let individualPersonCountDataList = new Array();
    let entrepreneurPersonCountDataList = new Array();
    let farmPersonCountDataList = new Array();
    const [dates, setDates] = useState([]);
    const [seriesData, setSeriesData] = useState([{name: null, data: []}]);

    useEffect(() => {
        if (!Object.keys(dashboard_filter).length == 0) {
            legalPersonCountDataList = new Array();
            individualPersonCountDataList = new Array();
            entrepreneurPersonCountDataList = new Array();
            farmPersonCountDataList = new Array();
            setDates([]);
            setSeriesData([]);

            axios.get(`${apiUrl}/call-center/dashboard/getDailyStatisticsByApplicantType?callCenterTypeId=${dashboard_filter.callCenterTypeId}`).then(res => {
                if (res.status === 200 && res.data) {
                    const requests = res.data.map((obj, index) => {
                        legalPersonCountDataList.push(obj.legalPersonCount);
                        individualPersonCountDataList.push(obj.individualPersonCount);
                        entrepreneurPersonCountDataList.push(obj.entrepreneurPersonCount);
                        farmPersonCountDataList.push(obj.farmPersonCount);
                        setDates(old => [...old, obj.regDate]);
                    });

                    Promise.all(requests).then(() => {
                        const processDataAsycn = async () => {
                            seriesData.push({name: "юридическое лицо", data: legalPersonCountDataList});
                            seriesData.push({name: "физическое лицо", data: individualPersonCountDataList});
                            seriesData.push({
                                name: "индивидуальный предприниматель",
                                data: entrepreneurPersonCountDataList
                            });
                            seriesData.push({name: "фермер/дехканское хозяйство", data: farmPersonCountDataList});
                        };

                        processDataAsycn().then(() => {
                            apexchart.exec("line_graph", 'updateSeries', seriesData);
                        });
                    });
                }
            });
        }
    }, [dashboard_filter]);

    const options = {
        chart: {
            id: "line_graph",
            toolbar: {
                show: false
            },
            events: {
                dataPointSelection: function (event, chartContext, config) {
                }
            }
        },
        stroke: {
            show: true,
            width: 3,
            curve: ['smooth', 'smooth', 'smooth', 'smooth']
        },
        tooltip: {
            shared: true,
            intersect: false
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
            },
            categories: dates
        },
        colors: ["#d9a5b3", "#1868ae", "#c6d7eb", "#7a2048"],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ["#d9a5b3", "#1868ae", "#c6d7eb", "#7a2048"],
                shadeIntensity: 1,
                type: 'horizontal',
                opacityFrom: 1,
                opacityTo: 1
            },
        },
        markers: {
            size: 4,
            colors: ["#d9a5b3", "#1868ae", "#c6d7eb", "#7a2048"],
            strokeColors: ["#d9a5b3", "#1868ae", "#c6d7eb", "#7a2048"],
            strokeWidth: 5,
            hover: {
                size: 7
            }
        },
        yaxis: {
            labels: {
                show: true,
                align: 'left',
                style: {
                    colors: [],
                    fontSize: '12px',
                    fontWeight: "bold",
                    cssClass: 'apexcharts-yaxis-label'
                }
            }
        }
    };

    return (
        <Chart options={options} series={seriesData} type="line" className={"dashboard-chart"} height={360}/>
    );
}

const mapStateToProps = (state) => ({
    dashboard_filter: state.dashboard.filter,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getDashboardFilter}
)(LineGraph);