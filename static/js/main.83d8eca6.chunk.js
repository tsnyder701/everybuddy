(this["webpackJsonpfrontend-everybuddy"]=this["webpackJsonpfrontend-everybuddy"]||[]).push([[0],{14:function(n,e,t){},15:function(n,e,t){"use strict";t.r(e);var c=t(1),r=t(0),i=t.n(r),o=t(8),s=t.n(o),a=(t(14),t(2)),d=t(3),u=t(6);var b=function(n){var e,t=n.id,i=n.game,o=n.shown,s=n.setShown,b=n.selectedCount,l=n.setSelectedCount,f=n.selectedIndexes,j=n.setSelectedIndexes,h=(n.flippedIndexes,n.setFlippedIndexes,n.topOfDeck),x=n.setTopOfDeck,p=Object(r.useState)(!1),O=Object(a.a)(p,2),g=O[0],m=O[1],v=Object(r.useState)(!1),S=Object(a.a)(v,2),k=S[0],y=S[1],w=Object(u.b)({opacity:k?0:1,transform:"perspective(600px) rotateX(".concat(k?0:180,"deg) scale(").concat(g?1.2:1,") "),config:{mass:5,tension:500,friction:80}}),I=w.transform,C=w.opacity;return Object(r.useEffect)((function(){!0===f[3]&&f.indexOf(t)>-1?setTimeout((function(){m((function(n){return!1})),l(0),j([])}),1e3):!1===f[3]&&f.indexOf(t)>-1&&(y((function(n){return!0})),l(0),j([]),setTimeout((function(){var n=f.indexOf(t);n>-1&&h+n<63?(console.log("TOD @ ".concat(n,": ")+h),o[t].cardId=i[h+n].cardId,s(o),0===n&&x(h+3),y((function(n){return!1})),m((function(n){return!1}))):m((function(n){return!1}))}),1e3))}),[f]),Object(c.jsxs)("div",{onClick:function(){if(console.log("onCardClick "+b+": "+f),!k&&b<3)if(g){f.indexOf(t);m((function(n){return!1})),l(b-1);var n=f.filter((function(n){return n!==t}));j(n)}else{m((function(n){return!0})),l(b+1);var e=Object(d.a)(f);e.push(t),j(e)}},children:[Object(c.jsx)(u.a.div,{className:"c back",style:{opacity:C.interpolate((function(n){return 1-n})),transform:I}}),Object(c.jsx)(u.a.div,{className:"c front",style:{opacity:C,transform:I.interpolate((function(n){return"".concat(n," rotateX(180deg)")})),backgroundImage:"url("+(e=o[t].cardId,"cards/front%20"+("00"+e).substr(-2,2)+".png)")}})]})};var l=function(n){for(var e=n.options,t=(n.setOptions,n.highScore),i=n.setHighScore,o=Object(r.useState)([]),s=Object(a.a)(o,2),u=s[0],l=s[1],f=Object(r.useState)(0),j=Object(a.a)(f,2),h=j[0],x=j[1],p=Object(r.useState)([]),O=Object(a.a)(p,2),g=O[0],m=O[1],v=Object(r.useState)([]),S=Object(a.a)(v,2),k=S[0],y=S[1],w=Object(r.useState)(0),I=Object(a.a)(w,2),C=I[0],T=I[1],E=Object(r.useState)(0),F=Object(a.a)(E,2),D=F[0],M=F[1],H=[],N=1;N<=63;N++)H.push(N);if(Object(r.useEffect)((function(){for(var n=[],t=1;t<64;t++){var c={cardId:t,selected:!1};n.push(c)}var r=n.sort((function(){return Math.random()-.5}));l(r),y(r.slice(0,5*e)),T(5*e)}),[]),Object(r.useEffect)((function(){D>t&&i(D)}),[u]),3===g.length)if(0===(k[g[0]].cardId^k[g[1]].cardId^k[g[2]].cardId)){M((function(n){return n+1}));var B=Object(d.a)(u);l(B);var J=Object(d.a)(g);J.push(!1),m(J)}else{var L=Object(d.a)(g);L.push(!0),m(L)}return 0===u.length?Object(c.jsx)("div",{children:"loading..."}):Object(c.jsxs)("div",{id:"game",children:[Object(c.jsxs)("h1",{children:["Score: ",D]}),Object(c.jsx)("div",{id:"cards",children:k.map((function(n,e){return Object(c.jsx)("div",{className:"card",children:Object(c.jsx)(b,{id:e,cardId:n.cardId,game:u,shown:k,setShown:y,selectedCount:h,setSelectedCount:x,selectedIndexes:g,setSelectedIndexes:m,topOfDeck:C,setTopOfDeck:T})},e)}))})]})};var f=function(){var n=Object(r.useState)(null),e=Object(a.a)(n,2),t=e[0],i=e[1],o=Object(r.useState)(0),s=Object(a.a)(o,2),d=s[0],u=s[1];return Object(r.useEffect)((function(){}),[]),Object(c.jsxs)("div",{children:[Object(c.jsxs)("div",{className:"container",children:[Object(c.jsx)("h1",{children:"EveryBuddy"}),Object(c.jsxs)("div",{children:["High Score: ",d]}),Object(c.jsx)("div",{children:null===t?Object(c.jsxs)(c.Fragment,{children:[Object(c.jsx)("button",{onClick:function(){return i(5)},children:"Easy"}),Object(c.jsx)("button",{onClick:function(){return i(4)},children:"Medium"}),Object(c.jsx)("button",{onClick:function(){return i(3)},children:"Hard"})]}):Object(c.jsxs)(c.Fragment,{children:[Object(c.jsx)("button",{onClick:function(){var n=t;i(null),setTimeout((function(){i(n)}),5)},children:"Start Over"}),Object(c.jsx)("button",{onClick:function(){return i(null)},children:"Main Menu"})]})})]}),t?Object(c.jsx)(l,{options:t,setOptions:i,highScore:d,setHighScore:u}):Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"Choose a difficulty to begin!"}),Object(c.jsx)("img",{src:"cards/instructions.png",class:"instructions"})]}),Object(c.jsx)("style",{jsx:!0,global:!0,children:"\n    body {\n      text-align: center;\n      font-family: -apple-system, sans-serif;\n    }\n    .container {\n      width: 1060px;\n      margin: 0 auto;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 20px;\n    }\n    button {\n      background: #00ad9f;\n      border-radius: 4px;\n      font-weight: 700;\n      color: #fff;\n      border: none;\n      padding: 7px 15px;\n      margin-left: 8px;\n      cursor: pointer;\n    }\n    button:hover {\n      background: #008378;\n    }\n    button:focus {\n      outline: 0;\n    }\n    .instructions {\n      width: 1000px;\n      height: 1400px;\n      border-radius: 100px;\n      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n    }\n    #cards {\n      width: ".concat(175+195*(t-1),"px;\n      margin: 0 auto;\n      display: flex;\n      flex-wrap: wrap;\n    }\n    .card {\n      width: 175px;\n      height: 125px;\n      margin-bottom: 20px;\n    }\n    .card:not(:nth-child(").concat(t,"n)) {\n      margin-right: 20px;\n    }\n\n    .c {\n      position: absolute;\n      max-width: 175px;\n      max-height: 125px;\n      width: 50ch;\n      height: 50ch;\n      cursor: pointer;\n      border-radius: 12px;\n      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n      will-change: transform, opacity;\n    }\n\n    .front,\n    .back {\n      background-size: cover;\n    }\n\n    .back {\n      background-image: url(cards/back.png);\n    }\n\n    .front {\n      background-color: white;\n    }\n  ")})]})},j=function(n){n&&n instanceof Function&&t.e(3).then(t.bind(null,16)).then((function(e){var t=e.getCLS,c=e.getFID,r=e.getFCP,i=e.getLCP,o=e.getTTFB;t(n),c(n),r(n),i(n),o(n)}))};s.a.render(Object(c.jsx)(i.a.StrictMode,{children:Object(c.jsx)(f,{})}),document.getElementById("root")),j()}},[[15,1,2]]]);
//# sourceMappingURL=main.83d8eca6.chunk.js.map