import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import LoadingSpinner from '../components/LoadingSpinner';

// Import templates
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';

const ResumePreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const resumeRef = useRef();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchResume();
    }, [id]);

    const fetchResume = async () => {
        try {
            const response = await api.get('/resumes');
            const foundResume = response.data.find(r => r.id === parseInt(id));

            if (foundResume) {
                setResume(foundResume);
            } else {
                toast.error('Resume not found');
                navigate('/resumes');
            }
        } catch (error) {
            toast.error('Failed to load resume');
            navigate('/resumes');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!resumeRef.current) return;

        setDownloading(true);
        toast.loading('Generating PDF...', { id: 'pdf-download' });

        try {
            const canvas = await html2canvas(resumeRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

            const fileName = `${resume.content.name || 'resume'}-resume.pdf`;
            pdf.save(fileName);

            toast.success('PDF downloaded successfully!', { id: 'pdf-download' });
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF', { id: 'pdf-download' });
        } finally {
            setDownloading(false);
        }
    };

    const renderTemplate = () => {
        if (!resume) return null;

        const templateProps = { data: resume.content };

        switch (resume.template) {
            case 'modern':
                return <ModernTemplate {...templateProps} />;
            case 'minimal':
                return <MinimalTemplate {...templateProps} />;
            case 'professional':
                return <ProfessionalTemplate {...templateProps} />;
            case 'creative':
                return <CreativeTemplate {...templateProps} />;
            case 'classic':
            default:
                return <ClassicTemplate {...templateProps} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!resume) {
        return null;
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-100">
            <div className="max-w-6xl mx-auto">
                {/* Action Bar */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{resume.title}</h1>
                        <p className="text-sm text-gray-600">Template: {resume.template}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/resumes/edit/${id}`)}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={downloadPDF}
                            disabled={downloading}
                            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
                        </button>
                        <button
                            onClick={() => navigate('/resumes')}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Resume Preview */}
                <div className="bg-gray-200 p-8 rounded-xl">
                    <div ref={resumeRef} className="mx-auto">
                        {renderTemplate()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;
