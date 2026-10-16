// Loads the pure <script id="sim"> block out of index.html, so node tools run the exact game code.
const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const src=html.match(/<script id="sim">([\s\S]*?)<\/script>/)[1];
const box={module:{exports:{}}};
vm.runInNewContext(src,box);
module.exports=box.module.exports;
