import React, { useState, useEffect } from 'react';

// Importamos tus componentes UI existentes según tu estructura
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { PageContainer } from '../../../components/layout/PageContainer'; 

// Importamos el tipo de dato
import type { Client } from '../../../types/user';

export const HomeDashboard = () => {
  // --- ESTADOS (LÓGICA) ---
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  
  // Estado para el formulario
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  // 1. Cargar clientes al iniciar (Desde LocalStorage)
  useEffect(() => {
    const saved = localStorage.getItem('app_clients');
    if (saved) setClients(JSON.parse(saved));
  }, []);

  // 2. Guardar Cliente (CREATE)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    if (!form.name || !form.phone) return;

    const newClient: Client = {
      id: Date.now(),
      createdAt: new Date().toLocaleDateString('es-ES'),
      name: form.name,
      email: form.email,
      phone: form.phone
    };

    const updatedList = [...clients, newClient];
    setClients(updatedList);
    localStorage.setItem('app_clients', JSON.stringify(updatedList));
    
    setForm({ name: '', email: '', phone: '' }); // Limpiar formulario
  };

  // 3. Eliminar Cliente (DELETE)
  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      const updatedList = clients.filter(c => c.id !== id);
      setClients(updatedList);
      localStorage.setItem('app_clients', JSON.stringify(updatedList));
    }
  };

  // 4. Filtrar Clientes (SEARCH)
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.createdAt.includes(search)
  );

  // --- VISTA (RENDER) ---
  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        
        <h1 className="text-2xl font-bold text-gray-800">Panel de Clientes</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* === SECCIÓN 1: FORMULARIO DE INGRESO === */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white shadow-md">
              <h2 className="text-lg font-bold mb-4 text-gray-700">Nuevo Cliente</h2>
              <form onSubmit={handleSave} className="space-y-4">
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <Input 
                    placeholder="Ej: Juan Pérez"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    type="email"
                    placeholder="cliente@email.com"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Teléfono</label>
                  <Input 
                    type="tel"
                    placeholder="+51 999 000"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    required
                  />
                </div>

                <Button variant="primary" type="submit" className="w-full">
                  Guardar
                </Button>
              </form>
            </Card>
          </div>

          {/* === SECCIÓN 2: LISTADO Y BUSCADOR === */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white shadow-md h-full">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-700">Lista de Clientes</h2>
                <div className="w-64">
                  <Input 
                    placeholder="Buscar por nombre o fecha..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-xs uppercase">
                      <th className="p-3 rounded-tl-lg">Fecha</th>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Teléfono</th>
                      <th className="p-3">Email</th>
                      <th className="p-3 rounded-tr-lg text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <tr key={client.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-gray-500">{client.createdAt}</td>
                          <td className="p-3 font-medium text-gray-900">{client.name}</td>
                          <td className="p-3 text-gray-600">{client.phone}</td>
                          <td className="p-3 text-blue-600">{client.email}</td>
                          
                          {/* Botón de Eliminar alineado a la derecha */}
                          <td className="p-3 text-right">
                            <Button 
                              variant="danger" 
                              onClick={() => handleDelete(client.id)}
                              className="text-xs py-1 px-2"
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-400">
                          No hay clientes registrados aún.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </Card>
          </div>

        </div>
      </div>
    </PageContainer>
  );
};