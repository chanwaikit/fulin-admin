//框架依赖
import React, {Component, PureComponent} from 'react';
import { Select, Input, Tabs, DatePicker, Button, Empty, Checkbox, Modal, Row, Col, Collapse, Descriptions, Menu,Switch, Dropdown, Card, Table } from 'antd';
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
    shopList:[]
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
  		api: '/statistic/getShopList',
  		data: {
  			// startDate: dayjs(pickerDate[0]).format('YYYY-MM-DD'),
  			// endDate: dayjs(pickerDate[1]).format('YYYY-MM-DD')
  		},
  		success: (res = []) => {
        this.setState({
          shopList:res
        })
  		},
  		error: () => {

  		}
  	});
  }
  
  onChangeSwitch = (value,item) =>{
    console.log(value,item.sid)

    callApi({
  		type: 'POST',
  		api: '/statistic/updateShopTeika',
  		data: {
  			sid:item.sid,
        teika_open:value
  		},
  		success: (res = []) => {
       this.getData()
  		},
  		error: () => {

  		}
  	});
  }

  render () {
  	const {modalInfo = {}, visible = false, shopList = []} = this.state;
  	const pShopList = shopList.sort((a, b) => {
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
  		

  		<StickyContainer>
  		<Tabs defaultActiveKey="1" >
  			{tabs.map((tabItem) => {
  				return <TabPane tab={tabItem.country} key={String(tabItem.mid)}>
  						<div style={{height: '75vh', overflowY: 'auto'}}>
  							<Row gutter={24}>
  								{pShopList.filter((element) => { return element.mid == tabItem.mid; }).map((item) => {
  									return <Col key={item.pid_sid} span={6} style={{marginBottom: '20px'}}>
  										<Card title={`${item.name}` } style={{height: '100%'}} bordered={true}>
  											{/* {this.processChild(item)} */}
                        <div><Switch onChange={(value)=>{
                          this.onChangeSwitch(value ? '1' :'0',item)
                        }} checkedChildren="teika开启" unCheckedChildren="teika关闭" checked={item.teika_open == '1'} /></div>
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
