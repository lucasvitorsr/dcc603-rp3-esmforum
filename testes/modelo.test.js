const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta - 1);
});

test('Testando cadastro de respostas e num_respostas', () => {
  const id_pergunta1 = modelo.cadastrar_pergunta('Qual a capital do Brasil?');
  const id_pergunta2 = modelo.cadastrar_pergunta('Qual o maior oceano?');

  modelo.cadastrar_resposta(id_pergunta1, 'Brasília');
  modelo.cadastrar_resposta(id_pergunta1, 'É Brasília');
  modelo.cadastrar_resposta(id_pergunta2, 'Pacífico');

  const perguntas = modelo.listar_perguntas();
  
  const pergunta1 = perguntas.find(p => p.id_pergunta === id_pergunta1);
  const pergunta2 = perguntas.find(p => p.id_pergunta === id_pergunta2);

  expect(pergunta1.num_respostas).toBe(2);
  expect(pergunta2.num_respostas).toBe(1);

  expect(modelo.get_num_respostas(id_pergunta1)).toBe(2);
  expect(modelo.get_num_respostas(id_pergunta2)).toBe(1);
});

test('Testando get_pergunta', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Quanto é 7 x 8?');
  const pergunta = modelo.get_pergunta(id_pergunta);
  
  expect(pergunta).toBeDefined();
  expect(pergunta.texto).toBe('Quanto é 7 x 8?');
  expect(pergunta.id_pergunta).toBe(id_pergunta);
});

test('Testando get_respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Onde nasceu o futebol?');
  modelo.cadastrar_resposta(id_pergunta, 'Inglaterra');
  modelo.cadastrar_resposta(id_pergunta, 'No Reino Unido');
  modelo.cadastrar_resposta(id_pergunta, 'Terra da Rainha');

  const respostas = modelo.get_respostas(id_pergunta);
  
  expect(respostas.length).toBe(3);
  expect(respostas[0].texto).toBe('Inglaterra');
  expect(respostas[1].texto).toBe('No Reino Unido');
  expect(respostas[2].texto).toBe('Terra da Rainha');
  expect(respostas[0].id_pergunta).toBe(id_pergunta);
});

test('Testando reconfig_bd para cobertura', () => {
  modelo.reconfig_bd({}); 
});