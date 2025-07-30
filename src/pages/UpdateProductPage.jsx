import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ten_san_pham: "",
    ngay_nhap: "",
    so_luong: 0,
    loai_san_pham_id: "",
    ma_san_pham: "",
    gia_ban_dau: 0,
  });
  const [productTypes, setProductTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productResponse, typesResponse] = await Promise.all([
          axios.get(`http://localhost:8000/products/${id}`),
          axios.get("http://localhost:8000/product_types"),
        ]);

        if (productResponse.data) {
          setFormData(productResponse.data);
        } else {
          alert("Không tìm thấy sản phẩm!");
          navigate("/");
        }
        setProductTypes(typesResponse.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ban đầu:", error);
        alert("Không thể tải dữ liệu. Vui lòng thử lại.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === "number" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.ten_san_pham || formData.ten_san_pham.trim() === "") {
      newErrors.ten_san_pham = "Tên sản phẩm là bắt buộc.";
    } else if (formData.ten_san_pham.length > 100) {
      newErrors.ten_san_pham = "Tên sản phẩm không được dài quá 100 ký tự.";
    }

    if (!formData.ngay_nhap) {
      newErrors.ngay_nhap = "Ngày nhập là bắt buộc.";
    } else {
      const selectedDate = new Date(formData.ngay_nhap);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.ngay_nhap = "Ngày nhập không được lớn hơn ngày hiện tại.";
      }
    }

    if (formData.so_luong === undefined || formData.so_luong === "") {
      newErrors.so_luong = "Số lượng là bắt buộc.";
    } else if (!Number.isInteger(formData.so_luong) || formData.so_luong <= 0) {
      newErrors.so_luong = "Số lượng phải là một số nguyên lớn hơn 0.";
    }

    if (!formData.loai_san_pham_id) {
      newErrors.loai_san_pham_id = "Vui lòng chọn một loại sản phẩm.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        await axios.put(`http://localhost:8000/products/${id}`, formData);

        alert("Cập nhật sản phẩm thành công!");
        navigate("/");
      } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Đã có lỗi xảy ra trong quá trình cập nhật. Vui lòng thử lại.");
      }
    }
  };

  if (loading) return <p>Đang tải dữ liệu sản phẩm...</p>;

  return (
    <div className="container">
      <h1>Cập nhật thông tin sản phẩm</h1>
      <form onSubmit={handleSubmit} className="product-form" noValidate>
        {/* Trường Mã sản phẩm (không cho sửa) */}
        <div className="form-group">
          <label>Mã sản phẩm</label>
          <input type="text" value={formData.ma_san_pham || ""} disabled />
        </div>

        {/* Trường Giá bán ban đầu (không cho sửa) */}
        <div className="form-group">
          <label>Giá bán ban đầu</label>
          <input
            type="text"
            value={(formData.gia_ban_dau || 0).toLocaleString("vi-VN") + " VNĐ"}
            disabled
          />
        </div>

        {/* Trường Tên sản phẩm */}
        <div className="form-group">
          <label htmlFor="ten_san_pham">Tên sản phẩm</label>
          <input
            type="text"
            id="ten_san_pham"
            name="ten_san_pham"
            value={formData.ten_san_pham || ""}
            onChange={handleChange}
          />
          {errors.ten_san_pham && (
            <span className="error-message">{errors.ten_san_pham}</span>
          )}
        </div>

        {/* Trường Ngày nhập */}
        <div className="form-group">
          <label htmlFor="ngay_nhap">Ngày nhập</label>
          <input
            type="date"
            id="ngay_nhap"
            name="ngay_nhap"
            value={formData.ngay_nhap || ""}
            onChange={handleChange}
          />
          {errors.ngay_nhap && (
            <span className="error-message">{errors.ngay_nhap}</span>
          )}
        </div>

        {/* Trường Số lượng */}
        <div className="form-group">
          <label htmlFor="so_luong">Số lượng</label>
          <input
            type="number"
            id="so_luong"
            name="so_luong"
            value={formData.so_luong || ""}
            onChange={handleChange}
          />
          {errors.so_luong && (
            <span className="error-message">{errors.so_luong}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="loai_san_pham_id">Loại sản phẩm</label>
          <select
            id="loai_san_pham_id"
            name="loai_san_pham_id"
            value={formData.loai_san_pham_id || ""}
            onChange={handleChange}
          >
            <option value="" disabled>
              -- Chọn loại sản phẩm --
            </option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.ten_loai_san_pham}
              </option>
            ))}
          </select>
          {errors.loai_san_pham_id && (
            <span className="error-message">{errors.loai_san_pham_id}</span>
          )}
        </div>

        {/* Các nút hành động */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Lưu thay đổi
          </button>
          <button type="button" onClick={() => navigate("/")}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductPage;
