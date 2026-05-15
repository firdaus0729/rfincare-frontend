import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import { homepageService } from '../../services/homepageService';

const LegalPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    homepageService
      .getLegalPage(slug)
      .then(setPage)
      .catch(() => setError('Page not found'));
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        {error && <p className="text-destructive">{error}</p>}
        {page && (
          <>
            <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: page.bodyHtml || '' }}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
