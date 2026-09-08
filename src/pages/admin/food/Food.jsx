import { useMemo, useState } from "react";
import {
  Apple,
  ChefHat,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Soup,
  Truck,
  UserRound,
  X,
  Utensils,
  AlertCircle,
} from "lucide-react";

/* =========================================================
   SAMPLE FOOD DATA
========================================================= */

const initialFoodItems = [
  {
    id: 1,
    code: "FOOD001",
    name: "Vegetable Khichdi",
    category: "Main Course",
    meal: "Lunch",
    diet: "Soft Diet",
    calories: 280,
    price: 80,
    stock: 45,
    status: "Available",
  },
  {
    id: 2,
    code: "FOOD002",
    name: "Diabetic Vegetable Soup",
    category: "Soup",
    meal: "Dinner",
    diet: "Diabetic",
    calories: 120,
    price: 60,
    stock: 32,
    status: "Available",
  },
  {
    id: 3,
    code: "FOOD003",
    name: "Low Salt Dal",
    category: "Main Course",
    meal: "Lunch",
    diet: "Low Salt",
    calories: 190,
    price: 70,
    stock: 18,
    status: "Low Stock",
  },
  {
    id: 4,
    code: "FOOD004",
    name: "Fruit Bowl",
    category: "Snack",
    meal: "Evening Snack",
    diet: "Regular",
    calories: 150,
    price: 50,
    stock: 60,
    status: "Available",
  },
  {
    id: 5,
    code: "FOOD005",
    name: "Liquid Diet Soup",
    category: "Soup",
    meal: "Dinner",
    diet: "Liquid Diet",
    calories: 100,
    price: 55,
    stock: 8,
    status: "Low Stock",
  },
  {
    id: 6,
    code: "FOOD006",
    name: "Oatmeal",
    category: "Breakfast",
    meal: "Breakfast",
    diet: "Soft Diet",
    calories: 210,
    price: 65,
    stock: 35,
    status: "Available",
  },
];

const initialDietPlans = [
  {
    id: 1,
    patientId: "P1001",
    patientName: "Rahul Das",
    room: "A-102",
    diet: "Diabetic",
    meals: "Breakfast, Lunch, Dinner",
    dietician: "Dr. Ananya Sen",
    status: "Active",
  },
  {
    id: 2,
    patientId: "P1002",
    patientName: "Priya Roy",
    room: "B-205",
    diet: "Low Salt",
    meals: "Breakfast, Lunch, Dinner",
    dietician: "Dr. Ananya Sen",
    status: "Active",
  },
  {
    id: 3,
    patientId: "P1003",
    patientName: "Amit Sen",
    room: "C-110",
    diet: "Liquid Diet",
    meals: "Breakfast, Lunch",
    dietician: "Dr. Riya Das",
    status: "Pending",
  },
  {
    id: 4,
    patientId: "P1004",
    patientName: "Sneha Paul",
    room: "A-115",
    diet: "Soft Diet",
    meals: "Breakfast, Lunch, Dinner",
    dietician: "Dr. Riya Das",
    status: "Active",
  },
];

const initialOrders = [
  {
    id: "ORD-1001",
    patient: "Rahul Das",
    patientId: "P1001",
    room: "A-102",
    meal: "Lunch",
    diet: "Diabetic",
    items: "Vegetable Soup + Khichdi",
    orderTime: "11:10 AM",
    status: "Preparing",
  },
  {
    id: "ORD-1002",
    patient: "Priya Roy",
    patientId: "P1002",
    room: "B-205",
    meal: "Lunch",
    diet: "Low Salt",
    items: "Low Salt Dal + Rice",
    orderTime: "11:20 AM",
    status: "Ready",
  },
  {
    id: "ORD-1003",
    patient: "Amit Sen",
    patientId: "P1003",
    room: "C-110",
    meal: "Lunch",
    diet: "Liquid Diet",
    items: "Liquid Soup",
    orderTime: "11:25 AM",
    status: "Delivered",
  },
  {
    id: "ORD-1004",
    patient: "Sneha Paul",
    patientId: "P1004",
    room: "A-115",
    meal: "Dinner",
    diet: "Soft Diet",
    items: "Soft Khichdi + Fruit",
    orderTime: "05:30 PM",
    status: "Pending",
  },
];

const initialStock = [
  {
    id: 1,
    item: "Rice",
    category: "Grains",
    unit: "Kg",
    quantity: 85,
    reorderLevel: 30,
  },
  {
    id: 2,
    item: "Vegetables",
    category: "Fresh Food",
    unit: "Kg",
    quantity: 42,
    reorderLevel: 20,
  },
  {
    id: 3,
    item: "Milk",
    category: "Dairy",
    unit: "Litre",
    quantity: 18,
    reorderLevel: 25,
  },
  {
    id: 4,
    item: "Dal",
    category: "Pulses",
    unit: "Kg",
    quantity: 35,
    reorderLevel: 15,
  },
  {
    id: 5,
    item: "Fruits",
    category: "Fresh Food",
    unit: "Kg",
    quantity: 12,
    reorderLevel: 20,
  },
];

/* =========================================================
   CONSTANTS
========================================================= */

const mealTypes = [
  "Breakfast",
  "Lunch",
  "Evening Snack",
  "Dinner",
];

const specialDiets = [
  "Regular",
  "Diabetic",
  "Low Salt",
  "Liquid Diet",
  "Soft Diet",
];

const foodCategories = [
  "Breakfast",
  "Main Course",
  "Soup",
  "Snack",
  "Dessert",
  "Beverage",
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Food = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [foodItems, setFoodItems] = useState(initialFoodItems);
  const [dietPlans] = useState(initialDietPlans);
  const [orders, setOrders] = useState(initialOrders);
  const [stock] = useState(initialStock);

  const [search, setSearch] = useState("");
  const [mealFilter, setMealFilter] = useState("All");
  const [dietFilter, setDietFilter] = useState("All");

  const [showFilters, setShowFilters] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showViewFood, setShowViewFood] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [foodForm, setFoodForm] = useState({
    name: "",
    code: "",
    category: "Main Course",
    meal: "Lunch",
    diet: "Regular",
    calories: "",
    price: "",
    stock: "",
  });

  /* =========================================================
     STATISTICS
  ========================================================= */

  const statistics = useMemo(() => {
    const totalFood = foodItems.length;

    const availableFood = foodItems.filter(
      (item) => item.status === "Available"
    ).length;

    const lowStockFood = foodItems.filter(
      (item) => item.stock <= 20
    ).length;

    const activeDietPlans = dietPlans.filter(
      (plan) => plan.status === "Active"
    ).length;

    const pendingOrders = orders.filter(
      (order) =>
        order.status === "Pending" ||
        order.status === "Preparing"
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    return {
      totalFood,
      availableFood,
      lowStockFood,
      activeDietPlans,
      pendingOrders,
      deliveredOrders,
    };
  }, [foodItems, dietPlans, orders]);

  /* =========================================================
     FILTER FOOD
  ========================================================= */

  const filteredFood = useMemo(() => {
    return foodItems.filter((food) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        food.name.toLowerCase().includes(searchValue) ||
        food.code.toLowerCase().includes(searchValue) ||
        food.category.toLowerCase().includes(searchValue);

      const matchesMeal =
        mealFilter === "All" || food.meal === mealFilter;

      const matchesDiet =
        dietFilter === "All" || food.diet === dietFilter;

      return matchesSearch && matchesMeal && matchesDiet;
    });
  }, [foodItems, search, mealFilter, dietFilter]);

  /* =========================================================
     ADD FOOD
  ========================================================= */

  const handleFoodChange = (e) => {
    const { name, value } = e.target;

    setFoodForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddFood = (e) => {
    e.preventDefault();

    const newFood = {
      id: Date.now(),
      ...foodForm,
      calories: Number(foodForm.calories) || 0,
      price: Number(foodForm.price) || 0,
      stock: Number(foodForm.stock) || 0,
      status:
        Number(foodForm.stock) > 20
          ? "Available"
          : "Low Stock",
    };

    setFoodItems((previous) => [newFood, ...previous]);

    setFoodForm({
      name: "",
      code: "",
      category: "Main Course",
      meal: "Lunch",
      diet: "Regular",
      calories: "",
      price: "",
      stock: "",
    });

    setShowAddFood(false);
  };

  /* =========================================================
     ORDER STATUS
  ========================================================= */

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };



  const getStockBadge = (stockValue, reorderLevel = 20) => {
    if (stockValue <= reorderLevel) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
          <AlertCircle size={13} />
          Low Stock
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
        <CheckCircle2 size={13} />
        Available
      </span>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F7FBFA] p-4 md:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F8F6]">
            <Utensils
              size={25}
              className="text-[#08A6A0]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#073F42] md:text-3xl">
              Hospital Food & Diet
            </h1>

            <p className="mt-1 text-sm text-[#789092]">
              Manage patient meals, diets, kitchen operations and food delivery
            </p>
          </div>

        </div>

        <button
          onClick={() => setShowAddFood(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
        >
          <Plus size={18} />
          Add Food Item
        </button>

      </div>

      {/* =====================================================
          DASHBOARD CARDS
      ===================================================== */}

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">

        <StatCard
          title="Food Menu"
          value={statistics.totalFood}
          icon={<Apple size={21} />}
        />

        <StatCard
          title="Available"
          value={statistics.availableFood}
          icon={<CheckCircle2 size={21} />}
        />

        <StatCard
          title="Low Stock"
          value={statistics.lowStockFood}
          icon={<Package size={21} />}
        />

        <StatCard
          title="Diet Plans"
          value={statistics.activeDietPlans}
          icon={<UserRound size={21} />}
        />

        <StatCard
          title="Active Orders"
          value={statistics.pendingOrders}
          icon={<ShoppingBag size={21} />}
        />

        <StatCard
          title="Delivered"
          value={statistics.deliveredOrders}
          icon={<Truck size={21} />}
        />

      </div>

      {/* =====================================================
          NAVIGATION TABS
      ===================================================== */}

      <div className="mb-6 overflow-x-auto rounded-2xl border border-[#E2EFED] bg-white p-2 shadow-sm">

        <div className="flex min-w-max gap-1">

          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<Utensils size={16} />}
            label="Overview"
          />

          <TabButton
            active={activeTab === "menu"}
            onClick={() => setActiveTab("menu")}
            icon={<Apple size={16} />}
            label="Food Menu"
          />

          <TabButton
            active={activeTab === "diet"}
            onClick={() => setActiveTab("diet")}
            icon={<UserRound size={16} />}
            label="Patient Diet Plans"
          />

          <TabButton
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
            icon={<ShoppingBag size={16} />}
            label="Food Orders"
          />

          <TabButton
            active={activeTab === "kitchen"}
            onClick={() => setActiveTab("kitchen")}
            icon={<ChefHat size={16} />}
            label="Kitchen"
          />

          <TabButton
            active={activeTab === "stock"}
            onClick={() => setActiveTab("stock")}
            icon={<Package size={16} />}
            label="Food Stock"
          />

          {/* <TabButton
            active={activeTab === "delivery"}
            onClick={() => setActiveTab("delivery")}
            icon={<Truck size={16} />}
            label="Delivery"
          /> */}

        </div>

      </div>

      {/* =====================================================
          OVERVIEW
      ===================================================== */}

      {activeTab === "overview" && (
        <Overview
          statistics={statistics}
          orders={orders}
          dietPlans={dietPlans}
          onOrderClick={(order) => {
            setSelectedOrder(order);
            setShowOrderDetails(true);
          }}
        />
      )}

      {/* =====================================================
          FOOD MENU
      ===================================================== */}

      {activeTab === "menu" && (
        <>

          <div className="mb-5 rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">

            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#819596]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search food name, code or category..."
                  className="w-full rounded-xl border border-[#D9E9E7] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                />

              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-5 py-3 text-sm font-semibold text-[#31585A] hover:bg-[#E8F8F6]"
              >
                <Filter size={17} />
                Filters
              </button>

            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#EAF2F0] pt-4 md:grid-cols-2">

                <select
                  value={mealFilter}
                  onChange={(e) => setMealFilter(e.target.value)}
                  className="rounded-xl border border-[#D9E9E7] px-4 py-3 text-sm outline-none focus:border-[#08A6A0]"
                >
                  <option value="All">All Meals</option>
                  {mealTypes.map((meal) => (
                    <option key={meal}>{meal}</option>
                  ))}
                </select>

                <select
                  value={dietFilter}
                  onChange={(e) => setDietFilter(e.target.value)}
                  className="rounded-xl border border-[#D9E9E7] px-4 py-3 text-sm outline-none focus:border-[#08A6A0]"
                >
                  <option value="All">All Diets</option>
                  {specialDiets.map((diet) => (
                    <option key={diet}>{diet}</option>
                  ))}
                </select>

              </div>
            )}

          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">

            <div className="border-b border-[#EAF2F0] px-5 py-5">
              <h2 className="text-lg font-bold text-[#073F42]">
                Food Menu
              </h2>

              <p className="mt-1 text-sm text-[#819596]">
                Manage hospital food items and meal availability
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-[#F7FBFA]">
                  <tr className="border-b border-[#EAF2F0]">

                    <TableHead>Food Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Meal</TableHead>
                    <TableHead>Diet</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Action</TableHead>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EAF2F0]">

                  {filteredFood.map((food) => (

                    <tr
                      key={food.id}
                      className="transition hover:bg-[#FBFEFD]"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6]">
                            <Soup
                              size={18}
                              className="text-[#08A6A0]"
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-[#173F41]">
                              {food.name}
                            </p>

                            <p className="text-xs text-[#819596]">
                              {food.code}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm text-[#31585A]">
                        {food.category}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#31585A]">
                        {food.meal}
                      </td>

                      <td className="px-5 py-4">

                        <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#078F8A]">
                          {food.diet}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-sm text-[#31585A]">
                        {food.calories} kcal
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-[#173F41]">
                        ₹{food.price}
                      </td>

                      <td className="px-5 py-4">
                        {getStockBadge(food.stock)}
                      </td>

                      <td className="px-5 py-4">

                        <button
                          onClick={() => {
                            setSelectedFood(food);
                            setShowViewFood(true);
                          }}
                          className="rounded-lg border border-[#D9E9E7] p-2 text-[#31585A] hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                        >
                          <Eye size={16} />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </>
      )}

      {/* =====================================================
          PATIENT DIET PLANS
      ===================================================== */}

      {activeTab === "diet" && (
        <DietPlans dietPlans={dietPlans} />
      )}

      {/* =====================================================
          FOOD ORDERS
      ===================================================== */}

      {activeTab === "orders" && (
        <FoodOrders
          orders={orders}
          onView={(order) => {
            setSelectedOrder(order);
            setShowOrderDetails(true);
          }}
          onStatusChange={updateOrderStatus}
        />
      )}

      {/* =====================================================
          KITCHEN MANAGEMENT
      ===================================================== */}

      {activeTab === "kitchen" && (
        <KitchenManagement orders={orders} />
      )}

      {/* =====================================================
          FOOD STOCK
      ===================================================== */}

      {activeTab === "stock" && (
        <FoodStock stock={stock} getStockBadge={getStockBadge} />
      )}

      {/* =====================================================
          DELIVERY
      ===================================================== */}

      {/* {activeTab === "delivery" && (
        <DeliveryStatus orders={orders} />
      )} */}

      {/* =====================================================
          ADD FOOD MODAL
      ===================================================== */}

      {showAddFood && (
        <Modal
          title="Add Food Item"
          onClose={() => setShowAddFood(false)}
        >

          <form onSubmit={handleAddFood}>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <Input
                label="Food Name *"
                name="name"
                value={foodForm.name}
                onChange={handleFoodChange}
                required
              />

              <Input
                label="Food Code *"
                name="code"
                value={foodForm.code}
                onChange={handleFoodChange}
                required
              />

              <Select
                label="Category"
                name="category"
                value={foodForm.category}
                onChange={handleFoodChange}
                options={foodCategories}
              />

              <Select
                label="Meal"
                name="meal"
                value={foodForm.meal}
                onChange={handleFoodChange}
                options={mealTypes}
              />

              <Select
                label="Special Diet"
                name="diet"
                value={foodForm.diet}
                onChange={handleFoodChange}
                options={specialDiets}
              />

              <Input
                label="Calories"
                name="calories"
                type="number"
                value={foodForm.calories}
                onChange={handleFoodChange}
              />

              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                value={foodForm.price}
                onChange={handleFoodChange}
              />

              <Input
                label="Stock"
                name="stock"
                type="number"
                value={foodForm.stock}
                onChange={handleFoodChange}
              />

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowAddFood(false)}
                className="rounded-xl border border-[#D9E9E7] px-5 py-3 text-sm font-semibold text-[#31585A]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#08A6A0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#078F8A]"
              >
                Add Food
              </button>

            </div>

          </form>

        </Modal>
      )}

      {/* =====================================================
          VIEW FOOD MODAL
      ===================================================== */}

      {showViewFood && selectedFood && (
        <Modal
          title="Food Details"
          onClose={() => setShowViewFood(false)}
        >

          <div className="mb-5 flex items-center gap-4 rounded-2xl bg-[#E8F8F6] p-5">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <Soup
                size={26}
                className="text-[#08A6A0]"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#073F42]">
                {selectedFood.name}
              </h3>

              <p className="text-sm text-[#789092]">
                {selectedFood.code}
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <Detail label="Category" value={selectedFood.category} />
            <Detail label="Meal" value={selectedFood.meal} />
            <Detail label="Diet" value={selectedFood.diet} />
            <Detail label="Calories" value={`${selectedFood.calories} kcal`} />
            <Detail label="Price" value={`₹${selectedFood.price}`} />
            <Detail label="Current Stock" value={selectedFood.stock} />
          </div>

        </Modal>
      )}

      {/* =====================================================
          ORDER DETAILS MODAL
      ===================================================== */}

      {showOrderDetails && selectedOrder && (
        <Modal
          title="Food Order Details"
          onClose={() => setShowOrderDetails(false)}
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <Detail
              label="Order ID"
              value={selectedOrder.id}
            />

            <Detail
              label="Patient"
              value={selectedOrder.patient}
            />

            <Detail
              label="Patient ID"
              value={selectedOrder.patientId}
            />

            <Detail
              label="Room"
              value={selectedOrder.room}
            />

            <Detail
              label="Meal"
              value={selectedOrder.meal}
            />

            <Detail
              label="Diet"
              value={selectedOrder.diet}
            />

            <Detail
              label="Food Items"
              value={selectedOrder.items}
            />

            <Detail
              label="Order Time"
              value={selectedOrder.orderTime}
            />

            <Detail
              label="Status"
              value={selectedOrder.status}
            />

          </div>

          <div className="mt-6 rounded-2xl bg-[#E8F8F6] p-4">

            <p className="mb-3 text-sm font-bold text-[#073F42]">
              Update Delivery Status
            </p>

            <div className="flex flex-wrap gap-2">

              {["Pending", "Preparing", "Ready", "Delivered"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => {
                      updateOrderStatus(
                        selectedOrder.id,
                        status
                      );

                      setSelectedOrder({
                        ...selectedOrder,
                        status,
                      });
                    }}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                      selectedOrder.status === status
                        ? "bg-[#08A6A0] text-white"
                        : "bg-white text-[#31585A] hover:bg-[#078F8A] hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}

            </div>

          </div>

        </Modal>
      )}

    </div>
  );
};

/* =========================================================
   OVERVIEW
========================================================= */

const Overview = ({
  orders,
  dietPlans,
  onOrderClick,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

      <div className="xl:col-span-2">

        <SectionCard
          title="Today's Meal Schedule"
          subtitle="Breakfast, lunch, evening snack and dinner"
        >

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <MealCard
              title="Breakfast"
              time="07:30 AM"
              icon="🍳"
              count="45 Patients"
            />

            <MealCard
              title="Lunch"
              time="12:30 PM"
              icon="🍚"
              count="68 Patients"
            />

            <MealCard
              title="Evening Snack"
              time="04:30 PM"
              icon="🍎"
              count="52 Patients"
            />

            <MealCard
              title="Dinner"
              time="07:30 PM"
              icon="🍲"
              count="71 Patients"
            />

          </div>

        </SectionCard>

      </div>

      <SectionCard
        title="Special Diet Summary"
        subtitle="Current patient diet requirements"
      >

        <div className="space-y-3">

          <SummaryRow
            title="Diabetic"
            value="18 Patients"
          />

          <SummaryRow
            title="Low Salt"
            value="12 Patients"
          />

          <SummaryRow
            title="Liquid Diet"
            value="8 Patients"
          />

          <SummaryRow
            title="Soft Diet"
            value="15 Patients"
          />

        </div>

      </SectionCard>

      <div className="xl:col-span-2">

        <SectionCard
          title="Recent Food Orders"
          subtitle="Latest patient meal orders"
        >

          <div className="space-y-3">

            {orders.slice(0, 4).map((order) => (

              <button
                key={order.id}
                onClick={() => onOrderClick(order)}
                className="flex w-full items-center justify-between rounded-xl border border-[#EAF2F0] p-4 text-left transition hover:border-[#08A6A0] hover:bg-[#E8F8F6]"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6]">
                    <ShoppingBag
                      size={18}
                      className="text-[#08A6A0]"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#173F41]">
                      {order.id}
                    </p>

                    <p className="text-xs text-[#819596]">
                      {order.patient} • Room {order.room}
                    </p>
                  </div>

                </div>

                {getOrderStatusBadge(order.status)}

              </button>

            ))}

          </div>

        </SectionCard>

      </div>

      <SectionCard
        title="Diet Plans"
        subtitle="Patient diet plan overview"
      >

        <div className="space-y-3">

          {dietPlans.slice(0, 4).map((plan) => (

            <div
              key={plan.id}
              className="rounded-xl border border-[#EAF2F0] p-3"
            >

              <div className="flex items-center justify-between">

                <p className="text-sm font-semibold text-[#173F41]">
                  {plan.patientName}
                </p>

                <span className="rounded-full bg-[#E8F8F6] px-2.5 py-1 text-xs font-semibold text-[#08A6A0]">
                  {plan.diet}
                </span>

              </div>

              <p className="mt-1 text-xs text-[#819596]">
                Room {plan.room} • {plan.dietician}
              </p>

            </div>

          ))}

        </div>

      </SectionCard>

    </div>
  );
};

/* =========================================================
   DIET PLANS
========================================================= */

const DietPlans = ({ dietPlans }) => {
  return (
    <SectionCard
      title="Patient Diet Plans"
      subtitle="Dietician assigned diet plans for admitted patients"
    >

      <div className="overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <thead className="bg-[#F7FBFA]">

            <tr className="border-b border-[#EAF2F0]">

              <TableHead>Patient</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Diet</TableHead>
              <TableHead>Meals</TableHead>
              <TableHead>Dietician</TableHead>
              <TableHead>Status</TableHead>

            </tr>

          </thead>

          <tbody className="divide-y divide-[#EAF2F0]">

            {dietPlans.map((plan) => (

              <tr key={plan.id} className="hover:bg-[#FBFEFD]">

                <td className="px-5 py-4">

                  <p className="font-semibold text-[#173F41]">
                    {plan.patientName}
                  </p>

                  <p className="text-xs text-[#819596]">
                    {plan.patientId}
                  </p>

                </td>

                <td className="px-5 py-4 text-sm text-[#31585A]">
                  {plan.room}
                </td>

                <td className="px-5 py-4">

                  <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#078F8A]">
                    {plan.diet}
                  </span>

                </td>

                <td className="px-5 py-4 text-sm text-[#31585A]">
                  {plan.meals}
                </td>

                <td className="px-5 py-4 text-sm text-[#31585A]">
                  {plan.dietician}
                </td>

                <td className="px-5 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      plan.status === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {plan.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </SectionCard>
  );
};

/* =========================================================
   FOOD ORDERS
========================================================= */

const FoodOrders = ({
  orders,
  onView,
  onStatusChange,
}) => {
  return (
    <SectionCard
      title="Food Orders"
      subtitle="Manage patient meal orders and kitchen status"
    >

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1000px]">

          <thead className="bg-[#F7FBFA]">

            <tr className="border-b border-[#EAF2F0]">

              <TableHead>Order</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Meal</TableHead>
              <TableHead>Diet</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>

            </tr>

          </thead>

          <tbody className="divide-y divide-[#EAF2F0]">

            {orders.map((order) => (

              <tr
                key={order.id}
                className="hover:bg-[#FBFEFD]"
              >

                <td className="px-5 py-4 font-semibold text-[#173F41]">
                  {order.id}
                </td>

                <td className="px-5 py-4">

                  <p className="text-sm font-semibold text-[#173F41]">
                    {order.patient}
                  </p>

                  <p className="text-xs text-[#819596]">
                    Room {order.room}
                  </p>

                </td>

                <td className="px-5 py-4 text-sm text-[#31585A]">
                  {order.meal}
                </td>

                <td className="px-5 py-4">

                  <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#08A6A0]">
                    {order.diet}
                  </span>

                </td>

                <td className="max-w-[220px] px-5 py-4 text-sm text-[#31585A]">
                  {order.items}
                </td>

                <td className="px-5 py-4">
                  {getOrderStatusBadge(order.status)}
                </td>

                <td className="px-5 py-4">

                  <div className="flex gap-2">

                    <button
                      onClick={() => onView(order)}
                      className="rounded-lg border border-[#D9E9E7] p-2 text-[#31585A] hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                    >
                      <Eye size={16} />
                    </button>

                    {order.status === "Pending" && (
                      <button
                        onClick={() =>
                          onStatusChange(
                            order.id,
                            "Preparing"
                          )
                        }
                        className="rounded-lg bg-[#08A6A0] px-3 py-2 text-xs font-semibold text-white hover:bg-[#078F8A]"
                      >
                        Prepare
                      </button>
                    )}

                    {order.status === "Preparing" && (
                      <button
                        onClick={() =>
                          onStatusChange(
                            order.id,
                            "Ready"
                          )
                        }
                        className="rounded-lg bg-[#E8F8F6] px-3 py-2 text-xs font-semibold text-[#08A6A0]"
                      >
                        Ready
                      </button>
                    )}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </SectionCard>
  );
};

/* =========================================================
   KITCHEN MANAGEMENT
========================================================= */

const KitchenManagement = ({ orders }) => {
  const pending = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const preparing = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const ready = orders.filter(
    (order) => order.status === "Ready"
  ).length;

  return (
    <div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <KitchenCard
          title="Pending Orders"
          value={pending}
          icon={<Clock3 size={21} />}
        />

        <KitchenCard
          title="Preparing"
          value={preparing}
          icon={<ChefHat size={21} />}
        />

        <KitchenCard
          title="Ready for Delivery"
          value={ready}
          icon={<CheckCircle2 size={21} />}
        />

      </div>

      <SectionCard
        title="Kitchen Management"
        subtitle="Monitor meal preparation and kitchen workload"
      >

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <KitchenStation
            title="Breakfast"
            orders="45"
            time="07:30 AM"
          />

          <KitchenStation
            title="Lunch"
            orders="68"
            time="12:30 PM"
          />

          <KitchenStation
            title="Evening Snack"
            orders="52"
            time="04:30 PM"
          />

          <KitchenStation
            title="Dinner"
            orders="71"
            time="07:30 PM"
          />

        </div>

      </SectionCard>

    </div>
  );
};

/* =========================================================
   FOOD STOCK
========================================================= */

const FoodStock = ({ stock, getStockBadge }) => {
  return (
    <SectionCard
      title="Food Stock"
      subtitle="Kitchen raw material and food inventory"
    >

      <div className="overflow-x-auto">

        <table className="w-full min-w-[750px]">

          <thead className="bg-[#F7FBFA]">

            <tr className="border-b border-[#EAF2F0]">

              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Status</TableHead>

            </tr>

          </thead>

          <tbody className="divide-y divide-[#EAF2F0]">

            {stock.map((item) => (

              <tr
                key={item.id}
                className="hover:bg-[#FBFEFD]"
              >

                <td className="px-5 py-4 font-semibold text-[#173F41]">
                  {item.item}
                </td>

                <td className="px-5 py-4 text-sm text-[#31585A]">
                  {item.category}
                </td>

                <td className="px-5 py-4 text-sm text-[#31585A]">
                  {item.unit}
                </td>

                <td className="px-5 py-4 text-sm font-bold text-[#173F41]">
                  {item.quantity}
                </td>

                <td className="px-5 py-4 text-sm text-[#819596]">
                  {item.reorderLevel}
                </td>

                <td className="px-5 py-4">
                  {getStockBadge(
                    item.quantity,
                    item.reorderLevel
                  )}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </SectionCard>
  );
};


/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

const StatCard = ({ title, value, icon }) => (
  <div className="rounded-2xl border border-[#E2EFED] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-sm font-medium text-[#819596]">
          {title}
        </p>

        <p className="mt-2 text-2xl font-bold text-[#073F42]">
          {value}
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
        {icon}
      </div>

    </div>

  </div>
);

const TabButton = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      active
        ? "bg-[#08A6A0] text-white"
        : "text-[#31585A] hover:bg-[#E8F8F6] hover:text-[#078F8A]"
    }`}
  >
    {icon}
    {label}
  </button>
);

const SectionCard = ({
  title,
  subtitle,
  children,
}) => (
  <div className="rounded-2xl border border-[#E2EFED] bg-white shadow-sm">

    <div className="border-b border-[#EAF2F0] px-5 py-5">

      <h2 className="text-lg font-bold text-[#073F42]">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-sm text-[#819596]">
          {subtitle}
        </p>
      )}

    </div>

    <div className="p-5">
      {children}
    </div>

  </div>
);

const TableHead = ({ children }) => (
  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#708789]">
    {children}
  </th>
);

const MealCard = ({
  title,
  time,
  icon,
  count,
}) => (
  <div className="rounded-2xl border border-[#E2EFED] bg-[#FBFEFD] p-5">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-sm font-bold text-[#073F42]">
          {title}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {time}
        </p>
      </div>

      <span className="text-2xl">
        {icon}
      </span>

    </div>

    <p className="mt-4 text-sm font-semibold text-[#08A6A0]">
      {count}
    </p>

  </div>
);

const SummaryRow = ({ title, value }) => (
  <div className="flex items-center justify-between rounded-xl border border-[#EAF2F0] p-4">

    <div className="flex items-center gap-3">

      <div className="h-2.5 w-2.5 rounded-full bg-[#08A6A0]" />

      <span className="text-sm font-semibold text-[#31585A]">
        {title}
      </span>

    </div>

    <span className="text-sm font-bold text-[#073F42]">
      {value}
    </span>

  </div>
);

const KitchenCard = ({
  title,
  value,
  icon,
}) => (
  <div className="rounded-2xl border border-[#E2EFED] bg-white p-5 shadow-sm">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-sm text-[#819596]">
          {title}
        </p>

        <p className="mt-2 text-2xl font-bold text-[#073F42]">
          {value}
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
        {icon}
      </div>

    </div>

  </div>
);

const KitchenStation = ({
  title,
  orders,
  time,
}) => (
  <div className="rounded-2xl border border-[#E2EFED] bg-[#FBFEFD] p-5">

    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6]">
        <ChefHat
          size={18}
          className="text-[#08A6A0]"
        />
      </div>

      <div>
        <p className="font-bold text-[#173F41]">
          {title}
        </p>

        <p className="text-xs text-[#819596]">
          {time}
        </p>
      </div>

    </div>

    <p className="mt-4 text-sm font-semibold text-[#08A6A0]">
      {orders} meal orders
    </p>

  </div>
);

const Detail = ({ label, value }) => (
  <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-4">

    <p className="text-xs text-[#819596]">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-[#173F41]">
      {value || "-"}
    </p>

  </div>
);

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div>

    <label className="mb-2 block text-sm font-semibold text-[#31585A]">
      {label}
    </label>

    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-xl border border-[#D9E9E7] px-4 py-3 text-sm text-[#173F41] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
    />

  </div>
);

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <div>

    <label className="mb-2 block text-sm font-semibold text-[#31585A]">
      {label}
    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-[#D9E9E7] px-4 py-3 text-sm text-[#173F41] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
    >

      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}

    </select>

  </div>
);

const Modal = ({
  title,
  children,
  onClose,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4 backdrop-blur-sm">

    <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">

      <div className="flex items-center justify-between border-b border-[#EAF2F0] px-6 py-5">

        <h2 className="text-xl font-bold text-[#073F42]">
          {title}
        </h2>

        <button
          onClick={onClose}
          className="rounded-xl p-2 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#073F42]"
        >
          <X size={20} />
        </button>

      </div>

      <div className="max-h-[calc(92vh-80px)] overflow-y-auto p-6">
        {children}
      </div>

    </div>

  </div>
);

const getOrderStatusBadge = (status) => {
  const styles = {
    Pending: "bg-yellow-50 text-yellow-700",
    Preparing: "bg-blue-50 text-blue-700",
    Ready: "bg-[#E8F8F6] text-[#08A6A0]",
    Delivered: "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-50 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default Food;