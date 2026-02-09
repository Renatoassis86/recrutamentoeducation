import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col">
            <LandingNav />

            <main className="flex-grow pt-48 pb-24">
                <article className="mx-auto max-w-4xl px-6 lg:px-8">

                    {/* Header */}
                    <header className="mb-12 border-b border-slate-200 pb-12">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif mb-6 leading-tight">
                            Política de Privacidade e Termos
                        </h1>
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg prose-slate text-gray-700 leading-relaxed max-w-none text-justify">
                        <p>
                            A sua privacidade é importante para nós. É política da Cidade Viva Education respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar em nosso site e outros sites que possuímos e operamos.
                        </p>
                        <p>
                            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemos por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
                        </p>
                        <p>
                            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                        </p>
                        <p>
                            Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
                        </p>
                        <p>
                            O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
                        </p>
                        <p>
                            Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
                        </p>
                        <p>
                            O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.
                        </p>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
