
// api定义
const api = {
	//获取所有资源
	getResourceList: '/rental/admin/getResourceList',

};

const enums = {
	payType: { //支付方式枚举
		'10001': '支付宝',
		'10002': '微信',
		'10003': '个人钱包',
		'10004': '企业钱包',
		'10005': '线下支付',
		'10006': '营销优惠',
		'10007': '企业账单',
	}
};
export {
	api,
	enums
};
