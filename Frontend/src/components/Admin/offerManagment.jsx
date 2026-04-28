import React, { useState, useEffect } from "react";
import { api } from "../../Service/Axios";
import { toast } from "react-toastify";

function AdminOffer() {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    applicableType: "",
    discount_percentage: "",
    startDate: "",
    endDate: ""
  });
  const [loading, setLoading] = useState(false);

  // FETCH OFFERS
  const fetchOffers = async () => {
    try {
      const res = await api.get("/admin/offers");
      setOffers(res.data.offers || []);
    } catch {
      toast.error("Failed to load offers");
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE OFFER
  const handleCreate = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.name.trim()) return toast.error("Offer name is required");
    if (!form.applicableType) return toast.error("Please select a type");
    if (!form.discount_percentage || Number(form.discount_percentage) <= 0)
      return toast.error("Enter valid discount (1-100)");
    if (!form.startDate || !form.endDate)
      return toast.error("Select start and end date");
    if (new Date(form.startDate) >= new Date(form.endDate))
      return toast.error("Start date must be before end date");

    try {
      setLoading(true);

      const res = await api.post("/admin/offers", {
        name: form.name.trim(),
        applicableType: form.applicableType,
        discount_percentage: Number(form.discount_percentage),
        startDate: form.startDate,
        endDate: form.endDate
      });

      setOffers((prev) => [res.data.offer, ...prev]);

      setForm({
        name: "",
        applicableType: "",
        discount_percentage: "",
        startDate: "",
        endDate: ""
      });

      toast.success(res.data.message || "Offer created");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Failed to create offer";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this offer?")) return;

    try {
      await api.delete(`/admin/offers/${id}`);
      setOffers((prev) => prev.filter((o) => o._id !== id));
      toast.success("Offer deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // TOGGLE
  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/admin/offers/${id}/toggle`);
      const updated = res.data.isActive;

      setOffers((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, isActive: updated } : o
        )
      );

      toast.success(`Offer ${updated ? "activated" : "deactivated"}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Toggle failed");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Offer Management</h1>
        <p className="text-gray-500">Manage product offers</p>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Create Offer</h2>

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* NAME */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Offer Name"
            className="border p-2 rounded"
          />

          {/* 🔥 DROPDOWN TYPE */}
          <select
            name="applicableType"
            value={form.applicableType}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="Fragrance">Fragrance</option>
            <option value="Sauvage">Sauvage</option>
            <option value="Dior Homme">Dior Homme</option>
            <option value="Higher">Higher</option>
          </select>

          {/* DISCOUNT */}
          <input
            type="number"
            min="1"
            max="100"
            name="discount_percentage"
            value={form.discount_percentage}
            onChange={handleChange}
            placeholder="Discount %"
            className="border p-2 rounded"
          />

          {/* DATES */}
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`py-2 rounded col-span-1 md:col-span-2 text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Creating..." : "Create Offer"}
          </button>
        </form>
      </div>

      {/* OFFER LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">All Offers</h2>

        <div className="space-y-4">
          {offers.length === 0 && (
            <p className="text-gray-500">No offers available</p>
          )}

          {offers.map((offer) => (
            <div
              key={offer._id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-medium">{offer.name}</p>
                <p className="text-sm text-gray-500">
                  {offer.applicableType} • {offer.discount_percentage}% OFF
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(offer.startDate).toLocaleDateString()} -{" "}
                  {new Date(offer.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    offer.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {offer.isActive ? "Active" : "Inactive"}
                </span>

                <button
                  onClick={() => handleToggle(offer._id)}
                  className="bg-yellow-400 px-3 py-1 rounded text-white text-sm"
                >
                  Toggle
                </button>

                <button
                  onClick={() => handleDelete(offer._id)}
                  className="bg-red-500 px-3 py-1 rounded text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOffer;