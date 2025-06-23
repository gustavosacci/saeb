document.addEventListener('DOMContentLoaded', () => {
    // Log para confirmar que o script foi carregado e o DOM está pronto.
    console.log('✅ DOM Content Loaded! Script main.js iniciado.');

    // --- Variáveis de elementos DOM ---
    // Seletores para elementos chave do layout.
    const menuToggle = document.querySelector('.menu-toggle'); // Botão do menu hambúrguer
    const mainNav = document.querySelector('.main-nav');       // Elemento de navegação principal
    const navLinks = document.querySelectorAll('.nav-list .nav-link'); // Links dentro da navegação
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]'); // Todos os links com âncoras (ex: #descritores)

    // Seletores para as seções de conteúdo dinâmico.
    const contentSections = document.querySelectorAll('.content-section'); // Seções de conteúdo de cada descritor (e Sobre/Contato)
    const descritoresSection = document.getElementById('descritores');   // A seção principal de visão geral dos descritores

    // Verificações iniciais para elementos essenciais.
    if (!descritoresSection) {
        console.error('❌ Erro crítico: Elemento #descritores não encontrado. Verifique seu HTML.');
        return; // O script pode não funcionar corretamente sem este elemento.
    }
    if (contentSections.length === 0) {
        console.warn('⚠️ Atenção: Nenhuma seção com a classe .content-section encontrada. O conteúdo dos descritores pode não ser exibido.');
    }

    // --- Função Auxiliar: Obter Valores de Variáveis CSS ---
    // Permite que o JavaScript leia valores definidos no CSS (ex: cores).
    const getCssVar = (name) => {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    };

    // --- 1. Menu Responsivo (Hamburger) ---
    // Ativa a funcionalidade do menu hambúrguer para telas menores.
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            console.log('⚡ Menu toggle clicado!');
            mainNav.classList.toggle('nav-open');    // Adiciona/remove classe para abrir/fechar o menu
            menuToggle.classList.toggle('active');   // Altera o ícone do hambúrguer (animação)
            const isExpanded = menuToggle.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded); // Atualiza atributo de acessibilidade
        });

        // Fecha o menu ao clicar em um link (melhora a usabilidade em mobile).
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('nav-open')) {
                    mainNav.classList.remove('nav-open');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                }
            });
        });
    } else {
        console.warn('⚠️ Aviso: Botão do menu (.menu-toggle) ou navegação principal (.main-nav) não encontrados. O menu responsivo pode não funcionar.');
    }

    // --- 2. Rolagem Suave (Smooth Scrolling) ---
    // Implementa rolagem suave ao clicar em links de âncora na mesma página.
    allAnchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Procede apenas se o link for uma âncora local (começa com '#').
            if (href.startsWith('#')) {
                e.preventDefault(); // Impede o comportamento padrão de "salto" instantâneo.
                console.log('🔗 Link de rolagem suave clicado:', href);

                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0; // Obtém altura do cabeçalho para compensar.
                const targetElement = document.querySelector(href); // Encontra o elemento alvo da âncora.

                if (targetElement) {
                    // Calcula a posição de rolagem ajustada pela altura do cabeçalho e um offset visual.
                    const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    // Realiza a rolagem suave.
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.warn(`⚠️ Elemento alvo para rolagem suave não encontrado: ${href}`);
                }
            }
        });
    });

    // --- 3. Lógica para Mostrar/Esconder Seções de Conteúdo dos Descritores ---

    // Função para mostrar uma seção específica de conteúdo e esconder todas as outras.
    const showContentSection = (targetId) => {
        console.log(`➡️ Tentando mostrar a seção: ${targetId}`);
        // Esconde todas as seções de conteúdo marcadas com '.content-section'.
        contentSections.forEach(section => {
            section.style.display = 'none';
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.style.display = 'block'; // Mostra a seção alvo.
            console.log(`✅ Seção ${targetId} agora visível.`);
        } else {
            console.error(`❌ Erro: Não foi possível encontrar a seção alvo: ${targetId}. Verifique se o ID está correto no HTML.`);
        }
        // Garante que a seção principal de descritores seja escondida.
        descritoresSection.style.display = 'none';
    };

    // Função para mostrar a seção de visão geral dos descritores e esconder as seções de conteúdo.
    const showDescritoresOverview = () => {
        console.log('⬅️ Mostrando a visão geral dos descritores e escondendo conteúdo.');
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
        descritoresSection.style.display = 'block'; // Mostra a seção principal.
    };

    // Estado inicial ao carregar a página: mostra a visão geral dos descritores.
    showDescritoresOverview();

    // Event listeners para os botões "Explorar DXX" nos cards de descritores.
    document.querySelectorAll('.card-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Impede o comportamento padrão do link.
            const targetId = this.getAttribute('href'); // Obtém o ID da seção alvo.
            console.log('🖱️ Botão "Explorar DXX" clicado. Alvo:', targetId);
            showContentSection(targetId); // Exibe a seção de conteúdo do descritor.
            // Pequeno atraso para garantir que a seção esteja visível antes de rolar.
            setTimeout(() => {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 50);
        });
    });

    // Event listeners para os botões "Voltar para os Descritores" dentro das seções de conteúdo.
    document.querySelectorAll('.btn-back').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('↩️ Botão "Voltar para os Descritores" clicado.');
            showDescritoresOverview(); // Volta para a visão geral dos descritores.
            // Rola suavemente para a seção de descritores.
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Lógica para links do menu superior 'Sobre Nós' e 'Contato'.
    // Estes links também controlam a exibição de seções '.content-section'.
    document.querySelectorAll('.main-nav .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Verifica se o link é para as seções 'Sobre Nós' ou 'Contato'.
            if (href === '#about' || href === '#contact') {
                e.preventDefault(); // Impede o comportamento padrão do link.
                console.log(`Clicked link de navegação: ${href}`);
                showContentSection(href); // Mostra a seção de contato/sobre.
                // Pequeno atraso para rolagem suave.
                setTimeout(() => {
                    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
                }, 50);
            }
            // Se o link for para '#descritores', garante que a visão geral seja exibida.
            else if (href === '#descritores') {
                showDescritoresOverview();
            }
        });
    });

    // --- 4. Animações de Elementos ao Rolar (Intersection Observer) ---
    // Gerencia a adição de classes para animações quando elementos entram na viewport.
    const animatedElements = document.querySelectorAll('.animate-slide-up, .animate-fade-in, .animate-pulse');
    const observerOptions = {
        root: null,      // O viewport é o elemento raiz.
        rootMargin: '0px', // Nenhuma margem extra.
        threshold: 0.1   // A animação dispara quando 10% do elemento está visível.
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animation-active');
                // Para animações que devem ocorrer apenas uma vez (ex: entrada na tela).
                if (entry.target.classList.contains('animate-slide-up') || entry.target.classList.contains('animate-fade-in')) {
                    observer.unobserve(entry.target); // Deixa de observar o elemento.
                }
            }
        });
    }, observerOptions);

    // Observa cada elemento com as classes de animação.
    if (animatedElements.length > 0) {
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        console.warn('⚠️ Aviso: Nenhum elemento encontrado para animação de rolagem. Verifique as classes CSS de animação.');
    }

    // --- 5. Lógica dos Quizzes para os 3 Descritores ---
    // Dados das perguntas para cada quiz, organizados por ID do quiz.
    const quizzesData = {
        'quiz-d01': [
            {
                question: "No trecho: 'A poluição plástica nos oceanos é um problema grave que exige ação imediata de governos e cidadãos.', qual a tese principal?",
                options: [
                    "Oceanos estão poluídos por plástico.",
                    "Governos e cidadãos devem agir contra a poluição plástica nos oceanos.",
                    "A poluição plástica é um problema sério.",
                    "Ação imediata é necessária."
                ],
                correct: "Governos e cidadãos devem agir contra a poluição plástica nos oceanos."
            },
            {
                question: "Ao ler uma notícia sobre os benefícios da leitura, qual seria a provável tese do texto?",
                options: [
                    "Livros são caros.",
                    "Pessoas que leem são mais inteligentes.",
                    "A leitura traz diversos benefícios para o desenvolvimento pessoal.",
                    "É importante ler todos os dias."
                ],
                correct: "A leitura traz diversos benefícios para o desenvolvimento pessoal."
            },
            {
                question: "Qual a tese central da frase 'O uso excessivo de redes sociais pode prejudicar a saúde mental dos adolescentes'?",
                options: [
                    "Adolescentes usam muito redes sociais.",
                    "Redes sociais são ruins.",
                    "O uso excessivo de redes sociais impacta negativamente a saúde mental dos adolescentes.",
                    "A saúde mental dos adolescentes é frágil."
                ],
                correct: "O uso excessivo de redes sociais impacta negativamente a saúde mental dos adolescentes."
            }
        ],
        'quiz-d02': [
            {
                question: "Qual conectivo melhor completa a frase: 'Estudei muito, ____ passei na prova.'?",
                options: [
                    "portanto",
                    "mas",
                    "embora",
                    "porque"
                ],
                correct: "portanto"
            },
            {
                question: "Na frase 'Ele não compareceu à reunião, pois estava doente.', a palavra 'pois' indica:",
                options: [
                    "Consequência",
                    "Comparação",
                    "Explicação",
                    "Oposição"
                ],
                correct: "Explicação"
            },
            {
                question: "Em 'Adoro viajar; no entanto, prefiro lugares tranquilos.', 'no entanto' estabelece uma relação de:",
                options: [
                    "Adição",
                    "Causa",
                    "Conclusão",
                    "Oposição"
                ],
                correct: "Oposição"
            }
        ],
        'quiz-d03': [
            {
                question: "Se alguém diz que uma pessoa é 'prolixa', usando o contexto 'Sua fala era tão prolixa que cansou a todos', o que 'prolixa' provavelmente significa?",
                options: [
                    "Direta e clara",
                    "Objetiva e concisa",
                    "Com muitos detalhes e palavras desnecessárias",
                    "Emocionante e inspiradora"
                ],
                correct: "Com muitos detalhes e palavras desnecessárias"
            },
            {
                question: "Na frase 'O atleta exauriu-se após a corrida', o que se pode inferir sobre 'exauriu-se'?",
                options: [
                    "Sentiu-se muito feliz",
                    "Ficou sem energia, exausto",
                    "Ganhou a corrida",
                    "Sentiu dor"
                ],
                correct: "Ficou sem energia, exausto"
            },
            {
                question: "A expressão 'estar com a faca e o queijo na mão' significa, por inferência:",
                options: [
                    "Estar com fome",
                    "Ter todas as ferramentas para ter sucesso",
                    "Ser um cozinheiro habilidoso",
                    "Ter um piquenique"
                ],
                correct: "Ter todas as ferramentas para ter sucesso"
            }
        ]
    };

    // Função principal para configurar e rodar um quiz específico.
    function setupQuiz(quizId, questionsData) {
        const quizContainer = document.getElementById(quizId);
        if (!quizContainer) {
            console.error(`❌ Erro: Container do quiz com ID "${quizId}" não encontrado. O quiz não será carregado.`);
            return;
        }
        console.log(`⚙️ Inicializando quiz para ID: ${quizId}`); // Log de inicialização do quiz.

        let currentQuestionIndex = 0; // Índice da pergunta atual.
        let score = 0;                // Pontuação do quiz.

        // Renderiza a pergunta atual no quizContainer.
        const renderQuestion = () => {
            quizContainer.innerHTML = ''; // Limpa o conteúdo anterior do container do quiz.

            const question = questionsData[currentQuestionIndex];
            if (!question) {
                renderResults(); // Se não há mais perguntas, exibe os resultados.
                return;
            }

            const quizDiv = document.createElement('div');
            quizDiv.className = 'quiz-container';

            const questionText = document.createElement('p');
            questionText.className = 'quiz-question-text';
            questionText.textContent = `Pergunta ${currentQuestionIndex + 1}/${questionsData.length}: ${question.question}`;
            quizDiv.appendChild(questionText);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            // Cria um botão para cada opção de resposta.
            question.options.forEach((option, index) => {
                const optionButton = document.createElement('button');
                optionButton.className = 'quiz-option-btn';
                optionButton.textContent = option;
                optionButton.dataset.index = index; // Adiciona um atributo de dado para identificação.
                // Adiciona um listener para a função de tratamento de resposta ao clicar.
                optionButton.addEventListener('click', () => handleAnswer(option, question.correct, optionButton, optionsDiv));
                optionsDiv.appendChild(optionButton);
            });
            quizDiv.appendChild(optionsDiv);

            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'quiz-feedback'; // Div para exibir feedback (Correto/Incorreto).
            quizDiv.appendChild(feedbackDiv);

            const nextButton = document.createElement('button');
            nextButton.className = 'quiz-next-btn btn btn-secondary';
            nextButton.textContent = 'Próxima Pergunta →';
            nextButton.style.display = 'none'; // Escondido inicialmente até o usuário responder.
            nextButton.addEventListener('click', () => {
                currentQuestionIndex++; // Avança para a próxima pergunta.
                renderQuestion();       // Renderiza a próxima pergunta.
            });
            quizDiv.appendChild(nextButton);

            quizContainer.appendChild(quizDiv);
            console.log(`✔️ Quiz "${quizId}": Pergunta ${currentQuestionIndex + 1} renderizada.`);
        };

        // Trata a resposta do usuário.
        const handleAnswer = (selectedOption, correctAnswer, clickedButton, optionsContainer) => {
            const feedbackDiv = quizContainer.querySelector('.quiz-feedback');
            const nextButton = quizContainer.querySelector('.quiz-next-btn');

            // Desabilita todos os botões de opção após uma resposta ser dada.
            optionsContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
                btn.disabled = true;
            });

            if (selectedOption === correctAnswer) {
                score++; // Incrementa a pontuação se a resposta estiver correta.
                feedbackDiv.textContent = "Correto! 🎉";
                feedbackDiv.style.color = getCssVar('--color-success'); // Define a cor do feedback via CSS var.
                clickedButton.classList.add('correct'); // Adiciona classe para estilo de resposta correta.
                console.log(`👍 Quiz "${quizId}": Resposta correta.`);
            } else {
                feedbackDiv.textContent = `Incorreto. A resposta correta era: "${correctAnswer}"`;
                feedbackDiv.style.color = getCssVar('--color-error'); // Define a cor do feedback via CSS var.
                clickedButton.classList.add('incorrect'); // Adiciona classe para estilo de resposta incorreta.
                // Destaca a resposta correta para o usuário aprender.
                Array.from(optionsContainer.children).forEach(btn => {
                    if (btn.textContent === correctAnswer) {
                        btn.classList.add('correct-answer-highlight'); // Adiciona classe para destacar a resposta certa.
                    }
                });
                console.log(`👎 Quiz "${quizId}": Resposta incorreta.`);
            }
            nextButton.style.display = 'block'; // Mostra o botão "Próxima Pergunta".
        };

        // Renderiza os resultados finais do quiz.
        const renderResults = () => {
            quizContainer.innerHTML = ''; // Limpa o quiz atual.

            const resultsDiv = document.createElement('div');
            resultsDiv.className = 'quiz-results';

            const resultTitle = document.createElement('h4');
            resultTitle.textContent = 'Quiz Finalizado!';
            resultsDiv.appendChild(resultTitle);

            const resultText = document.createElement('p');
            resultText.textContent = `Você acertou ${score} de ${questionsData.length} perguntas.`;
            resultsDiv.appendChild(resultText);

            const restartButton = document.createElement('button');
            restartButton.className = 'quiz-restart-btn btn btn-primary';
            restartButton.textContent = 'Refazer Quiz';
            restartButton.addEventListener('click', () => {
                currentQuestionIndex = 0; // Reseta o índice da pergunta.
                score = 0;                // Reseta a pontuação.
                renderQuestion();         // Reinicia o quiz.
            });
            resultsDiv.appendChild(restartButton);

            quizContainer.appendChild(resultsDiv);
            console.log(`🏁 Quiz "${quizId}": Finalizado. Pontuação: ${score}/${questionsData.length}`);
        };

        // Inicia o quiz ao chamar a função setupQuiz.
        renderQuestion();
    }

    // Inicializa todos os quizzes existentes na página.
    // Garante que cada quiz seja configurado com seus dados específicos.
    setupQuiz('quiz-d01', quizzesData['quiz-d01']);
    setupQuiz('quiz-d02', quizzesData['quiz-d02']);
    setupQuiz('quiz-d03', quizzesData['quiz-d03']);

    console.log('✅ main.js script finalizado.');
});