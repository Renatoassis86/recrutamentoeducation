import { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className={className}>
                <label htmlFor={props.id || props.name} className="block text-sm font-medium leading-6 text-gray-900">
                    {label}
                </label>
                <div className="mt-2">
                    <input
                        ref={ref}
                        className={clsx(
                            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-base sm:text-sm sm:leading-6",
                            error && "ring-red-300 focus:ring-red-500"
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);
FormInput.displayName = "FormInput";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className={className}>
                <label htmlFor={props.id || props.name} className="block text-sm font-medium leading-6 text-gray-900">
                    {label}
                </label>
                <div className="mt-2">
                    <textarea
                        ref={ref}
                        className={clsx(
                            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-base sm:text-sm sm:leading-6",
                            error && "ring-red-300 focus:ring-red-500"
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);
FormTextarea.displayName = "FormTextarea";
