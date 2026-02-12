"use client";

import { useState, useEffect } from "react";
import Steps from "@/components/ui/steps";
import PersonalForm from "@/components/forms/PersonalForm";
import EducationForm from "@/components/forms/EducationForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import DocumentUpload from "@/components/forms/DocumentUpload";
import DeclarationsForm from "@/components/forms/DeclarationsForm";
import EditorialTerm from "@/components/forms/EditorialTerm";
import ReviewStep from "@/components/forms/ReviewStep";
import SuccessView from "@/components/forms/SuccessView";
import { saveProfile, saveEducation, saveExperience, saveDeclarations, submitApplication } from "./actions";
import { PersonalFormData, EducationFormData, ExperienceFormData } from "@/schemas/application";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const initialSteps = [
    { id: '1', name: 'Leitura de Editais', status: 'current' },
    { id: '2', name: 'Dados Pessoais', status: 'upcoming' },
    { id: '3', name: 'Formação', status: 'upcoming' },
    { id: '4', name: 'Experiência', status: 'upcoming' },
    { id: '5', name: 'Declarações', status: 'upcoming' },
    { id: '6', name: 'Documentos', status: 'upcoming' },
    { id: '7', name: 'Revisão e Envio', status: 'upcoming' },
];

export default function ApplicationPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<any[]>(initialSteps);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                router.push('/login');
                return;
            }

            // State Restoration Logic
            const { data: app } = await supabase
                .from("applications")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (app) {
                // If already received/submitted, redirect to dashboard
                // Removed redirect for 'received' status to allow updates at any time
                if (app.status === 'under_review') {
                    router.push('/dashboard');
                    return;
                }

                // Restore step based on data presence
                // This is a simple heuristic, can be improved relative to specific fields
                let restoredStep = 0;
                if (app.terms_accepted) { // Assuming terms are saved in declarations or similar, but wait, steps 0 is local state usually?
                    // actually editorial term usually just advances 0->1 in local.
                    // If we have an app record, we at least passed step 1 (Personal) because otherwise record wouldn't exist (saveProfile creates it)
                    restoredStep = 1;

                    if (app.graduation_course) restoredStep = 2;
                    if (app.experience_years) restoredStep = 3;
                    if (app.terms_accepted) restoredStep = 4; // Declarations
                    // For documents (step 5), we check documents table
                    const { count } = await supabase.from("documents").select("*", { count: 'exact', head: true }).eq("application_id", app.id);
                    if (count && count > 0) restoredStep = 5;

                    // If we are at 5 (Documents) but user clicks continue, they go to 6 (Review)
                    // Because document upload is "Save and Continue" now, we can assume if they have docs, they might be ready for review.
                    // But let's be safe and put them at the latest confirmed step.
                    // If they have docs, let's put them at Review (6) or Documents (5)?
                    // Let's put them at proper step index.

                    // Current mapping:
                    // 0: Termos (No DB save usually, just local? We need to assume if App exists, Terms were accepted? Or just force re-read?)
                    // Actually Step 0 (Termos) calls updateSteps(0) -> sets step 1 current.
                    // Saving Personal calls saveProfile -> creates DB record.
                    // So if DB record exists, we are at least at Step 1 (Personal saved) -> Step 2 (Education).

                    if (app.id) restoredStep = 2; // Personal done, go to Education
                    if (app.graduation_course && app.graduation_institution) restoredStep = 3; // Education done, go to Experience
                    if (app.experience_years) restoredStep = 4; // Experience done, go to Declarations
                    if (app.terms_accepted) restoredStep = 5; // Declarations done, go to Documents
                    if (count && count >= 3 && app.lattes_url) restoredStep = 6; // Docs done, go to Review
                }

                // Update steps array visual state
                setSteps(prev => {
                    const newSteps = [...prev];
                    for (let i = 0; i < restoredStep; i++) {
                        newSteps[i].status = 'complete';
                    }
                    newSteps[restoredStep].status = 'current';
                    return newSteps;
                });
                setCurrentStep(restoredStep);
            }

            setIsLoading(false);
        };
        checkUser();
    }, [router, supabase]);

    const updateSteps = (currentIndex: number) => {
        setSteps(prev => {
            const newSteps = [...prev];
            // Mark current as complete
            if (newSteps[currentIndex]) {
                newSteps[currentIndex].status = 'complete';
            }
            // Mark next as current
            if (newSteps[currentIndex + 1]) {
                newSteps[currentIndex + 1].status = 'current';
            }
            return newSteps;
        });
        setCurrentStep(currentIndex + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[currentStep].status = 'upcoming';
                newSteps[currentStep - 1].status = 'current';
                return newSteps;
            });
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    // Step 0: Termos
    const handleEditorialAgree = () => {
        updateSteps(0);
    };

    // Step 1: Personal
    const handlePersonalSave = async (data: PersonalFormData) => {
        const res = await saveProfile(data);
        if (res?.error) { alert(res.error); return; }
        updateSteps(1);
    };

    // Step 2: Education
    const handleEducationSave = async (data: EducationFormData) => {
        const res = await saveEducation(data);
        if (res?.error) { alert(res.error); return; }
        updateSteps(2);
    };

    // Step 3: Experience
    const handleExperienceSave = async (data: ExperienceFormData) => {
        const res = await saveExperience(data);
        if (res?.error) { alert(res.error); return; }
        updateSteps(3);
    };

    // Step 4: Declarations
    const handleDeclarationsSave = async (data: any) => {
        const res = await saveDeclarations(data);
        if (res?.error) { alert(res.error); return; }
        updateSteps(4);
    };

    // Step 5: Documents
    const handleDocumentComplete = () => {
        updateSteps(5); // Move to Review
    };

    // Step 6: Review & Final Submit
    // Step 6: Review & Final Submit
    const handleSubmitApplication = async () => {
        const res = await submitApplication();
        if (res?.error) {
            alert("Erro ao enviar inscrição: " + res.error);
            return;
        }
        // Show Success View
        setCurrentStep(7);
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-amber-600" /></div>;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 font-serif">
                    Inscrição de Autores
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Cidade Viva Education - Chamada Oficial 2026
                </p>
            </div>

            <div className="mb-8 overflow-x-auto">
                <Steps steps={steps} />
            </div>

            <div className="">
                {currentStep === 0 && (
                    <div className="mx-auto max-w-4xl">
                        <EditorialTerm onNext={handleEditorialAgree} />
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6 mx-auto max-w-4xl border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Dados Pessoais e Áreas</h2>
                        <PersonalForm onSave={handlePersonalSave} />
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6 mx-auto max-w-4xl border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Formação Acadêmica</h2>
                        <EducationForm onSave={handleEducationSave} onBack={handleBack} />
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6 mx-auto max-w-4xl border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Experiência Profissional</h2>
                        <ExperienceForm onSave={handleExperienceSave} onBack={handleBack} />
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6 mx-auto max-w-4xl border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Declarações Obrigatórias</h2>
                        <DeclarationsForm onSave={handleDeclarationsSave} onBack={handleBack} />
                    </div>
                )}

                {currentStep === 5 && (
                    <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6 mx-auto max-w-4xl border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Documentos Complementares</h2>
                        <DocumentUpload onComplete={handleDocumentComplete} onBack={handleBack} />
                    </div>
                )}

                {currentStep === 6 && (
                    <div className="mx-auto max-w-4xl">
                        <ReviewStep onBack={handleBack} onSubmit={handleSubmitApplication} />
                    </div>
                )}

                {currentStep === 7 && (
                    <SuccessView />
                )}
            </div>
        </div>
    );
}
