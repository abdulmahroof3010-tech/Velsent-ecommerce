import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { api } from '../../Service/Axios';
import useFetch from '../../hooks/useFetch';
import { toast } from 'react-toastify';

const productSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  type: Yup.string().required('Category is required'),
  ml: Yup.number().required('Size is required').min(1, 'Size must be at least 1ml'),
  original_price: Yup.number().required('Original price is required').min(1, 'Price must be at least 1'),
  sale_price: Yup.number().required('Sale price is required').min(1, 'Price must be at least 1'),
  discount_percentage: Yup.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  image_url: Yup.string().url('Must be a valid URL').required('Image URL is required'),
  description: Yup.string().required('Description is required'),
  cost_price: Yup.number().required('Cost price is required').min(1, 'Cost must be at least 1'),
});

function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useFetch('products');
  const isEditMode = !!id;
  
  const existingProduct = isEditMode 
    ? products.find(p => p.id === id)
    : null;

  const initialValues = existingProduct || {
    product_id: `PRD${Date.now().toString().slice(-6)}`,
    name: '',
    type: 'Fragrance',
    ml: 100,
    original_price: '',
    sale_price: '',
    discount_percentage: 0,
    image_url: '',
    description: '',
    cost_price: '',
    isActive: true
  };

  const categories = ['Fragrance', 'Sauvage', 'Dior Homme', 'Higher'];

  const calculateDiscount = (original, sale) => {
    if (!original || !sale || original <= 0) return 0;
    return Math.round(((original - sale) / original) * 100);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, values);
        toast.warn('Product updated successfully!');
      } else {
        // Generate unique ID
        const newProduct = {
          ...values,
          id: `prod${Date.now().toString(36)}${Math.random().toString(36).substr(2)}`,
        };
        await api.post('/products', newProduct);
        toast.warn('Product added successfully!');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.warn('Error saving product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          validationSchema={productSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select Category</option>
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
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.ml && touched.ml ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Enter size in ml"
                  />
                  {errors.ml && touched.ml && (
                    <div className="text-red-500 text-sm mt-1">{errors.ml}</div>
                  )}
                </div>

                {/* Product ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product ID *
                  </label>
                  <Field
                    type="text"
                    name="product_id"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
                    readOnly={isEditMode}
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (₹) *
                  </label>
                  <Field
                    type="number"
                    name="original_price"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.original_price && touched.original_price ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Enter original price"
                    onChange={(e) => {
                      const original = parseFloat(e.target.value);
                      const sale = parseFloat(values.sale_price) || 0;
                      setFieldValue('original_price', original);
                      if (original > 0) {
                        const discount = calculateDiscount(original, sale);
                        setFieldValue('discount_percentage', discount);
                      }
                    }}
                  />
                  {errors.original_price && touched.original_price && (
                    <div className="text-red-500 text-sm mt-1">{errors.original_price}</div>
                  )}
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price (₹) *
                  </label>
                  <Field
                    type="number"
                    name="sale_price"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.sale_price && touched.sale_price ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Enter sale price"
                    onChange={(e) => {
                      const sale = parseFloat(e.target.value);
                      const original = parseFloat(values.original_price) || 0;
                      setFieldValue('sale_price', sale);
                      if (original > 0) {
                        const discount = calculateDiscount(original, sale);
                        setFieldValue('discount_percentage', discount);
                      }
                    }}
                  />
                  {errors.sale_price && touched.sale_price && (
                    <div className="text-red-500 text-sm mt-1">{errors.sale_price}</div>
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
                    readOnly
                  />
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Price (₹) *
                  </label>
                  <Field
                    type="number"
                    name="cost_price"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.cost_price && touched.cost_price ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Enter cost price"
                  />
                  {errors.cost_price && touched.cost_price && (
                    <div className="text-red-500 text-sm mt-1">{errors.cost_price}</div>
                  )}
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <Field
                    type="url"
                    name="image_url"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.image_url && touched.image_url ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.image_url && touched.image_url && (
                    <div className="text-red-500 text-sm mt-1">{errors.image_url}</div>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="Enter product description"
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                {/* Active Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="isActive"
                        value={true}
                        className="w-4 h-4 text-black focus:ring-black"
                      />
                      <span className="ml-2 text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="isActive"
                        value={false}
                        className="w-4 h-4 text-black focus:ring-black"
                      />
                      <span className="ml-2 text-gray-700">Inactive</span>
                    </label>
                  </div>
                </div>

                {/* Image Preview */}
                {values.image_url && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="mt-2">
                      <img
                        src={values.image_url}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
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