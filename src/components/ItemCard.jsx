//import { Link } from "react-router-dom";
import styles from "../styles/ItemCard.module.css";

function ItemCard({ id, image, price, name }) {
    return (
      <div className={styles.card_Item}>
        <img src={image} alt="Imagem do item" />
        <h4>{name}</h4>
        <span>{price}</span>
        {/* Altere o link para usar o ID do produto ou uma rota dinâmica */}
        <a href={`/Produto/${id}`}> Comprar</a>


      </div>
    );
  }
    
export default ItemCard;