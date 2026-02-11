import { z } from "zod";

export const areasEnum = ["Língua Portuguesa", "Matemática", "História", "Geografia", "Ciências", "Arte", "Música"] as const;

// Visual identity colors for reference (not used in schema but good for docs)
// Primary: #F4B400 (Amber 500)
// Secondary: #1a202c (Slate 900)

// --- Declarations ---
export const declarationsSchema = z.object({
    declaration_private_nature: z.boolean().refine(val => val === true, "Obrigatório"),
    declaration_availability: z.boolean().refine(val => val === true, "Obrigatório"),
    declaration_copyright: z.boolean().refine(val => val === true, "Obrigatório"),
    declaration_institutional_alignment: z.boolean().refine(val => val === true, "Obrigatório"),
});

export type DeclarationsFormData = z.infer<typeof declarationsSchema>;

// --- Documents ---
export const documentSchema = z.object({
    // Client-side file validation is handled in the component
});

// --- Personal & Profile ---
export const personalSchema = z.object({
    full_name: z.string()
        .min(3, "Nome completo é obrigatório")
        .refine(val => val.trim().split(/\s+/).length >= 2, "Por favor, insira seu nome completo (nome e sobrenome)"),
    lattes_url: z.string().url("URL inválida").optional().or(z.literal("")).or(z.null()),

    cpf: z.string().min(11, "CPF incompleto").max(14, "CPF inválido").transform(val => val.replace(/\D/g, '')).refine((val) => val.length === 11, "CPF deve ter 11 dígitos"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(10, "Telefone inválido (mínimo 10 dígitos)"),
    city: z.string().min(2, "Cidade obrigatória"),
    state: z.string().length(2, "Sigla do estado (UF) inválida"),

    // Profile Type
    profile_type: z.enum(["licenciado", "pedagogo"]),

    // Conditional logic
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
    message: "Preencha a área de atuação válida para seu perfil",
    path: ["profile_type"],
});

export type PersonalFormData = z.infer<typeof personalSchema>;
// Alias for backward compatibility if needed, though mostly PersonalFormData covers it
export type ProfileTypeData = PersonalFormData;

// --- Education ---
export const educationSchema = z.object({
    graduation_course: z.string().min(3, "Curso de graduação obrigatório"),
    graduation_institution: z.string().min(3, "Instituição obrigatória"),
    graduation_year: z.coerce.number().min(1950, "Ano inválido").max(new Date().getFullYear(), "Ano inválido"),
    postgrad_areas: z.array(z.string()).optional(),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// --- Experience ---
export const experienceSchema = z.object({
    experience_years: z.enum(["Até 2 anos", "3 a 5 anos", "6 a 10 anos", "Mais de 10 anos"]),
    experience_summary: z.string().optional(),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

// --- Full Application (just a composition for reference) ---
export const applicationSchema = z.intersection(
    personalSchema,
    z.intersection(educationSchema, experienceSchema)
);

export type ApplicationFormData = z.infer<typeof applicationSchema>;
