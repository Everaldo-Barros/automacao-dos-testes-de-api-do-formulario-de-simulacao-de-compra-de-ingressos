describe("PUT /api/reserva/:codigo", () => {
  let codigoReserva;

  const dadosCriacao = {
    nome: "Carlos",
    sobrenome: "Pereira",
    email: "carlos.pereira@email.com",
    telefone: "49988887777",
    jogo: "Flamengo x Santos — 15/12/2026 · 16h00",
    setor: "Arquibancada — R$ 80,00",
    quantidade: 2,
    formaPagamento: "PIX",
    pedidoEspecial: "Nenhum"
  };

  before(() => {
    cy.request("POST", "/api/enviar-formulario", dadosCriacao).then((resposta) => {
      codigoReserva = resposta.body.reserva.codigo;
      cy.log(`Reserva criada: ${codigoReserva}`);
    });
  });

  it("Deve atualizar os dados de uma reserva com sucesso", () => {
    const dadosAtualizacao = {
      nome: "Carlos",
      sobrenome: "Pereira",
      email: "carlos.pereira@email.com",
      telefone: "49988887777",
      jogo: "Flamengo x Santos — 15/12/2026 · 16h00",
      setor: "Setor VIP — R$ 300,00",
      quantidade: 3,
      formaPagamento: "Cartão de Crédito",
      pedidoEspecial: "Lugar para acompanhante"
    };

    cy.request("PUT", `/api/reserva/${codigoReserva}`, dadosAtualizacao).then((resposta) => {
      cy.log(`Status: ${resposta.status}`);
      cy.log(`Mensagem: ${resposta.body.mensagem}`);
      cy.log(`Valor anterior: R$ ${resposta.body.reserva.valorAnterior}`);
      cy.log(`Valor atual: R$ ${resposta.body.reserva.valorAtual}`);
      console.log("Resposta completa:", resposta.body);

      expect(resposta.status).to.equal(200);
      expect(resposta.body.sucesso).to.be.true;
      expect(resposta.body.mensagem).to.equal("Reserva atualizada com sucesso!");
      expect(resposta.body.dadosAtualizados.setor).to.equal("Setor VIP — R$ 300,00");
      expect(resposta.body.dadosAtualizados.quantidade).to.equal(3);
      expect(resposta.body.reserva.valorAnterior).to.equal(160);
      expect(resposta.body.reserva.valorAtual).to.equal(900);
    });
  });

  it("Deve retornar erro quando o código não existe", () => {
    const dadosAtualizacao = {
      nome: "Carlos",
      sobrenome: "Pereira",
      email: "carlos.pereira@email.com",
      telefone: "49988887777",
      jogo: "Flamengo x Santos — 15/12/2026 · 16h00",
      setor: "Arquibancada — R$ 80,00",
      quantidade: 1,
      formaPagamento: "PIX",
      pedidoEspecial: "Nenhum"
    };

    cy.request({
      method: "PUT",
      url: "/api/reserva/RES-NAOEXISTE",
      body: dadosAtualizacao,
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

  it("Deve retornar erro quando os dados enviados são inválidos", () => {
    const dadosInvalidos = {
      nome: "",
      sobrenome: "Pereira",
      email: "carlos.pereira@email.com",
      telefone: "49988887777",
      jogo: "Flamengo x Santos — 15/12/2026 · 16h00",
      setor: "Arquibancada — R$ 80,00",
      quantidade: 1,
      formaPagamento: "PIX",
      pedidoEspecial: "Nenhum"
    };

    cy.request({
      method: "PUT",
      url: `/api/reserva/${codigoReserva}`,
      body: dadosInvalidos,
      failOnStatusCode: false
    }).then((resposta) => {
      cy.log(`Status: ${resposta.status}`);
      cy.log(`Total de erros: ${resposta.body.totalErros}`);
      console.log("Erros retornados:", resposta.body.erros);

      expect(resposta.status).to.equal(400);
      expect(resposta.body.sucesso).to.be.false;
      expect(resposta.body.totalErros).to.be.greaterThan(0);
    });
  });
});