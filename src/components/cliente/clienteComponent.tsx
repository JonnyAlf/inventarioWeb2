import React, { useEffect, useState } from "react";
import { ClienteService } from "@/service/customerService";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/Input";
import InputMask from 'react-input-mask'; // Importa o InputMask
import Table from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import Notification from "@/components/ui/notification";

import "./cliente.css";
import "./modal.css";

export type Cliente = {
  id: number;
  nome: string;
  cpf_cnpj: string;
  contato: string;
  endereco: string;
};

const GerenciamentoClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [buscaNome, setBuscaNome] = useState('');
  const [buscaCpfCnpj, setBuscaCpfCnpj] = useState('');
  const [notificacao, setNotificacao] = useState<{ mensagem: string; tipo: "sucesso" | "erro" } | null>(null);
  const [error, setError] = useState<string | null>(null); // Mensagem de erro global

  useEffect(() => {
    buscarClientes();
  }, []);

  useEffect(() => {
    const filtrados = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(buscaNome.toLowerCase()) &&
      cliente.cpf_cnpj.includes(buscaCpfCnpj)
    );
    setClientesFiltrados(filtrados);
  }, [buscaNome, buscaCpfCnpj, clientes]);

  useEffect(() => {
    if (notificacao) {
      const timer = setTimeout(() => {
        setNotificacao(null); // Remove a notificação após 5 segundos
      }, 5000);

      return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado ou a notificação for atualizada
    }
  }, [notificacao]);

  const buscarClientes = async () => {
    try {
      const dados = await ClienteService.listClientes();
      console.log("Dados carregados: ", dados);
      setClientes(dados);
      setClientesFiltrados(dados);
    } catch (error) {
      setNotificacao({ mensagem: 'Erro ao carregar clientes.', tipo: 'erro' });
    }
  };

  const handleAdicionarCliente = () => {
    setClienteSelecionado({ id: 0, nome: '', cpf_cnpj: '', contato: '', endereco: '' });
    setModalAberto(true);
    setError(null);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setModalAberto(true);
    setError(null); // Reseta o erro ao abrir o modal
  };

  const handleDeletarCliente = (id: number) => {
    if (window.confirm("Você tem certeza que deseja deletar este cliente?")) {
      setClientes(clientes.filter(cliente => cliente.id !== id));
      setNotificacao({ mensagem: "Cliente deletado com sucesso.", tipo: "sucesso" });
    }
  };

  const handleSalvarCliente = () => {
    if (clienteSelecionado) {
      const { nome, cpf_cnpj, contato } = clienteSelecionado;

      // Validações
      if (!nome || !cpf_cnpj || !contato) {
        setError('Nome, CPF/CNPJ e Contato são obrigatórios.');
        return;
      }

      // Verifica se o CPF/CNPJ já existe
      const cpfExists = clientes.some(cliente => cliente.cpf_cnpj === cpf_cnpj && cliente.id !== clienteSelecionado.id);
      if (cpfExists) {
        setError('CPF/CNPJ já cadastrado.');
        return;
      }

      if (clienteSelecionado.id === 0) {
        setClientes([...clientes, { ...clienteSelecionado, id: clientes.length + 1 }]);
        setNotificacao({ mensagem: "Cliente adicionado com sucesso.", tipo: "sucesso" });
      } else {
        setClientes(clientes.map(cliente => (cliente.id === clienteSelecionado.id ? clienteSelecionado : cliente)));
        setNotificacao({ mensagem: "Cliente atualizado com sucesso.", tipo: "sucesso" });
      }
      setModalAberto(false);
      setClienteSelecionado(null);
      setError(null); // Reseta o erro após salvar
    }
  };

  return (
    <div>
      <h1>Gerenciamento de Clientes</h1>
      {notificacao && <Notification mensagem={notificacao.mensagem} tipo={notificacao.tipo} onClose={() => setNotificacao(null)} />}
      
      {error && <div className="error-message">{error}</div>}
      
      <Input placeholder="Buscar por nome" value={buscaNome} onChange={(e) => setBuscaNome(e.target.value)} />
      <Input placeholder="Buscar por CPF/CNPJ" value={buscaCpfCnpj} onChange={(e) => setBuscaCpfCnpj(e.target.value)} />
      
      <div className="button-container">
        <Button className="mr-2" onClick={() => {}}>Buscar</Button>
        <Button onClick={handleAdicionarCliente}>Adicionar Cliente</Button>
      </div>

      <div className="overflow-auto h-96 border border-gray-200 rounded">
        <Table head={
          <>
            <th>Nome</th>
            <th>CPF/CNPJ</th>
            <th>Contato</th>
            <th>Endereço</th>
            <th>Ações</th>
          </>
        }>
          {clientesFiltrados.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.cpf_cnpj}</td>
              <td>{cliente.contato}</td>
              <td>{cliente.endereco}</td>
              <td>
                <Button className="mr-2" onClick={() => handleEditarCliente(cliente)}>Editar</Button>
                <Button className="delete" onClick={() => handleDeletarCliente(cliente.id)}>Deletar</Button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {modalAberto && (
        <Modal open={modalAberto} onClose={() => setModalAberto(false)}>
          <h3 className="modal-title">
            {clienteSelecionado?.id === 0 ? 'Adicionar Cliente' : 'Editar Cliente'}
          </h3>
          <div className="modal-content">
            {error && <div className="error-message">{error}</div>} {/* Exibe o erro no modal */}
            <Input
              placeholder="Nome"
              value={clienteSelecionado?.nome}
              onChange={(e) => setClienteSelecionado({ ...clienteSelecionado!, nome: e.target.value })}
            />
            <Input
              mask="999.999.999-99" 
              placeholder="CPF/CNPJ"
              value={clienteSelecionado?.cpf_cnpj}
              onChange={(e) => setClienteSelecionado({ ...clienteSelecionado!, cpf_cnpj: e.target.value })}
            />
            <Input
              placeholder="Contato"
              value={clienteSelecionado?.contato}
              onChange={(e) => setClienteSelecionado({ ...clienteSelecionado!, contato: e.target.value })}
            />
            <Input
              placeholder="Endereço"
              value={clienteSelecionado?.endereco}
              onChange={(e) => setClienteSelecionado({ ...clienteSelecionado!, endereco: e.target.value })}
            />
            <Button className="save" onClick={handleSalvarCliente}>
              Salvar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GerenciamentoClientes;
