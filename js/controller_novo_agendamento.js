(function () {
	'use strict';
	/*global M, angular, $*/
	function NovoAgendamentoCtrl(Pacientes, UnidadesSolicitantes, UnidadesExecutoras, UnidadesExecutorasResource, AgendamentosResource, $state, dateFilter, $scope) {
		var vm = this, copy, dataCompare = dateFilter(new Date(), 'yyyy-MM-dd');
		vm.pacientes = Pacientes;
		vm.unidades_solicitantes = UnidadesSolicitantes;
		vm.unidades_executoras = UnidadesExecutoras;

		function checkData() {
			if (vm.novo) {
				if (vm.novo.data) {
					if (vm.novo.data <= dataCompare) {
						delete vm.novo.data;
						$('#data').val('').focus();
						$scope.$apply();
						M.toast({html: 'A data tem que ser superior ao dia atual', inDuration: 1500, classes: 'rounded noprint'});
					}
				}
			}
		}

		$(document).ready(function () {
			$('select').formSelect();
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

		function getProcedimentos(id_unidade_executora) {
			UnidadesExecutorasResource.procedimentosUnidade().query({id_unidade_procedimento: id_unidade_executora}).$promise.then(function (data) {
				vm.procedimentos = data;
				$(document).ready(function() {
					$('#procedimento').formSelect();
				});
			});
		}
		vm.getProcedimentos = getProcedimentos;

		function agendar() {
			vm.novo.data_agendamento = vm.novo.data + ' ' + vm.novo.hora;
			vm.novo.usuario_agendamento = parseInt(sessionStorage.getItem('id'));
			delete vm.novo.data;
			delete vm.novo.hora;
			copy = angular.copy(vm.novo);
			delete vm.novo;
			$(document).ready(function () {
				$('select').formSelect();
			});
			AgendamentosResource.agendamentos().save(copy).$promise.then(function (data) {
				if (data.num_agendamento) {
					M.toast({html: 'Agendamento cadastrado com sucesso', inDuration: 2000, classes: 'rounded noprint',  completeCallback: function () {
						$state.reload();
					}
				});
				} else {
					M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
				}
			});
		}
		vm.agendar = agendar;
	}
	NovoAgendamentoCtrl.$inject = ['Pacientes', 'UnidadesSolicitantes', 'UnidadesExecutoras', 'UnidadesExecutorasResource', 'AgendamentosResource', '$state', 'dateFilter', '$scope'];

	angular.module('REGULACAO').controller('NovoAgendamentoCtrl', NovoAgendamentoCtrl);
}());