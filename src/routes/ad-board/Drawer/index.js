//框架依赖
import React, {Component, PureComponent} from 'react';
import { Select, Input, Drawer, DatePicker, Button, Tag, Row, Col, Modal, Table } from 'antd';
import callApi from 'utils/callApi';
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
  	const {cid, mid} = this.props;
  	this.setState({
  		spinning: true
  	});

  	callApi({
  		type: 'POST',
  		api: '/statistic/getSkuStatistic',
  		data: {
  			startDate: dayjs(pickerDate[0]).format('YYYY-MM-DD'),
  			endDate: dayjs(pickerDate[1]).format('YYYY-MM-DD'),
  			cid,
  			mid,
  		},
  		success: (res = {}) => {
  			const {x_axis = [], categories = []} = res;

  			let pRes = categories.sort((a, b) => b.sales_amount - a.sales_amount);
  			pRes = pRes.filter((item) => {
  				item.key = item.local_sku_mid;
  				return !(item.total_volume <= 0 && item.cost <= 0);
  			});
  			let selectedRowKeys = [];
  			categories.slice(0, 5).map((item) => {
  				selectedRowKeys.push(item.local_sku_mid);
  			});

  			this.setState({
  				tableData: pRes,
  				selectedRowKeys,
  				categories: categories.slice(0, 5),
  				x_axis,
  				chartVisible: false
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
  	this.setState({
  		chartVisible: true

  	}, () => {
  		var chartDom = document.getElementById('chart_drawer');
  		var myChart = echarts.init(chartDom, 'dark');

  		const costValues = [];
  		const saleValues = [];
  		const adSaleValues = [];
  		const adOrdersValues = [];
  		const ppoValues = [];

  		const acostValues = [];
  		const profitValues = [];
  		const profitRateValues = [];
  		const adCvrValues = [];
  		let legends = [];

  		categories.map((item) => {
  			let costValue = [];
  			let saleValue = [];
  			let acosValue = [];
  			let profitValue = [];
  			let profitRateValue = [];
  			let adSaleValue = [];
  			let adOrdersValue = [];
  			let adCvrValue = [];

  			let ppoValue = [];
  			legends.push(item.title);

  			item.weekAds.map((element) => {
  				adOrdersValue.push(window.parseInt(element.ad_orders));
  				costValue.push(Number(element.cost).toFixed(2));
  				saleValue.push(Number(element.sales_amount).toFixed(2));
  				adSaleValue.push(Number(element.ad_sales_amount).toFixed(2));
  				acosValue.push(element.ad_sales_amount ? ((element.cost / (element.ad_sales_amount || 1)) * 100).toFixed(2) : 0);
  				profitValue.push(Number(element.gross_profit).toFixed(2));
  				profitRateValue.push(((element.gross_profit / element.sales_amount) * 100).toFixed(2));
  				adCvrValue.push(element.ad_clicks ? ((element.ad_orders / (element.ad_clicks || 1)) * 100).toFixed(2) : 0);

  				ppoValue.push((element.cost / (element.ad_orders || 1)).toFixed(2));
  			});
  			adOrdersValues.push(adOrdersValue);
  			ppoValues.push(ppoValue);
  			adCvrValues.push(adCvrValue);
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

  		adCvrValues.map((item, index) => {
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

  		var option = {
  			colors: ['#45C2E0', '#C1EBDD'],
  			legend: {
  				data: legends

  			},
  			link: {xAxisIndex: 'all'},

  			grid: [
  				{left: '5%', top: '18%', width: '40%', height: '25%'},
  				{left: '55%', top: '18%', width: '40%', height: '25%'},
  				{left: '5%', top: '55%', width: '40%', height: '25%'},
  				{left: '55%', top: '55%', width: '40%', height: '25%'},

  			],
  			tooltip: {
  				trigger: 'axis',
  				axisPointer: {
  					type: 'shadow'
  				},
  				confine: true,
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
  					name: '广告转化率（%）',

  				}
  			],
  			series: seriesLine
  		};
  		const self = this;
  		const midEnum = {'美国': 1, '日本': 10, '英国': 4, '德国': 5, '法国': 6, '意大利': 7, '西班牙': 8};

  		// myChart.on('click', function (params) {
  		// 	console.log(params);
  		// 	self.setState({
  		// 		currentMid: midEnum[params.data.name || params.seriesName],
  		// 		visible: true,
  		// 		midName: params.data.name || params.seriesName
  		// 	});
  		// });

  		option && myChart.setOption(option);
  		window.addEventListener('resize', function () {
  			myChart.resize(option);
  		});
  	});
  }

  getColumns = () => {
  	const {pickerDate = [], mid} = this.props;
  	const startDate = dayjs(pickerDate[0]).format('YYYY-MM-DD');
  	const endDate = dayjs(pickerDate[1]).format('YYYY-MM-DD');
  	return [
  		{
  			title: '品名',
  			dataIndex: 'local_name',
  			key: 'local_name',
  			render: (value, record,) => {
  				return <div>
  					<a onClick={() => {
  						window.open(`http://localhost:3000/#/ad-analyze?name=${record.local_sku}&startDate=${startDate}&endDate=${endDate}&mid=${mid}`);
  					}}>{record.local_name}</a>
  				</div>;
  			}
  		},
  		{
  			title: '销量',
  			dataIndex: 'total_volume',
  			key: 'total_volume',
  			render: (value, record,) => {
  				return <span>{window.parseInt(value)}</span>;
  			}
  		}, {
  			title: '销售额',
  			dataIndex: 'sales_amount',
  			key: 'sales_amount',
  			render: (value, record,) => {
  				return <span>{value && Number(value).toFixed(2)}</span>;
  			}
  		}, {
  			title: '广告花费',
  			dataIndex: 'cost',
  			key: 'cost',
  			render: (value, record,) => {
  				return <span>{value && Number(value).toFixed(2)}</span>;
  			}
  		},
  		{
  			title: '广告订单量',
  			dataIndex: 'ad_orders',
  			key: 'ad_orders',
  			render: (value, record,) => {
  				return <span>{window.parseInt(value)}</span>;
  			}
  		}, {
  			title: '每单花费',
  			dataIndex: 'sessions',
  			key: 'sessions',
  			render: (value, record,) => {
  				return <div>
  					{record.ad_orders > 0 ? (record.cost / record.ad_orders).toFixed(2) : record.cost.toFixed(2)}
  				</div>;
  			}
  		}
  	];
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
  	this.setState({
  		selectedRowKeys: selectedRowKeys,
  		categories: selectedRows,
  		chartVisible: false

  	}, () => {
  		this.initChartPie();
  	});
  };

  handleClose = (key) => {
  	const {selectedRowKeys, categories} = this.state;
  	const pSelectedRowKeys = [...selectedRowKeys];
  	const pSelectedRows = [...categories];
  	pSelectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
  	pSelectedRows.splice(selectedRowKeys.indexOf(key), 1);
  	this.setState({
  		selectedRowKeys: pSelectedRowKeys,
  		categories: pSelectedRows,
  		chartVisible: false
  	}, () => {
  		this.initChartPie();
  	});
  }

  render () {
  	const {tableData = [], chartVisible, categories, selectedRowKeys = []} = this.state;
  	const rowSelection = {
  		selectedRowKeys,
  		onChange: this.onSelectChange

  	};
  	return <div >
  		{categories.length > 0 && 	<div className="selected-bar">
        已选中: {categories.map((item) => {
  				return <Tag closable key={item.local_sku + '_' + item.mid} onClose={() => this.handleClose(item.local_sku)}
  				>
  					{item.local_sku}
  				</Tag>;
  			})}
  		</div>}
  		<Table scroll={{ y: 240 }} rowSelection={rowSelection} size="small" pagination={false} dataSource={tableData} columns={this.getColumns()} />
  		{!!chartVisible && <div id="chart_drawer" style={{width: '100%', height: '500px'}}/>}

  	</div>;
  }
}
export default Logon;
