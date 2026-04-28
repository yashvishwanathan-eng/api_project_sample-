import React, { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:8000";

const emptyForm = { id: "", name: "", description: "", price: "", quantity: "" };

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch {
      showToast("Failed to fetch products", "error");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    const { id, name, description, price, quantity } = form;
    if (!id || !name || !description || !price || !quantity) {
      showToast("Fill all fields", "error"); return;
    }
    const body = { id: +id, name, description, price: +price, quantity: +quantity };

    try {
      if (editingId !== null) {
        await fetch(`${API}/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        showToast("Product updated");
      } else {
        const res = await fetch(`${API}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) { showToast("ID already exists", "error"); return; }
        showToast("Product added");
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();
    } catch {
      showToast("Request failed", "error");
    }
  };

  const handleEdit = (p) => {
    setForm({ id: p.id, name: p.name, description: p.description, price: p.price, quantity: p.quantity });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/products/${id}`, { method: "DELETE" });
      showToast("Product deleted");
      fetchProducts();
    } catch {
      showToast("Delete failed", "error");
    }
    setDeleteConfirm(null);
  };

  const cancelEdit = () => { setForm(emptyForm); setEditingId(null); };

  return (
    <div className="app">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-box">YK</span>
            <div>
              <div className="logo-title">KIRITO</div>
              <div className="logo-sub">Product Inventory System</div>
            </div>
          </div>
          <div className="header-stat">
            <span className="stat-num">{products.length}</span>
            <span className="stat-label">PRODUCTS</span>
          </div>
        </div>
      </header>

      <main className="main">
        {/* Form */}
        <section className="form-section">
          <div className="section-label">{editingId !== null ? `// EDITING ID #${editingId}` : "// ADD NEW PRODUCT"}</div>
          <div className="form-grid">
            {["id", "name", "description", "price", "quantity"].map((field) => (
              <div className="field" key={field}>
                <label className="field-label">{field.toUpperCase()}</label>
                <input
                  className="field-input"
                  type={["id", "quantity"].includes(field) ? "number" : field === "price" ? "number" : "text"}
                  step={field === "price" ? "0.01" : undefined}
                  placeholder={field === "price" ? "0.00" : field === "id" ? "unique id" : `enter ${field}`}
                  value={form[field]}
                  disabled={editingId !== null && field === "id"}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingId !== null ? "UPDATE PRODUCT" : "ADD PRODUCT"}
            </button>
            {editingId !== null && (
              <button className="btn btn-ghost" onClick={cancelEdit}>CANCEL</button>
            )}
          </div>
        </section>

        {/* Table */}
        <section className="table-section">
          <div className="section-label">// PRODUCT CATALOGUE</div>
          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <span>FETCHING DATA...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="empty">NO PRODUCTS FOUND</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    {["ID", "NAME", "DESCRIPTION", "PRICE", "QTY", "ACTIONS"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id} style={{ animationDelay: `${i * 40}ms` }} className="table-row">
                      <td><span className="id-badge">#{p.id}</span></td>
                      <td className="name-cell">{p.name}</td>
                      <td className="desc-cell">{p.description}</td>
                      <td className="price-cell">₹{Number(p.price).toFixed(2)}</td>
                      <td>
                        <span className={`qty-badge ${p.quantity < 10 ? "qty-low" : ""}`}>
                          {p.quantity}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-icon btn-edit" onClick={() => handleEdit(p)} title="Edit">✎</button>
                          <button className="btn-icon btn-del" onClick={() => setDeleteConfirm(p.id)} title="Delete">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Delete modal */}
      {deleteConfirm !== null && (
        <div className="overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">DELETE PRODUCT #{deleteConfirm}?</div>
            <div className="modal-sub">This action cannot be undone.</div>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>DELETE</button>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}