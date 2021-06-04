(function () {
	'use strict';
	/*global angular, $*/
	function MenuCtrl(LoginResource, $state) {
		var vm = this;
		vm.check = sessionStorage.getItem('type');

		$(document).ready(function () {
			$('.sidenav').sidenav({
				draggable: true
			});
			$('footer').css({
				'padding-left': 300
			});
			$('.collapsible').collapsible();
		});

		function logout() {
			LoginResource.delCred();
			$state.go('login');
		}
		vm.logout = logout;
	}
	MenuCtrl.$inject = ['LoginResource', '$state'];

	angular.module('REGULACAO').controller('MenuCtrl', MenuCtrl);
}());