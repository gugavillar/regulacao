(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaUsuarioCtrl(Usuarios, UsuariosResource, $state) {
		var vm = this;
		vm.usuarios = Usuarios;
		vm.config = {
			itemsPerPage: 10,
			fillLastPage: true,
			maxPages: 5,
			paginatorLabels: {
				first: '<<',
				last: '>>',
				stepBack: '<',
				stepAhead: '>'
			}
		};

		$(document).ready(function () {
			$('.tooltipped').tooltip({
				delay: 50
			});
		});

		function deleteUser(id) {
			UsuariosResource.delete({id: id}).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.usuarios = Usuarios.filter(function (elem) {
						if (elem.id !== id) {
							return elem;
						}
					});
					M.toast({html: 'Usuário excluído com sucesso', inDuration: 2000, classes: 'rounded noprint', completeCallback: function () {
						$state.reload();
					}});
				} else {
					M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
				}
			});
		}
		vm.deleteUser = deleteUser;

		function redefinir(id) {
			UsuariosResource.update({id: id}, null).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({html: 'Senha do usuário redefinida com sucesso', inDuration: 2000, classes: 'rounded noprint'});
					if (id === '1') {
						$state.go('login');
					}
				} else {
					M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
				}
			});
		}
		vm.redefinir = redefinir;
	}
	ListaUsuarioCtrl.$inject = ['Usuarios', 'UsuariosResource', '$state'];

	angular.module('REGULACAO').controller('ListaUsuarioCtrl', ListaUsuarioCtrl);
}());