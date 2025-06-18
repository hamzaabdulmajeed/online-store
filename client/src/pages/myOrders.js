// Cart.js
import React, { useEffect, useState } from 'react';
import { getMyOrders, updateOrder, cancelOrder } from '../config/api';
import { useNavigate } from 'react-router-dom';


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editData, setEditData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const navigate = useNavigate();

  const shoeSizes = ['40', '41', '42', '43', '44'];
  const colors = ['Black', 'White', 'Brown', 'Red', 'Blue', 'Gray', 'Navy'];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!isAuthenticated || !userId || !authToken) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getMyOrders(userId);
        setOrders(data);
        
        // Initialize current image indexes for each order
        const initialIndexes = {};
        data.forEach(order => {
          initialIndexes[order._id] = 0;
        });
        setCurrentImageIndexes(initialIndexes);
        
      } catch (err) {
        console.error('Error fetching orders:', err);
        
        if (err.message.includes('Authentication') || err.message.includes('token')) {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          navigate('/login');
        } else {
          setError(err.message || 'Failed to load your orders.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Handle image loading state
  const handleImageLoad = (orderId, imageIndex) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [`${orderId}-${imageIndex}`]: false
    }));
  };

  const handleImageLoadStart = (orderId, imageIndex) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [`${orderId}-${imageIndex}`]: true
    }));
  };

  const handleImageError = (orderId, imageIndex) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [`${orderId}-${imageIndex}`]: true
    }));
    setImageLoadingStates(prev => ({
      ...prev,
      [`${orderId}-${imageIndex}`]: false
    }));
  };

  // Get all images from order data
  const getOrderImages = (order) => {
    // Check multiple possible locations for images
    if (order.product?.image) {
      if (Array.isArray(order.product.image) && order.product.image.length > 0) {
        return order.product.image;
      }
      if (typeof order.product.image === 'string') {
        return [order.product.image];
      }
    }
    
    if (order.productImage) {
      if (Array.isArray(order.productImage) && order.productImage.length > 0) {
        return order.productImage;
      }
      if (typeof order.productImage === 'string') {
        return [order.productImage];
      }
    }
    
    if (order.image) {
      if (Array.isArray(order.image) && order.image.length > 0) {
        return order.image;
      }
      if (typeof order.image === 'string') {
        return [order.image];
      }
    }
    
    return [];
  };

  // Image navigation functions
  const nextImage = (orderId, totalImages) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [orderId]: (prev[orderId] + 1) % totalImages
    }));
  };

  const prevImage = (orderId, totalImages) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [orderId]: prev[orderId] === 0 ? totalImages - 1 : prev[orderId] - 1
    }));
  };

  const goToImage = (orderId, index) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [orderId]: index
    }));
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  // Handle starting edit mode
  const handleEditOrder = (order) => {
    setEditingOrder(order._id);
    setEditData({
      customerName: order.customerName || '',
      email: order.email || '',
      phone: order.phone || '',
      address: order.address || '',
      size: order.size || '',
      color: order.color || '',
      quantity: order.quantity || 1,
      specialInstructions: order.specialInstructions || ''
    });
  };

  // Handle input changes in edit mode
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save edited order
  const handleSaveEdit = async (orderId) => {
    if (!validateEmail(editData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!validatePhone(editData.phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      setUpdating(true);
      
      const originalOrder = orders.find(order => order._id === orderId);
      const updatedOrderData = {
        ...editData,
        totalAmount: originalOrder.productPrice * editData.quantity
      };

      const response = await updateOrder(orderId, updatedOrderData);
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { 
                ...order, 
                ...updatedOrderData,
                updatedAt: response.order ? response.order.updatedAt : new Date().toISOString()
              }
            : order
        )
      );
      
      setEditingOrder(null);
      setEditData({});
      alert('Order updated successfully!');
      
    } catch (err) {
      console.error('Error updating order:', err);
      alert(err.message || 'Failed to update order. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditData({});
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    try {
      setUpdating(true);
      
      const response = await cancelOrder(orderId);
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { 
                ...order, 
                orderStatus: response.order ? response.order.orderStatus : 'cancelled',
                cancelledAt: response.order ? response.order.cancelledAt : new Date().toISOString(),
                updatedAt: response.order ? response.order.updatedAt : new Date().toISOString()
              }
            : order
        )
      );
      
      alert('Order cancelled successfully!');
      
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.message || 'Failed to cancel order. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Check if order can be edited/cancelled
  const canModifyOrder = (order) => {
    const nonModifiableStatuses = ['shipped', 'delivered', 'cancelled'];
    return !nonModifiableStatuses.includes(order.orderStatus?.toLowerCase());
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      'pending': '#ffc107',
      'confirmed': '#17a2b8',
      'processing': '#007bff',
      'shipped': '#28a745',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    };
    return statusColors[status?.toLowerCase()] || '#6c757d';
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontSize: '18px',
        color: '#666'
      }}>
        <div style={{
          display: 'inline-block',
          width: '20px',
          height: '20px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginRight: '10px'
        }}></div>
        Loading your orders...
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '20px',
          color: '#c33'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Error Loading Orders</h3>
          <p style={{ margin: '0 0 15px 0' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No orders state
  if (orders.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>My Orders</h2>
        <p style={{ color: '#666', fontSize: '18px' }}>You haven't placed any orders yet.</p>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // Main render
 return (
    <div style={{ 
      padding: '12px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Mobile responsive styles */
          @media (max-width: 768px) {
            .order-grid {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            
            .product-details-grid {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            
            .edit-form-grid {
              grid-template-columns: 1fr !important;
            }
            
            .order-header {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 12px !important;
            }
            
            .action-buttons {
              flex-direction: column !important;
            }
            
            .image-section {
              width: 100% !important;
              max-width: 250px !important;
              margin: 0 auto !important;
            }
            
            .order-card {
              padding: 16px !important;
            }
          }

          @media (max-width: 480px) {
            .order-card {
              padding: 12px !important;
            }
            
            .image-section {
              max-width: 200px !important;
            }
            
            .order-title {
              font-size: 16px !important;
            }
            
            .product-title {
              font-size: 14px !important;
            }
          }
        `}
      </style>

      <h2 style={{ 
        color: '#333', 
        marginBottom: '24px',
        textAlign: 'center',
        fontSize: 'clamp(20px, 4vw, 24px)'
      }}>
        My Orders ({orders.length})
      </h2>
      
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {orders.map((order) => {
          const images = getOrderImages(order);
          const currentImageIndex = currentImageIndexes[order._id] || 0;
          const currentImage = images[currentImageIndex];
          const isImageLoading = imageLoadingStates[`${order._id}-${currentImageIndex}`];
          const hasImageError = imageLoadErrors[`${order._id}-${currentImageIndex}`];
          
          return (
            <div key={order._id} className="order-card" style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* Order Header */}
              <div className="order-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                borderBottom: '1px solid #eee',
                paddingBottom: '15px'
              }}>
                <div>
                  <h3 className="order-title" style={{ 
                    margin: '0 0 5px 0',
                    color: '#333',
                    fontSize: '18px'
                  }}>
                    Order #{order._id?.slice(-8) || 'N/A'}
                  </h3>
                  <p style={{ 
                    margin: '0',
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span style={{
                  backgroundColor: getStatusColor(order.orderStatus),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  {order.orderStatus || 'Pending'}
                </span>
              </div>

              {/* Product and Order Details in Grid */}
              <div className="order-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '20px',
                alignItems: 'start'
              }}>
                
                {/* Product Image Section with Navigation */}
                <div className="image-section" style={{ width: '200px' }}>
                  {images.length > 0 ? (
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                      {/* Loading overlay */}
                      {isImageLoading && (
                        <div style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          bottom: '0',
                          backgroundColor: 'rgba(248, 249, 250, 0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                          borderRadius: '8px'
                        }}>
                          <div style={{
                            width: '30px',
                            height: '30px',
                            border: '3px solid #f3f3f3',
                            borderTop: '3px solid #007bff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                        </div>
                      )}
                      
                      <img 
                        src={hasImageError 
                          ? 'https://via.placeholder.com/200x200/f8f9fa/6c757d?text=Image+Not+Found'
                          : currentImage
                        } 
                        alt={order.product?.title || order.productTitle || 'Product'}
                        style={{ 
                          width: '100%', 
                          height: 'auto',
                          aspectRatio: '1/1',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          transition: 'opacity 0.3s ease',
                          opacity: isImageLoading ? 0.3 : 1,
                          border: '1px solid #eee'
                        }}
                        onLoadStart={() => handleImageLoadStart(order._id, currentImageIndex)}
                        onLoad={() => handleImageLoad(order._id, currentImageIndex)}
                        onError={() => handleImageError(order._id, currentImageIndex)}
                      />
                      
                      {/* Navigation arrows - only show if multiple images and images are loaded */}
                      {images.length > 1 && !isImageLoading && (
                        <>
                          <button 
                            onClick={() => prevImage(order._id, images.length)}
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                              zIndex: 1
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(0,0,0,0.9)';
                              e.target.style.transform = 'translateY(-50%) scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(0,0,0,0.7)';
                              e.target.style.transform = 'translateY(-50%) scale(1)';
                            }}
                          >
                            ‹
                          </button>
                          <button 
                            onClick={() => nextImage(order._id, images.length)}
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                              zIndex: 1
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(0,0,0,0.9)';
                              e.target.style.transform = 'translateY(-50%) scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(0,0,0,0.7)';
                              e.target.style.transform = 'translateY(-50%) scale(1)';
                            }}
                          >
                            ›
                          </button>
                        </>
                      )}
                      
                      {/* Image counter */}
                      {images.length > 1 && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6c757d',
                      fontSize: '14px',
                      textAlign: 'center',
                      marginBottom: '16px'
                    }}>
                      📷 No Image Available
                    </div>
                  )}
                  
                  {/* Image indicators with click functionality */}
                  {images.length > 1 && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      gap: '6px',
                      marginTop: '8px'
                    }}>
                      {images.map((_, index) => (
                        <div
                          key={index}
                          onClick={() => goToImage(order._id, index)}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: index === currentImageIndex ? '#007bff' : '#ccc',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            transform: index === currentImageIndex ? 'scale(1.2)' : 'scale(1)'
                          }}
                          onMouseEnter={(e) => {
                            if (index !== currentImageIndex) {
                              e.target.style.background = '#999';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (index !== currentImageIndex) {
                              e.target.style.background = '#ccc';
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Product and Order Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="product-details-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px'
                  }}>
                    
                    {/* Product Details */}
                    <div>
                      <h4 style={{ 
                        margin: '0 0 12px 0',
                        color: '#007bff',
                        fontSize: '16px'
                      }}>
                        Product Details
                      </h4>
                      
                      <div style={{ marginBottom: '8px' }}>
                        <strong className="product-title" style={{ color: '#333', fontSize: '15px' }}>
                          {order.product?.title || order.productTitle || 'Product Name Not Available'}
                        </strong>
                      </div>
                      
                      {(order.product?.description || order.productDescription) && (
                        <p style={{
                          margin: '0 0 8px 0',
                          color: '#666',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          wordBreak: 'break-word'
                        }}>
                          {((order.product?.description || order.productDescription).length > 100 
                            ? `${(order.product?.description || order.productDescription).substring(0, 100)}...`
                            : (order.product?.description || order.productDescription)
                          )}
                        </p>
                      )}
                      
                      <div style={{ 
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#28a745',
                        margin: '8px 0'
                      }}>
                        {order.product?.price || order.productPrice || 'Price not available'}
                      </div>

                      {images.length > 1 && (
                        <p style={{
                          margin: '4px 0 0 0',
                          fontSize: '12px',
                          color: '#999'
                        }}>
                          {images.length} images available
                        </p>
                      )}
                    </div>

                    {/* Order Details */}
                    <div>
                      <h4 style={{ 
                        margin: '0 0 12px 0',
                        color: '#007bff',
                        fontSize: '16px'
                      }}>
                        Order Details
                      </h4>
                      
                      {editingOrder === order._id ? (
                        // Edit Mode
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div className="edit-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input
                              type="text"
                              name="customerName"
                              value={editData.customerName}
                              onChange={handleEditChange}
                              placeholder="Customer Name"
                              style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}
                            />
                            <input
                              type="email"
                              name="email"
                              value={editData.email}
                              onChange={handleEditChange}
                              placeholder="Email"
                              style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          
                          <div className="edit-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input
                              type="tel"
                              name="phone"
                              value={editData.phone}
                              onChange={handleEditChange}
                              placeholder="Phone"
                              style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}
                            />
                            <input
                              type="number"
                              name="quantity"
                              value={editData.quantity}
                              onChange={handleEditChange}
                              min="1"
                              style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          
                          <div className="edit-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <select
                              name="size"
                              value={editData.size}
                              onChange={handleEditChange}
                              style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}
                            >
                              <option value="">Select Size</option>
                              {shoeSizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                            <select
                              name="color"
                              value={editData.color}
                              onChange={handleEditChange}
                              style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}
                            >
                              <option value="">Select Color</option>
                              {colors.map(color => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                          </div>
                          
                          <textarea
                            name="address"
                            value={editData.address}
                            onChange={handleEditChange}
                            placeholder="Delivery Address"
                            rows="2"
                            style={{
                              padding: '8px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '14px',
                              resize: 'vertical',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                          />
                          
                          <textarea
                            name="specialInstructions"
                            value={editData.specialInstructions}
                            onChange={handleEditChange}
                            placeholder="Special Instructions (Optional)"
                            rows="2"
                            style={{
                              padding: '8px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '14px',
                              resize: 'vertical',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                          />
                          
                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleSaveEdit(order._id)}
                              disabled={updating}
                              style={{
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: updating ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                minWidth: '80px'
                              }}
                            >
                              {updating ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={updating}
                              style={{
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: updating ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                minWidth: '80px'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                          <div style={{ marginBottom: '8px', wordBreak: 'break-word' }}>
                            <strong>Customer:</strong> {order.customerName || 'N/A'}
                          </div>
                          <div style={{ marginBottom: '8px', wordBreak: 'break-all' }}>
                            <strong>Email:</strong> {order.email || 'N/A'}
                          </div>
                          <div style={{ marginBottom: '8px', wordBreak: 'break-word' }}>
                            <strong>Phone:</strong> {order.phone || 'N/A'}
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Quantity:</strong> {order.quantity || 1}
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Size:</strong> {order.size || 'N/A'}
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Color:</strong> {order.color || 'N/A'}
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Total Amount:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                              {order.totalAmount || 'N/A'}
                            </span>
                          </div>
                          {order.address && (
                            <div style={{ marginBottom: '8px', wordBreak: 'break-word' }}>
                              <strong>Address:</strong> {order.address}
                            </div>
                          )}
                          {order.specialInstructions && (
                            <div style={{ marginBottom: '8px', wordBreak: 'break-word' }}>
                              <strong>Special Instructions:</strong> {order.specialInstructions}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {canModifyOrder(order) && editingOrder !== order._id && (
                <div className="action-buttons" style={{
                  marginTop: '20px',
                  paddingTop: '15px',
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button
                    onClick={() => handleEditOrder(order)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      flex: '1'
                    }}
                  >
                    Edit Order
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      flex: '1'
                    }}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
  };

export default MyOrders;