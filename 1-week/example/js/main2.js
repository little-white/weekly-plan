require.config({
   
    baseUrl: 'js/app',
    paths: {
        login: 'login',
        register: 'register'
    }

});

require(['login','register'], function(login, register) {
	login.submit();
	register.submit();
});
