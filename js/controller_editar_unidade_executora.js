(function () {
	'use strict';
	/*global angular, $*/
	function EditarUnidadeExecutoraCtrl($http, $state, UnidadesExecutorasResource, UnidadeExecutora) {
		var vm = this, copy;
		vm.novo = UnidadeExecutora;

		$(document).ready(function () {
			M.updateTextFields();
			$('#resposta_cep').modal({
				onCloseEnd: function () {
					delete vm.novo.cep_unidade_executora;
					$('#cep_unidade_executora').val('').focus();
				}
			});
		});

		function getEndereco(cep) {
			if (cep) {
				delete $http.defaults.headers.common.Authorization;
				$http.get('https://viacep.com.br/ws/' + cep + '/json/').then(function (data) {
					var endereco = data;
					if (endereco.data.logradouro) {
						vm.novo.logradouro_unidade_executora = endereco.data.logradouro.toUpperCase();
						vm.novo.bairro_unidade_executora = endereco.data.bairro.toUpperCase();
						vm.novo.cidade_unidade_executora = endereco.data.localidade.toUpperCase();
						vm.novo.estado_unidade_executora = endereco.data.uf.toUpperCase();
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
			UnidadesExecutorasResource.unidades().update({id_unidade_executora: copy.id_unidade_executora}, copy).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({html:'Unidade executora atualizada com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
						$state.go('menu.lista_unidade_executora');
					}
				});
				} else {
					var pattern = /UNICA UNIDADE EXECUTORA/g;
					if (pattern.test(data.erro)) {
						M.toast({html: 'Unidade já cadastrada', inDuration: 1500, classes: 'rounded noprint'});
					} else {
						M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
					}
				}
			});
		}
		vm.atualizar = atualizar;
	}
	EditarUnidadeExecutoraCtrl.$inject = ['$http', '$state', 'UnidadesExecutorasResource', 'UnidadeExecutora'];

	angular.module('REGULACAO').controller('EditarUnidadeExecutoraCtrl', EditarUnidadeExecutoraCtrl);
}());