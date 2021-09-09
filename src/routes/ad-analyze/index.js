//框架依赖
import React, {Component, PureComponent} from 'react';
import { Select, Input, DatePicker, Drawer, Spin, Button, Row, Col, Table } from 'antd';
import { Base64 } from 'js-base64';
import sha256 from 'sha256';
import callApi from 'utils/callApi';
import getUrlQuery from 'utils/getUrlQuery';

// var echarts = require('echarts');
import * as echarts from 'echarts';
import CountUp from 'react-countup';
import moment from 'moment';

import dayjs from 'dayjs';
import './index.less';
import { ValueType } from '_exceljs@4.2.1@exceljs';
const {Option} = Select;
const { RangePicker } = DatePicker;
const spColor = '#45C2E0';
const sbColor = '#C1EBDD';
const sbvColor = '#FFC851';
const sdColor = '#5A5476';

class Logon extends (PureComponent || Component) {
  state = {
  	pickerDate: [moment(getUrlQuery().startDate || '2021-07-01', 'YYYY-MM-DD'), moment(getUrlQuery().endDate || '2021-07-28', 'YYYY-MM-DD')],
  	visible: false,
  	drawerInfo: {},
  	spinning: false,
  	drawSpinning: false,
  	current_local_sku_mid: `${getUrlQuery().name}_${getUrlQuery().mid}`
  }

  userIdentifier='12000001802'
  password=sha256('abc123')
  namespaceId='11'

  componentDidMount () {
  	const {pickerDate} = this.state;
  	this.getData();
  }

  getWeekData = () => {
  	const {cid, current_local_sku_mid, pickerDate = []} = this.state;
  	const mid = current_local_sku_mid.slice(current_local_sku_mid.lastIndexOf('_') + 1);
  	const localSku = current_local_sku_mid.slice(0, current_local_sku_mid.lastIndexOf('_'));
  	console.log(current_local_sku_mid);
  	this.setState({
  		spinning: true
  	});
  	callApi({
  		type: 'POST',
  		// api: '/statistic/getSkuWeekStatistic',
  		api: '/statistic/getSkuStatistic',

  		data: {
  			startDate: dayjs(pickerDate[0]).format('YYYY-MM-DD'),
  			endDate: dayjs(pickerDate[1]).format('YYYY-MM-DD'),
  			local_sku: localSku,
  			mid
  		},
  		success: (res = {}) => {
  			const {x_axis = [], categories = []} = res;
  			const xAxisData = x_axis;

  			const pSkuWeekData = categories[0] ? categories[0].weekAds : [];
  			this.setState({
  				spinning: false,
  				xAxisData,
  				skuWeekData: pSkuWeekData
  			}, () => {
  			this.initChartAd();
  			});
  		},
  		error: () => {

  		}
  	});
  }
  initChartAd = () => {
  	const self = this;
  	const {categories = [], current_local_sku_mid, modalSelect, selectedRowKeys = [], tableData = [], skuWeekData = [], xAxisData = []} = this.state;

  	const chartDom = document.getElementById('chart_ad');
  	const myChart = echarts.init(chartDom, 'dark');
  	const cpoArray = [];
  	const cvrArray = [];
  	const cpcArray = [];
  	const allOrdersArray = [];
  	const adCostArray = [];
  	const impressionsArray = [];
  	const ctrArray = [];
  	const profitArray = [];
  	const salesAmountArray = [];
  	const totalAcosArray = [];
  	const profitRateArray = [];
  	xAxisData.map((dayStr, index) => {
  		// skuWeekData[index];

  			const obj = skuWeekData[index] || {};
  		  const adCpo = (obj.cost / (obj.ad_orders || 1)).toFixed(2);
  		  const allCpc = (obj.cost / (obj.ad_clicks || 1)).toFixed(2);
  		  const allCvr = (obj.ad_orders / (obj.ad_clicks || 1) * 100).toFixed(2);
  		  const allCtr = (obj.ad_clicks / (obj.ad_impressions || 1) * 100).toFixed(2);

  			cpoArray.push(Number(adCpo || 0));
  		  cpcArray.push(Number(allCpc || 0));
  		  cvrArray.push(Number(allCvr || 0));
  		  allOrdersArray.push(window.parseInt(obj.ad_orders || 0));
  		  adCostArray.push(Number(obj.cost || 0).toFixed(2));
  		  impressionsArray.push(window.parseInt(obj.ad_impressions || 0));
  		  ctrArray.push(Number(allCtr || 0));
  		  profitArray.push(Number(obj.gross_profit || 0).toFixed(2));
  		  salesAmountArray.push(Number(obj.sales_amount || 0).toFixed(2));
  	  	totalAcosArray.push(Number(obj.total_acos || 0).toFixed(2));
  		  profitRateArray.push(Number(obj.profit_rate || 0).toFixed(2));
  	});

  	const option = {
  		title: [{
  			// text: 'Pie label alignTo',
  			// left: 'center',
  		}],
  		tooltip: {
  			trigger: 'axis',
  			axisPointer: {
  				type: 'cross',
  				crossStyle: {
  					color: '#999'
  				}
  			}
  		},
  		grid: [
  			{left: '10%', top: '10%', width: '35%', height: '110px'},
  			{left: '55%', top: '10%', width: '35%', height: '110px'},
  			{left: '10%', top: '40%', width: '35%', height: '110px'},
  			{left: '55%', top: '40%', width: '35%', height: '110px'},
  			{left: '10%', top: '70%', width: '35%', height: '110px'},
  			{left: '55%', top: '70%', width: '35%', height: '110px'},

  		],
  		xAxis: [{
  			type: 'category',
  			data: xAxisData,
  			gridIndex: 0,
  			triggerEvent: true

  		}, {
  			type: 'category',
  			data: xAxisData,
  			gridIndex: 1,
  			triggerEvent: true

  		}, {
  			type: 'category',
  			data: xAxisData,
  			gridIndex: 2,
  			triggerEvent: true

  		}, {
  			type: 'category',
  			data: xAxisData,
  			gridIndex: 3,
  			triggerEvent: true

  		}, {
  			type: 'category',
  			data: xAxisData,
  			gridIndex: 4,
  			triggerEvent: true

  		}, {
  			type: 'category',
  			data: xAxisData,
  			gridIndex: 5,
  			triggerEvent: true

  		}],
  		yAxis: [{
  			type: 'value',
  			gridIndex: 0,
  			name: '每单花费',

  		}, {
  			type: 'value',
  			gridIndex: 1,
  			name: 'cpc点击花费',

  		}, {
  			type: 'value',
  			gridIndex: 2,
  			name: '广告转化率',

  		}, {
  			type: 'value',
  			gridIndex: 3,
  			name: '广告订单',

  		}, {
  			type: 'value',
  			gridIndex: 3,
  			name: '广告花费',

  		}, {
  			type: 'value',
  			name: '广告曝光量',

  			gridIndex: 4,

  		}, {
  			type: 'value',
  			gridIndex: 4,
  			name: '广告点击率',

  		}, {
  			type: 'value',
  			gridIndex: 5,

  		}, {
  			type: 'value',
  			gridIndex: 5,

  		}],
  		series: [{
  			name: '每单花费',
  			data: cpoArray,
  			type: 'line',
  			label: {
  				show: true,
  				position: 'top'
  			},
  			xAxisIndex: 0,
  			yAxisIndex: 0,
  		}, {
  			name: 'cpc',
  			data: cpcArray,
  			type: 'line',
  			label: {
  				show: true,
  				position: 'top'
  			},
  			xAxisIndex: 1,
  			yAxisIndex: 1,
  		}, {
  			name: '广告转化率',
  			data: cvrArray,
  			type: 'line',
  			label: {
  				show: true,
  				position: 'top'
  			},
  			xAxisIndex: 2,
  			yAxisIndex: 2,
  		}, {
  			name: '广告订单',
  			label: {
  				show: true,
  				position: 'inside'
  			},
  			data: allOrdersArray,
  			type: 'bar',
  			xAxisIndex: 3,
  			yAxisIndex: 3,
  		}, {
  			name: '广告花费',
  			label: {
  				show: true,
  				position: 'top'
  			},
  			data: adCostArray,
  			type: 'line',
  			xAxisIndex: 3,
  			yAxisIndex: 4,
  		}, {
  			name: '广告曝光量',
  			label: {
  				show: true,
  				position: 'inside'
  			},
  			data: impressionsArray,
  			type: 'bar',
  			xAxisIndex: 4,
  			yAxisIndex: 5,
  		}, {
  			name: '广告点击率',
  			label: {
  				show: true,
  				position: 'top'
  			},
  			data: ctrArray,
  			type: 'line',
  			xAxisIndex: 4,
  			yAxisIndex: 6,
  		}, {
  			name: '毛利润',
  			data: profitArray,
  			type: 'bar',
  			label: {
  				show: true,
  				position: 'inside'
  			},
  			xAxisIndex: 5,
  			yAxisIndex: 7,
  		}, {
  			name: '总销售额',
  			data: salesAmountArray,
  			type: 'bar',
  			label: {
  				show: true,
  				position: 'inside'
  			},
  			xAxisIndex: 5,
  			yAxisIndex: 7,
  		}, {
  			name: '综合acos',
  			data: totalAcosArray,
  			type: 'line',
  			xAxisIndex: 5,
  			yAxisIndex: 8,
  		}, {
  			name: '毛利率',
  			data: profitRateArray,
  			type: 'line',
  			xAxisIndex: 5,
  			yAxisIndex: 8,
  		}

  		]
  	};
  	myChart.on('click', function (params) {
  		if (params.componentType == 'xAxis') {
  			console.log(params);
  			const start_date_str = params.value;
  			const end_date_str = dayjs(dayjs(params.value).valueOf() + 6 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
  			self.setState({
  				visible: true,
  				drawerInfo: {
  					start_date_str,
  					end_date_str
  				}
  			}, () => {
  				self.getDetail(start_date_str, end_date_str);
  			});
  			// alert('单击了' + params.value + 'x轴标签, 你点击的是第');
  		} else {
  			console.log(111);
  			// alert('单击了' + params.name + '柱状图, 你点击的是第' + (params.dataIndex + 1) + '个柱状图；当前对应的id为：' + ids[params.dataIndex]);   //数组下标是从0开始的哦，图也是从0开始的
  		}
  	});
  	option && myChart.setOption(option);

  	window.addEventListener('resize', function () {
  		myChart.resize(option);
  	});
  }

  getDetail = (startDate, endDate) => {
  	const {current_local_sku_mid} = this.state;
  	const mid = current_local_sku_mid.slice(current_local_sku_mid.lastIndexOf('_') + 1);
  	const localSku = current_local_sku_mid.slice(0, current_local_sku_mid.lastIndexOf('_'));
  	this.setState({
  		drawSpinning: true
  	});
  	callApi({
  		type: 'POST',
  		// api: '/statistic/getProfit',

  		api: '/statistic/getSkuStatistic',

  		data: {
  			startDate: startDate,
  			endDate: endDate,
  			mid,
  			local_sku: localSku
  		},
  		success: (res = {}) => {
  			const {categories = []} = res;

  			this.setState({
  				drawSpinning: false,
  				data: categories[0] || {},
  			}, () => {
  				this.initChartPie();
  				// this.initChartBar();
  			});
  		},
  		error: () => {

  		}
  	});
  }

  getData = () => {
  	const {current_local_sku_mid, pickerDate = []} = this.state;

  	this.setState({
  		drawSpinning: true
  	});
  	callApi({
  		type: 'POST',
  		api: '/statistic/getLocalSkuMidList',
  		data: {

  		},
  		success: (res = []) => {
  			let data = res[0];

  			this.setState({
  				drawSpinning: false,
  				data,
  				allData: res,
  				current_local_sku_mid: getUrlQuery().name ? `${getUrlQuery().name}_${getUrlQuery().mid}` : data.local_sku + '_' + data.mid
  			}, () => {
  	      this.getWeekData();
  			});
  		},
  		error: () => {

  		}
  	});
  }

  getReadOnlyPieOption = (index, data) => {
  	return {
  		color: [spColor, sbColor, sbvColor, sdColor],

  		clickable: false,
  			type: 'pie',
  			radius: '25%',
  			center: [((index * 2 + 1) * 10 + 8) + '%', '25%'],
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
  	  	color: [spColor, sbColor, sbvColor, sdColor],

  			clickable: false,
  			type: 'pie',
  			radius: '25%',
  			center: [((index * 2 + 1) * 10 + 8) + '%', '25%'],
  			label: labelOption,
  			encode: {
  				itemName: 'model',
  				value: 'cost'
  			},
  		  data
  		};
  }

  getBarLabelOption = (type, position = 'bottom', id) => {
  	return {
  		normal: {
  			show: true,
  			position: position,
  			formatter: position === 'top' ? '\n{c}' + `${id === 6 || id === 7 ? '' : '%'}` : type
  		},

  		emphasis: {
  			show: true,
  			textStyle: {
  				fontSize: '18',
  				fontWeight: 'bold'
  			}

  		}

  	};
  }

  getBarOption = (position, id, data = [1, 2, 3, 4]) => {
  	return [{
  		name: 'SP',
  		type: 'bar',
  		label: this.getBarLabelOption('SP', position, id),
  		xAxisIndex: id,
  		yAxisIndex: id,
  		silent: position !== 'top',
  		itemStyle: {
  			normal: {
  				color: spColor
  			}
  		},
  		data: [Number(data[0])],
  	},
  	{
  		name: 'SB',
  		type: 'bar',
  		label: this.getBarLabelOption('SB', position, id),
  		xAxisIndex: id,
  		yAxisIndex: id,
  		silent: position !== 'top',
  		itemStyle: {
  			normal: {
  				color: sbColor
  			}
  		},

  		data: [Number(data[1])],
  	},
  	{
  		name: 'SBV',
  		type: 'bar',
  		label: this.getBarLabelOption('SBV', position, id),
  		xAxisIndex: id,
  		yAxisIndex: id,
  		silent: position !== 'top',
  		itemStyle: {
  			normal: {
  				color: sbvColor
  			}
  		},
  		data: [Number(data[2])],

  	},
  	{
  		name: 'SD',
  		type: 'bar',
  		label: this.getBarLabelOption('SD', position, id),
  		xAxisIndex: id,
  		yAxisIndex: id,
  		silent: position !== 'top',
  		itemStyle: {
  			normal: {
  				color: sdColor
  			}
  		},
  		data: [Number(data[3])],

  	}, ];
  }

  initChartPie = () => {
  	const {data = {}} = this.state;
  	// console.log(data);
  	const {
  		spCost = 0, spOrderNum = 0, spImpressions = 0, spClicks = 0, spSalesAmount = 0,
  		sbSkuCost = 0, sbSkuOrderNum = 0, sbSkuImpressions = 0, sbSkuClicks = 0, sbSkuSalesAmount = 0,
  		sbvCost = 0, sbvOrderNum = 0, sbvImpressions = 0, sbvClicks = 0, sbvSalesAmount = 0,
  		sdCost = 0, sdOrderNum = 0, sdImpressions = 0, sdClicks = 0, sdSalesAmount = 0,

  	} = data;
  	const ctrData = [
  		`${Number(spClicks / (spImpressions || 1) * 100).toFixed(2)}`,
  		`${Number(sbSkuClicks / (sbSkuImpressions || 1) * 100).toFixed(2)}`,
  		`${Number(sbvClicks / (sbvImpressions || 1) * 100).toFixed(2)}`,
  		`${Number(sdClicks / (sdImpressions || 1) * 100).toFixed(2)}`
  	];

  	const cvrData = [
  		`${Number(spOrderNum / (spClicks || 1) * 100).toFixed(2)}`,
  		`${Number(sbSkuOrderNum / (sbSkuClicks || 1) * 100).toFixed(2)}`,
  		`${Number(sbvOrderNum / (sbvClicks || 1) * 100).toFixed(2)}`,
  		`${Number(sdOrderNum / (sdClicks || 1) * 100).toFixed(2)}`
  	];

  	const acosData = [
  		`${Number(spCost / (spSalesAmount || 1) * 100).toFixed(2)}`,
  		`${Number(sbSkuCost / (sbSkuSalesAmount || 1) * 100).toFixed(2)}`,
  		`${Number(sbvCost / (sbvSalesAmount || 1) * 100).toFixed(2)}`,
  		`${Number(sdCost / (sdSalesAmount || 1)).toFixed(2)}`
  	];

  	const cpoData = [
  		`${Number(spCost / (spOrderNum || 1)).toFixed(2)}`,
  		`${Number(sbSkuCost / (sbSkuOrderNum || 1)).toFixed(2)}`,
  		`${Number(sbvCost / (sbvOrderNum || 1)).toFixed(2)}`,
  		`${Number(sdCost / (sdOrderNum || 1)).toFixed(2)}`
  	];
  	const costData = [
  		{name: 'SP', value: (spCost || 0).toFixed(2)},
  		{name: 'SB', value: (sbSkuCost || 0).toFixed(2)},
  		{name: 'SBV', value: (sbvCost || 0).toFixed(2)},
  		{name: 'SD', value: (sdCost || 0).toFixed(2)}
  	];

  	const orderData = [
  		{name: 'SP', value: window.parseInt(spOrderNum)},
  		{name: 'SB', value: window.parseInt(sbSkuOrderNum)},
  		{name: 'SBV', value: window.parseInt(sbvOrderNum)},
  		{name: 'SD', value: window.parseInt(sdOrderNum)}
  	];
  	const impressionsData = [
  		{name: 'SP', value: window.parseInt(spImpressions)},
  		{name: 'SB', value: window.parseInt(sbSkuImpressions)},
  		{name: 'SBV', value: window.parseInt(sbvImpressions)},
  		{name: 'SD', value: window.parseInt(sdImpressions)}
  	];
  	const clicksData = [
  		{name: 'SP', value: window.parseInt(spClicks)},
  		{name: 'SB', value: window.parseInt(sbSkuClicks)},
  		{name: 'SBV', value: window.parseInt(sbvClicks)},
  		{name: 'SD', value: window.parseInt(sdClicks)}
  	];
  	const chartDom = document.getElementById('chart_pie');

  	const myChart = echarts.init(chartDom, 'dark');

  	var option = {
  		legend: {
  			data: [{
  				name: 'SP',
  				itemStyle: {
  					// color: 'red'
  				}

  			}, {
  				name: 'SB',

  			}, {
  				name: 'SBV',

  			}, {
  				name: 'SD',

  			}]
  		},
  		grid: [
  			{left: '10%', top: '50%', width: '15%'},
  			{left: '10%', top: '50%', width: '15%'},
  			{left: '30%', top: '50%', width: '15%'},
  			{left: '30%', top: '50%', width: '15%'},
  			{left: '50%', top: '50%', width: '15%'},
  			{left: '50%', top: '50%', width: '15%'},
  			{left: '70%', top: '50%', width: '15%'},
  			{left: '70%', top: '50%', width: '15%'}
  		],

  		xAxis: [
  			{type: 'category', gridIndex: 0},
  			{type: 'category', gridIndex: 1},
  			{type: 'category', gridIndex: 2},
  			{type: 'category', gridIndex: 3},
  			{type: 'category', gridIndex: 4},
  			{type: 'category', gridIndex: 5},
  			{type: 'category', gridIndex: 6},
  			{type: 'category', gridIndex: 7},
  		],
  		yAxis: [
  			{
  				type: 'value',
  				gridIndex: 0
  			}, {
  				type: 'value',
  				gridIndex: 1
  			}, {
  				type: 'value',
  				gridIndex: 2
  			}, {
  				type: 'value',
  				gridIndex: 3
  			}, {
  				type: 'value',
  				gridIndex: 4
  			}, {
  				type: 'value',
  				gridIndex: 5
  			}, {
  				type: 'value',
  				gridIndex: 6
  			}, {
  				type: 'value',
  				gridIndex: 7
  			}
  		],
  		title: [{
  			// text: 'Pie label alignTo',
  			// left: 'center',
  		}, {
  			subtext: '花费',
  			left: '17.5%',
  			top: '3%',
  			textAlign: 'center'
  		}, {
  			subtext: '订单数',
  			left: '37.5%',
  			top: '3%',
  			textAlign: 'center'
  		}, {
  			subtext: '曝光量',
  			left: '57.5%',
  			top: '3%',
  			textAlign: 'center'
  		}, {
  			subtext: '点击量',
  			left: '77.5%',
  			top: '3%',
  			textAlign: 'center'
  		}, {
  			subtext: 'CTR',
  			left: '8.5%',
  			top: '40%',
  			textAlign: 'center'
  		}, {
  			subtext: 'CR',
  			left: '28.5%',
  			top: '40%',
  			textAlign: 'center'
  		}, {
  			subtext: 'ACOS',
  			left: '48.5%',
  			top: '40%',
  			textAlign: 'center'
  		}, {
  			subtext: 'CPO',
  			left: '68.5%',
  			top: '40%',
  			textAlign: 'center'
  		}],
  		tooltip: {},

  		series: [
  			this.getReadOnlyPieOption(0, costData),
  			this.getPieOption(0, costData),
  			this.getReadOnlyPieOption(1, orderData),
  			this.getPieOption(1, orderData),
  			this.getReadOnlyPieOption(2, impressionsData),
  			this.getPieOption(2, impressionsData),
  			this.getReadOnlyPieOption(3, clicksData),
  			this.getPieOption(3, clicksData),

  			...this.getBarOption('bottom', 0, ctrData),
  			...this.getBarOption('top', 1, ctrData),

  			...this.getBarOption('bottom', 2, cvrData),
  			...this.getBarOption('top', 3, cvrData),

  			...this.getBarOption('bottom', 4, acosData),
  			...this.getBarOption('top', 5, acosData),

  			...this.getBarOption('bottom', 6, cpoData),
  			...this.getBarOption('top', 7, cpoData),

    	 ]
  	};
  	option && myChart.setOption(option);
  }

  Statistic = (props) => {
  	return <div className="ant-statistic">
  		<div className="ant-statistic-title">{props.title}</div>
  		<div className="ant-statistic-content">
  			<span className="ant-statistic-content-value">
  				<span className="ant-statistic-content-value-int">
  					{props.currencyCode}<CountUp start={0} duration={1} decimals={2} end={props.value} />
  				</span>
  			</span>
  		</div>
  	</div>;
  }

  render () {
  	const {data = {}, spinning, allData = [], current_local_sku_mid = '', drawerInfo = {}, drawSpinning, visible, pickerDate = []} = this.state;
  	const Statistic = this.Statistic;

  	const {
  		spCost, sbSkuCost, sbvCost,
  		spOrderNum, sbSkuOrderNum, sbvOrderNum,
  		spImpressions, sbSkuImpressions, sbvImpressions,
  		spClicks, sbSkuClicks, sbvClicks,
  		sbCurrencyCode
  	} = data;
  	return <div style={{height: '100%', overflowY: 'auto'}}>
  		<Spin spinning={spinning}>
  		<div >

  			{/* <h1 style={{fontSize: '28px', textAlign: 'center'}}>DVD-225_Black_UK_ELECTCOM_英国</h1> */}
  			<div style={{marginBottom: '16px'}}>

  					<Row gutter={24}>

  						<Col span={8}>
                  请选择产品：
  						<Select showSearch optionFilterProp="children"
  								value={String(current_local_sku_mid)} style={{ width: 300 }} onChange={(value) => {
  							this.setState({
  								current_local_sku_mid: value
  							}, () => {
  								this.getWeekData();
  							});
  						}}>
  								{allData.map((item) => {
  									return <Option key={`${item.local_sku}_${item.mid}`} value={`${item.local_sku}_${item.mid}`}>{item.local_sku}_{item.country}</Option>;
  								})}

  						</Select>
  						</Col>

  						<Col span={12}>
                  请选择时间：
  							<RangePicker
  								value={pickerDate}
  								onChange={(value) => {
  									this.setState({
  										pickerDate: value
  									}, () => {
  										this.getWeekData();
  									});
  								}}/>
  						</Col>
  					</Row>
  		</div>
  				{/* {
  			data.local_name &&
  		  <h1 style={{fontSize: '28px', textAlign: 'center'}}>{data.local_name}_{data.country}</h1>

  		} */}
  		<div id="chart_ad" style={{marginTop: '36px', width: '100%', height: 600}}/>

  		{/* <div id="chart_pie" style={{width: '100%', height: 600}}/> */}
  		{/* <div id="chart_bar" style={{width: '100%', height: 350}}/> */}
  			<Drawer
  				title={`${drawerInfo.start_date_str}~${drawerInfo.end_date_str}`}
  				placement={'right'}
  				closable={false}
  				width={'80vw'}
  				onClose={() => {
  					this.setState({
  					visible: false
  				});
  				}}
  				visible={visible}
  				key={'right'}
  			>
  				<div>
  						<Spin spinning={drawSpinning}>
  					<Row gutter={24}>
  						<Col span={6}>
  							<Statistic title="总花费" currencyCode={sbCurrencyCode} value={
  								Number(spCost) + Number(sbSkuCost) + Number(sbvCost)
  							} />
  						</Col>
  						<Col span={6}>
  							<Statistic title="总订单数" value={
  								Number((Number(spOrderNum) + Number(sbSkuOrderNum) + Number(sbvOrderNum)).toFixed(2))
  							} />
  						</Col>
  						<Col span={6}>
  							<Statistic title="总曝光量" value={
  								Number((Number(spImpressions) + Number(sbSkuImpressions) + Number(sbvImpressions)).toFixed(2))
  							} />
  						</Col>
  						<Col span={6}>
  							<Statistic title="总点击量" value={
  								Number((Number(spClicks) + Number(sbSkuClicks) + Number(sbvClicks)).toFixed(2))
  							} />
  						</Col>
  					</Row>

  					<div id="chart_pie" style={{width: '100%', height: 600}}/>
  						</Spin>
  				</div>
  			</Drawer>
  	</div>
  		</Spin>
  	</div>;
  }
}
export default Logon;
