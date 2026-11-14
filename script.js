document.addEventListener("DOMContentLoaded", function () {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    let usuario = JSON.parse(localStorage.getItem("usuario")) || null;
    let perfil = JSON.parse(localStorage.getItem("perfil")) || {};

    const corpo = document.body;

    function salvarCarrinho() {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarQuantidadeCarrinho();
        mostrarCarrinho();
    }

    function atualizarQuantidadeCarrinho() {
        const quantidade = document.getElementById("quantidadeCarrinho");

        if (quantidade) {
            quantidade.textContent = carrinho.reduce(function (total, produto) {
                return total + produto.quantidade;
            }, 0);
        }
    }

    function formatarDinheiro(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function adicionarCarrinho(id, nome, preco) {
        const produtoExistente = carrinho.find(function (produto) {
            return produto.id === id;
        });

        if (produtoExistente) {
            produtoExistente.quantidade++;
        } else {
            carrinho.push({
                id: id,
                nome: nome,
                preco: preco,
                quantidade: 1
            });
        }

        salvarCarrinho();
        alert(nome + " foi adicionado ao carrinho!");
    }

    document.querySelectorAll(".adicionarCarrinho").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const id = Number(botao.dataset.id);
            const nome = botao.dataset.nome;
            const preco = Number(botao.dataset.preco);

            if (!id || !nome || !Number.isFinite(preco) || preco < 0) {
                alert("Não foi possível adicionar este produto.");
                return;
            }

            adicionarCarrinho(id, nome, preco);
        });
    });

    function mostrarCarrinho() {
        const listaCompleta = document.getElementById("listaCarrinhoCompleto");
        const itensModal = document.getElementById("itensCarrinho");
        const totalModal = document.getElementById("totalCarrinho");
        const subtotal = document.getElementById("subtotalCarrinho");
        const entrega = document.getElementById("valorEntrega");
        const totalPagina = document.getElementById("totalCarrinhoPagina");

        let total = 0;

        carrinho.forEach(function (produto) {
            total += produto.preco * produto.quantidade;
        });

        if (itensModal) {
            itensModal.innerHTML = "";

            if (carrinho.length === 0) {
                itensModal.textContent = "Seu carrinho está vazio.";
            } else {
                carrinho.forEach(function (produto) {
                    const item = document.createElement("p");
                    item.textContent = produto.nome + " x" + produto.quantidade +
                        " — " + formatarDinheiro(produto.preco * produto.quantidade);
                    itensModal.appendChild(item);
                });
            }
        }

        if (totalModal) {
            totalModal.textContent = formatarDinheiro(total);
        }

        if (subtotal) {
            subtotal.textContent = formatarDinheiro(total);
        }

        if (entrega) {
            entrega.textContent = "A combinar";
        }

        if (totalPagina) {
            totalPagina.textContent = formatarDinheiro(total);
        }

        if (listaCompleta) {
            listaCompleta.innerHTML = "";

            if (carrinho.length === 0) {
                const vazio = document.createElement("div");
                vazio.className = "carrinhoVazio";

                const titulo = document.createElement("h2");
                titulo.textContent = "Seu carrinho está vazio!";

                const mensagem = document.createElement("p");
                mensagem.textContent = "Que tal escolher alguns doces deliciosos?";

                const link = document.createElement("a");
                link.href = "produtos.html";
                link.className = "botaoVoltarProdutos";
                link.textContent = "Ver produtos";

                vazio.append(titulo, mensagem, link);
                listaCompleta.appendChild(vazio);
            } else {
                carrinho.forEach(function (produto) {
                    const item = document.createElement("article");
                    item.className = "itemCarrinho";

                    const informacoes = document.createElement("div");
                    informacoes.className = "informacoesProduto";

                    const titulo = document.createElement("h3");
                    titulo.textContent = produto.nome;

                    const preco = document.createElement("p");
                    preco.textContent = "Preço: " + formatarDinheiro(produto.preco);

                    const totalItem = document.createElement("p");
                    totalItem.textContent = "Total: " +
                        formatarDinheiro(produto.preco * produto.quantidade);

                    informacoes.append(titulo, preco, totalItem);

                    const controles = document.createElement("div");
                    controles.className = "controlesQuantidade";

                    const diminuir = document.createElement("button");
                    diminuir.type = "button";
                    diminuir.textContent = "−";
                    diminuir.setAttribute("aria-label", "Diminuir quantidade");

                    diminuir.addEventListener("click", function () {
                        alterarQuantidade(produto.id, -1);
                    });

                    const quantidade = document.createElement("span");
                    quantidade.textContent = produto.quantidade;

                    const aumentar = document.createElement("button");
                    aumentar.type = "button";
                    aumentar.textContent = "+";
                    aumentar.setAttribute("aria-label", "Aumentar quantidade");

                    aumentar.addEventListener("click", function () {
                        alterarQuantidade(produto.id, 1);
                    });

                    controles.append(diminuir, quantidade, aumentar);

                    const remover = document.createElement("button");
                    remover.type = "button";
                    remover.className = "removerProduto";
                    remover.textContent = "Remover";

                    remover.addEventListener("click", function () {
                        removerProduto(produto.id);
                    });

                    item.append(informacoes, controles, remover);
                    listaCompleta.appendChild(item);
                });
            }
        }
    }

    function alterarQuantidade(id, alteracao) {
        const produto = carrinho.find(function (item) {
            return item.id === id;
        });

        if (!produto) {
            return;
        }

        produto.quantidade += alteracao;

        if (produto.quantidade <= 0) {
            carrinho = carrinho.filter(function (item) {
                return item.id !== id;
            });
        }

        salvarCarrinho();
    }

    function removerProduto(id) {
        carrinho = carrinho.filter(function (produto) {
            return produto.id !== id;
        });

        salvarCarrinho();
    }

    const botaoCarrinho = document.getElementById("carrinho");
    const janelaCarrinho = document.getElementById("janelaCarrinho");

    if (botaoCarrinho && janelaCarrinho) {
        botaoCarrinho.addEventListener("click", function () {
            janelaCarrinho.hidden = false;
        });
    }

    document.querySelectorAll(".fecharJanela").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const janela = botao.closest(".janelaFundo");

            if (janela) {
                janela.hidden = true;
            }
        });
    });

    document.querySelectorAll(".janelaFundo").forEach(function (janela) {
        janela.addEventListener("click", function (evento) {
            if (evento.target === janela) {
                janela.hidden = true;
            }
        });
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            document.querySelectorAll(".janelaFundo").forEach(function (janela) {
                janela.hidden = true;
            });
        }
    });

    const botaoTema = document.getElementById("modoTema");
    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "claro") {
        corpo.classList.add("tema-claro");
    }

    if (botaoTema) {
        botaoTema.addEventListener("click", function () {
            corpo.classList.toggle("tema-claro");

            const temaAtual = corpo.classList.contains("tema-claro")
                ? "claro"
                : "escuro";

            localStorage.setItem("tema", temaAtual);
        });
    }

    const formularioPesquisa = document.getElementById("formPesquisa");
    const barraPesquisa = document.getElementById("barraPesquisa");

    if (formularioPesquisa && barraPesquisa) {
        formularioPesquisa.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const pesquisa = barraPesquisa.value.trim();

            if (!pesquisa) {
                alert("Digite o nome de um produto para pesquisar.");
                return;
            }

            const pagina = window.location.pathname.toLowerCase();
            const paginasComProdutos = [
                "produtos.html",
                "promocoes.html"
            ];

            if (!paginasComProdutos.some(function (nome) {
                return pagina.endsWith(nome);
            })) {
                window.location.href =
                    "produtos.html?pesquisa=" + encodeURIComponent(pesquisa);
                return;
            }

            filtrarProdutos(pesquisa);
        });
    }

    function filtrarProdutos(pesquisa) {
        const termo = pesquisa.toLowerCase();
        const produtos = document.querySelectorAll(
            ".produtoCard, .cardPromocao"
        );

        let encontrados = 0;

        produtos.forEach(function (produto) {
            const corresponde = produto.textContent.toLowerCase().includes(termo);

            produto.style.display = corresponde ? "" : "none";

            if (corresponde) {
                encontrados++;
            }
        });

        let mensagem = document.getElementById("mensagemPesquisa");

        if (!mensagem) {
            mensagem = document.createElement("p");
            mensagem.id = "mensagemPesquisa";

            const lista = document.getElementById("listaProdutos") ||
                document.querySelector(".listaPromocoes");

            if (lista && lista.parentNode) {
                lista.parentNode.insertBefore(mensagem, lista);
            }
        }

        if (mensagem) {
            mensagem.textContent = encontrados === 0
                ? "Nenhum produto encontrado."
                : encontrados + " produto(s) encontrado(s).";
        }
    }

    const parametros = new URLSearchParams(window.location.search);
    const pesquisaInicial = parametros.get("pesquisa");

    if (pesquisaInicial) {
        if (barraPesquisa) {
            barraPesquisa.value = pesquisaInicial;
        }

        filtrarProdutos(pesquisaInicial);
    }

    const filtroCategoria = document.getElementById("filtroCategoria");

    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", function () {
            const categoria = filtroCategoria.value.toLowerCase();
            const produtos = document.querySelectorAll(".produtoCard");

            produtos.forEach(function (produto) {
                const categoriaProduto = (
                    produto.dataset.categoria ||
                    produto.getAttribute("data-categoria") ||
                    "todos"
                ).toLowerCase();

                produto.style.display =
                    categoria === "todos" ||
                    categoriaProduto === categoria
                        ? ""
                        : "none";
            });
        });
    }

    function aplicarMascaraCPF(valor) {
        valor = valor.replace(/\D/g, "").slice(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        return valor;
    }

    function aplicarMascaraTelefone(valor) {
        valor = valor.replace(/\D/g, "").slice(0, 11);

        if (valor.length <= 10) {
            valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
            valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
        } else {
            valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
            valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        }

        return valor;
    }

    function aplicarMascaraCEP(valor) {
        valor = valor.replace(/\D/g, "").slice(0, 8);
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

        return valor;
    }

    function adicionarMascara(id, mascara) {
        const campo = document.getElementById(id);

        if (campo) {
            campo.addEventListener("input", function () {
                campo.value = mascara(campo.value);
            });
        }
    }

    adicionarMascara("cpfCadastro", aplicarMascaraCPF);
    adicionarMascara("cpfPerfil", aplicarMascaraCPF);
    adicionarMascara("telefoneCadastro", aplicarMascaraTelefone);
    adicionarMascara("telefonePerfil", aplicarMascaraTelefone);
    adicionarMascara("cepPerfil", aplicarMascaraCEP);

    function validarCPF(valor) {
        const cpf = valor.replace(/\D/g, "");

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let soma = 0;

        for (let i = 0; i < 9; i++) {
            soma += Number(cpf[i]) * (10 - i);
        }

        let digito = (soma * 10) % 11;

        if (digito === 10) {
            digito = 0;
        }

        if (digito !== Number(cpf[9])) {
            return false;
        }

        soma = 0;

        for (let i = 0; i < 10; i++) {
            soma += Number(cpf[i]) * (11 - i);
        }

        digito = (soma * 10) % 11;

        if (digito === 10) {
            digito = 0;
        }

        return digito === Number(cpf[10]);
    }

    function mostrarMensagem(id, texto, sucesso) {
        const mensagem = document.getElementById(id);

        if (mensagem) {
            mensagem.textContent = texto;
            mensagem.style.color = sucesso ? "#267A42" : "#C03950";
        }
    }

    const formularioCadastro = document.getElementById("formCadastro");

    if (formularioCadastro) {
        formularioCadastro.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const nome = document.getElementById("nomeCadastro").value.trim();
            const email = document.getElementById("emailCadastro").value.trim();
            const cpf = document.getElementById("cpfCadastro").value;
            const telefone = document.getElementById("telefoneCadastro").value;
            const senha = document.getElementById("senhaCadastro").value;
            const confirmar = document.getElementById("confirmarSenha").value;

            if (!nome || !email || !cpf || !telefone || !senha || !confirmar) {
                mostrarMensagem("mensagemCadastro", "Preencha todos os campos.", false);
                return;
            }

            if (!validarCPF(cpf)) {
                mostrarMensagem("mensagemCadastro", "Digite um CPF válido.", false);
                return;
            }

            if (telefone.replace(/\D/g, "").length < 10) {
                mostrarMensagem("mensagemCadastro", "Digite um telefone válido.", false);
                return;
            }

            if (senha.length < 8 || senha.length > 30) {
                mostrarMensagem("mensagemCadastro", "A senha deve ter entre 8 e 30 caracteres.", false);
                return;
            }

            if (senha !== confirmar) {
                mostrarMensagem("mensagemCadastro", "As senhas não são iguais.", false);
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            const emailExiste = usuarios.some(function (item) {
                return item.email.toLowerCase() === email.toLowerCase();
            });

            if (emailExiste) {
                mostrarMensagem("mensagemCadastro", "Este e-mail já está cadastrado.", false);
                return;
            }

            const novoUsuario = {
                nome: nome,
                email: email,
                cpf: cpf,
                telefone: telefone,
                senha: senha
            };

            usuarios.push(novoUsuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            mostrarMensagem("mensagemCadastro", "Cadastro realizado! Agora faça login.", true);
            formularioCadastro.reset();
        });
    }

    const formularioLogin = document.getElementById("formLogin");

    if (formularioLogin) {
        formularioLogin.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const email = document.getElementById("emailLogin").value.trim();
            const senha = document.getElementById("senhaLogin").value;
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            const usuarioEncontrado = usuarios.find(function (item) {
                return item.email.toLowerCase() === email.toLowerCase() &&
                    item.senha === senha;
            });

            if (!usuarioEncontrado) {
                mostrarMensagem("mensagemLogin", "E-mail ou senha incorretos.", false);
                return;
            }

            usuario = {
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                cpf: usuarioEncontrado.cpf,
                telefone: usuarioEncontrado.telefone
            };

            localStorage.setItem("usuario", JSON.stringify(usuario));

            if (!localStorage.getItem("perfil")) {
                localStorage.setItem("perfil", JSON.stringify(usuario));
            }

            mostrarMensagem("mensagemLogin", "Login realizado com sucesso!", true);

            setTimeout(function () {
                window.location.href = "Index.html";
            }, 800);
        });
    }

    const formularioPerfil = document.getElementById("formPerfil");

    if (formularioPerfil) {
        const camposPerfil = [
            "nomePerfil",
            "emailPerfil",
            "cpfPerfil",
            "telefonePerfil",
            "dataNascimento",
            "cepPerfil",
            "enderecoPerfil",
            "numeroPerfil",
            "complementoPerfil",
            "cidadePerfil",
            "estadoPerfil"
        ];

        camposPerfil.forEach(function (id) {
            const campo = document.getElementById(id);

            if (campo && perfil[id] !== undefined) {
                campo.value = perfil[id];
            } else if (campo && usuario) {
                const correspondencias = {
                    nomePerfil: "nome",
                    emailPerfil: "email",
                    cpfPerfil: "cpf",
                    telefonePerfil: "telefone"
                };

                const propriedade = correspondencias[id];

                if (propriedade && usuario[propriedade]) {
                    campo.value = usuario[propriedade];
                }
            }
        });

        formularioPerfil.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const novoPerfil = {};

            camposPerfil.forEach(function (id) {
                const campo = document.getElementById(id);

                if (campo) {
                    novoPerfil[id] = campo.value.trim();
                }
            });

            if (novoPerfil.cpfPerfil && !validarCPF(novoPerfil.cpfPerfil)) {
                mostrarMensagem("mensagemPerfil", "Digite um CPF válido.", false);
                return;
            }

            if (novoPerfil.telefonePerfil &&
                novoPerfil.telefonePerfil.replace(/\D/g, "").length < 10) {
                mostrarMensagem("mensagemPerfil", "Digite um telefone válido.", false);
                return;
            }

            perfil = novoPerfil;
            localStorage.setItem("perfil", JSON.stringify(perfil));

            if (usuario) {
                usuario.nome = perfil.nomePerfil || usuario.nome;
                usuario.email = perfil.emailPerfil || usuario.email;
                usuario.cpf = perfil.cpfPerfil || usuario.cpf;
                usuario.telefone = perfil.telefonePerfil || usuario.telefone;

                localStorage.setItem("usuario", JSON.stringify(usuario));
            }

            mostrarMensagem("mensagemPerfil", "Dados salvos com sucesso!", true);
        });
    }


    const listaPedidos = document.getElementById("listaPedidos");

    if (listaPedidos) {
        listaPedidos.innerHTML = "";

        const pedidosUsuario = pedidos.filter(function (pedido) {
            return !usuario || pedido.email === usuario.email;
        });

        if (pedidosUsuario.length === 0) {
            listaPedidos.textContent = "Você ainda não fez nenhum pedido.";
        } else {
            pedidosUsuario.slice().reverse().forEach(function (pedido) {
                const cartao = document.createElement("article");
                cartao.className = "cartaoPedido";

                const titulo = document.createElement("h2");
                titulo.textContent = "Pedido #" + pedido.numero;

                const data = document.createElement("p");
                data.textContent = "Data: " + pedido.data;

                const status = document.createElement("p");
                status.textContent = "Status: " + pedido.status;

                const total = document.createElement("p");
                total.textContent = "Total: " + formatarDinheiro(pedido.total);

                const produtos = document.createElement("p");
                produtos.textContent = pedido.produtos.map(function (produto) {
                    return produto.nome + " x" + produto.quantidade;
                }).join(", ");

                cartao.append(titulo, data, status, produtos, total);
                listaPedidos.appendChild(cartao);
            });
        }
    }

    const botaoConfiguracoes = document.getElementById("configuracoes");

    if (botaoConfiguracoes) {
        botaoConfiguracoes.addEventListener("click", function () {
            window.location.href = "configuracoes.html";
        });
    }

    const botaoUsuario = document.getElementById("usuario");
    const janelaUsuario = document.getElementById("janelaUsuario");

    if (botaoUsuario && janelaUsuario) {
        botaoUsuario.addEventListener("click", function () {
            janelaUsuario.hidden = false;
        });
    }

    atualizarQuantidadeCarrinho();
    mostrarCarrinho();
});