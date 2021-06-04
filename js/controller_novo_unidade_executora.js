(function () {
	'use strict';
	/*global angular, $*/
	function NovoUnidadeExecutoraCtrl($http, $state, UnidadesExecutorasResource) {
		var vm = this, copy;

		$(document).ready(function () {
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

		function cadastrar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
			UnidadesExecutorasResource.unidades().save(copy).$promise.then(function (data) {
				if (data.id_unidade_executora) {
					M.toast({html:'Unidade cadastrada com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
						$state.reload();
						$('html, body').animate({
							scrollTop: $('#dados_unidade').offset().top
						}, 800);
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
		vm.cadastrar = cadastrar;
	}
	NovoUnidadeExecutoraCtrl.$inject = ['$http', '$state', 'UnidadesExecutorasResource'];

	angular.module('REGULACAO').controller('NovoUnidadeExecutoraCtrl', NovoUnidadeExecutoraCtrl);
}());