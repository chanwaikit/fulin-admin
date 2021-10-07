//框架依赖
import React, {Component, PureComponent} from 'react';
import { Table, Spin } from 'antd';
import callApi from 'utils/callApi';
import moment from 'moment';
import './index.less';

const dayStartMs = moment(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
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
  	this.getData();
  }

  getData = () => {
  	callApi({
  		type: 'POST',
  		api: '/statistic/getDailyRecord',
  		data: {
  		},
  		success: (res = []) => {
  			this.setState({
  				spinning: false,
  				tableData: res || []
  			});
  		}
  	});
  }

  getColumns = () => {
  	return [
  		{
  			title: '捕捉的日期',
  			dataIndex: 'date_str',
  			key: 'date_str'
  		}, {
  			title: '更新时间',
  			dataIndex: 'update_date_str',
  			key: 'update_date_str'
  		}
  	];
  }

  render () {
  	const {spinning, tableData = []} = this.state;

  	return <div className="week-report">

  		<Spin size="large" tip="正在获取数据，请稍等..." spinning={spinning}>
  		   <Table bordered={true} sticky id="data-table" size="small" pagination={false} dataSource={tableData} columns={this.getColumns()} />
  		</Spin>
  	</div>;
  }
}
export default Logon;
