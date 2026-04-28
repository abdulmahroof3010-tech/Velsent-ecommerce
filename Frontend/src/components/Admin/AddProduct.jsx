import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { api } from '../../Service/Axios';
import { toast } from 'react-toastify';
import {ProductValidation} from "./validation/productValidation"
import {EditProductValidation} from "./validation/editValidation"

function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: '',
    type: 'Fragrance',
    ml: 100,
    original_price: '',
    discount_percentage: 0,
    description: '',
    stock: 0,
    image: null
  });

  const categories = ['Fragrance', 'Sauvage', 'Dior Homme', 'Higher'];

  // Use different validation schema based on mode
  const validationSchema = isEditMode ? EditProductValidation : ProductValidation;

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchProductDetails();
    }
  }, [id, isEditMode]);

  const fetchProductDetails = async () => {
    try {
      setFetchingProduct(true);
      const response = await api.get(`/admin/product/${id}`);
      
      if (response.data && response.data.Product) {
        const product = response.data.Product;
        setInitialValues({
          name: product.name || '',
          type: product.type || 'Fragrance',
          ml: product.ml || 100,
          original_price: product.original_price || '',
          discount_percentage: product.discount_percentage || 0,
          description: product.description || '',
          stock: product.stock || 0,
          image: null
        });
        
        // Set image preview if exists
        if (product.image_url && product.image_url[0]) {
          setImagePreview(product.image_url[0].url);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(error.response?.data?.Error || 'Failed to load product details');
      navigate('/admin/products');
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('type', values.type);
      formData.append('ml', values.ml);
      formData.append('original_price', values.original_price);
      formData.append('discount_percentage', values.discount_percentage || 0);
      formData.append('description', values.description);
      formData.append('stock', values.stock);
      
      if (values.image) {
        formData.append('image', values.image);
      }

      if (isEditMode) {
        await api.put(`/admin/product/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully!');
      } else {
        await api.post('/admin/product', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product added successfully!');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.Message || error.response?.data?.Error || 'Error saving product. Please try again.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Loading state while fetching product details
  if (fetchingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditMode ? 'Update product details' : 'Add a new product to your inventory'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting, values, setFieldValue, setFieldTouched }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <Field
                    type="text"
                    name="name"
                    onFocus={() => setFieldTouched('name', false)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Enter product name"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Field
                    as="select"
                    name="type"
                    onFocus={() => setFieldTouched('type', false)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Field>
                  {errors.type && touched.type && (
                    <div className="text-red-500 text-sm mt-1">{errors.type}</div>
                  )}
                </div>

                {/* Size (ml) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size (ml) *
                  </label>
                  <Field
                    type="number"
                    name="ml"
                    onFocus={() => setFieldTouched('ml', false)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.ml && touched.ml ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Enter size in ml"
                  />
                  {errors.ml && touched.ml && (
                    <div className="text-red-500 text-sm mt-1">{errors.ml}</div>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <Field
                    type="number"
                    name="stock"
                    onFocus={() => setFieldTouched('stock', false)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.stock && touched.stock ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Enter stock quantity"
                  />
                  {errors.stock && touched.stock && (
                    <div className="text-red-500 text-sm mt-1">{errors.stock}</div>
                  )}
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (₹) *
                  </label>
                  <Field
                    type="number"
                    name="original_price"
                    onFocus={() => setFieldTouched('original_price', false)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.original_price && touched.original_price ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Enter original price"
                  />
                  {errors.original_price && touched.original_price && (
                    <div className="text-red-500 text-sm mt-1">{errors.original_price}</div>
                  )}
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage (%)
                  </label>
                  <Field
                    type="number"
                    name="discount_percentage"
                    onFocus={() => setFieldTouched('discount_percentage', false)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter discount percentage"
                  />
                  {errors.discount_percentage && touched.discount_percentage && (
                    <div className="text-red-500 text-sm mt-1">{errors.discount_percentage}</div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Final price will be calculated automatically by the backend
                  </p>
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image {!isEditMode && '*'}
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue('image', file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  {errors.image && touched.image && (
                    <div className="text-red-500 text-sm mt-1">{errors.image}</div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                    {isEditMode && ' (Leave empty to keep current image)'}
                  </p>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows="4"
                    onFocus={() => setFieldTouched('description', false)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Enter product description"
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting || loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddProduct;