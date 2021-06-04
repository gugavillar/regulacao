(function () {
	'use strict';
	/*global angular, $*/
	function NovoPacienteCtrl($http, $state, PacientesResource) {
		var vm = this, copy;

		$(document).ready(function () {
			$('#resposta_cep').modal({
				onCloseEnd: function () {
					delete vm.novo.cep_paciente;
					$('#cep_paciente').val('').focus();
				}
			});
		});

		function getEndereco(cep) {
			if (cep) {
				delete $http.defaults.headers.common.Authorization;
				$http.get('https://viacep.com.br/ws/' + cep + '/json/').then(function (data) {
					var endereco = data;
					if (endereco.data.logradouro) {
						vm.novo.logradouro_paciente = endereco.data.logradouro.toUpperCase();
						vm.novo.bairro_paciente = endereco.data.bairro.toUpperCase();
						vm.novo.cidade_paciente = endereco.data.localidade.toUpperCase();
						vm.novo.estado_paciente = endereco.data.uf.toUpperCase();
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
			vm.novo.usuario_paciente = parseInt(sessionStorage.getItem('id'));
			copy = angular.copy(vm.novo);
			delete vm.novo;
			$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
			PacientesResource.save(copy).$promise.then(function (data) {
				if (data.id_paciente) {
					M.toast({html:'Paciente cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
						$state.reload();
						$('html, body').animate({
							scrollTop: $('#dados_paciente').offset().top
						}, 800);
					}
				});
				} else {
					var pattern1 = /CNS UNICO/g;
					var pattern2 = /CPF UNICO/g;
					if (pattern1.test(data.erro)) {
						M.toast({html: 'CNS já existente', inDuration: 1500, classes: 'rounded noprint'});
					} else if (pattern2.test(data.erro)) {
						M.toast({html: 'CPF já existente', inDuration: 1500, classes: 'rounded noprint'});
					} else {
						M.toast({html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint'});
					}
				}
			});
		}
		vm.cadastrar = cadastrar;
	}
	NovoPacienteCtrl.$inject = ['$http', '$state', 'PacientesResource'];

	angular.module('REGULACAO').controller('NovoPacienteCtrl', NovoPacienteCtrl);
}());