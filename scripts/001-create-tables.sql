-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de vendas
CREATE TABLE IF NOT EXISTS vendas (
    id SERIAL PRIMARY KEY,
    data_hora BIGINT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL CHECK (forma_pagamento IN ('PIX', 'Débito', 'Crédito', 'Dinheiro')),
    itens_vendidos TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
