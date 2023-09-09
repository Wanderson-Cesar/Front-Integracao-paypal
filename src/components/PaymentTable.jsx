import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentTable.css';

function PaymentTable() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Faça uma solicitação GET para obter a lista de pagamentos do servidor
    axios.get('http://localhost:5000/api/payment/get-payments')
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error('Erro ao obter a lista de pagamentos:', error);
      });
  }, []);

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
            <th>Name</th>  {/* Adicione a coluna 'Name' */}
            <th>CPF</th>   {/* Adicione a coluna 'CPF' */}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.orderNumber}>
              <td>{payment.orderNumber}</td>
              <td>{payment.product}</td>
              <td>R$ {payment.amount}</td>
              <td>{payment.status}</td>
              <td>{payment.name}</td>  {/* Exiba o nome */}
              <td>{payment.cpf}</td>   {/* Exiba o CPF */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentTable;
