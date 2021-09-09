//框架依赖
import React, {Component, PureComponent} from 'react';
import { Select, Input, Tabs, DatePicker, Button, Empty, Checkbox, Modal, Row, Col, Collapse, Descriptions, Menu, Dropdown, Card, Table } from 'antd';
import callApi from 'utils/callApi';
import moment from 'moment';
import { DownOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { StickyContainer, Sticky } from 'react-sticky';

import dayjs from 'dayjs';

import './index.less';
const {Option} = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TabPane } = Tabs;

class Logon extends (PureComponent || Component) {
  state = {
  	pickerDate: [moment('2021-07-01', 'YYYY-MM-DD'), moment('2021/07/28', 'YYYY-MM-DD')]

  }

  namespaceId='11'

  componentDidMount () {
  	this.getData();
  }
  getData = () => {
  	const {pickerDate = []} = this.state;

  	this.setState({
  		spinning: true
  	});
  	callApi({
  		type: 'POST',
  		api: '/statistic/getSkuAdTable',
  		data: {
  			// startDate: dayjs(pickerDate[0]).format('YYYY-MM-DD'),
  			// endDate: dayjs(pickerDate[1]).format('YYYY-MM-DD')
  		},
  		success: (res = {}) => {
  			this.setState({
  				skuList: res

  			});
  		},
  		error: () => {

  		}
  	});
  }
  processData = (ad_groups = []) => {
  	const arrayObj = {}; //{LXF:{},ZX:{}}
  	const result = [];
  	ad_groups.map((element) => {
  		const shopName = element.shopName;
  		if (!arrayObj[shopName]) {
  			arrayObj[shopName] = {};
  		}
  	});
  	for (let i in arrayObj) {
  		arrayObj[i].sb = ad_groups.filter((element) => {
  			return element.shopName === i && element.type === 'sb';
  		});
  		arrayObj[i].sbv = ad_groups.filter((element) => {
  			return element.shopName === i && element.type === 'sbv';
  		});
  		arrayObj[i].sp = ad_groups.filter((element) => {
  			return element.shopName === i && element.type === 'sp';
  		});
  		result.push(i);
  	}
  	return {result, arrayObj};
  }
  processChild = (item) => {
  	const {sb_groups = [], sp_groups = []} = item;
  	const ad_groups = [...sb_groups, ...sp_groups];
  	const {result, arrayObj} = this.processData(ad_groups);
  	const html = <div>{result.map((value) => {
  		return <div key={value}>
  			<div>店铺：{value}</div>
  			{arrayObj[value].sb.length > 0 && <div>SB广告组合:{arrayObj[value].sb.map((element, index) => {
  				return <span key={element.name}>{element.name} {index === arrayObj[value].sb.length - 1 ? '' : '、'}</span>;
  			})}
  			</div>}

  			{arrayObj[value].sbv.length > 0 && <div>SBV广告组合:{arrayObj[value].sbv.map((element, index) => {
  				return <span key={element.name}>{element.name} {index === arrayObj[value].sbv.length - 1 ? '' : '、'}</span>;
  			})}
  			</div>}

  			{arrayObj[value].sp.length > 0 && <div>SP广告组合:{arrayObj[value].sp.map((element, index) => {
  				return <span key={element.name}>{element.name} {index === arrayObj[value].sp.length - 1 ? '' : '、'}</span>;
  			})}
  			</div>}

  		</div>;
  	})}</div>;
  	if (result.length > 0) {
  		return html;
  	}
  	return <Empty />;
  }

  processModalChild = () => {
  	const {selects = [], modalInfo = {}} = this.state;
  	const {groupList} = modalInfo;
  	const {result = [], arrayObj} = this.processData(groupList);

  	return <div>{result.map((value) => {
  		return <Card style={{marginBottom: '10px'}} key={value}>
  			<h3>店铺：{value}</h3>
  			{arrayObj[value].sb.length > 0 && <div>SB广告组合:
  				<Row>
  					{arrayObj[value].sb.map((element, index) => {
  						const keyId = element.sid + '_' + element.profile_id + '_' + element.portfolio_id + '_' + element.type;
  						return <Col key={element.name} span={8}>
  							<Checkbox onChange={(e) => {
  								if (e.target.checked) {
  									this.setState({
  										selects: [...selects, keyId]
  									});
  								} else {
  									const pselects = [...selects];
  									pselects.splice(pselects.indexOf(keyId), 1);
  									this.setState({
  										selects: [...pselects]
  									});
  								}
  							}} checked={selects.indexOf(keyId) > -1} value={keyId}>{element.name}</Checkbox>
  						</Col>;
  					})}
  				</Row>
  			</div>}

  			{arrayObj[value].sbv.length > 0 && 	<div>SBV广告组合:
  				<Row>
  					{arrayObj[value].sbv.map((element, index) => {
  						const keyId = element.sid + '_' + element.profile_id + '_' + element.portfolio_id + '_' + element.type;

  						return <Col key={element.name} span={8}>
  							<Checkbox onChange={(e) => {
  								if (e.target.checked) {
  									this.setState({
  										selects: [...selects, keyId]
  									});
  								} else {
  									const pselects = [...selects];
  									pselects.splice(pselects.indexOf(keyId), 1);
  									this.setState({
  										selects: [...pselects]
  									});
  								}
  							}} checked={selects.indexOf(keyId) > -1} value={keyId}>{element.name}</Checkbox>
  						</Col>;
  					})}
  				</Row>
  			</div>}

  			{arrayObj[value].sp.length > 0 && <div>SP广告组合:
  				<Row>
  					{arrayObj[value].sp.map((element, index) => {
  						const keyId = element.sid + '_' + element.profile_id + '_' + element.portfolio_id + '_' + element.type;
  						return <Col key={element.name} span={8}>
  							<Checkbox onChange={(e) => {
  								if (e.target.checked) {
  									this.setState({
  										selects: [...selects, keyId]
  									});
  								} else {
  									const pselects = [...selects];
  									pselects.splice(pselects.indexOf(keyId), 1);
  									this.setState({
  										selects: [...pselects]
  									});
  								}
  							}} checked={selects.indexOf(keyId) > -1} value={keyId}>{element.name}</Checkbox>
  						</Col>;
  					})}
  				</Row>
  			</div>}

  		</Card>;
  	})}</div>;
  	// return 11;
  }
  onClickMenu = (item) => {
  	this.getGroupData(item);
  }
  getGroupData =(data) => {
  	const ad_groups = [...data.sb_groups, ...data.sp_groups];
  	const selects = [];
  	ad_groups.map((item) => {
  		selects.push(item.sid + '_' + item.profile_id + '_' + item.portfolio_id + '_' + item.type);
  	});
  	this.setState({
  		selects
  	});
  		callApi({
  			type: 'POST',
  			api: '/statistic/getAdGroup',
  			data: {
  				mid: data.mid,
  				// type: key
  			},
  			success: (res = []) => {
  				this.setState({
  					visible: true,
  					modalInfo: {
  					  local_sku_mid: data.local_sku + '_' + data.mid,
  					  mid: data.mid,
  					  local_sku: data.local_sku,
  					  local_name: data.local_name,
  						title: data.local_name + '_' + data.country,
  						groupList: res,
  					cid: data.cid,
  					category_text: data.category_text
  					}
  				});
  			},
  			error: () => {

  			}
  		});
  }

  onSubmit = () => {
  	const { selects = [], modalInfo = {} } = this.state;
  	const sbGroups = [];
  	const spGroups = [];
  	selects.map((item) => {
  		const arrayData = item.split('_');
  		const sid = arrayData[0];
  		const profile_id = arrayData[1];
  		const portfolio_id = arrayData[2];
  		const type = arrayData[3];
  		if (type === 'sp') {
  			spGroups.push({
  				type,
  				sid,
  				profile_id,
  				portfolio_id,
  				local_sku_sid: modalInfo.local_sku + '_' + sid,
  				cid: modalInfo.cid,
  					category_text: modalInfo.category_text
  			});
  		} else {
  			sbGroups.push({
  				type,
  				sid,
  				profile_id,
  				portfolio_id,
  				local_sku_sid: modalInfo.local_sku + '_' + sid,
  				cid: modalInfo.cid,
  					category_text: modalInfo.category_text
  			});
  		}
  	});

  	callApi({
  		type: 'POST',
  		api: '/statistic/updateAdGroup',
  		data: {
  			mid: modalInfo.mid,
  			local_sku_mid: modalInfo.local_sku_mid,
  			sbGroups,
  			spGroups
  		},
  		success: (res = []) => {
  			this.setState({
  				visible: false
  			}, () => {
  				this.getData();
  			});
  		},
  		error: () => {

  		}
  	});
  }

  render () {
  	const {modalInfo = {}, visible = false, skuList = []} = this.state;
  	const pSkuList = skuList.sort((a, b) => {
  		return a.mid - b.mid;
  	});
  	const tabs = [
  		{mid: 1, country: '美国'},
  		{mid: 4, country: '英国'},
  		{mid: 5, country: '德国'},
  		{mid: 6, country: '法国'},
  		{mid: 7, country: '意大利'},
  		{mid: 8, country: '西班牙'},
  		{mid: 10, country: '日本'},
  	];
  	return <div style={{height: '100%', overflowY: 'auto'}}>
  		<Modal
  			width="70%"
  			title={modalInfo.title}
  			visible={visible}
  			onOk={() => {
  				this.onSubmit();
  			}}
  			// confirmLoading={confirmLoading}
  			onCancel={() => {
  				this.setState({
  					visible: false
  				});
  			}}
  		>
  			<div style={{height: '70vh', overflow: 'auto'}}>
  				{this.processModalChild()}

  			</div>
  		</Modal>

  		<StickyContainer>
  		<Tabs defaultActiveKey="1" >
  			{tabs.map((tabItem) => {
  				return <TabPane tab={tabItem.country} key={String(tabItem.mid)}>
  						<div style={{height: '75vh', overflowY: 'auto'}}>
  							<Row gutter={24}>
  								{pSkuList.filter((element) => { return element.mid == tabItem.mid; }).map((item) => {
  									return <Col key={item.pid_sid} span={6} style={{marginBottom: '20px'}}>
  										<Card title={`${item.local_name}_${item.country}` } style={{height: '100%'}} bordered={true}
  											extra={<EditOutlined key="edit" onClick={e => this.onClickMenu(item)}/>
  											}
  										>
  											{this.processChild(item)}

  										</Card>
  									</Col>;
  								})}
  							</Row>
  						</div>
  			</TabPane>;
  			})}

  		</Tabs>
  		</StickyContainer>
  			{/* <Row gutter={24}>
  				{pSkuList.map((item) => {
  				return <Col key={item.pid_sid} span={6} style={{marginBottom: '20px'}}>
  					<Card title={`${item.local_name}_${item.country}` } style={{height: '100%'}} bordered={true}
  						extra={<EditOutlined key="edit" onClick={e => this.onClickMenu(item)}/>
  					}
  					>
  					{this.processChild(item)}

  					</Card>
  				</Col>;
  				})}
  			</Row> */}

  	</div>;
  }
}
export default Logon;
