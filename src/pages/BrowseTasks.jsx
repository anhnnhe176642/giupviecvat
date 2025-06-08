import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Filter, Plus, Search } from "lucide-react";
import "leaflet/dist/leaflet.css";
import TaskDetailModal from "../components/TaskDetailModal";
import CreateTaskModal from "../components/CreateTaskModal";
import Header from "../layouts/Header";
import TaskMap, { MapReference } from "../components/tasks/TaskMap";
import TaskList from "../components/tasks/TaskList";
import TaskFilters from "../components/tasks/TaskFilters";
import toast from "react-hot-toast";
import { createCategoryIcon, getCategoryColor, getCategoryIconElement, getCategoryName } from "../utils/categoryHelpers";

function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // Changed to "all" as default
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categories, setCategories] = useState([]); // New state for API categories
  
  // Price filter
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  
  // Sorting
  const [sortBy, setSortBy] = useState("newest"); // Options: newest, nearest, price_low, price_high
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);
  const taskListRef = useRef(null);
  
  // Location features
  const [userLocation, setUserLocation] = useState(null);
  const [locationActive, setLocationActive] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5000); // Default 5km radius
  const mapRef = useRef(null);
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        if (response.data.success) {
          // Add an "all" category at the beginning
          const allCategories = [
            { _id: "all", name: "Tất cả" },
            ...response.data.categories
          ];
          setCategories(allCategories);
        } else {
          console.error("Failed to fetch categories:", response.data.message);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);
  
  // Fetch tasks from API with pagination
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Prepare query parameters
        const params = {
          page: 1,
          limit: 10,
          search: searchTerm,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          sort: sortBy,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < 5000000 ? maxPrice : undefined
        };
        
        // Add location parameters if location is active
        if (locationActive && userLocation) {
          params.lat = userLocation.lat;
          params.lng = userLocation.lng;
          params.radius = searchRadius;
        }
        
        const response = await axios.get("/tasks", { params });
        
        if (response.data.success) {
          setTasks(response.data.tasks);
          setTotalTasks(response.data.pagination?.total || 0);
          setHasMore(response.data.pagination?.current < response.data.pagination?.pages);
          setPage(1);
        } else {
          setError("Failed to fetch tasks");
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [searchTerm, selectedCategory, locationActive, userLocation, searchRadius, minPrice, maxPrice, sortBy]);
  
  // Load more tasks when scrolling
  const loadMoreTasks = async () => {
    if (!hasMore || isLoadingMore) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      
      // Prepare query parameters
      const params = {
        page: nextPage,
        limit: 10,
        search: searchTerm,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        sort: sortBy,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice < 5000000 ? maxPrice : undefined
      };
      
      // Add location parameters if location is active
      if (locationActive && userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
        params.radius = searchRadius;
      }
      
      const response = await axios.get("/tasks", { params });
      
      if (response.data.success) {
        setTasks(prevTasks => [...prevTasks, ...response.data.tasks]);
        setPage(nextPage);
        setHasMore(response.data.pagination?.current < response.data.pagination?.pages);
      }
    } catch (err) {
      console.error("Error loading more tasks:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle contact click (e.g., to open chat)
  const handleConactClick = (task) => {

  }
  
  // Handle scroll to load more tasks
  const handleScroll = (e) => {
    if (!taskListRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // When user scrolls to bottom (with a small threshold)
    if (scrollHeight - scrollTop - clientHeight < 100) {
      loadMoreTasks();
    }
  };
  
  // Filter tasks based on search term and category (remove location filtering as it's now done on the backend)
  const filteredTasks = tasks;

  // Get category name by ID
  const getCategoryNameById = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : "Khác";
  };

  // Function to get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLocationActive(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Fly to user location on the map
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 13);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationActive(false);
          toast("Không thể lấy vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí.");
        }
      );
    } else {
      toast("Trình duyệt của bạn không hỗ trợ định vị.");
      setLocationActive(false);
    }
  };

  // Toggle location tracking
  const toggleLocation = () => {
    if (locationActive) {
      setLocationActive(false);
      // Refresh tasks without location filtering
    } else {
      getUserLocation();
      // Location parameters will be added on next useEffect trigger
    }
  };

  // Handle view task details
  const handleViewTaskDetails = (index) => {
    setSelectedTask(index);
    setIsModalOpen(true);
  };

  // Handle create task
  const handleCreateTask = async (newTask) => {
    try {
      // Show loading indicator or disable submit button (would be implemented in a real app)
      
      // Send data to backend API
      const response = await axios.post("/tasks", newTask);
      
      if (response.data.success) {
        // Add the new task to the current tasks list
        setTasks(prevTasks => [response.data.task, ...prevTasks]);
        
        // Show success message
        toast("Công việc đã được tạo thành công!");
        
        // Refresh tasks list to ensure we have the latest data
        // This could be optimized to just add the new task to the state instead of refetching
        const searchParams = {
          page: 1,
          limit: 10,
          search: searchTerm,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          sort: sortBy,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < 5000000 ? maxPrice : undefined
        };
        
        if (locationActive && userLocation) {
          searchParams.lat = userLocation.lat;
          searchParams.lng = userLocation.lng;
          searchParams.radius = searchRadius;
        }
        
        const refreshResponse = await axios.get("/tasks", { params: searchParams });
        if (refreshResponse.data.success) {
          setTasks(refreshResponse.data.tasks);
          setPage(1);
        }
      } else {
        // Show error message
        toast("Lỗi: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast("Đã xảy ra lỗi khi tạo công việc. Vui lòng thử lại sau.");
    }
    setIsCreateModalOpen(false);
  };

  const handleEditTask = async (updatedTask) => {
    try {
      // Show loading indicator or disable submit button (would be implemented in a real app)
      console.log("Updating task:", updatedTask);
      // Send updated data to backend API
      const response = await axios.put(`/tasks/${updatedTask._id}`, updatedTask);
      
      if (response.data.success) {
        // Update the task in the current tasks list
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === updatedTask._id ? response.data.task : task
          )
        );
        
        // Show success message
        toast("Công việc đã được cập nhật thành công!");
        
        // Close the modal
        setIsModalOpen(false);
      } else {
        // Show error message
        toast("Lỗi: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast("Đã xảy ra lỗi khi cập nhật công việc. Vui lòng thử lại sau.");
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      // Show loading indicator or disable delete button (would be implemented in a real app)
      
      // Send delete request to backend API
      const response = await axios.delete(`/tasks/${taskId}`);
      
      if (response.data.success) {
        // Remove the task from the current tasks list
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        
        // Close the modal
        setIsModalOpen(false);
      } else {
        // Show error message
        toast("Lỗi: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast("Đã xảy ra lỗi khi xóa công việc. Vui lòng thử lại sau.");
    }
  }

  // Helper function to get task poster name and image
  const getPosterName = (task) => {
    return task.poster ? task.poster.name : "Unknown User";
  };

  const getPosterImage = (task) => {
    return task.poster && task.poster.profilePicture 
      ? task.poster.profilePicture 
      : "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"; // Fallback image
  };

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row justify-center px-4 md:px-12 lg:px-32 py-3 gap-4">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 lg:max-w-md overflow-y-auto p-5 bg-white shadow-lg rounded-xl md:rounded-l-xl md:rounded-r-none border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text font-bold text-gray-800">Tìm công việc</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow"
            >
              <Plus size={15} className="mr-1.5" />
              Tạo công việc
            </button>
          </div>

          {/* Search input */}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Task count */}
          <p className="text-gray-600 mb-5 font-medium flex items-center">
            <Filter className="w-4 h-4 mr-2 text-green-500" />
            Tìm thấy{" "}
            <span className="text-green-600 mx-1">
              {totalTasks}
            </span>{" "}
            công việc
            {locationActive && userLocation && (
              <span className="ml-1 text-sm text-gray-500">
                (trong bán kính {searchRadius/1000} km)
              </span>
            )}
          </p>

          {/* Task list */}
          <div 
            className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-1"
            onScroll={handleScroll}
            ref={taskListRef}
          >
            <TaskList
              isLoading={isLoading}
              error={error}
              filteredTasks={filteredTasks}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              handleViewTaskDetails={handleViewTaskDetails}
              getPosterName={getPosterName}
              getPosterImage={getPosterImage}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              loadMoreTasks={loadMoreTasks}
            />
          </div>
        </div>

        {/* Map section */}
        <div className="w-full md:w-2/3 md:flex-1 bg-gray-100 relative rounded-xl md:rounded-l-none md:rounded-r-xl overflow-hidden h-[50vh] md:h-[85vh]">
          <TaskMap
            mapRef={mapRef}
            userLocation={userLocation}
            locationActive={locationActive}
            searchRadius={searchRadius}
            filteredTasks={filteredTasks}
            handleViewTaskDetails={handleViewTaskDetails}
            createCategoryIcon={createCategoryIcon}
            getCategoryName={getCategoryName}
            getCategoryIconElement={getCategoryIconElement}
            getCategoryColor={getCategoryColor}
          />

          {/* Filter and location buttons */}
          <TaskFilters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            locationActive={locationActive}
            toggleLocation={toggleLocation}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {/* Task Detail Modal */}
        <TaskDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask !== null ? filteredTasks[selectedTask] : null}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onContactClick={handleConactClick}
        />

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTask={handleCreateTask}
        />
      </div>
    </>
  );
}

export default BrowseTasks;
