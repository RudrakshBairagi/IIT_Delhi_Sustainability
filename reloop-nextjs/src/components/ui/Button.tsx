import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'relative font-extrabold uppercase tracking-wider border border-outline-variant/10 dark:border-gray-600 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-dark shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-primary/90',
        secondary: 'bg-dark text-white dark:bg-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-dark/90',
        outline: 'bg-white dark:bg-dark-surface text-dark dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-gray-50 dark:hover:bg-dark-bg',
        danger: 'bg-red-500 text-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-red-600',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm rounded-xl',
        md: 'px-6 py-3 text-base rounded-2xl',
        lg: 'px-8 py-4 text-lg rounded-2xl',
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
