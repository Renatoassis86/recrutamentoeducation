import { Settings as SettingsIcon, Bell, Lock, Database, Globe, Shield } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif flex items-center gap-3">
                        <SettingsIcon className="h-8 w-8 text-amber-500" /> Configurações
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Gerencie as preferências globais e configurações do sistema Paideia.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                            <Globe className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Geral</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Idioma e fuso horário</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Título do Sistema</label>
                            <input type="text" defaultValue="Cidade Viva Education - Recrutamento" className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status do Chamamento</label>
                            <select className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500">
                                <option>Aberto (Recebendo Inscrições)</option>
                                <option>Fechado (Apenas Leitura)</option>
                                <option>Em Pausa</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                        <div className="p-3 bg-slate-900 text-amber-500 rounded-2xl">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Segurança</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Políticas de acesso e RLS</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <span className="text-xs font-bold text-slate-700">Múltiplas Inscrições por CPF</span>
                            <div className="h-6 w-11 bg-slate-200 rounded-full relative cursor-not-allowed">
                                <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <span className="text-xs font-bold text-slate-700">Exigir Login para Listagem</span>
                            <div className="h-6 w-11 bg-amber-500 rounded-full relative">
                                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Database Info */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6 md:col-span-2">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <Database className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Infraestrutura</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Conexão com Supabase</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Project ID</span>
                            <span className="text-xs font-mono font-bold text-slate-900 break-all">mhkyutqqciueevjnlsfy</span>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">API Endpoint</span>
                            <span className="text-xs font-mono font-bold text-slate-900 break-all">https://mhkyutqqciueevjnlsfy.supabase.co</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
