const LoadingSpinner = ({ size = 'md' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`relative ${sizes[size]}`}>
                {/* Outer ring */}
                <div className={`absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900/50`} />
                {/* Spinning ring */}
                <div
                    className={`absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-400 animate-spin`}
                    style={{ animationDuration: '0.8s' }}
                />
                {/* Inner accent dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 animate-bounce-sm" />
                </div>
            </div>
            {size === 'lg' && (
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
                    Loading...
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
