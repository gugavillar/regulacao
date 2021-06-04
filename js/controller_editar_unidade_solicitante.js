(function () {
	'use strict';
	/*global angular, $*/
	function EditarUnidadeSolicitanteCtrl($http, $state, UnidadesSolicitantesResource, UnidadeSolicitante) {
		var vm = this, copy;
		vm.novo = UnidadeSolicitante;

		$(document).ready(function () {
			M.updateTextFields();
			$('#resposta_cep').modal({
				onCloseEnd: function () {
					delete vm.novo.cep_unidade_solicitante;
					$('#cep_unidade_solicitante').val('').focus();
				}
			});
		});

		function getEndereco(cep) {
			if (cep) {
				delete $http.defaults.headers.common.Authorization;
				$http.get('https://viacep.com.br/ws/' + cep + '/json/').then(function (data) {
					var endereco = data;
					if (endereco.data.logradouro) {
						vm.novo.logradouro_unidade_solicitante = endereco.data.logradouro.toUpperCase();
						vm.novo.bairro_unidade_solicitante = endereco.data.bairro.toUpperCase();
						vm.novo.cidade_unidade_solicitante = endereco.data.localidade.toUpperCase();
						vm.novo.estado_unidade_solicitante = endereco.data.uf.toUpperCase();
						$(document).ready(function () {
							M.updateTextFields();
						});
					} else {
						$('#resposta_cep').modal('open');
					}
				});
			}
		}
		vm.getEndereco = getEndereco;

		function atualizar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
			UnidadesSolicitantesResource.update({id_unidade_solicitante: copy.id_unidade_solicitante}, copy).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({html:'Unidade solicitante atualizada com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
						$state.go('menu.lista_unidade_solicitante');
					}
				});
				} else {
					var pattern = /UNICO CODIGO UNIDADE SOLICITANTE/g;
					if (pattern.test(data.erro)) {
						M.toast({html: 'Código da unidade já cadastrado', inDuration: 1500, classes: 'rounded noprint'});
					} else {
						M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
					}
				}
			});
		}
		vm.atualizar = atualizar;
	}
	EditarUnidadeSolicitanteCtrl.$inject = ['$http', '$state', 'UnidadesSolicitantesResource', 'UnidadeSolicitante'];

	angular.module('REGULACAO').controller('EditarUnidadeSolicitanteCtrl', EditarUnidadeSolicitanteCtrl);
}());