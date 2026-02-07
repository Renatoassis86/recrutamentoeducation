import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="mx-auto max-w-2xl text-center z-10 relative">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 pb-2">
            Chamada Editorial: Prospecção de Autores
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Junte-se à equipe de autores do Sistema Cidade Viva Education. Estamos em busca de educadores e especialistas apaixonados por criar materiais didáticos de excelência.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/login?signup=true"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Inscreva-se Agora
            </Link>
            <Link href="#processo" className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 group">
              Saiba mais <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Background blobs */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 sm:py-32" id="processo">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Oportunidade</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Por que ser um autor Cidade Viva?
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Faça parte de um projeto que impacta milhares de alunos, contribuindo com sua expertise para a formação de novas gerações.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <BookOpen className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Produção de Material Didático
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Desenvolva conteúdos para Ensino Fundamental e Médio, alinhados com a BNCC e a cosmovisão cristã.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Users className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Equipe Multidisciplinar
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Trabalhe em conjunto com editores, pedagogos e designers para criar a melhor experiência de aprendizado.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Processo Seletivo Transparente
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Acompanhe todas as etapas da sua candidatura através da nossa plataforma, desde a inscrição até a aprovação final.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para começar?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Crie sua conta, preencha seu perfil e envie sua candidatura hoje mesmo.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/login?signup=true"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Criar Conta
              </Link>
              <Link href="/login" className="text-sm font-semibold leading-6 text-white">
                Já tenho conta <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} Sistema Cidade Viva Education. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
