(function () {
	'use strict';
	/*global angular, $*/
	function EditarPacienteCtrl($http, $state, Paciente, PacientesResource) {
		var vm = this, copy;
		vm.novo = Paciente;
		vm.check = parseInt(sessionStorage.getItem('type'));

		$(document).ready(function () {
			M.updateTextFields();
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

		function atualizar() {
			vm.novo.usuario_paciente = parseInt(sessionStorage.getItem('id'));
			copy = angular.copy(vm.novo);
			delete vm.novo;
			$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
			PacientesResource.update({id_paciente: copy.id_paciente}, copy).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({html:'Paciente atualizado com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: function () {
						$state.go('menu.lista_paciente');
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
		vm.atualizar = atualizar;
	}
	EditarPacienteCtrl.$inject = ['$http', '$state', 'Paciente', 'PacientesResource'];

	angular.module('REGULACAO').controller('EditarPacienteCtrl', EditarPacienteCtrl);
}());