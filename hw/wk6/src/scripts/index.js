'use strict';

if (module.hot) {
  module.hot.accept();
}

import 'babel-polyfill';
import '../styles/index.scss';
import '../styles/normalize.css';
import '../styles/skeleton.css';

let changeClassName = (elements) => {
  let index = 0;
  for(let i in elements) {
    let className = elements[i].className || "";
    if (elements[i].nodeType != Node.TEXT_NODE&&className.indexOf('show') == -1) {
      index = i;
      break;
    }
  }
  if (elements[index].className.indexOf('religion_button') == -1)
    elements[index].className = 'show';
  let count = 0;
  for(let i in elements) {
    if(elements[i].nodeType != Node.TEXT_NODE) count++;
  }
  
  if(index >= count) {
    // 沒了
    console.log('finish');
  } else {
    setTimeout(() => changeClassName(elements), 700);
  }
};

let clearChild = (elements) => {
  for(let i in elements) {
    let className = elements[i].className || "";
    if (elements[i].nodeType != Node.TEXT_NODE&&className.indexOf('show') >= 0) {
      elements[i].className = '';
    }
  }
};

//let element = document.getElementsByClassName('tab');
var ani = (element) => {
  console.log(element);
  let className = element.className || "";
  if (className.indexOf('hide') == -1 && className.indexOf('tab') !== -1 ) {
    clearChild(element.childNodes);
    changeClassName(element.childNodes);
  }
};

let tabs = document.getElementsByClassName('bgwb');

document.getElementById('scis').onclick = (e) => {
  let ele = e.target;
  document.getElementById('alice').className = '';
  document.getElementById('scis').className = 'selected';
  document.getElementById('tab1').className = 'tab';
  document.getElementById('tab2').className = 'tab hide';
  document.getElementById('badge_img').src = 'badge.png';
  ani(document.getElementById('tab1'));
};

document.getElementById('alice').onclick = (e) => {
  document.getElementById('scis').className = '';
  document.getElementById('alice').className = 'selected';
  document.getElementById('tab1').className = 'tab hide';
  document.getElementById('tab2').className = 'tab';
  document.getElementById('badge_img').src = 'badge2.png';
  ani(document.getElementById('tab2'));
};;

ani(document.getElementById('tab1'));