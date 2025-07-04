import { initializeApp } from "firebase/app";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

// ✅ First initialize Firebase app
const firebaseConfig = {
  apiKey: "AIzaSyBf7LKWC1ZSDjEmMtPBVp6gi0z6PVoJx4Y",
  authDomain: "exp-1-1bfa1.firebaseapp.com",
  projectId: "exp-1-1bfa1",
  storageBucket: "exp-1-1bfa1.appspot.com",
  messagingSenderId: "559834894928",
  appId: "1:559834894928:web:a17f11fb1321711ddaf755",
  measurementId: "G-9H842ND7RD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

// Fetch products from your backend
async function getProducts() {
  try {
    const response = await fetch('https://online-store-backend-fdym.vercel.app/api/products', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched products:", data);
    return data;

  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

 async function uploadPaymentSlipAndGetURL(slipFile) {
  try {
    // Validate file input
    if (!slipFile) {
      throw new Error('No payment slip file provided');
    }
    
    // Check if it's a valid file object
    if (!slipFile.name || !slipFile.type) {
      throw new Error('Invalid payment slip file');
    }
    
    // Create unique filename to avoid conflicts
    const timestamp = Date.now();
    const filename = `payment_slip_${timestamp}_${slipFile.name}`;
    const storageRef = ref(storage, 'payment-slips/' + filename);
    
    console.log(`Uploading payment slip ${filename}...`);
    await uploadBytes(storageRef, slipFile);
    const url = await getDownloadURL(storageRef);
    console.log(`Payment slip upload complete: ${url}`);
    return url;
  } catch (error) {
    console.error("Error uploading payment slip:", error);
    throw error;
  }
}

 async function uploadImageAndGetURL(imageFile) {
  try {
    // Validate file input
    if (!imageFile) {
      throw new Error('No image file provided');
    }
    
    // Check if it's a valid file object
    if (!imageFile.name || !imageFile.type) {
      throw new Error('Invalid image file');
    }
    
    // Create unique filename to avoid conflicts
    const timestamp = Date.now();
    const filename = `${timestamp}_${imageFile.name}`;
    const storageRef = ref(storage, 'products/' + filename);
    
    console.log(`Uploading ${filename}...`);
    await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(storageRef);
    console.log(`Upload complete: ${url}`);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// ✅ Upload multiple images to Firebase Storage
 const uploadAllImages = async (imageFiles) => {
  try {
    // Handle different input types
    if (!imageFiles) {
      console.log("No images provided to upload");
      return [];
    }
    
    // Convert to array if it's not already
    const filesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
    
    // Filter out empty or invalid files
    const validFiles = filesArray.filter(file => {
      if (!file) {
        console.warn('Skipping null/undefined file');
        return false;
      }
      
      // Check if it's a valid file object
      if (typeof file !== 'object' || !file.name) {
        console.warn('Skipping invalid file object:', file);
        return false;
      }
      
      // Check if it has a type property and is an image
      if (!file.type || !file.type.startsWith('image/')) {
        console.warn(`Skipping non-image file: ${file.name || 'unknown'} (type: ${file.type || 'unknown'})`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) {
      console.log("No valid image files to upload");
      return [];
    }

    console.log(`Starting upload of ${validFiles.length} valid images...`);
    const urls = [];

    // Upload images sequentially to avoid overwhelming Firebase
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        console.log(`Uploading image ${i + 1}/${validFiles.length}: ${file.name}`);
        const url = await uploadImageAndGetURL(file);
        urls.push(url);
      } catch (uploadError) {
        console.error(`Failed to upload image ${file.name}:`, uploadError);
        // Continue with other files instead of stopping
      }
    }

    console.log(`Successfully uploaded ${urls.length} out of ${validFiles.length} images`);
    return urls;
  } catch (error) {
    console.error("Error in uploadAllImages:", error);
    throw error;
  }
};

export const placeOrder = async (orderData, productImages = [], paymentSlipFile = null, token = null) => {
  // If token not provided, try to get it from localStorage
  const authToken = token || localStorage.getItem('authToken');

  // Ensure userId is present
  if (!orderData.user) {
    throw new Error('User authentication required. Please login again.');
  }

  // Ensure token is present
  if (!authToken) {
    throw new Error('Authentication token required. Please login again.');
  }

  try {
    let productImageUrls = [];
    let paymentSlipUrl = null;

    // Upload product images if provided
    if (productImages && productImages.length > 0) {
      console.log('Uploading product images...');
      productImageUrls = await uploadAllImages(productImages);
    }

    // Upload payment slip if payment method is online and slip file is provided
    if (orderData.paymentMethod === 'online') {
      if (!paymentSlipFile) {
        throw new Error('Payment slip is required for online payments.');
      }
      
      console.log('Uploading payment slip...');
      paymentSlipUrl = await uploadPaymentSlipAndGetURL(paymentSlipFile);
    }

    // Prepare order data with uploaded URLs
    const finalOrderData = {
      ...orderData,
      productImage: productImageUrls.length > 0 ? productImageUrls : orderData.productImage,
      paymentSlip: paymentSlipUrl
    };

    const response = await fetch('https://online-store-backend-fdym.vercel.app/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(finalOrderData)
    });

    if (!response.ok) {
      // Handle different HTTP status codes
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (response.status === 403) {
        throw new Error('Access denied. Please check your permissions.');
      } else if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Invalid order data.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to place order');
    }

    return response.json();

  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }

    // Re-throw the error if it's already a custom error
    throw error;
  }
};

export const getOrders = async () => {
  const response = await axios.get('/api/orders'); // adjust if auth required
  return response.data;
};


  
//   if (!authToken) {
//     throw new Error('Authentication token required. Please login again.');
//   }
  
//   if (!userId) {
//     throw new Error('User ID is required');
//   }

//   try {
//     // Fixed: Added full URL and authorization header
//     const response = await fetch(`http://localhost:3001/api/orders/user/${userId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${authToken}`
//       }
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         throw new Error('Authentication failed. Please login again.');
//       } else if (response.status === 403) {
//         throw new Error('Access denied. You can only view your own orders.');
//       } else if (response.status === 404) {
//         throw new Error('No orders found.');
//       } else if (response.status >= 500) {
//         throw new Error('Server error. Please try again later.');
//       }
      
//       const error = await response.json();
//       throw new Error(error.error || error.message || 'Failed to fetch orders');
//     }

//     return response.json();
    
//   } catch (error) {
//     // Handle network errors
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       throw new Error('Network error. Please check your connection.');
//     }
    
//     throw error;
//   }
// };
export const getMyOrders = async (userId) => {
  const authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    throw new Error('Authentication token required. Please login again.');
  }
  
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const response = await fetch(`https://online-store-backend-fdym.vercel.app/api/orders/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (response.status === 403) {
        throw new Error('Access denied. You can only view your own orders.');
      } else if (response.status === 404) {
        throw new Error('No orders found.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to fetch orders');
    }

    return response.json();
    
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
};

export const updateOrder = async (orderId, updatedData) => {
  const authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    throw new Error('Authentication token required. Please login again.');
  }
  
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  try {
    const response = await fetch(`https://online-store-backend-fdym.vercel.app/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (response.status === 403) {
        throw new Error('Access denied. You can only update your own orders.');
      } else if (response.status === 404) {
        throw new Error('Order not found.');
      } else if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid order data provided.');
      } else if (response.status === 409) {
        throw new Error('Order cannot be updated. It may have already been shipped or delivered.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to update order');
    }

    return response.json();
    
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  const authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    throw new Error('Authentication token required. Please login again.');
  }
  
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  try {
    const response = await fetch(`https://online-store-backend-fdym.vercel.app/api/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (response.status === 403) {
        throw new Error('Access denied. You can only cancel your own orders.');
      } else if (response.status === 404) {
        throw new Error('Order not found.');
      } else if (response.status === 409) {
        throw new Error('Order cannot be cancelled. It may have already been shipped or delivered.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to cancel order');
    }

    return response.json();
    
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
};


export { getProducts, uploadAllImages, uploadImageAndGetURL,uploadPaymentSlipAndGetURL, ref,uploadBytes,getDownloadURL };

