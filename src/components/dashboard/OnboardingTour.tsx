'use client';

import { useEffect, useState } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

export function OnboardingTour() {
    const [run, setRun] = useState(false);

    useEffect(() => {
        // Run only once per user browser
        const hasSeenTour = localStorage.getItem('ultraAdvisor_tour_v1');
        if (!hasSeenTour) {
            setRun(true);
            localStorage.setItem('ultraAdvisor_tour_v1', 'true');
        }
    }, []);

    const steps: Step[] = [
        {
            target: 'body',
            placement: 'center',
            content: (
                <div className="text-left">
                    <h2 className="text-xl font-bold text-white mb-2">Bem-vindo ao Ultra Advisor! 🚀</h2>
                    <p className="text-white/80 text-sm">
                        Vamos te dar um tour rápido para você extrair o máximo dos nossos frameworks de IA e disparar sua produtividade.
                    </p>
                </div>
            ),
            disableBeacon: true,
        },
        {
            target: '#tour-context',
            placement: 'bottom',
            content: (
                <div className="text-left">
                    <h3 className="text-lg font-bold text-emerald-400 mb-2">📍 Comece pelo Contexto</h3>
                    <p className="text-gray-400">
                        Crie o seu &quot;Context Wizard&quot;. Ele vai extrair as informações vitais da sua empresa ou cliente para que a IA te entenda perfeitamente. Faça isso antes de usar prompts complexos!
                    </p>
                </div>
            ),
        },
        {
            target: '#tour-prompts',
            placement: 'bottom',
            content: (
                <div className="text-left">
                    <h3 className="text-lg font-bold text-blue-400 mb-2">🧠 Biblioteca de Prompts</h3>
                    <p className="text-white/80 text-sm">
                        Acesse dezenas de frameworks validados para diversas situações. É só escolher, copiar e colar no ChatGPT, Claude ou outra IA de sua preferência.
                    </p>
                </div>
            ),
        },
        {
            target: '#tour-prompts',
            placement: 'top',
            content: (
                <div className="text-left">
                    <h3 className="text-lg font-bold text-orange-400 mb-2">💡 Dica de Ouro para Iniciantes</h3>
                    <p className="text-white/80 text-sm mb-3">
                        Quer experimentar o poder da plataforma agora mesmo sem precisar de muito contexto estruturado?
                    </p>
                    <p className="text-white/80 text-sm">
                        Procure na biblioteca pelos prompts: <br />
                        <strong className="text-orange-400">1. Second-Order Thinking</strong><br />
                        <strong className="text-orange-400">2. Catálogo de Erros de Iniciantes</strong>
                        <br /><br />
                        São excelentes pontos de partida!
                    </p>
                </div>
            ),
        }
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('ultraAdvisor_tour_v1', 'true');
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            locale={{
                back: 'Anterior',
                close: 'Fechar',
                last: 'Começar!',
                next: 'Próximo',
                skip: 'Pular tour'
            }}
            styles={{
                options: {
                    arrowColor: '#0F1F3D',
                    backgroundColor: '#0F1F3D',
                    overlayColor: 'rgba(0, 0, 0, 0.75)',
                    primaryColor: '#F97316',
                    textColor: '#FFFFFF',
                    zIndex: 1000,
                },
                tooltipContainer: {
                    textAlign: 'left'
                },
                buttonNext: {
                    backgroundColor: '#F97316',
                    borderRadius: '6px',
                    padding: '8px 16px',
                },
                buttonBack: {
                    color: '#9CA3AF',
                    marginRight: '10px'
                },
                buttonSkip: {
                    color: '#9CA3AF'
                }
            }}
        />
    );
}
