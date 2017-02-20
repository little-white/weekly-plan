(function(){
	function init(){
		console.log('init.js');
	}

	window.init = init;
})(window);(function(){
	window.room = "room.js";
})(window);(function() {
    init();
    console.log(room);
    console.log('main.js');
})();
