/**
 * getUrlQuery
 *  解析url的search，返回一个键值对的对象query
 *  @param {string} search （eg. ?id=1&name=lestat）
 *  @return {object} return the query （eg. {id: 1, name: lestat}）
 **/
const getUrlQuery = () => {
	let array = location.href.split('?');
	let search = '';
	for (let i = 1; i < array.length; i++) {
		if (i === 1) {
			search = array[i];
		} else {
			search = search + '&' + array[i];
		}
	}
	let query = {}, searchArray;
	if (typeof search !== 'string') {
		throw new Error('The type of getUrlQuery\'s param should be string!');
	}
	if (search.indexOf('?') === 0) {
		search = search.substring(1);
	}

	searchArray = search.split('&');
	searchArray.forEach(item => {
		const arr = item.split('=');
		let value = arr[1];
		if (arr[1] && arr[1].indexOf('#/' > -1)) {
			value = arr[1].split('#/')[0];
		}
		query[arr[0]] = value;
	});

	return query;
};

export default getUrlQuery;
