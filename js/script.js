class Util {
  constructor() {}
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

Util.classToggle('.account-detail','.event-detail-toggle')

// 왜 ?
// 이렇게 조회했던 변수 값이 언제까지 메모리에 남아있는지? 필요없어진 데이터는 어떻게 삭제해야 할지


class AccountManagement {
	constructor(startLoadDay = 5) {
		//this.today = null														// 실제 현재 날자
		this.jsonData = null													// json data
		this.dummyToday = new Date('2021-09-01')			// 테스트용 오늘 날자
		this.limitLoadDay = startLoadDay							// 한번에 로드 할 일수
		this.accountData = {}													// 조회한 데이터 경과일 기준으로 담을 객체
		this.loadedDay = 0														// 로드한 일수
		this.restData = []														// 로드 되고 남은 데이터
		this.loadEnd = false              						// 데이터가 모두 로드 됬는지 확인
		this.listContainer = null											// 데이터를 뿌려줄 엘리먼트
		this.dayDivideEnd = false

		this.getData()
  }
	init(obj) {
		const __this = this;
		// 받아온 json data 저장
		__this.jsonData = Object.assign([],obj.bankList)

		// 날자 생성
		//const date = new Date();
		//__this.today = `${date.getFullYear()}${(date.getMonth()+1)}${date.getDate()}`

		// 컨테이너 생성
		__this.listContainer = document.querySelector('.account-detail__usage-history > .inner')
		// 초기 데이터 로드 및 생성
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

		if (!__this.dayDivideEnd) {
			__this.loadedDay += pastDate;	// 조회했던 일수 + 추가 조회할 일수 = 실제 조회 되는 일수
			(!__this.restData.length) ? filterFn(__this.jsonData) : filterFn(__this.restData);	// 저장되어있는 데이터가 있는지 확인후 data 지정

			/* ------ 필터링 함수 ------ */
			function filterFn(searchData){	// 조회후 가져올 일수 만큼만 반환
				result = searchData.filter(function(obj){

					const currentDate = new Date(obj.date),
								elapsedMSec = currentDate.getTime() - __this.dummyToday.getTime(),
								elapsedDays = elapsedMSec / 1000 / 60 / 60 / 24; // 경과일

					// 필터링 조건 일치하지 않음
					if (elapsedDays >= __this.loadedDay) {
						// 필터링 조건 값이 아니면서 필터링 조건과 일치 하는 값이 있을때  - 확인은 remaind 변수로 함
						if (!remaind) {
							restDataTemp.push(obj)
						// 필터링 조건 값이 아니면서 필터링 조건과 일치 하는 값이 없을때
						} else {
							__this.loadEnd = true;
							obj._elapsedDays = elapsedDays
							if (__this.accountData[elapsedDays] === undefined && zeroNum !== 0) {
								zeroNum = 0
								__this.accountData[elapsedDays] = []
							}
							__this.accountData[elapsedDays][zeroNum] = obj
							zeroNum++
							restDataTemp = [];
						}
					// 필터링 조건 일치
					} else {
						obj._elapsedDays = elapsedDays
						if (__this.accountData[elapsedDays] === undefined && zeroNum !== 0) {
							zeroNum = 0
							__this.accountData[elapsedDays] = []
						}
						__this.accountData[elapsedDays][zeroNum] = obj
						zeroNum++
					}
					return elapsedDays < __this.loadedDay;
				});
			}

			// 결과 값이 없고, 저장된 데이터는 있을때 남은 데이터로 filterFn 재실행
			if (result.length === 0 && __this.restData.length > 0) {
				remaind = true;
				filterFn(__this.restData)
			}
			__this.restData = restDataTemp;  // 남은 데이터 재 저장
		}

		// console.log('경과일 기준 저장데이터 : ', __this.accountData)
		// console.log('원본 데이터 : ', __this.jsonData)
		// console.log('현재까지 조회한 일수 : ', __this.loadedDay)
		// console.log('필터링 일치 데이터 : ', result)
		// console.log('조회하고 남아 별도 저장된 결제 데이터 : ', __this.restData)

		if (result !== null && result.length === __this.jsonData.length) {
			__this.dayDivideEnd = true;
			console.log('끝 -----------------------------------------------------------')
		}
		return __this.accountData;
	}

	createInOutList(obj) {
		const __this = this;
		const korDayName = ['오늘', '어제'];

		// 로드 되어진 일수 - 로드 했던 일수 = 생성 시작할 인텍스 값
		let addStartIndex =  __this.loadedDay - __this.limitLoadDay

		// 로드가 완료 되지 않았다면
		if (!__this.dayDivideEnd) {
			for (let i = addStartIndex; i < __this.loadedDay; i++) {
				if (obj[i] !== undefined) {
					const itemWrap = makeEl('div','day-history-wrap')
					const top = makeEl('div','history-top')
					const topWhen = makeEl('strong','when')
					const topTotalAmount = makeEl('span','total-amount-used')
					const listUsed = makeEl('ul','list-used')
					let whenText = ''
					let totalUsedMoney = 0
					if (i <= 1) {
						whenText = korDayName[i]
					} else {
						console.log(obj[i][0])
						whenText = obj[i][0].date;
					}
					topWhen.textContent = whenText
					for (let j = 0; j < obj[i].length; j++) {
						const listUsed_li = makeEl('li')
						const listUsed_li_where = makeEl('span','where')
						const listUsed_li_price = makeEl('span','price')
						listUsed_li_where.textContent = obj[i][j].history
						if (obj[i][j].income === 'in') {
							listUsed_li_price.classList.add('income')
							listUsed_li_price.textContent = `+ ${obj[i][j].price.toLocaleString('ko-KR')}`
						} else {
							listUsed_li_price.textContent = obj[i][j].price.toLocaleString('ko-KR')
							totalUsedMoney += obj[i][j].price;
						}
						listUsed_li.appendChild(listUsed_li_where)
						listUsed_li.appendChild(listUsed_li_price)
						listUsed.appendChild(listUsed_li)
					}
					topTotalAmount.textContent = `${totalUsedMoney.toLocaleString('ko-KR')}원 지출`;
					top.appendChild(topWhen)
					top.appendChild(topTotalAmount)
					itemWrap.appendChild(top)
					itemWrap.appendChild(listUsed)
					__this.listContainer.appendChild(itemWrap)
				}
			}
		} else {
			console.log('더이상 불러올 내역이 없습니다.')
		}
		function makeEl(tagName, className) {
			const madeEl = document.createElement(tagName)
			className ? madeEl.className = className : '';
			return madeEl;
		}
	}
}

const accountManagement = new AccountManagement();
const accountDetail = document.querySelector('.account-detail')
const usageHistory = document.querySelector('.account-detail__usage-history')
usageHistory.addEventListener('scroll', _.throttle(function () {
	if ((this.offsetHeight + this.scrollTop >= this.scrollHeight)) {
		accountManagement.createInOutList(accountManagement.dayDivide(accountManagement.limitLoadDay));
		accountDetail.classList.add('active')
	}
}, 300))
