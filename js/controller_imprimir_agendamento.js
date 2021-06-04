(function () {
	'use strict';
	/*global angular, $*/
	function ImprimirAgendamentoCtrl(AgendamentosResource, $state) {
		var vm = this, array;
		array = $state.params.agendamentos.split(',');
		vm.ticketAgendamento = [];
		array.filter(function (elem) {
			AgendamentosResource.agendamentos().get({id_agendamento: elem}).$promise.then(function (data) {
				vm.ticketAgendamento.push(data);
			});
		});
		M.toast({html:'Preparando a impressão', inDuration: 1000, classes: 'rounded noprint', completeCallback: function () {
			window.print();
			$state.go('menu.lista_agendamento');
		}
	});
	}
	ImprimirAgendamentoCtrl.$inject = ['AgendamentosResource', '$state'];

	angular.module('REGULACAO').controller('ImprimirAgendamentoCtrl', ImprimirAgendamentoCtrl);
}());