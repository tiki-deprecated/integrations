import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage, DiscountOrderCreate, DiscountOrderDetail, DiscountProductCreate, DiscountProductDetail } from "../pages";

export function AppRouter() {
    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="/discount/product" element={<DiscountProductCreate />} />
            <Route path="/discount/product/:id?" element={<DiscountProductDetail />} />
            <Route path="/discount/product/:id?" element={<DiscountOrderCr />} />
            <Route path="/discount/order/:id?" element={<OrderDiscount />} />
        </Routes>
    )
}