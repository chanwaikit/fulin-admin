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

  }

  componentDidMount () {
  	this.getData();
  }

  getData = () => {
  	callApi({
  		type: 'POST',
  		api: '/statistic/getSkuNameTable',
  		data: {
  		},
  		success: (res = '') => {
  			console.log(res);
  			this.setState({
  				textAreaValue: res || []
  			});
  		},
  		error: () => {

  		}
  	});
  }
  // updateSkuNameTable
  updateSkuNameTable = () => {
  	const {textAreaValue} = this.state;
  	callApi({
  		type: 'POST',
  		api: '/statistic/updateSkuNameTable',
  		data: {
  			sku_name: textAreaValue
  		},
  		success: (res = '') => {
  			message.success('操作成功');
  			console.log(res);
  		},
  		error: () => {

  		}
  	});
  }
  render () {
  	const {textAreaValue} = this.state;

  	return <div className="sku-table">
  		<h1>周报产品表</h1>
  		<TextArea style={{height: '500px'}} value={textAreaValue} onChange={(e) => {
  			console.log(e.target.value.split(/[\s\n]/));
  			this.setState({
  				textAreaValue: e.target.value
  			});
  		}} rows={8} />
  		<Button onClick={() => {
  			this.updateSkuNameTable();
  		}} style={{marginTop: '16px'}} type="primary">保存</Button>
  	</div>;
  }
}
export default Logon;
