const SearchBar = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  productTypes,
}) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm kiếm theo tên sản phẩm..."
        value={searchTerm}
        onChange={onSearchChange}
      />
      <select value={selectedType} onChange={onTypeChange}>
        <option value="">-- Tất cả loại sản phẩm --</option>
        {productTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.ten_loai_san_pham}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
