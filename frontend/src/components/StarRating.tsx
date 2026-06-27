"use client";
import { useState } from "react";

interface StarRatingProps {
  value?: number;
  onChange?: (val: number) => void;
  size?: number;
  readonly?: boolean;
  showValue?: boolean;
}

export default function StarRating({ value = 0, onChange, size = 24, readonly = false, showValue = false }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <div style={{ display: "flex", gap: "3px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: readonly ? "default" : "pointer",
              lineHeight: 1,
              transition: "transform 0.1s ease",
            }}
            onMouseDown={(e) => !readonly && (e.currentTarget.style.transform = "scale(0.85)")}
            onMouseUp={(e) => !readonly && (e.currentTarget.style.transform = "scale(1)")}
            aria-label={`${star} estrelas`}
          >
            <i
              className={`ti ${star <= (hover || value) ? "ti-star-filled" : "ti-star"}`}
              style={{
                fontSize: size,
                color: star <= (hover || value) ? "#f59e0b" : "#e5e7eb",
                transition: "color 0.15s ease",
                display: "block",
              }}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      {showValue && value > 0 && (
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginLeft: "4px" }}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}