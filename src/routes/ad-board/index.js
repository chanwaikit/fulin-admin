//框架依赖
import React, {Component, PureComponent} from 'react';
import { Select, Input, DatePicker, Button, Row, Col, Modal, Table } from 'antd';
import callApi from 'utils/callApi';
import * as echarts from 'echarts';
import CountUp from 'react-countup';
import moment from 'moment';
import ChartModal from './Modal';

import dayjs from 'dayjs';
import './index.less';
const {Option} = Select;
const { RangePicker } = DatePicker;
const spColor = '#45C2E0';
const sbColor = '#C1EBDD';
const sbvColor = '#FFC851';
const sdColor = '#5A5476';

class Logon extends (PureComponent || Component) {
  state = {
  	pickerDate: [moment('2021-07-22', 'YYYY-MM-DD'), moment('2021-08-18', 'YYYY-MM-DD')],
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
  	const {pickerDate = [], mid} = this.state;

  	this.setState({
  		spinning: true
  	});

  	callApi({
  		type: 'POST',
  		api: '/statistic/getAllStatistic',
  		data: {
  			startDate: dayjs(pickerDate[0]).format('YYYY-MM-DD'),
  			endDate: dayjs(pickerDate[1]).format('YYYY-MM-DD'),
  			mid
  		},
  		success: (res = {}) => {
  			const {categories = [], cost_sum, gross_profit_sum, sales_amount_sum, x_axis} = res;
  			this.setState({
  				categories: categories,
  				x_axis,
  				cost_sum,
  				sales_amount_sum,
  				gross_profit_sum
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

  	var chartDom = document.getElementById('chart_pie');
  	var myChart = echarts.init(chartDom, 'dark');
  	const costData = [];
  	const saleData = [];
  	const acosData = [];
  	const profitData = [];
  	const profitRateData = [];

  	const costValues = [];
  	const saleValues = [];
  	const acostValues = [];
  	const profitValues = [];
  	const profitRateValues = [];

  	categories.map((item) => {
  		let costValue = [];
  		let saleValue = [];
  		let acosValue = [];
  		let profitValue = [];
  		let profitRateValue = [];

  		costData.push({
  			name: item.title,
  			value: Number(item.total_cost).toFixed(2)
  		});
  		saleData.push({
  			name: item.title,
  			value: Number(item.total_sales_amount).toFixed(2)
  		});

  		profitRateData.push({
  			name: item.title,
  			value: Number(item.total_gross_profit_rate * 100).toFixed(2)
  		});

  		profitData.push({
  			name: item.title,
  			value: Number(item.total_gross_profit).toFixed(2)
  		});

  		acosData.push({
  			name: item.title,
  			value: ((item.total_cost / item.total_sales_amount) * 100).toFixed(2)
  		});

  		item.weekAds.map((element) => {
  			costValue.push(Number(element.cost).toFixed(2));
  			saleValue.push(Number(element.sales_amount).toFixed(2));
  			acosValue.push(((element.cost / element.sales_amount) * 100).toFixed(2));
  			profitValue.push(Number(element.gross_profit).toFixed(2));
  			profitRateValue.push(((element.gross_profit / element.sales_amount) * 100).toFixed(2));
  		});
  		costValues.push(costValue);
  		saleValues.push(saleValue);
  		acostValues.push(acosValue);
  		profitValues.push(profitValue);
  		profitRateValues.push(profitRateValue);
  	});
  	var option = {
  		legend: {
  			data: costData,
  		},
  		grid: [
  			{left: '77.5%', top: '10%', width: '20%', height: '20%'},
  			{left: '5%', top: '38%', width: '40%', height: '25%'},
  			{left: '55%', top: '38%', width: '40%', height: '25%'},
  			{left: '5%', top: '70%', width: '40%', height: '25%'},
  			{left: '55%', top: '70%', width: '40%', height: '25%'},

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
  			// link: {xAxisIndex: 'all'}
  		},
  		// dataZoom: [
  		// 	{
  		// 		show: true,
  		// 		realtime: true,
  		// 		start: 0,
  		// 		end: 100,
  		// 		xAxisIndex: [0, 1, 2]
  		// 	},
  		// 	{
  		// 		type: 'inside',
  		// 		realtime: true,
  		// 		start: 30,
  		// 		end: 70,
  		// 		xAxisIndex: [0, 1, 2]
  		// 	}
  		// ],
  		xAxis: [
  			{
  				type: 'value',
  				gridIndex: 0,
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
  				type: 'category',
  				gridIndex: 0
  			},
  			{
  				type: 'value',
  				gridIndex: 1,
  				name: '总销售额',

  			},
  			{
  				type: 'value',
  				gridIndex: 2,
  				name: '总利润',

  			},
  			{
  				type: 'value',
  				gridIndex: 3,
  				name: '广告花费',

  			},
  			{
  				type: 'value',
  				gridIndex: 4,
  				name: '毛利率',

  			}
  		],
  		title: [{
  			// text: 'Pie label alignTo',
  			// left: 'center',
  		}, {
  			subtext: '总销售额',
  			left: '12%',
  			top: '3%',
  			textAlign: 'center'
  		}, {
  			subtext: '毛利额',
  			left: '37%',
  			top: '3%',
  			textAlign: 'center'
  		}, {
  			subtext: '广告总费用',
  			left: '62%',
  			top: '3%',
  			textAlign: 'center'
  		}, {
  			subtext: '毛利率（%）',
  			left: '77%',
  			top: '3%',
  			textAlign: 'center'
  		}],

  		series: [
  			this.getReadOnlyPieOption(0, saleData),
  			this.getPieOption(0, saleData),
  			this.getReadOnlyPieOption(1, profitData),
  			this.getPieOption(1, profitData),
  			this.getReadOnlyPieOption(2, costData),
  			this.getPieOption(2, costData),

  			{
  				name: profitRateData[0].name,
  				type: 'bar',
  				xAxisIndex: 0,
  				yAxisIndex: 0,
  				label: {
  					show: true,
  					position: 'inside'
  				},
  				itemStyle: {
  					normal: {
  						color: spColor
  					}
  				},
  				data: [profitRateData[0].value]
  			},
  			{
  				name: profitRateData[1].name,
  				type: 'bar',
  				xAxisIndex: 0,
  				yAxisIndex: 0,
  				label: {
  					show: true,
  					position: 'inside'
  				},
  				itemStyle: {
  					normal: {
  						color: sbColor
  					}
  				},
  				data: [profitRateData[1].value]
  			},

  			{
  				name: saleData[0].name,
  				type: 'line',
  				xAxisIndex: 1,
  				yAxisIndex: 1,
  				label: {
  					show: true,
  					position: 'top'
  				},
  				itemStyle: {
  					normal: {
  						color: spColor
  					}
  				},
  				data: saleValues[0]
  			},
  			{
  				name: saleData[1].name,
  				type: 'line',
  				xAxisIndex: 1,
  				yAxisIndex: 1,
  				label: {
  					show: true,
  					position: 'top'
  				},
  				itemStyle: {
  					normal: {
  						color: sbColor
  					}
  				},
  				data: saleValues[1]
  			},
  			{
  				name: profitData[0].name,
  				type: 'line',
  				xAxisIndex: 2,
  				yAxisIndex: 2,
  				label: {
  					show: true,
  					position: 'top'
  				},
  				itemStyle: {
  					normal: {
  						color: spColor
  					}
  				},
  				data: profitValues[0]
  			},
  			{
  				name: profitData[1].name,
  				type: 'line',
  				xAxisIndex: 2,
  				yAxisIndex: 2,
  				label: {
  					show: true,
  					position: 'top'
  				},
  				itemStyle: {
  					normal: {
  						color: sbColor
  					}
  				},
  				data: profitValues[1]
  			},
  			{
  				name: costData[0].name,
  				type: 'line',
  				xAxisIndex: 3,
  				yAxisIndex: 3,
  				label: {
  					show: true,
  					position: 'top'
  				},
  				itemStyle: {
  					normal: {
  						color: spColor
  					}
  				},
  				data: costValues[0]
  			},
  			{
  				name: costData[1].name,
  				type: 'line',
  				xAxisIndex: 3,
  				yAxisIndex: 3,
  				label: {
  					show: true,
  					position: 'top'
  				},
  				itemStyle: {
  					normal: {
  						color: sbColor
  					}
  				},
  				data: costValues[1]
  			},
  			{
  				name: profitRateData[0].name,
  				type: 'line',
  				xAxisIndex: 4,
  				yAxisIndex: 4,
  				label: {
  					show: true,
  					position: 'top'
  				},
  				itemStyle: {
  					normal: {
  						color: spColor
  					}
  				},
  				data: profitRateValues[0]
  			},
  			{
  				name: profitRateData[1].name,
  				type: 'line',
  				xAxisIndex: 4,
  				yAxisIndex: 4,
  				label: {
  					show: true,
  					position: 'top'
  				},
  				itemStyle: {
  					normal: {
  						color: sbColor
  					}
  				},
  				data: profitRateValues[1]
  			},
    	 ]
  	};
  	const self = this;
  	const categoryEnum = {'美妆': 1001, '电子影音': 1002};
  	myChart.on('click', function (params) {
  		console.log(params);
  		self.setState({
  			currentCid: categoryEnum[params.data.name || params.seriesName],
  			visible: true,
  			categoryName: params.data.name || params.seriesName
  		});
  	});
  	option && myChart.setOption(option);
  	window.addEventListener('resize', function () {
  		myChart.resize(option);
  	});
  }

  getReadOnlyPieOption = (index, data) => {
  	return {
  		color: [spColor, sbColor],

  		clickable: false,
  			type: 'pie',
  		  radius: '20%',
  			center: [(index) * 25 + 12.5 + '%', '20%'],
  			hoverAnimation: false,
  			legendHoverLink: false,
  			label: {
  				normal: {
  					show: true,
  					formatter: `{b}:{@[${index + 1}]}`
  				},
  			},
  			silent: true,
  		  data
  	};
  }
  getPieOption = (index, data) => {
  	const labelOption = {
  		normal: {
  			show: true,
  			position: 'inside',
  			formatter: '{d}' + '%'
  		},
  		emphasis: {
  			show: true,
  			textStyle: {
  				fontSize: '18',
  				fontWeight: 'bold'
  			}

  		}

  	};
  	return {
  	  	color: [spColor, sbColor],

  			clickable: false,
  			type: 'pie',
  		  radius: '20%',
  			center: [(index) * 25 + 12.5 + '%', '20%'],
  			label: labelOption,
  			encode: {
  				itemName: 'model',
  				value: 'cost'
  			},
  		  data
  		};
  }

  Statistic = (props) => {
  	return <div className="ant-statistic">
  		<div className="ant-statistic-title" style={{textAlign: 'center'}}>{props.title}</div>
  		<div className="ant-statistic-content" style={{textAlign: 'center'}}>
  			<span className="ant-statistic-content-value">
  				<span className="ant-statistic-content-value-int">
  					{props.currencyCode}<CountUp start={0} duration={1} decimals={2} end={props.value} />{props.endFix}
  				</span>
  			</span>
  		</div>
  	</div>;
  }

  render () {
  	const {data = {}, categoryName = '', currentCid = '', visible, pickerDate = [], mid, gross_profit_sum,	cost_sum = 0, sales_amount_sum = 0} = this.state;
  	const Statistic = this.Statistic;

  	return <div id="ad-board" style={{height: '100%', overflowY: 'auto'}}>
  		<div >

  			<div style={{marginBottom: '16px'}}>
  				<Row gutter={24}>
  					<Col span={6}>

              请选择时间：
  						<RangePicker
  							value={pickerDate}
  							onChange={(value) => {
  								this.setState({
  									pickerDate: value
  								}, () => {
  									this.getData();
  								});
  							}}/>
          	</Col>

  					{/* <Col span={6}>
          请选择国家：
  			<Select value={String(mid)} style={{ width: 120 }} onChange={(value) => {
  				this.setState({
  					mid: value
  				}, () => {
  					this.getData();
  				});
  			}}>
  				<Option value="">全部</Option>
  				<Option value="1">美国</Option>
  				<Option value="4">英国</Option>
  				<Option value="5">德国</Option>
  				<Option value="6">法国</Option>
  				<Option value="7">意大利</Option>
  				<Option value="8">西班牙</Option>
  				<Option value="10">日本</Option>
  				<Option value="15">荷兰</Option>
  			</Select>
  			</Col> */}
  				</Row>
  		</div>

  			<Row gutter={24}>
  			<Col span={6}>
  				<Statistic title="总销售额" currencyCode={'$'} value={
  					Number(sales_amount_sum)
  				} />
  			</Col>

  			<Col span={6}>
  				<Statistic title="毛利额" currencyCode={'$'} value={
  					Number(gross_profit_sum)
  				} />
  			</Col>

  				<Col span={6}>
  				<Statistic title="广告总花费" currencyCode={'$'} value={
  					  Number(cost_sum)
  				} />
  			</Col>

  				<Col span={6}>
  				<Statistic title="毛利率" endFix={'%'} value={
  					  (Number(gross_profit_sum) / Number(sales_amount_sum)) * 100
  				} />
  			</Col>
  		</Row>

  		<div id="chart_pie" style={{width: '100%', height: 650}}/>
  			{visible && <Modal
  				title={`${categoryName}-各站点对比`}
  				centered
  				visible={visible}
  				onOk={() => this.setState({visible: false})}
  				onCancel={() => this.setState({visible: false})}
  				width={'70vw'}
  			>
  				<div>
  				  {!!visible && <ChartModal pickerDate={this.state.pickerDate} categoryName={categoryName} cid={currentCid}/>}

  				</div>
  			</Modal>}
  	</div>
  	</div>;
  }
}
export default Logon;
