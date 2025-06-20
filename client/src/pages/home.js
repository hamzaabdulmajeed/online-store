import React, { useEffect, useState, useCallback } from 'react';
import { getProducts, placeOrder } from "../config/api.js";
import { useNavigate } from 'react-router-dom';


// const OrderForm = ({ product, onClose, onSubmit }) => {
//   const [orderData, setOrderData] = useState({
//     customerName: '',
//     email: '',
//     phone: '',
//     address: '',
//     size: '',
//     color: '',
//     quantity: 1,
//     specialInstructions: '',
//     paymentMethod: ''
//   });

//   const [showBankDetails, setShowBankDetails] = useState(false);
//   const [paymentSlip, setPaymentSlip] = useState(null);
//   const [slipPreview, setSlipPreview] = useState(null);

//   const shoeSizes = ['40', '41', '42', '43', '44'];
//   const colors = ['Black', 'White', 'Brown', 'Red', 'Blue', 'Gray', 'Navy'];
//   const deliveryCharges = 200;

//   // Bank details for online payment
//   const bankDetails = {
//     bankName: "HBL Bank",
//     accountTitle: "Your Business Name",
//     accountNumber: "1234567890123456",
//     iban: "PK36HABB0000001234567890"
//   };

//   // Check if delivery address is in Karachi
//   const isInKarachi = () => {
//     const addressParts = orderData.address.split('|');
//     const city = addressParts[1]?.toLowerCase().trim() || '';
//     return city.includes('karachi');
//   };

//   // Validation functions
//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validatePhone = (phone) => {
//     const phoneRegex = /^[\+]?[0-9][\d]{0,15}$/;
//     return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
//   };
// const handleChange = (e) => {
//   const { name, value } = e.target;
//   setOrderData(prev => ({
//     ...prev,
//     [name]: value
//   }));

//   // Show bank details when online payment is selected (for both Karachi and outside Karachi)
//   if (name === 'paymentMethod' && value === 'online') {
//     setShowBankDetails(true);
//   } else if (name === 'paymentMethod' && value !== 'online') {
//     setShowBankDetails(false);
//     setPaymentSlip(null);
//     setSlipPreview(null);
//   }
  
//   // Also show bank details if address changes and payment method is already online
//   if (name === 'address' && orderData.paymentMethod === 'online') {
//     setShowBankDetails(true);
//   }
// };

//   const handleSlipUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) { // 5MB limit
//         alert('File size should be less than 5MB');
//         return;
//       }
      
//       if (!file.type.startsWith('image/')) {
//         alert('Please upload only image files');
//         return;
//       }

//       setPaymentSlip(file);
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setSlipPreview(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validate email and phone before submitting
//     if (!validateEmail(orderData.email)) {
//       alert('Please enter a valid email address');
//       return;
//     }
    
//     if (!validatePhone(orderData.phone)) {
//       alert('Please enter a valid phone number');
//       return;
//     }

//     // Validate payment method selection
//     if (!orderData.paymentMethod) {
//       alert('Please select a payment method');
//       return;
//     }

//     const inKarachi = isInKarachi();

//     // For outside Karachi, online payment is mandatory
//     if (!inKarachi && orderData.paymentMethod !== 'online') {
//       alert('Online payment is required for deliveries outside Karachi');
//       return;
//     }

//     // For outside Karachi with online payment, payment slip is required
//     if (!inKarachi && orderData.paymentMethod === 'online' && !paymentSlip) {
//       alert('Please upload payment slip for online payment');
//       return;
//     }

//     // Check authentication status
//     const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
//     const userId = localStorage.getItem('userId');
    
//     if (!isAuthenticated) {
//       alert('Please login to place an order.');
//       return;
//     }

//     if (!userId) {
//       alert('User session expired. Please login again.');
//       return;
//     }

//     const subtotal = product.price * orderData.quantity;
//     const totalAmount = subtotal + deliveryCharges;

//     const order = {
//       ...orderData,
//       user: userId,
//       productId: product._id,
//       productImage: product.image,
//       productTitle: product.title,
//       productPrice: product.price,
//       subtotal: subtotal,
//       deliveryCharges: deliveryCharges,
//       totalAmount: totalAmount,
//       isKarachiDelivery: inKarachi,
//       paymentSlip: paymentSlip, // Include payment slip file
//       orderDate: new Date().toISOString()
//     };
    
//     onSubmit(order);
//   };

//   const inKarachi = isInKarachi();
//   const subtotal = product.price * orderData.quantity;
//   const totalAmount = subtotal + deliveryCharges;
//   return (
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
//         maxWidth: '500px',
//         width: '90%',
//         maxHeight: '90vh',
//         overflowY: 'auto',
//         boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
//       }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//           <h2 style={{ margin: 0, color: '#333' }}>Order: {product.title}</h2>
//           <button 
//             onClick={onClose}
//             style={{
//               background: 'none',
//               border: 'none',
//               fontSize: '24px',
//               cursor: 'pointer',
//               color: '#666'
//             }}
//           >
//             ×
//           </button>
//         </div>

//         <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
//           <h4 style={{ margin: '0 0 10px 0' }}>Product Details</h4>
//           <p style={{ margin: '5px 0' }}><strong>Price:</strong> Rs. {product.price}</p>
//           <p style={{ margin: '5px 0' }}><strong>Description:</strong> {product.description}</p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div style={{ display: 'grid', gap: '15px' }}>
//             {/* Customer Information */}
//             <div>
//               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                 Full Name *
//               </label>
//               <input
//                 type="text"
//                 name="customerName"
//                 value={orderData.customerName}
//                 onChange={handleChange}
//                 required
//                 style={{
//                   width: '100%',
//                   padding: '10px',
//                   border: '1px solid #ddd',
//                   borderRadius: '4px',
//                   fontSize: '14px'
//                 }}
//               />
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={orderData.email}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${orderData.email && !validateEmail(orderData.email) ? '#ff6b6b' : '#ddd'}`,
//                     borderRadius: '4px',
//                     fontSize: '14px'
//                   }}
//                 />
//                 {orderData.email && !validateEmail(orderData.email) && (
//                   <small style={{ color: '#ff6b6b', fontSize: '12px' }}>Please enter a valid email</small>
//                 )}
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                   Phone *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={orderData.phone}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${orderData.phone && !validatePhone(orderData.phone) ? '#ff6b6b' : '#ddd'}`,
//                     borderRadius: '4px',
//                     fontSize: '14px'
//                   }}
//                 />
//                 {orderData.phone && !validatePhone(orderData.phone) && (
//                   <small style={{ color: '#ff6b6b', fontSize: '12px' }}>Please enter a valid phone number</small>
//                 )}
//               </div>
//             </div>

//             {/* Product Specifications */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                   Size *
//                 </label>
//                 <select
//                   name="size"
//                   value={orderData.size}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: '1px solid #ddd',
//                     borderRadius: '4px',
//                     fontSize: '14px'
//                   }}
//                 >
//                   <option value="">Select Size</option>
//                   {shoeSizes.map(size => (
//                     <option key={size} value={size}>{size}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                   Color *
//                 </label>
//                 <select
//                   name="color"
//                   value={orderData.color}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: '1px solid #ddd',
//                     borderRadius: '4px',
//                     fontSize: '14px'
//                   }}
//                 >
//                   <option value="">Select Color</option>
//                   {colors.map(color => (
//                     <option key={color} value={color}>{color}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                   Quantity *
//                 </label>
//                 <input
//                   type="number"
//                   name="quantity"
//                   value={orderData.quantity}
//                   onChange={handleChange}
//                   min="1"
//                   max="10"
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: '1px solid #ddd',
//                     borderRadius: '4px',
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Address */}
//             <div>
//               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                 Delivery Address *
//               </label>
//               <div style={{ display: 'grid', gap: '10px' }}>
//                 {['Street Address', 'City', 'State/Province', 'ZIP/Postal Code', 'Country'].map((field, index) => (
//                   <input
//                     key={field}
//                     type="text"
//                     name={`address_${index}`}
//                     placeholder={field}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '10px',
//                       border: '1px solid #ddd',
//                       borderRadius: '4px',
//                       fontSize: '14px'
//                     }}
//                     onChange={(e) => {
//                       const addressParts = orderData.address.split('|');
//                       addressParts[index] = e.target.value;
//                       handleChange({
//                         target: {
//                           name: 'address',
//                           value: addressParts.join('|')
//                         }
//                       });
//                     }}
//                     value={orderData.address.split('|')[index] || ''}
//                   />
//                 ))}
//               </div>
//               {/* Address Info */}
//               <div style={{ 
//                 marginTop: '10px', 
//                 padding: '10px', 
//                 backgroundColor: inKarachi ? '#d4edda' : '#fff3cd',
//                 border: `1px solid ${inKarachi ? '#c3e6cb' : '#ffeaa7'}`,
//                 borderRadius: '4px',
//                 fontSize: '12px'
//               }}>
//                 <strong>Delivery Info:</strong> {inKarachi ? 
//                   'Karachi delivery - COD and Online payment available' : 
//                   'Outside Karachi - Online payment required with payment slip'
//                 }
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div>
//               <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
//                 Payment Method *
//               </label>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                 {inKarachi && (
//                   <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="cod"
//                       checked={orderData.paymentMethod === 'cod'}
//                       onChange={handleChange}
//                       style={{ cursor: 'pointer' }}
//                     />
//                     <span>Cash on Delivery (COD)</span>
//                   </label>
//                 )}
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     value="online"
//                     checked={orderData.paymentMethod === 'online'}
//                     onChange={handleChange}
//                     style={{ cursor: 'pointer' }}
//                   />
//                   <span>Online Payment (Bank Transfer)</span>
//                 </label>
//               </div>
//               {!inKarachi && (
//                 <small style={{ color: '#856404', fontSize: '12px', marginTop: '5px', display: 'block' }}>
//                   Online payment is required for deliveries outside Karachi
//                 </small>
//               )}
//             </div>

//             {/* Bank Details Section */}
//             {showBankDetails && (
//               <div style={{
//                 padding: '15px',
//                 backgroundColor: '#f8f9fa',
//                 border: '1px solid #dee2e6',
//                 borderRadius: '8px'
//               }}>
//                 <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>Bank Details for Payment</h4>
//                 <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
//                   <div><strong>Bank Name:</strong> {bankDetails.bankName}</div>
//                   <div><strong>Account Title:</strong> {bankDetails.accountTitle}</div>
//                   <div><strong>Account Number:</strong> {bankDetails.accountNumber}</div>
//                   <div><strong>IBAN:</strong> {bankDetails.iban}</div>
//                 </div>
//                 <div style={{
//                   marginTop: '10px',
//                   padding: '10px',
//                   backgroundColor: '#d1ecf1',
//                   border: '1px solid #bee5eb',
//                   borderRadius: '4px',
//                   fontSize: '12px',
//                   color: '#0c5460'
//                 }}>
//                   <strong>Instructions:</strong> Please transfer the total amount and upload the payment slip below.
//                 </div>

//                 {/* Payment Slip Upload */}
//                 <div style={{ marginTop: '15px' }}>
//                   <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
//                     Upload Payment Slip *
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleSlipUpload}
//                     style={{
//                       width: '100%',
//                       padding: '8px',
//                       border: '1px solid #ddd',
//                       borderRadius: '4px',
//                       fontSize: '14px'
//                     }}
//                   />
//                   <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
//                     Upload image of payment slip (Max 5MB, JPG/PNG)
//                   </small>
                  
//                   {/* Payment Slip Preview */}
//                   {slipPreview && (
//                     <div style={{ marginTop: '10px' }}>
//                       <strong style={{ fontSize: '14px' }}>Payment Slip Preview:</strong>
//                       <div style={{
//                         marginTop: '5px',
//                         border: '1px solid #ddd',
//                         borderRadius: '4px',
//                         padding: '10px',
//                         textAlign: 'center'
//                       }}>
//                         <img 
//                           src={slipPreview} 
//                           alt="Payment Slip Preview"
//                           style={{
//                             maxWidth: '100%',
//                             maxHeight: '200px',
//                             objectFit: 'contain'
//                           }}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Special Instructions */}
//             <div>
//               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                 Special Instructions (Optional)
//               </label>
//               <textarea
//                 name="specialInstructions"
//                 value={orderData.specialInstructions}
//                 onChange={handleChange}
//                 rows="2"
//                 style={{
//                   width: '100%',
//                   padding: '10px',
//                   border: '1px solid #ddd',
//                   borderRadius: '4px',
//                   fontSize: '14px',
//                   resize: 'vertical'
//                 }}
//                 placeholder="Any special delivery instructions or preferences"
//               />
//             </div>

//             {/* Order Summary */}
//             <div style={{ 
//               padding: '15px', 
//               backgroundColor: '#e7f3ff', 
//               borderRadius: '8px',
//               border: '1px solid #b3d9ff'
//             }}>
//               <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>Order Summary</h4>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                 <span>Price per item:</span>
//                 <span>Rs. {product.price}</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                 <span>Quantity:</span>
//                 <span>{orderData.quantity}</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                 <span>Subtotal:</span>
//                 <span>Rs. {subtotal.toFixed(2)}</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                 <span>Delivery Charges:</span>
//                 <span>Rs. {deliveryCharges}</span>
//               </div>
//               <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #ccc' }} />
//               <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
//                 <span>Total Amount:</span>
//                 <span>Rs. {totalAmount.toFixed(2)}</span>
//               </div>
//               {orderData.paymentMethod && (
//                 <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
//                   <strong>Payment Method:</strong> {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
//               <button
//                 type="button"
//                 onClick={onClose}
//                 style={{
//                   flex: '1',
//                   padding: '12px',
//                   border: '1px solid #ddd',
//                   borderRadius: '6px',
//                   backgroundColor: '#f8f9fa',
//                   color: '#666',
//                   fontSize: '16px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 style={{
//                   flex: '2',
//                   padding: '12px',
//                   border: 'none',
//                   borderRadius: '6px',
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   fontSize: '16px',
//                   fontWeight: 'bold',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Place Order
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const ProductCard = ({ product }) => {
//  const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [showOrderForm, setShowOrderForm] = useState(false);
//   const navigate = useNavigate();

//   const nextImage = () => {
//     if (product.image && product.image.length > 1) {
//       setCurrentImageIndex((prev) => 
//         prev === product.image.length - 1 ? 0 : prev + 1
//       );
//     }
//   };
  
//   const prevImage = () => {
//     if (product.image && product.image.length > 1) {
//       setCurrentImageIndex((prev) => 
//         prev === 0 ? product.image.length - 1 : prev - 1
//       );
//     }
//   };

//   const handleOrderSubmit = async (orderData) => {
//     try {
//       // Get the auth token from localStorage
//       const token = localStorage.getItem('authToken');
      
//       if (!token) {
//         alert('Authentication token missing. Please login again.');
//         navigate('/login');
//         return;
//       }
      
//       // Pass the token to placeOrder function
//       const result = await placeOrder(orderData, token);
//       alert(`Order placed successfully!\nOrder ID: ${result.orderId}\nTotal: ${orderData.totalAmount}\nWe'll contact you soon!`);
//       setShowOrderForm(false);
//     } catch (error) {
//       console.error('Order failed:', error);
      
//       // Handle authentication errors specifically
//       if (error.message.includes('Authentication') || error.message.includes('token')) {
//         alert('Your session has expired. Please login again.');
//         navigate('/login');
//       } else {
//         alert('Failed to place order. Please try again.');
//       }
//     }
//   };

//   // Fixed authentication check
//   const handleOrderClick = () => {
//     const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
//     const userId = localStorage.getItem('userId');
    
//     if (!isAuthenticated || !userId) {
//       // Redirect to login if not authenticated or no userId
//       navigate('/login');
//     } else {
//       setShowOrderForm(true);
//     }
//   };
//   return (
//     <>
//       <div style={{ 
//         border: '1px solid #ddd', 
//         borderRadius: '8px', 
//         padding: '16px', 
//         margin: '16px',
//         maxWidth: '300px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//       }}>
//         {/* Image carousel */}
//         {product.image && product.image.length > 0 ? (
//           <div style={{ position: 'relative', marginBottom: '12px' }}>
//             <img 
//               src={product.image[currentImageIndex]} 
//               alt={product.title}
//               style={{ 
//                 width: '100%', 
//                 height: '200px', 
//                 objectFit: 'cover',
//                 borderRadius: '4px'
//               }}
//               onError={(e) => {
//                 e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
//               }}
//             />
            
//             {/* Navigation arrows - only show if multiple images */}
//             {product.image.length > 1 && (
//               <>
//                 <button 
//                   onClick={prevImage}
//                   style={{
//                     position: 'absolute',
//                     left: '8px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'rgba(0,0,0,0.5)',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '50%',
//                     width: '30px',
//                     height: '30px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   ‹
//                 </button>
//                 <button 
//                   onClick={nextImage}
//                   style={{
//                     position: 'absolute',
//                     right: '8px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'rgba(0,0,0,0.5)',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '50%',
//                     width: '30px',
//                     height: '30px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   ›
//                 </button>
//               </>
//             )}
            
//             {/* Image indicators */}
//             {product.image.length > 1 && (
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 gap: '4px',
//                 marginTop: '8px'
//               }}>
//                 {product.image.map((_, index) => (
//                   <div
//                     key={index}
//                     onClick={() => setCurrentImageIndex(index)}
//                     style={{
//                       width: '8px',
//                       height: '8px',
//                       borderRadius: '50%',
//                       background: index === currentImageIndex ? '#007bff' : '#ccc',
//                       cursor: 'pointer'
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         ) : (
//           <div style={{ 
//             width: '100%', 
//             height: '200px', 
//             background: '#f0f0f0',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             borderRadius: '4px',
//             marginBottom: '12px'
//           }}>
//             No Image
//           </div>
//         )}
        
//         <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
//           {product.title}
//         </h3>
        
//         {product.description && (
//           <p style={{ 
//             margin: '0 0 8px 0', 
//             color: '#666',
//             fontSize: '14px'
//           }}>
//             {product.description}
//           </p>
//         )}
        
//         <p style={{ 
//           margin: '0 0 12px 0', 
//           fontSize: '20px', 
//           fontWeight: 'bold',
//           color: '#007bff'
//         }}>
//           {product.price}
//         </p>
        
//         {product.image && product.image.length > 1 && (
//           <p style={{ 
//             margin: '0 0 12px 0', 
//             fontSize: '12px', 
//             color: '#999'
//           }}>
//             {product.image.length} images
//           </p>
//         )}

//         {/* Order Now Button */}
//         <button
//           onClick={handleOrderClick} // Use the proper authentication check
//           style={{
//             width: '100%',
//             padding: '12px',
//             backgroundColor: '#28a745',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             fontSize: '16px',
//             fontWeight: 'bold',
//             cursor: 'pointer',
//             transition: 'background-color 0.2s'
//           }}
//           onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
//           onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
//         >
//           Order Now
//         </button>
//       </div>

//       {/* Order Form Modal */}
//       {showOrderForm && (
//         <OrderForm
//           product={product}
//           onClose={() => setShowOrderForm(false)}
//           onSubmit={handleOrderSubmit}
//         />
//       )}
//     </>
//   );
// };

const OrderForm = ({ product, onClose, onSubmit }) => {
  const [orderData, setOrderData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    size: '',
    color: '',
    quantity: 1,
    specialInstructions: '',
    paymentMethod: ''
  });

  const [showBankDetails, setShowBankDetails] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({}); // Add form errors state

  const shoeSizes = ['40', '41', '42', '43', '44'];
  const colors = ['Black', 'White', 'Brown', 'Red', 'Blue', 'Gray', 'Navy'];
  const deliveryCharges = 200;

  // Bank details for online payment
  const bankDetails = {
    bankName: "HBL Bank",
    accountTitle: "Your Business Name",
    accountNumber: "1234567890123456",
    iban: "PK36HABB0000001234567890"
  };

  // Check if delivery address is in Karachi
  const isInKarachi = () => {
    const addressParts = orderData.address.split('|');
    const city = addressParts[1]?.toLowerCase().trim() || '';
    return city.includes('karachi');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear form errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Show bank details when online payment is selected (for both Karachi and outside Karachi)
    if (name === 'paymentMethod' && value === 'online') {
      setShowBankDetails(true);
      // Clear payment slip error when switching to online payment
      if (formErrors.paymentSlip) {
        setFormErrors(prev => ({
          ...prev,
          paymentSlip: ''
        }));
      }
    } else if (name === 'paymentMethod' && value !== 'online') {
      setShowBankDetails(false);
      setPaymentSlip(null);
      setSlipPreview(null);
      // Clear payment slip error when switching away from online payment
      if (formErrors.paymentSlip) {
        setFormErrors(prev => ({
          ...prev,
          paymentSlip: ''
        }));
      }
    }
    
    // Also show bank details if address changes and payment method is already online
    if (name === 'address' && orderData.paymentMethod === 'online') {
      setShowBankDetails(true);
    }
  };

  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        e.target.value = ''; // Reset file input
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload only image files (JPG, PNG, GIF, etc.)');
        e.target.value = ''; // Reset file input
        return;
      }

      // Validate file format more strictly
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        alert('Please upload only JPG, PNG, GIF, or WebP image files');
        e.target.value = ''; // Reset file input
        return;
      }

      setPaymentSlip(file);
      
      // Clear payment slip error when file is uploaded
      if (formErrors.paymentSlip) {
        setFormErrors(prev => ({
          ...prev,
          paymentSlip: ''
        }));
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setSlipPreview(e.target.result);
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        setPaymentSlip(null);
        setSlipPreview(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isUploading) {
      return;
    }
    
    // Clear previous errors
    setFormErrors({});
    let hasErrors = false;
    const errors = {};
    
    // Validate email and phone before submitting
    if (!validateEmail(orderData.email)) {
      errors.email = 'Please enter a valid email address';
      hasErrors = true;
    }
    
    if (!validatePhone(orderData.phone)) {
      errors.phone = 'Please enter a valid phone number';
      hasErrors = true;
    }

    // Validate payment method selection
    if (!orderData.paymentMethod) {
      errors.paymentMethod = 'Please select a payment method';
      hasErrors = true;
    }

    const inKarachi = isInKarachi();

    // For outside Karachi, online payment is mandatory
    if (!inKarachi && orderData.paymentMethod !== 'online') {
      errors.paymentMethod = 'Online payment is required for deliveries outside Karachi';
      hasErrors = true;
    }

    // For online payment, payment slip is required
    if (orderData.paymentMethod === 'online' && !paymentSlip) {
      errors.paymentSlip = 'Please upload payment slip for online payment';
      hasErrors = true;
    }

    // If there are validation errors, show them and stop submission
    if (hasErrors) {
      setFormErrors(errors);
      
      // Show alert for the first error found
      const firstError = Object.values(errors)[0];
      alert(firstError);
      return;
    }

    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userId = localStorage.getItem('userId');
    
    if (!isAuthenticated) {
      alert('Please login to place an order.');
      return;
    }

    if (!userId) {
      alert('User session expired. Please login again.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const subtotal = product.price * orderData.quantity;
      const totalAmount = subtotal + deliveryCharges;

      const order = {
        ...orderData,
        user: userId,
        productId: product._id,
        productImage: product.image,
        productTitle: product.title,
        productPrice: product.price,
        subtotal: subtotal,
        deliveryCharges: deliveryCharges,
        totalAmount: totalAmount,
        isKarachiDelivery: inKarachi,
        orderDate: new Date().toISOString()
      };
      
      // Call onSubmit with order data and payment slip file
      await onSubmit(order, paymentSlip);
      
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const inKarachi = isInKarachi();
  const subtotal = product.price * orderData.quantity;
  const totalAmount = subtotal + deliveryCharges;

  return (
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
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Order: {product.title}</h2>
          <button 
            onClick={onClose}
            disabled={isUploading}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              color: '#666',
              opacity: isUploading ? 0.5 : 1
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Product Details</h4>
          <p style={{ margin: '5px 0' }}><strong>Price:</strong> Rs. {product.price}</p>
          <p style={{ margin: '5px 0' }}><strong>Description:</strong> {product.description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '15px' }}>
            {/* Customer Information */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={orderData.customerName}
                onChange={handleChange}
                required
                disabled={isUploading}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${formErrors.customerName ? '#ff6b6b' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  opacity: isUploading ? 0.7 : 1
                }}
              />
              {formErrors.customerName && (
                <small style={{ color: '#ff6b6b', fontSize: '12px', display: 'block', marginTop: '2px' }}>
                  {formErrors.customerName}
                </small>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={orderData.email}
                  onChange={handleChange}
                  required
                  disabled={isUploading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${formErrors.email || (orderData.email && !validateEmail(orderData.email)) ? '#ff6b6b' : '#ddd'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    opacity: isUploading ? 0.7 : 1
                  }}
                />
                {(formErrors.email || (orderData.email && !validateEmail(orderData.email))) && (
                  <small style={{ color: '#ff6b6b', fontSize: '12px' }}>
                    {formErrors.email || 'Please enter a valid email'}
                  </small>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={orderData.phone}
                  onChange={handleChange}
                  required
                  disabled={isUploading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${formErrors.phone || (orderData.phone && !validatePhone(orderData.phone)) ? '#ff6b6b' : '#ddd'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    opacity: isUploading ? 0.7 : 1
                  }}
                />
                {(formErrors.phone || (orderData.phone && !validatePhone(orderData.phone))) && (
                  <small style={{ color: '#ff6b6b', fontSize: '12px' }}>
                    {formErrors.phone || 'Please enter a valid phone number'}
                  </small>
                )}
              </div>
            </div>

            {/* Product Specifications */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Size *
                </label>
                <select
                  name="size"
                  value={orderData.size}
                  onChange={handleChange}
                  required
                  disabled={isUploading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    opacity: isUploading ? 0.7 : 1
                  }}
                >
                  <option value="">Select Size</option>
                  {shoeSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Color *
                </label>
                <select
                  name="color"
                  value={orderData.color}
                  onChange={handleChange}
                  required
                  disabled={isUploading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    opacity: isUploading ? 0.7 : 1
                  }}
                >
                  <option value="">Select Color</option>
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={orderData.quantity}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                  disabled={isUploading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    opacity: isUploading ? 0.7 : 1
                  }}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Delivery Address *
              </label>
              <div style={{ display: 'grid', gap: '10px' }}>
                {['Street Address', 'City', 'State/Province', 'ZIP/Postal Code', 'Country'].map((field, index) => (
                  <input
                    key={field}
                    type="text"
                    name={`address_${index}`}
                    placeholder={field}
                    required
                    disabled={isUploading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      opacity: isUploading ? 0.7 : 1
                    }}
                    onChange={(e) => {
                      const addressParts = orderData.address.split('|');
                      addressParts[index] = e.target.value;
                      handleChange({
                        target: {
                          name: 'address',
                          value: addressParts.join('|')
                        }
                      });
                    }}
                    value={orderData.address.split('|')[index] || ''}
                  />
                ))}
              </div>
              {/* Address Info */}
              <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: inKarachi ? '#d4edda' : '#fff3cd',
                border: `1px solid ${inKarachi ? '#c3e6cb' : '#ffeaa7'}`,
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <strong>Delivery Info:</strong> {inKarachi ? 
                  'Karachi delivery - COD and Online payment available' : 
                  'Outside Karachi - Online payment required with payment slip'
                }
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Payment Method *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {inKarachi && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={orderData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      disabled={isUploading}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                )}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={orderData.paymentMethod === 'online'}
                    onChange={handleChange}
                    disabled={isUploading}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Online Payment (Bank Transfer)</span>
                </label>
              </div>
              {formErrors.paymentMethod && (
                <small style={{ color: '#ff6b6b', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                  {formErrors.paymentMethod}
                </small>
              )}
              {!inKarachi && (
                <small style={{ color: '#856404', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  Online payment is required for deliveries outside Karachi
                </small>
              )}
            </div>

            {/* Bank Details Section */}
            {showBankDetails && (
              <div style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>Bank Details for Payment</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                  <div><strong>Bank Name:</strong> {bankDetails.bankName}</div>
                  <div><strong>Account Title:</strong> {bankDetails.accountTitle}</div>
                  <div><strong>Account Number:</strong> {bankDetails.accountNumber}</div>
                  <div><strong>IBAN:</strong> {bankDetails.iban}</div>
                </div>
                <div style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#d1ecf1',
                  border: '1px solid #bee5eb',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#0c5460'
                }}>
                  <strong>Instructions:</strong> Please transfer Rs. {totalAmount.toFixed(2)} and upload the payment slip below.
                </div>

                {/* Payment Slip Upload */}
                <div style={{ marginTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                    Upload Payment Slip *
                  </label>
                  <input
                    type="file"
                    accept="image/*,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleSlipUpload}
                    disabled={isUploading}
                    required={orderData.paymentMethod === 'online'}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${formErrors.paymentSlip ? '#ff6b6b' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      opacity: isUploading ? 0.7 : 1
                    }}
                  />
                  <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                    Upload image of payment slip (Max 5MB, JPG/PNG/GIF/WebP only)
                  </small>
                  
                  {/* Payment Slip Error */}
                  {formErrors.paymentSlip && (
                    <div style={{ 
                      color: '#ff6b6b', 
                      fontSize: '12px', 
                      backgroundColor: '#fff5f5',
                      border: '1px solid #fed7d7',
                      borderRadius: '4px',
                      padding: '8px',
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontSize: '14px' }}>⚠️</span>
                      <span><strong>Required:</strong> {formErrors.paymentSlip}</span>
                    </div>
                  )}
                  
                  {/* Upload Progress */}
                  {isUploading && uploadProgress > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '4px', 
                        height: '8px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          backgroundColor: '#007bff',
                          height: '100%',
                          width: `${uploadProgress}%`,
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                        Uploading... {uploadProgress}%
                      </small>
                    </div>
                  )}
                  
                  {/* Payment Slip Preview */}
                  {slipPreview && (
                    <div style={{ marginTop: '10px' }}>
                      <strong style={{ fontSize: '14px' }}>Payment Slip Preview:</strong>
                      <div style={{
                        marginTop: '5px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '10px',
                        textAlign: 'center',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <img 
                          src={slipPreview} 
                          alt="Payment Slip Preview"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        />
                        <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                          {paymentSlip?.name} ({(paymentSlip?.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Special Instructions (Optional)
              </label>
              <textarea
                name="specialInstructions"
                value={orderData.specialInstructions}
                onChange={handleChange}
                rows="2"
                disabled={isUploading}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical',
                  opacity: isUploading ? 0.7 : 1
                }}
                placeholder="Any special delivery instructions or preferences"
              />
            </div>

            {/* Order Summary */}
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#e7f3ff', 
              borderRadius: '8px',
              border: '1px solid #b3d9ff'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>Order Summary</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Price per item:</span>
                <span>Rs. {product.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Quantity:</span>
                <span>{orderData.quantity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Delivery Charges:</span>
                <span>Rs. {deliveryCharges}</span>
              </div>
              <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #ccc' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                <span>Total Amount:</span>
                <span>Rs. {totalAmount.toFixed(2)}</span>
              </div>
              {orderData.paymentMethod && (
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  <strong>Payment Method:</strong> {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                style={{
                  flex: '1',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: '#f8f9fa',
                  color: '#666',
                  fontSize: '16px',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  opacity: isUploading ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                style={{
                  flex: '2',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: isUploading ? '#6c757d' : '#007bff',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  opacity: isUploading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isUploading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* CSS for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
// const ProductCard = ({ product }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [showOrderForm, setShowOrderForm] = useState(false);
//   const [imageLoading, setImageLoading] = useState(true);
//   const [preloadedImages, setPreloadedImages] = useState(new Set());
//   const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
//   const navigate = useNavigate();

//   // Preload all images when component mounts
//   useEffect(() => {
//     if (product.image && product.image.length > 0) {
//       const preloadImages = async () => {
//         for (let i = 0; i < product.image.length; i++) {
//           try {
//             const img = new Image();
//             img.onload = () => {
//               setPreloadedImages(prev => new Set([...prev, i]));
//             };
//             img.onerror = () => {
//               setImageLoadErrors(prev => new Set([...prev, i]));
//             };
//             img.src = product.image[i];
//           } catch (error) {
//             setImageLoadErrors(prev => new Set([...prev, i]));
//           }
//         }
//       };
      
//       preloadImages();
//     }
//   }, [product.image]);

//   const nextImage = () => {
//     if (product.image && product.image.length > 1) {
//       setCurrentImageIndex((prev) => 
//         prev === product.image.length - 1 ? 0 : prev + 1
//       );
//     }
//   };
  
//   const prevImage = () => {
//     if (product.image && product.image.length > 1) {
//       setCurrentImageIndex((prev) => 
//         prev === 0 ? product.image.length - 1 : prev - 1
//       );
//     }
//   };

//   const goToImage = (index) => {
//     setCurrentImageIndex(index);
//   };

//   const handleImageLoad = () => {
//     setImageLoading(false);
//   };

//   const handleImageError = (e) => {
//     e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
//     setImageLoading(false);
//   };

//   const handleOrderSubmit = async (orderData) => {
//     try {
//       const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      
//       if (!token) {
//         alert('Authentication token missing. Please login again.');
//         navigate('/login');
//         return;
//       }
      
//       const orderWithProduct = {
//         ...orderData,
//         product: {
//           _id: product._id,
//           title: product.title,
//           description: product.description,
//           price: product.price,
//           image: product.image
//         },
//         productImage: product.image,
//         productId: product._id,
//         productTitle: product.title,
//         productPrice: product.price
//       };
      
//       const result = await placeOrder(orderWithProduct, token);
//       alert(`Order placed successfully!\nOrder ID: ${result.orderId}\nTotal: ${orderData.totalAmount}\nWe'll contact you soon!`);
//       setShowOrderForm(false);
//     } catch (error) {
//       console.error('Order failed:', error);
      
//       if (error.message.includes('Authentication') || error.message.includes('token')) {
//         alert('Your session has expired. Please login again.');
//         navigate('/login');
//       } else {
//         alert('Failed to place order. Please try again.');
//       }
//     }
//   };

//   const handleOrderClick = () => {
//     const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
//     const userId = localStorage.getItem('userId');
    
//     if (!isAuthenticated || !userId) {
//       navigate('/login');
//     } else {
//       setShowOrderForm(true);
//     }
//   };

//   return (
//     <>
//       <div 
//         className="product-card"
//         style={{ 
//           border: '1px solid #ddd', 
//           borderRadius: '8px', 
//           padding: '8px', 
//           margin: '0',
//           width: '100%',
//           maxWidth: '100%',
//           minWidth: '0',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//           transition: 'transform 0.2s ease, box-shadow 0.2s ease',
//           backgroundColor: '#fff',
//           overflow: 'hidden'
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.transform = 'translateY(-1px)';
//           e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = 'translateY(0)';
//           e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
//         }}
//       >
//         {/* Image carousel */}
//         {product.image && product.image.length > 0 ? (
//           <div style={{ position: 'relative', marginBottom: '8px' }}>
//             {/* Loading overlay */}
//             {imageLoading && (
//               <div style={{
//                 position: 'absolute',
//                 top: '0',
//                 left: '0',
//                 right: '0',
//                 bottom: '0',
//                 backgroundColor: 'rgba(248, 249, 250, 0.8)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 zIndex: 2,
//                 borderRadius: '6px'
//               }}>
//                 <div style={{
//                   width: '20px',
//                   height: '20px',
//                   border: '2px solid #f3f3f3',
//                   borderTop: '2px solid #007bff',
//                   borderRadius: '50%',
//                   animation: 'spin 1s linear infinite'
//                 }}></div>
//               </div>
//             )}
            
//             <img 
//               src={imageLoadErrors.has(currentImageIndex) 
//                 ? 'https://via.placeholder.com/200x150?text=No+Image'
//                 : product.image[currentImageIndex]
//               } 
//               alt={product.title}
//               style={{ 
//                 width: '100%', 
//                 height: 'auto',
//                 aspectRatio: '1',
//                 objectFit: 'cover',
//                 borderRadius: '6px',
//                 transition: 'opacity 0.3s ease',
//                 opacity: imageLoading ? 0.3 : 1
//               }}
//               onLoad={handleImageLoad}
//               onError={handleImageError}
//             />
            
//             {/* Navigation arrows - only show on larger screens */}
//             {product.image.length > 1 && !imageLoading && (
//               <>
//                 <button 
//                   onClick={prevImage}
//                   className="nav-arrow"
//                   style={{
//                     position: 'absolute',
//                     left: '4px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'rgba(0,0,0,0.6)',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '50%',
//                     width: '24px',
//                     height: '24px',
//                     cursor: 'pointer',
//                     fontSize: '12px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     transition: 'all 0.2s ease',
//                     zIndex: 1
//                   }}
//                 >
//                   ‹
//                 </button>
//                 <button 
//                   onClick={nextImage}
//                   className="nav-arrow"
//                   style={{
//                     position: 'absolute',
//                     right: '4px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'rgba(0,0,0,0.6)',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '50%',
//                     width: '24px',
//                     height: '24px',
//                     cursor: 'pointer',
//                     fontSize: '12px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     transition: 'all 0.2s ease',
//                     zIndex: 1
//                   }}
//                 >
//                   ›
//                 </button>
//               </>
//             )}
            
//             {/* Image indicators */}
//             {product.image.length > 1 && (
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 gap: '3px',
//                 marginTop: '6px'
//               }}>
//                 {product.image.map((_, index) => (
//                   <div
//                     key={index}
//                     onClick={() => goToImage(index)}
//                     style={{
//                       width: '6px',
//                       height: '6px',
//                       borderRadius: '50%',
//                       background: index === currentImageIndex ? '#007bff' : '#ccc',
//                       cursor: 'pointer',
//                       transition: 'all 0.2s ease'
//                     }}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Image counter */}
//             {product.image.length > 1 && (
//               <div style={{
//                 position: 'absolute',
//                 top: '4px',
//                 right: '4px',
//                 backgroundColor: 'rgba(0,0,0,0.7)',
//                 color: 'white',
//                 padding: '2px 6px',
//                 borderRadius: '8px',
//                 fontSize: '10px',
//                 fontWeight: '500'
//               }}>
//                 {currentImageIndex + 1}/{product.image.length}
//               </div>
//             )}
//           </div>
//         ) : (
//           <div style={{ 
//             width: '100%', 
//             aspectRatio: '1',
//             background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             borderRadius: '6px',
//             marginBottom: '8px',
//             color: '#666',
//             fontSize: '10px',
//             fontWeight: '500'
//           }}>
//             📷
//           </div>
//         )}
        
//         <div style={{ padding: '0 2px' }}>
//           <h3 className="product-title" style={{ 
//             margin: '0 0 6px 0', 
//             fontSize: '12px',
//             fontWeight: '600',
//             color: '#2c3e50',
//             lineHeight: '1.2',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap'
//           }}>
//             {product.title}
//           </h3>
          
//           {product.description && (
//             <p className="product-description" style={{ 
//               margin: '0 0 8px 0', 
//               color: '#5a6c7d',
//               fontSize: '10px',
//               lineHeight: '1.3',
//               display: '-webkit-box',
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: 'vertical',
//               overflow: 'hidden'
//             }}>
//               {product.description}
//             </p>
//           )}
          
//           <div style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '8px'
//           }}>
//             <p className="product-price" style={{ 
//               margin: '0', 
//               fontSize: '14px', 
//               fontWeight: '700',
//               color: '#27ae60'
//             }}>
//               {product.price}
//             </p>
            
//             {product.image && product.image.length > 1 && (
//               <span style={{ 
//                 fontSize: '8px', 
//                 color: '#95a5a6',
//                 backgroundColor: '#ecf0f1',
//                 padding: '2px 4px',
//                 borderRadius: '6px',
//                 fontWeight: '500'
//               }}>
//                 {product.image.length} photos
//               </span>
//             )}
//           </div>

//           {/* Order Now Button */}
//           <button
//             onClick={handleOrderClick}
//             className="order-button"
//             style={{
//               width: '100%',
//               padding: '8px 4px',
//               backgroundColor: '#27ae60',
//               color: 'white',
//               border: 'none',
//               borderRadius: '6px',
//               fontSize: '10px',
//               fontWeight: '600',
//               cursor: 'pointer',
//               transition: 'all 0.2s ease',
//               textTransform: 'uppercase',
//               letterSpacing: '0.3px'
//             }}
//           >
//             🛒 ORDER NOW
//           </button>
//         </div>
//       </div>

//       {/* Responsive CSS */}
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
        
//         /* Mobile styles */
//         @media (max-width: 768px) {
//           .product-card {
//             border-radius: 6px !important;
//             padding: 6px !important;
//             box-shadow: 0 1px 4px rgba(0,0,0,0.1) !important;
//           }
          
//           .product-title {
//             font-size: 11px !important;
//             margin-bottom: 4px !important;
//           }
          
//           .product-description {
//             font-size: 9px !important;
//             margin-bottom: 6px !important;
//             -webkit-line-clamp: 1 !important;
//           }
          
//           .product-price {
//             font-size: 12px !important;
//           }
          
//           .order-button {
//             padding: 6px 2px !important;
//             font-size: 9px !important;
//             border-radius: 4px !important;
//           }
          
//           .nav-arrow {
//             width: 20px !important;
//             height: 20px !important;
//             font-size: 10px !important;
//           }
//         }
        
//         /* Tablet styles */
//         @media (min-width: 769px) and (max-width: 1024px) {
//           .product-card {
//             padding: 12px !important;
//             max-width: 280px !important;
//           }
          
//           .product-title {
//             font-size: 16px !important;
//           }
          
//           .product-description {
//             font-size: 12px !important;
//           }
          
//           .order-button {
//             padding: 10px !important;
//             font-size: 12px !important;
//           }
//         }
        
//         /* Desktop styles */
//         @media (min-width: 1025px) {
//           .product-card {
//             padding: 16px !important;
//             max-width: 320px !important;
//           }
          
//           .product-title {
//             font-size: 20px !important;
//             margin-bottom: 12px !important;
//           }
          
//           .product-description {
//             font-size: 14px !important;
//             margin-bottom: 16px !important;
//             -webkit-line-clamp: 3 !important;
//           }
          
//           .product-price {
//             font-size: 24px !important;
//           }
          
//           .order-button {
//             padding: 14px !important;
//             font-size: 16px !important;
//             border-radius: 8px !important;
//           }
//         }
//       `}</style>

//       {/* Order Form Modal */}
//       {showOrderForm && (
//         <OrderForm
//           product={product}
//           onClose={() => setShowOrderForm(false)}
//           onSubmit={handleOrderSubmit}
//         />
//       )}
//     </>
//   );
// };

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const navigate = useNavigate();

  // Preload all images when component mounts
  useEffect(() => {
    if (product.image && product.image.length > 0) {
      const preloadImages = async () => {
        for (let i = 0; i < product.image.length; i++) {
          try {
            const img = new Image();
            img.onload = () => {
              setPreloadedImages(prev => new Set([...prev, i]));
            };
            img.onerror = () => {
              setImageLoadErrors(prev => new Set([...prev, i]));
            };
            img.src = product.image[i];
          } catch (error) {
            setImageLoadErrors(prev => new Set([...prev, i]));
          }
        }
      };
      
      preloadImages();
    }
  }, [product.image]);

  const nextImage = () => {
    if (product.image && product.image.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === product.image.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  const prevImage = () => {
    if (product.image && product.image.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.image.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
    setImageLoading(false);
  };

  // Updated handleOrderSubmit function to properly handle payment slip
//   const handleOrderSubmit = async (orderData, paymentSlipFile = null) => {
//     try {
//       const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      
//       if (!token) {
//         alert('Authentication token missing. Please login again.');
//         navigate('/login');
//         return;
//       }
      
//       // Prepare order data with complete product information
//       const orderWithProduct = {
//         ...orderData,
//         product: {
//           _id: product._id,
//           title: product.title,
//           description: product.description,
//           price: product.price,
//           image: product.image
//         },
//         productImage: product.image,
//         productId: product._id,
//         productTitle: product.title,
//         productPrice: product.price
//       };
      
//       // Log for debugging
//       console.log('Order data:', orderWithProduct);
//       console.log('Payment method:', orderWithProduct.paymentMethod);
//       console.log('Payment slip file:', paymentSlipFile);
      
//       // Call placeOrder with proper parameters
//       const result = await placeOrder(
//         orderWithProduct, 
//         [], // No product images to upload (they're already stored)
//         paymentSlipFile, // Payment slip file
//         token
//       );
      
//       // Success message with order details
//       const successMessage = `Order placed successfully!
// Order ID: ${result.orderId || result._id}
// Total: Rs. ${orderData.totalAmount}
// Payment Method: ${orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
// ${orderData.paymentMethod === 'online' ? 'Payment slip uploaded successfully.' : ''}
// We'll contact you soon!`;
      
//       alert(successMessage);
//       setShowOrderForm(false);
      
//     } catch (error) {
//       console.error('Order failed:', error);
      
//       // Handle different types of errors
//       if (error.message.includes('Authentication') || error.message.includes('token')) {
//         alert('Your session has expired. Please login again.');
//         navigate('/login');
//       } else if (error.message.includes('Payment slip')) {
//         alert('Payment slip upload failed. Please try again with a valid image file.');
//       } else if (error.message.includes('Network')) {
//         alert('Network error. Please check your connection and try again.');
//       } else {
//         alert(`Failed to place order: ${error.message}`);
//       }
//     }
//   };

const handleOrderSubmit = async (orderData, paymentSlipFile = null) => {
  try {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    
    if (!token) {
      alert('Authentication token missing. Please login again.');
      navigate('/login');
      return;
    }

    // Frontend validation for online payment
    if (orderData.paymentMethod === 'online' && !paymentSlipFile) {
      alert('Payment slip is required for online payments. Please upload your payment slip.');
      return; // Stop execution here
    }
    
    // Normalize payment method: convert 'cod' to 'cash' if needed
    const normalizedPaymentMethod = orderData.paymentMethod === 'cod' ? 'cash' : orderData.paymentMethod;
    
    // Prepare order data with complete product information
    const orderWithProduct = {
      ...orderData,
      paymentMethod: normalizedPaymentMethod,
      product: {
        _id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image
      },
      productImage: product.image,
      productId: product._id,
      productTitle: product.title,
      productPrice: product.price
    };
    
    // Log for debugging
    console.log('Order data:', orderWithProduct);
    console.log('Payment method:', orderWithProduct.paymentMethod);
    console.log('Payment slip file:', paymentSlipFile);
    
    // Call placeOrder with proper parameters
    const result = await placeOrder(
      orderWithProduct, 
      [], // No product images to upload (they're already stored)
      paymentSlipFile, // Payment slip file
      token
    );
    
    // Success message with order details
    const successMessage = `Order placed successfully!
Order ID: ${result.orderId || result._id}
Total: Rs. ${orderData.totalAmount}
Payment Method: ${orderData.paymentMethod === 'cod' || orderData.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}
${normalizedPaymentMethod === 'online' ? 'Payment slip uploaded successfully.' : ''}
We'll contact you soon!`;
    
    alert(successMessage);
    setShowOrderForm(false);
    
  } catch (error) {
    console.error('Order failed:', error);
    
    // Handle different types of errors with specific messages
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      alert('Your session has expired. Please login again.');
      navigate('/login');
    } else if (error.message.includes('Payment slip')) {
      alert('Payment slip is required for online payments. Please upload your payment slip and try again.');
    } else if (error.message.includes('Network')) {
      alert('Network error. Please check your connection and try again.');
    } else if (error.message.includes('Invalid order data') || error.message.includes('ValidationError')) {
      alert(`Invalid order information: ${error.message}`);
    } else {
      alert(`Failed to place order: ${error.message}`);
    }
  }
};

  const handleOrderClick = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userId = localStorage.getItem('userId');
    
    if (!isAuthenticated || !userId) {
      navigate('/login');
    } else {
      setShowOrderForm(true);
    }
  };

  return (
    <>
      <div 
        className="product-card"
        style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '8px', 
          margin: '0',
          width: '100%',
          maxWidth: '100%',
          minWidth: '0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          backgroundColor: '#fff',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}
      >
        {/* Image carousel */}
        {product.image && product.image.length > 0 ? (
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            {/* Loading overlay */}
            {imageLoading && (
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
                borderRadius: '6px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #f3f3f3',
                  borderTop: '2px solid #007bff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
            )}
            
            <img 
              src={imageLoadErrors.has(currentImageIndex) 
                ? 'https://via.placeholder.com/200x150?text=No+Image'
                : product.image[currentImageIndex]
              } 
              alt={product.title}
              style={{ 
                width: '100%', 
                height: 'auto',
                aspectRatio: '1',
                objectFit: 'cover',
                borderRadius: '6px',
                transition: 'opacity 0.3s ease',
                opacity: imageLoading ? 0.3 : 1
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Navigation arrows - only show on larger screens */}
            {product.image.length > 1 && !imageLoading && (
              <>
                <button 
                  onClick={prevImage}
                  className="nav-arrow"
                  style={{
                    position: 'absolute',
                    left: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    zIndex: 1
                  }}
                >
                  ‹
                </button>
                <button 
                  onClick={nextImage}
                  className="nav-arrow"
                  style={{
                    position: 'absolute',
                    right: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    zIndex: 1
                  }}
                >
                  ›
                </button>
              </>
            )}
            
            {/* Image indicators */}
            {product.image.length > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '3px',
                marginTop: '6px'
              }}>
                {product.image.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => goToImage(index)}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: index === currentImageIndex ? '#007bff' : '#ccc',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Image counter */}
            {product.image.length > 1 && (
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: '500'
              }}>
                {currentImageIndex + 1}/{product.image.length}
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            width: '100%', 
            aspectRatio: '1',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            marginBottom: '8px',
            color: '#666',
            fontSize: '10px',
            fontWeight: '500'
          }}>
            📷
          </div>
        )}
        
        <div style={{ padding: '0 2px' }}>
          <h3 className="product-title" style={{ 
            margin: '0 0 6px 0', 
            fontSize: '12px',
            fontWeight: '600',
            color: '#2c3e50',
            lineHeight: '1.2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.title}
          </h3>
          
          {product.description && (
            <p className="product-description" style={{ 
              margin: '0 0 8px 0', 
              color: '#5a6c7d',
              fontSize: '10px',
              lineHeight: '1.3',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {product.description}
            </p>
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <p className="product-price" style={{ 
              margin: '0', 
              fontSize: '14px', 
              fontWeight: '700',
              color: '#27ae60'
            }}>
              Rs. {product.price}
            </p>
            
            {product.image && product.image.length > 1 && (
              <span style={{ 
                fontSize: '8px', 
                color: '#95a5a6',
                backgroundColor: '#ecf0f1',
                padding: '2px 4px',
                borderRadius: '6px',
                fontWeight: '500'
              }}>
                {product.image.length} photos
              </span>
            )}
          </div>

          {/* Order Now Button */}
          <button
            onClick={handleOrderClick}
            className="order-button"
            style={{
              width: '100%',
              padding: '8px 4px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}
          >
            🛒 ORDER NOW
          </button>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .product-card {
            border-radius: 6px !important;
            padding: 6px !important;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1) !important;
          }
          
          .product-title {
            font-size: 11px !important;
            margin-bottom: 4px !important;
          }
          
          .product-description {
            font-size: 9px !important;
            margin-bottom: 6px !important;
            -webkit-line-clamp: 1 !important;
          }
          
          .product-price {
            font-size: 12px !important;
          }
          
          .order-button {
            padding: 6px 2px !important;
            font-size: 9px !important;
            border-radius: 4px !important;
          }
          
          .nav-arrow {
            width: 20px !important;
            height: 20px !important;
            font-size: 10px !important;
          }
        }
        
        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .product-card {
            padding: 12px !important;
            max-width: 280px !important;
          }
          
          .product-title {
            font-size: 16px !important;
          }
          
          .product-description {
            font-size: 12px !important;
          }
          
          .order-button {
            padding: 10px !important;
            font-size: 12px !important;
          }
        }
        
        /* Desktop styles */
        @media (min-width: 1025px) {
          .product-card {
            padding: 16px !important;
            max-width: 320px !important;
          }
          
          .product-title {
            font-size: 20px !important;
            margin-bottom: 12px !important;
          }
          
          .product-description {
            font-size: 14px !important;
            margin-bottom: 16px !important;
            -webkit-line-clamp: 3 !important;
          }
          
          .product-price {
            font-size: 24px !important;
          }
          
          .order-button {
            padding: 14px !important;
            font-size: 16px !important;
            border-radius: 8px !important;
          }
        }
        
        .order-button:hover {
          background-color: #229954 !important;
          transform: translateY(-1px);
        }
        
        .nav-arrow:hover {
          background: rgba(0,0,0,0.8) !important;
          transform: translateY(-50%) scale(1.1);
        }
      `}</style>

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          product={product}
          onClose={() => setShowOrderForm(false)}
          onSubmit={handleOrderSubmit}
        />
      )}
    </>
  );
};
const setUserSession = (userData) => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userId', userData.id || userData._id);
  localStorage.setItem('userName', userData.name);
  localStorage.setItem('userEmail', userData.email);
};

// Helper function to clear user session
const clearUserSession = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
};

// Helper function to get current user
const getCurrentUser = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) return null;
  
  return {
    id: localStorage.getItem('userId'),
    name: localStorage.getItem('userName'),
    email: localStorage.getItem('userEmail'),
    isAuthenticated: true
  };
};
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px 20px',
      fontSize: '18px',
      color: '#666'
    }}>
      Loading products...
    </div>
  );
  
  if (error) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px 20px', 
      color: '#e74c3c',
      fontSize: '18px'
    }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{ 
      padding: '20px 10px',
      maxWidth: '100%',
      overflow: 'hidden' // Prevent horizontal scroll
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        color: '#333',
        fontSize: 'clamp(24px, 5vw, 32px)', // Responsive font size
        padding: '0 10px'
      }}>
        Our Products
      </h2>
      
      <div 
        className="product-grid"
        style={{ 
          display: 'grid',
          gap: '20px',
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 10px',
          // Default: 1 column for mobile
          gridTemplateColumns: '1fr'
        }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <div 
              key={product._id}
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1',
            textAlign: 'center', 
            fontSize: '18px', 
            color: '#666',
            padding: '40px 20px'
          }}>
            No products found
          </div>
        )}
      </div>
      
      {/* Responsive CSS */}
      <style>{`
        /* Mobile: 3 columns */
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
            padding: 0 5px !important;
          }
        }
        
        /* Tablet: 2 columns */
        @media (min-width: 769px) and (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 18px !important;
          }
        }
        
        /* Desktop: 3 columns */
        @media (min-width: 1025px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
            max-width: 1200px !important;
          }
        }
        
        /* Prevent horizontal scroll */
        * {
          box-sizing: border-box;
        }
        
        html, body {
          overflow-x: hidden;
          max-width: 100vw;
        }
        
        /* Ensure ProductCard doesn't exceed container */
        .product-grid > div {
          max-width: 100%;
          min-width: 0; /* Allow flex items to shrink */
        }
      `}</style>
    </div>
  );
};

export default Home;