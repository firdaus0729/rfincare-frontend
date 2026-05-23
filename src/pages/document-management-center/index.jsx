import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';

import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import DocumentCard from './components/DocumentCard';
import UploadZone from './components/UploadZone';
import DocumentViewer from './components/DocumentViewer';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import BulkActions from './components/BulkActions';
import StorageIndicator from './components/StorageIndicator';

const DocumentManagementCenter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const useAdminChrome = location.pathname.startsWith('/admin/');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('identity');

  const categories = [
  { id: 'identity', name: 'Identity Proof', icon: 'User' },
  { id: 'address', name: 'Address Proof', icon: 'MapPin' },
  { id: 'income', name: 'Income Documents', icon: 'IndianRupee' },
  { id: 'bank', name: 'Bank Statements', icon: 'Building2' },
  { id: 'property', name: 'Property Documents', icon: 'Home' },
  { id: 'other', name: 'Other Documents', icon: 'FileText' }];


  const mockDocuments = [
  {
    id: 1,
    name: "Passport_John_Doe.pdf",
    category: "Identity Proof",
    categoryId: "identity",
    type: "pdf",
    size: 2457600,
    uploadedAt: new Date(2026, 0, 10, 14, 30),
    status: "approved",
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_110dc7378-1768246087691.png",
    urlAlt: "Official passport document showing photo identification page with personal details and government seal",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_104e1d156-1771231780481.png",
    thumbnailAlt: "Thumbnail preview of passport document with blue cover and gold emblem",
    verificationNote: "Document verified and approved by admin",
    expiryDate: new Date(2030, 5, 15),
    versions: [
    {
      name: "Passport_John_Doe.pdf",
      uploadedAt: new Date(2026, 0, 10, 14, 30),
      type: "pdf",
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_110dc7378-1768246087691.png",
      urlAlt: "Official passport document showing photo identification page with personal details and government seal"
    }]

  },
  {
    id: 2,
    name: "Drivers_License_Front.jpg",
    category: "Identity Proof",
    categoryId: "identity",
    type: "image",
    size: 1843200,
    uploadedAt: new Date(2026, 0, 12, 9, 15),
    status: "approved",
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1d13f5fc9-1766978131209.png",
    urlAlt: "Front side of driver's license showing photo, name, address, and license number with state seal",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1d76a3ce1-1764870940498.png",
    thumbnailAlt: "Thumbnail of driver\'s license with photo ID and personal information visible",
    verificationNote: "Clear and valid document",
    expiryDate: new Date(2028, 11, 20)
  },
  {
    id: 3,
    name: "Utility_Bill_December_2025.pdf",
    category: "Address Proof",
    categoryId: "address",
    type: "pdf",
    size: 1024000,
    uploadedAt: new Date(2026, 0, 8, 16, 45),
    status: "pending",
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1dd6123d4-1766831402785.png",
    urlAlt: "Utility bill document showing account holder name, service address, billing period, and payment details",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1e47b7dc6-1767275998510.png",
    thumbnailAlt: "Thumbnail preview of utility bill with company logo and billing information"
  },
  {
    id: 4,
    name: "Salary_Slip_January_2026.pdf",
    category: "Income Documents",
    categoryId: "income",
    type: "pdf",
    size: 921600,
    uploadedAt: new Date(2026, 0, 14, 11, 20),
    status: "approved",
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1a36f4bec-1766470560736.png",
    urlAlt: "Monthly salary slip showing employee details, gross salary, deductions, and net pay with company letterhead",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1a36f4bec-1766470560736.png",
    thumbnailAlt: "Thumbnail of salary slip document with financial breakdown and company branding",
    verificationNote: "Income verified successfully"
  },
  {
    id: 5,
    name: "Bank_Statement_Q4_2025.pdf",
    category: "Bank Statements",
    categoryId: "bank",
    type: "pdf",
    size: 3145728,
    uploadedAt: new Date(2026, 0, 5, 13, 10),
    status: "rejected",
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_14224218f-1764667263945.png",
    urlAlt: "Bank statement document displaying account transactions, balances, and financial activity for three-month period",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_14224218f-1764667263945.png",
    thumbnailAlt: "Thumbnail of bank statement with transaction list and account summary",
    verificationNote: "Statement is older than 3 months. Please upload recent statement.",
    versions: [
    {
      name: "Bank_Statement_Q4_2025.pdf",
      uploadedAt: new Date(2026, 0, 5, 13, 10),
      type: "pdf",
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_14224218f-1764667263945.png",
      urlAlt: "Bank statement document displaying account transactions, balances, and financial activity for three-month period"
    },
    {
      name: "Bank_Statement_Q3_2025.pdf",
      uploadedAt: new Date(2025, 11, 28, 10, 30),
      type: "pdf",
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_14224218f-1764667263945.png",
      urlAlt: "Previous quarter bank statement showing earlier transaction history and account details"
    }]

  },
  {
    id: 6,
    name: "Property_Tax_Receipt_2025.jpg",
    category: "Property Documents",
    categoryId: "property",
    type: "image",
    size: 2097152,
    uploadedAt: new Date(2026, 0, 11, 15, 40),
    status: "approved",
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_122dae7c6-1768380866249.png",
    urlAlt: "Property tax receipt showing property address, assessed value, tax amount paid, and municipal stamp",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1571fea5a-1768478758173.png",
    thumbnailAlt: "Thumbnail of property tax receipt with official government seal and payment confirmation",
    verificationNote: "Property ownership verified"
  },
  {
    id: 7,
    name: "Employment_Letter.pdf",
    category: "Income Documents",
    categoryId: "income",
    type: "pdf",
    size: 716800,
    uploadedAt: new Date(2026, 0, 13, 10, 25),
    status: "pending",
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_105f27cae-1767548462155.png",
    urlAlt: "Official employment letter on company letterhead confirming position, salary, and employment duration",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_105f27cae-1767548462155.png",
    thumbnailAlt: "Thumbnail of employment verification letter with company logo and authorized signature"
  },
  {
    id: 8,
    name: "Aadhar_Card.pdf",
    category: "Identity Proof",
    categoryId: "identity",
    type: "pdf",
    size: 1536000,
    uploadedAt: new Date(2026, 0, 9, 12, 50),
    status: "expired",
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_19f9f594c-1764740086474.png",
    urlAlt: "Aadhar card document showing unique identification number, photo, name, and address with UIDAI logo",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_185896986-1764740084105.png",
    thumbnailAlt: "Thumbnail of Aadhar card with biometric identification details and government branding",
    verificationNote: "Document has expired. Please upload updated version.",
    expiryDate: new Date(2025, 11, 31)
  }];


  useEffect(() => {
    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
  }, []);

  useEffect(() => {
    let filtered = [...documents];

    if (selectedCategory !== 'all') {
      filtered = filtered?.filter((doc) => doc?.categoryId === selectedCategory);
    }

    if (statusFilter !== 'all') {
      filtered = filtered?.filter((doc) => doc?.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered?.filter((doc) =>
      doc?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      doc?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b?.uploadedAt - a?.uploadedAt;
        case 'date-asc':
          return a?.uploadedAt - b?.uploadedAt;
        case 'name-asc':
          return a?.name?.localeCompare(b?.name);
        case 'name-desc':
          return b?.name?.localeCompare(a?.name);
        case 'size-desc':
          return b?.size - a?.size;
        case 'size-asc':
          return a?.size - b?.size;
        default:
          return 0;
      }
    });

    setFilteredDocuments(filtered);
  }, [documents, selectedCategory, statusFilter, searchQuery, sortBy]);

  const documentCounts = {
    all: documents?.length,
    ...categories?.reduce((acc, cat) => {
      acc[cat.id] = documents?.filter((doc) => doc?.categoryId === cat?.id)?.length;
      return acc;
    }, {})
  };

  const handleUpload = (file, category) => {
    const newDocument = {
      id: Date.now(),
      name: file?.name,
      category: categories?.find((c) => c?.id === category)?.name || 'Other Documents',
      categoryId: category,
      type: file?.type?.includes('image') ? 'image' : file?.type?.includes('pdf') ? 'pdf' : 'doc',
      size: file?.size,
      uploadedAt: new Date(),
      status: 'pending',
      url: URL.createObjectURL(file),
      urlAlt: `Uploaded document ${file?.name} for ${category} category`,
      thumbnail: file?.type?.includes('image') ? URL.createObjectURL(file) : null,
      thumbnailAlt: file?.type?.includes('image') ? `Thumbnail preview of ${file?.name}` : null
    };

    setDocuments((prev) => [newDocument, ...prev]);
    setShowUploadModal(false);
  };

  const handleView = (document) => {
    setViewingDocument(document);
  };

  const handleDownload = (document) => {
    console.log('Downloading:', document?.name);
  };

  const handleDelete = (document) => {
    if (window.confirm(`Are you sure you want to delete ${document?.name}?`)) {
      setDocuments((prev) => prev?.filter((doc) => doc?.id !== document?.id));
      setSelectedDocuments((prev) => prev?.filter((id) => id !== document?.id));
    }
  };

  const handleReupload = (document) => {
    setUploadCategory(document?.categoryId);
    setShowUploadModal(true);
  };

  const handleSelectDocument = (id, checked) => {
    if (checked) {
      setSelectedDocuments((prev) => [...prev, id]);
    } else {
      setSelectedDocuments((prev) => prev?.filter((docId) => docId !== id));
    }
  };

  const handleDownloadAll = () => {
    console.log('Downloading selected documents:', selectedDocuments);
    setSelectedDocuments([]);
  };

  const handleDeleteAll = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedDocuments?.length} documents?`)) {
      setDocuments((prev) => prev?.filter((doc) => !selectedDocuments?.includes(doc?.id)));
      setSelectedDocuments([]);
    }
  };

  const totalStorage = 10737418240;
  const usedStorage = documents?.reduce((sum, doc) => sum + doc?.size, 0);

  const categoryOptions = [
  { value: 'identity', label: 'Identity Proof' },
  { value: 'address', label: 'Address Proof' },
  { value: 'income', label: 'Income Documents' },
  { value: 'bank', label: 'Bank Statements' },
  { value: 'property', label: 'Property Documents' },
  { value: 'other', label: 'Other Documents' }];


  return (
    <div className={useAdminChrome ? '' : 'min-h-screen bg-background'}>
      {!useAdminChrome && <Header />}
      <main className={useAdminChrome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12'}>
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Document Management Center
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Securely upload, manage, and track all your loan application documents
              </p>
            </div>
            <Button
              variant="default"
              size="lg"
              iconName="Upload"
              iconPosition="left"
              onClick={() => setShowUploadModal(true)}>

              Upload Documents
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="Shield" size={16} />
            <span>Bank-grade encryption</span>
            <span>•</span>
            <Icon name="Lock" size={16} />
            <span>Secure storage</span>
            <span>•</span>
            <Icon name="Eye" size={16} />
            <span>Access logging</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-1 space-y-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              documentCounts={documentCounts} />

            <StorageIndicator
              usedStorage={usedStorage}
              totalStorage={totalStorage} />

          </div>

          <div className="lg:col-span-3 space-y-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter} />


            <BulkActions
              selectedCount={selectedDocuments?.length}
              onDownloadAll={handleDownloadAll}
              onDeleteAll={handleDeleteAll}
              onClearSelection={() => setSelectedDocuments([])} />


            <div className="bg-card border border-border rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">
                  {selectedCategory === 'all' ? 'All Documents' :
                  categories?.find((c) => c?.id === selectedCategory)?.name}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({filteredDocuments?.length})
                  </span>
                </h2>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`
                    }>

                    <Icon name="Grid3x3" size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`
                    }>

                    <Icon name="List" size={20} />
                  </button>
                </div>
              </div>

              {filteredDocuments?.length === 0 ?
              <div className="text-center py-12 md:py-16">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="FileX" size={40} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    No documents found
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">
                    {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters or search query' : 'Upload your first document to get started'}
                  </p>
                  <Button
                  variant="default"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={() => setShowUploadModal(true)}>

                    Upload Document
                  </Button>
                </div> :

              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6' : 'space-y-4'
              }>
                  {filteredDocuments?.map((document) =>
                <DocumentCard
                  key={document?.id}
                  document={document}
                  onView={handleView}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onReupload={handleReupload}
                  isSelectable={true}
                  isSelected={selectedDocuments?.includes(document?.id)}
                  onSelect={handleSelectDocument} />

                )}
                </div>
              }
            </div>
          </div>
        </div>
      </main>
      {showUploadModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Upload Documents
              </h2>
              <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={() => setShowUploadModal(false)} />

            </div>

            <div className="p-4 md:p-6 space-y-6">
              <Select
              label="Document Category"
              description="Select the type of document you're uploading"
              options={categoryOptions}
              value={uploadCategory}
              onChange={setUploadCategory}
              required />


              <UploadZone
              onUpload={handleUpload}
              acceptedFormats={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
              maxSize={10485760}
              category={uploadCategory} />


              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Icon name="Info" size={16} />
                  <span>Upload Guidelines</span>
                </h3>
                <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Ensure documents are clear and readable</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>All four corners of the document should be visible</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Documents should not be older than 3 months</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Maximum file size: 10 MB per document</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      }
      {viewingDocument &&
      <DocumentViewer
        document={viewingDocument}
        onClose={() => setViewingDocument(null)}
        onDownload={handleDownload} />

      }
    </div>);

};

export default DocumentManagementCenter;