export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export type MovementType = 'receive' | 'issue' | 'adjustment';

export interface StockMovement {
  id: string;
  type: MovementType;
  quantity: number;
  date: string;
  referenceId: string; // PO ID or Project ID
  referenceNumber: string; // PO Number or Project Number
  handledBy: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  quantityOnHand: number;
  reservedQuantity: number;
  availableQuantity: number;
  unit: string;
  minStockLevel: number;
  lastReceivedDate: string;
  unitPrice: number;
  totalValuation: number;
  status: InventoryStatus;
  movements: StockMovement[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryFilters {
  search?: string;
  category?: string;
  status?: InventoryStatus;
}
