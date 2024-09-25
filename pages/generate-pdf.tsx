// import "../[id]/style.css";
import Image from "next/image";
import LogoImg from "../public/logo.png";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

// Define types for order and related objects
interface TransactionLine {
  item: {
    product: {
      name: string;
    };
    description: string;
    quantity: number;
    rate_currency_format: string;
    amount_currency_format: string;
  };
}

interface TaxDetail {
  item: {
    name: string;
    tax_amount_currency_format: string;
  };
}

interface Person {
  display_name: string;
  address: string;
  tax_no: string;
}

interface SalesOrder {
  id: string;
  transaction_date: string;
  person: Person;
  transaction_lines_attributes: TransactionLine[];
  subtotal_currency_format: string;
  tax_details: TaxDetail[];
  remaining_currency_format: string;
}

interface OrdersData {
  sales_order: SalesOrder;
}

const SalesOrders: React.FC = () => {
  const [salesOrder, setSalesOrder] = useState<OrdersData | null>(null); // State for storing a single sales order

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/dummy.json");
      const data: OrdersData[] = await response.json();
      setSalesOrder(data[0] || null); // Store only the first sales order in state
    };

    fetchData();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Add company information
    doc.setFontSize(16);
    doc.text("PT. CENTRAL ALAM RESOURCES LESTARI", 10, 10);
    doc.setFontSize(12);
    doc.text("JL. SOEKARNO HATTA NO.488 KEL PERHENTIAN MARPOYAN", 10, 20);
    doc.text("KEC. MARPOYAN DAMAI KOTA PEKANBARU PROV. RIAU 28125 INDONESIA", 10, 25);
    doc.text("Telp/WA: 0853 6608 8724 e-mail: cps@centralgroup.co.id Web: www.centralgroup.co.id", 10, 30);
  
    // Sales Order ID
    doc.setFontSize(14);
    doc.text(`Sales Order ID: ${order.id}`, 10, 40);
    
    // Add a header for Order Details
    doc.setFontSize(12);
    doc.text("Central Plantation Services - Klinik Perkebunan", 10, 50);
  
    // Create a line break
    doc.text("", 10, 60); // Just for spacing
    
    // Add a section for Additional Info
    doc.text("Formulir Registrasi Penerimaan Sampel", 10, 70);
    doc.text("", 10, 80); // Just for spacing
  
    // Add Customer Information Header
    doc.text("Informasi Pelanggan", 10, 90);
    const customerInfo = [
      ["Nama Pelanggan", order.person.display_name],
      ["Alamat", order.person.address],
      ["No. Pajak", order.person.tax_no]
    ];
  
    let customerY = 100;
    customerInfo.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 10, customerY);
      customerY += 10; // Increase Y position for the next row
    });
  
    // Add a section for Sample Information Header
    doc.text("Informasi Sampel", 10, customerY + 10);
    
    // Add Sample Information Table Headers
    const sampleHeaders = ["No.", "Jenis Sampel", "Parameter Uji", "Qty", "Biaya Per-sampel", "Total Biaya"];
    let sampleY = customerY + 20; // Starting Y position for sample table
    sampleHeaders.forEach((header, index) => {
      doc.text(header, 10 + index * 30, sampleY); // Adjust X position for each header
    });
  
    // Add Sample Data
    order.transaction_lines_attributes.forEach((line, idx) => {
      sampleY += 10; // Move down for the next row
      doc.text((idx + 1).toString(), 10, sampleY);
      doc.text(line.item.product.name, 40, sampleY);
      doc.text(line.item.description, 120, sampleY);
      doc.text(line.item.quantity.toString(), 200, sampleY);
      doc.text(line.item.rate_currency_format, 220, sampleY);
      doc.text(line.item.amount_currency_format, 270, sampleY);
    });
  
    // Add Payment Information
    sampleY += 20; // Move down for payment info
    doc.text("Transfer pembayaran ke: BANK CIMB NIAGA CAB. SUDIRMAN", 10, sampleY);
    sampleY += 10;
    doc.text("Nomor Rekening: 8000 4244 1500", 10, sampleY);
    sampleY += 10;
    doc.text("PT. CENTRAL ALAM RESOURCES LESTARI", 10, sampleY);
    
    // Add Subtotal
    sampleY += 20; // Move down for subtotal
    doc.text(`Subtotal: ${order.subtotal_currency_format}`, 10, sampleY);
  
    // Add Tax Details
    order.tax_details.forEach((tax, idx) => {
      sampleY += 10; // Move down for each tax detail
      doc.text(`${tax.item.name}: ${tax.item.tax_amount_currency_format}`, 10, sampleY);
    });
  
    // Add Total
    sampleY += 10; // Move down for total
    doc.text(`Total: ${order.remaining_currency_format}`, 10, sampleY);
  
    // Save the PDF
    doc.save(`SalesOrder_${order.id}.pdf`);
  };
  
  
  // If sales order data is not loaded yet, show a loading message
  if (!salesOrder) {
    return <div>Loading...</div>;
  }

  const order = salesOrder.sales_order;

  return (
    <div className="container">
      <div id="company-banner">
        <Image src={LogoImg} alt="My Image" width={80} height={80} />
        <div id="company-info">
          <h2>PT. CENTRAL ALAM RESOURCES LESTARI</h2>
          <p>JL. SOEKARNO HATTA NO.488 KEL PERHENTIAN MARPOYAN</p>
          <p>KEC. MARPOYAN DAMAI KOTA PEKANBARU PROV. RIAU 28125 INDONESIA</p>
          <p>Telp/WA: 0853 6608 8724 e-mail: cps@centralgroup.co.id Web: www.centralgroup.co.id</p>
        </div>
      </div>

      <div>
        <h3>Sales Order ID: {order.id}</h3>
        <div>
          <table border={1} style={{ marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>
                  Central Plantation Services - Klinik Perkebunan
                </th>
              </tr>
            </thead>
          </table>

          <div>
            <table>
              <thead style={{ fontSize: '14px' }}>
                <tr>
                  <th style={{ textAlign: 'center' }}>FM7.4-1</th>
                  <th style={{ textAlign: 'center' }}>Tanggal: {order.transaction_date}</th>
                  <th style={{ textAlign: 'center' }}>Revisi/Tanggal: 00/-</th>
                  <th style={{ textAlign: 'center' }}>Halaman 1 dari 1</th>
                </tr>
              </thead>
            </table>

            <table border={1}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Formulir Registrasi Penerimaan Sampel</th>
                </tr>
              </thead>
            </table>
          </div>

          <table border={1} style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Informasi Pelanggan</th>
              </tr>
            </thead>
          </table>

          <table>
            <tbody style={{ fontSize: '14px' }}>
              <tr>
                <th>Nama Pelanggan</th>
                <td>{order.person.display_name}</td>
              </tr>
              <tr>
                <th>Alamat</th>
                <td>{order.person.address}</td>
              </tr>
              <tr>
                <th>No. Pajak</th>
                <td>{order.person.tax_no}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <table border={1} style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Informasi Sampel</th>
              </tr>
            </thead>
          </table>

          <table className="SpecialText">
            <thead>
              <tr>
                <th style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>No.</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>Jenis Sampel</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>Parameter Uji</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>Qty</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>Biaya Per-sampel</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>Total Biaya</th>
              </tr>
            </thead>

            <tbody>
              {order.transaction_lines_attributes.map((line, idx) => (
                <tr key={idx} style={{ fontSize: '15px' }}>
                  <td>{idx + 1}</td>
                  <td>{line.item.product.name}</td>
                  <td>{line.item.description}</td>
                  <td style={{ textAlign: 'center' }}>{line.item.quantity}</td>
                  <td>{line.item.rate_currency_format}</td>
                  <td>{line.item.amount_currency_format}</td>
                </tr>
              ))}

              <tr>
                <td rowSpan={3} colSpan={4} className="SpecialText" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  <br />Transfer pembayaran ke: <span style={{ fontWeight: 'normal' }}>BANK CIMB NIAGA CAB. SUDIRMAN</span><br />
                  <br />Nomor Rekening: <span style={{ fontWeight: 'normal' }}>8000 4244 1500</span><br />
                  <br />PT. CENTRAL ALAM RESOURCES LESTARI
                  <br />
                  <br />
                </td>
                <td style={{ fontWeight: 'bold' }}>Subtotal:</td>
                <td style={{ fontSize: '15px' }}>{order.subtotal_currency_format}</td>
              </tr>
              {order.tax_details.map((tax, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 'bold' }}>{tax.item.name}:</td>
                  <td style={{ fontSize: '15px' }}>{tax.item.tax_amount_currency_format}</td>
                </tr>
              ))}
              <tr>
                <td style={{ fontWeight: 'bold' }}>Total:</td>
                <td style={{ fontSize: '15px' }}>{order.remaining_currency_format}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button
  onClick={downloadPDF}
  className="mt-5 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
>
  Download PDF
</button>

    </div>
  );
};

export default SalesOrders;
