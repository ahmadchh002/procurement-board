export function generatePastActivity(orderId, total = 3000) {
  const users = [
    { name: "Sara M.", avatar: "SM", color: "var(--blue)" },
    { name: "James K.", avatar: "JK", color: "var(--purple)" },
    { name: "Lina P.", avatar: "LP", color: "var(--amber)" },
    { name: "System", avatar: "⚙", isSystem: true },
  ];

  const actions = [
    "Uploaded quote PDF verification.",
    "Reviewed item specs with supplier.",
    "Validated delivery milestone requirements.",
    "Adjusted shipping cost estimate.",
    "Requested updated lead time.",
  ];

  return Array.from({ length: total }, (_, i) => {
    const isSystem = i % 4 === 0;
    const author = isSystem ? users[3] : users[i % 3];
    return {
      id: `${orderId}-log-${i + 1}`,
      author: author.name,
      avatar: author.avatar,
      avatarColor: author.color,
      isSystem: Boolean(author.isSystem),
      time: i === 0 ? "Just now" : `${i * 12} mins ago`,
      message: isSystem
        ? `Audit verification checkpoint #${total - i} passed automatically.`
        : actions[i % actions.length],
    };
  });
}
