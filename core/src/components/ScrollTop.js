import React, { useState, useEffect } from "react";
import theme from "@/content/settings/theme.json";

const ScrollTop = ({ right, bottom }) => {
  const [scrollState, setScrollState] = useState(false);

  useEffect(() => {
    // Verificar se o objeto window está disponível
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        // Verificar se o scroll passou de 500px
        if (window.scrollY > 500) {
          setScrollState(true);
        } else {
          setScrollState(false);
        }
      };

      // Adicionar o evento de scroll
      window.addEventListener("scroll", handleScroll);

      // Remover o evento de scroll quando o componente for desmontado
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [scrollState]); // O array vazio garante que o efeito será executado apenas uma vez

  return (
    <div
      className="send-to-top"
      style={{
        display: "block",
        opacity: scrollState ? "1" : "0",
        position: "fixed",
        right: `${right}px`,
        bottom: `${bottom}px`,
        zIndex: 9999,
        transition: "opacity 0.5s",
      }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          color: "#fff",
          fontSize: "20px",
          textAlign: "center",
          width: "40px",
          height: "40px",
          borderRadius: "3px",
          cursor: "pointer",
          fontSize: "16px",
          border: `2px solid ${theme?.themeColors?.darkBrandColor || "white"}`,
          backgroundColor: theme.themeColors.brand_color,
        }}
      >
        ▲
      </button>
    </div>
  );
};

export default ScrollTop;
