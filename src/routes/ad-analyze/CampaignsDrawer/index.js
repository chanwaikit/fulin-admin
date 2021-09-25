//框架依赖
import React, {Component, PureComponent} from 'react';
import { Select, DatePicker, Button, Row, Col } from 'antd';
import callApi from 'utils/callApi';
import * as echarts from 'echarts';
import moment from 'moment';

import dayjs from 'dayjs';
// import './index.less';
const {Option} = Select;
const { RangePicker } = DatePicker;

class Logon extends (PureComponent || Component) {
  state = {
  	// pickerDate: [moment('2021-07-01', 'YYYY-MM-DD'), moment('2021/07/28', 'YYYY-MM-DD')],
  	categories: [],
  	x_axis: [],
  	cost_sum: 0,
  	sales_amount_sum: 0,
  	mid: ''
  }

  componentDidMount () {
  	this.getSkuAdTable();
  }
  getCampaignsWeekData = () => {
  	const {selectCampaigns, currentAdGroup} = this.state;
  	const {startDate, endDate} = this.props;
  	this.setState({
  		btnLoading: true
  	});
  	callApi({
  		type: 'POST',
  		api: '/statistic/getCampaignsWeekData',
  		data: {
  			sid: currentAdGroup.sid,
  			campaignIds: selectCampaigns,
  			startDate,
  			endDate
  		},
  		success: (res = {}) => {
  			const {weekData = [], x_axis} = res;
  			this.setState({
  				x_axis,
  				chartData: weekData,
  		    chartVisible: false,
  				btnLoading: false
  			}, () => {
  				this.initChartPie();
  			});
  		},
  		error: () => {

  		}
  	});
  }
  getCampaigns = (portfolio_id, sid) => {
  	const {startDate, endDate} = this.props;
  	callApi({
  		type: 'POST',
  		api: '/statistic/getCampaigns',
  		data: {
  			portfolio_id,
  			sid,
  			startDate,
  			endDate
  		},
  		success: (res = []) => {
  			this.setState({
  				campaignList: res
  			});
  		}
  	});
  }
  getSkuAdTable = () => {
  	const {mid, localSku} = this.props;
  	callApi({
  		type: 'POST',
  		api: '/statistic/getSkuAdTable',
  		data: {
  			local_sku: localSku,
  			mid
  		},
  		success: (res = []) => {
  			const skuGroupsObj = res[0] || {};
  			const {sb_groups, sp_groups} = skuGroupsObj;
  			const ad_groups = [];
  			[...sb_groups, ...sp_groups].map((item) => {
  				const hasData = ad_groups.filter((element) => element.portfolio_id == item.portfolio_id).length > 0;
  				if (!hasData) {
  					ad_groups.push(item);
  				}
  			});
  			console.log(92, ad_groups);
  			this.setState({
  				adGroups: ad_groups || [],
  				currentAdGroup: ad_groups[0] || {}
  			}, () => {
  				const currentAdGroup = ad_groups[0] || {};
  				const {portfolio_id, sid} = currentAdGroup;
  	      this.getCampaigns(portfolio_id, sid);
  			});
  		},
  		error: () => {

  		}
  	});
  }

  initChartPie = () => {
  	const {currentAdGroup = {}, chartData = [], x_axis = [], selectCampaigns = [], campaignList = []} = this.state;
  	this.setState({
  		chartVisible: true

  	}, () => {
  		var chartDom = document.getElementById('chart_campaigns');
  		var myChart = echarts.init(chartDom, 'dark');
  		let legendData = [];
  		selectCampaigns.map((value) => {
  			const lagendValue = campaignList.filter((item) => item.campaign_id == value)[0].campaign_name;
  			legendData.push(lagendValue);
  		});

  		const cvrValues = [];
  		const ctrValues = [];
  		const acosValues = [];
  		const ordersValues = [];
  		const ppoValues = [];
  		const cpcValues = [];

  		selectCampaigns.map((campaignId) => {
  			let ppoData = [];
  			let ordersData = [];
  			let acosData = [];
  			let cvrData = [];
  			let ctrData = [];
  			let cpcData = [];

  			chartData.map((weekData) => {
  				const data = weekData.filter((item) => item.campaign_id == campaignId)[0] || {};
  				ppoData.push(data.order_num > 0 ? (data.cost / data.order_num).toFixed(2) : 0);
  				ordersData.push(data.order_num);
  				acosData.push(data.acos);
  				ctrData.push(data.ctr);
  				cvrData.push(data.cvr);
  				cpcData.push(data.cpc);
  			});
  			ppoValues.push(ppoData);
  			ordersValues.push(ordersData);
  			acosValues.push(acosData);
  			ctrValues.push(ctrData);
  			cvrValues.push(cvrData);
  			cpcValues.push(cpcData);
  		});
  		const colorArray = ['#45C2E0', '#C1EBDD', '#FFC851', '#5A5476', '#87CEFF', '#CDB5CD', '#00ff7f', '#120afb', '#8c08f1'];

  		const seriesLine = [];

  		ppoValues.map((item, index) => {
  			seriesLine.push({
  				name: legendData[index],
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

  		ordersValues.map((item, index) => {
  			seriesLine.push({
  				name: legendData[index],
  				type: 'bar',
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

  		ctrValues.map((item, index) => {
  			seriesLine.push({
  				name: legendData[index],
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

  		acosValues.map((item, index) => {
  			seriesLine.push({
  				name: legendData[index],
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

  		cvrValues.map((item, index) => {
  			seriesLine.push({
  				name: legendData[index],
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

  		cpcValues.map((item, index) => {
  			seriesLine.push({
  				name: legendData[index],
  				type: 'line',
  				xAxisIndex: 5,
  				yAxisIndex: 5,

  				itemStyle: {
  					normal: {
  						color: colorArray[index]
  					}
  				},
  				data: item
  			});
  		});

  		const option = {
  			tooltip: {
  				trigger: 'axis',
  				axisPointer: {
  					type: 'shadow'
  				},
  				confine: true,
  			},
  			legend: {
  				// data: ['Forest', 'Steppe', 'Desert', 'Wetland']
  				data: legendData
  			},
  			grid: [
  				{left: '5%', top: '18%', width: '40%', height: '15%'},
  				{left: '55%', top: '18%', width: '40%', height: '15%'},
  				{left: '5%', top: '45%', width: '40%', height: '15%'},
  				{left: '55%', top: '45%', width: '40%', height: '15%'},
  				{left: '5%', top: '72%', width: '40%', height: '15%'},
  				{left: '55%', top: '72%', width: '40%', height: '15%'},

  			],
  			xAxis: [
  				{
  					type: 'category',
  					gridIndex: 0,

  					data: x_axis
  				},
  				{
  					type: 'category',
  					gridIndex: 1,

  					data: x_axis
  				},
  				{
  					type: 'category',
  					gridIndex: 2,

  					data: x_axis
  				},
  				{
  					type: 'category',
  					gridIndex: 3,

  					data: x_axis
  				},
  				{
  					type: 'category',
  					gridIndex: 4,
  					data: x_axis
  				},
  				{
  					type: 'category',
  					gridIndex: 5,
  					data: x_axis
  				}
  			],
  			yAxis: [
  				{
  					type: 'value',
  					gridIndex: 0,
  					name: '每单花费',

  				},
  				{
  					type: 'value',
  					gridIndex: 1,
  					name: '订单量',

  				},
  				{
  					type: 'value',
  					gridIndex: 2,
  					name: '广告活动点击率',

  				},
  				{
  					type: 'value',
  					gridIndex: 3,
  					name: 'ACOS',

  				},
  				{
  					type: 'value',
  					gridIndex: 4,
  					name: '广告活动转化率',

  				}, {
  					type: 'value',
  					gridIndex: 5,
  					name: 'cpc',

  				}
  			],
  			series: seriesLine
  		};
  		option && myChart.setOption(option);
  		window.addEventListener('resize', function () {
  			myChart.resize(option);
  		});
  	});
  }

  render () {
  	const {campaignList = [], btnLoading, selectCampaigns = [], chartVisible, adGroups = [], currentAdGroup = {}} = this.state;

  	return <div>
  		<Row gutter={24}>
  			<Col span={8}>
            请选择广告组合：
  				<Select showSearch optionFilterProp="children"
  					value={currentAdGroup.portfolio_id}
  					style={{ width: 300 }} onChange={(value, index) => {
  						const currentAdGroup = adGroups.filter((item) => item.portfolio_id == value)[0] || {};
  						this.setState({
  							currentAdGroup,
  							selectCampaigns: []
  						}, () => {
  							// this.getWeekData();
  							this.getCampaigns(currentAdGroup.portfolio_id, currentAdGroup.sid);
  						});
  					}}>
  					{adGroups.map((item) => {
  						return <Option key={`${item.shopName}/${item.name}`} value={`${item.portfolio_id}`}>{item.shopName}/{item.name}</Option>;
  					})}

  				</Select>
  			</Col>
  			<Col span={16}>
          请选择活动：
  				<Select showSearch optionFilterProp="children"
  					placeholder="请选择活动"
  					mode = 'multiple'
  					style={{ width: 600 }}
  					value={selectCampaigns}
  					onChange={(value, index) => {
  						this.setState({
  							selectCampaigns: value || []
  						}, () => {
  							// this.getWeekData();
  						});
  					}}>
  					{campaignList.map((item) => {
  						return <Option key={`${item.campaign_id}`} value={`${item.campaign_id}`}>{item.campaign_name}</Option>;
  					})}

  				</Select>
  			</Col>
  		</Row>

  		<Button type="primary" loading={btnLoading} onClick={() => {
  			this.getCampaignsWeekData();
  		}}>查询</Button>
  		{!!chartVisible && <div id="chart_campaigns" style={{marginTop: '16px', width: '100%', height: '80vh'}}/>}
  	</div>;
  }
}
export default Logon;
