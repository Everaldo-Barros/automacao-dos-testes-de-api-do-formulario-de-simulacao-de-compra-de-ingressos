describe("GET /api/acessar-formulario", () => {
  it("Deve acessar o formulário com sucesso", () => {
    cy.request("GET", "/api/acessar-formulario").then((resposta) => {
      cy.log(`Status: ${resposta.status}`);
      cy.log(`${resposta.body.mensagem}`);
      cy.log(`URL Origem: ${resposta.body.urlOrigem}`);
      cy.log(`URL Destino: ${resposta.body.urlDestino}`);
      cy.log(`Quantidade de campos: ${resposta.body.camposEsperados.length}`);
      console.log("Resposta completa:", resposta.body);

      expect(resposta.status).to.equal(200);
      expect(resposta.body.sucesso).to.be.true;
      expect(resposta.body.mensagem).to.equal("Formulário acessado com sucesso");
      expect(resposta.body.urlOrigem).to.include("everaldo-barros.github.io");
      expect(resposta.body.urlDestino).to.include("formulario.html");
      expect(resposta.body.camposEsperados).to.be.an("array").and.not.empty;
      expect(resposta.body.timestamp).to.be.a("string");
    });
  });

  it("Deve retornar os campos esperados na resposta", () => {
    const camposEsperados = [
      "nome", "sobrenome", "email", "telefone",
      "jogo", "setor", "quantidade", "formaPagamento", "pedidoEspecial"
    ];

    cy.request("GET", "/api/acessar-formulario").then((resposta) => {
      const campos = resposta.body.camposEsperados;
      
      cy.log("Campos esperados:");
      camposEsperados.forEach((campo, indice) => {
        cy.log(`   ${indice + 1}. ${campo}`);
      });
      cy.log(`${campos.length} campos retornados`);
      console.log("Campos recebidos:", campos);

      expect(campos).to.include.members(camposEsperados);
    });
  });
});
