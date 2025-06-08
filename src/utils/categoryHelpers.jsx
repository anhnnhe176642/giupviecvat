import React from 'react';
import { Briefcase, Home, Trash2, Truck, Flower, Package, Cpu, MoreHorizontal } from "lucide-react";
import L from "leaflet";

// Categories for filter dropdown with icons
export const categories = [
  { name: "Tất cả", icon: <Briefcase size={18} />, color: "#4b5563" },
  { name: "Nhà cửa", icon: <Home size={18} />, color: "#ef4444" },
  { name: "Dọn dẹp", icon: <Trash2 size={18} />, color: "#3b82f6" },
  { name: "Chuyển nhà", icon: <Truck size={18} />, color: "#f97316" },
  { name: "Vườn", icon: <Flower size={18} />, color: "#10b981" },
  { name: "Giao hàng", icon: <Package size={18} />, color: "#8b5cf6" },
  { name: "Điện tử", icon: <Cpu size={18} />, color: "#f59e0b" },
  { name: "Khác", icon: <MoreHorizontal size={18} />, color: "#6b7280" },
];

// Helper function to get SVG path for each category icon
export function getCategoryIconPath(category) {
  switch (category) {
    case "Nhà cửa":
      return '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>';
    case "Dọn dẹp":
      return '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>';
    case "Chuyển nhà":
      return '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>';
    case "Vườn":
      return '<path d="M12 10c3.976 0 7-3.024 7-7h-4.586a1 1 0 0 0-.707.293l-1.414 1.414a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1-1.414 0l-1.414-1.414a1 1 0 0 0-1.414 0L8.052 9.76c1.033.153 2.083.24 3.125.24z"></path><path d="M10.121 20.364a7.001 7.001 0 0 1-7.193-7.316A7 7 0 0 1 9.172 6.364"></path>';
    case "Giao hàng":
      return '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>';
    case "Điện tử":
      return '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>';
    default:
      return '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>';
  }
}

// Function to create custom marker icon based on category
export const createCategoryIcon = (category) => {
  // Find the category from our list, or use the "Khác" (Other) category as fallback
  const categoryInfo =
    categories.find((cat) => cat.name === category) ||
    categories.find((cat) => cat.name === "Khác");

  return L.divIcon({
    className: "custom-marker-icon",
    html: `<div style="background-color: ${
      categoryInfo.color
    }; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${getCategoryIconPath(category)}
            </svg>
          </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

// Helper function to get category color
export function getCategoryColor(categoryName) {
  const category = categories.find((cat) => cat.name === categoryName);
  return category ? category.color : "#6b7280";
}

// Helper function to get category icon element
export function getCategoryIconElement(categoryName) {
  const category = categories.find((cat) => cat.name === categoryName);
  if (category) {
    const IconComponent = category.icon.type;
    return <IconComponent size={16} color={category.color} />;
  }
  return <MoreHorizontal size={16} color="#6b7280" />;
}

// Helper function to get category name from task
export function getCategoryName(task) {
  if (!task.category) return "Khác";
  return typeof task.category === 'object' ? task.category.name : task.category;
}
