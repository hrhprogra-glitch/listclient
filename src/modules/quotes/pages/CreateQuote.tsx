import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer'; // 👈 CORREGIDO: Faltaba importar esto
import { QuoteDocument } from './QuotePDF';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import type { Client } from '../../../types/user';
import type { Quote, QuoteSection, QuoteItem } from '../../../types/quote';

interface Props {
  onBack: () => void;
  initialData?: Quote;
}

export const CreateQuote = ({ onBack, initialData }: Props) => {
  // --- ESTADOS ---
  const [clientsDB, setClientsDB] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // 1. CLIENTES
  const getInitialClients = () => {
    if (initialData?.clients) return initialData.clients;
    // @ts-ignore
    if (initialData?.client) return [initialData.client];
    return [];
  };
  const [selectedClients, setSelectedClients] = useState<Client[]>(getInitialClients());

  // 2. SECCIONES
  const getInitialSections = () => {
    if (initialData?.sections) return initialData.sections;
    // @ts-ignore
    if (initialData?.items) return [{ title: 'PRODUCTOS', items: initialData.items }];
    return [{ title: 'PRODUCTOS', items: [{ description: '', price: 0 }] }];
  };
  const [sections, setSections] = useState<QuoteSection[]>(getInitialSections());

  // 3. FECHA
  const getInitialDate = () => {
    if (initialData?.date) {
      // Intenta manejar formato DD/MM/YYYY
      const parts = initialData.date.split('/');
      if (parts.length === 3) {
        const [d, m, y] = parts;
        return `${y}-${m}-${d}`;
      }
    }
    return new Date().toISOString().split('T')[0];
  };
  const [quoteDate, setQuoteDate] = useState(getInitialDate());

  useEffect(() => {
    const saved = localStorage.getItem('app_clients');
    if (saved) setClientsDB(JSON.parse(saved));
  }, []);

  // --- LÓGICA ---
  const handleSelectClient = (client: Client) => {
    if (!selectedClients.find(c => c.id === client.id)) {
      setSelectedClients([...selectedClients, client]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveClient = (id: number) => {
    setSelectedClients(selectedClients.filter(c => c.id !== id));
  };

  const handleAddSection = () => {
    setSections([...sections, { title: '', items: [{ description: '', price: 0 }] }]);
  };

  const handleRemoveSection = (index: number) => {
    if (confirm('¿Eliminar esta categoría?')) {
      setSections(sections.filter((_, i) => i !== index));
    }
  };

  const handleSectionTitleChange = (index: number, newTitle: string) => {
    const newSections = [...sections];
    newSections[index].title = newTitle;
    setSections(newSections);
  };

  const handleAddItemToSection = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].items.push({ description: '', price: 0 });
    setSections(newSections);
  };

  const handleItemChange = (secIndex: number, itemIndex: number, field: keyof QuoteItem, value: any) => {
    const newSections = [...sections];
    const item = newSections[secIndex].items[itemIndex];
    if (field === 'price') item.price = Number(value);
    else item.description = String(value);
    setSections(newSections);
  };

  const handleRemoveItemFromSection = (secIndex: number, itemIndex: number) => {
    const newSections = [...sections];
    newSections[secIndex].items = newSections[secIndex].items.filter((_, i) => i !== itemIndex);
    setSections(newSections);
  };

  const total = sections.reduce((acc, section) => {
    return acc + section.items.reduce((sum, item) => sum + item.price, 0);
  }, 0);

  // --- GUARDAR ---
  const handleSaveQuote = () => {
    if (selectedClients.length === 0) return alert("Selecciona al menos un cliente");

    const [y, m, d] = quoteDate.split('-');
    const formattedDate = `${d}/${m}/${y}`;

    const quoteToSave: Quote = {
      id: initialData ? initialData.id : Date.now(),
      date: formattedDate,
      clients: selectedClients,
      sections: sections,
      total: total
    };

    const existingQuotes = JSON.parse(localStorage.getItem('app_quotes') || '[]');
    let updatedQuotes;
    if (initialData) {
      updatedQuotes = existingQuotes.map((q: any) => q.id === initialData.id ? quoteToSave : q);
    } else {
      updatedQuotes = [quoteToSave, ...existingQuotes];
    }
    localStorage.setItem('app_quotes', JSON.stringify(updatedQuotes));
    alert("¡Presupuesto Guardado!");
    onBack();
  };

  const getPrintDate = () => {
    if (!quoteDate) return '';
    const [y, m, d] = quoteDate.split('-');
    // Aseguramos que la fecha sea válida creando el objeto Date correctamente
    const dateObj = new Date(Number(y), Number(m)-1, Number(d));
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Función auxiliar para nombre de archivo seguro
  const getSafeFileName = () => {
    const clientName = selectedClients[0]?.name || 'Cotizacion';
    // Reemplaza espacios por guiones bajos y elimina caracteres especiales
    return `${clientName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '_')}.pdf`;
  };

  return (
    <PageContainer>
      <div className="no-print mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>← Volver</Button>
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleSaveQuote}>
            {initialData ? 'Actualizar' : 'Guardar'}
          </Button>

          {/* --- ⬇️ BOTÓN DE DESCARGA PROTEGIDO ⬇️ --- */}
          {selectedClients.length > 0 ? (
            <PDFDownloadLink
              document={
                // Aquí se pasa tu componente de diseño QuoteDocument
                <QuoteDocument 
                  clients={selectedClients} 
                  sections={sections} 
                  total={total} 
                  date={getPrintDate()} 
                />
              }
              fileName={getSafeFileName()} // Función que genera el nombre limpio
            >
              {/* @ts-ignore */}
              {({ loading }) => (
                <Button 
                  // ... otras props
                >
                  {loading ? '⏳ Preparando...' : '⬇ Descargar PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          ) : (
            // Botón deshabilitado si no hay clientes
            <Button variant="secondary" disabled className="opacity-50 cursor-not-allowed">
              ⬇ Descargar PDF
            </Button>
          )}
          {/* ------------------------------------------- */}

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* === IZQUIERDA: EDITOR === */}
        <div className="no-print space-y-6">
          <Card className="p-6 bg-white">
            <h2 className="font-bold mb-4 text-gray-700">1. Datos y Clientes</h2>
            <div className="relative mb-4">
              <label className="text-sm font-bold text-gray-500">AGREGAR CLIENTES</label>
              <Input 
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
              />
              {showSuggestions && searchTerm && (
                <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow-xl max-h-40 overflow-y-auto">
                  {clientsDB.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                    <div key={c.id} className="p-3 hover:bg-gray-100 cursor-pointer border-b" onClick={() => handleSelectClient(c)}>
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedClients.map(client => (
                <div key={client.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>{client.name}</span>
                  <button onClick={() => handleRemoveClient(client.id)} className="text-red-500 font-bold hover:text-red-700">×</button>
                </div>
              ))}
            </div>

            <label className="text-sm font-bold text-gray-500">FECHA</label>
            <Input type="date" value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} />
          </Card>

          <div className="space-y-4">
            {sections.map((section, sIndex) => (
              <Card key={sIndex} className="p-4 bg-white border-l-4 border-blue-500">
                <div className="flex justify-between items-center mb-3">
                  <Input 
                    placeholder="NOMBRE DE CATEGORÍA" 
                    className="font-bold uppercase text-blue-800"
                    value={section.title}
                    onChange={(e) => handleSectionTitleChange(sIndex, e.target.value)}
                  />
                  <button onClick={() => handleRemoveSection(sIndex)} className="text-red-500 text-xs hover:underline">Eliminar Categoría</button>
                </div>

                <div className="space-y-2">
                  {section.items.map((item, iIndex) => (
                    <div key={iIndex} className="flex gap-2">
                      <div className="flex-grow">
                        <Input placeholder="Descripción..." value={item.description} onChange={(e) => handleItemChange(sIndex, iIndex, 'description', e.target.value)} />
                      </div>
                      <div className="w-24">
                        <Input type="number" placeholder="S/" value={item.price} onChange={(e) => handleItemChange(sIndex, iIndex, 'price', e.target.value)} />
                      </div>
                      <button onClick={() => handleRemoveItemFromSection(sIndex, iIndex)} className="text-red-400 font-bold px-2">×</button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-3 text-xs" onClick={() => handleAddItemToSection(sIndex)}>+ Agregar Item</Button>
              </Card>
            ))}
            
            <Button variant="secondary" className="w-full py-3 border-dashed border-2" onClick={handleAddSection}>
              + NUEVA CATEGORÍA
            </Button>
          </div>
        </div>

        {/* === DERECHA: VISTA PREVIA HTML === */}
        <div className="lg:col-span-1">
          <div id="print-area" className="bg-white p-8 shadow-2xl min-h-[800px] text-sm relative text-gray-800 font-sans">
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-2xl font-bold uppercase tracking-wide">Eco Sistemas URH SAC</h1>
              <p>Mza It9 A.V Nueva Gales - Cieneguilla</p>
              <p>Cel: 998270102 - 985832096</p>
              <p>Email: ecosistemas_urh_sac@hotmail.com</p>
              <p className="mt-2 font-bold uppercase">LIMA, {getPrintDate()}</p>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Cliente(s):</p>
              {selectedClients.map(c => (
                <div key={c.id} className="mb-2 border-b last:border-0 border-gray-200 pb-1 last:pb-0">
                  <h2 className="text-lg font-bold text-gray-900 uppercase">{c.name}</h2>
                  <span className="text-gray-600 text-xs mr-4">{c.phone}</span>
                  <span className="text-gray-600 text-xs">{c.email}</span>
                </div>
              ))}
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-2 px-3 text-left">DESCRIPCIÓN</th>
                  <th className="py-2 px-3 text-right w-32">PRECIO</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <td colSpan={2} className="py-2 px-3 font-bold text-blue-900 uppercase text-xs tracking-wider">
                        {section.title || '(Sin Categoría)'}
                      </td>
                    </tr>
                    {section.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="py-2 px-3 pl-6">{item.description}</td>
                        <td className="py-2 px-3 text-right">S/ {item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end pt-4 border-t-2 border-gray-800">
              <div className="w-1/2 flex justify-between items-center text-xl font-bold">
                <span>TOTAL:</span>
                <span className="bg-yellow-100 px-2">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 text-xs text-gray-500 border-t pt-4">
              <p className="font-bold text-gray-700">Términos y Condiciones:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Validez de la oferta: 15 días calendario.</li>
                <li>Garantía: 1 año por defectos de fabricación.</li>
                <li>Forma de pago: 50% adelanto, 50% al finalizar.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};