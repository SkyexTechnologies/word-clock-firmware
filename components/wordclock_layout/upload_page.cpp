#include "wordclock_layout.h"

namespace esphome {
namespace wordclock_layout {

// The page reads a design file from the designer (format 2, with optional
// special_words, as scripts/provision_layout.py) and sends it as a version 3
// LayoutBlob with hardware_revision 0.
const char UPLOAD_PAGE_HEAD[] PROGMEM = R"HTML(<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Word Clock layout</title>
<style>
body{font-family:system-ui,sans-serif;max-width:34rem;margin:2rem auto;padding:0 1rem;line-height:1.5;color:#222;background:#fff}
@media(prefers-color-scheme:dark){body{color:#eee;background:#181818}}
h1{font-size:1.4rem}.closed,.err{color:#c62828}.ok{color:#2e7d32}
button{font:inherit;padding:.4rem 1rem;margin-top:1rem}
</style></head><body>
<h1>Upload a layout</h1>
<p>Choose the design file (<code>.json</code>) you made with the letter grid designer. The clock
keeps its settings and restarts to show the new layout.</p>
)HTML";

const char UPLOAD_PAGE_TAIL[] PROGMEM = R"HTML(<input type="file" id="f" accept=".json,application/json">
<p id="info"></p>
<button id="b" disabled>Upload</button>
<p id="msg" role="status"></p>
<p><a href="/">Back to the clock</a></p>
<script>
var blob=null,$=function(i){return document.getElementById(i)};
function crc32(u){var c,t=[],n,k,r=-1;for(n=0;n<256;n++){c=n;for(k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c}
for(n=0;n<u.length;n++)r=t[(r^u[n])&255]^(r>>>8);return(r^-1)>>>0}
function isInt(v,a,b){return typeof v==='number'&&v%1===0&&v>=a&&v<=b}
function build(d){
if(!d||d.version!==2)throw'This is not a word clock design file (format 2).';
var ind=d.indications,nh=d.next_hour,w=d.words,rev=d.layout_revision===undefined?0:d.layout_revision;
if(!isInt(rev,0,65535))throw'layout_revision must be a number from 0 to 65535.';
if(!ind||typeof ind.it_is!=='boolean'||typeof ind.minutes!=='boolean'||typeof ind.weekdays!=='boolean')throw'The indications are missing.';
if(!Array.isArray(nh)||nh.length!==12)throw'next_hour must have 12 values.';
if(!Array.isArray(w)||w.length!==49)throw'The file must have 49 word rows.';
var b=new ArrayBuffer(1320),v=new DataView(b),u=new Uint8Array(b),m=0,i,j,k,row,sp=d.special_words||[];
v.setUint32(0,0x574C4B31,true);v.setUint8(4,3);v.setUint8(5,0);
v.setUint8(6,(ind.it_is?1:0)|(ind.minutes?2:0)|(ind.weekdays?4:0));
for(i=0;i<12;i++)if(nh[i])m|=1<<i;
v.setUint16(8,m,true);v.setUint16(10,rev,true);
for(i=0;i<49;i++){
if(!Array.isArray(w[i]))throw'Row '+i+' is not a list of LEDs.';
row=w[i].filter(function(l){return l!==-1});
if(row.length>24)throw'Row '+i+' has more than 24 LEDs.';
for(j=0;j<24;j++){if(j<row.length&&!isInt(row[j],0,120))throw'Row '+i+' has an invalid LED number.';v.setInt8(12+i*24+j,j<row.length?row[j]:-1)}}
if(!Array.isArray(sp)||sp.length>4)throw'special_words must be a list of up to 4 words.';
for(i=0;i<4;i++){var s=sp[i]||{leds:[],dates:[]},sl=(s.leds||[]).filter(function(l){return l!==-1}),sd=s.dates||[];
if(sl.length>24||sd.length>4)throw'Special word '+(i+1)+' has too many letters or dates.';
for(j=0;j<24;j++){if(j<sl.length&&!isInt(sl[j],0,120))throw'Special word '+(i+1)+' has an invalid LED number.';v.setInt8(1188+i*24+j,j<sl.length?sl[j]:-1)}
for(k=0;k<4;k++){var md=k<sd.length?/^(\d\d)-(\d\d)$/.exec(sd[k]):null;if(k<sd.length&&!md)throw'Special word '+(i+1)+' has an invalid date (MM-DD).';
v.setUint8(1284+i*8+k*2,md?+md[1]:0);v.setUint8(1285+i*8+k*2,md?+md[2]:0)}}
v.setUint32(1316,crc32(u.subarray(0,1316)),true);
return{data:b,rev:rev}}
function say(t,c){var e=$('msg');e.textContent=t;e.className=c||''}
$('f').onchange=function(){blob=null;$('b').disabled=true;$('info').textContent='';say('');
var file=this.files[0];if(!file)return;file.text().then(function(t){
var r=build(JSON.parse(t));blob=r.data;$('b').disabled=false;
$('info').textContent='Design: '+(JSON.parse(t).name||file.name)+', layout revision '+r.rev+'.';
}).catch(function(e){say(typeof e==='string'?e:'This file could not be read as a design file.','err')})};
$('b').onclick=function(){if(!blob)return;$('b').disabled=true;say('Uploading...');
fetch('/layout',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:blob})
.then(function(r){return r.text().then(function(t){say(t,r.ok?'ok':'err');if(!r.ok)$('b').disabled=false})})
.catch(function(){say('The clock did not answer. Check that you are on the same network.','err');$('b').disabled=false})};
</script></body></html>
)HTML";

}  // namespace wordclock_layout
}  // namespace esphome
