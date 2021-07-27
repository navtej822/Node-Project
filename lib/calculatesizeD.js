const {execSync} = require('child_process');

const calculateSizeD = itemFullStaticPath => {
  //escape spaces, tabs etc.
  const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\s/g,'\ ');

  const commandOutput = execSync(`du -sh "${itemFullStaticPathCleaned}"`).toString();
  //console.log(result);
  //remove all spaces, tabs, etc
  let filesize = commandOutput.replace(/\s/g,'');
  //splt filesize using the '/' separator
  filesize = filesize.split('/');
  //humansize is the first item of the array
  filesize = filesize[0];
  

  //unit
  const filesizeUnit = filesize.replace(/\d|\./g,'');

  //size number
  const filesizeNumber = parseFloat(filesize.replace(/[a-z]/i,''));


  //B 10B -> 10  K 10K -> 10*1000  M 10M -> 10*1000*1000 G 10G -> 10*1000*1000*1000  T 10T -> 10*1000*1000*1000*1000
  const units = "BKMGT";

  const filesizeBytes = filesizeNumber * Math.pow(1000, units.indexOf(filesizeUnit));
  return[filesize,filesizeBytes];
};

module.exports = calculateSizeD;
