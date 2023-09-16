import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentTable.css';

function PaymentTable() {
  const [payments, setPayments] = useState([]); // Estado para armazenar os pagamentos
  const [editingPayment, setEditingPayment] = useState(null); // Estado para rastrear o pagamento em edição
  const [editedStatus, setEditedStatus] = useState(''); // Estado para rastrear o status editado

  useEffect(() => {
    // Efeito que é executado quando o componente é montado
    const fetchPayments = async () => {
      try {
        // Obtém a lista de pagamentos do servidor
        const response = await axios.get('http://localhost:5000/api/payment/get-payments');
        setPayments(response.data); // Define a lista de pagamentos no estado

        setTimeout(async () => {
          await updatePaymentStatus(response.data);
          console.log('Status dos pagamentos atualizado para "Pago" após 1 minuto.');
        }, 30000); // Atualiza o status dos pagamentos para "Pago" após 30 segundos
      } catch (error) {
        console.error('Erro ao obter a lista de pagamentos:', error);
      }
    };

    fetchPayments(); // Chama a função para buscar os pagamentos ao montar o componente
  }, []);

  const updatePaymentStatus = async () => {
    // Função para atualizar o status do pagamento
    try {
      if (editingPayment) {
        // Se há um pagamento em edição
        await axios.put(`http://localhost:5000/api/payment/update-status/${editingPayment.orderNumber}`, {
          status: editedStatus,
        }); // Faz uma solicitação para atualizar o status do pagamento no servidor
        setEditingPayment(null); // Limpa o estado de edição
        alert(`Pedido ${editingPayment.orderNumber} editado com sucesso.`);
      }
    } catch (error) {
      console.error('Erro ao atualizar o status para "Pago":', error);
    }
  };

  const deletePayment = async (orderNumber) => {
    // Função para excluir um pagamento
    try {
      await axios.delete(`http://localhost:5000/api/payment/delete-payment/${orderNumber}`);
      // Faz uma solicitação para excluir o pagamento com o número do pedido especificado
      const updatedPayments = payments.filter((payment) => payment.orderNumber !== orderNumber);
      setPayments(updatedPayments); // Atualiza a lista de pagamentos após a exclusão
      alert(`Pedido ${orderNumber} excluído com sucesso.`);
    } catch (error) {
      console.error('Erro ao excluir o pedido:', error);
    }
  };

  const openEditForm = (payment) => {
    // Função para abrir o formulário de edição de pagamento
    setEditingPayment(payment); // Define o pagamento em edição
    setEditedStatus(payment.status); // Inicializa o estado de status editado com o status atual
    alert(`Editando pedido ${payment.orderNumber}`);
  };

  return (
    <div>
      <h2>Lista de Pagamentos</h2>
      <table>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Name</th>
            <th>CPF</th>
            <th>Edit Status</th>
            <th>Excluir Pagamento</th> {}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.orderNumber}>
              <td>{payment.orderNumber}</td>
              <td>{payment.product}</td>
              <td>R$ {payment.amount}</td>
              <td>
                {editingPayment && editingPayment.orderNumber === payment.orderNumber ? (
                  <input
                    type="text"
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                  />
                ) : (
                  payment.status
                )}
              </td>
              <td>{payment.name}</td>
              <td>{payment.cpf}</td>
              <td>
                {editingPayment && editingPayment.orderNumber === payment.orderNumber ? (
                  <button onClick={updatePaymentStatus}>Salvar</button>
                ) : (
                  <button onClick={() => openEditForm(payment)}>Editar</button>
                )}
              </td>
              <td>
                <button onClick={() => deletePayment(payment.orderNumber)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentTable;
