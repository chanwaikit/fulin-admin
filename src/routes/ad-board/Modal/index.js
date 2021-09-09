//框架依赖
import React, {Component, PureComponent} from 'react';
import { Select, Input, Drawer, DatePicker, Button, Row, Col, Modal, Table } from 'antd';
import callApi from 'utils/callApi';
import DrawerInfo from '../Drawer';
import * as echarts from 'echarts';
import moment from 'moment';

import dayjs from 'dayjs';
// import './index.less';
const {Option} = Select;
const { RangePicker } = DatePicker;
const spColor = '#45C2E0';
const sbColor = '#C1EBDD';
const sbvColor = '#FFC851';
const sdColor = '#5A5476';

class Logon extends (PureComponent || Component) {
  state = {
  	pickerDate: [moment('2021-07-01', 'YYYY-MM-DD'), moment('2021/07/28', 'YYYY-MM-DD')],
  	categories: [],
  	x_axis: [],
  	cost_sum: 0,
  	sales_amount_sum: 0,
  	mid: ''
  }

  componentDidMount () {
  	this.getData();
  }
  getData = () => {
  	const {pickerDate = []} = this.props;
  	const {cid} = this.props;
  	this.setState({
  		spinning: true
  	});

  	callApi({
  		type: 'POST',
  		api: '/statistic/getCountryStatistic',
  		data: {
  			startDate: dayjs(pickerDate[0]).format('YYYY-MM-DD'),
  			endDate: dayjs(pickerDate[1]).format('YYYY-MM-DD'),
  			cid
  		},
  		success: (res = {}) => {
  			const {categories = [], x_axis} = res;
  			this.setState({
  				categories: categories,
  				x_axis,
  			}, () => {
  				this.initChartPie();
  			});
  		},
  		error: () => {

  		}
  	});
  }

  initChartPie = () => {
  	const {categories = [], x_axis = []} = this.state;

  	var chartDom = document.getElementById('chart_modal');
  	var myChart = echarts.init(chartDom, 'dark');

  	const costValues = [];
  	const saleValues = [];
  	const adSaleValues = [];
  	const adOrdersValues = [];
  	const ppoValues = [];

  	const acostValues = [];
  	const profitValues = [];
  	const profitRateValues = [];
  	let legends = [];

  	categories.map((item) => {
  		let costValue = [];
  		let saleValue = [];
  		let acosValue = [];
  		let profitValue = [];
  		let profitRateValue = [];
  		let adSaleValue = [];
  		let adOrdersValue = [];
  		let ppoValue = [];
  		legends.push(item.title);

  		item.weekAds.map((element) => {
  			adOrdersValue.push(parseInt(element.ad_orders));
  			costValue.push(Number(element.cost).toFixed(2));
  			saleValue.push(Number(element.sales_amount).toFixed(2));
  			adSaleValue.push(Number(element.ad_sales_amount).toFixed(2));
  			acosValue.push(element.ad_sales_amount ? ((element.cost / (element.ad_sales_amount || 1)) * 100).toFixed(2) : 0);
  			profitValue.push(Number(element.gross_profit).toFixed(2));
  			profitRateValue.push(((element.gross_profit / element.sales_amount) * 100).toFixed(2));
  			ppoValue.push((element.cost / (element.ad_orders || 1)).toFixed(2));
  		});
  		adOrdersValues.push(adOrdersValue);
  		ppoValues.push(ppoValue);

  		adSaleValues.push(adSaleValue);
  		costValues.push(costValue);
  		saleValues.push(saleValue);
  		acostValues.push(acosValue);
  		profitValues.push(profitValue);
  		profitRateValues.push(profitRateValue);
  		// console.log(2222, ppoValues);

  		console.log(1111, acosValue);
  	});
  	const seriesLine = [];
  	//     const spColor = '#45C2E0';
  	// const sbColor = '#C1EBDD';
  	// const sbvColor = '#FFC851';
  	// const sdColor = '#5A5476';

  	const colorArray = ['#45C2E0', '#C1EBDD', '#FFC851', '#5A5476', '#87CEFF', '#CDB5CD', '#00ff7f', '#120afb', '#8c08f1'];
  	costValues.map((item, index) => {
  		seriesLine.push({
  			name: legends[index],
  			type: 'line',
  			xAxisIndex: 0,
  			yAxisIndex: 0,

  			itemStyle: {
  				normal: {
  					color: colorArray[index]
  				}
  			},
  			data: item
  		});
  	});
  	adOrdersValues.map((item, index) => {
  		seriesLine.push({
  			name: legends[index],
  			type: 'line',
  			xAxisIndex: 1,
  			yAxisIndex: 1,

  			itemStyle: {
  				normal: {
  					color: colorArray[index]
  				}
  			},
  			data: item
  		});
  	});

  	ppoValues.map((item, index) => {
  		seriesLine.push({
  			name: legends[index],
  			type: 'line',
  			xAxisIndex: 2,
  			yAxisIndex: 2,
  			itemStyle: {
  				normal: {
  					color: colorArray[index]
  				}
  			},
  			data: item
  		});
  	});

  	acostValues.map((item, index) => {
  		seriesLine.push({
  			name: legends[index],
  			type: 'line',
  			xAxisIndex: 3,
  			yAxisIndex: 3,
  			itemStyle: {
  				normal: {
  					color: colorArray[index]
  				}
  			},
  			data: item
  		});
  	});

  	profitValues.map((item, index) => {
  		seriesLine.push({
  			name: legends[index],
  			type: 'line',
  			xAxisIndex: 4,
  			yAxisIndex: 4,
  			itemStyle: {
  				normal: {
  					color: colorArray[index]
  				}
  			},
  			data: item
  		});
  	});

  	var option = {
  		colors: ['#45C2E0', '#C1EBDD'],
  		legend: {
  			data: legends

  		},
  		link: {xAxisIndex: 'all'},

  		grid: [
  			{left: '5%', top: '10%', width: '40%', height: '20%'},
  			{left: '55%', top: '10%', width: '40%', height: '20%'},
  			{left: '5%', top: '40%', width: '40%', height: '20%'},
  			{left: '55%', top: '40%', width: '40%', height: '20%'},
  			{left: '5%', top: '70%', width: '40%', height: '20%'},

  		],
  		tooltip: {
  			trigger: 'axis',
  			axisPointer: {
  				type: 'shadow'
  			},
  			confine: true,
  			// formatter: function (params) {
  			// 	const keys = ['销售', '销售', '毛利额', '毛利额', '广告花费', '广告花费', '毛利率', '毛利率'];
  			// 	params.sort((a, b) => a.componentIndex - b.componentIndex);
  			// 	let html = '<p >' + params[0].axisValue + '</p>';

  			// 	params.map((item, index) => {
  			// 		// html += item.seriesName + keys[index] + ':' + item.value + '<br/>';
  			// 		html += `<p style="width:200px;"><div style="display:flex;"><div style="flex:1;">${item.marker}${keys[index]}</div> <div style="font-weight:bold;text-aligh:right">${item.value}</div> </div></p>`;
  			// 	});
  			// 	// var tar = params[1];
  			// 	// const date_str = params[0].axisValue;
  			// 	return html;
  			// }
  		},
  		axisPointer: {
  		},

  		xAxis: [
  			{
  				type: 'category',
  				gridIndex: 0,
  				splitLine: {show: false},
  				axisLine: {onZero: true},

  				data: x_axis
  			},
  			{
  				type: 'category',
  				gridIndex: 1,
  				splitLine: {show: false},
  				axisLine: {onZero: true},

  				data: x_axis
  			},
  			{
  				type: 'category',
  				gridIndex: 2,
  				splitLine: {show: false},
  				axisLine: {onZero: true},

  				data: x_axis
  			},
  			{
  				type: 'category',
  				gridIndex: 3,
  				splitLine: {show: false},
  				axisLine: {onZero: true},

  				data: x_axis
  			},
  			{
  				type: 'category',
  				gridIndex: 4,
  				splitLine: {show: false},
  				axisLine: {onZero: true},

  				data: x_axis
  			}

  		],
  		yAxis: [
  			{
  				type: 'value',
  				gridIndex: 0,
  				name: '广告花费',

  			},
  			{
  				type: 'value',
  				gridIndex: 1,
  				name: '广告订单量',

  			},
  			{
  				type: 'value',
  				gridIndex: 2,
  				name: '每单花费',

  			},
  			{
  				type: 'value',
  				gridIndex: 3,
  				name: '广告ACOS（%）',

  			},
  			{
  				type: 'value',
  				gridIndex: 4,
  				name: '毛利额',

  			}
  		],
  		series: seriesLine
  	};
  	const self = this;
  	const midEnum = {'美国': 1, '日本': 10, '英国': 4, '德国': 5, '法国': 6, '意大利': 7, '西班牙': 8};

  	myChart.on('click', function (params) {
  		self.setState({
  			currentMid: midEnum[params.data.name || params.seriesName],
  			visible: true,
  			midName: params.data.name || params.seriesName
  		});
  	});

  	option && myChart.setOption(option);
  	window.addEventListener('resize', function () {
  		myChart.resize(option);
  	});
  }

  render () {
  	const {midName = '', visible, currentMid, pickerDate = [], mid, gross_profit_sum,	cost_sum = 0, sales_amount_sum = 0} = this.state;
  	const {cid, categoryName} = this.props;

  	return <div >
  		<div id="chart_modal" style={{width: '100%', height: 650}}/>
  		{visible && <Drawer
  			width={'80vw'}
  			title={`${midName}-${categoryName}`}
  			closable={false}
  			onClose={() => this.setState({visible: false})}
  			visible={visible}
  		>
  			<DrawerInfo pickerDate={this.props.pickerDate} mid={currentMid} cid={cid}/>
  		</Drawer>}
  	</div>;
  }
}
export default Logon;
