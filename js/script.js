// const accountDetail = document.querySelector('.account-detail');
// document.addEventListener('click',function (ev) {
//     accountDetail.style.top = ev.clientY - 50 + 'px';
//   }, false
// );

fetch('http://jsonplaceholder.typicode.com/photos/')
  .then( res => res.json() )
  .then( obj => { start(obj) } )

function start(photos){

	console.log(photos)

  /*const ulEl = document.createElement('ul')
  document.querySelector('#app').appendChild(ulEl)

  for (let i = 0; i < 100; i++) {
    const liEl = document.createElement('li')
    const imgEl = document.createElement('img')
    const pEl = document.createElement('p')

    imgEl.src = photos[i].thumbnailUrl;
    pEl.textContent = photos[i].title;
    liEl.appendChild(imgEl)
    liEl.appendChild(pEl)
    ulEl.appendChild(liEl)
  }*/
}