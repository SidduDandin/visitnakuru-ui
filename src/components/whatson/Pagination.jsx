export default function Pagination({
  pagination,
  pageSize = 9,
  setPage,
}) {
  if (!pagination) return null;

  const page = Number(pagination.page || 1);
  const totalPages = Number(pagination.totalPages || 1);
  const totalItems = Number(pagination.totalItems || 0);

  if (totalItems === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="bg-gary-100 rounded-lg px-4 py-3">
      <div className="flex items-center justify-end gap-4 text-sm text-gray-700">
        {/* PREV */}
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="w-9 h-9 flex items-center justify-center rounded disabled:opacity-90 bg-white"
        >
          ←
        </button>

        {/* RANGE */}
        <span className="whitespace-nowrap">
          {from} – {to} of {totalItems}
        </span>

        {/* NEXT */}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="w-9 h-9 flex items-center justify-center rounded disabled:opacity-90 bg-white"
        >
          →
        </button>
      </div>
    </div>
  );
}
