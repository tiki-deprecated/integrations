import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage, ProductDiscount, OrderDiscount } from "../pages";

export function AppRouter(){
return (
    <Routes>
        <Route index element={<HomePage />} />
        <Route path="/discount/product/:id?" element={<ProductDiscount />} />
        <Route path="/discount/order/:id?" element={<OrderDiscount />} />
    </Routes> 
)
}