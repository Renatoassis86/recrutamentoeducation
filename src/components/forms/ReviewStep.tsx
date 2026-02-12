"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

interface ReviewStepProps {
    onBack: () => void;
    onSubmit: () => Promise<void>;
}

export default function ReviewStep({ onBack, onSubmit }: ReviewStepProps) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: app } = await supabase
                    .from("applications")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                // Get documents count
                const { count } = await supabase
                    .from("documents")
                    .select("*", { count: 'exact', head: true })
                    .eq("user_id", user.id);

                setData({ ...app, documentsCount: count });
            }
            setLoading(false);
        };
        loadData();
    }, []);

    const handleSubmit = async () => {
        setSubmitting(true);
        await onSubmit();
        setSubmitting(false);
    };

    if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin h-8 w-8 text-amber-600 mx-auto" /></div>;

    if (!data) return <div className="text-center py-10">Erro ao carregar dados.</div>;

    const Section = ({ title, children }: any) => (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">{title}</h3>
            {children}
        </div>
    );

    const Item = ({ label, value }: any) => (
        <div className="mb-3">
            <span className="block text-sm font-medium text-gray-500">{label}</span>
            <span className="block text-base text-gray-900 font-medium">{value || "-"}</span>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                    <h4 className="font-bold text-amber-800">Revisão Final</h4>
                    <p className="text-sm text-amber-700">Por favor, revise todos os seus dados com atenção. Você poderá atualizar seus documentos ou informações a qualquer momento através do seu painel de candidato.</p>
                </div>
            </div>

            <Section title="Dados Pessoais & Perfil">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Item label="Nome Completo" value={data.full_name} />
                    <Item label="Email" value={data.email} />
                    <Item label="CPF" value={data.cpf} />
                    <Item label="Telefone" value={data.phone} />
                    <Item label="Localização" value={`${data.city} - ${data.state}`} />
                    <Item label="Perfil" value={data.profile_type === 'licenciado' ? 'Licenciatura ou Bacharelado' : 'Pedagogo'} />
                    {data.profile_type === 'licenciado' && <Item label="Área de Licenciatura / Bacharelado" value={data.licensure_area} />}
                    {data.profile_type === 'pedagogo' && <Item label="Áreas de Interesse" value={data.pedagogy_areas?.join(", ")} />}
                </div>
            </Section>

            <Section title="Formação Acadêmica">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Item label="Graduação" value={data.graduation_course} />
                    <Item label="Instituição" value={data.graduation_institution} />
                    <Item label="Ano de Conclusão" value={data.graduation_year} />
                    <Item label="Pós-Graduações" value={data.postgrad_areas ? data.postgrad_areas.join(", ") : "Nenhuma"} />
                </div>
            </Section>

            <Section title="Experiência Profissional">
                <Item label="Tempo de Experiência" value={data.experience_years} />
                <Item label="Resumo Profissional" value={data.experience_summary} />
            </Section>

            <Section title="Documentação">
                <Item label="Link Lattes (Opcional)" value={data.lattes_url || "Não informado"} />
                <Item label="Arquivos Anexados" value={data.documentsCount === 1 ? "1 arquivo recebido" : `${data.documentsCount || 0} arquivos recebidos`} />
            </Section>

            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                    Voltar e Editar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-all disabled:opacity-70"
                >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                    {submitting ? "Enviando..." : "CONFIRMAR E ENVIAR INSCRIÇÃO"}
                </button>
            </div>
        </div>
    );
}
