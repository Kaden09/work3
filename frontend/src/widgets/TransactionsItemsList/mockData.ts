export type TransactionType = "red" | "green" | "yellow";

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  platform: string;
  sum: number;
  date: string;
}

export const mockTransactions: Transaction[] = [
  { id: "1", type: "red", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "2", type: "green", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "3", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "4", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "5", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "6", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "7", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "8", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "9", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "10", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "11", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "12", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "13", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "14", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
  { id: "15", type: "yellow", title: "Продажа: Смартфон Samsung Galaxy", platform: "Wildberries", sum: 45990, date: "15 янв. 2024 г., 14:30" },
];
