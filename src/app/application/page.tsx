"use client";

import { useState } from "react";
import Steps from "@/components/ui/steps";
import PersonalForm from "@/components/forms/PersonalForm";
import EducationForm from "@/components/forms/EducationForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import DocumentUpload from "@/components/forms/DocumentUpload";
import DeclarationsForm from "@/components/forms/DeclarationsForm";
import { saveProfile, saveEducation, saveExperience, saveDeclarations } from "./actions";
import { PersonalFormData, EducationFormData, ExperienceFormData } from "@/schemas/application";

const initialSteps = [
    { id: '01', name: 'Dados Pessoais', status: 'current' },
    { id: '02', name: 'Formação', status: 'upcoming' },
    { id: '03', name: 'Experiência', status: 'upcoming' },
    { id: '04', name: 'Declarações', status: 'upcoming' }, // New Step
    { id: '05', name: 'Documentos', status: 'upcoming' },
];

export default function ApplicationPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<any[]>(initialSteps);

    const updateSteps = (currentIndex: number) => {
        setSteps(prev => {
            const newSteps = [...prev];
            newSteps[currentIndex].status = 'complete';
            if (newSteps[currentIndex + 1]) {
                newSteps[currentIndex + 1].status = 'current';
            }
            return newSteps;
        });
        setCurrentStep(currentIndex + 1);
    };

    const stepBack = () => {
        if (currentStep > 0) {
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[currentStep].status = 'upcoming';
                newSteps[currentStep - 1].status = 'current';
                return newSteps;
            });
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePersonalSave = async (data: PersonalFormData) => {
        const res = await saveProfile(data);
        if (res?.error) { alert(res.error); return; }
        updateSteps(0);
    };

    const handleEducationSave = async (data: EducationFormData) => {
        const res = await saveEducation(data);
        if (res?.error) { alert(res.error); return; }
        updateSteps(1);
    };

    const handleExperienceSave = async (data: ExperienceFormData) => {
        const res = await saveExperience(data);
        if (res?.error) { alert(res.error); return; }
        updateSteps(2);
    };

    const handleDeclarationsSave = async (data: any) => {
        const res = await saveDeclarations(data);
        if (res?.error) { alert(res.error); return; }
        updateSteps(3);
    };

    const handleDocumentComplete = () => {
        alert("Sua candidatura foi enviada com sucesso! Você receberá um email de confirmação.");
        window.location.href = '/dashboard';
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                    Inscrição - Chamada Editorial
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Sistema Cidade Viva Education
                </p>
            </div>

            <div className="mb-8">
                <Steps steps={steps} />
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    {currentStep === 0 && (
                        <PersonalForm onSave={handlePersonalSave} />
                    )}
                    {currentStep === 1 && (
                        <EducationForm onSave={handleEducationSave} onBack={stepBack} />
                    )}
                    {currentStep === 2 && (
                        <ExperienceForm onSave={handleExperienceSave} onBack={stepBack} />
                    )}
                    {currentStep === 3 && (
                        <DeclarationsForm onSave={handleDeclarationsSave} onBack={stepBack} />
                    )}
                    {currentStep === 4 && (
                        <DocumentUpload onComplete={handleDocumentComplete} onBack={stepBack} />
                    )}
                </div>
            </div>
        </div>
    );
}
