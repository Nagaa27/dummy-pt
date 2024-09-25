import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { useRouter } from "next/router"; // Mengimpor useRouter dari Next.js

const SalesOrders = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter(); // Inisialisasi useRouter

  useEffect(() => {
    // Fetching JSON data from the public folder
    const fetchData = async () => {
      const response = await fetch("/dummy.json");
      const data = await response.json();
      setOrders(data);
    };

    fetchData();
  }, []);

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("INVOICE", 105, 20, { align: "center" }); // Header
    doc.setFontSize(12);
    doc.text("Your Company Name", 105, 30, { align: "center" }); // Sub-header
    doc.text("Address: Your Company Address", 105, 40, { align: "center" });
    doc.text("Phone: Your Company Phone Number", 105, 50, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
    doc.text(`Order ID: ${order.id}`, 20, 80);

    // Customer Information
    doc.text("Customer Information", 20, 100);
    doc.text(`Name: ${order.person.display_name}`, 20, 110);
    doc.text(`Address: ${order.person.address}`, 20, 120);
    doc.text(`Tax No: ${order.person.tax_no}`, 20, 130);

    // Items Purchased
    doc.text("Items Purchased:", 20, 150);

    // Draw table manually
    const startY = 160; // Starting position of the table
    const columnHeaders = [
      "Product Name",
      "Description",
      "Quantity",
      "Price",
      "Total",
    ];
    const columnWidth = [40, 60, 20, 30, 30]; // Column width

    // Draw table header
    for (let i = 0; i < columnHeaders.length; i++) {
      doc.text(
        columnHeaders[i],
        20 + columnWidth.slice(0, i).reduce((a, b) => a + b, 0),
        startY
      );
    }

    // Draw header underline
    doc.line(20, startY + 2, 190, startY + 2); // Horizontal line

    // Draw table data
    let currentY = startY + 10; // Current Y position
    order.transaction_lines_attributes.forEach((line) => {
      const rowData = [
        line.item.product.name,
        line.item.description,
        line.item.quantity.toString(),
        line.item.rate_currency_format,
        line.item.amount_currency_format,
      ];

      for (let i = 0; i < rowData.length; i++) {
        doc.text(
          rowData[i],
          20 + columnWidth.slice(0, i).reduce((a, b) => a + b, 0),
          currentY
        );
      }
      currentY += 10; // Row spacing
    });

    // Display subtotal, tax, and remaining
    doc.text(`Subtotal: ${order.subtotal_currency_format}`, 20, currentY + 10);
    doc.text("Tax:", 20, currentY + 20);
    order.tax_details.forEach((taxDetail, idx) => {
      doc.text(
        `${taxDetail.item.name}: ${taxDetail.item.tax_amount_currency_format}`,
        20,
        currentY + 30 + 10 * idx
      );
    });
    doc.text(
      `Remaining: ${order.remaining_currency_format}`,
      20,
      currentY + 30 + 10 * order.tax_details.length
    );

    // Save PDF
    doc.save(`invoice_${order.id}.pdf`);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <button
        onClick={() => router.push("/")} // Arahkan ke halaman utama
        className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300 mb-4"
      >
        HOME
      </button>


      <h1 className="text-2xl font-bold mb-4">Sales Orders</h1>
      {orders.map((orderData, index) => {
        const order = orderData.sales_order;
        return (
          <div key={index} className="order-card bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
            <p className="text-gray-600">Transaction Date: {order.transaction_date}</p>
            <h3 className="text-lg font-semibold mt-2">Customer Info</h3>
            <p>Name: {order.person.display_name}</p>
            <p>Address: {order.person.address}</p>
            <p>Tax No: {order.person.tax_no}</p>

            <h3 className="text-lg font-semibold mt-2">Items Purchased</h3>
            <ul className="list-disc list-inside mb-4">
              {order.transaction_lines_attributes.map((line, idx) => (
                <li key={idx}>
                  <strong>{line.item.product.name}</strong> - {line.item.description} <br />
                  Quantity: {line.item.quantity} <br />
                  Price: {line.item.rate_currency_format} <br />
                  Total: {line.item.amount_currency_format}
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold">Subtotal: {order.subtotal_currency_format}</h3>
            <h3 className="text-lg font-semibold mt-2">Tax</h3>
            <ul className="list-disc list-inside mb-4">
              {order.tax_details.map((taxDetail, idx) => (
                <li key={idx}>
                  {taxDetail.item.name}: {taxDetail.item.tax_amount_currency_format}
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold">Remaining: {order.remaining_currency_format}</h3>

            {/* Button to generate invoice */}
            <button
              onClick={() => generateInvoice(order)}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-4"
            >
              GENERATE INVOICE
            </button>

            <hr className="my-4" />
          </div>
        );
      })}
    </div>
  );
};

export default SalesOrders;
