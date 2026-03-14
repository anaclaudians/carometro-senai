console.log("Supabase Config: Inicializando...");
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.42.0/+esm';

const SUPABASE_URL = 'https://zdhpyflnyopwhgvbpibf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xZGVQv0UWu_cauVfQoiL6Q_RRytQozQ';

console.log("Supabase Config: Criando cliente...");
export const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
console.log("Supabase Config: Cliente criado.");

// Helper para padronizar o Auth login via EMAIL FALSO usando o CPF
export const cpfToEmail = (cpf) => {
    return `${cpf.replace(/\D/g, "")}@senai.br`;
};
