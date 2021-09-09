//框架依赖
import React, {Component, PureComponent} from 'react';
import { Select, Input, DatePicker, Row, Col, Button, Tag, Table, Upload, Spin, Modal, message } from 'antd';
import { Base64 } from 'js-base64';
import sha256 from 'sha256';
import callApi1 from 'utils/callApi1';
import callApi from 'utils/callApi';
import dayjs from 'dayjs';
import moment from 'moment';
import XLSX from 'xlsx';
import * as echarts from 'echarts';

import { InboxOutlined,
	DownloadOutlined

} from '@ant-design/icons';

import './index.less';

const { TextArea } = Input;

const { Dragger } = Upload;
const {Option} = Select;
const { RangePicker } = DatePicker;
class Logon extends (PureComponent || Component) {
  state = {
  	modalSpinning: false,
  	spinning: false,
  	visible: false,
  	selectedRowKeys: [],
  	selectedRows: [],
  	cid: '',
  	mid: '',
  	tableData: [],
  	modalSelect: 'total_volume',
  	pickerDate: [moment('2021-07-01', 'YYYY-MM-DD'), moment('2021/07/28', 'YYYY-MM-DD')]
  }

  componentDidMount () {
  	this.getData();
  	this.test();
  }

  test = () => {
  	const {cid, mid, pickerDate = []} = this.state;

  	callApi({
  		type: 'POST',
  		api: '/create-entry',
  		data: {
  			startDate: dayjs(pickerDate[0]).format('YYYY-MM-DD'),
  			endDate: dayjs(pickerDate[1]).format('YYYY-MM-DD'),
  			cid,
  			mid
  		},
  		success: (res = {}) => {

  		},
  		error: () => {

  		}
  	});
  }
  getModalData = () => {
  	const {cid, mid, pickerDate = []} = this.state;

  	this.setState({
  		modalSpinning: true
  	});
  	callApi({
  		type: 'POST',
  		api: '/statistic/getSkuWeekStatistic',
  		data: {
  			startDate: dayjs(pickerDate[0]).format('YYYY-MM-DD'),
  			endDate: dayjs(pickerDate[1]).format('YYYY-MM-DD'),
  		},
  		success: (res = {}) => {
  			const {daysArray = [], skuWeekData = []} = res;
  			const legendData = daysArray.map((item) => {
  				return item.start_date_str;
  			});

  			const pSkuWeekData = [...skuWeekData];

  			pSkuWeekData.map((arr) => {
  				const newData = arr.map((item, index) => {
  					const orders = Number(item.spOrderNum || 0) + Number(item.sbSkuOrderNum || 0) + Number(item.sbvOrderNum || 0) + Number(item.sdOrderNum || 0);
  					const adCost = (Number(item.spCost || 0) + Number(item.sbSkuCost || 0) + Number(item.sbvCost || 0) + Number(item.sdCost || 0)).toFixed(2);
  					item.key = item.local_sku + '_' + item.mid;
  					item.allOrders = Number(orders);
  					item.adCost = Number(adCost);
  					item.adCpo = orders ? (adCost / orders).toFixed(2) : 0;
  					return item;
  				});
  				return newData;
  			});
  			this.setState({
  				modalSpinning: false,
  				daysArray,
  				legendData,
  				skuWeekData: pSkuWeekData
  			}, () => {
  			this.initChartPie();
  			});
  		},
  		error: () => {

  		}
  	});
  }
  initChartPie = () => {
  	const {categories = [], modalSelect, selectedRowKeys = [], tableData = [], legendData = [], skuWeekData = [], x_axis = []} = this.state;

  	var chartDom = document.getElementById('chart_pie');
  	var myChart = echarts.init(chartDom, 'dark');

  	let totalVolumeArray = [];
  	let nameArray = [];
  	let legendTitle = [];
  	legendData.map((dayStr, index) => {
  		// skuWeekData[index];
  		const childArray = [];
  		const nameChiladArray = [];
  		selectedRowKeys.map((keyValue) => {
  			const obj = skuWeekData[index].filter((element) => {
  				return element.local_sku_mid === keyValue;
  			})[0] || {};
  			childArray.push(Number(obj[modalSelect] || 0));

  			const tableObj = tableData.filter((element) => {
  				return element.local_sku_mid === keyValue;
  		  })[0] || {};

  		  nameChiladArray.push(tableObj.local_sku + '_' + tableObj.country);
  		});
  		totalVolumeArray.push(childArray);
  		nameArray.push(nameChiladArray);
  	});

  	const labelOption = {
  		show: true,
  		// rotate: 90,

  		distance: 15,
  		align: 'left',
  		verticalAlign: 'middle',
  		position: 'insideBottom',
  		formatter: '{c}',
  		fontSize: 16,

  	};
  	const series = [];
  	totalVolumeArray.map((data, index) => {
  		series.push({
  			name: legendData[index],
  			type: 'bar',
  			barGap: 0,
  			// label: labelOption,
  			emphasis: {
  				focus: 'series'
  			},
  			data: data
  		});
  	});
  	const option = {
  		tooltip: {
  			trigger: 'axis',
  			axisPointer: {
  				type: 'shadow'
  			}
  		},
  		legend: {
  			// data: ['Forest', 'Steppe', 'Desert', 'Wetland']
  			data: legendData
  		},
  		dataZoom: [
  			{
  				show: true,
  				realtime: true,
  				start: 0,
  				end: 100,
  				xAxisIndex: [0, 1]
  			}
  		],
  		toolbox: {
  			show: true,
  			orient: 'vertical',
  			left: 'right',
  			top: 'center',
  			feature: {
  				mark: {show: true},
  				dataView: {show: true, readOnly: false},
  				magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
  				restore: {show: true},
  				saveAsImage: {show: true}
  			}
  		},
  		xAxis: [
  			{
  				type: 'category',
  				axisTick: {show: false},
  				data: nameArray[0],

  			}
  		],
  		yAxis: [
  			{
  				type: 'value'
  			}
  		],
  		series: series
  	};

  	option && myChart.setOption(option);
  }
  getData = () => {
  	const {cid, mid, pickerDate = []} = this.state;

  	this.setState({
  		spinning: true
  	});
  	callApi({
  		type: 'POST',
  		api: '/statistic/getProfit',
  		data: {
  			startDate: dayjs(pickerDate[0]).format('YYYY-MM-DD'),
  			endDate: dayjs(pickerDate[1]).format('YYYY-MM-DD'),
  			cid,
  			mid
  		},
  		success: (res = {}) => {
  			res.map((item, index) => {
  				const orders = Number(item.spOrderNum || 0) + Number(item.sbSkuOrderNum || 0) + Number(item.sbvOrderNum || 0) + Number(item.sdOrderNum || 0);
  				const adCost = (Number(item.spCost || 0) + Number(item.sbSkuCost || 0) + Number(item.sbvCost || 0) + Number(item.sdCost || 0)).toFixed(2);
  				item.key = item.local_sku + '_' + item.mid;
  				item.allOrders = orders;
  				item.adCost = adCost;
  				item.adCpo = orders ? (adCost / orders).toFixed(2) : 0;
  				return item;
  			});
  			this.setState({
  				spinning: false,
  				tableData: res || []
  			}, () => {
  	      // this.getModalData();
  				console.log(res);
  			});
  		},
  		error: () => {

  		}
  	});
  }

  getColumns = () => {
  	return [
  		{
  			title: '图片',
  			dataIndex: 'small_image_url',
  			key: 'small_image_url',
  			render: (value, record,) => {
  				return <img style={{width: 36, height: 36}} src={value}/>;
  			}
  		},
  		{
  			title: '品名',
  			dataIndex: 'local_name',
  			key: 'local_name',
  			render: (value, record,) => {
  				return <div>
  					<div>{record.local_name}</div>
  					{/* <div>{record.local_sku}</div> */}
  				</div>;
  			}
  		},	{
  			title: '国家',
  			dataIndex: 'country',
  			key: 'country',
  		},
  		{
  			title: '销量',
  			dataIndex: 'total_volume',
  			key: 'total_volume',
  		}, {
  			title: '销售额',
  			dataIndex: 'total_amount',
  			key: 'total_amount',
  			render: (value, record,) => {
  				return <span>{value && Number(value).toFixed(2)}</span>;
  			}
  		}, {
  			title: '广告花费',
  			dataIndex: 'address',
  			key: 'address',
  			render: (value, record,) => {
  				return <div>
  					{(Number(record.spCost || 0) + Number(record.sbSkuCost || 0) + Number(record.sbvCost || 0) + Number(record.sdCost || 0)).toFixed(2)}
  				</div>;
  			}
  		},
  		{
  			title: '广告订单量',
  			dataIndex: 'address',
  			key: 'address',
  			render: (value, record,) => {
  				return <div>
  					{Number(record.spOrderNum || 0) + Number(record.sbSkuOrderNum || 0) + Number(record.sbvOrderNum || 0) + Number(record.sdOrderNum || 0)}
  				</div>;
  			}
  		}, {
  			title: '每单花费',
  			dataIndex: 'sessions',
  			key: 'sessions',
  			render: (value, record,) => {
  				const orders = Number(record.spOrderNum || 0) + Number(record.sbSkuOrderNum || 0) + Number(record.sbvOrderNum || 0) + Number(record.sdOrderNum || 0);
  				const adCost = (Number(record.spCost || 0) + Number(record.sbSkuCost || 0) + Number(record.sbvCost || 0) + Number(record.sdCost || 0)).toFixed(2);
  				return <div>
  					{orders ? (adCost / orders).toFixed(2) : 0}
  				</div>;
  			}
  		}
  	];
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
  	this.setState({
  		selectedRowKeys,
  		selectedRows
  	});
  };

  handleClose = (key) => {
  	const {selectedRowKeys, selectedRows} = this.state;
  	const pSelectedRowKeys = [...selectedRowKeys];
  	const pSelectedRows = [...selectedRows];
  	pSelectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
  	pSelectedRows.splice(selectedRowKeys.indexOf(key), 1);
  	this.setState({
  		selectedRowKeys: pSelectedRowKeys,
  		selectedRows: pSelectedRows
  	});
  }

  showModal = () => {
  	// this.getModalData();
  	this.setState({
  		visible: true
  	}, () => {
  		this.getModalData();
  	});
  }
  render () {
  	const {spinning, modalSelect, modalSpinning, visible, mid, selectedRows = [], selectedRowKeys = [], cid, tableData = [], pickerDate = []} = this.state;

  	const rowSelection = {
  		selectedRowKeys,
  		onChange: this.onSelectChange

  	};

  	return <div className="week-report">
  		<div style={{marginBottom: '16px'}}>
  			<Row >
  				<Col span={6}>
          请选择分类：
  			<Select value={String(cid)} style={{ width: 120 }} onChange={(value) => {
  				this.setState({
  					cid: value
  				}, () => {
  					this.getData();
  				});
  			}}>
  					<Option value="">全部</Option>
  				<Option value="1001">美妆</Option>
  				<Option value="1002">电子器件</Option>
  			</Select>
  				</Col>

  				<Col span={6}>
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
  			</Col>

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

  			</Row>
  		</div>
  		{selectedRows.length > 0 && 	<div className="selected-bar">
        已选中: {selectedRows.map((item) => {
  				return <Tag closable key={item.local_sku + '_' + item.mid} onClose={() => this.handleClose(item.local_sku + '_' + item.mid)}
  				>
  					{item.local_sku + '_' + item.country}
  				</Tag>;
  			})}
  			<Button type="primary" onClick={() => {
  				this.showModal();
  			}}>查看详情</Button>
  		</div>}

  		<Spin size="large" tip="正在获取数据，请稍等..." spinning={spinning}>
  			<Table sticky rowSelection={rowSelection} size="small" pagination={false} dataSource={tableData} columns={this.getColumns()} />
  		</Spin>
  		<Modal
  			title="详情对照"
  			centered
  			visible={visible}
  			onOk={() => this.setState({visible: false})}
  			onCancel={() => this.setState({visible: false})}
  			width={'100vw'}
  			// height={'90vh'}
  			bodyStyle={
  				{height: '80vh'}
  			}
  		>
  			<Spin spinning={modalSpinning} style={{width: '100%', height: '70vh'}}>
  				<div style={{marginBottom: '16px'}}>
  					<Row >
  						<Col span={6}>
              请选择类别：
  							<Select value={String(modalSelect)} style={{ width: 120 }} onChange={(value) => {
  								this.setState({
  									modalSelect: value
  								}, () => {
  									this.initChartPie();
  								});
  							}}>

  								<Option value="total_volume">销量</Option>
  								<Option value="total_amount">销售额</Option>
  								<Option value="adCost">广告花费</Option>
  								<Option value="allOrders">广告订单量</Option>
  								<Option value="adCpo">每单花费</Option>

  							</Select>
  				</Col>
  					</Row>
  				</div>
  				<div id="chart_pie" style={{width: '100%', height: '70vh'}}/>

  			</Spin>
  		</Modal>
  	</div>;
  }
}
export default Logon;
