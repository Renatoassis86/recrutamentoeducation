export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    role: 'candidate' | 'admin'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    role?: 'candidate' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    role?: 'candidate' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
            }
            applications: {
                Row: {
                    id: string
                    user_id: string
                    status: 'received' | 'under_review' | 'info_requested' | 'interview_invited' | 'closed'
                    full_name: string
                    email: string
                    phone: string | null
                    city: string | null
                    state: string | null
                    profile_type: 'licenciado' | 'pedagogo'
                    licensure_area: string | null
                    pedagogy_areas: string[] | null
                    graduation_course: string | null
                    graduation_institution: string | null
                    graduation_year: number | null
                    postgrad_areas: string[] | null
                    experience_years: string | null
                    experience_summary: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    status?: 'received' | 'under_review' | 'info_requested' | 'interview_invited' | 'closed'
                    full_name: string
                    email: string
                    phone?: string | null
                    city?: string | null
                    state?: string | null
                    profile_type: 'licenciado' | 'pedagogo'
                    licensure_area?: string | null
                    pedagogy_areas?: string[] | null
                    graduation_course?: string | null
                    graduation_institution?: string | null
                    graduation_year?: number | null
                    postgrad_areas?: string[] | null
                    experience_years?: string | null
                    experience_summary?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    status?: 'received' | 'under_review' | 'info_requested' | 'interview_invited' | 'closed'
                    full_name?: string
                    email?: string
                    phone?: string | null
                    city?: string | null
                    state?: string | null
                    profile_type?: 'licenciado' | 'pedagogo'
                    licensure_area?: string | null
                    pedagogy_areas?: string[] | null
                    graduation_course?: string | null
                    graduation_institution?: string | null
                    graduation_year?: number | null
                    postgrad_areas?: string[] | null
                    experience_years?: string | null
                    experience_summary?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            documents: {
                Row: {
                    id: string
                    application_id: string
                    user_id: string
                    storage_path: string
                    original_name: string
                    mime_type: string
                    size_bytes: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    application_id: string
                    user_id: string
                    storage_path: string
                    original_name: string
                    mime_type: string
                    size_bytes: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    application_id?: string
                    user_id?: string
                    storage_path?: string
                    original_name?: string
                    mime_type?: string
                    size_bytes?: number
                    created_at?: string
                }
            }
        }
    }
}
