(function () {
	'use strict';
	/*global angular, $*/
	function MenuEmpresaCtrl(LoginResource, $state) {
		var vm = this;
		vm.user = sessionStorage.getItem('id');

		$(document).ready(function () {
			$('.sidenav').sidenav({
				draggable: true
			});
			$('.collapsible').collapsible();
		});

		function logout() {
			LoginResource.delCred();
			$state.go('login');
		}
		vm.logout = logout;
	}
	MenuEmpresaCtrl.$inject = ['LoginResource', '$state'];

	angular.module('REGULACAO').controller('MenuEmpresaCtrl', MenuEmpresaCtrl);
}());