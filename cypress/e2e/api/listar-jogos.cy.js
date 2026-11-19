describe('GET /api/jogos', () => {
  it('Deve retornar lista de jogos com sucesso', () => {
    cy.request('GET', '/api/jogos')
      .then((resposta) => {
        expect(resposta.status).to.eq(200);
        expect(resposta.body.sucesso).to.be.true;
        expect(resposta.body.jogos).to.be.an('array');
        expect(resposta.body.jogos).to.have.lengthOf(4);
      });
  });

  it('Deve conter os jogos esperados na lista', () => {
    const jogosEsperados = [
      "Flamengo x Santos — 15/12/2026 · 16h00",
      "Palmeiras x Grêmio — 27/12/2026 · 19h30",
      "Corinthians x São Paulo — 03/12/2026 · 20h00",
      "Botafogo x Vasco — 10/12/2026 · 18h00"
    ];

    cy.request('GET', '/api/jogos')
      .then((resposta) => {
        const jogos = resposta.body.jogos;
        console.log("Jogos da API:", jogos);
        console.log("Jogos esperados:", jogosEsperados);

        // Verifica apenas se são arrays e tem a quantidade certa
        expect(jogos).to.be.an('array');
        expect(jogos.length).to.be.at.least(4);

        // Verificação mais flexível: cada jogo esperado está contido em algum item
        jogosEsperados.forEach((jogoEsperado) => {
          const encontrado = jogos.some(jogo => jogo.includes(jogoEsperado));
          expect(encontrado, `Jogo não encontrado: ${jogoEsperado}`).to.be.true;
        });
      });
  });
});