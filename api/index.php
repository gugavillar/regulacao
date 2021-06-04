<?php
date_default_timezone_set('America/Recife');

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once 'vendor/autoload.php';
require_once 'conection_server.php';

$verify = function (Request $request, Response $response, $next) {
	if ($request->hasHeader('Authorization')) {
		$headerValue = $request->getHeaderLine('Authorization');
		$sql = 'SELECT users.token FROM users WHERE users.token = :token';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('token', $headerValue, PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			if ($resp) {
				$response = $next($request, $response);
			} else {
				$response = $response->withStatus(401);
				$erro['erro'] = 'Unauthorized';
				$response->getBody()->write(json_encode($erro));
			}
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	} else {
		$response = $response->withStatus(401);
		$erro['erro'] = 'Unauthorized';
		$response->getBody()->write(json_encode($erro));
	}
	return $response;
};

$GLOBALS['motivo'] = function (Request $request, Response $response, $next) {
	$dados = $request->getParsedBody();
	$sql = 'INSERT INTO motivos (motivos.id_agendamento_motivo, motivos.motivo, motivos.tipo_motivo, motivos.usuario_motivo) VALUES (:id_agendamento, :motivo, :tipo_motivo, :usuario_motivo)';
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam('id_agendamento', $dados['id_agendamento'], PDO::PARAM_INT);
		$stmt->bindParam('motivo', $dados['motivo'], PDO::PARAM_STR);
		$stmt->bindParam('tipo_motivo', $dados['tipo_motivo'], PDO::PARAM_STR);
		$stmt->bindParam('usuario_motivo', $dados['usuario_motivo'], PDO::PARAM_INT);
		$stmt->execute();
		$resp['id_motivo'] = 1;
		$db = null;
		if ($resp['id_motivo'] && $dados['tipo_motivo'] === '2') {
			$response->getBody()->write(json_encode($resp));
			$response = $next($request, $response);
		} else {
			$response = $next($request, $response);
		}
	} catch (PDOException $e) {
		return $e->getMessage();
	}
	return $response;
};

$app = new Slim\App();
$app->group('/login', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'SELECT users.id, users.token, users.flag, users.type, users.business, users.status FROM users WHERE users.user= BINARY :usuario AND users.pass = BINARY PASSWORD(:password)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('usuario', $data['user'], PDO::PARAM_STR);
			$stmt->bindParam('password', $data['pass'], PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->put('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE users SET users.pass = PASSWORD(:novasenha), users.token = :token, users.flag = :flag WHERE users.id = :id';
		$data['token'] = md5($data['user'] . ':' . $data['novasenha'] . time());
		$data['flag'] = 1;
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('novasenha', $data['novasenha'], PDO::PARAM_STR);
			$stmt->bindParam('token', $data['token'], PDO::PARAM_STR);
			$stmt->bindParam('flag', $data['flag'], PDO::PARAM_INT);
			$stmt->bindParam('id', $data['id'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
});

$app->group('/pacientes', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO pacientes (pacientes.cns_paciente, pacientes.cpf_paciente, pacientes.nome_paciente, pacientes.data_nascimento_paciente, pacientes.email_paciente, pacientes.telefone_um_paciente, pacientes.telefone_dois_paciente, pacientes.cep_paciente, pacientes.logradouro_paciente, pacientes.numero_paciente, pacientes.bairro_paciente, pacientes.complemento_paciente, pacientes.cidade_paciente, pacientes.estado_paciente, pacientes.usuario_paciente) VALUES (:cns_paciente, :cpf_paciente, :nome_paciente, :data_nascimento_paciente, :email_paciente, :telefone_um_paciente, :telefone_dois_paciente, :cep_paciente, :logradouro_paciente, :numero_paciente, :bairro_paciente, :complemento_paciente, :cidade_paciente, :estado_paciente, :usuario_paciente)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('cns_paciente', $data['cns_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('cpf_paciente', $data['cpf_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('nome_paciente', $data['nome_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('data_nascimento_paciente', $data['data_nascimento_paciente']);
			$stmt->bindParam('email_paciente', $data['email_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('telefone_um_paciente', $data['telefone_um_paciente'], PDO::PARAM_INT);
			$stmt->bindParam('telefone_dois_paciente', $data['telefone_dois_paciente'], PDO::PARAM_INT);
			$stmt->bindParam('cep_paciente', $data['cep_paciente'], PDO::PARAM_INT);
			$stmt->bindParam('logradouro_paciente', $data['logradouro_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('numero_paciente', $data['numero_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_paciente', $data['bairro_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_paciente', $data['complemento_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('cidade_paciente', $data['cidade_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('estado_paciente', $data['estado_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('usuario_paciente', $data['usuario_paciente'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_paciente'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM pacientes WHERE pacientes.status_paciente = 1';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->get('/{id_paciente}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM pacientes WHERE pacientes.id_paciente = :id_paciente AND pacientes.status_paciente = 1';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_paciente', $arguments['id_paciente'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->delete('/{id_paciente}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE pacientes SET pacientes.status_paciente = 0 WHERE pacientes.id_paciente = :id_paciente';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_paciente', $arguments['id_paciente'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->put('/{id_paciente}', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE pacientes SET pacientes.cns_paciente = :cns_paciente, pacientes.cpf_paciente = :cpf_paciente, pacientes.nome_paciente = :nome_paciente, pacientes.data_nascimento_paciente = :data_nascimento_paciente, pacientes.email_paciente = :email_paciente, pacientes.telefone_um_paciente = :telefone_um_paciente, pacientes.telefone_dois_paciente = :telefone_dois_paciente, pacientes.cep_paciente = :cep_paciente, pacientes.logradouro_paciente = :logradouro_paciente, pacientes.numero_paciente = :numero_paciente, pacientes.bairro_paciente = :bairro_paciente, pacientes.complemento_paciente = :complemento_paciente, pacientes.cidade_paciente = :cidade_paciente, pacientes.estado_paciente = :estado_paciente, pacientes.usuario_paciente = :usuario_paciente WHERE pacientes.id_paciente = :id_paciente';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('cns_paciente', $data['cns_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('cpf_paciente', $data['cpf_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('nome_paciente', $data['nome_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('data_nascimento_paciente', $data['data_nascimento_paciente']);
			$stmt->bindParam('email_paciente', $data['email_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('telefone_um_paciente', $data['telefone_um_paciente'], PDO::PARAM_INT);
			$stmt->bindParam('telefone_dois_paciente', $data['telefone_dois_paciente'], PDO::PARAM_INT);
			$stmt->bindParam('cep_paciente', $data['cep_paciente'], PDO::PARAM_INT);
			$stmt->bindParam('logradouro_paciente', $data['logradouro_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('numero_paciente', $data['numero_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_paciente', $data['bairro_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_paciente', $data['complemento_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('cidade_paciente', $data['cidade_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('estado_paciente', $data['estado_paciente'], PDO::PARAM_STR);
			$stmt->bindParam('usuario_paciente', $data['usuario_paciente'], PDO::PARAM_INT);
			$stmt->bindParam('id_paciente', $arguments['id_paciente'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});
})->add($verify);

$app->group('/unidades_solicitantes', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO unidades_solicitantes (unidades_solicitantes.cod_unidade_solicitante, unidades_solicitantes.nome_unidade_solicitante, unidades_solicitantes.cep_unidade_solicitante, unidades_solicitantes.logradouro_unidade_solicitante, unidades_solicitantes.numero_unidade_solicitante, unidades_solicitantes.bairro_unidade_solicitante, unidades_solicitantes.complemento_unidade_solicitante, unidades_solicitantes.cidade_unidade_solicitante, unidades_solicitantes.estado_unidade_solicitante) VALUES (:cod_unidade_solicitante, :nome_unidade_solicitante, :cep_unidade_solicitante, :logradouro_unidade_solicitante, :numero_unidade_solicitante, :bairro_unidade_solicitante, :complemento_unidade_solicitante, :cidade_unidade_solicitante, :estado_unidade_solicitante)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('cod_unidade_solicitante', $data['cod_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('nome_unidade_solicitante', $data['nome_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('cep_unidade_solicitante', $data['cep_unidade_solicitante'], PDO::PARAM_INT);
			$stmt->bindParam('logradouro_unidade_solicitante', $data['logradouro_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('numero_unidade_solicitante', $data['numero_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_unidade_solicitante', $data['bairro_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_unidade_solicitante', $data['complemento_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('cidade_unidade_solicitante', $data['cidade_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('estado_unidade_solicitante', $data['estado_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->execute();
			$data['id_unidade_solicitante'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});
	$app->get('/{id_unidade_solicitante}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM unidades_solicitantes WHERE unidades_solicitantes.id_unidade_solicitante = :id_unidade_solicitante AND unidades_solicitantes.status_unidade_solicitante = 1';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_unidade_solicitante', $arguments['id_unidade_solicitante'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM unidades_solicitantes WHERE unidades_solicitantes.status_unidade_solicitante = 1 ORDER BY unidades_solicitantes.nome_unidade_solicitante';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->delete('/{id_unidade_solicitante}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE unidades_solicitantes SET unidades_solicitantes.status_unidade_solicitante = 0 WHERE unidades_solicitantes.id_unidade_solicitante = :id_unidade_solicitante';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_unidade_solicitante', $arguments['id_unidade_solicitante'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->put('/{id_unidade_solicitante}', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE unidades_solicitantes SET unidades_solicitantes.nome_unidade_solicitante = :nome_unidade_solicitante, unidades_solicitantes.cod_unidade_solicitante = :cod_unidade_solicitante, unidades_solicitantes.cep_unidade_solicitante = :cep_unidade_solicitante, unidades_solicitantes.logradouro_unidade_solicitante = :logradouro_unidade_solicitante, unidades_solicitantes.numero_unidade_solicitante = :numero_unidade_solicitante, unidades_solicitantes.bairro_unidade_solicitante = :bairro_unidade_solicitante, unidades_solicitantes.complemento_unidade_solicitante = :complemento_unidade_solicitante, unidades_solicitantes.cidade_unidade_solicitante = :cidade_unidade_solicitante, unidades_solicitantes.estado_unidade_solicitante = :estado_unidade_solicitante WHERE unidades_solicitantes.id_unidade_solicitante = :id_unidade_solicitante';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('nome_unidade_solicitante', $data['nome_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('cod_unidade_solicitante', $data['cod_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('cep_unidade_solicitante', $data['cep_unidade_solicitante'], PDO::PARAM_INT);
			$stmt->bindParam('logradouro_unidade_solicitante', $data['logradouro_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('numero_unidade_solicitante', $data['numero_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_unidade_solicitante', $data['bairro_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_unidade_solicitante', $data['complemento_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('cidade_unidade_solicitante', $data['cidade_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('estado_unidade_solicitante', $data['estado_unidade_solicitante'], PDO::PARAM_STR);
			$stmt->bindParam('id_unidade_solicitante', $arguments['id_unidade_solicitante'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});
})->add($verify);

$app->group('/unidades_executoras', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO unidades_executoras (unidades_executoras.nome_unidade_executora, unidades_executoras.cep_unidade_executora, unidades_executoras.logradouro_unidade_executora, unidades_executoras.numero_unidade_executora, unidades_executoras.bairro_unidade_executora, unidades_executoras.complemento_unidade_executora, unidades_executoras.cidade_unidade_executora, unidades_executoras.estado_unidade_executora) VALUES (:nome_unidade_executora, :cep_unidade_executora, :logradouro_unidade_executora, :numero_unidade_executora, :bairro_unidade_executora, :complemento_unidade_executora, :cidade_unidade_executora, :estado_unidade_executora)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('nome_unidade_executora', $data['nome_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('cep_unidade_executora', $data['cep_unidade_executora'], PDO::PARAM_INT);
			$stmt->bindParam('logradouro_unidade_executora', $data['logradouro_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('numero_unidade_executora', $data['numero_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_unidade_executora', $data['bairro_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_unidade_executora', $data['complemento_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('cidade_unidade_executora', $data['cidade_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('estado_unidade_executora', $data['estado_unidade_executora'], PDO::PARAM_STR);
			$stmt->execute();
			$data['id_unidade_executora'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});
	$app->get('/{id_unidade_executora}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM unidades_executoras WHERE unidades_executoras.id_unidade_executora = :id_unidade_executora AND unidades_executoras.status_unidade_executora = 1';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_unidade_executora', $arguments['id_unidade_executora'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM unidades_executoras WHERE unidades_executoras.status_unidade_executora = 1 ORDER BY unidades_executoras.nome_unidade_executora';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->delete('/{id_unidade_executora}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE unidades_executoras SET unidades_executoras.status_unidade_executora = 0 WHERE unidades_executoras.id_unidade_executora = :id_unidade_executora';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_unidade_executora', $arguments['id_unidade_executora'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->put('/{id_unidade_executora}', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE unidades_executoras SET unidades_executoras.nome_unidade_executora = :nome_unidade_executora, unidades_executoras.cep_unidade_executora = :cep_unidade_executora, unidades_executoras.logradouro_unidade_executora = :logradouro_unidade_executora, unidades_executoras.numero_unidade_executora = :numero_unidade_executora, unidades_executoras.bairro_unidade_executora = :bairro_unidade_executora, unidades_executoras.complemento_unidade_executora = :complemento_unidade_executora, unidades_executoras.cidade_unidade_executora = :cidade_unidade_executora, unidades_executoras.estado_unidade_executora = :estado_unidade_executora WHERE unidades_executoras.id_unidade_executora = :id_unidade_executora';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('nome_unidade_executora', $data['nome_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('cep_unidade_executora', $data['cep_unidade_executora'], PDO::PARAM_INT);
			$stmt->bindParam('logradouro_unidade_executora', $data['logradouro_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('numero_unidade_executora', $data['numero_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_unidade_executora', $data['bairro_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_unidade_executora', $data['complemento_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('cidade_unidade_executora', $data['cidade_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('estado_unidade_executora', $data['estado_unidade_executora'], PDO::PARAM_STR);
			$stmt->bindParam('id_unidade_executora', $arguments['id_unidade_executora'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});
	$app->get('/procedimentos/{id_unidade_procedimento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM procedimentos WHERE procedimentos.id_unidade_procedimento = :id_unidade_procedimento ORDER BY procedimentos.procedimento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_unidade_procedimento', $arguments['id_unidade_procedimento'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/procedimentos', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO procedimentos (procedimentos.cod_procedimento, procedimentos.procedimento, procedimentos.id_unidade_procedimento) VALUES (:cod_procedimento, :procedimento, :id_unidade_procedimento)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('cod_procedimento', $data['cod_procedimento'], PDO::PARAM_STR);
			$stmt->bindParam('procedimento', $data['procedimento'], PDO::PARAM_STR);
			$stmt->bindParam('id_unidade_procedimento', $data['id_unidade_procedimento'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_procedimento'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});
	$app->get('/{id_procedimento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM procedimentos WHERE procedimentos.id_procedimento = :id_procedimento AND procedimentos.status_procedimento = 1';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_procedimento', $arguments['id_procedimento'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT procedimentos.id_procedimento, procedimentos.cod_procedimento, procedimentos.procedimento, unidades_executoras.nome_unidade_executora FROM procedimentos INNER JOIN unidades_executoras ON procedimentos.id_unidade_procedimento = unidades_executoras.id_unidade_executora WHERE procedimentos.status_procedimento = 1 ORDER BY procedimentos.procedimento';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->delete('/{id_procedimento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE procedimentos SET procedimentos.status_procedimento = 0 WHERE procedimentos.id_procedimento = :id_procedimento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_procedimento', $arguments['id_procedimento'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/agendamentos', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO agendamentos (agendamentos.id_unidade_executante_agendamento, agendamentos.id_procedimento_agendamento, agendamentos.id_paciente_agendamento, agendamentos.id_unidade_solicitante_agendamento, agendamentos.profissional_solicitante_agendamento, agendamentos.doc_profissional_solicitante_agendamento, agendamentos.data_agendamento, agendamentos.senha_agendamento, agendamentos.usuario_agendamento) VALUES (:id_unidade_executante_agendamento, :id_procedimento_agendamento, :id_paciente_agendamento, :id_unidade_solicitante_agendamento, :profissional_solicitante_agendamento, :doc_profissional_solicitante_agendamento, :data_agendamento, :senha_agendamento, :usuario_agendamento)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_unidade_executante_agendamento', $data['id_unidade_executante_agendamento'], PDO::PARAM_INT);
			$stmt->bindParam('id_procedimento_agendamento', $data['id_procedimento_agendamento'], PDO::PARAM_INT);
			$stmt->bindParam('id_paciente_agendamento', $data['id_paciente_agendamento'], PDO::PARAM_INT);
			$stmt->bindParam('id_unidade_solicitante_agendamento', $data['id_unidade_solicitante_agendamento'], PDO::PARAM_INT);
			$stmt->bindParam('profissional_solicitante_agendamento', $data['profissional_solicitante_agendamento'], PDO::PARAM_INT);
			$stmt->bindParam('doc_profissional_solicitante_agendamento', $data['doc_profissional_solicitante_agendamento'], PDO::PARAM_STR);
			$stmt->bindParam('data_agendamento', $data['data_agendamento']);
			$stmt->bindParam('senha_agendamento', $data['senha_agendamento'], PDO::PARAM_STR);
			$stmt->bindParam('usuario_agendamento', $data['usuario_agendamento'], PDO::PARAM_INT);
			$stmt->execute();
			$data['num_agendamento'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT agendamentos.id_agendamento, agendamentos.num_agendamento, procedimentos.procedimento, pacientes.cpf_paciente, pacientes.cns_paciente, pacientes.nome_paciente, andamento.status_agendamento FROM agendamentos INNER JOIN procedimentos ON agendamentos.id_procedimento_agendamento = procedimentos.id_procedimento INNER JOIN pacientes ON agendamentos.id_paciente_agendamento = pacientes.id_paciente INNER JOIN andamento ON agendamentos.id_agendamento = andamento.id_agendamento_andamento ORDER BY agendamentos.registro_agendamento DESC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->get('/{id_agendamento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT agendamentos.id_agendamento, agendamentos.registro_agendamento, agendamentos.num_agendamento, agendamentos.senha_agendamento, agendamentos.profissional_solicitante_agendamento, agendamentos.doc_profissional_solicitante_agendamento, unidades_executoras.nome_unidade_executora, unidades_executoras.logradouro_unidade_executora, unidades_executoras.numero_unidade_executora, unidades_executoras.bairro_unidade_executora, unidades_executoras.complemento_unidade_executora, unidades_executoras.cidade_unidade_executora, unidades_executoras.estado_unidade_executora, agendamentos.data_agendamento, procedimentos.procedimento, pacientes.nome_paciente, pacientes.cns_paciente, pacientes.data_nascimento_paciente, TIMESTAMPDIFF(YEAR, pacientes.data_nascimento_paciente, NOW()) AS idade, pacientes.logradouro_paciente, pacientes.numero_paciente, pacientes.bairro_paciente, pacientes.complemento_paciente, pacientes.cidade_paciente, pacientes.estado_paciente, pacientes.telefone_um_paciente, pacientes.telefone_dois_paciente, unidades_solicitantes.nome_unidade_solicitante, andamento.status_agendamento FROM agendamentos INNER JOIN unidades_executoras ON agendamentos.id_unidade_executante_agendamento = unidades_executoras.id_unidade_executora INNER JOIN procedimentos ON agendamentos.id_procedimento_agendamento = procedimentos.id_procedimento INNER JOIN pacientes ON agendamentos.id_paciente_agendamento = pacientes.id_paciente INNER JOIN unidades_solicitantes ON agendamentos.id_unidade_solicitante_agendamento = unidades_solicitantes.id_unidade_solicitante INNER JOIN andamento ON agendamentos.id_agendamento = andamento.id_agendamento_andamento WHERE agendamentos.id_agendamento = :id_agendamento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_agendamento', $arguments['id_agendamento'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->put('/{id_agendamento}', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$data['id_agendamento'] = $arguments['id_agendamento'];
		$sql = 'UPDATE agendamentos SET agendamentos.data_agendamento = :data_agendamento WHERE agendamentos.id_agendamento = :id_agendamento';
		try {
			if ($data['tipo_motivo'] == '1') {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam('data_agendamento', $data['data_agendamento']);
				$stmt->bindParam('id_agendamento', $arguments['id_agendamento'], PDO::PARAM_INT);
				$stmt->execute();
				$resp = $stmt->rowCount();
				$db = null;
				$response->getBody()->write(json_encode($resp));
			}
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	})->add($GLOBALS['motivo']);
	$app->get('/motivos/{id_agendamento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM motivos WHERE motivos.id_agendamento_motivo = :id_agendamento ORDER BY motivos.data_motivo DESC';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_agendamento', $arguments['id_agendamento'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->get('/lista/{status_agendamento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT agendamentos.id_agendamento, agendamentos.num_agendamento, procedimentos.procedimento, pacientes.cpf_paciente, pacientes.cns_paciente, pacientes.nome_paciente, andamento.status_agendamento FROM agendamentos INNER JOIN procedimentos ON agendamentos.id_procedimento_agendamento = procedimentos.id_procedimento INNER JOIN pacientes ON agendamentos.id_paciente_agendamento = pacientes.id_paciente INNER JOIN andamento ON agendamentos.id_agendamento = andamento.id_agendamento_andamento WHERE andamento.status_agendamento = :status_agendamento  ORDER BY agendamentos.registro_agendamento DESC';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('status_agendamento', $arguments['status_agendamento'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->get('/empresa/lista/{status_agendamento}/{id_unidade_procedimento}/{data_agendamento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT agendamentos.id_agendamento, agendamentos.num_agendamento, agendamentos.data_agendamento, procedimentos.procedimento, pacientes.cpf_paciente, pacientes.cns_paciente, pacientes.nome_paciente, andamento.status_agendamento FROM agendamentos INNER JOIN procedimentos ON agendamentos.id_procedimento_agendamento = procedimentos.id_procedimento INNER JOIN pacientes ON agendamentos.id_paciente_agendamento = pacientes.id_paciente INNER JOIN andamento ON agendamentos.id_agendamento = andamento.id_agendamento_andamento WHERE andamento.status_agendamento = :status_agendamento AND procedimentos.id_unidade_procedimento = :id_unidade_procedimento AND MONTH(agendamentos.data_agendamento) = MONTH(:data_agendamento) ORDER BY agendamentos.data_agendamento ASC';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('status_agendamento', $arguments['status_agendamento'], PDO::PARAM_INT);
			$stmt->bindParam('id_unidade_procedimento', $arguments['id_unidade_procedimento'], PDO::PARAM_INT);
			$stmt->bindParam('data_agendamento', $arguments['data_agendamento']);
			$stmt->execute();
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
	$app->put('/empresa/agendamentos/{senha_agendamento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE agendamentos SET agendamentos.finalizar_agendamento = NOW() WHERE agendamentos.senha_agendamento = BINARY :senha_agendamento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('senha_agendamento', $arguments['senha_agendamento'], PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/relatorios', function () use ($app) {
	$app->get('/procedimentos/{data_inicio}/{data_fim}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT procedimentos.procedimento, andamento.status_agendamento, COUNT(procedimentos.procedimento) AS total FROM agendamentos INNER JOIN andamento ON agendamentos.id_agendamento = andamento.id_agendamento_andamento INNER JOIN procedimentos ON agendamentos.id_procedimento_agendamento = procedimentos.id_procedimento WHERE DATE(agendamentos.data_agendamento) BETWEEN :data_inicio AND :data_fim GROUP BY procedimentos.procedimento, andamento.status_agendamento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('data_inicio', $arguments['data_inicio']);
			$stmt->bindParam('data_fim', $arguments['data_fim']);
			$stmt->execute();
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/unidades/{data_inicio}/{data_fim}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT unidades_solicitantes.nome_unidade_solicitante, procedimentos.procedimento, andamento.status_agendamento, COUNT(procedimentos.procedimento) AS total FROM agendamentos INNER JOIN andamento ON agendamentos.id_agendamento = andamento.id_agendamento_andamento INNER JOIN procedimentos ON agendamentos.id_procedimento_agendamento = procedimentos.id_procedimento INNER JOIN unidades_solicitantes ON agendamentos.id_unidade_solicitante_agendamento = unidades_solicitantes.id_unidade_solicitante WHERE DATE(agendamentos.data_agendamento) BETWEEN :data_inicio AND :data_fim GROUP BY unidades_solicitantes.nome_unidade_solicitante, procedimentos.procedimento, andamento.status_agendamento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('data_inicio', $arguments['data_inicio']);
			$stmt->bindParam('data_fim', $arguments['data_fim']);
			$stmt->execute();
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/pacientes/{data_inicio}/{data_fim}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT pacientes.nome_paciente, pacientes.cns_paciente, unidades_solicitantes.nome_unidade_solicitante, procedimentos.procedimento, andamento.status_agendamento FROM agendamentos INNER JOIN andamento ON agendamentos.id_agendamento = andamento.id_agendamento_andamento INNER JOIN procedimentos ON agendamentos.id_procedimento_agendamento = procedimentos.id_procedimento INNER JOIN unidades_solicitantes ON agendamentos.id_unidade_solicitante_agendamento = unidades_solicitantes.id_unidade_solicitante INNER JOIN pacientes ON agendamentos.id_paciente_agendamento = pacientes.id_paciente WHERE DATE(agendamentos.data_agendamento) BETWEEN :data_inicio AND :data_fim';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('data_inicio', $arguments['data_inicio']);
			$stmt->bindParam('data_fim', $arguments['data_fim']);
			$stmt->execute();
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/usuarios', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$data['pass'] = 'mudar123';
		$sql = 'INSERT INTO users (users.name, users.user, users.type, users.business, users.pass) VALUES (:name, :user, :type, :business, PASSWORD(:pass))';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('name', $data['name'], PDO::PARAM_STR);
			$stmt->bindParam('user', $data['user'], PDO::PARAM_STR);
			$stmt->bindParam('type', $data['type'], PDO::PARAM_INT);
			$stmt->bindParam('business', $data['business'], PDO::PARAM_INT);
			$stmt->bindParam('pass', $data['pass']);
			$stmt->execute();
			$data['id'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM users WHERE users.status = 1';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/{id}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE users SET users.status = 0 WHERE users.id = :id';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id', $arguments['id'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->put('/{id}', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$data['token'] = md5($arguments['id'] . ':mudar123' . time());
		$sql = "UPDATE users SET users.pass = PASSWORD('mudar123'), users.token = :token, users.flag = 0 WHERE users.id = :id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('token', $data['token'], PDO::PARAM_STR);
			$stmt->bindParam('id', $arguments['id'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->run();
