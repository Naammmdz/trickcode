import { useEffect, useState } from 'react';
import { courseService } from '../../../services/courseService';

const DSA_ICONS = [
    'data_object', 'code_blocks', 'scatter_plot', 'account_tree',
    'sort', 'functions', 'dynamic_feed', 'architecture',
    'calculate', 'schema', 'route', 'hub'
];

const defaultForm = { name: '', description: '', orderIndex: 0, isActive: true };

const CategoriesTab = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(defaultForm);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await courseService.getCategories({ size: 200, sort: 'orderIndex,asc' });
            setCategories(res.content || []);
        } catch (err) {
            setError('Failed to load categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...defaultForm, orderIndex: categories.length + 1 });
        setShowModal(true);
    };

    const openEdit = (cat) => {
        setEditingId(cat.id);
        setForm({
            name: cat.name || '',
            description: cat.description || '',
            orderIndex: cat.orderIndex ?? 0,
            isActive: cat.isActive ?? true,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            alert('Category name is required.');
            return;
        }
        try {
            setSaving(true);
            if (editingId) {
                await courseService.updateCategory(editingId, { ...form, id: editingId });
            } else {
                await courseService.createCategory(form);
            }
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            alert('Failed to save category: ' + (err?.response?.data?.detail || err.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete category "${name}"? Courses in this category won't be deleted.`)) return;
        try {
            await courseService.deleteCategory(id);
            fetchCategories();
        } catch (err) {
            alert('Failed to delete category.');
        }
    };

    const handleToggleActive = async (cat) => {
        try {
            await courseService.updateCategory(cat.id, { ...cat, isActive: !cat.isActive });
            fetchCategories();
        } catch {
            alert('Failed to update status.');
        }
    };

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Category Management</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
                        Manage DSA course categories displayed on the homepage and in filters.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    New Category
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-100 dark:border-neutral-800">
                            <tr>
                                {['Order', 'Name', 'Description', 'Status', 'Actions'].map(col => (
                                    <th key={col} className="text-left px-6 py-3.5 text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-400 rounded-full animate-spin" />
                                            <span className="text-sm text-neutral-400">Loading categories...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-4xl text-neutral-300 dark:text-neutral-700">category</span>
                                            <span className="text-sm text-neutral-400">No categories yet. Create your first one!</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map(cat => (
                                    <tr key={cat.id} className="border-b border-neutral-50 dark:border-neutral-800/50 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono text-neutral-400 dark:text-neutral-500">
                                                #{cat.orderIndex ?? '–'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                                    <span className="material-symbols-outlined text-[16px]">data_object</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{cat.name}</p>
                                                    <p className="text-[10px] font-mono text-neutral-400">ID: {cat.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs truncate">
                                                {cat.description || <span className="italic text-neutral-300 dark:text-neutral-600">No description</span>}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(cat)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${cat.isActive
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/40'
                                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                                    }`}
                                                title="Click to toggle"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">
                                                    {cat.isActive ? 'check_circle' : 'cancel'}
                                                </span>
                                                {cat.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openEdit(cat)}
                                                    className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-base">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id, cat.name)}
                                                    className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                                                    title="Delete"
                                                >
                                                    <span className="material-symbols-outlined text-base">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-serif font-medium text-neutral-900 dark:text-white">
                                {editingId ? 'Edit Category' : 'New Category'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. Dynamic Programming"
                                    className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-sm text-neutral-900 dark:text-white transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Short description of this category..."
                                    rows={3}
                                    className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-sm text-neutral-900 dark:text-white transition-colors resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Display Order</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.orderIndex}
                                        onChange={e => setForm(p => ({ ...p, orderIndex: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-sm text-neutral-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Status</label>
                                    <select
                                        value={form.isActive ? 'true' : 'false'}
                                        onChange={e => setForm(p => ({ ...p, isActive: e.target.value === 'true' }))}
                                        className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-sm text-neutral-900 dark:text-white"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-800">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                            >
                                {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {editingId ? 'Save Changes' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesTab;
