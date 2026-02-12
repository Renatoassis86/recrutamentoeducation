"use client";

import { useState } from "react";
import { updateApplicationStatus } from "@/app/admin/actions";
import {
    MoreHorizontal, MapPin, GraduationCap,
    BookOpen, Calendar, ArrowRight, Loader2,
    CheckCircle2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function KanbanBoard({ initialApplications, columns }: { initialApplications: any[], columns: any[] }) {
    const [applications, setApplications] = useState(initialApplications);
    const [movingId, setMovingId] = useState<string | null>(null);

    const handleMove = async (id: string, newStatus: string) => {
        setMovingId(id);
        const res = await updateApplicationStatus(id, newStatus) as any;
        if (res.success) {
            if (res.message) {
                alert(res.message);
            } else {
                setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
            }
        } else {
            alert("Erro ao mover: " + (res.error || "Tente novamente."));
        }
        setMovingId(null);
    };

    return (
        <div className="flex gap-6 h-full min-w-max px-2">
            {columns.map(col => {
                const colApps = applications.filter(app => {
                    if (col.id === 'received') {
                        return app.status === 'received';
                    }
                    return app.status === col.id;
                });

                return (
                    <div key={col.id} className="w-80 flex flex-col bg-slate-50/50 rounded-3xl border border-slate-100 p-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-slate-900 text-sm uppercase tracking-tighter">{col.name}</h3>
                                <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                                    {colApps.length}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                            {colApps.map(app => (
                                <div key={app.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all relative">
                                    {movingId === app.id && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                                            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`h-2 w-10 rounded-full ${app.profile_type === 'licenciado' ? 'bg-amber-400' : 'bg-slate-800'
                                            }`} />

                                        <Menu as="div" className="relative">
                                            <Menu.Button className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Menu.Button>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-20 mt-1 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none p-2 border border-slate-100">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase px-3 py-2 border-b border-slate-50 mb-1">Mover para:</div>
                                                    {columns.filter(c => c.id !== app.status).map(c => (
                                                        <Menu.Item key={c.id}>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={() => handleMove(app.id, c.id)}
                                                                    className={`${active ? 'bg-amber-50 text-amber-700' : 'text-slate-600'
                                                                        } group flex w-full items-center px-3 py-2 text-xs font-bold rounded-lg transition-colors`}
                                                                >
                                                                    <ArrowRight className="mr-2 h-3.5 w-3.5 opacity-50" />
                                                                    {c.name}
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    ))}
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>

                                    <Link href={`/admin/candidates/${app.id}`} className="block group/link">
                                        <h4 className="font-bold text-slate-900 leading-tight group-hover/link:text-amber-600 transition-colors truncate">
                                            {app.full_name}
                                        </h4>
                                        <div className="mt-2 space-y-1.5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                <MapPin className="h-3 w-3" /> {app.city}, {app.state}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                {app.profile_type === 'licenciado' ? <BookOpen className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                                                {app.licensure_area || 'Pedagogia'}
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[9px] font-black text-slate-300 uppercase">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </span>
                                        {app.overall_score > 0 && (
                                            <div className="flex items-center gap-1 text-[10px] font-black text-amber-600">
                                                <Star className="h-3 w-3 fill-amber-600" /> {app.overall_score}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {colApps.length === 0 && (
                                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl opacity-40">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Vazio</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function Star(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
