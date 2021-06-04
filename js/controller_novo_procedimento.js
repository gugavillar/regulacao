(function () {
	'use strict';
	/*global angular, $*/
	function NovoProcedimentoCtrl(UnidadesExecutoras, $state, ProcedimentosResource) {
		var vm = this, copy;
		vm.unidades_executoras = UnidadesExecutoras;
		
		$(document).ready(function () {
			$('select').formSelect();
		});

		function cadastrar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			ProcedimentosResource.save(copy).$promise.then(function (data) {
				if (data.id_procedimento) {
					M.toast({html:'Procedimento cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
						$state.reload();
					}
				});
				} else {
					var pattern = /UNICO CODIGO PROCEDIMENTO/g;
					if (pattern.test(data.erro)) {
						M.toast({html: 'Procedimento já cadastrado', inDuration: 1500, classes: 'rounded noprint'});
					} else {
						M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
					}
				}
			});
		}
		vm.cadastrar = cadastrar;
	}
	NovoProcedimentoCtrl.$inject = ['UnidadesExecutoras', '$state', 'ProcedimentosResource'];

	angular.module('REGULACAO').controller('NovoProcedimentoCtrl', NovoProcedimentoCtrl);
}());