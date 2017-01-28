require.config({
   
    baseUrl: 'js/app',
    paths: {
        login: 'login',
        register: 'register'
    },
    shim: {
    	demo: ['demo1','demo2']
    }

});

require(['demo'], function(demo) {
	
});
