(function () {
	'use strict';
	/*global angular, $*/
	function ListaEmpresaAgendamentoCtrl(Agendamentos, AgendamentosResource, $filter, $state) {
		var vm = this, copy;
		vm.query_type = '2';

		$(document).ready(function(){
			$('#ticket').modal();
			$('#finalizar').modal();
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
		}
		vm.ticket = ticket;

		function finalizarAtendimento(id_agendamento) {
			$('#ticket').modal('close');
			$('#finalizar').modal('open');
		}
		vm.finalizarAtendimento = finalizarAtendimento;

		function search() {
			if (vm.query_type === '1') {
				vm.agendamentos = $filter('filter')(Agendamentos, {cns_paciente: vm.query});
			} else {
				vm.agendamentos = $filter('filter')(Agendamentos, {cpf_paciente: vm.query});
			}
		}
		vm.search = search;

		function submitConfirmar(senha_agendamento) {
			AgendamentosResource.agendamentosEmpresa().update({senha_agendamento: senha_agendamento}, null).$promise.then(function (data) {
				if (data.$resolved && data[0] === '0') {
					M.toast({html:'Senha incorreta', inDuration: 1500, classes: 'rounded noprint'});
				} else if (data.$resolved && data[0] === '1') {
					$('#finalizar').modal('close');
					M.toast({html:'Atendimento finalizado', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
						$state.reload();
					}
				});
				} else {
					M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
				}
			});
		}
		vm.submitConfirmar = submitConfirmar;

	}
	ListaEmpresaAgendamentoCtrl.$inject = ['Agendamentos', 'AgendamentosResource', '$filter', '$state'];

	angular.module('REGULACAO').controller('ListaEmpresaAgendamentoCtrl', ListaEmpresaAgendamentoCtrl);
}());