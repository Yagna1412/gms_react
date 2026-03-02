import { useState } from "react";
import {
  MdInventory,
  MdWarning,
  MdTrendingUp,
  MdCategory,
} from "react-icons/md";

import StatsCard from "../components/StatsCard";
import InventoryTable from "../components/InventoryTable";
import AddItemModal from "../components/Additemmodal";
import EditItemModal from "../components/EditItemModal";

export default function InventoryParts() {
  // STATES
  const [items, setItems] = useState([
    {
      name: "Engine Oil",
      category: "Lubricants",
      stock: 150,
      minStock: 50,
      branch: "Central Warehouse",
      price: 450,
    },
    {
      name: "Brake Pads",
      category: "Parts",
      stock: 85,
      minStock: 30,
      branch: "Central Warehouse",
      price: 1200,
    },
    {
      name: "Air Filter",
      category: "Filters",
      stock: 25,
      minStock: 40,
      branch: "Mumbai Central",
      price: 350,
    },
  ]);

  const [openAddItem, setOpenAddItem] = useState(false);
  const [openEditItem, setOpenEditItem] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // KPI CALCULATIONS
  const totalItems = items.length;
  const lowStockCount = items.filter(
    (i) => i.stock < i.minStock
  ).length;
  const totalUnits = items.reduce((s, i) => s + i.stock, 0);
  const totalValue =
    items.reduce((s, i) => s + i.stock * i.price, 0) / 100000;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory & Parts</h1>
          <p className="text-gray-500">
            Centralized inventory, allocate to branches, and track stock
          </p>
        </div>

        <button
          onClick={() => {
            setEditItem(null);
            setOpenAddItem(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          + Add Item
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard
          title="Total Items"
          value={totalItems}
          icon={<MdInventory />}
          bg="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockCount}
          icon={<MdWarning />}
          bg="bg-red-100 text-red-600"
        />
        <StatsCard
          title="Total Value"
          value={`₹${totalValue.toFixed(1)}L`}
          icon={<MdTrendingUp />}
          bg="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Total Units"
          value={totalUnits}
          icon={<MdCategory />}
          bg="bg-purple-100 text-purple-600"
        />
      </div>

   {/* INVENTORY TABLE */}
     <InventoryTable
  items={items}
  onEdit={(item) => {
    setEditItem(item);
    setOpenEditItem(true);
  }}
  onDelete={(i) =>
    setItems(items.filter((_, idx) => idx !== i))
  }
/>

<AddItemModal
  open={openAddItem}
  onClose={() => setOpenAddItem(false)}
  onAdd={(item) => setItems([...items, item])}
/>

<EditItemModal
  open={openEditItem}
  data={editItem}
  onClose={() => {
    setEditItem(null);
    setOpenEditItem(false);
  }}
  onUpdate={(updated) =>
    setItems(
      items.map((i) => (i === editItem ? updated : i))
    )
  }
 />
    </div>
  );
}
