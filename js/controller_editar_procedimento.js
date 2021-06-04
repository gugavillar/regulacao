(function () {
	'use strict';
	/*global angular, $*/
	function EditarProcedimentoCtrl($state, ProcedimentosResource, Procedimento, UnidadesExecutoras) {
		var vm = this, copy;
		vm.novo = Procedimento;
		vm.unidades_executoras = UnidadesExecutoras

		$(document).ready(function () {
			M.updateTextFields();
			$('select').formSelect();
		});

		function atualizar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			ProcedimentosResource.update({id_procedimento: copy.id_procedimento}, copy).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({html:'Procedimento atualizado com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
						$state.go('menu.lista_procedimento');
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
		vm.atualizar = atualizar;
	}
	EditarProcedimentoCtrl.$inject = ['$state', 'ProcedimentosResource', 'Procedimento', 'UnidadesExecutoras'];

	angular.module('REGULACAO').controller('EditarProcedimentoCtrl', EditarProcedimentoCtrl);
}());