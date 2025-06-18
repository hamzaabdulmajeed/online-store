import React, { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
  });
  const [cart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/orders', {
        ...form,
        products: cart,
        totalPrice: cart.reduce((acc, item) => acc + item.price * item.qty, 0),
      });
      alert('Order placed successfully!');
      localStorage.removeItem('cart');
    } catch (err) {
      console.error(err);
      alert('Order failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} required />
      <textarea name="address" placeholder="Shipping Address" onChange={handleChange} required />
      <button type="submit">Place Order</button>
    </form>
  );
};

export default Checkout;
