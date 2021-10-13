//框架依赖
import React, {Component, PureComponent} from 'react';
import { Form, Input, Button, Spin } from 'antd';
import callApi from 'utils/callApi';
import moment from 'moment';
import './index.less';

const dayStartMs = moment(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
const dayEndMs = moment(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');

class Logon extends (PureComponent || Component) {
  state = {

  }

  componentDidMount () {

  }

  // download (link, picName) {
  // 	let img = new Image();
  // 	img.setAttribute('crossOrigin', 'Anonymous');
  // 	img.onload = function () {
  // 		let canvas = document.createElement('canvas');
  // 		let context = canvas.getContext('2d');
  // 		canvas.width = img.width;
  // 		canvas.height = img.height;
  // 		context.drawImage(img, 0, 0, img.width, img.height);
  // 		let url = canvas.toDataURL('images/png');
  // 		let a = document.createElement('a');
  // 		let event = new MouseEvent('click');
  // 		a.download = picName || 'default.png';
  // 		a.href = url;
  // 		a.dispatchEvent(event);
  // 	};
  // 	img.src = link + '?v=' + Date.now();
  // }

  download = (values) => {
  	const {link = '', num = 100, picName = ''} = values;
  	const number = Number(num);
  	for (let i = 1; i <= number + 1; i++) {
  		setTimeout(() => {
  			let img = new Image();
  			img.setAttribute('crossOrigin', 'Anonymous');
  			img.onload = function () {
  				let canvas = document.createElement('canvas');
  				let context = canvas.getContext('2d');
  				canvas.width = img.width;
  				canvas.height = img.height;
  				context.drawImage(img, 0, 0, img.width, img.height);
  				let url = canvas.toDataURL('images/png');
  				let a = document.createElement('a');
  				let event = new MouseEvent('click');
  				a.download = picName + i + '.png' || 'default.png';
  				a.href = url;
  				a.dispatchEvent(event);
  			};
  			img.src = link + '/' + String(i) + '.jpg?v=' + Date.now();
  		}, parseInt(i / 10) * 30000);
  	}
  }

  // download = (values) => {
  // 	const {link = '', num = 54, picName = ''} = values;
  // 	const number = Number(num);
  // 	let array = [];
  // 	for (let i = 11; i <= number + 1; i++) {
  // 		array.push(i);
  // 			let img = new Image();
  // 		img.setAttribute('crossOrigin', 'Anonymous');
  // 		img.onload = function () {
  // 			let canvas = document.createElement('canvas');
  // 			let context = canvas.getContext('2d');
  // 			canvas.width = img.width;
  // 			canvas.height = img.height;
  // 			context.drawImage(img, 0, 0, img.width, img.height);
  // 			canvas.toBlob(blob => {
  // 				let url = URL.createObjectURL(blob);
  // 				let a = document.createElement('a');
  // 				let event = new MouseEvent('click');
  // 				a.download = picName + i + '.png' || 'default.png';
  // 				a.href = url;
  // 				a.dispatchEvent(event);
  // 				URL.revokeObjectURL(url);  // 内存管理,将这句代码注释掉,则将以 blob:http 开头的url复制到浏览器地址栏有效,否则无效.
  // 			});
  // 		};
  // 		img.src = link + '/' + String(i) + '.jpg?v=' + Date.now();
  // 	}
  // }

  render () {
  	const {spinning, tableData = []} = this.state;

  	return <div className="sku-remark">

  		{/* <Button onClick={() => {
  			this.download('https://cnstatic01.e.vhall.com/document/d81b0615ef52420328c03dabddac6123/8.jpg', 'abc.jpg');
  		}}>下载图片</Button> */}

  		<Form
  			name="basic"
  			// labelCol={{
  			// 	span: 8,
  			// }}
  			wrapperCol={{
  				span: 12,
  			}}
  			initialValues={{
  				// remember: true,
  			}}
  			onFinish={this.download}
  			// onFinishFailed={onFinishFailed}
  			autoComplete="off"
  		>
  			<Form.Item
  				label="网站"
  				name="link"
  				rules={[
  					{
  						required: true,
  						message: 'Please input link!',
  					},
  				]}
  			>
  				<Input placeholder="请输入网站前缀"/>
  			</Form.Item>

  			{/* <Form.Item
  				wrapperCol={{
  					// offset: 8,
  					span: 4,
  				}}
  				label="数量"
  				name="num"
  				rules={[
  					{
  						required: true,
  						message: 'Please input num!',
  					},
  				]}
  			>
  				<Input placeholder="请输入页码"/>
  			</Form.Item> */}

  			<Form.Item
  				label="导出的名称"
  				name="picName"
  				wrapperCol={{
  					// offset: 8,
  					span: 6,
  				}}
  				rules={[
  					{
  						required: true,
  						message: 'Please input picName!',
  					},
  				]}
  			>
  				<Input placeholder="请输入导出的名称"/>
  			</Form.Item>

  			<Form.Item
  				// wrapperCol={{
  				// 	offset: 8,
  				// 	span: 16,
  				// }}
  			>
  				<Button type="primary" htmlType="submit">
            提交
  				</Button>
  			</Form.Item>
  		</Form>
  	</div>;
  }
}
export default Logon;
