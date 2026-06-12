import { useState } from 'react';

const usePagination = (initialPage = 1, initialLimit = 20) => {
  const [page,  setPage]  = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  const setMeta = (meta) => {
    if (meta) {
      setTotal(meta.total);
      setPage(meta.page);
    }
  };

  return {
    page, limit, total, totalPages,
    setPage, setLimit, setTotal,
    goToPage, nextPage, prevPage,
    setMeta,
    params: { page, limit },
  };
};

export default usePagination;