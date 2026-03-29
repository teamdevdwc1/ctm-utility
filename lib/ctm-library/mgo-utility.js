// services/mongoQueryBuilder.js
function buildMongoQuery({
  search,
  searchKeys = [],
  sortList = [],
  defaultSort = { updateDate: -1 },
  baseFilter = {},
}) {
  const filter = {};
  const sort = {};
  const andConditions = [];

  // Base filter (e.g., { status: 'A' })
  if (Object.keys(baseFilter).length > 0) {
    andConditions.push(baseFilter);
  }

  // Xử lý tìm kiếm
  if (search && searchKeys.length > 0) {
    const searchRegex = new RegExp(search, "i");
    andConditions.push({
      $or: searchKeys.map((key) => ({ [key]: searchRegex })),
    });
  }
  if (sortList && sortList.length > 0) {
    sortList.forEach(({ key, value }) => {
      if (value === "asc" || value === "desc") {
        sort[key] = value === "asc" ? 1 : -1;
      } else {
        andConditions.push({ [key]: value });
      }
    });
  }
  // Phân tích sortList

  // Sort mặc định nếu chưa có
  if (Object.keys(sort).length === 0 && defaultSort) {
    Object.assign(sort, defaultSort);
  }

  // Nếu có điều kiện thì thêm vào filter
  if (andConditions.length > 0) {
    filter.$and = andConditions;
  }

  return { filter, sort };
}

module.exports = { buildMongoQuery };
