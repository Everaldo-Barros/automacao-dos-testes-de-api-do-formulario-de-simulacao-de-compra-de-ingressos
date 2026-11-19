describe("GET /api/jogos", () => {
  it("Deve retornar lista de jogos com sucesso", () => {
    cy.request("GET", "/api/jogos").then((resposta) => {
      cy.log(`Status: ${resposta.status}`);
      cy.log(`Sucesso: ${resposta.body.sucesso}`);
      cy.log(`Total de jogos: ${resposta.body.jogos.length}`);
      console.log("Lista completa de jogos:", resposta.body.jogos);

      expect(resposta.status).to.equal(200);
      expect(resposta.body.sucesso).to.be.true;
      expect(resposta.body.jogos).to.be.an("array").and.not.empty;
    });
  });

  it("Deve conter os jogos esperados na lista", () => {
    const jogosEsperados = [
      "Flamengo x Santos — 15/10/2026 · 16h00",
      "Palmeiras x Grêmio — 27/10/2026 · 19h30",
      "Corinthians x Bahia — 31/10/2026 · 21h00",
      "Cruzeiro x Vasco — 03/11/2026 · 15h00"
    ];

    cy.request("GET", "/api/jogos").then((resposta) => {
      const jogos = resposta.body.jogos;
      
      cy.log("Jogos recebidos:");
      jogos.forEach((jogo, indice) => {
        cy.log(`   ${indice + 1}. ${jogo}`);
      });
      console.log("Jogos recebidos:", jogos);
      console.log("Jogos esperados:", jogosEsperados);

      expect(jogos).to.include.members(jogosEsperados);
    });
  });
});

