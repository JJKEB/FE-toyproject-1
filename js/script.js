// const accountDetail = document.querySelector('.account-detail');
// document.addEventListener('click',function (ev) {
//     accountDetail.style.top = ev.clientY - 50 + 'px';
//   }, false
// );
//

/*http://jjkeb.dothome.co.kr/bank.json*/
// fetch('../json/bank.json', {
// 	headers: {
// 		'Accept': 'application/json'
// 	}
// })
// 	.then((res) => res.json())
// 	.then( obj => console.log(obj))

/*
fetch('http://jsonplaceholder.typicode.com/photos/')
fetch("../json/bank.json")
  .then( res => res.json() )
  .then( obj => {
		start(obj)
		console.log(obj)
	})
*/
// function start(photos){
// 	console.log(photos)
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


class Util {
  constructor(first, last) {
    this.firstName = first
    this.lastName = last
  }
  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
	classToggle(target, trigger, className = 'active'){
		const targetEl = document.querySelector(target)
		const triggerEl = document.querySelector(trigger)
		let isHidePromotion = false
		triggerEl.addEventListener('click', function () {
			(targetEl.classList.contains(className) && isHidePromotion === false) ? isHidePromotion = true : '';
			isHidePromotion = !isHidePromotion
			if (isHidePromotion) {
				targetEl.classList.add(className)
			} else {
				targetEl.classList.remove(className)
			}
		})
	}
	getType(data) {
		return Object.prototype.toString.call(data).slice(8, -1)
	}
}
class Util2 extends Util {
	constructor(first, last, gender){
		super(first, last)
		this.gender = gender
	}
}
const util = new Util('class 를 사용한', 'javascript class')

util.classToggle('.account-detail','.event-detail-toggle')




const xhr = new XMLHttpRequest();

xhr.open('GET', '../json/bank.json', true);

xhr.send();

if (xhr.status === 200) {
	console.log(xhr, xhr);
}







import jsonBank from "../json/bank.json";
/*console.log(jsonBank)
console.log(jsonBank.bankList)
console.log(jsonBank.bankList.length)*/

/*jsonBank.bankList.forEach(function(aa, bb){
	console.log(bb)
	console.log(aa)
})*/

class AccountManagement {
	constructor(first, last) {
    this.firstName = first
    this.lastName = last
		this.today = null
  }
	init() {
		const date = new Date();
		this.today = `${date.getFullYear()}${(date.getMonth()+1)}${date.getDate()}`

		// console.log(this.today.getUTCDate())
		// console.log(this.today.getDay())
		// console.log(this.today.getUTCFullYear())
		// console.log(this.today.getUTCMonth())
		// console.log(this.today.getUTCDay())
	}
	getData() {

	}
}

const accountManagement = new AccountManagement('class 를 사용한', 'javascript class')

accountManagement.init()





// console.log(util.getFullName())
// console.log(util)


/*console.log(util.getType(jsonBank.bankList))*/


const accountDetail = document.querySelector('.account-detail')
const usageHistory = document.querySelector('.account-detail__usage-history')
usageHistory.addEventListener('scroll', function(){
	(this.offsetHeight + this.scrollTop >= this.scrollHeight) ? accountDetail.classList.add('active') :'';
})


//
// if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
//     scrolledToBottom(e);
//   }















