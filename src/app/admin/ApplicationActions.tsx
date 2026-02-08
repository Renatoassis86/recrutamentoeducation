"use client";

import { useState } from "react";
import { updateApplicationStatus } from "../actions";
import { Loader2, Check, X, MoreHorizontal } from "lucide-react";
import { Menu, Transition } from "@headlessui/react"; // We installed headlessui earlier
import { Fragment } from "react";

export default function ApplicationActions({ id, currentStatus }: { id: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (newStatus: string) => {
        if (confirm(`Tem certeza que deseja alterar o status para "${newStatus}"?`)) {
            setLoading(true);
            await updateApplicationStatus(id, newStatus);
            setLoading(false);
        }
    };

    if (loading) return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />;

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="flex items-center rounded-full bg-gray-100 p-2 text-gray-400 hover:text-gray-600">
                    <span className="sr-only">Opções</span>
                    <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => handleUpdate('under_review')}
                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } group flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    Marcar como Em Análise
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => handleUpdate('interview_invited')}
                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } group flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    Convidar para Entrevista
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => handleUpdate('approved')}
                                    className={`${active ? 'bg-green-50 text-green-900' : 'text-green-700'
                                        } group flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    Aprovar Candidato
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => handleUpdate('rejected')}
                                    className={`${active ? 'bg-red-50 text-red-900' : 'text-red-700'
                                        } group flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    Rejeitar Candidatura
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
