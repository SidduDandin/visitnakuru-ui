"use client";

import { useEffect, useMemo, useState } from "react";
import { parseCookies } from "nookies";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function AdminLocations() {
  const { authToken } = parseCookies();

  /* ================= STATE ================= */
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= AUTO HIDE SUCCESS ================= */
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 2000);
    return () => clearTimeout(t);
  }, [successMsg]);

  /* ================= LOAD ================= */
  const loadLocations = async () => {
    const res = await fetch(`${backendUrl}/api/admin/locations`, {
      headers: { "x-auth-token": authToken },
    });
    const data = await res.json();
    setLocations(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadLocations();
  }, []);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Location name is required";
    return e;
  };

  /* ================= SAVE ================= */
  const saveLocation = async () => {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);

    const url = editingId
      ? `${backendUrl}/api/admin/locations/${editingId}`
      : `${backendUrl}/api/admin/locations`;

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authToken,
      },
      body: JSON.stringify({ Name: name, Region: region }),
    });

    setSuccessMsg(
      editingId
        ? "Location updated successfully!"
        : "Location added successfully!"
    );

    setName("");
    setRegion("");
    setEditingId(null);
    setErrors({});
    setSaving(false);

    loadLocations();
  };

  /* ================= EDIT ================= */
  const editLocation = (loc) => {
    setEditingId(loc.LocationID);
    setName(loc.Name);
    setRegion(loc.Region || "");
  };

  /* ================= DELETE ================= */
  const deleteLocation = async (id) => {
    if (!confirm("Are you sure you want to delete this location?")) return;

    await fetch(`${backendUrl}/api/admin/locations/${id}`, {
      method: "DELETE",
      headers: { "x-auth-token": authToken },
    });

    setSuccessMsg("Location deleted successfully!");
    loadLocations();
  };

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return locations.filter((l) =>
      l.Name.toLowerCase().includes(search.toLowerCase())
    );
  }, [locations, search]);

  /* ================= PAGINATION ================= */
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  useEffect(() => setPage(1), [search, rowsPerPage]);

  const startItem = totalItems === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, totalItems);

  /* ================= UI ================= */
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Manage Locations
        </h1>
        <p className="text-sm text-gray-500">
          Add, edit and delete locations
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {successMsg && (
          <div className="mb-4 bg-green-100 text-green-800 px-4 py-3 rounded">
            {successMsg}
          </div>
        )}

        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Location" : "Add New Location"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-medium">
              Location Name <span className="text-red-500">*</span>
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

          {/* <div>
            <label className="font-medium">Region</label>
            <input
              className="border p-2 w-full rounded"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div> */}
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={saveLocation}
            disabled={saving}
            className="bg-indigo-600 text-white px-5 py-2 rounded"
          >
            {editingId ? "Update Location" : "Add Location"}
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setName("");
                setRegion("");
              }}
              className="border px-5 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>

        {/* FILTER BAR */}
        <div className="flex justify-between mb-4">
          <select
            className="border rounded px-3 py-2 text-sm"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={10}>Show 10</option>
            <option value={25}>Show 25</option>
            <option value={50}>Show 50</option>
          </select>

          <input
            className="border rounded px-3 py-2 text-sm w-64"
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Location Name</th>
                {/* <th className="px-4 py-3">Region</th> */}
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-500">
                    No locations found.
                  </td>
                </tr>
              ) : (
                paginated.map((l) => (
                  <tr key={l.LocationID} className="border-t">
                    <td className="px-4 py-4 font-medium">{l.Name}</td>
                    {/* <td className="px-4 py-4">{l.Region || "-"}</td> */}
                    <td className="px-4 py-4">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                          onClick={() => editLocation(l)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => deleteLocation(l.LocationID)}
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
