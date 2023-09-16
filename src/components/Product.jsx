import React, { useState, useRef, useEffect } from 'react';
import gif from '../image/giphy.gif'; 
import axios from 'axios'; 
import { useParams } from 'react-router-dom'; 

function Product({ products }) {
  const { productId } = useParams(); // Obtenção do parâmetro "productId" da URL usando useParams
  const parsedProductId = parseInt(productId); // Conversão do "productId" para um número inteiro
  const product = products.find((p) => p.id === parsedProductId); // Busca do produto correspondente com base no ID

  const [paidFor, setPaidFor] = useState(false); // Estado para rastrear se o pagamento foi efetuado com sucesso
  const [error, setError] = useState(null); // Estado para rastrear erros de pagamento
  const [formData, setFormData] = useState({ name: '', cpf: '' }); // Estado para armazenar dados do formulário
  const [paymentAllowed, setPaymentAllowed] = useState(false); // Estado para determinar se o pagamento é permitido
  const [paymentStatus, setPaymentStatus] = useState(''); // Estado para armazenar o status do pagamento
  const paypalRef = useRef(); // Referência para o elemento de botões do PayPal

  const handleInputChange = (e) => {
    // Função para lidar com mudanças nos campos de entrada e atualizar os dados do formulário
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { name, cpf } = formData; // Desestruturação dos dados do formulário

  useEffect(() => {
    // Efeito para validar os campos do formulário e permitir o pagamento
    if (!product) {
      console.error('Produto não encontrado'); // Exibir um erro no console se o produto não for encontrado
      return;
    }

    const cleanedCpf = cpf.replace(/[\.-]/g, ''); // Remoção de pontos e traços do CPF
    if (name && cleanedCpf.length === 11 && /^\d+$/.test(cleanedCpf)) {
      setPaymentAllowed(true); // Permitir o pagamento se o nome e o CPF forem válidos
    } else {
      setPaymentAllowed(false); // Impedir o pagamento se os campos não forem válidos
    }
  }, [product, name, cpf]);

  const generateOrderNumber = () => {
    // Função para gerar um número de pedido aleatório
    return Math.floor(Math.random() * 10000).toString();
  };

  const handlePay = async () => {
    // Função para lidar com o pagamento
    const orderNumber = generateOrderNumber(); // Gerar um número de pedido aleatório

    const actions = window.paypal.Buttons({
      // Definir ações dos botões do PayPal
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
        setPaidFor(true); // Definir o estado como pago com sucesso
        setPaymentStatus('Pago'); // Definir o status do pagamento como "Pago"

        const paymentData = {
          product: product.name,
          amount: product.price,
          status: 'Pago',
          customerName: name,
          customerCPF: cpf,
          orderNumber,
        };
        console.log('Dados de pagamento a serem enviados para o servidor:', paymentData);

        await axios.post('http://localhost:5000/api/payment/save-payment', paymentData); // Enviar dados de pagamento para o servidor
      },
      onError: (err) => {
        setError(err); // Definir o estado de erro em caso de erro de pagamento
        setPaymentStatus('Falha no pagamento'); // Definir o status do pagamento como "Falha no pagamento"
        console.error(err); // Exibir o erro no console
      },
    });
    actions.render(paypalRef.current); // Renderizar botões do PayPal usando a referência
  };

  if (!product) {
    return <div>Produto não encontrado</div>; // Renderizar uma mensagem se o produto não for encontrado
  }

  if (paidFor) {
    return (    
      <main className='paypal-form2'>
        <div className='desc2'>
        {paidFor && <p>Status do pagamento: {paymentStatus}</p>} {/* Exibir o status do pagamento */}
          <h1> Pagamento efetuado com sucesso! Seu pagamento pode levar até 30 minutos para ser processado no sistema. {product.name}!</h1>
          <img alt={product.description} src={gif} />
          <a href="/"> Clique aqui para voltar</a>
         
        </div>
      </main>
    );
  }

  return (
    <main className='paypal-form'>
      {error && <div>Uh oh, ocorreu um erro! {error.message}</div>} {/* Exibir erro de pagamento, se houver */}
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
          {!paymentAllowed && <p>Por favor, preencha seu nome e CPF para continuar.</p>}
          <div ref={paypalRef} />
        </div>
      </section>
    </main>
  );
}

export default Product;
