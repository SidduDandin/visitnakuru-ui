"use client";

import { useEffect, useMemo, useState } from "react";
import { parseCookies } from "nookies";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function AdminMenuCategories() {
  const { authToken } = parseCookies();

  /* ================= STATE ================= */
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);

  const [menuId, setMenuId] = useState("");
  const [filterMenuId, setFilterMenuId] = useState("");
  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  /* ================= AUTO HIDE SUCCESS ================= */
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 2000);
    return () => clearTimeout(t);
  }, [successMsg]);

  /* ================= LOAD MENUS ================= */
  const loadMenus = async () => {
    const res = await fetch(`${backendUrl}/api/admin/menu-pages`, {
      headers: { "x-auth-token": authToken },
    });
    const data = await res.json();
    setMenus(Array.isArray(data) ? data : []);
  };

  /* ================= LOAD CATEGORIES ================= */
  const loadCategories = async () => {
    const res = await fetch(`${backendUrl}/api/admin/menu-categories`, {
      headers: { "x-auth-token": authToken },
    });
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadMenus();
    loadCategories();
  }, []);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const e = {};
    if (!menuId) e.menuId = "Menu is required";
    if (!name.trim()) e.name = "Category name is required";
    return e;
  };

  /* ================= ADD / UPDATE ================= */
  const saveCategory = async () => {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);

    const url = editingId
      ? `${backendUrl}/api/admin/menu-categories/${editingId}`
      : `${backendUrl}/api/admin/menu-categories`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authToken,
      },
      body: JSON.stringify({
        MenuID: menuId,
        Name: name,
      }),
    });

    if (!res.ok) {
      setSaving(false);
      return alert("Failed to save category");
    }

    setSuccessMsg(
      editingId
        ? "Category updated successfully!"
        : "Category added successfully!"
    );

    setMenuId("");
    setName("");
    setEditingId(null);
    setErrors({});
    setSaving(false);

    loadCategories();
  };

  /* ================= EDIT ================= */
  const editCategory = (cat) => {
    setEditingId(cat.CategoryID);
    setMenuId(cat.MenuID);
    setName(cat.Name);
    setErrors({});
  };

  /* ================= DELETE ================= */
  const deleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const res = await fetch(
      `${backendUrl}/api/admin/menu-categories/${id}`,
      {
        method: "DELETE",
        headers: { "x-auth-token": authToken },
      }
    );

    if (!res.ok) return alert("Failed to delete");

    setSuccessMsg("Category deleted successfully!");
    loadCategories();
  };

  /* ================= FILTER + SEARCH ================= */
  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const byMenu = filterMenuId
        ? String(c.MenuID) === String(filterMenuId)
        : true;
      const bySearch = c.Name.toLowerCase().includes(
        search.toLowerCase()
      );
      return byMenu && bySearch;
    });
  }, [categories, filterMenuId, search]);

  /* ================= PAGINATION ================= */
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  useEffect(() => setPage(1), [rowsPerPage, search, filterMenuId]);

  const startItem = totalItems === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, totalItems);

  /* ================= UI ================= */
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Manage Menu Categories
        </h1>
        <p className="text-sm text-gray-500">
          Add, edit, and delete categories
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {successMsg && (
          <div className="mb-4 bg-green-100 text-green-800 px-4 py-3 rounded">
            {successMsg}
          </div>
        )}

        {/* FORM */}
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-medium">
              Menu <span className="text-red-500">*</span>
            </label>
            <select
              className="border p-2 w-full rounded"
              value={menuId}
              onChange={(e) => setMenuId(e.target.value)}
            >
              <option value="">-- Select Menu --</option>
              {menus.map((m) => (
                <option key={m.MenuID} value={m.MenuID}>
                  {m.MenuName}
                </option>
              ))}
            </select>
            {errors.menuId && (
              <p className="text-red-500 text-sm">{errors.menuId}</p>
            )}
          </div>

          <div>
            <label className="font-medium">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              className="border p-2 w-full rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={saveCategory}
            disabled={saving}
            className="bg-indigo-600 text-white px-5 py-2 rounded"
          >
            {editingId ? "Update Menu Category" : "Add Menu Category"}
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setName("");
                setMenuId("");
              }}
              className="border px-5 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>

        {/* FILTER BAR */}
        <div className="mb-4">
           <label  className="block mb-2 text-sm font-medium text-gray-900">Filter by Menu</label>
            <select
            className="border rounded px-3 py-2 text-sm"
            value={filterMenuId}
            onChange={(e) => setFilterMenuId(e.target.value)}
          >
            <option value="">-- Show All Menus --</option>
            {menus.map((m) => (
              <option key={m.MenuID} value={m.MenuID}>
                {m.MenuName}
              </option>
            ))}
          </select>
        </div>
          
        <div className="flex justify-between mb-4">      
             <h2 className="text-lg font-semibold mb-3">
                List of Menu Categories
            </h2> 
          <input
            className="border rounded px-3 py-2 text-sm w-64"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Menu</th>
                <th className="px-4 py-3">Category Name</th>
                {/* <th className="px-4 py-3">Created Date</th> */}
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.CategoryID} className="border-t">
                    <td className="px-4 py-4">{c.menu?.MenuName}</td>
                    <td className="px-4 py-4 font-medium">{c.Name}</td>
                    {/* <td className="px-4 py-4">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td> */}
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                          onClick={() => editCategory(c)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => deleteCategory(c.CategoryID)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <p className="text-gray-500">
            Showing {startItem} to {endItem} of {totalItems}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
