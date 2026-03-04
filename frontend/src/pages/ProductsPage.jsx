import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productApi, categoryApi } from '../api';
import ProductCard from '../components/ui/ProductCard';
import './ProductsPage.css';

const Toast = ({ message, onClose }) => (
    <div className="toast toast-success">
        <span>✓</span>
        <div><strong>Added to cart!</strong><p>{message}</p></div>
        <button onClick={onClose} className="toast-close">✕</button>
    </div>
);

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [toast, setToast] = useState(null);

    const page = parseInt(searchParams.get('page') || '0');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    const updateParam = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(key, value); else params.delete(key);
        params.delete('page');
        setSearchParams(params);
    };

    useEffect(() => {
        categoryApi.getAll().then(({ data }) => setCategories(data)).catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = { page, size: 12, sortBy, sortDir: 'desc' };
        if (search) params.search = search;
        if (categoryId) params.categoryId = categoryId;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        productApi.getAll(params)
            .then(({ data }) => {
                setProducts(data.content || []);
                setTotalPages(data.totalPages || 1);
                setTotalElements(data.totalElements || 0);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [searchParams]);

    const showToast = (name) => {
        setToast(name);
        setTimeout(() => setToast(null), 3000);
    };

    const safeCategories = Array.isArray(categories) ? categories : [];
    const activeCat = safeCategories.find(c => String(c.id) === categoryId);

    return (
        <div className="page products-page">
            <div className="container">
                {/* Page Header */}
                <div className="products-page__header">
                    <div>
                        <span className="label">{activeCat ? activeCat.name : 'All Products'}</span>
                        <h1 className="heading-lg">{activeCat ? activeCat.name : 'All Products'}</h1>
                        <p className="products-page__count">{totalElements} products</p>
                    </div>
                    {/* Search */}
                    <div className="products-page__search-wrapper">
                        <input
                            type="search"
                            className="form-input products-page__search"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => updateParam('search', e.target.value)}
                        />
                    </div>
                </div>

                <div className="products-page__layout">
                    {/* Sidebar Filters */}
                    <aside className="products-page__sidebar">
                        <div className="filter-section">
                            <h3 className="filter-section__title">Categories</h3>
                            <ul>
                                <li>
                                    <button
                                        className={`filter-btn ${!categoryId ? 'filter-btn--active' : ''}`}
                                        onClick={() => updateParam('categoryId', '')}
                                    >
                                        All
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            className={`filter-btn ${String(cat.id) === categoryId ? 'filter-btn--active' : ''}`}
                                            onClick={() => updateParam('categoryId', cat.id)}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="filter-section">
                            <h3 className="filter-section__title">Price Range</h3>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Min $"
                                    value={minPrice}
                                    onChange={(e) => updateParam('minPrice', e.target.value)}
                                    min="0"
                                />
                                <span>—</span>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Max $"
                                    value={maxPrice}
                                    onChange={(e) => updateParam('maxPrice', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="filter-section">
                            <h3 className="filter-section__title">Sort By</h3>
                            <ul>
                                {[
                                    { label: 'Newest', value: 'createdAt' },
                                    { label: 'Price: Low to High', value: 'price-asc' },
                                    { label: 'Price: High to Low', value: 'price-desc' },
                                    { label: 'Name A–Z', value: 'name' },
                                ].map((s) => (
                                    <li key={s.value}>
                                        <button
                                            className={`filter-btn ${sortBy === s.value ? 'filter-btn--active' : ''}`}
                                            onClick={() => {
                                                const params = new URLSearchParams(searchParams);
                                                if (s.value === 'price-asc') {
                                                    params.set('sortBy', 'price');
                                                    params.set('sortDir', 'asc');
                                                } else if (s.value === 'price-desc') {
                                                    params.set('sortBy', 'price');
                                                    params.set('sortDir', 'desc');
                                                } else {
                                                    params.set('sortBy', s.value);
                                                    params.delete('sortDir');
                                                }
                                                params.delete('page');
                                                setSearchParams(params);
                                            }}
                                        >
                                            {s.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {(categoryId || search || minPrice || maxPrice) && (
                            <button className="btn btn-ghost btn--sm btn--full" onClick={() => setSearchParams({})}>
                                Clear All Filters
                            </button>
                        )}
                    </aside>

                    {/* Products Grid */}
                    <div className="products-page__content">
                        {loading ? (
                            <div className="loader"><div className="spinner" /></div>
                        ) : products.length === 0 ? (
                            <div className="no-results">
                                <span>🔍</span>
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search term.</p>
                                <button className="btn btn-primary" onClick={() => setSearchParams({})}>
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="products-grid-3">
                                {products.map((p) => (
                                    <ProductCard key={p.id} product={p} onAddedToCart={showToast} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="btn btn-dark btn--sm"
                                    disabled={page === 0}
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams);
                                        params.set('page', page - 1);
                                        setSearchParams(params);
                                    }}
                                >
                                    ← Prev
                                </button>
                                <span className="pagination__info">Page {page + 1} of {totalPages}</span>
                                <button
                                    className="btn btn-dark btn--sm"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams);
                                        params.set('page', page + 1);
                                        setSearchParams(params);
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ProductsPage;
