// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { uploadAllImages } from '../config/api.js';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('orders');
//   const [orders, setOrders] = useState([]);
//   const [orderStats, setOrderStats] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Product form state
//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     price: '',
//     images: []
//   });
//   const [uploading, setUploading] = useState(false);

//   // Filters
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     if (activeTab === 'orders') {
//       fetchOrders();
//       fetchOrderStats();
//     }
//   }, [activeTab, statusFilter]);

//   const getToken = () => localStorage.getItem('token');

//   // Fetch orders
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:3001/api/orders', {
//         headers: { Authorization: `Bearer ${getToken()}` },
//         params: { status: statusFilter }
//       });
//       setOrders(response.data.orders);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       alert('Error fetching orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch order statistics
//   const fetchOrderStats = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/orders/stats/summary', {
//         headers: { Authorization: `Bearer ${getToken()}` }
//       });
//       setOrderStats(response.data);
//     } catch (error) {
//       console.error('Error fetching order stats:', error);
//     }
//   };

//   // Update order status
//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       await axios.put(
//         `http://localhost:3001/api/orders/${orderId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );
//       fetchOrders();
//       alert('Order status updated successfully');
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       alert('Error updating order status');
//     }
//   };

//   // Product form handlers
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'images') {
//       setForm({ ...form, images: Array.from(files) });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       const imageUrls = await uploadAllImages(form.images);

//       const product = {
//         title: form.title,
//         description: form.description,
//         price: parseFloat(form.price),
//         image: imageUrls,
//       };

//       await axios.post(
//         'http://localhost:3001/api/products/addProduct',
//         product,
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );

//       alert('Product added successfully');
//       setForm({ title: '', description: '', price: '', images: [] });
//       document.querySelector('input[type="file"]').value = '';

//     } catch (err) {
//       console.error("Error uploading product:", err);
//       alert('Error adding product: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setUploading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: '#ffc107',
//       confirmed: '#17a2b8',
//       processing: '#fd7e14',
//       shipped: '#6f42c1',
//       delivered: '#28a745',
//       cancelled: '#dc3545'
//     };
//     return colors[status] || '#6c757d';
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Order Details Modal
//   const OrderModal = ({ order, onClose }) => (
//     <div style={{
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       zIndex: 1000
//     }}>
//       <div style={{
//         backgroundColor: 'white',
//         padding: '30px',
//         borderRadius: '12px',
//         maxWidth: '600px',
//         width: '90%',
//         maxHeight: '90vh',
//         overflowY: 'auto'
//       }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//           <h2>Order Details</h2>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
//         </div>

//         <div style={{ display: 'grid', gap: '20px' }}>
//           <div>
//             <h3>Customer Information</h3>
//             <p><strong>Name:</strong> {order.customerName}</p>
//             <p><strong>Email:</strong> {order.email}</p>
//             <p><strong>Phone:</strong> {order.phone}</p>
//             <p><strong>Address:</strong> {order.address}</p>
//           </div>

//           <div>
//             <h3>Product Information</h3>
//             <p><strong>Product:</strong> {order.productTitle}</p>
//             <p><strong>Size:</strong> {order.size}</p>
//             <p><strong>Color:</strong> {order.color}</p>
//             <p><strong>Quantity:</strong> {order.quantity}</p>
//             <p><strong>Price:</strong> {order.productPrice}</p>
//             <p><strong>Total:</strong> {order.totalAmount}</p>
//           </div>

//           {order.specialInstructions && (
//             <div>
//               <h3>Special Instructions</h3>
//               <p>{order.specialInstructions}</p>
//             </div>
//           )}

//           <div>
//             <h3>Order Status</h3>
//             <select
//               value={order.orderStatus}
//               onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//               style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
//             >
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Dashboard</h1>

//       {/* Navigation Tabs */}
//       <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '2px solid #eee' }}>
//         <button
//           onClick={() => setActiveTab('orders')}
//           style={{
//             padding: '15px 30px',
//             border: 'none',
//             background: activeTab === 'orders' ? '#007bff' : 'transparent',
//             color: activeTab === 'orders' ? 'white' : '#666',
//             cursor: 'pointer',
//             borderRadius: '8px 8px 0 0',
//             fontSize: '16px',
//             fontWeight: 'bold'
//           }}
//         >
//           Orders Management
//         </button>
//         <button
//           onClick={() => setActiveTab('products')}
//           style={{
//             padding: '15px 30px',
//             border: 'none',
//             background: activeTab === 'products' ? '#007bff' : 'transparent',
//             color: activeTab === 'products' ? 'white' : '#666',
//             cursor: 'pointer',
//             borderRadius: '8px 8px 0 0',
//             fontSize: '16px',
//             fontWeight: 'bold'
//           }}
//         >
//           Add Products
//         </button>
//       </div>

//       {/* Orders Management Tab */}
//       {activeTab === 'orders' && (
//         <div>
//           {/* Order Statistics */}
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
//             <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
//               <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Total Orders</h3>
//               <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{orderStats.totalOrders || 0}</p>
//             </div>
//             <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
//               <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Pending</h3>
//               <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{orderStats.pendingOrders || 0}</p>
//             </div>
//             <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px', textAlign: 'center' }}>
//               <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Completed</h3>
//               <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{orderStats.completedOrders || 0}</p>
//             </div>
//             <div style={{ padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '8px', textAlign: 'center' }}>
//               <h3 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>Revenue</h3>
//               <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{orderStats.totalRevenue || 0}</p>
//             </div>
//           </div>

//           {/* Filters */}
//           <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
//             <label style={{ fontWeight: 'bold' }}>Filter by Status:</label>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
//             >
//               <option value="all">All Orders</option>
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//             <button
//               onClick={fetchOrders}
//               style={{
//                 padding: '8px 16px',
//                 backgroundColor: '#007bff',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer'
//               }}
//             >
//               Refresh
//             </button>
//           </div>

//           {/* Orders Table */}
//           {loading ? (
//             <div style={{ textAlign: 'center', padding: '50px' }}>Loading orders...</div>
//           ) : (
//             <div style={{ overflowX: 'auto' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//                 <thead>
//                   <tr style={{ backgroundColor: '#f8f9fa' }}>
//                     <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Order ID</th>
//                     <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Customer</th>
//                     <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Product</th>
//                     <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Amount</th>
//                     <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
//                     <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
//                     <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => (
//                     <tr key={order._id} style={{ borderBottom: '1px solid #dee2e6' }}>
//                       <td style={{ padding: '15px' }}>{order._id.slice(-8)}</td>
//                       <td style={{ padding: '15px' }}>{order.customerName}</td>
//                       <td style={{ padding: '15px' }}>{order.productTitle}</td>
//                       <td style={{ padding: '15px' }}>{order.totalAmount}</td>
//                       <td style={{ padding: '15px' }}>
//                         <span style={{
//                           padding: '4px 12px',
//                           borderRadius: '20px',
//                           backgroundColor: getStatusColor(order.orderStatus),
//                           color: 'white',
//                           fontSize: '12px',
//                           fontWeight: 'bold'
//                         }}>
//                           {order.orderStatus.toUpperCase()}
//                         </span>
//                       </td>
//                       <td style={{ padding: '15px' }}>{formatDate(order.orderDate)}</td>
//                       <td style={{ padding: '15px' }}>
//                         <button
//                           onClick={() => setSelectedOrder(order)}
//                           style={{
//                             padding: '6px 12px',
//                             backgroundColor: '#007bff',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: 'pointer',
//                             fontSize: '12px'
//                           }}
//                         >
//                           View Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {orders.length === 0 && (
//                 <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
//                   No orders found
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Add Products Tab */}
//       {activeTab === 'products' && (
//         <div style={{ maxWidth: '500px', margin: '0 auto' }}>
//           <form onSubmit={handleAddProduct}>
//             <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Add New Product</h2>

//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Title *</label>
//               <input 
//                 name="title" 
//                 placeholder="Enter product title" 
//                 value={form.title} 
//                 onChange={handleChange}
//                 required
//                 style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
//               />
//             </div>

//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
//               <textarea 
//                 name="description" 
//                 placeholder="Enter product description" 
//                 value={form.description} 
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: '12px', minHeight: '100px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
//               />
//             </div>

//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price *</label>
//               <input 
//                 name="price" 
//                 type="number" 
//                 step="0.01"
//                 placeholder="0.00" 
//                 value={form.price} 
//                 onChange={handleChange}
//                 required
//                 style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
//               />
//             </div>

//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Images</label>
//               <input 
//                 type="file" 
//                 name="images" 
//                 accept="image/*" 
//                 multiple 
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }}
//               />
//               {form.images.length > 0 && (
//                 <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
//                   Selected {form.images.length} image(s)
//                 </p>
//               )}
//             </div>

//             <button 
//               type="submit" 
//               disabled={uploading}
//               style={{ 
//                 width: '100%', 
//                 padding: '15px', 
//                 backgroundColor: uploading ? '#ccc' : '#28a745',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '6px',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 cursor: uploading ? 'not-allowed' : 'pointer'
//               }}
//             >
//               {uploading ? 'Adding Product...' : 'Add Product'}
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <OrderModal 
//           order={selectedOrder} 
//           onClose={() => setSelectedOrder(null)} 
//         />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadAllImages } from '../config/api.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [imageLoadErrors, setImageLoadErrors] = useState({});

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

  useEffect(() => {
    // Initialize current image indexes for each order
    const initialIndexes = {};
    orders.forEach(order => {
      initialIndexes[order._id] = 0;
    });
    setCurrentImageIndexes(initialIndexes);
  }, [orders]);

  const getToken = () => localStorage.getItem('token');

  // Image handling functions
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

  // Get payment slip image
  const getPaymentSlipImage = (order) => {
    return order.paymentSlip || order.paymentSlipImage || null;
  };

  // Image navigation functions - Fixed to work properly
  const nextImage = (orderId, totalImages) => {
    setCurrentImageIndexes(prev => {
      const currentIndex = prev[orderId] || 0;
      const nextIndex = (currentIndex + 1) % totalImages;
      return {
        ...prev,
        [orderId]: nextIndex
      };
    });
  };

  const prevImage = (orderId, totalImages) => {
    setCurrentImageIndexes(prev => {
      const currentIndex = prev[orderId] || 0;
      const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
      return {
        ...prev,
        [orderId]: prevIndex
      };
    });
  };

  const goToImage = (orderId, index) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [orderId]: index
    }));
  };

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

  // Fixed Image Gallery Component
  const ImageGallery = ({ images, orderId, isPaymentSlip = false }) => {
    if (!images || images.length === 0) {
      return (
        <div style={{
          width: isPaymentSlip ? '100%' : '120px',
          height: isPaymentSlip ? '200px' : '80px',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: '#6c757d',
          fontSize: '12px'
        }}>
          No Image
        </div>
      );
    }

    if (images.length === 1 || isPaymentSlip) {
      const imageUrl = Array.isArray(images) ? images[0] : images;
      return (
        <div style={{ position: 'relative' }}>
          {imageLoadingStates[`${orderId}-0`] && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: '5px',
              borderRadius: '4px'
            }}>
              Loading...
            </div>
          )}
          {imageLoadErrors[`${orderId}-0`] ? (
            <div style={{
              width: isPaymentSlip ? '100%' : '120px',
              height: isPaymentSlip ? '200px' : '80px',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              color: '#dc3545',
              fontSize: '12px'
            }}>
              Failed to load
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={isPaymentSlip ? "Payment Slip" : "Product"}
              style={{
                width: isPaymentSlip ? '100%' : '120px',
                height: isPaymentSlip ? '200px' : '80px',
                objectFit: 'cover',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onLoad={() => handleImageLoad(orderId, 0)}
              onLoadStart={() => handleImageLoadStart(orderId, 0)}
              onError={() => handleImageError(orderId, 0)}
              onClick={() => window.open(imageUrl, '_blank')}
            />
          )}
        </div>
      );
    }

    const currentIndex = currentImageIndexes[orderId] || 0;
    const currentImage = images[currentIndex];

    return (
      <div style={{ position: 'relative', width: '120px' }}>
        {imageLoadingStates[`${orderId}-${currentIndex}`] && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            fontSize: '12px',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: '5px',
            borderRadius: '4px'
          }}>
            Loading...
          </div>
        )}

        {imageLoadErrors[`${orderId}-${currentIndex}`] ? (
          <div style={{
            width: '120px',
            height: '80px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: '#dc3545',
            fontSize: '12px'
          }}>
            Failed to load
          </div>
        ) : (
          <img
            src={currentImage}
            alt="Product"
            style={{
              width: '120px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onLoad={() => handleImageLoad(orderId, currentIndex)}
            onLoadStart={() => handleImageLoadStart(orderId, currentIndex)}
            onError={() => handleImageError(orderId, currentIndex)}
            onClick={() => window.open(currentImage, '_blank')}
          />
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage(orderId, images.length);
              }}
              style={{
                position: 'absolute',
                left: '5px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}
            >
              &#8249;
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage(orderId, images.length);
              }}
              style={{
                position: 'absolute',
                right: '5px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}
            >
              &#8250;
            </button>
            <div style={{
              position: 'absolute',
              bottom: '5px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '10px'
            }}>
              {currentIndex + 1}/{images.length}
            </div>
          </>
        )}
      </div>
    );
  };

  // Fixed Order Details Modal with proper scrolling and close button
  const OrderModal = ({ order, onClose }) => {
    const orderImages = getOrderImages(order);
    const paymentSlip = getPaymentSlipImage(order);

    // Close modal when clicking outside
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    // Close modal on escape key
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={handleBackdropClick}
      >
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
          marginTop: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            paddingBottom: '10px',
            borderBottom: '1px solid #eee'
          }}>
            <h2 style={{ margin: 0 }}>Order Details</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '5px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>

          <div style={{ display: 'grid', gap: '25px' }}>
            <div>
              <h3 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>Customer Information</h3>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ margin: '5px 0' }}><strong>Name:</strong> {order.customerName}</p>
                <p style={{ margin: '5px 0' }}><strong>Email:</strong> {order.email}</p>
                <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {order.phone}</p>
                <p style={{ margin: '5px 0' }}><strong>Address:</strong> {order.address}</p>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>Product Information</h3>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '5px 0' }}><strong>Product:</strong> {order.productTitle}</p>
                  <p style={{ margin: '5px 0' }}><strong>Size:</strong> {order.size}</p>
                  <p style={{ margin: '5px 0' }}><strong>Color:</strong> {order.color}</p>
                  <p style={{ margin: '5px 0' }}><strong>Quantity:</strong> {order.quantity}</p>
                  <p style={{ margin: '5px 0' }}><strong>Price:</strong> ${order.productPrice}</p>
                  <p style={{ margin: '5px 0' }}><strong>Total:</strong> ${order.totalAmount}</p>
                </div>
                {orderImages.length > 0 && (
                  <div>
                    <p style={{ margin: '0 0 10px 0' }}><strong>Product Images:</strong></p>
                    <ImageGallery images={orderImages} orderId={`modal-${order._id}`} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>Payment Information</h3>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '5px 0' }}><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase() || 'COD'}</p>
                  {order.paymentMethod === 'online' && (
                    <p style={{ margin: '5px 0' }}><strong>Payment Status:</strong>
                      <span style={{
                        marginLeft: '8px',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: order.paymentStatus === 'paid' ? '#d4edda' : '#fff3cd',
                        color: order.paymentStatus === 'paid' ? '#155724' : '#856404',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </p>
                  )}
                </div>
                {order.paymentMethod === 'online' && paymentSlip && (
                  <div>
                    <p style={{ margin: '0 0 10px 0' }}><strong>Payment Slip:</strong></p>
                    <ImageGallery images={paymentSlip} orderId={`${order._id}-slip`} isPaymentSlip={true} />
                  </div>
                )}
              </div>
            </div>

            {order.specialInstructions && (
              <div>
                <h3 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>Special Instructions</h3>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <p style={{ margin: 0 }}>{order.specialInstructions}</p>
                </div>
              </div>
            )}

            <div>
              <h3 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>Order Status</h3>
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  style={{
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '16px',
                    minWidth: '200px'
                  }}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>${orderStats.totalRevenue || 0}</p>
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
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Image</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Amount</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Payment</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const orderImages = getOrderImages(order);
                    return (
                      <tr key={order._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '15px' }}>{order._id.slice(-8)}</td>
                        <td style={{ padding: '15px' }}>{order.customerName}</td>
                        <td style={{ padding: '15px' }}>{order.productTitle}</td>
                        <td style={{ padding: '15px' }}>
                          <ImageGallery images={orderImages} orderId={order._id} />
                        </td>
                        <td style={{ padding: '15px' }}>${order.totalAmount}</td>
                        <td style={{ padding: '15px' }}>
                          <div>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '12px',
                              backgroundColor: order.paymentMethod === 'online' ? '#e7f3ff' : '#f8f9fa',
                              color: order.paymentMethod === 'online' ? '#0066cc' : '#666',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              {order.paymentMethod?.toUpperCase() || 'COD'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            backgroundColor: getStatusColor(order.orderStatus),
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {order.orderStatus?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '15px' }}>{formatDate(order.createdAt)}</td>
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
                    );
                  })}
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
        <div>
          <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Add New Product</h2>

            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Title:</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price ($):</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Images:</label>
                <input
                  type="file"
                  name="images"
                  onChange={handleChange}
                  multiple
                  accept="image/*"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                  You can select multiple images. Supported formats: JPG, PNG, GIF
                </small>
              </div>

              <button
                type="submit"
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: uploading ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: uploading ? 'not-allowed' : 'pointer'
                }}
              >
                {uploading ? 'Adding Product...' : 'Add Product'}
              </button>
            </form>
          </div>
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