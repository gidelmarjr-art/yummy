import React from "react";
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa";
import "./Carrinho_Item.css";

export default function Carrinho_Item({ item, onQuantityChange, onRemove }) {
  return (
    <div className="cart-item-card">
      <div className="cart-item-img-container">
        <img src={item.image} alt={item.title} className="cart-item-img" />
      </div>

      <div className="cart-item-info">
        <div className="cart-item-header">
          <h3 className="cart-item-title">{item.title}</h3>
          <button 
            className="remove-btn" 
            onClick={() => onRemove(item.id)}
            title="Remover do carrinho"
          >
            <FaTrashAlt />
          </button>
        </div>

        <p className="cart-item-desc">{item.desc}</p>

        <div className="cart-item-footer">
          <span className="cart-item-price">
            {(item.price * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>

          <div className="quantity-controls">
            <button 
              className="qty-btn" 
              onClick={() => onQuantityChange(item.id, -1)}
              disabled={item.quantity <= 1}
            >
              <FaMinus />
            </button>
            <span className="qty-number">{item.quantity}</span>
            <button 
              className="qty-btn" 
              onClick={() => onQuantityChange(item.id, 1)}
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}