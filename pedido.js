
document.addEventListener("DOMContentLoaded", function () {

    const botaoFinalizar = document.getElementById("finalizarCompra");

    if (!botaoFinalizar) {
        return;
    }

    botaoFinalizar.addEventListener("click", function () {

        const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        const usuario = JSON.parse(localStorage.getItem("usuario")) || null;
        const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

        const mensagem = document.getElementById("mensagemCarrinho");

        if (carrinho.length === 0) {
            mensagem.textContent = "Adicione produtos antes de finalizar o pedido.";
            return;
        }

        if (!usuario) {
            mensagem.textContent = "Faça login antes de finalizar o pedido.";
            return;
        }

        const subtotal = carrinho.reduce(function (total, produto) {
            return total + produto.preco * produto.quantidade;
        }, 0);

        const numeroPedido = Date.now();

        const pedido = {
            numero: numeroPedido,
            data: new Date().toISOString(),

            cliente: {
                nome: usuario.nome,
                email: usuario.email
            },

            produtos: carrinho.map(function (produto) {
                return {
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    quantidade: produto.quantidade,
                    subtotal: produto.preco * produto.quantidade
                };
            }),

            subtotal: subtotal,
            entrega: 0,
            total: subtotal,
            status: "Recebido"
        };

        pedidos.push(pedido);

        localStorage.setItem("pedidos", JSON.stringify(pedidos));

        const conteudo = JSON.stringify(pedido, null, 4);

        const arquivo = new Blob(
            [conteudo],
            { type: "application/json" }
        );

        const link = document.createElement("a");

        link.href = URL.createObjectURL(arquivo);
        link.download = "pedido-" + numeroPedido + ".json";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);

        localStorage.setItem("carrinho", JSON.stringify([]));

        mensagem.textContent =
            "Pedido realizado com sucesso! Número: " + numeroPedido;

        botaoFinalizar.disabled = true;

        alert("Pedido realizado! Seu arquivo JSON foi gerado.");

        window.location.reload();

    });

});
