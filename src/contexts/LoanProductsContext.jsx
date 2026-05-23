import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { LOAN_PRODUCTS as STATIC_LOAN_PRODUCTS, setLoanProductRegistry } from '../constants/loanProducts';
import { loanProductCatalogService } from '../services/loanProductCatalogService';

const LoanProductsContext = createContext({
  products: STATIC_LOAN_PRODUCTS,
  loading: true,
  refresh: async () => {},
});

export function LoanProductsProvider({ children }) {
  const [products, setProducts] = useState(STATIC_LOAN_PRODUCTS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await loanProductCatalogService.listPublic();
    if (!error && data?.length) {
      setProducts(data);
      setLoanProductRegistry(data);
    } else {
      setProducts(STATIC_LOAN_PRODUCTS);
      setLoanProductRegistry(STATIC_LOAN_PRODUCTS);
    }
    setLoading(false);
    return data;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <LoanProductsContext.Provider value={{ products, loading, refresh }}>
      {children}
    </LoanProductsContext.Provider>
  );
}

export function useLoanProducts() {
  return useContext(LoanProductsContext);
}
