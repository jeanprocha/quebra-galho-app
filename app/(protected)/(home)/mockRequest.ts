export const requests = Array.from({ length: 50 }, (_, i) => {
  const categorias = ['Emprestar', 'Mudança', 'Conserto', 'Doméstico', 'Solidário', 'Remunerado'];
  const nomes = [
    'Fernanda Oliveira', 'Carlos Henrique', 'Ana Cláudia', 'Bruno Lima', 'Juliana Rocha',
    'Eduardo Silva', 'Patrícia Borges', 'Marcos Tadeu', 'Isabela Mendes', 'Roberto Cunha',
    'Larissa Costa', 'Rafael Souza', 'Mariana Dias', 'Tiago Melo', 'Camila Farias',
    'Diego Ramos', 'Bianca Martins', 'André Gonçalves', 'Natália Freitas', 'Lucas Barros'
  ];
  const bairros = [
    'Centro', 'Água Verde', 'Pinheirinho', 'Batel', 'Boqueirão', 'Santa Felicidade', 'Portão',
    'Cristo Rei', 'Cajuru', 'Hauer', 'Rebouças', 'Ahú', 'Cabral', 'Juvevê', 'Alto da XV',
    'Bom Retiro', 'Xaxim', 'Capão Raso', 'Uberaba', 'Sítio Cercado'
  ];
  const dificuldades = ['Fácil', 'Média', 'Difícil'];
  const urgencias = ['Urgente', 'Flexível', 'Agendar para amanhã'];
  const contatos = ['Via chat', 'WhatsApp', 'Ligar'];
  const observacoesExtras = [
    'Prefiro ajuda no período da manhã.',
    'Tenho as ferramentas necessárias.',
    'Pode ser feito no fim de semana.',
    'Preciso de alguém com experiência.',
    'Levar escada, se possível.',
  ];
  const valores = [30, 50, 70, 100, 120];

  const categoria = categorias[i % categorias.length];
  const user = nomes[i % nomes.length];
  const bairro = bairros[i % bairros.length];
  const dificuldade = dificuldades[i % dificuldades.length];
  const urgencia = urgencias[i % urgencias.length];
  const contato = contatos[i % contatos.length];
  const observacoes = observacoesExtras[i % observacoesExtras.length];
  const valor = valores[i % valores.length];
  const endereco = `Rua ${bairro}, ${100 + (i % 50)} - Curitiba, PR`;
  const dataHora = `Hoje às ${12 + (i % 6)}h`;
  const pessoas = (i % 3) + 1;

  const baseLat = -25.45 + (Math.random() * 0.08 - 0.04);
  const baseLng = -49.28 + (Math.random() * 0.08 - 0.04);

  return {
    id: (i + 1).toString(),
    titulo: `${categoria === 'Emprestar' ? 'Preciso de' : 'Ajuda com'} ${['furadeira', 'sofá', 'armário', 'faxina', 'cachorro'][i % 5]}`,
    descricao: `Descrição simulada para ${categoria.toLowerCase()}.`,
    categoria,
    user,
    location: `${bairro} - Curitiba, PR`,
    latitude: parseFloat(baseLat.toFixed(6)),
    longitude: parseFloat(baseLng.toFixed(6)),
    endereco,
    valor,
    dificuldade,
    urgencia,
    dataHora,
    contato,
    pessoas,
    observacoes,
  };
});
