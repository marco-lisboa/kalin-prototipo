# Kalin Educ — Plataforma de Streaming Educacional em Fisioterapia

> **Pertencente ao Grupo Kalin**  
> Protótipo Front-End Completo, Moderno, Navegável e com Arquitetura Preparada para Backend Laravel REST API.

---

## 🌟 Visão Geral

O **Kalin Educ** é uma plataforma educacional premium inspirada na experiência de streaming moderna, focada na formação continuada de fisioterapeutas. O projeto foi desenvolvido com alta fidelidade visual, microinterações refinadas, design responsivo e persistência 100% client-side utilizando `localStorage` com camada desacoplada de repositórios/serviços.

---

## 🎨 Identidade Visual (Design System do Grupo Kalin)

| Token | Valor Hex | Finalidade |
|---|---|---|
| `--kalin-dark` | `#193027` | Verde escuro institucional profundo (branding e streaming) |
| `--kalin-green` | `#0B6B18` | Verde vivo da marca Kalin |
| `--kalin-primary` | `#16A63A` | Verde vibrante de destaque, ações principais e progresso |
| `--kalin-light` | `#EAF7ED` | Fundo suave verde para badges e cards |
| `--kalin-background` | `#F6F8F7` | Fundo limpo e suave de aplicação |
| `--kalin-text` | `#17211D` | Tipografia em grafite escuro |

---

## 🚀 Como Executar o Projeto Localmente

```bash
# 1. Instalar dependências (caso não estejam instaladas)
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Compilar bundle de produção
npm run build
```

O servidor iniciará em: **`http://localhost:5173/`**

---

## 👥 Credenciais de Demonstração

Para facilitar apresentações comerciais e testes pelo cliente, a plataforma conta com um widget discreto no canto inferior esquerdo (**"Perfis de Teste (Demo)"**) que permite login imediato com 1 clique ou via formulário de login tradicional:

| Perfil | CPF | Senha | URL Inicial |
|---|---|---|---|
| **ALUNO (Lucas Ferreira)** | `123.456.789-00` | `123456` | `/app` |
| **PROFESSOR (Prof. Dr. Rafael Almeida)** | `111.111.111-11` | `123456` | `/teacher` |
| **SUPERADMINISTRADOR (Dr. Alexandre Kalin)** | `000.000.000-00` | `admin123` | `/admin` |

*Possui botão para **Restaurar/Reinicializar Dados Mockados** a qualquer momento.*

---

## 📱 Portais e Fluxos Implementados

### 1. Landing Page (`/`)
- Hero institucional com slogan *"Conhecimento que transforma profissionais"*
- Seções informativas (*Aprenda com Especialistas*, *Casos Clínicos*, *Especialidades em um só lugar*)
- Botões de chamada para ação e acesso

### 2. Autenticação (`/login` e `/register`)
- Layout bipartido premium com branding visual do Grupo Kalin
- Login com validação e máscara de CPF
- Cadastro de aluno com validação de campos, termos de uso e login imediato

### 3. Portal do Aluno (`/app`) — Experiência Streaming
- **Hero de Alto Impacto:** Destaque para o curso *"Neurofuncional"* com botões `[Continuar assistindo]` e `[Ver curso]`
- **Continuar Assistindo:** Carrossel horizontal de cards de aulas com barra de progresso, percentual e ação rápida
- **Meus Cursos (`/app/cursos`):** Filtros por status (*Todas*, *Em andamento*, *Concluídos*), especialidades e busca
- **Página do Curso (`/app/cursos/:id`):** Visão completa, carga horária, docente e currículo
- **Currículo Interativo (`/app/curriculo`):** Módulos em *Accordion* retráteis com status de cada aula
- **Player de Vídeo Premium (`/app/aula/:id`):**
  - Controles personalizados (play/pause, seek, volume, velocidade 0.75x a 2x, tela cheia)
  - Botão **"Marcar como concluída"** com animação de confetes e atualização de progresso
  - Navegação entre aulas anterior e próxima
  - Aba **"Materiais da Aula"** com simulação de download de apostilas em PDF
  - Playlist lateral com todos os módulos do curso
- **Especialidades (`/app/especialidades` e `/app/especialidades/:slug`):**
  - As 8 grandes áreas (Neurofuncional, Esportiva, Traumato-Ortopédica, Pediátrica, Gerontológica, Respiratória, Cardiorrespiratória, Hospitalar)
- **Meu Progresso (`/app/progresso`):** Estatísticas completas, percentual geral, gráfico de aulas concluídas na semana
- **Meu Perfil (`/app/perfil`):** Edição de nome e e-mail, CPF protegido e histórico de cursos

### 4. Portal do Professor (`/teacher`)
- **Dashboard:** Métricas de alunos, cursos, aulas publicadas, visualizações e gráficos de audiência
- **Minhas Aulas (`/teacher/aulas`):** Tabela com filtros, status (Publicado/Rascunho), edição e exclusão
- **Cadastrar Nova Aula (`/teacher/aulas/nova`):**
  - Formulário completo com curso, categoria, módulo e ordem
  - **Simulação de upload de vídeo:** Animação *"Enviando vídeo..."* com barra de progresso em tempo real e confirmação *"Vídeo enviado"*
- **Meus Cursos (`/teacher/cursos`):** Gestão dos cursos ministrados pelo professor
- **Alunos (`/teacher/alunos`):** Lista de profissionais matriculados

### 5. Painel do Super Administrador (`/admin`)
- **Dashboard Executivo:** KPIs oficiais (1.248 Alunos, 34 Professores, 12 Cursos, 186 Aulas), gráficos de crescimento e **feed de Atividades Recentes**
- **Gestão de Alunos (`/admin/alunos`):** Tabela, filtros, modal de cadastro (+ Novo Aluno), edição e exclusão
- **Gestão de Professores (`/admin/professores`):** Tabela com titulação, especialidade e modal de cadastro (+ Novo Professor)
- **Gestão de Cursos (`/admin/cursos`):** Tabela com capas, módulos, aulas, alunos e modal de cadastro (+ Novo Curso)
- **Gestão de Aulas (`/admin/aulas`):** Filtros por curso, categoria, professor e status; toggle de publicação
- **Gestão de Categorias (`/admin/categorias`):** CRUD com modal, seletores de cor e toggle ativa/inativa
- **Relatórios (`/admin/relatorios`):** Métricas consolidadas e simulação de exportação em CSV/PDF
- **Configurações (`/admin/configuracoes`):** Restaurador de dados mockados e instruções de arquitetura

---

## 🔌 Preparação para Futuro Backend (Laravel REST API)

A aplicação foi estruturada segundo o princípio da inversão de dependência em camadas:

```
src/
  services/
    storage.ts          # Gerenciamento centralizado de LocalStorage
    mockData.ts         # Inicializador dos dados mockados
    authService.ts      # Autenticação e sessão
    courseService.ts    # Operações de cursos e módulos
    lessonService.ts    # Operações de aulas e vídeos
    categoryService.ts  # Operações de especialidades
    studentService.ts   # Operações de alunos
    teacherService.ts   # Operações de professores
    progressService.ts  # Progresso e histórico de consumo
    activityService.ts  # Logs de atividade
```

Nenhum componente React consome `localStorage` diretamente. No futuro, para conectar a uma API Laravel real, basta substituir o corpo das funções dentro de cada service por chamadas `axios` ou `fetch` (ex: `api.get('/courses')`), mantendo a camada visual e o estado dos componentes 100% preservados!
