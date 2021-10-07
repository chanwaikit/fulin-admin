import React, { Component, Suspense, Spin, lazy, PureComponent } from 'react';

import { render } from 'react-dom';
import { HashRouter as Router, Route,
	Switch, Link
} from 'react-router-dom';
// import AdAnalyze from './routes/ad-analyze';
// import AdBoard from './routes/ad-board';
// import CategoryList from './routes/category-list';
// import SkuAd from './routes/sku-ad';

import logo from './images/logo.jpeg';

import './index.less';
import { Layout, Menu } from 'antd';
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	UserOutlined,
	LineChartOutlined,
	NodeIndexOutlined,
	PieChartOutlined,
	ProfileOutlined,
	BarChartOutlined,
	ScheduleOutlined
} from '@ant-design/icons';

const AdAnalyze = React.lazy(() => import('./routes/ad-analyze'));
const AdBoard = React.lazy(() => import('./routes/ad-board'));
const CategoryList = React.lazy(() => import('./routes/category-list'));
const SkuAd = React.lazy(() => import('./routes/sku-ad'));
const WeekReport = React.lazy(() => import('./routes/week-report'));
const SkuTable = React.lazy(() => import('./routes/sku-table'));
const DataRecord = React.lazy(() => import('./routes/data-record'));

const { Header, Sider, Content } = Layout;
window.FastClick.attach(document.body);

class Home extends (PureComponent || Component) {
	constructor (props) {
		super(props);
		this.state = {
			// spinning: true,
			selectedKey: '',
			userInfo: {}
		};
	}
	componentDidMount () {
		// Toast.hide();
		this.setState({
			selectedKey: location.hash.slice(2)
		});
		if (document.getElementById('loading-container') !== null) {
			document.body.removeChild(document.getElementById('loading-container'));
		}
		this.setState({
			spinning: false
		});
	}

  toggle = () => {
  	this.setState({
  		collapsed: !this.state.collapsed,
  	});
  };

  render () {
  	const { spinning, userInfo = {}, selectedKey } = this.state;
  	const menu = [{
  		key: 'sku-ad',
  		title: '品名广告映射表',
  		icon: <NodeIndexOutlined />
  	}, {
  		key: 'ad-board',
  		title: '广告数据驾驶舱',
  		icon: <PieChartOutlined />
  	},
  	// {
  	// 	key: 'category-list',
  	// 	title: '类别总览',
  	// 	icon: <BarChartOutlined />
  	// },
  	{
  		key: 'ad-analyze',
  		title: '广告详情',
  		icon: <LineChartOutlined />
  	},
  	{
  		key: 'sku-table',
  		title: '产品表',
  		icon: <ProfileOutlined />
  	},
  	{
  		key: 'week-report',
  		title: '周报生成器',
  		icon: <BarChartOutlined />
  	},
  	{
  		key: 'data-record',
  		title: '数据捕捉日志',
  		icon: <ScheduleOutlined />
  	}
  	];

  	return (
  		<div id="fulin-menu">
  			{!spinning && <Router>

  				<div>
  					 <Layout style={{height: '100vh'}}>
  						<Sider trigger={null} collapsible collapsed={this.state.collapsed}>
  							<div className="logo" >
  								<div style={this.state.collapsed ? {marginLeft: '10px'} : {}} className="logo-img"><img src={logo}/></div>
  								{!this.state.collapsed && <div className="logo-name">Fulin-tech</div>}
  							</div>
  							<Menu theme="dark" mode="inline" onClick={(e) => {
  								this.setState({
  									selectedKey: e.key
  								});
  							}} selectedKeys={[selectedKey]}>
  								{menu.map((item) => {
  									return <Menu.Item key={item.key} icon={item.icon}>
  										<Link to={`/${item.key}`}>{item.title}</Link>
  									</Menu.Item>;
  								})}
  							</Menu>
  						</Sider>
  						<Layout className="site-layout">
  							<Header className="site-layout-background" style={{ padding: 0 }}>
  								<div style={{float: 'left'}}>
  									{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
  										className: 'trigger',
  										onClick: this.toggle,
  									})}
  								</div>
  								<div style={{marginRight: '16px', float: 'right'}}>
  									<UserOutlined style={{marginRight: '8px'}}/>
  									{userInfo.realname}
  								</div>
  							</Header>
  							<Content
  								className="site-layout-background"
  								style={{
  									margin: '24px 16px',
  									padding: 24,
  									height: '280',
  								}}
  							>
  								<Suspense fallback={<div />}>
  									<div style={{height: '100%'}}>
  										<Route path="/ad-analyze" component={AdAnalyze} />
  										<Route path="/sku-ad" component={SkuAd} />
  										<Route path="/ad-board" component={AdBoard} />
  										<Route path="/category-list" component={CategoryList} />
  										<Route path="/week-report" component={WeekReport} />
  										<Route path="/sku-table" component={SkuTable} />
  										<Route path="/data-record" component={DataRecord} />

  									</div>
  								</Suspense>

  							</Content>
  						</Layout>
  					</Layout>
  				</div>
  			</Router>}

  		</div>
  	);
  }
}

export default Home;
