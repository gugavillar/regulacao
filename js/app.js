(function () {
	'use strict';
	/*global angular, $*/

	function getPacientes(PacientesResource) {
		return PacientesResource.query().$promise;
	}
	getPacientes.$inject = ['PacientesResource'];

	function getPaciente(PacientesResource, $stateParams) {
		return PacientesResource.get({id_paciente: $stateParams.id_paciente}).$promise;
	}
	getPaciente.$inject = ['PacientesResource', '$stateParams'];

	function getUnidadesSolicitantes(UnidadesSolicitantesResource) {
		return UnidadesSolicitantesResource.query().$promise;
	}
	getUnidadesSolicitantes.$inject = ['UnidadesSolicitantesResource'];

	function getUnidadeSolicitante(UnidadesSolicitantesResource, $stateParams) {
		return UnidadesSolicitantesResource.get({id_unidade_solicitante: $stateParams.id_unidade_solicitante}).$promise;
	}
	getUnidadeSolicitante.$inject = ['UnidadesSolicitantesResource', '$stateParams'];

	function getUnidadesExecutoras(UnidadesExecutorasResource) {
		return UnidadesExecutorasResource.unidades().query().$promise;
	}
	getUnidadesExecutoras.$inject = ['UnidadesExecutorasResource'];

	function getUnidadeExecutora(UnidadesExecutorasResource, $stateParams) {
		return UnidadesExecutorasResource.unidades().get({id_unidade_executora: $stateParams.id_unidade_executora}).$promise;
	}
	getUnidadeExecutora.$inject = ['UnidadesExecutorasResource', '$stateParams'];

	function getProcedimentos(ProcedimentosResource) {
		return ProcedimentosResource.query().$promise;
	}
	getProcedimentos.$inject = ['ProcedimentosResource'];

	function getProcedimento(ProcedimentosResource, $stateParams) {
		return ProcedimentosResource.get({id_procedimento: $stateParams.id_procedimento}).$promise;
	}
	getProcedimento.$inject = ['ProcedimentosResource', '$stateParams'];

	function getAgendamentos(AgendamentosResource) {
		return AgendamentosResource.agendamentos().query().$promise;
	}
	getAgendamentos.$inject = ['AgendamentosResource'];

	function getListaAgendamento(AgendamentosResource, $stateParams) {
		return AgendamentosResource.listaAgendamentos().query({status_agendamento: $stateParams.status_agendamento}).$promise;
	}
	getListaAgendamento.$inject = ['AgendamentosResource', '$stateParams'];

	function getEmpresaAgendamento(AgendamentosResource, $stateParams, dateFilter) {
		var data_agendamento = dateFilter(new Date(), 'yyyy-MM-dd');
		return AgendamentosResource.listaAgendamentosEmpresa().query({status_agendamento: $stateParams.status_agendamento, id_unidade_procedimento: sessionStorage.getItem('business'), data_agendamento: data_agendamento}).$promise;
	}
	getEmpresaAgendamento.$inject = ['AgendamentosResource', '$stateParams', 'dateFilter'];

	function getUsuarios(UsuariosResource) {
		return UsuariosResource.query().$promise;
	}
	getUsuarios.$inject = ['UsuariosResource'];

	function configuration($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('menu', {
			url: '/menu',
			templateUrl: 'dist/partials/menu.html',
			controller: 'MenuCtrl as menu',
			abstract: true,
			data: {
				auth: true
			}
		})
		.state('menu.novo_agendamento', {
			url: '/novo_agendamento',
			templateUrl: 'dist/partials/novo_agendamento.html',
			controller: 'NovoAgendamentoCtrl as agendamento',
			data: {
				auth: true
			},
			resolve: {
				Pacientes: getPacientes,
				UnidadesSolicitantes: getUnidadesSolicitantes,
				UnidadesExecutoras: getUnidadesExecutoras
			}
		})
		.state('menu.lista_agendamento', {
			url: '/lista_agendamento/:status_agendamento',
			templateUrl: 'dist/partials/lista_agendamento.html',
			controller: 'ListaAgendamentoCtrl as agendamento',
			data: {
				auth: true
			},
			resolve: {
				Agendamentos: getListaAgendamento
			}
		})
		.state('menu.imprimir_agendamento', {
			url: '/imprimir_agendamento/:agendamentos',
			templateUrl: 'dist/partials/imprimir_agendamento.html',
			controller: 'ImprimirAgendamentoCtrl as agendamento',
			data: {
				auth: true
			}
		})
		.state('menu.novo_paciente', {
			url: '/novo_paciente',
			templateUrl: 'dist/partials/novo_paciente.html',
			controller: 'NovoPacienteCtrl as paciente',
			data: {
				auth: true
			}
		})
		.state('menu.lista_paciente', {
			url: '/lista_paciente',
			templateUrl: 'dist/partials/lista_paciente.html',
			controller: 'ListaPacienteCtrl as paciente',
			data: {
				auth: true
			},
			resolve: {
				Pacientes: getPacientes
			}
		})
		.state('menu.editar_paciente', {
			url: '/editar_paciente/:id_paciente',
			templateUrl: 'dist/partials/editar_paciente.html',
			controller: 'EditarPacienteCtrl as paciente',
			data: {
				auth: true
			},
			resolve: {
				Paciente: getPaciente
			}
		})
		.state('menu.relatorio_procedimentos', {
			url: '/relatorio_procedimentos',
			templateUrl: 'dist/partials/relatorio_procedimentos.html',
			controller: 'RelatorioProcedimentosCtrl as relatorio',
			data: {
				auth: true
			}
		})
		.state('menu.relatorio_unidades_solicitantes', {
			url: '/relatorio_unidades_solicitantes',
			templateUrl: 'dist/partials/relatorio_unidades_solicitantes.html',
			controller: 'RelatorioUnidadesSolicitantesCtrl as relatorio',
			data: {
				auth: true
			}
		})
		.state('menu.relatorio_pacientes', {
			url: '/relatorio_pacientes',
			templateUrl: 'dist/partials/relatorio_pacientes.html',
			controller: 'RelatorioPacientesCtrl as relatorio',
			data: {
				auth: true
			}
		})
		.state('menu.novo_unidade_executora', {
			url: '/novo_unidade_executora',
			templateUrl: 'dist/partials/novo_unidade_executora.html',
			controller: 'NovoUnidadeExecutoraCtrl as unidade',
			data: {
				auth: true
			}
		})
		.state('menu.lista_unidade_executora', {
			url: '/lista_unidade_executora',
			templateUrl: 'dist/partials/lista_unidade_executora.html',
			controller: 'ListaUnidadeExecutoraCtrl as unidade',
			data: {
				auth: true
			},
			resolve: {
				UnidadesExecutoras: getUnidadesExecutoras
			}
		})
		.state('menu.editar_unidade_executora', {
			url: '/editar_unidade_executora/:id_unidade_executora',
			templateUrl: 'dist/partials/editar_unidade_executora.html',
			controller: 'EditarUnidadeExecutoraCtrl as unidade',
			data: {
				auth: true
			},
			resolve: {
				UnidadeExecutora: getUnidadeExecutora
			}
		})
		.state('menu.novo_unidade_solicitante', {
			url: '/novo_unidade_solicitante',
			templateUrl: 'dist/partials/novo_unidade_solicitante.html',
			controller: 'NovoUnidadeSolicitanteCtrl as unidade',
			data: {
				auth: true
			}
		})
		.state('menu.lista_unidade_solicitante', {
			url: '/lista_unidade_solicitante',
			templateUrl: 'dist/partials/lista_unidade_solicitante.html',
			controller: 'ListaUnidadeSolicitanteCtrl as unidade',
			data: {
				auth: true
			},
			resolve: {
				UnidadesSolicitantes: getUnidadesSolicitantes
			}
		})
		.state('menu.editar_unidade_solicitante', {
			url: '/editar_unidade_solicitante/:id_unidade_solicitante',
			templateUrl: 'dist/partials/editar_unidade_solicitante.html',
			controller: 'EditarUnidadeSolicitanteCtrl as unidade',
			data: {
				auth: true
			},
			resolve: {
				UnidadeSolicitante: getUnidadeSolicitante
			}
		})
		.state('menu.novo_procedimento', {
			url: '/novo_procedimento',
			templateUrl: 'dist/partials/novo_procedimento.html',
			controller: 'NovoProcedimentoCtrl as procedimento',
			data: {
				auth: true
			},
			resolve: {
				UnidadesExecutoras: getUnidadesExecutoras
			}
		})
		.state('menu.lista_procedimento', {
			url: '/lista_procedimento',
			templateUrl: 'dist/partials/lista_procedimento.html',
			controller: 'ListaProcedimentoCtrl as procedimento',
			data: {
				auth: true
			},
			resolve: {
				Procedimentos: getProcedimentos
			}
		})
		.state('menu.editar_procedimento', {
			url: '/editar_procedimento/:id_procedimento',
			templateUrl: 'dist/partials/editar_procedimento.html',
			controller: 'EditarProcedimentoCtrl as procedimento',
			data: {
				auth: true
			},
			resolve: {
				Procedimento: getProcedimento,
				UnidadesExecutoras: getUnidadesExecutoras
			}
		})
		.state('menu.novo_usuario', {
			url: '/novo_usuario',
			templateUrl: 'dist/partials/novo_usuario.html',
			controller: 'NovoUsuarioCtrl as usuario',
			data: {
				auth: true
			},
			resolve: {
				UnidadesExecutoras: getUnidadesExecutoras
			}
		})
		.state('menu.lista_usuario', {
			url: '/lista_usuario',
			templateUrl: 'dist/partials/lista_usuario.html',
			controller: 'ListaUsuarioCtrl as lista',
			data: {
				auth: true
			},
			resolve: {
				Usuarios: getUsuarios
			}
		})
		.state('login', {
			url: '/login',
			templateUrl: 'dist/partials/login.html',
			controller: 'LoginCtrl as login',
			data: {
				auth: false
			}
		})
		.state('menu_empresa', {
			url: '/menu_empresa',
			templateUrl: 'dist/partials/menu_empresa.html',
			controller: 'MenuEmpresaCtrl as menu',
			abstract: true,
			data: {
				auth: true
			}
		})
		.state('menu_empresa.lista_empresa_agendamento', {
			url: '/lista_empresa_agendamento/:status_agendamento',
			templateUrl: 'dist/partials/lista_empresa_agendamento.html',
			controller: 'ListaEmpresaAgendamentoCtrl as agendamento',
			data: {
				auth: true
			},
			resolve: {
				Agendamentos: getEmpresaAgendamento
			}
		});
		$urlRouterProvider.otherwise('/login');
	}
	configuration.$inject = ['$stateProvider', '$urlRouterProvider'];

	function runner($rootScope, $state, LoginResource, $location) {
		$rootScope.$on('$stateChangeStart', function (event, toState) {
			if (toState.data.auth && !LoginResource.chkCred()) {
				event.preventDefault();
				$state.go('login');
			}
		});
	}
	runner.$inject = ['$rootScope', '$state', 'LoginResource', '$location'];

	angular.module('REGULACAO', ['ui.router', 'ngResource', 'angular-table', '720kb.tooltips', 'monospaced.elastic']).config(configuration).run(runner);
}());