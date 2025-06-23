
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
     colors: [],
  sizes: [],
  currentColor: '',
  currentSize: '',
    images: []
  });
  const [uploading, setUploading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');

  // Payment slip state
  const [paymentSlipModal, setPaymentSlipModal] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [imageLoadErrors, setImageLoadErrors] = useState({});

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
      const response = await axios.get('https://stylishmenshoes.vercel.app/api/orders', {
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
      const response = await axios.get('https://stylishmenshoes.vercel.app/api/orders/stats/summary', {
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
        `https://stylishmenshoes.vercel.app/api/orders/${orderId}/status`,
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

  // Payment slip image handlers
  const handleImageLoad = (imageId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageId]: false
    }));
  };

  const handleImageLoadStart = (imageId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  const handleImageError = (imageId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [imageId]: true
    }));
    setImageLoadingStates(prev => ({
      ...prev,
      [imageId]: false
    }));
  };

  // Check if payment method is online
  const isOnlinePayment = (paymentMethod) => {
    const onlinePaymentMethods = ['bank_transfer', 'easypaisa', 'jazzcash', 'online', 'card'];
    return onlinePaymentMethods.includes(paymentMethod?.toLowerCase());
  };

  // Get payment method display name
  const getPaymentMethodName = (paymentMethod) => {
    const paymentNames = {
      'cod': 'Cash on Delivery',
      'bank_transfer': 'Bank Transfer',
      'easypaisa': 'EasyPaisa',
      'jazzcash': 'JazzCash',
      'online': 'Online Payment',
      'card': 'Credit/Debit Card'
    };
    return paymentNames[paymentMethod?.toLowerCase()] || paymentMethod;
  };

  // Product form handlers
  const handleChange = (e) => {
  const { name, value, files } = e.target;
  
  if (name === 'images' && files) {
    setForm(prev => ({ ...prev, images: Array.from(files) }));
  } else {
    setForm(prev => ({ ...prev, [name]: value }));
  }
};
const addColor = () => {
  if (form.currentColor.trim() && !form.colors.includes(form.currentColor.trim())) {
    setForm(prev => ({
      ...prev,
      colors: [...prev.colors, prev.currentColor.trim()],
      currentColor: ''
    }));
  }
};

const removeColor = (colorToRemove) => {
  setForm(prev => ({
    ...prev,
    colors: prev.colors.filter(color => color !== colorToRemove)
  }));
};

const addSize = () => {
  if (form.currentSize.trim() && !form.sizes.includes(form.currentSize.trim())) {
    setForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, prev.currentSize.trim()],
      currentSize: ''
    }));
  }
};

const removeSize = (sizeToRemove) => {
  setForm(prev => ({
    ...prev,
    sizes: prev.sizes.filter(size => size !== sizeToRemove)
  }));
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
      colors: form.colors,
      sizes: form.sizes
    };

    await axios.post(
      'https://stylishmenshoes.vercel.app/api/products/addProduct',
      product,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );

    alert('Product added successfully');
    setForm({ 
      title: '', 
      description: '', 
      price: '', 
      images: [],
      colors: [],
      sizes: [],
      currentColor: '',
      currentSize: ''
    });
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

  // Payment Slip Modal Component
  const PaymentSlipModal = ({ order, onClose }) => {
  const imageId = `payment-slip-${order._id}`;
  const isLoading = imageLoadingStates[imageId];
  const hasError = imageLoadErrors[imageId];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleViewFullSize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newWindow = window.open();
    newWindow.document.write(`
      <html>
        <head><title>Payment Slip</title></head>
        <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#000;">
          <img src="${order.paymentSlip}" style="max-width:100%;max-height:100vh;" />
        </body>
      </html>
    `);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(order.paymentSlip);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payment-slip-${order._id.slice(-8)}.jpg`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback method
      const link = document.createElement('a');
      link.href = order.paymentSlip;
      link.download = `payment-slip-${order._id.slice(-8)}.jpg`;
      link.target = '_blank';
      link.click();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1001,
        padding: '20px'
      }}
      onMouseDown={handleBackdropClick}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          borderBottom: '2px solid #eee',
          paddingBottom: '15px'
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#333' }}>Payment Slip</h2>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              Order ID: {order._id.slice(-8)} | {getPaymentMethodName(order.paymentMethod)}
            </p>
          </div>
          <button 
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '28px', 
              cursor: 'pointer',
              color: '#999',
              padding: '5px',
              lineHeight: '1',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          {order.paymentSlip ? (
            <div>
              {isLoading && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                </div>
              )}
              
              {hasError ? (
                <div style={{
                  padding: '40px',
                  backgroundColor: '#fee',
                  border: '2px dashed #fcc',
                  borderRadius: '8px',
                  color: '#c33',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '18px', margin: '0 0 10px 0' }}>⚠️ Failed to load payment slip</p>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImageLoadErrors(prev => ({ ...prev, [imageId]: false }));
                      setImageLoadingStates(prev => ({ ...prev, [imageId]: true }));
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div>
                  <img
                    src={order.paymentSlip}
                    alt="Payment Slip"
                    onLoad={() => handleImageLoad(imageId)}
                    onLoadStart={() => handleImageLoadStart(imageId)}
                    onError={() => handleImageError(imageId)}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '600px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      display: hasError ? 'none' : 'block'
                    }}
                  />
                  
                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onMouseDown={handleViewFullSize}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      📷 View Full Size
                    </button>
                    <button
                      type="button"  
                      onMouseDown={handleDownload}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      💾 Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: '60px 20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              color: '#666',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '18px', margin: '0 0 10px 0' }}>📄 No payment slip uploaded</p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Customer paid via {getPaymentMethodName(order.paymentMethod)} but hasn't uploaded a payment slip yet.
              </p>
            </div>
          )}
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Order Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div><strong>Customer:</strong> {order.customerName}</div>
            <div><strong>Amount:</strong> {order.totalAmount}</div>
            <div><strong>Payment Method:</strong> {getPaymentMethodName(order.paymentMethod)}</div>
            <div><strong>Status:</strong> {order.orderStatus}</div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
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

          <div>
            <h3>Payment Information</h3>
            <p><strong>Payment Method:</strong> {getPaymentMethodName(order.paymentMethod)}</p>
            {isOnlinePayment(order.paymentMethod) && (
              <div style={{ marginTop: '10px' }}>
                {order.paymentSlip ? (
                  <button
                    onClick={() => setPaymentSlipModal(order)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    📄 View Payment Slip
                  </button>
                ) : (
                  <span style={{
                    color: '#dc3545',
                    fontSize: '14px',
                    fontStyle: 'italic'
                  }}>
                    ⚠️ Payment slip not uploaded yet
                  </span>
                )}
              </div>
            )}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minMax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
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
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Payment</th>
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
                        <div style={{ fontSize: '12px' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                            {getPaymentMethodName(order.paymentMethod)}
                          </div>
                          {isOnlinePayment(order.paymentMethod) && (
                            <div style={{
                              color: order.paymentSlip ? '#28a745' : '#dc3545',
                              fontSize: '10px'
                            }}>
                              {order.paymentSlip ? '✓ Slip uploaded' : '⚠ No slip'}
                            </div>
                          )}
                        </div>
                      </td>
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
                        <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                          >
                            View Details
                          </button>
                          {isOnlinePayment(order.paymentMethod) && order.paymentSlip && (
                            <button
                              onClick={() => setPaymentSlipModal(order)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px'
                              }}
                            >
                              Payment Slip
                            </button>
                          )}
                        </div>
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

      {/* Colors Section */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Available Colors</label>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          <input
            name="currentColor"
            placeholder="Enter color (e.g., Red, Blue, #FF0000)"
            value={form.currentColor}
            onChange={handleChange}
            style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
          <button
            type="button"
            onClick={addColor}
            style={{ 
              padding: '8px 15px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
        {form.colors.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {form.colors.map((color, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '0'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sizes Section */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Available Sizes</label>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          <input
            name="currentSize"
            placeholder="Enter size (e.g., S, M, L, XL, 32, 34)"
            value={form.currentSize}
            onChange={handleChange}
            style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
          <button
            type="button"
            onClick={addSize}
            style={{ 
              padding: '8px 15px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
        {form.sizes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {form.sizes.map((size, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '0'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
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
      {paymentSlipModal && (
        <PaymentSlipModal
          order={paymentSlipModal}
          onClose={() => setPaymentSlipModal(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;