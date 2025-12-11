import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageContainer } from '../../components/layout/PageContainer';
import type { Quote } from '../../types/quote';

interface Props {
  onCreateNew: () => void;
  onEdit: (quote: Quote) => void;
}

export const QuoteHistory = ({ onCreateNew, onEdit }: Props) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  
  // Filtros
  const [searchName, setSearchName] = useState('');
  const [searchDay, setSearchDay] = useState('');
  const [searchMonth, setSearchMonth] = useState('');
  const [searchYear, setSearchYear] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('app_quotes');
    if (saved) {
      // Migración simple: Si hay datos viejos, los adaptamos para que no falle
      const parsed = JSON.parse(saved).map((q: any) => ({
        ...q,
        clients: q.clients || (q.client ? [q.client] : []), // Compatibilidad
        sections: q.sections || (q.items ? [{ title: 'General', items: q.items }] : []) // Compatibilidad
      }));
      setQuotes(parsed);
    }
  }, []);

  const filteredQuotes = quotes.filter(quote => {
    // Buscar en TODOS los clientes del presupuesto
    const names = quote.clients.map(c => c.name.toLowerCase()).join(' ');
    const matchName = names.includes(searchName.toLowerCase());

    const [d, m, y] = quote.date.split('/');
    const matchDay = searchDay ? d === searchDay.padStart(2, '0') : true; 
    const matchMonth = searchMonth ? m === searchMonth.padStart(2, '0') : true;
    const matchYear = searchYear ? y.includes(searchYear) : true;

    return matchName && matchDay && matchMonth && matchYear;
  });

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Historial de Presupuestos</h1>
        <Button variant="primary" onClick={onCreateNew}>+ Crear Nuevo</Button>
      </div>

      <Card className="p-4 mb-6 bg-white">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <label className="text-xs font-bold text-gray-500 mb-1 block">BUSCAR CLIENTE</label>
            <Input placeholder="Ej: Harry..." value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <div className="w-20">
              <Input placeholder="Día" type="number" min={1} max={31} value={searchDay} onChange={(e) => setSearchDay(e.target.value)} />
            </div>
            <div className="w-full md:w-48">
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white h-[42px]" value={searchMonth} onChange={(e) => setSearchMonth(e.target.value)}>
                <option value="">Todos</option>
                <option value="01">Enero</option>
                <option value="02">Febrero</option>
                <option value="03">Marzo</option>
                <option value="04">Abril</option>
                <option value="05">Mayo</option>
                <option value="06">Junio</option>
                <option value="07">Julio</option>
                <option value="08">Agosto</option>
                <option value="09">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
            </div>
            <div className="w-24">
              <Input placeholder="Año" type="number" value={searchYear} onChange={(e) => setSearchYear(e.target.value)} />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredQuotes.map((quote) => (
          <Card key={quote.id} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
            <div>
              {/* Mostrar lista de nombres */}
              <h3 className="font-bold text-lg text-gray-800">
                {quote.clients.map(c => c.name).join(' & ')}
              </h3>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-medium">
                  📅 {quote.date}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-bold text-xl text-blue-600">S/ {quote.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{quote.sections.length} categorías</p>
              </div>
              <Button variant="outline" onClick={() => onEdit(quote)}>✏️ Editar</Button>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};