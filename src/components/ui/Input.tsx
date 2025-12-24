import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                className={`
                    w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white
                    placeholder:text-gray-400
                    transition-all duration-200
                    ${error ? 'border-red-500 focus:ring-red-200' : ''}
                    ${className}
                `}
                {...props}
            />
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    );
};
