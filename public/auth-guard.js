import { _supabase } from './supabase-config.js';

class AuthGuard {
    constructor() {
        this.user = null;
        this.role = null;
    }

    async init() {
        console.log("AuthGuard: Iniciando verificação de sessão...");
        const { data: { session }, error } = await _supabase.auth.getSession();
        console.log("AuthGuard: Sessão obtida", { session, error });
        
        if (error || !session) {
            this.requireLogin();
            return;
        }

        this.user = session.user;

        // 2. Busca o perfil/role do usuário na tabela 'usuarios' vinculada ao 'auth.users' pelo Auth ID ou Email (CPF)
        await this.loadUserProfile();
    }

    async loadUserProfile() {
        try {
            // Buscamos o usuário no DB local pelo e-mail falso
            const cpfUser = this.user.email.replace('@senai.br', '');

            const { data, error } = await _supabase
                .from('usuarios')
                .select('role')
                .eq('cpf', cpfUser)
                .single();

            if (error || !data) {
                console.error("Erro ao carregar permissões ou usuário não encontrado na base de dados (usuarios).", error);
                this.role = 'viewer'; 
            } else {
                this.role = data.role; // 'admin' ou 'viewer'
            }

            this.applyRouteRules();
        } catch (err) {
            console.error("Erro Crítico no AuthGuard:", err);
            this.role = 'viewer';
            this.applyRouteRules();
        }
    }

    applyRouteRules() {
        const currentPath = window.location.pathname.toLowerCase();
        const isAdminRoute = currentPath.includes('cadastro.html') || currentPath.includes('dashboard.html');

        if (isAdminRoute && this.role !== 'admin') {
            alert('Acesso Negado. Esta página é restrita a Administradores.');
            window.location.href = 'view.html';
        }
    }

    requireLogin() {
        const currentPath = window.location.pathname.toLowerCase();
        if (!currentPath.includes('index.html') && currentPath !== '/') {
            window.location.href = 'index.html';
        }
    }

    async logout() {
        await _supabase.auth.signOut();
        localStorage.clear();
        window.location.href = 'index.html';
    }

    isAdmin() {
        return this.role === 'admin';
    }
}

export const authGuard = new AuthGuard();
