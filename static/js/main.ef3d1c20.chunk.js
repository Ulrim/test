(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{131:function(e,t){},132:function(e,t){},180:function(e,t,n){},181:function(e,t,n){"use strict";n.r(t);var a=n(2),r=n.n(a),s=n(80),o=n.n(s),i=(n(88),n(43)),c=n.n(i),l=n(81),u=n(25),p=n(26),m=n(28),v=n(27),f=n(29),h=(n(90),n(91),n(82)),d=n.n(h);function g(e){var t=e.poster,n=e.alt;return r.a.createElement("img",{src:t,alt:n,title:n,className:"Movie_Poster"})}function _(e){var t=e.genre;return r.a.createElement("span",{className:"Movie_Genre"},t," ")}var b=function(e){function t(){return Object(u.a)(this,t),Object(m.a)(this,Object(v.a)(t).apply(this,arguments))}return Object(f.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"Movie"},r.a.createElement("div",{className:"Movie_Column"},r.a.createElement(g,{poster:this.props.poster,alt:this.props.title})),r.a.createElement("div",{className:"Movie_Column"},r.a.createElement("h1",null,this.props.title),r.a.createElement("div",{className:"Movie_Genres"},this.props.genres.map(function(e,t){return r.a.createElement(_,{genre:e,key:t})})),r.a.createElement("p",{className:"Movie_Synopsis"},r.a.createElement(d.a,{text:this.props.synopsis,maxLine:"3",ellipsis:"...",trimRight:!0,basedOn:"letters"}))))}}]),t}(a.Component),y=(n(180),function(e){function t(){var e,n;Object(u.a)(this,t);for(var a=arguments.length,s=new Array(a),o=0;o<a;o++)s[o]=arguments[o];return(n=Object(m.a)(this,(e=Object(v.a)(t)).call.apply(e,[this].concat(s)))).state={},n._renderMovies=function(){return n.state.movies.map(function(e){return console.log(e),r.a.createElement(b,{key:e.id,title:e.title,poster:e.medium_cover_image,genres:e.genres,synopsis:e.synopsis})})},n._getMovies=Object(l.a)(c.a.mark(function e(){var t;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n._callApi();case 2:t=e.sent,n.setState({movies:t});case 4:case"end":return e.stop()}},e)})),n._callApi=function(){return fetch("https://yts.am/api/v2/list_movies.json?sort_by=download count").then(function(e){return e.json()}).then(function(e){return e.data.movies}).catch(function(e){return console.log(e)})},n}return Object(f.a)(t,e),Object(p.a)(t,[{key:"componentDidMount",value:function(){this._getMovies()}},{key:"render",value:function(){var e=this.state.movies;return r.a.createElement("div",{className:e?"App":"App--loading"},this.state.movies?this._renderMovies():"Loading")}}]),t}(a.Component));o.a.render(r.a.createElement(y,null),document.getElementById("root"))},83:function(e,t,n){e.exports=n(181)},88:function(e,t,n){},90:function(e,t,n){},94:function(e,t){},96:function(e,t){}},[[83,1,2]]]);
//# sourceMappingURL=main.ef3d1c20.chunk.js.map