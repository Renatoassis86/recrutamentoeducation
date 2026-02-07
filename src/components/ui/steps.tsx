import { Check } from "lucide-react";

interface StepsProps {
    steps: { id: string; name: string; status: 'current' | 'upcoming' | 'complete' }[];
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Steps({ steps }: StepsProps) {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="overflow-hidden bg-white rounded-md lg:border lg:border-gray-200 lg:flex lg:rounded-none">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'lg:border-r lg:border-gray-200' : '', 'relative overflow-hidden lg:flex-1')}>
                        <div className={classNames(stepIdx !== 0 ? 'lg:border-l lg:border-gray-200' : '', 'group flex items-center w-full')}>
                            <span className="flex items-center px-6 py-4 text-sm font-medium">
                                <span className="flex-shrink-0">
                                    {step.status === 'complete' ? (
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 group-hover:bg-blue-800">
                                            <Check className="h-6 w-6 text-white" aria-hidden="true" />
                                        </span>
                                    ) : step.status === 'current' ? (
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600">
                                            <span className="text-blue-600">{stepIdx + 1}</span>
                                        </span>
                                    ) : (
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                                            <span className="text-gray-500 group-hover:text-gray-900">{stepIdx + 1}</span>
                                        </span>
                                    )}
                                </span>
                                <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                            </span>
                        </div>

                        {stepIdx !== 0 ? (
                            <>
                                <div className="absolute inset-0 top-0 left-0 hidden w-3 lg:block" aria-hidden="true">
                                    <svg
                                        className="h-full w-full text-gray-300"
                                        viewBox="0 0 12 82"
                                        fill="none"
                                        preserveAspectRatio="none"
                                    >
                                        <path d="M0.5 0V31L10.5 41L0.5 51V82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </>
                        ) : null}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
