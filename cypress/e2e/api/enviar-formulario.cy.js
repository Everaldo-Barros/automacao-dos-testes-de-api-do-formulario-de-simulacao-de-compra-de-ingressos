describe("POST /api/enviar-formulario", () => {
 const dadosValidos = {
  nome: "Maria",
  sobrenome: "Silva",
  email: "maria.silva@email.com",
  telefone: "49999991234",
  jogo: "Flamengo x Santos — 15/12/2026 · 16h00",
  setor: "Arquibancada — R$ 80,00",
  quantidade: 2,
  formaPagamento: "PIX",
  pedidoEspecial: "Nenhum"
};


  it("Deve criar uma reserva com dados válidos", () => {
    cy.request("POST", "/api/enviar-formulario", dadosValidos).then((resposta) => {
      cy.log(`Status: ${resposta.status}`);
      cy.log(`Mensagem: ${resposta.body.mensagem}`);
      cy.log(`Código da reserva: ${resposta.body.reserva.codigo}`);
      cy.log(`Valor total: R$ ${resposta.body.dadosConfirmados.valorTotal}`);
      console.log("Resposta completa:", resposta.body);

      expect(resposta.status).to.equal(201);
      expect(resposta.body.sucesso).to.be.true;
      expect(resposta.body.mensagem).to.equal("Reserva realizada com sucesso!");
      expect(resposta.body.reserva.codigo).to.match(/^RES-\d+$/);
      expect(resposta.body.dadosConfirmados.valorTotal).to.equal(160);
    });
  });

  it("Deve retornar erro quando nome estiver vazio", () => {
    const dadosInvalidos = { ...dadosValidos, nome: "" };

    cy.request({
      method: "POST",
      url: "/api/enviar-formulario",
      body: dadosInvalidos,
      failOnStatusCode: false
    }).then((resposta) => {
      cy.log(`Status: ${resposta.status}`);
      cy.log(`Total de erros: ${resposta.body.totalErros}`);
      console.log("Erros retornados:", resposta.body.erros);

      expect(resposta.status).to.equal(400);
      expect(resposta.body.sucesso).to.be.false;
      expect(resposta.body.totalErros).to.be.greaterThan(0);
      expect(resposta.body.erros[0].campo).to.equal("nome");
    });
  });

  it("Deve retornar erro quando jogo for inválido", () => {
    const dadosInvalidos = { ...dadosValidos, jogo: "Jogo que não existe" };

    cy.request({
      method: "POST",
      url: "/api/enviar-formulario",
      body: dadosInvalidos,
      failOnStatusCode: false
    }).then((resposta) => {
      cy.log(`Status: ${resposta.status}`);
      cy.log(`Mensagem: ${resposta.body.mensagem}`);
      console.log("Erros retornados:", resposta.body.erros);

      expect(resposta.status).to.equal(400);
      expect(resposta.body.sucesso).to.be.false;
      expect(resposta.body.erros[0].campo).to.equal("jogo");
    });
  });
});
