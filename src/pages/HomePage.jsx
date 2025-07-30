import { useState, useEffect } from "react";
import axios from "axios";
import ProductTable from "../components/ProductTable";
import SearchBar from "../components/SearchBar";

// Component phân trang có thể đặt ở cuối file này hoặc tạo file riêng
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
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

  // State cho tìm kiếm, sắp xếp, phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortOption, setSortOption] = useState("so_luong_desc"); // Mặc định giảm dần theo số lượng
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 5; // Số sản phẩm trên mỗi trang

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy loại sản phẩm (chỉ cần lấy 1 lần)
        if (productTypes.length === 0) {
          const typeResponse = await axios.get(
            "http://localhost:8000/product_types"
          );
          setProductTypes(typeResponse.data);
        }

        // Xây dựng URL động cho API
        const [sortKey, sortOrder] = sortOption.split("_");
        let apiUrl = `http://localhost:8000/products?_page=${currentPage}&_limit=${productsPerPage}&_sort=${sortKey}&_order=${sortOrder}`;

        if (searchTerm) {
          apiUrl += `&ten_san_pham_like=${searchTerm}`;
        }
        if (selectedType) {
          apiUrl += `&loai_san_pham_id=${selectedType}`;
        }

        const productResponse = await axios.get(apiUrl);

        // json-server trả về tổng số sản phẩm trong headers
        const totalCount = productResponse.headers["x-total-count"];
        setTotalPages(Math.ceil(totalCount / productsPerPage));
        setProducts(productResponse.data);

        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchTerm, selectedType, sortOption]); // Thêm các dependency

  // Reset về trang 1 khi tìm kiếm hoặc lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, sortOption]);

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

      {/* Thêm dropdown sắp xếp */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="sort">Sắp xếp theo: </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="so_luong_desc">Số lượng (Giảm dần)</option>
          <option value="so_luong_asc">Số lượng (Tăng dần)</option>
          <option value="ten_san_pham_asc">Tên sản phẩm (A-Z)</option>
          <option value="ten_san_pham_desc">Tên sản phẩm (Z-A)</option>
        </select>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : products.length > 0 ? (
        <>
          <ProductTable products={products} productTypes={productTypes} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p className="no-results">Không tìm thấy sản phẩm phù hợp.</p>
      )}
    </div>
  );
};

export default HomePage;
