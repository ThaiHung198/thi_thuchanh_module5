import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ProductTable from "../components/ProductTable";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/db.json");
        setProducts(response.data.products);
        setProductTypes(response.data.product_types);
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

  // Lọc và Sắp xếp sản phẩm (Đáp ứng Yêu cầu 1 & 3)
  const processedProducts = useMemo(() => {
    return (
      products
        // Lọc kết hợp tên và loại sản phẩm (Yêu cầu 3)
        .filter((product) => {
          const nameMatch = product.ten_san_pham
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const typeMatch = selectedType
            ? product.loai_san_pham_id === parseInt(selectedType)
            : true;
          return nameMatch && typeMatch;
        })
        // Sắp xếp giảm dần theo số lượng (Yêu cầu 1)
        .sort((a, b) => b.so_luong - a.so_luong)
    );
  }, [products, searchTerm, selectedType]);

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
      {processedProducts.length > 0 ? (
        <ProductTable
          products={processedProducts}
          productTypes={productTypes}
        />
      ) : (
        // Hiển thị thông báo khi không có kết quả (Yêu cầu 3)
        <p className="no-results">Không tìm thấy sản phẩm phù hợp.</p>
      )}
    </div>
  );
};

export default HomePage;
