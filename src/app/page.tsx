"use client";
import { useState, useEffect, useCallback } from "react";

const ITEMS_PER_PAGE = 5;

interface DataItem {
  id: number;
  name: string;
  email: string;
}
//hello
// test git
export default function DataTable() {
  const [data, setData] = useState<DataItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://intern.theassistech.co.th/exam/1")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: DataItem[]) => {
        if (Array.isArray(data)) setData(data);
        else throw new Error("Data is not an array");
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const emptyRows = Array(ITEMS_PER_PAGE - paginatedData.length).fill({
    id: "-",
    name: "-",
    email: "-",
  });

  const finalData = paginatedData.concat(emptyRows);

  const changePage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-5xl font-semibold mb-8 text-center text-gray-900 tracking-tight">
        Data Table
      </h1>

      {loading ? (
        <div className="text-center text-gray-500 text-xl">กำลังโหลดข้อมูล...</div>
      ) : error ? (
        <div className="text-red-500 text-center text-lg">Error: {error}</div>
      ) : (
        <>
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-lg font-medium">
                  <th className="p-6 text-left">ID</th>
                  <th className="p-6 text-left">Name</th>
                  <th className="p-6 text-left">Email</th>
                </tr>
              </thead>
              <tbody className="transition-all duration-500">
                {finalData.map((item, index) => (
                  <tr
                  key={index}
                  className={`transition-all duration-300 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:transform hover:scale-103 hover:bg-gray-100 hover:shadow-lg hover:z-10 hover:cursor-pointer transition-all duration-300`} 
                >
                  <td className="p-6 text-gray-900">{item.id}</td>
                  <td className="p-6 text-gray-700">{item.name}</td>
                  <td className="p-6 text-gray-500">{item.email}</td>
                </tr>
                
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-8 space-x-3">
            <button
              className="px-7 py-3 bg-gray-900 text-white rounded-full shadow-lg hover:scale-105 hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 "
              onClick={() => changePage(1)}
              disabled={currentPage === 1}
            >
              หน้าแรก
            </button>

            <button
              className="px-7 py-3 bg-gray-900 text-white rounded-full shadow-lg hover:scale-105 hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ก่อนหน้า
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-7 py-3 text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:scale-105 ${
                  currentPage === index + 1
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 "
                }`}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="px-7 py-3 bg-gray-900 text-white rounded-full shadow-lg hover:scale-105 hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ถัดไป
            </button>

            <button
              className="px-7 py-3 bg-gray-900 text-white rounded-full shadow-lg hover:scale-105 hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages}
            >
              หน้าสุดท้าย
            </button>
          </div>
        </>
      )}
    </div>
  );
}
