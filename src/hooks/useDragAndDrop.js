import { useState } from "react";
import { canMoveOrder } from "../utils/rules";

export function useDragAndDrop(orders, setOrders, onRuleViolation) {
  const [draggedOrderId, setDraggedOrderId] = useState(null);
  const [activeDropColumn, setActiveDropColumn] = useState(null);

  const handleDragStart = (e, orderId) => {
    setDraggedOrderId(orderId);
    e.dataTransfer.setData("text/plain", orderId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (activeDropColumn !== stageId) {
      setActiveDropColumn(stageId);
    }
  };

  const handleDragLeave = () => {
    setActiveDropColumn(null);
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const orderId = e.dataTransfer.getData("text/plain") || draggedOrderId;
    setDraggedOrderId(null);

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const validation = canMoveOrder(order, targetStage);
    if (!validation.allowed) {
      onRuleViolation(validation.reason);
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, stage: targetStage } : o)),
    );
  };

  return {
    draggedOrderId,
    activeDropColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
