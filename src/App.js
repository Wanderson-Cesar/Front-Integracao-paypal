import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loja from './components/Loja';
import product1Image from "./image/bike1.png";
import product2Image from "./image/bike2.png";
import product3Image from "./image/bike3.png";
import product4Image from "./image/bike4.png";
import Product from './components/Product';
import PaymentTable from './components/PaymentTable';


const products = [
  {
    id: 1,
    price: 3999,
    name: 'CALOI Atacama F',
    description: 'Para trilhas leves ou passeios ao ar livre, a Atacama é a bicicleta ideal para quem deseja iniciar a prática do Mountain Bike.',
    image: product1Image,
  },
  {
    id: 2,
    price: 7999,
    name: 'CALOI Blackburn',
    description: 'A Blackburn é a mountain bike para quem busca um desempenho acima da média, ideal para quem deseja superar sua performance.',
    image: product2Image,
  },
  {
    id: 3,
    price: 12999,
    name: 'CALOI Carbon Ibex',
    description: 'A Carbon Ibex é uma bike de carbono, ou seja é mais leve e ao mesmo tempo mais resistente do que as bikes de alumínio.',
    image: product3Image,
  },
  {
    id: 4,
    price: 1999,
    name: 'CALOI Wild XS',
    description: 'Com estilo agressivo e quadro de alumínio, a Wild XS é perfeita para se divertir e sair na frente na competição com os amigos!',
    image: product4Image,
  },
];

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Loja products={products} />} />
          <Route
            path="/Produto/:productId"
            element={<Product products={products} />}
          />
          <Route path="/Pagamentos" element={<PaymentTable />} />
        </Routes>
      </Router>
    </div>
  );
}


export default App;
