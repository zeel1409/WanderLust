import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const CATEGORIES = ['Beach', 'Mountains', 'City', 'Countryside', 'Desert', 'Arctic', 'Luxury', 'Cabin', 'Treehouse', 'Island'];
const AMENITIES_LIST = ['WiFi', 'Kitchen', 'Pool', 'Parking', 'AC', 'Gym', 'TV', 'Washer', 'Dryer', 'Fireplace', 'Hot tub', 'Balcony', 'Garden', 'Pet friendly'];

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [form, setForm] = useState({
        title: '', description: '', price: '',
        address: '', city: '', country: '',
        lng: '', lat: '',
        category: 'City',
        amenities: [],
        maxGuests: 2, bedrooms: 1, bathrooms: 1,
    });

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const { data } = await api.get(`/listings/${id}`);
                const l = data.listing;
                if (l.host._id !== user._id) { toast.error('Not authorized'); navigate('/'); return; }
                setForm({
                    title: l.title, description: l.description, price: l.price,
                    address: l.location.address, city: l.location.city, country: l.location.country,
                    lng: l.location.coordinates?.coordinates?.[0] || '',
                    lat: l.location.coordinates?.coordinates?.[1] || '',
                    category: l.category, amenities: l.amenities || [],
                    maxGuests: l.maxGuests, bedrooms: l.bedrooms, bathrooms: l.bathrooms,
                });
                setImagePreviews(l.images?.map((i) => i.url) || []);
            } catch {
                toast.error('Failed to load listing');
                navigate('/');
            } finally {
                setFetching(false);
            }
        };
        fetchListing();
    }, [id]);

    const toggleAmenity = (a) => {
        setForm((p) => ({
            ...p,
            amenities: p.amenities.includes(a) ? p.amenities.filter((x) => x !== a) : [...p.amenities, a],
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
            images.forEach((img) => formData.append('images', img));
            const { data } = await api.put(`/listings/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Listing updated! ✅');
            navigate(`/listings/${data.listing._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
                    <div className="skeleton h-8 w-1/2 rounded" />
                    <div className="skeleton h-12 rounded" />
                    <div className="skeleton h-36 rounded" />
                    <div className="skeleton h-12 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Edit your listing</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                        <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                        <textarea className="input-field resize-none" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price ($/night) *</label>
                            <input type="number" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                            <input className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country *</label>
                            <input className="input-field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                        <input className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[['maxGuests', '👥 Max guests', 1, 20], ['bedrooms', '🛏 Bedrooms', 0, 20], ['bathrooms', '🚿 Bathrooms', 0, 10]].map(([key, label, min, max]) => (
                            <div key={key}>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setForm((p) => ({ ...p, [key]: Math.max(min, p[key] - 1) }))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">–</button>
                                    <span className="text-sm font-semibold w-5 text-center">{form[key]}</span>
                                    <button type="button" onClick={() => setForm((p) => ({ ...p, [key]: Math.min(max, p[key] + 1) }))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {AMENITIES_LIST.map((a) => (
                                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all text-left ${form.amenities.includes(a) ? 'border-gray-900 bg-gray-50 font-medium' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${form.amenities.includes(a) ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                                        {form.amenities.includes(a) && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </span>
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Add new photos</label>
                        <label className="flex items-center gap-3 w-full border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-[#FF385C] transition-colors bg-gray-50">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="text-sm text-gray-500 font-medium">Click to select images</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { setImages(Array.from(e.target.files)); }} />
                        </label>
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mt-3">
                                {imagePreviews.slice(0, 4).map((src, i) => (
                                    <img key={i} src={src} alt="" className="aspect-square rounded-lg object-cover" />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 border border-gray-200 rounded-lg py-3 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1" style={{ opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Saving...' : '✅ Save changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditListing;
