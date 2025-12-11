import { useState } from 'react';

// Páginas
import { HomeDashboard } from './pages/Home/HomeDashboard';
import { QuoteHistory } from './pages/QuoteHistory/QuoteHistory';
import { CreateQuote } from './pages/CreateQuote/CreateQuote';
import { Button } from './components/ui/Button';

// Tipos
import type { Quote } from './types/quote';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'quotes_list' | 'quotes_create'>('dashboard');
  
  // ESTADO NUEVO: Aquí guardamos el presupuesto a editar (si hay uno)
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | undefined>(undefined);

  // Función para iniciar la creación (limpia el editor)
  const handleCreateNew = () => {
    setQuoteToEdit(undefined); // Aseguramos que esté vacío
    setCurrentView('quotes_create');
  };

  // Función para iniciar la edición (carga datos)
  const handleEditQuote = (quote: Quote) => {
    setQuoteToEdit(quote); // Guardamos el presupuesto seleccionado
    setCurrentView('quotes_create'); // Vamos al formulario
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* NAVEGACIÓN */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center no-print">
        <div className="font-bold text-xl text-blue-800">Sistema URH</div>
        <div className="flex gap-4">
          <Button 
            variant={currentView === 'dashboard' ? 'primary' : 'outline'} 
            onClick={() => setCurrentView('dashboard')}
          >
            Clientes
          </Button>
          <Button 
            variant={currentView.includes('quotes') ? 'primary' : 'outline'} 
            onClick={() => setCurrentView('quotes_list')}
          >
            Presupuestos
          </Button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main>
        {currentView === 'dashboard' && <HomeDashboard />}
        
        {currentView === 'quotes_list' && (
          <QuoteHistory 
            onCreateNew={handleCreateNew} 
            onEdit={handleEditQuote} // Pasamos la nueva función
          />
        )}
        
        {currentView === 'quotes_create' && (
          <CreateQuote 
            onBack={() => setCurrentView('quotes_list')} 
            initialData={quoteToEdit} // Pasamos los datos a editar (si existen)
          />
        )}
      </main>
    </div>
  );
}

export default App;