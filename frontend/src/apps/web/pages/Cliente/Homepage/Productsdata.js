const CATEGORY_DEFAULTS = {
  lanches: {
    desc: "Feito na hora, com ingredientes selecionados.",
    price: null,
  },
  pizzas: {
    desc: "Massa artesanal e recheio generoso, no forno na hora do pedido.",
    price: null,
  },
  japonesa: {
    desc: "Preparo tradicional com ingredientes frescos do dia.",
    price: null,
  },
  saudavel: {
    desc: "Opção leve e nutritiva, ótima para qualquer hora do dia.",
    price: null,
  },
  doces: {
    desc: "Doce da casa, perfeito para fechar a refeição.",
    price: null,
  },
  bebidas: {
    desc: "Bebida gelada, preparada na hora.",
    price: null,
  },
  frango: {
    desc: "Frango temperado e preparado no ponto certo.",
    price: null,
  },
};

// Detalhes específicos por prato (chave = nome do arquivo sem extensão).
// Edite ou adicione novas linhas aqui quando quiser personalizar um item.
const PRODUCT_DETAILS = {
  // Lanches
  "Bacon BBQ Gourmet": {
    desc: "Blend artesanal, bacon crocante e molho barbecue da casa.",
    price: "R$28,90",
  },
  "Chicken Crispy Burger": {
    desc: "Frango empanado crocante, alface e maionese temperada.",
    price: "R$24,90",
  },
  "Classic Smash Burger": {
    desc: "Smash burger suculento, queijo derretido e cebola caramelizada.",
    price: "R$22,90",
  },
  "Club Sandwich": {
    desc: "Três camadas de pão, frango, bacon, alface, tomate e maionese.",
    price: "R$23,90",
  },
  "Hot Dog Gourmet": {
    desc: "Salsicha especial, molhos da casa e batata palha crocante.",
    price: "R$18,90",
  },
  "Sanduíche de Costela Desfiada": {
    desc: "Costela desfiada lentamente, no ponto, com molho barbecue.",
    price: "R$29,90",
  },
  "Smash Triple Cheese": {
    desc: "Três camadas de queijo derretido sobre smash burger suculento.",
    price: "R$26,90",
  },
  "Veggie Mushroom Burger": {
    desc: "Hambúrguer vegetariano de cogumelos com queijo derretido.",
    price: "R$23,90",
  },
  "Wrap de Mignon com Queijo": {
    desc: "Filé mignon fatiado, queijo derretido e molho especial no wrap.",
    price: "R$27,90",
  },
  "X-Salada Tradicional": {
    desc: "O clássico de sempre: hambúrguer, queijo, alface, tomate e maionese.",
    price: "R$19,90",
  },

  // Pizzas
  "Calabresa Especial": {
    desc: "Calabresa fatiada, cebola roxa e azeitonas pretas.",
    price: "R$44,90",
  },
  "Carne Seca com Cream Cheese": {
    desc: "Carne seca desfiada com cream cheese e cebola caramelizada.",
    price: "R$54,90",
  },
  "Frango com Catupiry": {
    desc: "Frango desfiado temperado com catupiry cremoso.",
    price: "R$46,90",
  },
  "Margherita": {
    desc: "Molho de tomate, mussarela de búfala e manjericão fresco.",
    price: "R$42,90",
  },
  "Parma com Rúcula": {
    desc: "Presunto parma, rúcula fresca e lascas de parmesão.",
    price: "R$56,90",
  },
  "Pepperoni com Mel": {
    desc: "Pepperoni picante com um toque de mel para equilibrar.",
    price: "R$48,90",
  },
  "Portuguesa": {
    desc: "Presunto, ovos, cebola, azeitona e ervilha.",
    price: "R$45,90",
  },
  "Quatro Queijos": {
    desc: "Mussarela, provolone, parmesão e gorgonzola.",
    price: "R$47,90",
  },
  "Quattro Formaggi & Trufas": {
    desc: "Quatro queijos selecionados com um toque de azeite trufado.",
    price: "R$62,90",
  },

  // Bebidas
  "Milkshake de Ovomaltine (400ml)": { price: "R$15,90" },
  "Soda Italiana de Maçã Verde": { price: "R$6,90" },
  "Suco Detox Verde (500ml)": { price: "R$11,90" },
  "Suco Natural de Goiaba (500ml)": { price: "R$8,90" },
  "Suco Natural de Laranja (500ml)": { price: "R$8,90" },
  "Suco Natural de Maracujá(500ml)": { price: "R$8,90" },
  "Suco Natural de Uva (500ml)": { price: "R$8,90" },
  "Água Mineral sem Gás ou com Gás (500ml)": { price: "R$14,90" },

  // Doces
  "Banoffee no Pote": { price: "R$23,90" },
  "Brigadeiro Gourmet Tradicional (4 unid.)": { price: "R$20,90" },
  "Brownie de Chocolate com Nocciola": { price: "R$16,90" },
  "Cheesecake de Frutas Vermelhas": { price: "R$20,90" },
  "Copo da Felicidade de Morango": { price: "R$18,90" },
  "Petit Gâteau de Doce de Leite": { price: "R$16,90" },
  "Pudim de Leite Condensado": { price: "R$23,90" },
  "Torta Holandesa Tradicional": { price: "R$18,90" },

  // Frango
  "Balde de Frango Crocante (Crispy Tenders)": { price: "R$39,90" },
  "Chicken Wings BBQ": { price: "R$47,90" },
  "Coxinha de Frango com Catupiry (6 unid.)": { price: "R$46,90" },
  "Escondidinho de Frango com Mandioquinha": { price: "R$28,90" },
  "Frango a Passarinho ao Alho e Óleo": { price: "R$28,90" },
  "Grelhado de Frango ao Molho de Limão": { price: "R$46,90" },
  "Sobrecoxa Assada com Ervas e Batatas": { price: "R$55,90" },
  "Stroganoff de Frango Tradicional": { price: "R$54,90" },

  // Japonesa
  "Combinado Hot Roll (10 unid.)": { price: "R$60,90" },
  "Niguiri de Salmão Flambado (4 unid.)": { price: "R$50,90" },
  "Sashimi de Salmão (10 fatias)": { price: "R$33,90" },
  "Sashimi de Tuna (Tuna Crisp)": { price: "R$59,90" },
  "Temaki de Salmão Completo": { price: "R$42,90" },
  "Uramaki Philadelphia (8 unid.)": { price: "R$53,90" },

  // Saudável
  "Bowl de Quinoa com Legumes Assados": { price: "R$27,90" },
  "Omelete de Ervas e Queijo Branco": { price: "R$31,90" },
  "Salada Caesar com Frango": { price: "R$36,90" },
  "Salmão Grelhado com Purê de Mandioquinha": { price: "R$30,90" },
  "Stroganoff Fit de Frango": { price: "R$30,90" },
  "Wrap Integral de Peito de Peru": { price: "R$29,90" },
};

// Mapa de categoria -> pasta dentro de src/imgs
// (os 3 argumentos do require.context precisam ser literais estáticos —
// pasta, regex e "entrar em subpastas" — por isso cada chamada abaixo repete
// o mesmo regex em vez de usar uma variável compartilhada)

function contextToProducts(context, categoryId) {
  const defaults = CATEGORY_DEFAULTS[categoryId] || {};

  return context.keys().map((key) => {
    const filename = key.replace(/^\.\//, "");
    const title = filename.replace(/\.[^/.]+$/, "");
    const details = PRODUCT_DETAILS[title] || {};

    return {
      id: `${categoryId}-${title}`,
      category: categoryId,
      title,
      desc: details.desc || defaults.desc,
      price: details.price || defaults.price,
      img: context(key),
    };
  });
}

// Um require.context por pasta de categoria em src/imgs.
// `false` = não entra em subpastas. Ao adicionar uma nova imagem dentro de
// uma dessas pastas, ela é automaticamente incluída no build seguinte.
const lanchesCtx = require.context("../../../../../imgs/Lanches", false, /\.(png|jpe?g|webp|svg)$/i);
const pizzasCtx = require.context("../../../../../imgs/Pizzas", false, /\.(png|jpe?g|webp|svg)$/i);
const japonesaCtx = require.context("../../../../../imgs/Japonesa", false, /\.(png|jpe?g|webp|svg)$/i);
const saudavelCtx = require.context("../../../../../imgs/Saudável", false, /\.(png|jpe?g|webp|svg)$/i);
const docesCtx = require.context("../../../../../imgs/Doces", false, /\.(png|jpe?g|webp|svg)$/i);
const bebidasCtx = require.context("../../../../../imgs/Bebidas", false, /\.(png|jpe?g|webp|svg)$/i);
const frangoCtx = require.context("../../../../../imgs/Frango", false, /\.(png|jpe?g|webp|svg)$/i);

export const PRODUCTS = [
  ...contextToProducts(lanchesCtx, "lanches"),
  ...contextToProducts(pizzasCtx, "pizzas"),
  ...contextToProducts(japonesaCtx, "japonesa"),
  ...contextToProducts(saudavelCtx, "saudavel"),
  ...contextToProducts(docesCtx, "doces"),
  ...contextToProducts(bebidasCtx, "bebidas"),
  ...contextToProducts(frangoCtx, "frango"),
];