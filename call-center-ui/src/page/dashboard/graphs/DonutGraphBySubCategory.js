import Chart from "react-apexcharts";
import "./graphs.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../../config/const";
import {connect} from "react-redux";
import {getDashboardFilter} from "../../../store/reducer/dashboard";

function DonutGraphBySubCategory({dashboard_filter, textConstants}) {
    const [counts, setCounts] = useState([]);
    const [names, setNames] = useState([]);

    useEffect(() => {
        if (!Object.keys(dashboard_filter).length == 0) {
            setCounts([]);
            setNames([]);

            axios.post(`${apiUrl}/call-center/dashboard/getPortionDataBySubCategory`, {
                fromDate: dashboard_filter.fromDate,
                toDate: dashboard_filter.toDate,
                callCenterTypeId: dashboard_filter.callCenterTypeId
            }).then(res => {
                if (res.status === 200 && res.data) {
                    const requests = res.data.map((obj, index) => {
                        setCounts(old => [...old, obj.count]);
                        setNames(old => [...old, obj.name]);
                    });
                }
            });
        }
    }, [dashboard_filter]);

    const options = {
        chart: {
            id: "donut_graph",
            events: {
                // click: function (event, chartContext, config) {
                //     alert(config.dataPointIndex);
                // },
                dataPointSelection: function (event, chartContext, config) {
                    console.log(chartContext);
                    alert(config.dataPointIndex);
                }
            }
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: 0,
            style: {
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: "normal",
                fontSize: '16px',
                colors: ['white']
            }
        },
        stroke: {
            show: true,
            width: 3,
            curve: ['smooth', 'straight', 'stepline'],
            colors: ["white"]
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        colors: ["#4079FE", "#4079FE", "#4079FE", "#4079FE"],
        fill: {
            colors: ["#4079FE"],
            opacity: 1,
            type: 'solid',
            gradient: {
                shade: 'dark',
                type: "horizontal",
                shadeIntensity: 0.5,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1
            },
            pattern: {
                style: 'verticalLines',
                width: 6,
                height: 6,
                strokeWidth: 20,
            },
        },
        labels: names,
        legend: {
            position: 'right',
            horizontalAlign: 'left',
            showForSingleSeries: false,
            showForNullSeries: true,
            showForZeroSeries: true
            /*show: true,
            showForSingleSeries: false,
            showForNullSeries: true,
            showForZeroSeries: true,
            position: 'right',
            horizontalAlign: 'left',
            floating: false,
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial',
            fontWeight: "normal",
            inverseOrder: false,
            width: undefined,
            height: undefined,
            tooltipHoverFormatter: undefined,
            offsetX: 0,
            offsetY: 0,
            labels: names,
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                colors: ["#4079FE", "yellow", "green", "grey"],
                strokeColors: ["#4079FE", "yellow", "green", "grey"],
                fillColors: "white",
                radius: 1,
                offsetX: 0,
                offsetY: 0
            },
            itemMargin: {
                horizontal: 0,
                vertical: 0
            },
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            }*/
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <Chart options={options} series={counts} type="donut" className={"dashboard-chart"} height={380}/>
    );
}

const mapStateToProps = (state) => ({
    dashboard_filter: state.dashboard.filter,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getDashboardFilter}
)(DonutGraphBySubCategory);