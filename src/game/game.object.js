// Base on ECMAScript 2015
// 置物盒子
class Box {
	constructor() {
		this.box = new Array();
	}
	// 尾部添加
	add(item){ 
		if(!item)console.log('Error:Undefined Item Added!');
		else this.box.push(item);
	}
	// 头部添加
	push(item){ 
		if(!item)console.log('Error:Undefined Item Pushed!');
		else this.box.unshift(item);
	}
	// 指定位置添加
	addTo(item,index){
		if(!item)console.log('Error:Undefined Index-Item Added!');
		else this.box.splice(index,0,item);
	}
	// 移除
	remove(item){
		for(var i=0;i<this.box.length;i++){
			if(this.box[i]==item){
				this.box.splice(i,1);
			}
		}
	}
	// (定序)交换
	switchItem(fr,to){
		var temp = this.box[to];
		this.box.splice(to,1,this.box[fr]);
		this.box.splice(fr,1,temp);
	}
	// 替换
	replace(item_old,item_new){
		var index = this.findItem(item_old);
		this.indexReplace(index,item_new);
	}
	// 定序替换
	indexReplace(index,item_new){
		if(index==-1)console.log('Error:Item To Be Repalced Not Contained!');
		else this.box.splice(index,1,item_new);
	}
	// 查找
	findItem(item){
		for(var i=0;i<this.box.length;i++){
			if(this.box[i]==item) return i;
		}
		return -1;
	}
	// 是否包含
	contain(item){
		return this.findItem(item)!=-1;
	}
	// 随机打乱
	shuffle(){
		this.box.sort((a,b) => Math.random()>0.5?-1:1);
	}
	// 清空
	clean(){
		this.box.splice(0,this.box.length);
	}
	// 尺寸
	size(){
		return this.box.length;
	}
	// 输出盒中内容
	log(){
		console.log(this.box);
	}
}

// 战斗框
class BattleBox extends Box{
	constructor(boxAry) {
		super();
		this.tiles = boxAry? boxAry.length : 6;
		this.box = boxAry;
	}
	calculate(){
		var firstNum=0,secondNum=0;
		var base = this.tiles/2;
		for(var i=0;i<base;i++){
			firstNum *= 10;
			firstNum += this.box[i];
			secondNum *= 10;
			secondNum += this.box[i+base];
		}
		if(gp_store.state.debug)console.log(firstNum,secondNum);
		return firstNum-secondNum;
	}
	clean(){
		super.clean();
		for(var i=0;i<this.tiles;i++)this.box.push(undefined);
	}
}

// 冒险区域
class Wilderness{
	constructor(name,num,construct,component,treasure,track,monsters,events,tiles) {
		this.name = name || '未知区域';
		this.num = num || '未知编号';
		this.construct = construct || '未知装置';
		this.component = component || '未知组件';
		this.treasure = treasure || '未知宝物';
		this.track = track || '未知时间轴'; // e.g: [0,-1,0,0,-1,0]
		this.monsters = monsters || '未知猛兽组';
		this.events = events || new Array();
		this.tiles = tiles || 6;
		this.step = 0;
	}
	addStep(){
		if(this.isOneDayPass()){ // 过了一天
			if(this.events.indexOf(EVENT_LIST[3])!=-1){
				safelyChangeDay(2); // '恶劣天气'
				info(app,'度过了2天');
			}
			else {
				safelyChangeDay(1);
				info(app,'度过了1天');
			}
		}
		this.step++;
	}
	isOneDayPass(){
		return this.track[this.step]==-1;
	}
	resetArea(){
		this.events = new Array();
		this.step = 0;
	}
	pickMonster(result){
		var monsterId = 0;
		if(100<=result && result <=199 || -1>=result && result >=-100) monsterId = 0;
		else if(200<=result && result <=299 || -101>=result && result >=-200) monsterId = 1;
		else if(300<=result && result <=399 || -201>=result && result >=-300) monsterId = 2;
		else if(400<=result && result <=499 || -301>=result && result >=-400) monsterId = 3;
		else if(500<=result && result <=555 || -401>=result && result >=-555) monsterId = 4;
		else monsterId = 4;
		if(this.events.indexOf(EVENT_LIST[0])!=-1) monsterId += 2; // ['活跃的怪物','短暂预视','好运气','恶劣天气'];
		return monsterId>4?this.monsters[4]:this.monsters[monsterId];
	}
}

// 怪物
class Monster{
	constructor(level,name,ATK,HIT,isSpirit){
		this.level = level || '未知等级';
		this.name = name || '未知名字';
		this.ATK = ATK || '未知攻击点';
		this.HIT = HIT || '未知命中点';
		this.isSpirit = isSpirit || false;
	}
	adjustATK(){
		var min = this.ATK[0];
		var max = inventory.state.tre_plat?this.ATK[1]-1:this.ATK[1];
		if(max<=0)max=1;if(min>max)min=max; // 最小值为1
		return [min,max];
	}
	adjustHIT(){
		var min = inventory.state.tre_shard?this.HIT[0]-1:this.HIT[0];
		var max = this.HIT[1];
		return [min,max];
	}
	isATK(dice){
		var range = this.adjustATK();
		return range[0]<=dice && dice<= range[1];
	}
	isHIT(dice){
		// 熔岩碎片 命中范围+1
		var range = this.adjustHIT();
		return range[0]<=dice && dice<= range[1];
	}
	isKing(){
		return this.level==5;
	}
	levelText(){
		return 'LvL '+this.level;
	}
	ATKText(){
		return this.ATK[0]+'-'+this.ATK[1];
	}
	adjustATKText(){
		var range = this.adjustATK();
		return range[0]+'-'+range[1];
	}
	HITText(){
		return this.HIT[0]+'-'+this.HIT[1];
	}
	adjustHITText(){
		var range = this.adjustHIT();
		return range[0]+'-'+range[1];
	}
}