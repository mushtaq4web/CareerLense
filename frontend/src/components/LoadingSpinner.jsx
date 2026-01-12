const LoadingSpinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-8 w-8 border-2',
        md: 'h-12 w-12 border-3',
        lg: 'h-16 w-16 border-4',
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-primary-600 border-b-primary-600 border-l-transparent border-r-transparent`}></div>
        </div>
    );
};

export default LoadingSpinner;
