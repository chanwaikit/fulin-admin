//框架依赖
import React, {Component, PureComponent} from 'react';
import { Select, Input, DatePicker, Row, Col, Button, Tag, Table, Upload, Spin, Modal, message } from 'antd';
import callApi from 'utils/callApi';
import dayjs from 'dayjs';
import moment from 'moment';
import * as echarts from 'echarts';

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
  	pickerDate: [moment('2021-07-01', 'YYYY-MM-DD'), moment('2021/07/07', 'YYYY-MM-DD')]
  }

  componentDidMount () {
  	this.setState({
  		spinning: true
  	});
  	this.getSkuTable(() => {
  		this.getData();
  	});
  }

  getSkuTable =(cb) => {
  	callApi({
  		type: 'POST',
  		api: '/statistic/getSkuNameTable',
  		data: {
  		},
  		success: (res = '') => {
  			this.setState({
  				skuTable: res.split(/[\s\n]/) || []
  			}, () => {
  				cb && cb();
  			});
  		},
  		error: () => {

  		}
  	});
  }
  getData = () => {
  	const {cid, mid, pickerDate = []} = this.state;

  	callApi({
  		type: 'POST',
  		api: '/statistic/getWeekData',
  		data: {
  			startDate: dayjs(pickerDate[0]).format('YYYY-MM-DD'),
  			endDate: dayjs(pickerDate[1]).format('YYYY-MM-DD'),
  		},
  		success: (res = []) => {
  			this.setState({
  				spinning: false,
  				tableData: res || []
  			});
  		},
  		error: () => {

  		}
  	});
  }

  getColumns = () => {
  	return [
  		{
  			title: '品名_国家',
  			dataIndex: 'local_name',
  			key: 'local_name',
  			render: (value, record,) => {
  				return <div>
  					<div>{record.local_name_country}</div>
  					{/* <div>{record.local_sku}</div> */}
  				</div>;
  			}
  		}, {
  			title: '求和项:销售额',
  			dataIndex: 'sales_amount',
  			key: 'sales_amount',
  			render: (value, record,) => {
  				return <span>{value && Number(value * record.ratio).toFixed(2)}</span>;
  			}
  		},
  		{
  			title: '求和项:销量',
  			dataIndex: 'total_volume',
  			key: 'total_volume',
  		}, {
  			title: '求和项:毛利润',
  			dataIndex: 'gross_profit',
  			key: 'gross_profit',
  			render: (value, record,) => {
  				return <span>{value && Number(value * record.ratio).toFixed(2)}</span>;
  			}
  		}, {
  			title: '销量总和',
  			dataIndex: 'product_volume',
  			key: 'product_volume',
  			render: (value, record,) => {
  				return <span>{value && Number(value).toFixed(2)}</span>;
  			}
  		},
  		{
  			title: '广告单总和',
  			dataIndex: 'ad_orders',
  			key: 'ad_orders',
  			render: (value, record,) => {
  				return <div>
  					{value && Number(value).toFixed(2)}
  				</div>;
  			}
  		},
  		{
  			title: '平均自然流量',
  			dataIndex: 'sessions',
  			key: 'sessions',
  			render: (value, record,) => {
  				return <div>
  					{value && Number(value / 7).toFixed(2)}
  				</div>;
  			}
  		},
  		{
  			title: '平均广告流量',
  			dataIndex: 'ad_clicks',
  			key: 'ad_clicks',
  			render: (value, record,) => {
  				return <div>
  					{value && Number(value / 7).toFixed(2)}
  				</div>;
  			}
  		}, {
  			title: '广告费总和',
  			dataIndex: 'cost',
  			key: 'cost',
  			render: (value, record,) => {
  				return <div>
  					{value && Number(value * record.ratio).toFixed(2)}
  				</div>;
  			}
  		}, {
  			title: '退款数目',
  			dataIndex: 'refundNum',
  			key: 'refundNum',
  			render: (value, record,) => {
  				return <div>
  					{value && Number(value).toFixed(2)}
  				</div>;
  			}
  		}, {
  			title: 'SB+SBV花费',
  			dataIndex: 'refundNum',
  			key: 'refundNum',
  			render: (value, record,) => {
  				return <div>
  					{value && ((Number(record.sbvCost || 0) + Number(record.sbSkuCost || 0)) * record.ratio).toFixed(2)}
  				</div>;
  			}
  		}
  	];
  }

  render () {
  	const {spinning, tableData = [], skuTable = [], pickerDate = []} = this.state;

  	const pTableData = [];
  	skuTable.map((value) => {
  		const row = tableData.filter((item) => {
  			return item.local_name_country == value;
  		})[0] || {local_name_country: value};
  		pTableData.push(row);
  	});
  	return <div className="week-report">
  		<div style={{marginBottom: '16px'}}>
  			<Row >

  			<Col span={6}>
        请选择时间：
  			<RangePicker
  				value={pickerDate}
  				onChange={(value) => {
  				this.setState({
  					pickerDate: value,
  								spinning: true
  				}, () => {
  						this.getData();
  					});
  			}}/>
  		</Col>

  			</Row>
  		</div>

  		<Spin size="large" tip="正在获取数据，请稍等..." spinning={spinning}>
  			{!spinning && <Table sticky size="small" pagination={false} dataSource={pTableData} columns={this.getColumns()} />}
  		</Spin>
  	</div>;
  }
}
export default Logon;
