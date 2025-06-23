import L from "leaflet";

// Helper function to get SVG path for each category icon
export function getCategoryIconPath(category) {
  if (category) {
    return category.iconSvg;
  }
  // Default to "Khác" icon
  return '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>';
}

// Function to create custom marker icon based on category
export const createCategoryIcon = (category) => {

  return L.divIcon({
    className: "custom-marker-icon",
    html: `<div style="background-color: ${
      category.color
    }; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${category.iconSvg}
            </svg>
          </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

// Helper function to get category color
export function getCategoryColor(category) {
  return category ? category.color : "#6b7280";
}

// Helper function to get category icon element as SVG
export function getCategoryIconElement(category) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={category.color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: category.iconSvg }}
    />
  );
}

// Helper function to get category from task
export function getCategory(task) {
  if (!task.category) return "Khác";
  return task.category;
}
