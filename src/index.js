import React, { Component, PureComponent } from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route,
	Switch, Link
} from 'react-router-dom';

import './index.less';

window.FastClick.attach(document.body);

class Root extends (PureComponent || Component) {
	constructor (props) {
		super(props);
		this.state = {
			spinning: true,
			selectedKey: '',
			userInfo: {}
		};
	}
	componentDidMount () {
		window.$$context = {};
		this.setState({
			selectedKey: location.hash.slice(2)
		});
		if (document.getElementById('loading-container') !== null) {
			document.body.removeChild(document.getElementById('loading-container'));
		}
	}

	render () {
  	const { spinning, userInfo = {}, selectedKey } = this.state;
  	return (
  		<div>
  			<Router >
  				<Switch>
  					<Route exact path="/login" component={Login} />
  					<Route path="/" component={Home} />
  				</Switch>
  			</Router>
  		</div>
  	);
	}
}

render(<Root />, document.getElementById('root'));
