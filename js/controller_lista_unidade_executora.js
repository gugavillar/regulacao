(function () {
	'use strict';
	/*global angular, $*/
	function ListaUnidadeExecutoraCtrl(UnidadesExecutoras, UnidadesExecutorasResource, $filter) {
		var vm = this;

		vm.unidades = UnidadesExecutoras;
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
			vm.unidades = $filter('filter')(UnidadesExecutoras, {nome_unidade_executora: vm.query});
		}
		vm.search = search;

		function excluir(id) {
			UnidadesExecutorasResource.unidades().delete({id_unidade_executora: id}).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.unidades = UnidadesExecutoras.filter(function (elem) {
						if (elem.id_unidade_executora !== id) {
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
	ListaUnidadeExecutoraCtrl.$inject = ['UnidadesExecutoras', 'UnidadesExecutorasResource', '$filter'];

	angular.module('REGULACAO').controller('ListaUnidadeExecutoraCtrl', ListaUnidadeExecutoraCtrl);
}());