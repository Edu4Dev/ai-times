import { createContext, useState, useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Ajuste conforme sua versão do Next.js

// Cria o contexto
const CampaignContext = createContext();

// Hook para usar o contexto mais facilmente
export const useCampaignContext = () => useContext(CampaignContext);

// Provider que vai envolver os componentes e compartilhar o estado
export const CampaignProvider = ({ children }) => {
  const [campaignMode, setCampaignMode] = useState(false);
  const [firstShot, setFirstShot] = useState(false);
  const getRef = useSearchParams().getAll("ref");

  useEffect(() => {
    if (typeof window !== "undefined")
      if (getRef?.length === 1) setCampaignMode(true);
    if (firstShot) setCampaignMode(false);
  }, [getRef]);

  return (
    <CampaignContext.Provider value={{ campaignMode, setFirstShot }}>
      {children}
    </CampaignContext.Provider>
  );
};
