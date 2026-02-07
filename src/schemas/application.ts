import { z } from "zod";

export const areasEnum = ["Língua Portuguesa", "Matemática", "História", "Geografia", "Ciências", "Arte"] as const;

export const personalSchema = z.object({
    full_name: z.string().min(3, "Nome completo é obrigatório"),
    email: z.string().email("Email inválido"), // Read-only mostly
    phone: z.string().min(10, "Telefone inválido (mínimo 10 dígitos)"),
    city: z.string().min(2, "Cidade obrigatória"),
    state: z.string().length(2, "Sigla do estado (UF) inválida"),

    // Profile Type
    profile_type: z.enum(["licenciado", "pedagogo"], {
        required_error: "Selecione um perfil",
    }),

    // Conditional logic handled in UI validation or refinement
    licensure_area: z.string().optional(), // For Licenciado (single)
    pedagogy_areas: z.array(z.string()).optional(), // For Pedagogo (multiple)
}).refine((data) => {
    if (data.profile_type === 'licenciado' && !data.licensure_area) {
        return false;
    }
    if (data.profile_type === 'pedagogo' && (!data.pedagogy_areas || data.pedagogy_areas.length === 0)) {
        return false;
    }
    return true;
}, {
    message: "Preencha a área de atuação específica para seu perfil",
    path: ["profile_type"],
});

export type PersonalFormData = z.infer<typeof personalSchema>;
export type ProfileTypeData = z.infer<typeof profileTypeSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
