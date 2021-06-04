(function () {
	'use strict';
	/*global angular, $*/
	function ListaPacienteCtrl(Pacientes, PacientesResource, $filter) {
		var vm = this;
		vm.query_type = '1';
		vm.check = parseInt(sessionStorage.getItem('type'), 10);

		vm.pacientes = Pacientes;
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
			if (vm.query_type === '1') {
				vm.pacientes = $filter('filter')(Pacientes, {cns_paciente: vm.query});
			} else {
				vm.pacientes = $filter('filter')(Pacientes, {cpf_paciente: vm.query});
			}
		}
		vm.search = search;

		function excluir(id) {
			PacientesResource.delete({id_paciente: id}).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.pacientes = Pacientes.filter(function (elem) {
						if (elem.id_paciente !== id) {
							return elem;
						}
					});
					M.toast({html: 'Paciente excluído com sucesso', inDuration: 2000, classes: 'rounded noprint'});
				} else {
					M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
				}
			});
		}
		vm.excluir = excluir;
	}
	ListaPacienteCtrl.$inject = ['Pacientes', 'PacientesResource', '$filter'];

	angular.module('REGULACAO').controller('ListaPacienteCtrl', ListaPacienteCtrl);
}());