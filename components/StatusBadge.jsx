export default function StatusBadge({ status }) {
  const normStatus = (status || "").toLowerCase();

  // Status colors specified in PRD 5.2
  // Menunggu: #F59E0B
  // Dikonfirmasi: #2563EB
  // Hadir: #7C3AED
  // Selesai: #15A66A
  // Dibatalkan: #E53935

  let style = {
    backgroundColor: "#F3F4F6",
    color: "#374151",
    label: status || "-",
  };

  if (normStatus === "menunggu") {
    style = {
      backgroundColor: "#FEF3C7",
      color: "#92400E",
      borderColor: "#F59E0B",
      label: "Menunggu",
    };
  } else if (normStatus === "dikonfirmasi") {
    style = {
      backgroundColor: "#DBEAFE",
      color: "#1E40AF",
      borderColor: "#2563EB",
      label: "Dikonfirmasi",
    };
  } else if (normStatus === "hadir") {
    style = {
      backgroundColor: "#EDE9FE",
      color: "#5B21B6",
      borderColor: "#7C3AED",
      label: "Hadir (Siap Diperiksa)",
    };
  } else if (normStatus === "selesai") {
    style = {
      backgroundColor: "#D1FAE5",
      color: "#065F46",
      borderColor: "#15A66A",
      label: "Selesai",
    };
  } else if (normStatus === "dibatalkan") {
    style = {
      backgroundColor: "#FEE2E2",
      color: "#991B1B",
      borderColor: "#E53935",
      label: "Dibatalkan",
    };
  }

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor || "transparent",
      }}
    >
      {style.label}
    </span>
  );
}
