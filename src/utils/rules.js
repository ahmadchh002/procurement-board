import { DIRECTOR_LIMIT } from "./constants";

export function canMoveOrder(order, targetStage) {
  if (order.stage === targetStage) {
    return { allowed: true };
  }

  const isAdvancingPastApproval =
    targetStage === "po" || targetStage === "delivered";
  const requiresSignoff = order.amount > DIRECTOR_LIMIT;

  if (requiresSignoff && !order.directorSigned && isAdvancingPastApproval) {
    return {
      allowed: false,
      reason: `Order ${order.id} ($${order.amount.toLocaleString()}) exceeds $${DIRECTOR_LIMIT.toLocaleString()} and requires Director Sign-off before moving to ${targetStage.toUpperCase()}.`,
    };
  }

  return { allowed: true };
}
