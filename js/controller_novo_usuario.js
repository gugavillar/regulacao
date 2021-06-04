(function () {
	'use strict';
	/*global M, angular, $*/
	function NovoUsuarioCtrl(UsuariosResource, UnidadesExecutoras) {
		var vm = this, copy;
		vm.unidades_executoras = UnidadesExecutoras;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function load(type) {
			$(document).ready(function () {
				$('select').formSelect();
			});
			if (type === '2') {
				vm.terceirizado = true;
			} else {
				if (vm.dados.business) {
					delete vm.dados.business;
				}
				vm.terceirizado = false;
			}
		}
		vm.load = load;

		function send() {
			if (!vm.dados.business) {
				vm.dados.business = 0;
			}
			copy = angular.copy(vm.dados);
			delete vm.dados;
			$(document).ready(function () {
				$('select').formSelect();
			});
			UsuariosResource.save(copy).$promise.then(function (data) {
				if (data.id) {
					M.toast({html:'Usuário cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint'});
				} else {
					var pattern = /UNICO USUARIO/g;
					if (pattern.test(data.erro)) {
						M.toast({html: 'Usuário já cadastrado', inDuration: 1500, classes: 'rounded noprint'});
					} else {
						M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
					}
				}
			});
		}
		vm.send = send;
	}
	NovoUsuarioCtrl.$inject = ['UsuariosResource', 'UnidadesExecutoras'];

	angular.module('REGULACAO').controller('NovoUsuarioCtrl', NovoUsuarioCtrl);
}());