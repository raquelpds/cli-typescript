import * as readline from 'readline';

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  dataCriacao: Date;
}

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  categoriaId: number;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

let categorias: Categoria[] = [];
let produtos: Produto[] = [];

let categoriaId = 1;
let produtoId = 1;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function perguntar(pergunta: string): Promise<string> {
  return new Promise(resolve => rl.question(pergunta, resolve));
}

// --- Funções de Categoria ---
async function criarCategoria() {
  const nome = await perguntar("Nome da categoria: ");
  const descricao = await perguntar("Descrição: ");
  categorias.push({
    id: categoriaId++,
    nome,
    descricao,
    dataCriacao: new Date(),
  });
  console.log("✅ Categoria criada com sucesso!\n");
}

function listarCategorias() {
  console.log("\n📂 Categorias:");
  categorias.forEach(c => {
    console.log(`${c.id} - ${c.nome} | ${c.descricao} | Criada em: ${c.dataCriacao.toLocaleString()}`);
  });
}

async function buscarCategoria() {
  const termo = await perguntar("Buscar por ID ou Nome: ");
  const resultado = categorias.find(c => c.id === Number(termo) || c.nome.toLowerCase() === termo.toLowerCase());
  if (resultado) {
    console.log("Categoria encontrada:", resultado);
  } else {
    console.log("❌ Categoria não encontrada.");
  }
}

async function atualizarCategoria() {
  const id = Number(await perguntar("ID da categoria: "));
  const categoria = categorias.find(c => c.id === id);
  if (!categoria) return console.log("❌ Categoria não encontrada.");
  const nome = await perguntar("Novo nome: ");
  const descricao = await perguntar("Nova descrição: ");
  categoria.nome = nome;
  categoria.descricao = descricao;
  console.log("✅ Categoria atualizada.");
}

async function removerCategoria() {
  const id = Number(await perguntar("ID da categoria a remover: "));
  const possuiProdutos = produtos.some(p => p.categoriaId === id);
  if (possuiProdutos) return console.log("❌ Não é possível remover. Há produtos associados.");
  categorias = categorias.filter(c => c.id !== id);
  console.log("✅ Categoria removida.");
}

// --- Funções de Produto ---
async function criarProduto() {
  const nome = await perguntar("Nome do produto: ");
  const descricao = await perguntar("Descrição: ");
  const preco = Number(await perguntar("Preço: "));
  const quantidade = Number(await perguntar("Quantidade: "));
  const categoriaId = Number(await perguntar("ID da categoria: "));
  const categoria = categorias.find(c => c.id === categoriaId);
  if (!categoria) return console.log("❌ Categoria não encontrada.");
  produtos.push({
    id: produtoId++,
    nome,
    descricao,
    preco,
    quantidade,
    categoriaId,
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
  });
  console.log("✅ Produto criado com sucesso!");
}

function listarProdutos() {
  console.log("\n📦 Produtos:");
  produtos.forEach(p => {
    const categoria = categorias.find(c => c.id === p.categoriaId);
    console.log(`${p.id} - ${p.nome} | R$${p.preco.toFixed(2)} | Qtd: ${p.quantidade} | Categoria: ${categoria?.nome}`);
  });
}

async function buscarProduto() {
  const termo = await perguntar("Buscar por ID, Nome ou Categoria: ").then(t => t.toLowerCase());
  const resultado = produtos.filter(p =>
    p.id === Number(termo) ||
    p.nome.toLowerCase().includes(termo) ||
    categorias.find(c => c.id === p.categoriaId && c.nome.toLowerCase().includes(termo))
  );
  if (resultado.length > 0) {
    resultado.forEach(p => console.log(p));
  } else {
    console.log("❌ Nenhum produto encontrado.");
  }
}

async function atualizarProduto() {
  const id = Number(await perguntar("ID do produto: "));
  const produto = produtos.find(p => p.id === id);
  if (!produto) return console.log("❌ Produto não encontrado.");

  const nome = await perguntar("Novo nome: ");
  const descricao = await perguntar("Nova descrição: ");
  const preco = Number(await perguntar("Novo preço: "));
  const quantidade = Number(await perguntar("Nova quantidade: "));

  produto.nome = nome;
  produto.descricao = descricao;
  produto.preco = preco;
  produto.quantidade = quantidade;
  produto.dataAtualizacao = new Date();

  console.log("✅ Produto atualizado.");
}

async function removerProduto() {
  const id = Number(await perguntar("ID do produto a remover: "));
  produtos = produtos.filter(p => p.id !== id);
  console.log("✅ Produto removido.");
}

// --- Menu ---
async function menu() {
  while (true) {
    console.log(`
==== MENU ====
1. Criar Categoria
2. Listar Categorias
3. Buscar Categoria
4. Atualizar Categoria
5. Remover Categoria
6. Criar Produto
7. Listar Produtos
8. Buscar Produto
9. Atualizar Produto
10. Remover Produto
0. Sair
    `);

    const opcao = await perguntar("Escolha uma opção: ");

    switch (opcao) {
      case "1": await criarCategoria(); break;
      case "2": listarCategorias(); break;
      case "3": await buscarCategoria(); break;
      case "4": await atualizarCategoria(); break;
      case "5": await removerCategoria(); break;
      case "6": await criarProduto(); break;
      case "7": listarProdutos(); break;
      case "8": await buscarProduto(); break;
      case "9": await atualizarProduto(); break;
      case "10": await removerProduto(); break;
      case "0":
        rl.close();
        console.log("👋 Programa encerrado.");
        return;
      default: console.log("❌ Opção inválida.");
    }
  }
}

menu();
