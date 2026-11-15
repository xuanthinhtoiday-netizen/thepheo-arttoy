import React, { useState, useEffect } from 'react';
import { Series, CartItem, Order, HallOfFameItem } from './types';
import { storage } from './services/storage';

// Components
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { SeriesCatalog } from './components/SeriesCatalog';
import { SeriesDetailModal } from './components/SeriesDetailModal';
import { BoxSelector } from './components/BoxSelector';
import { UnboxSimulator } from './components/UnboxSimulator';
import { HallOfFame } from './components/HallOfFame';
import { ChatbotWidget } from './components/ChatbotWidget';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'gacha' | 'hall-of-fame'>('store');
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [hallOfFame, setHallOfFame] = useState<HallOfFameItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Modals & Active states
  const [activeSeriesForBoxPicker, setActiveSeriesForBoxPicker] = useState<Series | null>(null);
  const [detailModalSeries, setDetailModalSeries] = useState<Series | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [directCheckoutData, setDirectCheckoutData] = useState<{
    seriesName: string;
    boxNumbers: number[];
    totalAmount: number;
  } | undefined>(undefined);

  // Load initial data
  const refreshData = () => {
    setSeriesList(storage.getSeries());
    setHallOfFame(storage.getHallOfFame());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Add items to cart
  const handleAddToCart = (series: Series, selectedBoxes: number[]) => {
    if (selectedBoxes.length === 0) return;
    const existingIndex = cartItems.findIndex(item => item.series.id === series.id);
    const totalPrice = selectedBoxes.length * series.price_per_box;

    if (existingIndex !== -1) {
      const updated = [...cartItems];
      // Merge unique box numbers
      const mergedBoxes = Array.from(new Set([...updated[existingIndex].selectedBoxes, ...selectedBoxes])).sort((a, b) => a - b);
      updated[existingIndex] = {
        series,
        selectedBoxes: mergedBoxes,
        totalPrice: mergedBoxes.length * series.price_per_box
      };
      setCartItems(updated);
    } else {
      setCartItems(prev => [...prev, { series, selectedBoxes, totalPrice }]);
    }

    setIsCartOpen(true);
  };

  // Remove item from cart
  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  // Instant Checkout
  const handleInstantCheckout = (series: Series, selectedBoxes: number[]) => {
    setDirectCheckoutData({
      seriesName: series.name,
      boxNumbers: selectedBoxes,
      totalAmount: selectedBoxes.length * series.price_per_box
    });
    setIsCheckoutModalOpen(true);
  };

  // Chat action triggers
  const openChatWithPrompt = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  // Gacha Simulator launcher
  const handleOpenGachaSimulator = (series: Series, boxNumber: number) => {
    setActiveSeriesForBoxPicker(null);
    setCurrentView('gacha');
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        cartCount={cartItems.reduce((acc, it) => acc + it.selectedBoxes.length, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={() => {
          setChatInitialPrompt('');
          setIsChatOpen(true);
        }}
        currentView={currentView}
        onNavigate={(view) => {
          setActiveSeriesForBoxPicker(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: STORE FRONT */}
        {currentView === 'store' && (
          <>
            {activeSeriesForBoxPicker ? (
              <BoxSelector
                series={activeSeriesForBoxPicker}
                onBack={() => setActiveSeriesForBoxPicker(null)}
                onAddToCart={handleAddToCart}
                onInstantCheckout={handleInstantCheckout}
                onOpenGachaSimulator={handleOpenGachaSimulator}
                onAskThePheoForLuckyBoxes={(s) => 
                  openChatWithPrompt(`Thầy Phẻo ơi, xem quẻ giúp mình khay ${s.name} thì bốc những số hộp nào dễ nổ Secret nhất?`)
                }
              />
            ) : (
              <>
                <HeroBanner
                  onOpenChat={() => {
                    setChatInitialPrompt('');
                    setIsChatOpen(true);
                  }}
                  onExploreClick={() => {
                    const el = document.getElementById('series-catalog');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onGachaClick={() => setCurrentView('gacha')}
                />

                <SeriesCatalog
                  seriesList={seriesList}
                  onSelectSeries={(series) => {
                    setActiveSeriesForBoxPicker(series);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenDetails={(series) => setDetailModalSeries(series)}
                  onAskAiForSeries={(series) => 
                    openChatWithPrompt(`Thầy Phẻo ơi, tư vấn phong thủy và soi vía giúp mình series ${series.name} (${series.brand}) nhé!`)
                  }
                />

                <HallOfFame
                  items={hallOfFame}
                  onAskAiForLuckyVibe={(item) =>
                    openChatWithPrompt(`Thầy Phẻo ơi, mình thấy bạn ${item.customer_name} vừa bốc trúng ${item.item_won} (hộp #${item.box_number}). Thầy gieo cho mình một quẻ lấy vía tương tự với!`)
                  }
                />
              </>
            )}
          </>
        )}

        {/* VIEW 2: GACHA UNBOX SIMULATOR */}
        {currentView === 'gacha' && (
          <UnboxSimulator
            seriesList={seriesList}
            initialSeries={activeSeriesForBoxPicker || seriesList[0]}
            onClose={() => setCurrentView('store')}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* VIEW 3: HALL OF FAME */}
        {currentView === 'hall-of-fame' && (
          <HallOfFame
            items={hallOfFame}
            onAskAiForLuckyVibe={(item) =>
              openChatWithPrompt(`Thầy Phẻo ơi, mình muốn xin vía bốc nổ Secret giống bạn ${item.customer_name}!`)
            }
          />
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            seriesList={seriesList}
            onRefreshData={refreshData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Chatbot Widget */}
      <ChatbotWidget
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
        initialPrompt={chatInitialPrompt}
        onCheckoutFromChat={(combo) => {
          setDirectCheckoutData({
            seriesName: combo.seriesName,
            boxNumbers: combo.boxNumbers,
            totalAmount: combo.totalAmount
          });
          setIsCheckoutModalOpen(true);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setDirectCheckoutData(undefined);
          setIsCheckoutModalOpen(true);
        }}
      />

      {/* Checkout Modal (VietQR Payment) */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => {
          setIsCheckoutModalOpen(false);
          setDirectCheckoutData(undefined);
        }}
        cartItems={cartItems}
        directOrderData={directCheckoutData}
        onOrderSuccess={(order) => {
          // Clear cart on success if it was a cart checkout
          if (!directCheckoutData) {
            setCartItems([]);
          }
          refreshData();
        }}
      />

      {/* Series Detail Modal */}
      <SeriesDetailModal
        series={detailModalSeries}
        onClose={() => setDetailModalSeries(null)}
        onSelectForBoxPicker={(series) => {
          setActiveSeriesForBoxPicker(series);
          setCurrentView('store');
        }}
        onAskAi={(series) =>
          openChatWithPrompt(`Thầy Phẻo soi vía giúp mình series ${series.name} với!`)
        }
      />
    </div>
  );
}

export default App;
