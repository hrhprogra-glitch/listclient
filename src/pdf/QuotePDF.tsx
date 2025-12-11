// pages/QuotePDF.tsx
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// 👇 ASEGÚRATE QUE ESTAS RUTAS SEAN CORRECTAS SEGÚN TU CARPETA
import type { Client } from '../types/user';     // Quizás sea ../../types/user
import type { QuoteSection } from '../types/quote'; 

// ... (resto del código del PDF que te pasé antes) ...

// Estilos exclusivos para el PDF (tipo CSS pero en JS)
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#111827', paddingBottom: 10, marginBottom: 20 },
  headerLeft: { flexGrow: 1 },
  title: { fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' },
  subtitle: { fontSize: 10, marginTop: 4 },
  
  clientSection: { backgroundColor: '#f9fafb', padding: 10, marginBottom: 20, borderRadius: 4 },
  clientTitle: { fontSize: 10, color: '#6b7280', fontWeight: 'bold', marginBottom: 4 },
  clientName: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
  
  table: { width: '100%', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1f2937', color: 'white', padding: 6 },
  colDesc: { width: '80%' },
  colPrice: { width: '20%', textAlign: 'right' },
  
  rowCat: { backgroundColor: '#f3f4f6', padding: 5, marginTop: 5 },
  catText: { color: '#1e3a8a', fontWeight: 'bold', textTransform: 'uppercase' },
  
  rowItem: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 6 },
  
  totalSection: { marginTop: 10, borderTopWidth: 2, borderTopColor: '#111827', paddingTop: 10, flexDirection: 'row', justifyContent: 'flex-end' },
  totalText: { fontSize: 16, fontWeight: 'bold' },
  totalValue: { fontSize: 16, fontWeight: 'bold', backgroundColor: '#fef9c3', padding: 4 },
  
  footer: { marginTop: 30, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10, color: '#6b7280' }
});

interface PdfProps {
  clients: Client[];
  sections: QuoteSection[];
  total: number;
  date: string;
}

export const QuoteDocument = ({ clients, sections, total, date }: PdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Eco Sistemas URH SAC</Text>
          <Text style={styles.subtitle}>Mza It9 A.V Nueva Gales - Cieneguilla</Text>
          <Text style={styles.subtitle}>Cel: 998270102 - 985832096</Text>
          <Text style={styles.subtitle}>Email: ecosistemas_urh_sac@hotmail.com</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold' }}>LIMA, {date}</Text>
        </View>
      </View>

      {/* CLIENTES */}
      <View style={styles.clientSection}>
        <Text style={styles.clientTitle}>CLIENTE(S):</Text>
        {clients.map((c, i) => (
          <View key={i} style={{ marginBottom: 5 }}>
            <Text style={styles.clientName}>{c.name}</Text>
            <Text>{c.phone} | {c.email}</Text>
          </View>
        ))}
      </View>

      {/* TABLA */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>DESCRIPCIÓN</Text>
          <Text style={styles.colPrice}>PRECIO</Text>
        </View>

        {sections.map((section, idx) => (
          <View key={idx}>
            {/* Categoría */}
            <View style={styles.rowCat}>
              <Text style={styles.catText}>{section.title || '(Sin Categoría)'}</Text>
            </View>
            {/* Items */}
            {section.items.map((item, i) => (
              <View key={i} style={styles.rowItem}>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colPrice}>S/ {Number(item.price).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* TOTAL */}
      <View style={styles.totalSection}>
        <Text style={styles.totalText}>TOTAL: </Text>
        <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Términos y Condiciones:</Text>
        <Text>• Validez de la oferta: 15 días calendario.</Text>
        <Text>• Garantía: 1 año por defectos de fabricación.</Text>
        <Text>• Forma de pago: 50% adelanto, 50% al finalizar.</Text>
      </View>

    </Page>
  </Document>
);