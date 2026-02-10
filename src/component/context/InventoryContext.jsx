import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

// Default initial items
const DEFAULT_ITEMS = [
    { 
      id: 1, 
      sku: 'OIL-5W30-001', 
      name: 'Engine Oil 5W-30', 
      category: 'Oils & Lubricants',
      currentStock: 45,
      minLevel: 20,
      maxLevel: 100,
      reorderPoint: 30,
      costPrice: 450,
      sellingPrice: 650,
      markup: 44.4,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100',
      description: 'Premium synthetic engine oil',
      dateAdded: '2024-01-15',
      lastMovement: '2024-12-15'
    },
    { 
      id: 2, 
      sku: 'BRAKE-PAD-002', 
      name: 'Brake Pad Set', 
      category: 'Brake Parts',
      currentStock: 12,
      minLevel: 15,
      maxLevel: 50,
      reorderPoint: 20,
      costPrice: 1200,
      sellingPrice: 1800,
      markup: 50,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=100',
      description: 'High-performance ceramic brake pads',
      dateAdded: '2024-01-20',
      lastMovement: '2024-12-18'

    },
    { 
      id: 3, 
      sku: 'FILTER-AIR-003', 
      name: 'Air Filter', 
      category: 'Filters',
      currentStock: 0,
      minLevel: 10,
      maxLevel: 50,
      reorderPoint: 15,
      costPrice: 250,
      sellingPrice: 400,
      markup: 60,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=100',
      description: 'High-efficiency air filter',
      dateAdded: '2024-02-01',
      lastMovement: '2024-12-19'
    },
    { 
      id: 4, 
      sku: 'SPARK-PLUG-004', 
      name: 'Spark Plug Set', 
      category: 'Electrical',
      currentStock: 85,
      minLevel: 20,
      maxLevel: 60,
      reorderPoint: 25,
      costPrice: 350,
      sellingPrice: 550,
      markup: 57.1,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=100',
      description: 'Iridium spark plugs',
      dateAdded: '2024-02-10',
      lastMovement: '2024-12-17'
    },
    { 
      id: 5, 
      sku: 'BATTERY-12V-005', 
      name: '12V Car Battery', 
      category: 'Batteries',
      currentStock: 8,
      minLevel: 10,
      maxLevel: 30,
      reorderPoint: 12,
      costPrice: 3500,
      sellingPrice: 5000,
      markup: 42.9,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100',
      description: 'High-capacity maintenance-free battery',
      dateAdded: '2024-02-15',
      lastMovement: '2024-12-16'
    }
];

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  // Initialize items from localStorage or use defaults
  const [items, setItems] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('inventoryItems');
        return stored ? JSON.parse(stored) : DEFAULT_ITEMS;
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        return DEFAULT_ITEMS;
      }
    }
    return DEFAULT_ITEMS;
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('inventoryItems', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [items]);

  // Purchase Orders with localStorage
  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('inventoryPOs');
        if (stored) return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading POs from localStorage:', error);
      }
    }
    return [];
  });

  // Save POs to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && purchaseOrders.length > 0) {
      try {
        localStorage.setItem('inventoryPOs', JSON.stringify(purchaseOrders));
      } catch (error) {
        console.error('Error saving POs to localStorage:', error);
      }
    }
  }, [purchaseOrders]);

  // Vendors with localStorage
  const [vendors, setVendors] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('inventoryVendors');
        if (stored) return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading vendors from localStorage:', error);
      }
    }
    return [];
  });

  // Save vendors to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && vendors.length > 0) {
      try {
        localStorage.setItem('inventoryVendors', JSON.stringify(vendors));
      } catch (error) {
        console.error('Error saving vendors to localStorage:', error);
      }
    }
  }, [vendors]);

  // Stock Movements with localStorage
  const [stockMovements, setStockMovements] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('inventoryMovements');
        if (stored) return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading movements from localStorage:', error);
      }
    }
    return [];
  });

  // Save movements to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && stockMovements.length > 0) {
      try {
        localStorage.setItem('inventoryMovements', JSON.stringify(stockMovements));
      } catch (error) {
        console.error('Error saving movements to localStorage:', error);
      }
    }
  }, [stockMovements]);

  // Add Item
  const addItem = (item) => {
    const newItem = {
      ...item,
      id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
      dateAdded: new Date().toISOString().split('T')[0],
      lastMovement: new Date().toISOString().split('T')[0]
    };
    setItems([...items, newItem]);
  };

  // Update Item
  const updateItem = (id, updatedItem) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  // Delete Item
  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Add Purchase Order
  const addPurchaseOrder = (po) => {
    const newPO = {
      ...po,
      id: purchaseOrders.length + 1,
      poNumber: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      orderDate: new Date().toISOString().split('T')[0],
      createdBy: 'Inventory Manager'
    };
    setPurchaseOrders([...purchaseOrders, newPO]);
  };

  // Update Purchase Order
  const updatePurchaseOrder = (id, updatedPO) => {
    setPurchaseOrders(purchaseOrders.map(po => po.id === id ? { ...po, ...updatedPO } : po));
  };

  // Delete Purchase Order
  const deletePurchaseOrder = (id) => {
    setPurchaseOrders(purchaseOrders.filter(po => po.id !== id));
  };

  // Add Vendor
  const addVendor = (vendor) => {
    const newVendor = {
      ...vendor,
      id: vendors.length + 1,
      totalPOs: 0,
      since: new Date().toISOString().split('T')[0]
    };
    setVendors([...vendors, newVendor]);
  };

  // Update Vendor
  const updateVendor = (id, updatedVendor) => {
    setVendors(vendors.map(vendor => vendor.id === id ? { ...vendor, ...updatedVendor } : vendor));
  };

  // Delete Vendor
  const deleteVendor = (id) => {
    setVendors(vendors.filter(vendor => vendor.id !== id));
  };

  // Add Stock Movement
  const addStockMovement = (movement) => {
    const newMovement = {
      ...movement,
      id: stockMovements.length + 1,
      date: new Date().toLocaleString('en-IN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      createdBy: 'Inventory Manager'
    };
    setStockMovements([newMovement, ...stockMovements]);

    // Update item stock based on movement type
    if (movement.itemId) {
      const item = items.find(i => i.id === movement.itemId);
      if (item) {
        let newStock = item.currentStock;
        if (movement.movementType === 'Inward') {
          newStock += movement.quantity;
        } else if (movement.movementType === 'Outward') {
          newStock -= movement.quantity;
        } else if (movement.movementType === 'Adjustment') {
          newStock += movement.quantity; // Can be negative
        }
        updateItem(movement.itemId, { currentStock: newStock });
      }
    }
  };

  const value = {
    items,
    addItem,
    updateItem,
    deleteItem,
    purchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    vendors,
    addVendor,
    updateVendor,
    deleteVendor,
    stockMovements,
    addStockMovement
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
