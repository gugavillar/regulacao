(function () {
	'use strict';
	/*global angular, $*/
	function ListaAgendamentoCtrl(Agendamentos, AgendamentosResource, $filter, $state, dateFilter, $scope) {
		var vm = this, copy, dataCompare = dateFilter(new Date(), 'yyyy-MM-dd');
		vm.query_type = '2';
		vm.printArray = [];

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

		$(document).ready(function(){
			$('#ticket').modal();
			$('#reagendar').modal();
			$('#cancelamento').modal();
			$('.timepicker').timepicker({
				i18n: {
					cancel: 'Sair',
					done: 'Ok'
				},
				twelveHour: false,
				onOpenStart: function () {
					$('.timepicker-container').css('position','static');
					$('.timepicker-modal').css('width','550px');
				}
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
				onOpen: function () {
					$('.datepicker-container').css('position','static');
					$('.datepicker-modal').css('width','550px');
				},
				onClose: function () {
					checkData();
				}
			});
		});

		vm.agendamentos = Agendamentos;
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

		function ticket(id_agendamento) {
			AgendamentosResource.agendamentos().get({id_agendamento: id_agendamento}).$promise.then(function (data) {
				vm.ticketAgendamento = data;
				$('#ticket').modal('open');
			});
			AgendamentosResource.motivos().query({id_agendamento: id_agendamento}).$promise.then(function (data) {
				vm.ticketMotivos = data;
				vm.motivoAgendamento = data.find(function (elem) {
					if (elem.tipo_motivo === '1') {
						return true;
					}
				});
				vm.motivoCancelamento = data.find(function (elem) {
					if (elem.tipo_motivo === '2') {
						return true;
					}
				});
			});
		}
		vm.ticket = ticket;

		function reagendar(id_agendamento) {
			$('#ticket').modal('close');
			$('#reagendar').modal('open');
		}
		vm.reagendar = reagendar;

		function cancelar(id_agendamento) {
			$('#ticket').modal('close');
			$('#cancelamento').modal('open');
		}
		vm.cancelar = cancelar;

		function search() {
			if (vm.query_type === '1') {
				vm.agendamentos = $filter('filter')(Agendamentos, {cns_paciente: vm.query});
			} else {
				vm.agendamentos = $filter('filter')(Agendamentos, {cpf_paciente: vm.query});
			}
		}
		vm.search = search;

		function submitReagendar(id_agendamento) {
			vm.novo.data_agendamento = vm.novo.data + ' ' + vm.novo.hora;
			vm.novo.tipo_motivo = 1;
			vm.novo.usuario_motivo = parseInt(sessionStorage.getItem('id'), 10);
			vm.novo.id_agendamento = id_agendamento;
			delete vm.novo.data;
			delete vm.novo.hora;
			copy = angular.copy(vm.novo);
			delete vm.novo;
			AgendamentosResource.agendamentos().update({id_agendamento: id_agendamento}, copy).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					$('#reagendar').modal('close');
					M.toast({html:'Reagendamento registrado com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
						$state.reload();
					}
				});
				} else {
					M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
				}
			});
		}
		vm.submitReagendar = submitReagendar;

		function submitCancelar(id_agendamento) {
			vm.novo.tipo_motivo = 2;
			vm.novo.usuario_motivo = parseInt(sessionStorage.getItem('id'), 10);
			vm.novo.id_agendamento = id_agendamento;
			copy = angular.copy(vm.novo);
			delete vm.novo;
			AgendamentosResource.agendamentos().update({id_agendamento: id_agendamento}, copy).$promise.then(function (data) {
				if (data.$resolved && data.id_motivo === 1) {
					$('#cancelamento').modal('close');
					M.toast({html:'Cancelamento registrado com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
						$state.reload();
					}
				});
				} else {
					M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
				}
			});
		}
		vm.submitCancelar = submitCancelar;

		function markPrint(args) {
			vm.agendamentos.filter(function (elem, index) {
				if (elem.id_agendamento === args.item.id_agendamento) {
					if (!elem.print) {
						elem.print = true;
						vm.printArray.push(elem.id_agendamento);
					} else if (elem.print) {
						delete elem.print;
						vm.printArray.splice(index, 1);
					}
				}
			});
		}
		vm.markPrint = markPrint;
	}
	ListaAgendamentoCtrl.$inject = ['Agendamentos', 'AgendamentosResource', '$filter', '$state', 'dateFilter', '$scope'];

	angular.module('REGULACAO').controller('ListaAgendamentoCtrl', ListaAgendamentoCtrl);
}());