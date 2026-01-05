"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button/Button";
import MenuViewModal from "./MenuViewModal";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function MenuListTable({ menus = [], loading = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [viewMenu, setViewMenu] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= SUCCESS MESSAGE ================= */
  useEffect(() => {
    if (searchParams.get("updated")) {
      setSuccessMsg("Menu updated successfully");
      setTimeout(() => {
        setSuccessMsg("");
        router.replace("/admin/menu-pages");
      }, 2000);
    }
  }, [searchParams]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return menus.filter((m) =>
      m.MenuName.toLowerCase().includes(search.toLowerCase())
    );
  }, [menus, search]);

  /* ================= PAGINATION ================= */
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  useEffect(() => setPage(1), [rowsPerPage, search]);

  return (
    <>
      <MenuViewModal
        data={viewMenu}
        onClose={() => setViewMenu(null)}
        backendUrl={backendUrl}
      />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Menu Pages
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {successMsg && (
          <div className="mb-4 bg-green-100 text-green-800 px-4 py-3 rounded">
            {successMsg}
          </div>
        )}

        <div className="shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">List of Menus</h2>

          {/* FILTER BAR */}
          <div className="flex justify-between mb-4">
            <select
              className="border rounded px-3 py-2 text-sm"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value={10}>Show 10</option>
              <option value={25}>Show 25</option>
            </select>

            <input
              className="border rounded px-3 py-2 text-sm w-64"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Menu</th>
                   <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                 
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      Loading…
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      No menus found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((menu) => (
                    <tr key={menu.MenuID} className="border-t">
                      <td className="px-4 py-4">
                        {menu.HeroImage ? (
                          <img
                            src={`${backendUrl}/images/menu/${menu.HeroImage}`}
                            className="w-20 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-14 bg-gray-200 rounded flex items-center justify-center text-xs">
                            No Image
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 font-medium">
                        {menu.MenuName}
                      </td>
                         
                      <td className="px-4 py-4">{menu.Title}</td>

                      <td className="px-4 py-4">
                        {menu.IsActive ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-red-600">Inactive</span>
                        )}
                      </td>
                  

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() => setViewMenu(menu)}
                          >
                            View
                          </button>

                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                            onClick={() =>
                              router.push(
                                `/admin/menu-pages/${menu.MenuID}`
                              )
                            }
                          >
                            Edit
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
            <span>
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
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
      </div>
    </>
  );
}
