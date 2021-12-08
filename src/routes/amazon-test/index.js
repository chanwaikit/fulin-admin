//框架依赖
import React, {Component, PureComponent} from 'react';
import { Table, Input, Button, Spin } from 'antd';
import callApi from 'utils/callApi';
import moment from 'moment';
import XLSX from 'xlsx';

import './index.less';

const dayStartMs = moment(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
const dayEndMs = moment(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
const { TextArea } = Input;

class Logon extends (PureComponent || Component) {
  state = {

  }

  componentDidMount () {

  }

  getColumns = () => {
  	return [
  		{
  			title: 'keyword',
  			dataIndex: 'keyword',
  			key: 'keyword',
  			render: (value, record,) => {
  				return <div>
  					<div>{value}</div>
  				</div>;
  			}
  		}, {
  			title: 'match-type',
  			dataIndex: 'match_type',
  			key: 'match_type',
  			render: (value, record,) => {
  				return <div>
  					<div>{value}</div>
  				</div>;
  			}
  		}, {
  			title: 'Relevance Score',
  			dataIndex: 'relevance_score',
  			key: 'relevance_score',
  			render: (value, record,) => {
  				return <div>
  					<div>{value}</div>
  				</div>;
  			}
  		},
  		{
  			title: 'Monthly Search Volume',
  			dataIndex: 'keyword',
  			key: 'keyword',
  			render: (value, record,) => {
  				return <div>
  					<div>{record.sa_metrics.searches}k</div>
  				</div>;
  			}
  		},
  		// {
  		// 	title: 'CPC',
  		// 	dataIndex: 'keyword',
  		// 	key: 'keyword',
  		// 	render: (value, record,) => {
  		// 		return <div>
  		// 			<div>{value}</div>
  		// 		</div>;
  		// 	}
  		// },
  		{
  			title: 'Estimated Orders/Month',
  			dataIndex: 'keyword',
  			key: 'keyword',
  			render: (value, record,) => {
  				return <div>
  					<div>{record.sa_metrics.purchases}</div>
  				</div>;
  			}
  		},
  		{
  			title: 'Conversion Rate',
  			dataIndex: 'keyword',
  			key: 'keyword',
  			render: (value, record,) => {
  				return <div>
  					<div>{record.sa_metrics.cvr}%</div>
  				</div>;
  			}
  		}

  	];
  }
  render () {
  	var str = 'hair straightener,straightener hair,straightener brush hair,hair straightener brush,hair straightener products,flat hair straightener,hair straightener comb,hair straightener mkboo,hair straightener cream,hair brush straightener,mini hair straightener,hair straightener pro,cordless hair straightener,hair iron straightener,chi hair straightener,220v hair straightener,ceramic hair straightener,hair straightener tyme,chicvoss hair straightener,small hair straightener,hair care straightener,travel hair straightener,viva hair straightener,best hair straightener,professional hair straightener,kipozi hair straightener,remington hair straightener,brush hair straightener,hair straightener ribivaul,hair straightener styler,hair straightener holder,dyson hair straightener,sokany hair straightener,lange hair straightener,hair straightener accessories,umickoo hair straightener,hair curler straightener,steam hair straightener,hair comb straightener,titanium hair straightener,comb hair straightener,simplee hair straightener,salon hair straightener,dona hair straightener,natural hair straightener,beauty hair straightener,mkboo hair straightener,black hair straightener,hair straightener gold,magic hair straightener,hair straightener set,curling hair straightener,thick hair straightener,revlon hair straightener,ionic hair straightener,womens hair straightener,iron hair straightener,hair dryer straightener,chemical hair straightener,hair steam straightener,wide hair straightener,mens hair straightener,hair straightener iron,hair straightener akiracosme,styler hair straightener,thin hair straightener,blowdryer/ hair straightener,hair straightener cheap,hair straightener ceramic,hair straightener curler,hair straightener tourmaline,oil hair straightener,hair straightener titanium,hair straightener men,wireless hair straightener,hair straightener/curler,babyliss hair straightener,men hair straightener,hair styler straightener,profession hair straightener,hair straightener babyliss,tymo hair straightener,pink hair straightener,hair straightener travel,style hair straightener,ghd hair straightener,hair straightener converter,maxiglide hair straightener,hair straightener chi,anion hair straightener,hair straightener oil,perfect hair straightener,hair straightener small,hair straightener mini,conair hair straightener,hair straightener product,hair straightener tymo,hair straightener dryer,hair straightener lange,hair straightener treatment,infrared hair straightener,hair straightener 220v,hair straightener serum,hair straightener remington,hair straightener kit,queenssoul hair straightener,nano hair straightener,skinny hair straightener,hair straightener conair,chic hair straightener,tiny hair straightener,max hair straightener,kemei hair straightener,hair straightener hsi,ellesye hair straightener,palm hair straightener,hair straightener professional,hair relaxer straightener,hair straightener t3,cold hair straightener,bestope hair straightener,remintong hair straightener,straightener hair brush,hair straightener b01mucqkuu,purple hair straightener,royale hair straightener,xtava hair straightener,hair straightener organizer,2 hair straightener,yogurt hair straightener,twist hair straightener,hair beard straightener,keratin hair straightener,hair straightener spray,yitrust hair straightener,t3 hair straightener,hair straightener mat,hsi hair straightener,megastar hair straightener,hair straightener steamer,hai hair straightener,sedu hair straightener,bellezza hair straightener,beard hair straightener,hair straightener pink,soleil hair straightener,pyt hair straightener,cozymore hair straightener,obella hair straightener,terresa hair straightener,bestselli hair straightener,corrale hair straightener,cheap hair straightener,horatii hair straightener,hair steamer straightener,pencil hair straightener,fahrenheit hair straightener,vibrating hair straightener,white hair straightener,ion hair straightener,permanent hair straightener,licautabl hair straightener,international hair straightener,nume hair straightener,hair saver straightener,croc hair straightener,god hair straightener,babybliss hair straightener,liangzai hair straightener,newwaylives hair straightener,shiseido hair straightener,amika hair straightener,tourmaline hair straightener,hair straightener white,hair straightener steam,short hair straightener,hair straightener bestope,fhi hair straightener,herstyler hair straightener,kemel hair straightener,l\'ange hair straightener,eap hair straightener,ribivaul hair straightener,kskin hair straightener,hair straightener revlon,lumielina hair straightener,mavigadget hair straightener,philips hair straightener,eva hair straightener,steampod hair straightener,foxybae hair straightener,dafni hair straightener,hair straightener ghd,hair straightener wide,hair straightener sri,furden hair straightener,lulubra hair straightener,usmooth hair straightener,electric hair straightener,duvolle hair straightener,horati hair straightener,bestelli hair straightener,smartolife hair straightener,hair straightener cordless,epple hair straightener,barberslay hair straightener,claymore hair straightener,ultrasonic hair straightener,babytiless hair straightener,vanessa hair straightener,twisted hair straightener,suntop hair straightener,hotwined hair straightener,lauvery hair straightener,kardashian hair straightener,european hair straightener,profashion hair straightener,peakdude hair straightener,bliss hair straightener,panasonic hair straightener,olaxer hair straightener,taimistyle hair straightener,furiden hair straightener,corioliss hair straightener,ogilvie hair straightener,wazor hair straightener,cortex hair straightener,sri hair straightener,salonia hair straightener,hair vacuum straightener,persica hair straightener,evalectric hair straightener,romando hair straightener,valectric hair straightener,tyme hair straightener,nition hair straightener,koranas hair straightener,hair straightener philips,hair straightener kipozi,bigrace hair straightener,gvp hair straightener,miropure hair straightener,jinri hair straightener,sutra hair straightener,wet hair straightener,homitt hair straightener,berta hair straightener,rusk hair straightener,glamfields hair straightener,hair straightener protectant,jackandjillian hair straightener,instyler hair straightener,vav hair straightener,hair straightener dyson,drybar hair straightener,hair straightener furiden,shishedo hair straightener,entil hair straightener,anjou hair straightener,hot iron hair straightener,electric brush hair straightener,electric comb hair straightener,flat iron hair straightener,whnsp hair straightener,portable hair straightener,best steam hair straightener,hair straightener for women,professional steam hair straightener,hair curler and straightener,men hair straightener comb,hair dryer straightener brush,ceramic steam hair straightener,converter for hair straightener,hair straightener and curler,hair straightener temperature adjustable,hot comb hair straightener,hair straightener straightening brush,hair straightener nano titanium,hot brush hair straightener,steam hair straightener mkboo,gopo hair straightener,best hair brush straightener,professional hair straightener brush,sugarboo hair straightener,easy hair straightener,gem hair straightener,straightener for thick hair,hair straightener bush,hair straightener with brush,heat brush hair straightener,hair straightener prime day,hair straightener brush set,male hair straightener,bang hair straightener,onepass hair straightener,blowout hair straightener,hair straightener lotion,create hair straightener,healthier hair straightener,hair straightener best rated,yoguinrt hair straightener,his hair straightener,loreal steampod hair straightener,solia hair straightener,hair straightener vitamins,maxi glider hair straightener,hair straightener styler comb,good hair straightener,chi hair straightener ceramic,hot hair brush straightener,hot hair straightener brush,hastar hair straightener,tymo hair straightener brush,hair straightener aima beauty,best hair straightener brush,ceramic brush hair straightener,krafty touch hair straightener,hair straightener for men,amika brush hair straightener,safe hair straightener,hydrating hair straightener,drying brush hair straightener,hair iron straightener ceramic,hair straightener gloves,hair straightener for girls,dual voltage hair straightener,petal brush hair straightener,chi hair straightener professional,hair and beard straightener,cattymao hair straightener,hair straightener brush men,ceramic hair brush straightener,hair straightener flower,hair straightener pro brush,ceramic tourmaline hair straightener,gold hair straightener professional,travel size hair straightener,bablyss hair straightener,hair dryer and straightener,hair dryer brush straightener,heat comb hair straightener,teal hair straightener,ceramic iron hair straightener,multipurpose hair straightener,hitworkera hair straightener,hair straightener styling comb,hair straightener japan,pro hair steam straightener,ionic hair straightener brush,vacuum hair straightener,buddygo hair straightener,hair straightener brush comb,hair comb straightener women,hair straightener with temperature,2 inch hair straightener,hair brush dryer straightener,tool science hair straightener,mens hair straightener brush,hair straightener shampoo,mini hair iron straightener,iron comb hair straightener,proliss hair straightener,hair flat iron straightener,flower hair brush straightener,hair straightener case,belleza hair straightener,1 inch hair straightener,hair dryer with straightener,furiden hair straightener steam,hair straightener blow dryer,mini ceramic hair straightener,hair straightener paul mitchell,hair comb beard straightener,dyson corrale hair straightener,maxiglide xp hair straightener,straightener that curls hair,straightener for short hair,permanent hair straightener treatment,' +
    'electric hair straightener & curler,galaxy hair straightener,ovonni hair straightener,rose gold hair straightener,martino hair straightener,gvc hair straightener,multifunctional iron hair straightener,hair straightener 2 inch,hi hair straightener,professional electric hair straightener,hair straightener that curls,philips hair straightener brush,xara hair straightener,curly hair straightener,flow hair brush straightener,criticism hair straightener,rosily hair straightener,hair crimper and straightener,caratine hair straightener,sleeker hair straightener,hair straightener curling iron,innovator hair straightener,2and1 hair straightener,mens hair straightener comb,globalstar hair straightener,costoreco hair straightener,skylinesky hair straightener,aglow hair straightener,princely hair straightener,lanpro hair straightener,she hair straightener,hair straightener brush ionic,hair straightener titanium plates,hair brush iron straightener,hair straightener chia,press comb hair straightener,hair straightener 3 inch,bybliss hair straightener,electric beard hair straightener,hair straightener laser,bellami hair straightener,hair straightener ionic,steam styler hair straightener,hair straightener cream permanent,hair relaxer straightener permanent,hair dryer straightener combo,no heat hair straightener,root straightener for hair,silky smooth hair straightener,steam pro hair straightener,bebella hair straightener,hair drying brush straightener,furiden steam hair straightener,hair blower brush straightener,steam hair straightener brush,kids hair straightener,woman ocean hair straightener,hiteworkera hair straightener brush,chicvoss hair straightener curler,flat hair iron straightener,hair straightener with curler,pty hair straightener,ceramic mini hair straightener,straight brush hair straightener,hair straightener black friday,hair straightener vitamin,kiyosaki hair straightener,simplee hair straightener curler,geemy hair straightener,magic comb hair straightener,physiotherapy hair straightener,hair straightener comb men,hair straight styler straightener,nova hair straightener,wet dry hair straightener,hair straightener for beards,hair straightener china,mioob hair curler straightener,apalus brush hair straightener,anion hair straightener brush,blue hair straightener,african american hair straightener,best rated hair straightener,coco hair straightener,2019 professional hair straightener,pro steam hair straightener,good hair day straightener,chic voss hair straightener,220 volt hair straightener,low temp hair straightener,hair comb straightener men,k skin hair straightener,wet2straight hair straightener,straightener,hairsaver hair straightener men,hair straightener and dryer,mini hair straightener brush,professional hair steam straightener,flower hair straightener,hair straightener dryer brush,hair brush straightener revlon,babyliss iron hair straightener,hair straightener dual voltage,brush hair dryer straightener,silk press hair straightener,voltage converter hair straightener,lange brush hair straightener,portable cordless hair straightener,wireless hair straightener brush,cordless hair straightener brush,beard and hair straightener,cordless mini hair straightener,biotic hair straightener,miss hair straightener brush,no damage hair straightener,dyson carrole hair straightener,rush brush hair straightener,the palm hair straightener,jack jillian hair straightener,rechargeable hair straightener,hair straightener biosilk,fluffy berry hair straightener,straightener for curly hair,steam brush hair straightener,dyson hair iron straightener,steam pods hair straightener,anti static hair straightener,lucea id hair straightener,queen soul hair straightener,one pass hair straightener,hair straightener 1 inch,maxiglide hair straightener steam,yoguinrt iron hair straightener,hair straightener flat iron,abody hair straightener,glatt hair straightener cream,hair straightener target,trezoro hair straightener,palm hair straightener pro,ceramic hair straightener brush,black friday hair straightener,hair straightener travel size,enhanced hair straightener brush,straight ahead hair straightener,maxius maxiglide hair straightener,kemei steam hair straightener,crepe hair straightener,hair straightener suction,diane hair straightener,smooth steam hair straightener,classic professional hair straightener,mondava hair straightener,hot tools hair straightener,mj hair straightener,jael hair straightener brush,almost famous hair straightener,foxy bae hair straightener,poweriq hair straightener,chi hair straightener brush,cosymore hair straightener brush,hair straightener hot tools,chi hair straightener spray,revlon hair straightener brush,geepas hair straightener,zoeetree hair straightener,levite hair brush straightener,szhahn hair straightener,elfina hair straightener,electric hair brush straightener,karmin hair straightener,dyson corale hair straightener,kingdomcares hair straightener,roventa hair straightener,baby liss hair straightener,dorisilk steam straightener hair,hair straightener protectant spray,hitworker hair straightener brush,heating brush hair straightener,paul mitchell hair straightener,levite hair straightener brush,heated hair brush straightener,glamfields hair straightener brush,hsi professional hair straightener,hoson hair straightener,sultra hair straightener,royale hair straightener ceramic,kristin ess hair straightener,one stroke hair straightener,miropure hair straightener brush,ulipso hair straightener brush,loreal hair straightener,geporay hair straightener brush,chicvoss professional hair straightener,graphene hair straightener brush,sabuy hair straightener,dreamgenius hair straightener,steamstyler professional hair straightener,dyson coralle hair straightener,chi air hair straightener,profashion hair straightener brush,tymo ring hair straightener,kealive hair straightener,brilliance hair straightener,mhu hair straightener,hair straightener european plug,ghd mini hair straightener,hair steamer straightener professional,chi lava hair straightener,kendall jenner hair straightener,hair straightener brush graphene,maxiglide hair straightener red,remington hair straightener avocado,hitworkera hair straightener brush,hair straightener with comb,apalus hair straightener brush,furiden hair steam straightener,babliss professional hair straightener,miqiko hair straightener brush,amazeshops hair straightener pro,sipu hair straightener brush,epple steam hair straightener,luma bella hair straightener,hastar hair straightener brush,ghd gold hair straightener,iefevivi hair straightener brush,babyliss pro hair straightener,dyson cordless hair straightener,kristen ess hair straightener,hair straightener brush miqiko,modern indigo hair straightener,solofish steam hair straightener,ralthy hair straightener brush,skylinesky hair straightener comb,hair straightener brush glamfields,hair straightener brush tymo,tymo hair straightener comb,yitrust beard straightener hair,kipozi hair straightener brush,ginalli milano hair straightener,ghd platinum hair straightener,backpacking hair straightener,bstirton brush hair straightener,lange hair straightener brush,belladonna hair straightener,john frieda hair straightener,mexitop ionic hair straightener,surelang hair straightener brush,jack & jillian hair straightener,atlantic coco hair straightener,coco store hair straightener,lavite hair straightener brush,furiden hair straightener brush,cloud 9 hair straightener,kiss hair straightener comb,ghd max hair straightener,revlon hair brush straightener,olla bella hair straightener,u smooth hair straightener,megawise hair straightener brush,ghd professional hair straightener,remington hair straightener brush,nume fashionista hair straightener,furiden hair straightener steamer,yusong hair straightener curler,paulago steam hair straightener,peak dude hair straightener,amika hair straightener brush,etereauty hair straightener,queenssoul hair straightener brush,tymo sway hair straightener,kipozi titanium hair straightener,atlantic boutique hair straightener,hair straightener for teens,lunata cordless hair straightener,pyt mini hair straightener,ghd hair straightener brush,huachi hair straightener,hocosy hair straightener brush,croc hair straightener titanium,dyson iron hair straightener,sarcch hair straightener brush,baby bliss hair straightener,chi hair iron straightener,contour couture hair straightener,dyson hair dryer straightener,acevivi hair straightener,hair straightener with steam,minizone hair straightener brush,l\'oreal steampod hair straightener,loreal steam hair straightener,bestsellii hair straightener brush,hair straightener babyliss pro,lange hair brush straightener,vav professional hair straightener,ghd classic hair straightener,pritech mini hair straightener,bio ionic hair straightener,steampod hair straightener l\'oreal,hair straightener t3 singlepass,nume silhouette hair straightener,micropure hair straightener brush,dry bar hair straightener,her styler hair straightener,cloud nine hair straightener,revlon steam hair straightener,battery operated hair straightener,mkboo steam hair straightener,dyson coral hair straightener,dallfoll hair straightener brush,l ange hair straightener,barberslay hair straightener pro,obella hair straightener brush,dona hair straightener pro,furiden hair straightener stem,reverse hair dryer straightener,hair straightener brush ceramic heating,nume megastar hair straightener,hair straightener brush revlon,dyson hair straightener brush,vkk hair straightener brush,anti static ceramic hair straightener,hair straightener flat iron mkboo,voltage converter for hair straightener,hair straightener brush for men,salon professional steam hair straightener,best flat iron hair straightener,heat mat for hair straightener,best hair straightener and curler,hair comb dryer straightener,lagrange hair straightener,micropure enhanced hair straightener brush,men curly hair straightener,small best hair straightener,' +
    'travel hair straightener brush,emocci hair straightener,wide hair straightener ceramic,le vite hair brush straightener,home styling steam hair straightener,professional ceramic tourmaline hair straightener,multifunctional hair comb beard straightener,tymo ring hair straightener comb,short hair straightener comb,hair straightener curling brush,perfessional hair straightener,short hair comb straightener,elly\'s professional steam hair straightener,travel hair straightener and curler,hair straightener iron for women,hair straightener and curler brush,hair curling iron and straightener,hair dryer and straightener holder,natural hair straightener iron,tyme hair straightener and curler,jack and jillian hair straightener,double ionic hair straightener brush,multifunctional hair comb & beard straightener,hair straightener and curler tyme,auto shut off hair straightener,fast heating hair straightener brush,ceramic flat iron hair straightener,best hair straightener treatment,paddle brush hair straightener,chi hair straightener products,2 in 1 hair straightener,small straightener for short hair,hair straightener curler wand,pink hair straightener comb,pink hair brush straightener,hair styler curler and straightener,hair brush straightener for women,hair dryer and straightener set,flat iron brush hair straightener,professional electric hair straightener & curler,cordless straightener for hair,heat protector for hair straightener,ceramic hair straightener flat iron,electric hot comb hair straightener,flat iron comb hair straightener,pro straightener for hair,natural hair straightener oil,eva nyc hair straightener,hair iron straightener and curler,straightener brush for thick hair,travel hair straightener dual voltage,ceramic hair straightener wide,loop hair straightener,felt hair straightener,gk hair straightener,hair straightener silver,hair straightener toy,hair straightener charger,hair straightener tiny,hair straightener luxury,hair straightener wow,hair straightener humidity,embroidered hair straightener,hollywood straightener hair,humidifiers hair straightener,hair straightener compact,hair straightener iridescent,hair straightener tonic,hair straightener matte,hair straightener min,hair straightener 4,hair straightener agave,case hair straightener,seam hair straightener,concave hair straightener,think hair straightener,hair straightener gentle,hair straightener tween,hair straightener pattern,hair straightener 59,hair straightener cup,hair straightener band,retractable hair straightener,hair straightener shield,france hair straightener,converter hair straightener,sarah hair straightener,risk hair straightener,sea hair straightener,3t hair straightener,evaluation hair straightener,dodo hair straightener,life hair straightener,press hair straightener,set hair straightener,cheer hair straightener,pouch hair straightener,protein straightener hair,dc hair straightener,25 hair straightener,guru hair straightener,hair straightener africa,hair straightener narrow,hair straightener spain,bionic hair straightener,infuser hair straightener,royce hair straightener,traveler hair straightener,hair straightener changeable,tech hair straightener,straightener hair art,upgraded hair straightener,multi hair straightener,hair straightener eu,hair straightener circular,hair straightener avocado,hair straightener orange,hair straightener girls,hair straightener go,swiss hair straightener,kingdom straightener hair,adjustable hair straightener,straightener natural hair,teeth hair straightener,cat hair straightener,hair straightener sally,hair small straightener,gps hair straightener,hair titanium straightener,hair straightener oak,hair straightener plated,fragile hair straightener,bestseller hair straightener,hair straightener prime,hair straightener led,sh hair straightener,thermostat hair straightener,shirt hair straightener,foxy hair straightener,sidekick hair straightener,hair straightener purple,hair straightener box,epic hair straightener,free hair straightener,hair straightener plate,camouflage hair straightener,angled hair straightener,onyx hair straightener,commercial hair straightener,joy hair straightener,rush hair straightener,hair straightener wrap,hair straightener pack,hair straightener man,hair straightener greece,hair ionic straightener,straightener hair mini,unplugged hair straightener,straightener clips hair,beveled hair straightener,ocean hair straightener,watts hair straightener,hair straightener adjustable,hair straightener disney,hair straightener blush,hair straightener stuff,hair straightener urban,hair straightener sparkly,hair straightener leopard,hair straightener silicone,hair straightener cooling,hair straightener clamp,hair straightener brash,af hair straightener,airless hair straightener,hair straightener purse,lioness hair straightener,phillips hair straightener,waving hair straightener,ct hair straightener,steamed hair straightener,purse hair straightener,hair straightener skinny,hair straightener mix,hair straightener ethnic,hair straightener waterproof,hair straightener bristle,course hair straightener,hair straightener foam,hair straightener inch,hair straightener mist,straightener hair gel,hair straightener hat,hair straightener cap,hair straightener medium,hair straightener large,hair straightener glider,hair straightener stream,ch hair straightener,soled hair straightener,in hair straightener,teresa hair straightener,hold hair straightener,humidity hair straightener,product hair straightener,straightener cares hair,adapter hair straightener,hair straightener voltage,hair drying straightener,traveling hair straightener,pi hair straightener,auto hair straightener,energy hair straightener,hair straightener air,cheetah hair straightener,hair straightener less,ava hair straightener,juicy hair straightener,wax hair straightener,unix hair straightener,velocity hair straightener,universal hair straightener,bosch hair straightener,hair straightener round,hair straightener holster,hair straightener pakistan,color hair straightener,hair straightener nyc,g3 hair straightener,steaming hair straightener,hair straightener pin,hair straightener hd,hair straightener put,hair straightener rounded,hair straightener floral,clearance hair straightener,ph hair straightener,hair straightener cold,hair straightener kiss,hair straightener bespoke,carly hair straightener,vortex hair straightener,luxury hair straightener,bullet hair straightener,dream hair straightener,hamilton hair straightener,miniature hair straightener,j2 hair straightener,hair straightener hanger,hair straightener black,beginner hair straightener,lg hair straightener,t2 hair straightener,design hair straightener,german hair straightener,solid hair straightener,simple hair straightener,hair auto straightener';
  	var array = str.split(',');
  	const {textArea = '[]'} = this.state;
  	const data = JSON.parse(textArea);
  	console.log(data);

  	return <div className="amazon-test">
  		  <TextArea onChange={(e) => {
  			this.setState({
  			  textArea: e.target.value
  		  });
  		}} rows={4} />

  		<Button style={{margin: '16px 0'}} type="primary" onClick={() => {
  						const type = 'xlsx';
  						var elt = document.getElementById('keyword-table');
  						var wb = XLSX.utils.table_to_book(elt, {sheet: 'Sheet JS'});
  						return XLSX.writeFile(wb, ('keyword.' + (type || 'xlsx')));
  						}}>导出</Button>

  		   <Table bordered={true} id="keyword-table" size="small" pagination={false} dataSource={data} columns={this.getColumns()} />

  	</div>;
  }
}
export default Logon;
