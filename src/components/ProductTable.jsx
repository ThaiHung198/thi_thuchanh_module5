import { useMemo } from "react";
import { Link } from "react-router-dom";

const formatDate = (dateString) => {
  try {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

const ProductTable = ({ products, productTypes }) => {
  const productTypeMap = useMemo(() => {
    return new Map(productTypes.map((pt) => [pt.id, pt.ten_loai_san_pham]));
  }, [productTypes]);

  return (
    <table>
      <thead>
        <tr>
          <th>Mã sản phẩm</th>
          <th>Tên sản phẩm</th>
          <th>Ngày nhập</th>
          <th>Số lượng</th>
          <th>Loại sản phẩm</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.ma_san_pham}</td>
            <td>{product.ten_san_pham}</td>
            <td>{formatDate(product.ngay_nhap)}</td>
            <td>{product.so_luong}</td>
            <td>
              {productTypeMap.get(product.loai_san_pham_id) || "Không xác định"}
            </td>
            <td>
              <Link to={`/products/${product.id}/edit`}>
                <button>Sửa</button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
