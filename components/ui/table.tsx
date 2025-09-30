import * as React from "react";

export const Table = ({ children, className }: React.HTMLAttributes<HTMLTableElement>) => (
  <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
);

export const TableHeader = ({ children, className }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={`bg-gray-100 ${className}`}>{children}</thead>
);

export const TableBody = ({ children, className }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`${className}`}>{children}</tbody>
);

export const TableRow = ({ children, className }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`border-t ${className}`}>{children}</tr>
);

export const TableHead = ({ children, className }: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th className={`px-4 py-2 text-left font-medium text-gray-700 ${className}`}>{children}</th>
);

export const TableCell = ({ children, className }: React.HTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-4 py-2 text-gray-600 ${className}`}>{children}</td>
);
