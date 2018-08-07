const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

let drinksURL = "http://www.womai.com/ProductList.htm?id=6701&&Cid=6701&&mid=0&&cityid=31000&page";
let drinks = [];

const creatData = async() => {
  const textArr = await fectchAll();
  for(let i =0; i < textArr.length; i ++){
    const $ = cheerio.load(textArr[i]);
    $('.tab-content').each(((index,element)=>{
      let item = {};
      const title = $(element).find('.list-title>p').attr('title');
      if(title.indexOf('整箱') !== -1 
        || title.indexOf('*') !== -1 
        || title.indexOf('连包') !== -1){
      return 
      }
      item.title = title;
      item.img = $(element).find('.pImg>a>img').attr('original');
      drinks.push(item);
    }))
  }
  const drinksJson = JSON.stringify(drinks);
  fs.writeFile(path.join(__dirname,'../drinks.txt'),drinksJson,function(err){
    if(err) console.log(err)
    else console.log('write success')
  })
}

const fectchAll = async() => {
  return new Promise(async(resolve)=>{
    let textArr = [];
    for(let i = 1; i <= 4; i ++){
      const url = drinksURL + i;
      const res = await fetchData(url);
      textArr.push(res);
    }
    resolve(textArr)
  })
}

const fetchData = (url) => { 
  return new Promise((resolve)=>{
    superagent.get(url)
      .charset()
      .end((err,res)=>{
        if(res.status ==200){
          resolve(res.text)
        }
        if(err){
          reject(console.log(err))
        }
      }) 
  })
}

module.exports = {
  creatData
}