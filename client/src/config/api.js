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
const storage = getStorage(app);

// Fetch products from your backend
async function getProducts() {
  try {
    const response = await fetch('http://localhost:3001/api/products', {
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

// ✅ Upload single image to Firebase Storage
async function uploadImageAndGetURL(imageFile) {
  try {
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
  if (!imageFiles || imageFiles.length === 0) {
    console.log("No images to upload");
    return [];
  }

  console.log(`Starting upload of ${imageFiles.length} images...`);
  const urls = [];
  
  try {
    // Upload images sequentially to avoid overwhelming Firebase
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file && file.type.startsWith('image/')) {
        console.log(`Uploading image ${i + 1}/${imageFiles.length}: ${file.name}`);
        const url = await uploadImageAndGetURL(file);
        urls.push(url);
      } else {
        console.warn(`Skipping invalid file: ${file?.name || 'unknown'}`);
      }
    }
    
    console.log(`Successfully uploaded ${urls.length} images`);
    return urls;
    
  } catch (error) {
    console.error("Error in uploadAllImages:", error);
    throw error;
  }
};

export const placeOrder = async (orderData, token = null) => {
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
    const response = await fetch('http://localhost:3001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(orderData)
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

//   const authToken = localStorage.getItem('authToken');
  
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
    const response = await fetch(`http://localhost:3001/api/orders/user/${userId}`, {
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
    const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
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
    const response = await fetch(`http://localhost:3001/api/orders/${orderId}/cancel`, {
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


export { getProducts, uploadAllImages, uploadImageAndGetURL };

