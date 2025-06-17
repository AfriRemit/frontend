import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContractInstanceProvider from "./provider/ContractInstanceProvider";
import { wagmiConfig } from "./hooks/wagmi-config"; 
import { WagmiProvider } from "wagmi";
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";
 

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>
        <ContractInstanceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/app/*" element={<Index />} />
                <Route path="/landing" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ContractInstanceProvider>
      </QueryClientProvider>
    </ThirdwebProvider>
  </WagmiProvider>
);

export default App;
