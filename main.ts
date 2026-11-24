import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(I).sort()){
 const P=readFileSync(join(I,id,'program.bin')),N=readFileSync(join(I,id,'input.bin'));
 let S=[],C=[],M=new Int32Array(256),pc=0,ip=0,out=[],ex=0,st=0;
 run:while(1){
  if(st>=1e6){ex=10;break}
  if(pc<0||pc>=P.length){ex=9;break}
  const o=P[pc],n=pc+(o==1?2:o==2?5:o>=48&&o<=51?3:1);
  if(n>P.length){ex=9;break}
  let im=0;
  if(o==1)im=P[pc+1]>127?P[pc+1]-256:P[pc+1];
  else if(o==2)im=P[pc+1]|P[pc+2]<<8|P[pc+3]<<16|P[pc+4]<<24;
  else if(o>=48&&o<=51)im=P[pc+1]|P[pc+2]<<8;
  st++;pc=n;
  const L=S.length,so=im>32767?im-65536:im;
  switch(o){
  case 0:ex=0;break run;
  case 1:case 2:S.push(im);if(S.length>256){ex=3;break run}break;
  case 3:if(!L){ex=2;break run}S.pop();break;
  case 4:if(!L){ex=2;break run}if(L>255){ex=3;break run}S.push(S[L-1]);break;
  case 5:if(L<2){ex=2;break run}const t=S[L-1];S[L-1]=S[L-2];S[L-2]=t;break;
  case 6:if(L<2){ex=2;break run}if(L>255){ex=3;break run}S.push(S[L-2]);break;
  case 7:if(L<3){ex=2;break run}const a=S[L-3];S[L-3]=S[L-2];S[L-2]=S[L-1];S[L-1]=a;break;
  case 23:if(!L){ex=2;break run}S[L-1]=(-S[L-1])|0;break;
  case 27:if(!L){ex=2;break run}S[L-1]=~S[L-1];break;
  case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:
   if(L<2){ex=2;break run}
   const b=S.pop(),a2=S.pop();let r=0;
   if(o==16)r=(a2+b)|0;else if(o==17)r=(a2-b)|0;else if(o==18)r=Math.imul(a2,b);
   else if(o==19){if(!b){ex=4;break run}r=Math.trunc(a2/b)|0}
   else if(o==20){if(!b){ex=4;break run}r=(a2%b)|0}
   else if(o==21){if(!b){ex=4;break run}r=Math.floor((a2>>>0)/(b>>>0))|0}
   else if(o==22){if(!b){ex=4;break run}r=((a2>>>0)%(b>>>0))|0}
   else if(o==24)r=a2&b;else if(o==25)r=a2|b;else if(o==26)r=a2^b;
   else if(o==28)r=(a2<<(b&31))|0;else if(o==29)r=a2>>(b&31);else if(o==30)r=(a2>>>(b&31))|0;
   else if(o==32)r=a2==b?1:0;else if(o==33)r=a2<b?1:0;else r=(a2>>>0)<(b>>>0)?1:0;
   S.push(r);break;
  case 48:pc=n+so;break;
  case 49:if(!L){ex=2;break run}if(!S.pop())pc=n+so;break;
  case 50:if(!L){ex=2;break run}if(S.pop())pc=n+so;break;
  case 51:if(C.length>63){ex=7;break run}C.push(n);pc=im;break;
  case 52:if(!C.length){ex=8;break run}pc=C.pop();break;
  case 64:if(!L){ex=2;break run}const ad=S.pop();if(ad<0||ad>255){ex=6;break run}S.push(M[ad]);break;
  case 65:if(L<2){ex=2;break run}const ad2=S.pop(),v=S.pop();if(ad2<0||ad2>255){ex=6;break run}M[ad2]=v;break;
  case 80:if(!L){ex=2;break run}const s=String(S.pop());if(out.length+s.length>65536){ex=11;break run}for(let i=0;i<s.length;i++)out.push(s.charCodeAt(i));break;
  case 81:if(!L){ex=2;break run}if(out.length>65535){ex=11;break run}out.push(S.pop()&255);break;
  case 82:S.push(ip<N.length?N[ip++]:-1);if(S.length>256){ex=3;break run}break;
  case 83:if(!L){ex=2;break run}ex=S.pop()&255;break run;
  default:ex=5;break run;
  }
 }
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),Buffer.from(out));
 writeFileSync(join(O,id,'exit.txt'),ex+'\n');
}
