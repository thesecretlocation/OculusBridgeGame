var PageCore = CoreClass.extend({
	loadURL:null,
	resolution:null,
	totalPost:0,
	
	// init function fires automatically
	init:function(){
		var _this  = this;

		this.load();
	},

	getUrlVars: function(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable){return pair[1];}
		}
		return(false);
	},
	
	// load data
	load:function(_url){
		var _this = this;
		_this.postsURL;


	//if (Global.serverName == "prod" || Global.serverName == "stage") {
    	_this.postsURL = Global.apiURL+Global.TSOBpageURL+'/posts?api_key='+Global.TSOBkey+'&notes_info=true&reblog_info=true';
    	Global.currAccountURL = Global.TSOBpageURL;
    //} else {
    // 	_this.postsURL = Global.apiURL+Global.SLpageURL+'/posts?api_key='+Global.SLkey+'&notes_info=true&reblog_info=true';
    //	Global.currAccountURL = Global.SLpageURL;
    //} 
	
		// GRAB JSON from Tumblr yo
		// Tumblr has a limit of 20 posts per call
		Global.spoilsPosts = [];
		Global.spoilsPostsRef = {};
		_this.offset = 0;
		this.getNewPosts();
	},

	getNewPosts:function (){
		var _this = this;

		$.ajax({
			type: 'GET',
      url: _this.postsURL+"&offset="+_this.offset,
      async: false,
      jsonpCallback: 'jsonCallback',
      contentType: "application/json",
      dataType: 'jsonp',
      success: function(_posts) {
				_this.offset += 20;
      	Global.posts = _posts;
      	// console.log(Global.posts);

      	$.each(_posts["response"]["posts"], function(i, item) {
      		Global.spoilsPosts.push(item);
      	});

      	// if greater than offset, call again and then push to an obj
      	if (_posts.response.total_posts > _this.offset) {
      		// console.log((_posts.response.total_posts-_this.offset) + " posts remaining, pulling from:",_this.offset);
      		_this.getNewPosts();
      	} else {
      		// console.log("NO MORE POSTS!");
        	_this.sortPost();
      	}

      },
      error: function(e) { console.log(e.message); }
    });
	},

	sortPost: function() {
		var _this = this;
		var posts = Global.spoilsPosts;
		console.log("Global.spoilsPosts", Global.spoilsPosts);

		// display post by dates : rearranged
    function insertionSort(files,attrToSortBy){
      for(var k=1; k < files.length; k++){
         for(var i=k; i > 0 && new Date(files[i][attrToSortBy]) > 
           new Date(files[i-1][attrToSortBy]); i--){
            var tmpFile = files[i];
            files[i] = files[i-1];
            files[i-1] = tmpFile;
         }
      }
    }
    insertionSort(posts,"timestamp");

    // remove _hide yo
    var removeHide = [];
    for (var i=0; i<posts.length; i++) {
      for (var j=0; j<posts[i].tags.length; j++) {
      	posts[i].tags[j] = posts[i].tags[j].toLowerCase();
        if (posts[i].tags[j] == "_hide") {
        	removeHide.push(posts[i]);
        }
      }
    }
    $.each(removeHide, function(i, item) {
    	posts.splice(posts.indexOf(item),1);
    });

    for(var t = 0; t < Global.spoilsPosts.length; t++){
    	Global.spoilsPostsRef[Global.spoilsPosts[t].id] = t;
    }

    // call everything else
  	_this.begin();
	},
	
	resize:function(){
		Global.winWidth = window.innerWidth;
		Global.winHeight = $(window).height();
		
		// define resolutions
		var oldResolution = this.resolution;
		if (Global.winWidth<768){
			this.resolution = "mobile";
		}else if (Global.winWidth<980){
			this.resolution = "tablet";
		}else if (Global.winWidth>=980){
			this.resolution = "desktop";
		}
		
		// resize
		if (Global.objArr){
			for (var i=0; i<Global.objArr.length; i++){
				Global.objArr[i].resize();
			}
		}
	},
	
	begin:function(){
		var _this = this;
		
		// build
		this.buildObjects();
		this.buildHandlers();
		
		// Resize listener
		$(window).resize(function(){
			_this.resize();
		});
		this.resize();
		
		// start
		this.start();
	},

	initRender:function(){
		initRender();
	},
	
	// override classes
	buildObjects:function(){},
	buildHandlers:function(){},
	start:function(){},
	render:function(){}
});


/*////////////////////////////////////////////////////////////////////////////////
// AUTO START WHEN READY
////////////////////////////////////////////////////////////////////////////////*/

// when the page is ready call init
$(document).ready(function(){
	Global.page.init();
});

/*////////////////////////////////////////////////////////////////////////////////
// PAUL IRISH REQUEST ANIMATION FRAME
////////////////////////////////////////////////////////////////////////////////*/

function initRender(){
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame    ||
		window.webkitRequestAnimationFrame 		||
		window.mozRequestAnimationFrame    		||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	(function animloop(){
		requestAnimFrame(animloop);
		Global.page.render();
	})();
}