import { useCallback, useEffect, useRef, useState } from "react";
import { canMoveOrder } from "../utils/rules";

export function useDragAndDrop(orders, onOrdersChange, onRuleViolation) {
  const [draggedOrderId, setDraggedOrderId] = useState(null);
  const [activeDropColumn, setActiveDropColumn] = useState(null);
  const ordersRef = useRef(orders);
  const draggedOrderIdRef = useRef(null);

  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  const handleDragStart = useCallback((e, orderId) => {
    draggedOrderIdRef.current = orderId;
    setDraggedOrderId(orderId);
    e.dataTransfer.setData("text/plain", orderId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setActiveDropColumn((activeStage) => (
      activeStage === stageId ? activeStage : stageId
    ));
  }, []);

  const handleDragLeave = useCallback(() => {
    setActiveDropColumn(null);
  }, []);

  const handleDrop = useCallback((e, targetStage) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const orderId = e.dataTransfer.getData("text/plain") || draggedOrderIdRef.current;
    draggedOrderIdRef.current = null;
    setDraggedOrderId(null);

    const order = ordersRef.current.find((o) => o.id === orderId);
    if (!order) return;

    const validation = canMoveOrder(order, targetStage);
    if (!validation.allowed) {
      onRuleViolation(validation.reason);
      return;
    }

    onOrdersChange(
      ordersRef.current.map((o) => (o.id === orderId ? { ...o, stage: targetStage } : o)),
    );
  }, [onOrdersChange, onRuleViolation]);

  return {
    draggedOrderId,
    activeDropColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
