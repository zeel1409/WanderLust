import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import UnsplashPicker from "../components/UnsplashPicker";

const CATEGORIES = [
  "Beach",
  "Mountains",
  "City",
  "Countryside",
  "Desert",
  "Arctic",
  "Luxury",
  "Cabin",
  "Treehouse",
  "Island",
];
const AMENITIES_LIST = [
  "WiFi",
  "Kitchen",
  "Pool",
  "Parking",
  "AC",
  "Gym",
  "TV",
  "Washer",
  "Dryer",
  "Fireplace",
  "Hot tub",
  "Balcony",
  "Garden",
  "Pet friendly",
];

const AddListing = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [images, setImages] = useState([]);
  const [unsplashUrls, setUnsplashUrls] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    country: "",
    lng: "",
    lat: "",
    category: "City",
    amenities: [],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleUnsplashSelect = (urls) => {
    setUnsplashUrls((prev) => [...prev, ...urls]);
    setImagePreviews((prev) => [...prev, ...urls]);
  };

  const toggleAmenity = (a) => {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter((x) => x !== a)
        : [...p.amenities, a],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach((item) => formData.append(k, item));
        else formData.append(k, v);
      });
      images.forEach((img) => formData.append("images", img));
      unsplashUrls.forEach((url) => formData.append("unsplashUrls", url));

      const { data } = await api.post("/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Listing created! 🎉");
      navigate(`/listings/${data.listing._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const TOTAL_STEPS = 3;
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "#FF385C" }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Step {step} of {TOTAL_STEPS}
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {step === 1 && "Tell us about your place"}
            {step === 2 && "Location & details"}
            {step === 3 && "Photos & amenities"}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Listing title *
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Cozy beach villa with ocean view"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={5}
                  placeholder="Describe your property, what makes it special..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Price per night (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    className="input-field pl-8"
                    placeholder="0"
                    min={1}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`p-3 rounded-xl border-2 text-sm font-medium text-center transition-all ${form.category === cat ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!form.title || !form.description || !form.price) {
                    toast.error("Please fill all required fields");
                    return;
                  }
                  setStep(2);
                }}
                className="btn-primary w-full"
              >
                Next: Location
              </button>
            </div>
          )}

          {/* Step 2: Location & details */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Street address *
                </label>
                <input
                  className="input-field"
                  placeholder="123 Sunny Lane"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    City *
                  </label>
                  <input
                    className="input-field"
                    placeholder="Miami"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Country *
                  </label>
                  <input
                    className="input-field"
                    placeholder="USA"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    placeholder="-80.1918"
                    value={form.lng}
                    onChange={(e) => setForm({ ...form, lng: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    placeholder="25.7617"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: e.target.value })}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                💡 Get coordinates from{" "}
                <a
                  href="https://www.latlong.net"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  latlong.net
                </a>
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  ["maxGuests", "👥 Max guests", 1, 20],
                  ["bedrooms", "🛏 Bedrooms", 0, 20],
                  ["bathrooms", "🚿 Bathrooms", 0, 10],
                ].map(([key, label, min, max]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            [key]: Math.max(min, p[key] - 1),
                          }))
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500"
                      >
                        –
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">
                        {form[key]}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            [key]: Math.min(max, p[key] + 1),
                          }))
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 rounded-lg py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!form.address || !form.city || !form.country) {
                      toast.error("Please fill location fields");
                      return;
                    }
                    setStep(3);
                  }}
                  className="btn-primary flex-1"
                >
                  Next: Photos
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Photos & amenities */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Photos (up to 10)
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#FF385C] transition-colors bg-gray-50 hover:bg-red-50">
                    <svg
                      className="w-8 h-8 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-600">
                      Upload Photos
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowUnsplash(true)}
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 hover:bg-blue-50"
                  >
                    <span className="text-3xl mb-1">🖼️</span>
                    <p className="text-sm font-medium text-gray-600">
                      Search Unsplash
                    </p>
                  </button>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden"
                      >
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {i === 0 && (
                          <div className="absolute bottom-1 left-1 bg-gray-900/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AMENITIES_LIST.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all text-left ${form.amenities.includes(a) ? "border-gray-900 bg-gray-50 font-medium" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}
                    >
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${form.amenities.includes(a) ? "bg-gray-900 border-gray-900" : "border-gray-300"}`}
                      >
                        {form.amenities.includes(a) && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-200 rounded-lg py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Publishing..." : "🚀 Publish listing"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {showUnsplash && (
        <UnsplashPicker
          onClose={() => setShowUnsplash(false)}
          onSelect={handleUnsplashSelect}
        />
      )}
    </div>
  );
};

export default AddListing;
