import React from 'react'
import ReactDOM from 'react-dom'
// import {LineChart} from 'react-d3-basic'
import ChartJS from 'react-chartjs'

import { Link } from 'react-router'

var LineChart = ChartJS.Line

var data = 
[
{"name":"Darron Weissnat IV","BMI":20.72,"age":39,"birthday":"2005-01-03T00:00:00.000Z","city":"East Russel","married":false,"index":0}
,
{"name":"Pablo Ondricka","BMI":19.32,"age":38,"birthday":"1974-05-13T00:00:00.000Z","city":"Lake Edytheville","married":false,"index":1}
,
{"name":"Mr. Stella Kiehn Jr.","BMI":16.8,"age":34,"birthday":"2003-07-25T00:00:00.000Z","city":"Lake Veronicaburgh","married":false,"index":2}
,
{"name":"Lavon Hilll I","BMI":20.57,"age":12,"birthday":"1994-10-26T00:00:00.000Z","city":"Annatown","married":true,"index":3}
,
{"name":"Clovis Pagac","BMI":24.28,"age":26,"birthday":"1995-11-10T00:00:00.000Z","city":"South Eldredtown","married":false,"index":4}
,
{"name":"Gaylord Paucek","BMI":24.41,"age":30,"birthday":"1975-06-12T00:00:00.000Z","city":"Koeppchester","married":true,"index":5}
,
{"name":"Ashlynn Kuhn MD","BMI":23.77,"age":32,"birthday":"1985-08-09T00:00:00.000Z","city":"West Josiemouth","married":false,"index":6}
,
{"name":"Fern Schmeler IV","BMI":27.33,"age":26,"birthday":"2005-02-10T00:00:00.000Z","city":"West Abigaleside","married":true,"index":7}
,
{"name":"Enid Weber","BMI":18.72,"age":17,"birthday":"1998-11-30T00:00:00.000Z","city":"Zackton","married":true,"index":8}
,
{"name":"Leatha O'Hara","BMI":17.68,"age":42,"birthday":"2010-10-17T00:00:00.000Z","city":"Lake Matilda","married":false,"index":9}
,
{"name":"Korbin Steuber","BMI":16.35,"age":39,"birthday":"1975-06-30T00:00:00.000Z","city":"East Armandofort","married":true,"index":10}
,
{"name":"Brennon Torphy","BMI":27.37,"age":24,"birthday":"2003-10-21T00:00:00.000Z","city":"Croninfort","married":true,"index":11}
,
{"name":"Ms. Genoveva Bradtke","BMI":28.63,"age":19,"birthday":"1983-01-10T00:00:00.000Z","city":"Port Emanuel","married":true,"index":12}
,
{"name":"Gregg Halvorson","BMI":15.45,"age":15,"birthday":"2004-06-15T00:00:00.000Z","city":"Lake Angelinastad","married":false,"index":13}
,
{"name":"Mr. Sabina Schroeder III","BMI":24.27,"age":26,"birthday":"1980-11-22T00:00:00.000Z","city":"Toyview","married":true,"index":14}
,
{"name":"Alanna Mitchell","BMI":29.25,"age":37,"birthday":"1971-08-04T00:00:00.000Z","city":"Lake Monserratmouth","married":false,"index":15}
,
{"name":"Ronny Sanford","BMI":29.16,"age":24,"birthday":"1994-11-24T00:00:00.000Z","city":"New Claudhaven","married":false,"index":16}
,
{"name":"Emmitt Pouros","BMI":27.95,"age":14,"birthday":"1989-04-04T00:00:00.000Z","city":"Moorefurt","married":true,"index":17}
,
{"name":"Earl Purdy","BMI":18.34,"age":38,"birthday":"2013-04-03T00:00:00.000Z","city":"Lake Rowanberg","married":true,"index":18}
,
{"name":"Cordelia Klocko","BMI":25.85,"age":36,"birthday":"2011-01-17T00:00:00.000Z","city":"Lakinchester","married":true,"index":19}
,
{"name":"Guido Conroy","BMI":25.17,"age":39,"birthday":"1977-04-20T00:00:00.000Z","city":"Scarlettland","married":true,"index":20}
,
{"name":"Miss Demond Weissnat V","BMI":21.44,"age":19,"birthday":"2007-06-09T00:00:00.000Z","city":"Savionberg","married":false,"index":21}
,
{"name":"Easton Mante","BMI":20.61,"age":43,"birthday":"2007-01-29T00:00:00.000Z","city":"Kutchberg","married":false,"index":22}
,
{"name":"Dayton Ebert","BMI":29.88,"age":20,"birthday":"1978-04-27T00:00:00.000Z","city":"West Wiley","married":true,"index":23}
]

var chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

var chartOptions = {

    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - Whether the line is curved between points
    bezierCurve : true,

    //Number - Tension of the bezier curve between points
    bezierCurveTension : 0.4,

    //Boolean - Whether to show a dot for each point
    pointDot : true,

    //Number - Radius of each point dot in pixels
    pointDotRadius : 4,

    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth : 1,

    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 20,

    //Boolean - Whether to show a stroke for datasets
    datasetStroke : true,

    //Number - Pixel width of dataset stroke
    datasetStrokeWidth : 2,

    //Boolean - Whether to fill the dataset with a colour
    datasetFill : true,

    //String - A legend template
    // legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

};

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

export default class Participant extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: null,
			width: 500,
			height: 320,
			margins: {left: 10, right: 10, top: 5, bottom: 5},
			chartSeries: [
      {
        field: 'BMI',
        name: 'BMI',
        color: '#ff7f0e'
      }
	    ],
			chartData: data.slice(0,6),
			start: 0,
			nextTime: null,
		}

			this.chartOptions = chartOptions;
			this.chartData = chartData

	}
	getData = (s) => {
		var next = window.setTimeout(() => {
			shuffle(this.chartData.labels);
			shuffle(this.chartData.datasets[0].data);
			shuffle(this.chartData.datasets[1].data);
			this.setState({nextTime: next});
			this.getData(s);
			console.log('timeout', next);
		}, 2000);
	}
	componentDidMount() {
		this.getData(0);

	}
	componentWillUnmount() {
		console.log('dash unmount', this.state.nextTime);
		window.clearTimeout(this.state.nextTime);
	}
	render() {

		var x = function(d) {
			return d.index;
		}
		return(
			<LineChart data={this.chartData} options={this.chartOptions} width="600" height="250"/>
		)
		// return(
		// 	<div>
  //   <Chart
  //     title={this.state.title}
  //     width={this.state.width}
  //     height={this.state.height}
  //     margins= {this.state.margins}
  //     >
  //     <LineChart
  //       margins= {this.state.margins}
  //       title={this.state.title}
  //       data={this.state.chartData}
  //       width={this.state.width}
  //       height={this.state.height}
  //       chartSeries={this.state.chartSeries}
  //       x={x}
  //     />
  //   </Chart>
		// 	</div>
		// )
	}
}
