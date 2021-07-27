//mode modules
const url = require('url');
const path = require('path');
const fs = require('fs');
//file imports
const buildBreadcrumb = require('./breadcrumb.js');
const buildMainContent = require('./mainContent.js');
const getMimeType = require('./getMimeType.js');

//static base path - location of the static folder
const staticBasePath = path.join(__dirname,'..','static');

const respond = (request, response) => {
    //response.write('respond func fires');
    //response.end();

    //get the path Name and decode it

    let pathname = url.parse(request.url, true).pathname;
    if(pathname === '/favicon.ico'){
      return false;
    }
    //console.log(pathname);
    //console.log(decodeURICompoonent(pathname));
    pathname = decodeURIComponent(pathname);
    console.log(pathname);

    //get the corresponding full static path located in the static folder
    const fullStaticPath = path.join(staticBasePath,pathname);
    //search the path inside static folder
    if(!fs.existsSync(fullStaticPath)){
      console.log(`${fullStaticPath} does not exist`);
      response.write(`404 : ${fullStaticPath} File not Found!`);
      response.end();
      return false;
    }
    let stats;
    try{
      stats = fs.lstatSync(fullStaticPath);
    }
    catch(err){
      console.log(`lstatSync Error : ${err}`);
    }


    if(stats.isDirectory()){
      //get content from index.html
      let data = fs.readFileSync(path.join(staticBasePath,'project_files/index.html'),'utf-8');
      //build the page title
      let pathElements = pathname.split('/').reverse();

      pathElements = pathElements.filter(element => element !== '');
      const folderName = pathElements[0];



      //build the breadcrumb
      const breadcrumb = buildBreadcrumb(pathname);

      //build table rows
      const mainContent = buildMainContent(fullStaticPath,pathname);

      //fill the tempelate
      data =data.replace('page_title',folderName);
      data = data.replace('pathname',breadcrumb);
      data = data.replace('mainContent',mainContent);
      //print data to the webpage
      response.statusCode =200;
      response.write(data);

      return response.end();
    }
    if(!stats.isFile()){
      respond.status = 401;
      response.write('401: Access Denied');
      return response.end();
    }

    //get the file extention
    let fileDetails = {};
    fileDetails.extname = path.extname(fullStaticPath);

    let stat;
    try{
       stat = fs.statSync(fullStaticPath);
    }catch(err){
      console.log(`err: ${err}`)
    }
    fileDetails.size = stat.size;

    getMimeType(fileDetails.extname).then(mime => {
      //store headers here
      let head = {};
      let options = {};
      //response status code
      let statusCode = 200;

      //set "content-type " header
      head['Content-Type'] = mime;

      //pdf  in browser
      if(fileDetails.extname === 'pdf'){
        head['Content-Disposition']= 'inline';
        //head['Content-Disposition']= 'attachment;filename = file.pdf';

      }
      // this is streaming with chunks ran into a problem with this
      // audio/video files
      // if(RegExp('audio').test(mime) ||RegExp('video').test(mime)){
      //   //headers
      //   head['Accept-Ranges'] = 'bytes';
      //   const range = request.headers.range;
      //   console.log(range);
      //   if(range){
      //     //bytes 0-end
      //     const start_end = range.replace(/bytes=/,"").split('-');
      //     console.log(start_end);
      //     const start = parseInt(start_end[0]);
      //     const end = start_end[1]? parseInt(start_end[1]) : fileDetails.size - 1;
      //     //headers
      //     //Content-Range
      //     //filesize
      //
      //     head['Content-Range'] = `bytes
      //     ${start} - ${end}/${fileDetails.size}`;
      //     //Content-Length
      //     head['Content-Length'] = end - start +1;
      //     statusCode =206;
      //     options = {start , end};
      //   }
        // }







      //other file




      //reading the file using fs.readFile
    /*  fs.promises.readFile(fullStaticPath,'utf-8').then(data => {
        response.writeHead(statusCode, head);
        response.write(data);
        return response.end();
      })
      .catch(error =>{
        response.statusCode =404;
        response.write('404:File reading error!');
        return response.end();
      }); */
      //streaming method
      const fileStream = fs.createReadStream(fullStaticPath,options);

      //stream chunks to your response object
      response.writeHead(statusCode, head);
      fileStream.pipe(response);

      //events: close and error
      fileStream.on('close', () =>{
        return response.end();
      });
      fileStream.on('error', error =>{
        response.statusCode =404;
        response.write('404:File stream error!');
        return response.end();
      });

    }).catch(err =>{
      response.statusCode = 500;
      response.write('500: Internal Server Error');
      return response.end();
    })





}






module.exports = respond;
