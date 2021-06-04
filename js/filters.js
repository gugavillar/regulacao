(function () {
	'use strict';
	/*global angular*/
	function Data(dateFilter) {
		return function (input) {
			if (input) {
				var dados = input.split(' '), data, novaData;
				data = dados[0].split('-');
				novaData = new Date(data[0], data[1] - 1, data[2]);
				return dateFilter(novaData, 'dd/MM/yyyy') + ' ' + dados[1];
			}
		};
	}
	Data.$inject = ['dateFilter'];

	function Telefone() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{2})(\d{4,5})(\d{4})$/g, '($1) $2-$3');
				return input;
			}
		};
	}

	function Cep() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{5})(\d{3})$/g, '$1-$2');
				return input;
			}
		};
	}

	function Cpf() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/g, '$1.$2.$3-$4');
				return input;
			}
		};
	}

	function Cns() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{3})(\d{4})(\d{4})(\d{4})$/g, '$1.$2-$3-$4');
				return input;
			}
		};
	}

	function ColorDate() {
		return function (input) {
			if (input) {
				if (input == 3) {
					return 'red-text';
				} else if (input == 2) {
					return 'green-text';
				} else {
					return false;
				}
			}
		};
	}

	function Status() {
		return function (input) {
			if (input) {
				if (input == 1) {
					return 'AGENDADO';
				} else if (input == 2) {
					return 'REALIZADO';
				} else {
					return 'CANCELADO';
				}
			}
		};
	}

	function tipoProfissional() {
		return function (input, documento) {
			if (input) {
				switch (input) {
					case '1':
					return 'CRM' + documento;
					case '2':
					return 'CRO' + documento;
					case '3':
					return 'COREN' + documento;
				}
			}
		};
	}

	function compareDate(dateFilter) {
		var dataCompare = dateFilter(new Date(), 'yyyy-MM-dd');
		return function (input) {
			if (input) {
				var dados = input.split(' '), data, novaData;
				data = dados[0].split('-');
				novaData = dateFilter(new Date(data[0], data[1] - 1, data[2]), 'yyyy-MM-dd');
				if (novaData === dataCompare) {
					return true;
				}
			}
		};
	}
	compareDate.$inject = ['dateFilter'];

	function userType() {
		return function (input) {
			if (input) {
				switch(input) {
					case '1':
					case 1:
					return 'MUNICÍPIO';
					case '2':
					case 2:
					return 'TERCEIRIZADO';
					default:
					return 'ADMINISTRADOR';
				}
			}
		};
	}

	angular.module('REGULACAO').filter('Data', Data).filter('Telefone', Telefone).filter('Cep', Cep).filter('Cpf', Cpf).filter('Cns', Cns).filter('ColorDate', ColorDate).filter('Status', Status).filter('tipoProfissional', tipoProfissional).filter('compareDate', compareDate).filter('userType', userType);
}());