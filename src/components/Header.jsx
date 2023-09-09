import styles from '../styles/Header.module.css';
import { VscMenu, VscSearch } from "react-icons/vsc";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from "../image/logo.png"

function Header() {
    const [MenuHamburguer, setMenuHamburguer] = useState(false);

    const openMenu = (e) => {
        setMenuHamburguer(!MenuHamburguer);
    }
    return(
        <header className={styles.header_content}>
            <div className={styles.acesso}>
                <p>
                    <Link to="/">
                        Acesse sua conta
                    </Link> ou <Link to="/"> Cadastra-se </Link>
                </p>
            </div>
            <div className={styles.div_head}>
                <button className={styles.btn1}>
                    <VscMenu onClick={openMenu}/>
                </button>
                <img src={logo} alt='Logo oficial do site' />
                <input type="text" />
                <button className={styles.btn2}>
                    <VscSearch />
                </button>
            </div>
            <div className={`${styles.div_nav} ${MenuHamburguer ? styles.open : ''}`}>
                    <nav>
                        <ul>
                            <Link to="/">
                                <li>Pagina Inicial</li>
                            </Link>
                            <Link to="/Camisetas">
                                <li>Camisetas</li>
                            </Link>
                            <Link to="/Calcas">
                                <li>Calças</li>
                            </Link>
                            <Link to="/">
                                <li>Sapatos</li>
                            </Link>
                            <Link to="/">
                                <li>Contato</li>
                            </Link>
                        </ul>
                    </nav>
            </div>
        </header>
    );
}

export default Header;