import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ProductTable from "../components/ProductTable";
import SearchBar from "../components/SearchBar";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Trang trước
      </button>
      <span style={{ margin: "0 10px" }}>
        Trang {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Trang sau
      </button>
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, typesRes] = await Promise.all([
          axios.get("http://localhost:8000/products"),
          axios.get("http://localhost:8000/product_types"),
        ]);
        setProducts(productsRes.data);
        setProductTypes(typesRes.data);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    // 1. Lọc
    const filtered = products.filter((product) => {
      const nameMatch = product.ten_san_pham
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const typeMatch = selectedType
        ? product.loai_san_pham_id === parseInt(selectedType)
        : true;
      return nameMatch && typeMatch;
    });

    const sorted = [...filtered].sort((a, b) => a.so_luong - b.so_luong);

    return sorted;
  }, [products, searchTerm, selectedType]);
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage
  );
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );
  }, [currentPage, filteredAndSortedProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);
  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container">
      <h1>Hệ thống quản lý sản phẩm</h1>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        selectedType={selectedType}
        onTypeChange={(e) => setSelectedType(e.target.value)}
        productTypes={productTypes}
      />

      {paginatedProducts.length > 0 && productTypes.length > 0 ? (
        <>
          <ProductTable
            products={paginatedProducts}
            productTypes={productTypes}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : loading ? (
        <p>Đang tải...</p>
      ) : (
        <p className="no-results">Không tìm thấy sản phẩm phù hợp.</p>
      )}
    </div>
  );
};

export default HomePage;
