class Util {
  constructor(first, last) {
    this.firstName = first
    this.lastName = last
  }
  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
	static classToggle(target, trigger, className = 'active'){
		const targetEl = document.querySelector(target),
					triggerEl = document.querySelector(trigger);
		let isHidePromotion = false
		triggerEl.addEventListener('click', function (e){
			e.preventDefault();
			(targetEl.classList.contains(className) && isHidePromotion === false) ? isHidePromotion = true : '';
			isHidePromotion = !isHidePromotion;
			(isHidePromotion) ? targetEl.classList.add(className) : targetEl.classList.remove(className);
		});
	}
	static getType(data) {
		return Object.prototype.toString.call(data).slice(8, -1)
	}
}
class Util2 extends Util {
	constructor(first, last, gender){
		super(first, last)
		this.gender = gender
	}
}

Util.classToggle('.account-detail','.event-detail-toggle')


// function start(jsonObj){
// 	console.log(jsonObj)
//
//   // const ulEl = document.createElement('ul')
//   // document.querySelector('#app').appendChild(ulEl)
//   // for (let i = 0; i < 100; i++) {
//   //   const liEl = document.createElement('li')
//   //   const imgEl = document.createElement('img')
//   //   const pEl = document.createElement('p')
// 	//
//   //   imgEl.src = photos[i].thumbnailUrl;
//   //   pEl.textContent = photos[i].title;
//   //   liEl.appendChild(imgEl)
//   //   liEl.appendChild(pEl)
//   //   ulEl.appendChild(liEl)
//   // }
// }
//


// 왜 ?
// 이렇게 조회했던 변수 값이 언제까지 메모리에 남아있는지? 필요없어진 데이터는 어떻게 삭제해야 할지


/**
 *
 */
class AccountManagement {
	constructor(startLoadDay = 5) {
		this.today = null									// 실제 현재 날자
		this.dummyToday = '20210901'			// 테스트용 오늘 날자
		this.jsonData = null							// json data
		this.accountData = {}							// 조회한 데이터 경과일 기준으로 담을 객체
		this.limitLoadDay = startLoadDay	// 한번에 로드 할 일수
		this.loadedDay = 0								// 로드한 일수
		this.restData = []								// 로드 되고 남은 데이터
		this.loadEnd = false              // 데이터가 모두 로드 됬는지 확인

		this.getData()
  }
	init(obj) {
		const __this = this;
		__this.jsonData = Object.assign([],obj.bankList)
		const date = new Date();
		__this.today = `${date.getFullYear()}${(date.getMonth()+1)}${date.getDate()}`
		__this.createInOutList(__this.dayDivide(__this.limitLoadDay));
	}

	/*
	* json data GET
	*/
	getData() {
		const __this = this;
		fetch(`https://gist.githubusercontent.com/JJKEB/487abda234027d1f7e1e9952e051c99b/raw/1e3ee532bb83de1b164aa2f8b04c62db0b66b6c8/Team3_ToyProject1.json`)
			.then(res => res.json())
			.then(obj => {
				__this.init(obj)
			})
	}

	/*
	* param => pastDate : 가져올 일수
	* return - 가져온 날자들의 데이터 혹은 undefined
	* ※ this.restData : 가져오고 남은 데이터 재할당
	* ※ this.loadedDay : 로드되어진 총 일수 재할당
	*/
	dayDivide(pastDate) {
		const __this = this;
		let result = null;			// 조회데이터 담을 변수
		let restDataTemp = [];	// 남은데이터 담을 변수
		let zeroNum = null;			// restData 키 0 도우미
		let remaind = false;

		if (!__this.loadEnd) {
			__this.loadedDay += pastDate;	// 조회했던 일수 + 추가 조회할 일수 = 실제 조회 되는 일수
			(!__this.restData.length) ? filterFn(__this.jsonData) : filterFn(__this.restData);	// 저장되어있는 데이터가 있는지 확인후 data 지정

			/* ------ 필터링 함수 ------ */
			function filterFn(searchData){	// 조회후 가져올 일수 만큼만 반환
				result = searchData.filter(function(obj){
					const elapsedDays = obj.date.replaceAll('-','') - __this.dummyToday;  // 설정된 오늘 로부터의 경과일
					// 필터링 조건 일치하지 않음
					if (elapsedDays >= __this.loadedDay) {
						// 필터링 조건 값이 아니면서 필터링 조건과 일치 하는 값이 있을때  - 확인은 remaind 변수로 함
						if (!remaind) {
							restDataTemp.push(obj)
						// 필터링 조건 값이 아니면서 필터링 조건과 일치 하는 값이 없을때
						} else {
							__this.loadEnd = true;
							accountAddFn(obj, elapsedDays, zeroNum)
							restDataTemp = [];
						}
					// 필터링 조건 일치
					} else {
						accountAddFn(obj, elapsedDays, zeroNum)
					}
					return elapsedDays < __this.loadedDay;
				});
			}

			/* 날자 별로 구분하여 객체에 _elapsedDays 키 값을 부여하고 __this.accountData 데 담음 */
			function accountAddFn(dataObj, dayNum, index){
				dataObj._elapsedDays = dayNum
				if (__this.accountData[dayNum] === undefined && zeroNum !== 0) {
					index = 0
					__this.accountData[dayNum] = []
				}
				__this.accountData[dayNum][index] = dataObj
				index++
			}

			// 결과 값이 없고, 저장된 데이터는 있을때 남은 데이터로 filterFn 재실행
			if (result.length === 0 && __this.restData.length > 0) {
				remaind = true;
				filterFn(__this.restData)
			}
			__this.restData = restDataTemp;  // 남은 데이터 재 저장
		}
		//console.log('경과일 기준 저장데이터 : ', __this.accountData)
		//console.log('원본 데이터 : ', __this.jsonData)
		//console.log('현재까지 조회한 일수 : ', __this.loadedDay)
		//console.log('필터링 일치 데이터 : ', result)
		//console.log('조회하고 남아 별도 저장된 결제 데이터 : ', __this.restData)
		return __this.accountData;
	}

	createInOutList(obj) {
		console.log(obj)

		let listContainer = document.querySelector('.account-detail__usage-history > .inner')

		console.log(listContainer)

		const itemWrap = makeEl('div','day-history-wrap')
		const topEl = makeEl('div','history-top')
		const listEl = makeEl('ul','list-used')

		console.log(itemWrap)
		console.log(topEl)
		console.log(listEl)

		function makeEl(tagName, className) {
			const madeEl = document.createElement(tagName)
						madeEl.className = className
			return madeEl;
		}





		/* <div class="day-history-wrap">
			<div class="history-top">
				<strong class="when">오늘</strong>
				<span class="total-amount-used">127,600원 지출</span>
			</div>
			<ul class="list-used">
				<li>
					<span class="where">미스터피자</span>
					<span class="price">32,000</span>
				</li>
				<li>
					<span class="where">미스터피자</span>
					<span class="price">32,000</span>
				</li>
				<li>
					<span class="where">미스터피자</span>
					<span class="price income">+ 32,000</span>
				</li>
			</ul>
		</div> */
	}
}

const accountManagement = new AccountManagement()

// console.log(util.getFullName())
// console.log(util)
document.querySelector('.account-name').addEventListener('click', function(){
	console.log('리턴 받은 데이터 : ', accountManagement.dayDivide(8))
	console.log('종료 됬나? : ', accountManagement.loadEnd)
	console.log('--------------------------------------------------------------')
})

const accountDetail = document.querySelector('.account-detail')
const usageHistory = document.querySelector('.account-detail__usage-history')
usageHistory.addEventListener('scroll', function(){
	(this.offsetHeight + this.scrollTop >= this.scrollHeight) ? accountDetail.classList.add('active') :'';
})


