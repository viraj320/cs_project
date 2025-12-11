import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const StepIndicator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { label: "SHOPPING CART", number: "01", path: "/view-cart" },
    { label: "CHECKOUT", number: "02", path: "/checkout" },
    // { label: "ORDER COMPLETE", number: "03", path: "/order-completecredit" }, // make this dynamic if needed
  ];

  return (
    <div className="flex gap-4 justify-center my-6">
      {steps.map((step, index) => {
        const isActive = location.pathname === step.path;

        return (
          <div
            key={index}
            onClick={() => navigate(step.path)}
            className={`w-64 py-3 flex items-center justify-center rounded cursor-pointer border shadow-sm transition-all duration-300 ${
              isActive
                ? "bg-red-600 text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <span className="text-base font-semibold flex items-center gap-3">
              {step.label}
              <span
                className={`text-4xl font-bold ${
                  isActive ? "text-white/30" : "text-black/10"
                }`}
              >
                {step.number}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
