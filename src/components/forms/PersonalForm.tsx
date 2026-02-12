"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalSchema, PersonalFormData, areasEnum } from "@/schemas/application";
import { FormInput } from "@/components/ui/form-elements";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatCPF } from "@/utils/format";

interface PersonalFormProps {
    onSave: (data: PersonalFormData) => Promise<void>;
}

export default function PersonalForm({ onSave }: PersonalFormProps) {
    const [loadingInfo, setLoadingInfo] = useState(true);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
        reset
    } = useForm<PersonalFormData>({
        resolver: zodResolver(personalSchema),
    });

    const profileType = useWatch({ control, name: "profile_type" });

    useEffect(() => {
        async function loadProfile() {
            setLoadingInfo(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setValue("email", user.email || "");

                const { data: profile } = await supabase
                    .from("applications")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (profile) {
                    reset({
                        ...profile,
                        licensure_area: profile.licensure_area || "",
                        pedagogy_areas: profile.pedagogy_areas || [],
                        full_name: profile.full_name || "",
                        cpf: profile.cpf ? formatCPF(profile.cpf) : "",
                        phone: profile.phone || "",
                        city: profile.city || "",
                        state: profile.state || "",
                    } as any);
                } else {
                    // Pre-fill email/name if avail from auth meta
                    setValue("full_name", user.user_metadata.full_name || "");
                }
            }
            setLoadingInfo(false);
        }
        loadProfile();
    }, [reset, setValue]);

    if (loadingInfo) return <div className="text-center py-4">Carregando informações...</div>;

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-8">
            {/* Personal Data */}
            <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">Informações Pessoais</h3>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                    <FormInput
                        label="Nome Completo"
                        {...register("full_name")}
                        required
                        error={errors.full_name?.message}
                        className="sm:col-span-3"
                    />
                    <FormInput
                        label="CPF"
                        {...register("cpf")}
                        required
                        onChange={(e) => {
                            e.target.value = formatCPF(e.target.value);
                            register("cpf").onChange(e);
                        }}
                        error={errors.cpf?.message}
                        placeholder="000.000.000-00"
                        className="sm:col-span-3"
                    />
                    <FormInput
                        label="Email"
                        {...register("email")}
                        error={errors.email?.message}
                        readOnly
                        className="sm:col-span-3 bg-gray-50"
                    />
                    <FormInput
                        label="Telefone (WhatsApp)"
                        {...register("phone")}
                        required
                        error={errors.phone?.message}
                        placeholder="(00) 00000-0000"
                        className="sm:col-span-3"
                    />
                    <div className="sm:col-span-3 grid grid-cols-2 gap-4">
                        <FormInput
                            label="Cidade"
                            {...register("city")}
                            required
                            error={errors.city?.message}
                        />
                        <FormInput
                            label="Estado (UF)"
                            {...register("state")}
                            required
                            error={errors.state?.message}
                            placeholder="Ex: SP"
                            maxLength={2}
                        />
                    </div>

                    <FormInput
                        label="Currículo Lattes (Opcional)"
                        {...register("lattes_url")}
                        error={errors.lattes_url?.message}
                        placeholder="https://lattes.cnpq.br/..."
                        className="sm:col-span-6"
                    />
                </div>
            </div>

            {/* Profile Selection */}
            <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900 border-t pt-8">Perfil de Participação</h3>
                <p className="mt-1 text-sm text-gray-500">Selecione o perfil no qual deseja se inscrever.</p>

                <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="licenciado" {...register("profile_type")} className="h-4 w-4 border-gray-300 text-amber-600 focus:ring-amber-600" />
                            <span className="text-sm font-medium text-gray-900">Licenciatura ou Bacharelado (Área da Graduação)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="pedagogo" {...register("profile_type")} className="h-4 w-4 border-gray-300 text-amber-600 focus:ring-amber-600" />
                            <span className="text-sm font-medium text-gray-900">Pedagogo (Área de Interesse)</span>
                        </label>
                    </div>
                    {errors.profile_type && <p className="text-red-500 text-sm">{errors.profile_type.message}</p>}
                </div>

                {/* Dynamic Fields */}
                <div className="mt-6">
                    {profileType === 'licenciado' && (
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Área da Licenciatura (Selecione uma)</label>
                            <select {...register("licensure_area")} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-amber-600 sm:text-sm sm:leading-6">
                                <option value="">Selecione...</option>
                                {areasEnum.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                            {errors.licensure_area && <p className="text-red-500 text-sm mt-1">Selecione sua área de licenciatura</p>}
                        </div>
                    )}

                    {profileType === 'pedagogo' && (
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Áreas de Interesse (Selecione uma ou mais)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {areasEnum.map(area => (
                                    <label key={area} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            value={area}
                                            {...register("pedagogy_areas")}
                                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                                        />
                                        <span className="text-sm text-gray-700">{area}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.pedagogy_areas && <p className="text-red-500 text-sm mt-1">Selecione ao menos uma área</p>}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-x-4 border-t pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 disabled:opacity-50"
                >
                    {isSubmitting ? "Salvando..." : "Salvar e Continuar"}
                </button>
            </div>
        </form>
    );
}
