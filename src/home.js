import React, { Component, PureComponent } from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route,
	Switch, Link
} from 'react-router-dom';
import Index from './routes/index';
import AdAnalyze from './routes/ad-analyze';
import AdBoard from './routes/ad-board';
import CategoryList from './routes/category-list';
import SkuAd from './routes/sku-ad';

import logo from './images/logo.jpeg';

import './index.less';
import { Layout, Menu } from 'antd';
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	UserOutlined,
	LineChartOutlined,
	ApiOutlined,
	PieChartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
window.FastClick.attach(document.body);

class Home extends (PureComponent || Component) {
	constructor (props) {
		super(props);
		this.state = {
			spinning: true,
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
  		icon: <ApiOutlined />
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
  	}];

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
  								<div style={{height: '100%'}}>
  									<Route exact path="/" component={Index} />
  									<Route path="/ad-analyze" component={AdAnalyze} />
  									<Route path="/sku-ad" component={SkuAd} />
  									<Route path="/ad-board" component={AdBoard} />
  									<Route path="/category-list" component={CategoryList} />

  								</div>
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
