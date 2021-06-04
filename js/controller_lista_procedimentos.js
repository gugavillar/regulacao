(function () {
	'use strict';
	/*global angular, $*/
	function ListaProcedimentoCtrl(Procedimentos, ProcedimentosResource, $filter) {
		var vm = this;

		vm.procedimentos = Procedimentos;
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
			vm.procedimentos = $filter('filter')(Procedimentos, {procedimento: vm.query});
		}
		vm.search = search;

		function excluir(id) {
			ProcedimentosResource.delete({id_procedimento: id}).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.procedimentos = Procedimentos.filter(function (elem) {
						if (elem.id_procedimento !== id) {
							return elem;
						}
					});
					M.toast({html: 'Procedimento excluído com sucesso', inDuration: 2000, classes: 'rounded noprint'});
				} else {
					M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
				}
			});
		}
		vm.excluir = excluir;
	}
	ListaProcedimentoCtrl.$inject = ['Procedimentos', 'ProcedimentosResource', '$filter'];

	angular.module('REGULACAO').controller('ListaProcedimentoCtrl', ListaProcedimentoCtrl);
}());