describe("DELETE /api/reserva/:codigo", () => {
  let codigoReserva;

  before(() => {
    const dadosReserva = {
      nome: "Ana",
      sobrenome: "Costa",
      email: "ana.costa@email.com",
      telefone: "49977776666",
      jogo: "Palmeiras x Grêmio — 27/12/2026 · 19h30",
      setor: "Cadeira Coberta — R$ 150,00",
      quantidade: 2,
      formaPagamento: "Boleto Bancário",
      pedidoEspecial: "Nenhum"
    };

    cy.request("POST", "/api/enviar-formulario", dadosReserva).then((resposta) => {
      codigoReserva = resposta.body.reserva.codigo;
      cy.log(`Reserva criada: ${codigoReserva}`);
    });
  });

  it("Deve cancelar uma reserva com sucesso", () => {
    cy.request("DELETE", `/api/reserva/${codigoReserva}`).then((resposta) => {
      cy.log(`Status: ${resposta.status}`);
      cy.log(`Mensagem: ${resposta.body.mensagem}`);
      cy.log(`Código cancelado: ${resposta.body.reservaCancelada.codigo}`);
      cy.log(`Jogo: ${resposta.body.reservaCancelada.jogo}`);
      cy.log(`Valor total: R$ ${resposta.body.reservaCancelada.valorTotal}`);
      console.log("Resposta completa:", resposta.body);

      expect(resposta.status).to.equal(200);
      expect(resposta.body.sucesso).to.be.true;
      expect(resposta.body.mensagem).to.equal("Reserva cancelada com sucesso!");
      expect(resposta.body.reservaCancelada.codigo).to.equal(codigoReserva);
      expect(resposta.body.reservaCancelada.nomeCompleto).to.equal("Ana Costa");
      expect(resposta.body.reservaCancelada.valorTotal).to.equal(300);
      expect(resposta.body.reservaCancelada.dataHoraCancelamento).to.exist;
    });
  });

  it("Deve retornar erro quando tentar cancelar reserva que não existe", () => {
    cy.request({
      method: "DELETE",
      url: "/api/reserva/RES-NAOEXISTE",
      failOnStatusCode: false
    }).then((resposta) => {
      cy.log(`Status: ${resposta.status}`);
      cy.log(`Mensagem: ${resposta.body.mensagem}`);
      console.log("Resposta de erro:", resposta.body);

      expect(resposta.status).to.equal(404);
      expect(resposta.body.sucesso).to.be.false;
      expect(resposta.body.mensagem).to.equal("Reserva não encontrada");
    });
  });

  it("Deve confirmar que a reserva foi removida ao tentar atualizá-la", () => {
    const dadosAtualizacao = {
      nome: "Ana",
      sobrenome: "Costa",
      email: "ana.costa@email.com",
      telefone: "49977776666",
      jogo: "Palmeiras x Grêmio — 27/12/2026 · 19h30",
      setor: "Cadeira Coberta — R$ 150,00",
      quantidade: 1,
      formaPagamento: "Boleto Bancário",
      pedidoEspecial: "Nenhum"
    };

    cy.request({
      method: "PUT",
      url: `/api/reserva/${codigoReserva}`,
      body: dadosAtualizacao,
      failOnStatusCode: false
    }).then((resposta) => {
      cy.log(`Status: ${resposta.status}`);
      cy.log(`Mensagem: ${resposta.body.mensagem}`);

      expect(resposta.status).to.equal(404);
      expect(resposta.body.mensagem).to.equal("Reserva não encontrada");
    });
  });
});
