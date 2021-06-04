(function () {
	'use strict';
	/*global angular, $*/
	function RelatorioProcedimentosCtrl(RelatoriosResource, $scope) {
		var vm = this, copy;

		function checkData() {
			if (vm.novo) {
				if (vm.novo.fim) {
					if (vm.novo.inicio >= vm.novo.fim) {
						delete vm.novo.fim;
						$('#fim').val('').focus();
						$scope.$apply();
						M.toast({html: 'A data do fim do período tem que ser superior a data de início', inDuration: 1500, classes: 'rounded noprint'});
					}
				}
			}
		}
		
		$(document).ready(function () {
			$('.timepicker').timepicker({
				i18n: {
					cancel: 'Sair',
					done: 'Ok'
				},
				twelveHour: false
			});
			$('.datepicker').datepicker({
				i18n: {
					months: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
					monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
					weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
					weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
					weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
					today: 'Hoje',
					clear: 'Limpar',
					cancel: 'Sair',
					done: 'Ok',
					labelMonthNext: 'Próximo mês',
					labelMonthPrev: 'Mês anterior',
					labelMonthSelect: 'Selecione um mês',
					labelYearSelect: 'Selecione um ano'
				},
				format: 'dd/mm/yyyy',
				disableWeekends: true,
				onClose: function () {
					checkData();
				}
			});
		});

		function gerarRelatorio() {
			copy = angular.copy(vm.novo);
			RelatoriosResource.procedimentos().query({data_inicio: copy.inicio, data_fim: copy.fim}).$promise.then(function (data) {
				vm.data = data;
			});
		}
		vm.gerarRelatorio = gerarRelatorio;
	}
	RelatorioProcedimentosCtrl.$inject = ['RelatoriosResource', '$scope'];

	angular.module('REGULACAO').controller('RelatorioProcedimentosCtrl', RelatorioProcedimentosCtrl);
}());