(function () {
	'use strict';
	/*global angular*/
	function LoginResource($resource) {
		function setCred() {
			return $resource('api/login', null, {
				update: {method: 'PUT'}
			});
		}

		function chkCred() {
			var returnVal = false;
			if (sessionStorage.getItem('token')) {
				returnVal = true;
			}
			return returnVal;
		}

		function delCred() {
			sessionStorage.clear();
		}

		return {
			setCred: setCred,
			chkCred: chkCred,
			delCred: delCred
		};
	}
	LoginResource.$inject = ['$resource'];

	function PacientesResource($resource) {
		return $resource('api/pacientes/:id_paciente', null, {
			update: {method: 'PUT'}
		});
	}
	PacientesResource.$inject = ['$resource'];

	function UnidadesSolicitantesResource($resource) {
		return $resource('api/unidades_solicitantes/:id_unidade_solicitante', null, {
			update: {method: 'PUT'}
		});
	}
	UnidadesSolicitantesResource.$inject = ['$resource'];

	function UnidadesExecutorasResource($resource) {
		function unidades() {
			return $resource('api/unidades_executoras/:id_unidade_executora', null, {
				update: {method: 'PUT'}
			});
		}
		function procedimentosUnidade() {
			return $resource('api/unidades_executoras/procedimentos/:id_unidade_procedimento');
		}

		return {
			unidades: unidades,
			procedimentosUnidade: procedimentosUnidade
		};
	}
	UnidadesExecutorasResource.$inject = ['$resource'];

	function ProcedimentosResource($resource) {
		return $resource('api/procedimentos/:id_procedimento');
	}
	ProcedimentosResource.$inject = ['$resource'];

	function AgendamentosResource($resource) {
		function agendamentos() {
			return $resource('api/agendamentos/:id_agendamento', null, {
				update: {method: 'PUT'}
			});
		}
		function listaAgendamentos() {
			return $resource('api/agendamentos/lista/:status_agendamento');
		}
		function motivos() {
			return $resource('api/agendamentos/motivos/:id_agendamento');
		}
		function listaAgendamentosEmpresa() {
			return $resource('api/agendamentos/empresa/lista/:status_agendamento/:id_unidade_procedimento/:data_agendamento');
		}
		function agendamentosEmpresa() {
			return $resource('api/agendamentos/empresa/agendamentos/:senha_agendamento', null, {
				update: {method: 'PUT'}
			});
		}

		return {
			agendamentos: agendamentos,
			listaAgendamentos: listaAgendamentos,
			motivos: motivos,
			listaAgendamentosEmpresa: listaAgendamentosEmpresa,
			agendamentosEmpresa: agendamentosEmpresa
		};
	}
	AgendamentosResource.$inject = ['$resource'];

	function RelatoriosResource($resource) {
		function procedimentos() {
			return $resource('api/relatorios/procedimentos/:data_inicio/:data_fim');
		}
		function unidades() {
			return $resource('api/relatorios/unidades/:data_inicio/:data_fim');
		}
		function pacientes() {
			return $resource('api/relatorios/pacientes/:data_inicio/:data_fim');
		}

		return {
			procedimentos: procedimentos,
			unidades: unidades,
			pacientes: pacientes
		};
	}
	RelatoriosResource.$inject = ['$resource'];

	function UsuariosResource($resource) {
		return $resource('api/usuarios/:id', null, {
			update: {method: 'PUT'}
		});
	}
	UsuariosResource.$inject = ['$resource'];

	angular.module('REGULACAO').factory('LoginResource', LoginResource).factory('PacientesResource', PacientesResource).factory('UnidadesSolicitantesResource', UnidadesSolicitantesResource).factory('UnidadesExecutorasResource', UnidadesExecutorasResource).factory('ProcedimentosResource', ProcedimentosResource).factory('AgendamentosResource', AgendamentosResource).factory('RelatoriosResource', RelatoriosResource).factory('UsuariosResource', UsuariosResource);
}());