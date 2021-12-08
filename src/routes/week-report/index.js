//框架依赖
import React, {Component, PureComponent} from 'react';
import { Select, Input, DatePicker, Row, Col, Button, Tag, Table, Upload, Spin, Modal, message } from 'antd';
import callApi from 'utils/callApi';
import dayjs from 'dayjs';
import moment from 'moment';
import XLSX from 'xlsx';
import './index.less';

const { TextArea } = Input;

const { Dragger } = Upload;
const {Option} = Select;
const { RangePicker } = DatePicker;
const dayStartMs = moment(new Date().getTime() - 13 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
const dayEndMs = moment(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');

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
  	pickerDate: [moment(dayStartMs, 'YYYY-MM-DD'), moment(dayEndMs, 'YYYY-MM-DD')]
  }

  componentDidMount () {
  	this.setState({
  		spinning: true
  	});
  	this.getSkuTable(() => {
  		this.getData();
  	});
  }

  doit = (type, fn, dl) => {
  	var elt = document.getElementById('data-table');
  	var wb = XLSX.utils.table_to_book(elt, {sheet: 'Sheet JS'});
  	return dl
  		? XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'})
  		: XLSX.writeFile(wb, fn || ('SheetJSTableExport.' + (type || 'xlsx')));
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
  	const {cid, mid, pickerDate = []} = this.state;
  	const startDateMs = dayjs(pickerDate[0]).valueOf();
  	const endDateMs = dayjs(pickerDate[1]).valueOf();
  	const day = (endDateMs - startDateMs) / 24 / 60 / 60 / 1000 + 1;
  	console.log(day);
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
  					{value && Number(value / day).toFixed(2)}
  				</div>;
  			}
  		},
  		{
  			title: '平均广告流量',
  			dataIndex: 'ad_clicks',
  			key: 'ad_clicks',
  			render: (value, record,) => {
  				return <div>
  					{value && Number(value / day).toFixed(2)}
  				</div>;
  			}
  		}, {
  			title: '广告费总和+teika',
  			dataIndex: 'cost',
  			key: 'cost',
  			render: (value, record,) => {
  				return <div>
  					{value && Number(value * record.ratio + record.teika_cost * record.ratio).toFixed(2)}
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

  			<Col span={12}>
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
        	<Button style={{marginLeft: '16px'}} type="primary" onClick={() => {
  						const type = 'xlsx';
  						var elt = document.getElementById('data-table');
  						var wb = XLSX.utils.table_to_book(elt, {sheet: 'Sheet JS'});
  						return XLSX.writeFile(wb, (`${dayjs(pickerDate[0]).format('YYYYMMDD')}-${dayjs(pickerDate[1]).format('YYYYMMDD')}.` + (type || 'xlsx')));
  						}}>导出</Button>
  		</Col>

  			</Row>
  		</div>

  		<Spin size="large" tip="正在获取数据，请稍等..." spinning={spinning}>
  		   <Table bordered={true} id="data-table" size="small" pagination={false} dataSource={pTableData} columns={this.getColumns()} />
  		</Spin>
  	</div>;
  }
}
export default Logon;
