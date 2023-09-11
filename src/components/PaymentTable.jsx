import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentTable.css';

function PaymentTable() {
  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editedStatus, setEditedStatus] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payment/get-payments');
        setPayments(response.data);
      } catch (error) {
        console.error('Erro ao obter a lista de pagamentos:', error);
      }
    };

    fetchPayments();
  }, []);

  const openEditForm = (payment) => {
    setEditingPayment(payment);
    setEditedStatus(payment.status);
  };

  const updatePaymentStatus = async () => {
    if (!editingPayment) return;

    try {
      await axios.put(`http://localhost:5000/api/payment/update-status/${editingPayment.orderNumber}`, {
        status: editedStatus,
      });

      
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.orderNumber === editingPayment.orderNumber
            ? { ...payment, status: editedStatus }
            : payment
        )
      );

      
      setEditingPayment(null);
      setEditedStatus('');

      window.alert(`Status do pedido ${editingPayment.orderNumber} atualizado para "${editedStatus}"`);
    } catch (error) {
      console.error('Erro ao atualizar o status de pagamento:', error);
    }
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
            <th>Name</th> {}
            <th>CPF</th> {}
            <th>Editar Status</th> {}
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
              <td>{payment.name}</td> {}
              <td>{payment.cpf}</td> {}
              <td>
                {editingPayment && editingPayment.orderNumber === payment.orderNumber ? (
                  <button onClick={updatePaymentStatus}>Salvar</button>
                ) : (
                  <button onClick={() => openEditForm(payment)}>Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentTable;
