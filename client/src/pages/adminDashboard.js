import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadAllImages } from '../config/api.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Product form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    images: []
  });
  const [uploading, setUploading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
      fetchOrderStats();
    }
  }, [activeTab, statusFilter]);

  const getToken = () => localStorage.getItem('token');

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/orders', {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: { status: statusFilter }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch order statistics
  const fetchOrderStats = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/orders/stats/summary', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setOrderStats(response.data);
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3001/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchOrders();
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  // Product form handlers
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setForm({ ...form, images: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const imageUrls = await uploadAllImages(form.images);
      
      const product = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        image: imageUrls,
      };

      await axios.post(
        'http://localhost:3001/api/products/addProduct',
        product,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      alert('Product added successfully');
      setForm({ title: '', description: '', price: '', images: [] });
      document.querySelector('input[type="file"]').value = '';
      
    } catch (err) {
      console.error("Error uploading product:", err);
      alert('Error adding product: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      confirmed: '#17a2b8',
      processing: '#fd7e14',
      shipped: '#6f42c1',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Order Details Modal
  const OrderModal = ({ order, onClose }) => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Order Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> {order.customerName}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
          </div>
          
          <div>
            <h3>Product Information</h3>
            <p><strong>Product:</strong> {order.productTitle}</p>
            <p><strong>Size:</strong> {order.size}</p>
            <p><strong>Color:</strong> {order.color}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Price:</strong> {order.productPrice}</p>
            <p><strong>Total:</strong> {order.totalAmount}</p>
          </div>
          
          {order.specialInstructions && (
            <div>
              <h3>Special Instructions</h3>
              <p>{order.specialInstructions}</p>
            </div>
          )}
          
          <div>
            <h3>Order Status</h3>
            <select
              value={order.orderStatus}
              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Dashboard</h1>
      
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '2px solid #eee' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '15px 30px',
            border: 'none',
            background: activeTab === 'orders' ? '#007bff' : 'transparent',
            color: activeTab === 'orders' ? 'white' : '#666',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Orders Management
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '15px 30px',
            border: 'none',
            background: activeTab === 'products' ? '#007bff' : 'transparent',
            color: activeTab === 'products' ? 'white' : '#666',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Add Products
        </button>
      </div>

      {/* Orders Management Tab */}
      {activeTab === 'orders' && (
        <div>
          {/* Order Statistics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Total Orders</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{orderStats.totalOrders || 0}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Pending</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{orderStats.pendingOrders || 0}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Completed</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{orderStats.completedOrders || 0}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>Revenue</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{orderStats.totalRevenue || 0}</p>
            </div>
          </div>

          {/* Filters */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold' }}>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={fetchOrders}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>Loading orders...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Order ID</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Customer</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Product</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Amount</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '15px' }}>{order._id.slice(-8)}</td>
                      <td style={{ padding: '15px' }}>{order.customerName}</td>
                      <td style={{ padding: '15px' }}>{order.productTitle}</td>
                      <td style={{ padding: '15px' }}>{order.totalAmount}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          backgroundColor: getStatusColor(order.orderStatus),
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>{formatDate(order.orderDate)}</td>
                      <td style={{ padding: '15px' }}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {orders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                  No orders found
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Products Tab */}
      {activeTab === 'products' && (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <form onSubmit={handleAddProduct}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Add New Product</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Title *</label>
              <input 
                name="title" 
                placeholder="Enter product title" 
                value={form.title} 
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
              <textarea 
                name="description" 
                placeholder="Enter product description" 
                value={form.description} 
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', minHeight: '100px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price *</label>
              <input 
                name="price" 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={form.price} 
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Images</label>
              <input 
                type="file" 
                name="images" 
                accept="image/*" 
                multiple 
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
              {form.images.length > 0 && (
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Selected {form.images.length} image(s)
                </p>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={uploading}
              style={{ 
                width: '100%', 
                padding: '15px', 
                backgroundColor: uploading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;