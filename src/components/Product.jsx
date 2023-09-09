import React, { useState, useRef, useEffect } from 'react';
import gif from '../image/giphy.gif';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Product({ products }) {
  const { productId } = useParams();
  const parsedProductId = parseInt(productId);
  const product = products.find((p) => p.id === parsedProductId);

  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', cpf: '' });
  const [paymentAllowed, setPaymentAllowed] = useState(false);
  const paypalRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { name, cpf } = formData;

  useEffect(() => {
    if (!product) {
      console.error('Produto não encontrado');
      return;
    }

    const cleanedCpf = cpf.replace(/[\.-]/g, '');
    if (name && cleanedCpf.length === 11 && /^\d+$/.test(cleanedCpf)) {
      setPaymentAllowed(true);
    } else {
      setPaymentAllowed(false);
    }
  }, [product, name, cpf]);

  const generateOrderNumber = () => {
    // Implemente sua lógica para gerar um número de pedido exclusivo aqui
    return Math.floor(Math.random() * 10000).toString();
  };

  const handlePay = async () => {
    const orderNumber = generateOrderNumber();

    const actions = window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: product.description,
              amount: {
                currency_code: 'BRL',
                value: product.price,
              },
            },
          ],
          invoice_id: orderNumber,
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        setPaidFor(true);
        console.log(order);

        const paymentData = {
          product: product.name,
          amount: product.price,
          status: 'Aguardando pagamento',
          customerName: name,
          customerCPF: cpf,
          orderNumber,
        };
        console.log('Dados de pagamento a serem enviados para o servidor:', paymentData);

        // Salve os dados do pagamento no banco de dados (POST)
        await axios.post('http://localhost:5000/api/payment/save-payment', paymentData);

        // Defina um atraso de 1 minuto antes de atualizar o status para "Pago"
        setTimeout(async () => {
          await updatePaymentStatus(orderNumber, 'Pago');
          console.log('Status do pagamento atualizado para "Pago" após 1 minuto.');
        }, 60000); // 60000 milissegundos = 1 minuto
      },
      onError: (err) => {
        setError(err);
        console.error(err);
      },
    });
    actions.render(paypalRef.current);
  };

  const updatePaymentStatus = async (orderNumber, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/payment/update-status/${orderNumber}`, {
        status: newStatus,
      });
      console.log('Status do pagamento atualizado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao atualizar o status do pagamento:', error);
    }
  };

  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  if (paidFor) {
    return (    
      <main className='paypal-form2'>
        <div className='desc2'>
          <h1>Pagamento pre aprovado! Seu pedido pode levar até 30 minutos para ser aprovado no sistema, seu pedido será processado em breve. {product.name}!</h1>
          <img alt={product.description} src={gif} />
          <a href="/"> Clique aqui para voltar</a>
        </div>
      </main>
    );
  }

  return (
    <main className='paypal-form'>
      {error && <div>Uh oh, ocorreu um erro! {error.message}</div>}
      <section className='descricaoItem'>
        <div className='desc1'>
          <h1>{product.name}</h1>
          <img alt={product.description} src={product.image} width="500" />
        </div>
        <div className='desc2'>
          <h1><span>Por apenas: </span>R$ {product.price}</h1>
          <p>{product.description} </p>   
          <h2>Dados Pessoais e Bancários</h2>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input 
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          />
          {name && cpf && (
            <button onClick={handlePay}>Pagar</button>
          )}
          <p>Por favor, preencha seu nome e CPF para continuar.</p>
          <div ref={paypalRef} />
        </div>
      </section>
    </main>
  );
}

export default Product;
