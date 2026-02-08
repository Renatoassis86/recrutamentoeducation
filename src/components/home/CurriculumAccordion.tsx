"use client";

import { useState } from "react";
import { BookOpen, Code2, Anchor, Microscope, Palette, Laptop, Globe, ChevronDown, ChevronUp } from "lucide-react";

const curriculumItems = [
    {
        title: "Português",
        icon: BookOpen,
        color: "amber-600",
        description: "Ênfase na oralidade, aquisição de rico vocabulário e alfabetização pelo método fônico. A palavra como ferramenta de pensamento e expressão."
    },
    {
        title: "Matemática",
        icon: Code2,
        color: "blue-600",
        description: "Clareza, ordem e progressão lógica. O desenvolvimento do raciocínio estruturado para a compreensão da realidade criada."
    },
    {
        title: "Humanidades",
        icon: Anchor,
        color: "amber-700",
        description: "História, cultura e identidade. O aluno se reconhece como herdeiro de uma tradição e agente na sociedade."
    },
    {
        title: "Ciências",
        icon: Microscope,
        color: "green-600",
        description: "Leitura ordenada da Criação. O estudo da natureza revela a sabedoria do Criador e desperta o assombro investigativo."
    },
    {
        title: "Arte e Música",
        icon: Palette,
        color: "purple-500",
        description: "Formação do senso estético e da imaginação moral. A beleza educando os afetos e elevando o espírito."
    },
    {
        title: "Ed. Tecnológica",
        icon: Laptop,
        color: "cyan-500",
        description: "Uso consciente e formativo da técnica. A tecnologia como serva do propósito humano, não como fim em si mesma."
    },
    {
        title: "Inglês",
        icon: Globe,
        color: "red-500",
        description: "Bilinguismo a serviço da cultura e do pensamento. Acesso às grandes obras e comunicação global sem perder a identidade local."
    }
];

export default function CurriculumAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {curriculumItems.map((item, index) => {
                const isOpen = openIndex === index;
                const Icon = item.icon;

                return (
                    <div
                        key={index}
                        className={`bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden ${isOpen ? 'ring-2 ring-amber-500/20 shadow-md' : 'border-slate-100 hover:border-amber-200'}`}
                    >
                        <button
                            onClick={() => toggleItem(index)}
                            className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg bg-slate-50 group-hover:bg-${item.color.split('-')[0]}-50 transition-colors`}>
                                    <Icon className={`h-6 w-6 text-slate-500 group-hover:text-${item.color} transition-colors`} />
                                </div>
                                <h3 className={`font-bold text-lg ${isOpen ? 'text-amber-600' : 'text-slate-900'} transition-colors`}>
                                    {item.title}
                                </h3>
                            </div>
                            {isOpen ? (
                                <ChevronUp className="h-5 w-5 text-amber-500" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-slate-300 group-hover:text-amber-400" />
                            )}
                        </button>

                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="px-6 pb-6 pt-0">
                                <p className="text-sm text-gray-600 leading-relaxed border-t border-slate-100 pt-4">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
