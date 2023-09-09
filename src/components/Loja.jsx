import ItemCard from "./ItemCard";
import styles from "../styles/Itens.module.css";
import { Link } from "react-router-dom";
import { TiThSmallOutline, TiThListOutline, TiChevronRight, TiChevronLeft} from 'react-icons/ti';
import Header from "./Header";
import Footer from "./Footer";
import product1Image from "../image/bike1.png";
import product2Image from "../image/bike2.png";
import product3Image from "../image/bike3.png";
import product4Image from "../image/bike4.png";

function Loja() {

    const products = [
        {
            id: 1,
            image: product1Image,
            price: "R$ 3.999",
            name: "CALOI Atacama F",
        },
        {
            id: 2,
            image: product2Image,
            price: "R$ 7.999",
            name: "CALOI Blackburn",
        },
        {
            id: 3,
            image: product3Image,
            price: "R$ 12.999",
            name: "CALOI Carbon Ibex",
        },
        {
            id: 4,
            image: product4Image,
            price: "R$ 1.999",
            name: "CALOI Wild XS",
        },
    ];
    return(
        <div className={styles.conteudo_mestre}>
        <Header />
            <main className={styles.camisetas_content}>
                <section className={styles.div_filtro}>
                    <h1>Filtre por</h1>
                    <h3>Categorias</h3>
                    <ul>
                        <Link>
                            <li>Roupas</li>
                        </Link>
                        <Link>
                            <li>Sapatos</li>
                        </Link>
                        <Link>
                            <li>Acessorios</li>
                        </Link>
                    </ul>
                    <h3>Cores</h3>
                    <button className={styles.btn1}></button>
                    <button className={styles.btn2}></button>
                    <button className={styles.btn3}></button>
                    <h3>Tipos</h3>
                    <ul>
                        <Link>
                            <li>Corrida</li>
                        </Link>
                        <Link>
                            <li>Caminhada</li>
                        </Link>
                        <Link>
                            <li>Casual</li>
                        </Link>
                        <Link>
                            <li>Social</li>
                        </Link>
                    </ul>
                </section>
                <section className={styles.itens_content}>
                    <h1>Loja</h1>
                <div className={styles.ordem}>
                    <div>
                        <TiThListOutline />
                        <TiThSmallOutline />
                    </div>
                    <div>
                        <span>Ordenar Por:</span>
                        <select>
                            <option>Selecione as opçoes</option>
                            <option>Preço</option>
                        </select>
                    </div>
                </div>
                <div>
                    {products.map((product) => (
                        <ItemCard
                            key={product.id}
                            id={product.id}
                            image={product.image}
                            price={product.price}
                            name={product.name}
                            // Adicione outras props conforme necessário
                        />
                    ))}
                </div>
                    <div className={styles.pages}>
                        <ul>
                            <li><TiChevronLeft /></li>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                            <li><TiChevronRight /></li>
                        </ul>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default Loja;