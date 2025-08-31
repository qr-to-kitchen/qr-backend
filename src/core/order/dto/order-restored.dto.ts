import { BranchDish } from '../../branches-dishes/branches-dishes.entity';
import { ExtraBranchDish } from '../../extras/entities/extras-branch-dish.entity';

export class OrderRestoredDto {
  description?: string;
  tableNumber: number;
  branchId: number;
  orderTotal: number;
  items: OrderItemRestoredDto[];
}

export class OrderItemRestoredDto {
  quantity: number;
  unitPrice: number;
  total: number;
  comment?: string;
  branchDish: BranchDish;
  itemExtras: OrderItemExtraRestoredDto[];
}

export class OrderItemExtraRestoredDto {
  unitPrice: number;
  extraBranchDish: ExtraBranchDish;
}