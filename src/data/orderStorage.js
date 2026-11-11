import { INITIAL_ORDERS } from "./orders";
import { STAGES } from "../utils/constants";

const ORDER_STORAGE_KEY = "orders";
const STAGE_STORAGE_KEY = "stages";

export function getOrders() {
  try {
    const storedOrders = localStorage.getItem(ORDER_STORAGE_KEY);
    if (storedOrders) {
      return JSON.parse(storedOrders);
    }
    if (INITIAL_ORDERS && INITIAL_ORDERS.length > 0) {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return JSON.parse(JSON.stringify(INITIAL_ORDERS));
    }
  } catch (error) {
    console.error("Error retrieving orders from localStorage:", error);
  }

  return INITIAL_ORDERS || [];
}
export function saveOrders(orders) {
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
  }
}
export function getStages() {
  try {
    const storedStages = localStorage.getItem(STAGE_STORAGE_KEY);
    if (storedStages) {
      return JSON.parse(storedStages);
    }
    if (STAGES && STAGES.length > 0) {
      localStorage.setItem(STAGE_STORAGE_KEY, JSON.stringify(STAGES));
      return JSON.parse(JSON.stringify(STAGES));
    }
  } catch (error) {
    console.error("Error retrieving stages from localStorage:", error);
  }
  return STAGES || [];
}
export function saveStages(stages) {
  try {
    localStorage.setItem(STAGE_STORAGE_KEY, JSON.stringify(stages));
  } catch (error) {
    console.error("Error saving stages to localStorage:", error);
  }
}
