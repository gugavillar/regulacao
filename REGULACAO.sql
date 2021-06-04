-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 04/06/2021 às 13:26
-- Versão do servidor: 10.3.29-MariaDB-0ubuntu0.20.04.1
-- Versão do PHP: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `REGULACAO`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `CANCELAMENTO` ()  BEGIN
DECLARE marcacao INT;
loop_label: LOOP
SET marcacao = (
    SELECT agendamentos.id_agendamento
    FROM agendamentos
      INNER JOIN andamento ON agendamentos.id_agendamento = andamento.id_agendamento_andamento
    WHERE DATE(agendamentos.data_agendamento) < DATE(NOW())
      AND andamento.status_agendamento = 1
    LIMIT 1
  );
IF marcacao IS NULL THEN LEAVE loop_label;
END IF;
UPDATE andamento
SET andamento.status_agendamento = 3
WHERE andamento.id_agendamento_andamento = marcacao;
END LOOP;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `agendamentos`
--

CREATE TABLE `agendamentos` (
  `id_agendamento` int(11) NOT NULL,
  `num_agendamento` smallint(5) UNSIGNED ZEROFILL NOT NULL,
  `id_unidade_executante_agendamento` int(11) NOT NULL,
  `id_procedimento_agendamento` int(11) NOT NULL,
  `id_paciente_agendamento` int(11) NOT NULL,
  `id_unidade_solicitante_agendamento` int(11) NOT NULL,
  `profissional_solicitante_agendamento` enum('1','2','3') NOT NULL,
  `doc_profissional_solicitante_agendamento` varchar(15) NOT NULL,
  `data_agendamento` datetime NOT NULL,
  `senha_agendamento` varchar(10) NOT NULL,
  `usuario_agendamento` int(11) NOT NULL,
  `finalizar_agendamento` timestamp NULL DEFAULT NULL,
  `registro_agendamento` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `agendamentos`
--
DELIMITER $$
CREATE TRIGGER `INSERT ANDAMENTO` AFTER INSERT ON `agendamentos` FOR EACH ROW INSERT INTO andamento (
    andamento.id_agendamento_andamento,
    andamento.status_agendamento
  )
VALUES (NEW.id_agendamento, 1)
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `NUM AGENDAMENTO E SENHA AGENDAMENTO` BEFORE INSERT ON `agendamentos` FOR EACH ROW IF EXISTS (
    SELECT agendamentos.num_agendamento
    FROM agendamentos
  ) THEN
SET NEW.num_agendamento = (
    SELECT MAX(agendamentos.num_agendamento)
    FROM agendamentos
  ) + 1;
SET NEW.senha_agendamento = (
    SELECT SUBSTRING(UPPER(MD5(RAND())), 1, 10)
  );
CALL CANCELAMENTO();
ELSE
SET NEW.num_agendamento = 1;
SET NEW.senha_agendamento = (
    SELECT SUBSTRING(UPPER(MD5(RAND())), 1, 10)
  );
CALL CANCELAMENTO();
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `UPDATE ANDAMENTO AGENDAMENTO` BEFORE UPDATE ON `agendamentos` FOR EACH ROW IF (NEW.finalizar_agendamento) THEN
UPDATE andamento
SET andamento.status_agendamento = 2
WHERE andamento.id_agendamento_andamento = OLD.id_agendamento;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `andamento`
--

CREATE TABLE `andamento` (
  `id_agendamento_andamento` int(11) NOT NULL,
  `status_agendamento` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `motivos`
--

CREATE TABLE `motivos` (
  `id_agendamento_motivo` int(11) NOT NULL,
  `motivo` text NOT NULL,
  `tipo_motivo` enum('1','2') NOT NULL,
  `data_motivo` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_motivo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `motivos`
--
DELIMITER $$
CREATE TRIGGER `UPDATE ANDAMENTO MOTIVO` BEFORE INSERT ON `motivos` FOR EACH ROW IF (NEW.tipo_motivo = 2) THEN
UPDATE andamento
SET andamento.status_agendamento = 3
WHERE andamento.id_agendamento_andamento = NEW.id_agendamento_motivo;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int(11) NOT NULL,
  `cns_paciente` varchar(15) NOT NULL,
  `cpf_paciente` varchar(11) NOT NULL,
  `nome_paciente` varchar(300) NOT NULL,
  `data_nascimento_paciente` date NOT NULL,
  `email_paciente` varchar(200) DEFAULT NULL,
  `telefone_um_paciente` bigint(11) UNSIGNED NOT NULL,
  `telefone_dois_paciente` bigint(11) UNSIGNED DEFAULT NULL,
  `cep_paciente` int(8) UNSIGNED ZEROFILL NOT NULL,
  `logradouro_paciente` varchar(300) NOT NULL,
  `numero_paciente` varchar(9) NOT NULL,
  `bairro_paciente` varchar(200) NOT NULL,
  `cidade_paciente` varchar(200) NOT NULL,
  `complemento_paciente` varchar(200) DEFAULT NULL,
  `estado_paciente` varchar(2) NOT NULL,
  `usuario_paciente` int(11) NOT NULL,
  `status_paciente` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `procedimentos`
--

CREATE TABLE `procedimentos` (
  `id_procedimento` int(11) NOT NULL,
  `cod_procedimento` varchar(15) NOT NULL,
  `procedimento` varchar(200) NOT NULL,
  `id_unidade_procedimento` int(11) NOT NULL,
  `status_procedimento` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `unidades_executoras`
--

CREATE TABLE `unidades_executoras` (
  `id_unidade_executora` int(11) NOT NULL,
  `nome_unidade_executora` varchar(200) NOT NULL,
  `cep_unidade_executora` int(8) UNSIGNED ZEROFILL NOT NULL,
  `logradouro_unidade_executora` varchar(300) NOT NULL,
  `numero_unidade_executora` varchar(9) NOT NULL,
  `bairro_unidade_executora` varchar(200) NOT NULL,
  `cidade_unidade_executora` varchar(200) NOT NULL,
  `complemento_unidade_executora` varchar(200) DEFAULT NULL,
  `estado_unidade_executora` varchar(2) NOT NULL,
  `status_unidade_executora` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `unidades_solicitantes`
--

CREATE TABLE `unidades_solicitantes` (
  `id_unidade_solicitante` int(11) NOT NULL,
  `cod_unidade_solicitante` varchar(10) NOT NULL,
  `nome_unidade_solicitante` varchar(200) NOT NULL,
  `cep_unidade_solicitante` int(8) UNSIGNED ZEROFILL NOT NULL,
  `logradouro_unidade_solicitante` varchar(300) NOT NULL,
  `numero_unidade_solicitante` varchar(9) NOT NULL,
  `bairro_unidade_solicitante` varchar(200) NOT NULL,
  `cidade_unidade_solicitante` varchar(200) NOT NULL,
  `complemento_unidade_solicitante` varchar(200) DEFAULT NULL,
  `estado_unidade_solicitante` varchar(2) NOT NULL,
  `status_unidade_solicitante` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `user` varchar(10) NOT NULL,
  `pass` varchar(42) NOT NULL,
  `token` varchar(32) NOT NULL DEFAULT '39a79d21c45fa98d20394cd9b5f1617a',
  `flag` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL,
  `business` tinyint(1) NOT NULL,
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `user`, `pass`, `token`, `flag`, `type`, `business`, `status`) VALUES
(1, 'ADMINISTRADOR', 'root', '*BD1E96A8FE3355B8952F1EF08B565FC63D715ADF', '1c8dfa8a8e8bf3981a3c809742e05769', 1, 0, 0, 1);

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `agendamentos`
--
ALTER TABLE `agendamentos`
  ADD PRIMARY KEY (`id_agendamento`),
  ADD UNIQUE KEY `UNICO NUMERO AGENDAMENTO` (`num_agendamento`),
  ADD KEY `ID UNIDADE EXECUTORA` (`id_unidade_executante_agendamento`),
  ADD KEY `ID PROCEDIMENTO` (`id_procedimento_agendamento`),
  ADD KEY `ID PACIENTE` (`id_paciente_agendamento`),
  ADD KEY `ID UNIDADE SOLICITANTE` (`id_unidade_solicitante_agendamento`),
  ADD KEY `ID USUARIO` (`usuario_agendamento`);

--
-- Índices de tabela `andamento`
--
ALTER TABLE `andamento`
  ADD KEY `ID AGENDAMENTO` (`id_agendamento_andamento`);

--
-- Índices de tabela `motivos`
--
ALTER TABLE `motivos`
  ADD KEY `ID AGENDAMENTO` (`id_agendamento_motivo`),
  ADD KEY `ID DO USUARIO` (`usuario_motivo`);

--
-- Índices de tabela `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`),
  ADD UNIQUE KEY `UNICO CARTAO SUS PACIENTE` (`cns_paciente`),
  ADD UNIQUE KEY `UNICO CPF PACIENTE` (`cpf_paciente`),
  ADD KEY `ID USUARIO PACIENTE` (`usuario_paciente`);

--
-- Índices de tabela `procedimentos`
--
ALTER TABLE `procedimentos`
  ADD PRIMARY KEY (`id_procedimento`),
  ADD UNIQUE KEY `UNICO CODIGO PROCEDIMENTO` (`cod_procedimento`,`id_unidade_procedimento`) USING BTREE,
  ADD KEY `ID UNIDADE EXECUTORA PROCEDIMENTO` (`id_unidade_procedimento`);

--
-- Índices de tabela `unidades_executoras`
--
ALTER TABLE `unidades_executoras`
  ADD PRIMARY KEY (`id_unidade_executora`),
  ADD UNIQUE KEY `UNICA UNIDADE EXECUTORA` (`nome_unidade_executora`);

--
-- Índices de tabela `unidades_solicitantes`
--
ALTER TABLE `unidades_solicitantes`
  ADD PRIMARY KEY (`id_unidade_solicitante`),
  ADD UNIQUE KEY `UNICO CODIGO UNIDADE SOLICITANTE` (`cod_unidade_solicitante`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNICO USUARIO` (`user`) USING BTREE;

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `agendamentos`
--
ALTER TABLE `agendamentos`
  MODIFY `id_agendamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `procedimentos`
--
ALTER TABLE `procedimentos`
  MODIFY `id_procedimento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `unidades_executoras`
--
ALTER TABLE `unidades_executoras`
  MODIFY `id_unidade_executora` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `unidades_solicitantes`
--
ALTER TABLE `unidades_solicitantes`
  MODIFY `id_unidade_solicitante` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `agendamentos`
--
ALTER TABLE `agendamentos`
  ADD CONSTRAINT `agendamentos_ibfk_1` FOREIGN KEY (`id_paciente_agendamento`) REFERENCES `pacientes` (`id_paciente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `agendamentos_ibfk_2` FOREIGN KEY (`id_unidade_executante_agendamento`) REFERENCES `unidades_executoras` (`id_unidade_executora`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `agendamentos_ibfk_3` FOREIGN KEY (`id_unidade_solicitante_agendamento`) REFERENCES `unidades_solicitantes` (`id_unidade_solicitante`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `agendamentos_ibfk_4` FOREIGN KEY (`id_procedimento_agendamento`) REFERENCES `procedimentos` (`id_procedimento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `agendamentos_ibfk_5` FOREIGN KEY (`usuario_agendamento`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `andamento`
--
ALTER TABLE `andamento`
  ADD CONSTRAINT `andamento_ibfk_1` FOREIGN KEY (`id_agendamento_andamento`) REFERENCES `agendamentos` (`id_agendamento`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `motivos`
--
ALTER TABLE `motivos`
  ADD CONSTRAINT `motivos_ibfk_1` FOREIGN KEY (`id_agendamento_motivo`) REFERENCES `agendamentos` (`id_agendamento`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `motivos_ibfk_2` FOREIGN KEY (`usuario_motivo`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`usuario_paciente`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `procedimentos`
--
ALTER TABLE `procedimentos`
  ADD CONSTRAINT `procedimentos_ibfk_1` FOREIGN KEY (`id_unidade_procedimento`) REFERENCES `unidades_executoras` (`id_unidade_executora`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
