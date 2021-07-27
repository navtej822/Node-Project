//import modules
const fs = require('fs');
const path = require('path');

//files
const calculateSizeD = require('./calculateSizeD.js');

const calculateSizeF = require('./calculateSizeF.js');
const buildMainContent = (fullStaticPath, pathname) => {
  let mainContent = '';
  let items;
  //loop through the elements inside the folder

  try{
     items = fs.readdirSync(fullStaticPath);
    console.log(items);
  }catch(err){
   console.log(`${err}`);
   return `<div class = "alert alert-danger">Internal Server Error</div>`;
  }

  //get the following elements for each item:
  items.forEach(item => {
    //store item details in object
    let itemDetails = {};
    //Name
    itemDetails.name = item;
    //link of the item
    const link = path.join(pathname,item);
    const itemFullStaticPath = path.join(fullStaticPath,item);
    try{
       itemDetails.stats = fs.statSync(itemFullStaticPath);
    }catch(err){
      console.log(`statSync error: ${err}`);
      mainContent = `<div class = "alert alert-danger">Internal Server Error</div>`;
      return false;
    }

    if(itemDetails.stats.isDirectory()){
          itemDetails.icon = '<ion-icon name = "folder"></ion-icon>';
          [itemDetails.size, itemDetails.sizeBytes] = calculateSizeD(itemFullStaticPath);
    }else if(itemDetails.stats.isFile()){
          itemDetails.icon = '<ion-icon name ="document"></ion-icon>';
          [itemDetails.size, itemDetails.sizeBytes] = calculateSizeF(itemDetails.stats);
    }
    //give the unix time stamp
    itemDetails.timeStamp = parseInt(itemDetails.stats.mtimeMs);
    //convert timestamp to a date
    itemDetails.date = new Date(itemDetails.timeStamp);
    itemDetails.date = itemDetails.date.toLocaleString();




    mainContent += `     <tr data-name = "${itemDetails.name}" data-size = "${itemDetails.sizeBytes}" data-time = "${itemDetails.timeStamp}">
      <td>${itemDetails.icon}<a href = ${link}>${item}</a></td>
      <td>${itemDetails.size}</td>
      <td>${itemDetails.date}</td>
      </tr>`

  });

       //name

       //size
       //lat Modified



    return mainContent;
};

module.exports = buildMainContent;
