import React, { Component, PureComponent } from 'react';
import { Input, Select, Button } from 'antd';
import callApi from 'utils/callApi';
import welcome from 'images/welcome.png';
import './index.less';

const { TextArea } = Input;
class Welcome extends (PureComponent || Component) {
	constructor (props) {
		super(props);
		this.state = {
			value: '',
			valueArray: [],
			countryCode: 'es',
			inputValue1: '',
			inputValue1: 1,
			level1: [],
			level2: [],
			level3: [],
			level4: [],
			level5: []

		};
	}
  inputValue=(event) => {
  	console.log(event.target.value);

  	let inputValue = event.target.value;
  	const valueArray = inputValue.replace(/\n/g, ',').split(',');
  	console.log(valueArray);
  	this.setState({
  		valueArray
  	});
  }

  inputValue1=(event) => {
  	let inputValue = event.target.value;
  	const valueArray = inputValue.replace(/,/g, '\n');
  	const pValueArray = valueArray.toLowerCase();
  	console.log(pValueArray);
  }
  onSubmit = () => {
  	const {valueArray, countryCode} = this.state;
  	valueArray.map((value) => {
  		window.open(`https://xp.sellermotor.com/selection/asin-query/word-list?asin=${value}&countryCode=${countryCode}&is_excel=1`);
  	});
  }
  onTest = () => {
  	const prefix = 'planchas de pelo';
  	this.getSuggestions(prefix, 1);
  }

  getSuggestions = (prefix, level) => {
  	if (level === 5) return false;
  	callApi({
  		custom: true,
  		type: 'GET',
  		api: `${window.location.origin}/api/2017/suggestions?session-id=259-5552210-0103015&customer-id=&request-id=JX8VQ7CVJ25ARCN7J0P3&page-type=Gateway&lop=es_ES&site-variant=desktop&client-info=amazon-search-ui&mid=A1RKKUPIHCS9HS&alias=aps&b2b=0&fresh=0&ks=76&prefix=${prefix}&event=onKeyPress&limit=11&fb=1&suggestion-type=KEYWORD&suggestion-type=WIDGET&_=1622857254233`,
  		data: {

  		},
  		success: (res = {}) => {
  			let array = res.suggestions || [];
  			array.map((item) => {
  				if (prefix !== item.value) {
  					this.setState({
  						[`level${level + 1}`]: [...this.state[`level${level + 1}`], item.value]
  					});
  					this.getSuggestions(item.value, level + 1);
  				}
  			});
  		}
  	});
  }
  render () {
  	const {inputValue, inputValue1, countryCode} = this.state;
  	console.log(window.$$context);
  	const {userInfo = {}} = window.$$context;
  	return (
  		<div className="fulin-welcome" style={{backgroundImage: `url(${welcome})`}}>
  			<div className="content" >
  				<h2>Hi，{userInfo.realname}</h2>
  				<h3>深圳市弗林科技有限公司</h3>
  			</div>
  		</div>
  	);
  }
}

export default Welcome;
