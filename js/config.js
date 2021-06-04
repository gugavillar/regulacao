(function () {
	'use strict';
	/*global angular*/

	function configHttp($httpProvider) {
		$httpProvider.defaults.headers.common.Authorization = sessionStorage.getItem('token');
	}
	configHttp.$inject = ['$httpProvider'];

	angular.module('REGULACAO').config(configHttp);
}());