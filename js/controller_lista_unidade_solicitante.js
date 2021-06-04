(function () {
	'use strict';
	/*global angular, $*/
	function ListaUnidadeSolicitanteCtrl(UnidadesSolicitantes, UnidadesSolicitantesResource, $filter) {
		var vm = this;

		vm.unidades = UnidadesSolicitantes;
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

		function search() {
			vm.unidades = $filter('filter')(UnidadesSolicitantes, {cod_unidade_solicitante: vm.query});
		}
		vm.search = search;

		function excluir(id) {
			UnidadesSolicitantesResource.delete({id_unidade_solicitante: id}).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.unidades = UnidadesSolicitantes.filter(function (elem) {
						if (elem.id_unidade_solicitante !== id) {
							return elem;
						}
					});
					M.toast({html: 'Unidade excluída com sucesso', inDuration: 2000, classes: 'rounded noprint'});
				} else {
					M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
				}
			});
		}
		vm.excluir = excluir;
	}
	ListaUnidadeSolicitanteCtrl.$inject = ['UnidadesSolicitantes', 'UnidadesSolicitantesResource', '$filter'];

	angular.module('REGULACAO').controller('ListaUnidadeSolicitanteCtrl', ListaUnidadeSolicitanteCtrl);
}());