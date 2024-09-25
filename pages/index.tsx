import Link from 'next/link';
import { FC } from 'react';

const Home: FC = () => {
  return (
    <div className="container">
      <h1>Welcome to My Sales Order App!</h1>
      <p>Explore the sales orders data by clicking the link below:</p>
      
      <Link href="/sales-orders" className="view-orders-link">
        View Sales orders Dummy
      </Link>
      <br />
      <Link href="/generate-pdf" className="view-orders-link">
        Generate PT
      </Link>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 100%;
          height: 100vh; /* Atur tinggi sesuai kebutuhan */
          background-color: #f5f5f5;
          text-align: center;
        }
        h1 {
          color: #333;
          margin-bottom: 20px;
        }
        p {
          font-size: 18px;
          color: #666;
          margin-bottom: 20px;
        }
        .view-orders-link {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border-radius: 5px;
          text-decoration: none;
        }
        .view-orders-link:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default Home;
