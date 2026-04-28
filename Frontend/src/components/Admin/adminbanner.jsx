import React, { useState, useEffect, useCallback } from 'react';
import { PhotoIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { api } from '../../Service/Axios';
import { toast } from 'react-toastify';

function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/banner');
      
      
      let bannersData = [];
      if (res.data) {
        if (Array.isArray(res.data)) {
          bannersData = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          bannersData = res.data.data;
        } else if (res.data.banners && Array.isArray(res.data.banners)) {
          bannersData = res.data.banners;
        }
      }
      
      setBanners(bannersData);
    } catch (err) {
      console.error('Fetch banners error:', err);
      toast.error(err.response?.data?.message || 'Error fetching banners');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
    
    // Cleanup function for preview URL
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [fetchBanners, preview]);

  // Handle file selection with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPG, PNG, and WEBP are allowed');
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 5MB');
      e.target.value = '';
      return;
    }

    // Clean up old preview
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle banner upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warn('Please select an image first');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await api.post('admin/banner/addBanner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Handle response (your backend returns {message, banner})
      const newBanner = response.data.banner || response.data.data;
      
      toast.success(response.data.message || 'Banner added successfully');
      
      // Clear form
      setSelectedFile(null);
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      
      // Refresh banners list
      await fetchBanners();
      
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || 'Error uploading banner');
    } finally {
      setUploading(false);
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (bannerId) => {
    try {
      setTogglingId(bannerId);
      const response = await api.patch(`/admin/banner/${bannerId}/toggle`);
      
      // Update local state optimistically
      setBanners(prevBanners => 
        prevBanners.map(banner => 
          banner._id === bannerId 
            ? { ...banner, isActive: !banner.isActive }
            : banner
        )
      );
      
      toast.success(response.data.message || 'Banner status updated');
    } catch (err) {
      console.error('Toggle error:', err);
      toast.error(err.response?.data?.message || 'Error updating banner status');
      // Revert on error by refetching
      await fetchBanners();
    } finally {
      setTogglingId(null);
    }
  };

  // Handle delete banner
  const handleDelete = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      setDeletingId(bannerId);
      const response = await api.delete(`/admin/banner/${bannerId}`);
      
      // Update local state optimistically
      setBanners(prevBanners => prevBanners.filter(banner => banner._id !== bannerId));
      
      toast.success(response.data.message || 'Banner deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.message || 'Error deleting banner');
      // Revert on error by refetching
      await fetchBanners();
    } finally {
      setDeletingId(null);
    }
  };

  // Clear form
  const handleClear = () => {
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
        <p className="text-gray-600 mt-2">Manage homepage banners and their visibility</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Banner</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Banner Image *
            </label>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to select an image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP accepted (Max 5MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg, image/jpg, image/png, image/webp"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            {selectedFile && (
              <p className="text-xs text-gray-500 mt-2 truncate">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">Guidelines:</p>
              <ul className="space-y-1 text-gray-600 list-disc list-inside">
                <li>Recommended size: 1920 × 600px</li>
                <li>Formats: JPG, PNG, WEBP</li>
                <li>Max file size: 5MB</li>
                <li>Use high-quality images for best results</li>
              </ul>
            </div>
            <div className="flex space-x-3">
              {selectedFile && (
                <button
                  onClick={handleClear}
                  disabled={uploading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              )}
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="flex items-center px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Upload Banner
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Banners
            <span className="ml-2 text-sm font-normal text-gray-500">({banners.length} total)</span>
          </h2>
        </div>

        {banners.length === 0 ? (
          <div className="text-center py-16">
            <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banners yet</h3>
            <p className="text-gray-500">Upload your first banner using the form above</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {banners.map((banner, index) => (
              <div key={banner._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Banner Image */}
                <div className="w-full sm:w-48 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={banner.image?.url || banner.image}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x150?text=Image+Not+Found';
                    }}
                  />
                </div>

                {/* Banner Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">Banner #{index + 1}</p>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {banner.image?.filename || 'No filename'}
                  </p>
                  {banner.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Added: {new Date(banner.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggleActive(banner._id)}
                    disabled={togglingId === banner._id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      banner.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {togglingId === banner._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    ) : (
                      banner.isActive ? 'Active' : 'Inactive'
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(banner._id)}
                    disabled={deletingId === banner._id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Delete Banner"
                  >
                    {deletingId === banner._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                    ) : (
                      <TrashIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {banners.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Active: {banners.filter(b => b.isActive).length}</span>
              <span>Inactive: {banners.filter(b => !b.isActive).length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BannerManagement;