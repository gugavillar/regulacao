(function () {
	'use strict';
	/*global Materialize, angular, $*/
	function LoginCtrl(LoginResource, $state, $http) {
		var vm = this;
		LoginResource.delCred();

		$(document).ready(function () {
			$('#mudar').modal({
				dismissible: false
			});
			$('main').css({
				'padding-left': 0,
				'display': 'grid',
				'justify-items': 'center',
				'align-items': 'center'
			});
			$('footer').css({
				'padding-left': 0
			});
		});

		function reload() {
			$state.reload();
		}

		function entrar() {
			LoginResource.setCred().save(vm.dados).$promise.then(function (data) {
				if (data.status === '0') {
					delete vm.dados;
					M.toast({html: 'Usuário bloqueado', inDuration: 1500, classes: 'rounded noprint', completeCallback: reload});
				} else if (data.flag === '0') {
					vm.dados.id = data.id;
					delete vm.dados.pass;
					$('#mudar').modal('open');
				} else if (data.token) {
					$http.defaults.headers.common.Authorization = data.token;
					sessionStorage.setItem('id', data.id);
					sessionStorage.setItem('token', data.token);
					sessionStorage.setItem('business', data.business);
					sessionStorage.setItem('type', data.type);
					delete vm.dados;
					if (data.business === '0') {
						M.toast({html: 'Validando dados', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
							$state.go('menu.novo_agendamento');
						}});
					} else {
						M.toast({html: 'Validando dados', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
							$state.go('menu_empresa.lista_empresa_agendamento', {status_agendamento: 1});
						}});
					}
				} else {
					M.toast({html: 'Usuário e Senha inválidos', inDuration: 1500, classes: 'rounded noprint', completeCallback: reload});
				}
			});
		}
		vm.entrar = entrar;

		function change() {
			$('#mudar').modal('close');
			LoginResource.setCred().update({id: vm.dados.id}, vm.dados).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({html: 'Senha alterada com sucesso', inDuration: 2000, classes: 'rounded noprint', completeCallback: reload});
				} else {
					M.toast({html: 'Ocorreu uma falha', inDuration: 2000, classes: 'rounded noprint', completeCallback: reload});
				}
			});
		}
		vm.change = change;
	}
	LoginCtrl.$inject = ['LoginResource', '$state', '$http'];

	angular.module('REGULACAO').controller('LoginCtrl', LoginCtrl);
}());