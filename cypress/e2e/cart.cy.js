describe("Cart tests", () => {
    beforeEach(() => {
        cy.loginFront();
        cy.deleteCart().then(() => {
            cy.visit("/");
        });
    });

    it("must not be able to add an unavailable product", () => {
        // Naviguer sur une fiche produit dont le stock est <0
        cy.intercept("GET", "**/products/3").as("getProduct");
        cy.visit("/products/3");
        cy.wait("@getProduct")
            .its("response.body")
            .then((product) => {
                expect(product.availableStock).to.be.lessThan(1)
            })

        // Cliquer sur le bouton "Ajouter au panier"
        cy.getBySel("detail-product-add").click();

        //On reste sur la page produit
        cy.url().should("include", "/products/3");

        //Panier vide
        cy.intercept("GET", "**/orders").as("getCart");
        cy.visit("/cart");
        cy.wait("@getCart")
            .its("response.body.orderLines")
            .should("have.length", 0);

        cy.getBySel("cart-line").should("have.length", 0)


    });

    it("should add an avaible product to the cart and update the stock", () => {
        cy.getBySel("nav-link-products")
            .should("be.visible")
            .click();

        cy.contains("h1", "Nos produits", { timeout: 30000 })
            .should("be.visible");

        cy.getBySel("product", { timeout: 30000 })
            .should("exist");

        cy.getBySel("product")
            .then(($products) => {
                const len = $products.length;
                let productFound = false;

                const findFirstInStock = (i) => {
                    if (i >= len) {
                        if (!productFound) cy.log("Aucun produit en stock trouvé");
                        return;
                    }

                    cy.getBySel("product").eq(i)
                        .find('[data-cy="product-link"]')
                        .should("be.visible")
                        .click();

                    cy.wait(3000);

                    cy.getBySel("detail-product-stock", { timeout: 15000 })
                        .should("be.visible")
                        .invoke("text")
                        .then((txt) => {
                            const stockBefore = Number(txt.match(/-?\d+/)?.[0] || 0);
                            cy.log(`Stock actuel: ${stockBefore}`);

                            if (stockBefore > 0 && !productFound) {
                                productFound = true;

                                cy.getBySel("detail-product-quantity")
                                    .clear()
                                    .type("1");
                                cy.getBySel("detail-product-add")
                                    .should("be.enabled")
                                    .click();
                                cy.get(".cart-section", { timeout: 10000 })
                                    .should("be.visible");

                                cy.wait(3000);
                                cy.go("back"); // Revenir aux détails du produit
                                cy.wait(3000);

                                cy.getBySel("detail-product-stock", { timeout: 15000 })
                                    .should("be.visible")
                                    .invoke("text")
                                    .then((txt2) => {
                                        const stockAfter = Number(txt2.match(/-?\d+/)?.[0] || 0);
                                        cy.log(`Stock après ajout: ${stockAfter}`);
                                        expect(stockAfter).to.eq(stockBefore - 1);
                                    });
                            } else {
                                // Si stock <= 0, passer au produit suivant
                                cy.log(`Produit avec stock ${stockBefore} ignoré`);
                                cy.go("back");
                                cy.wait(3000);
                                findFirstInStock(i + 1);
                            }
                        });
                };

                findFirstInStock(0);
            });
    });

    // Vérifier ajout dans le panier et vérifier la réponse API
    it("should add product and verify cart via API", () => {

        cy.intercept("GET", "**/orders").as("getCart");

        cy.visit("/products/5");

        cy.getBySel("detail-product-add")
            .should("be.visible")
            .click();

        cy.visit("/cart");

        cy.wait("@getCart").then((interception) => {

            const orderLines = interception.response.body.orderLines;

            expect(orderLines.length).to.be.greaterThan(0);

            const product = orderLines.find(l =>
                l.product?.id == 5 || l.productId == 5
            );

            expect(product).to.exist;
        });
    });



    //Quantité négative
    it("must reject invalid quantity", () => {
        cy.visit("/products/3");
        cy.getBySel("detail-product-quantity")
            .should("exist")
            .clear()
            .type("-1");
        // Vérifier champ invalide
        cy.getBySel("detail-product-form")
            .should("have.class", "ng-invalid");
        // Tentative ajout
        cy.getBySel("detail-product-add").click();
        // Vérifier qu’on ne change pas de page
        cy.url().should("include", "/products/3");
    });

    //Quantité sup à 20
    it("must reject quantity above 20", () => {
        cy.visit("/products/3")
        cy.getBySel("detail-product-quantity")
            .should("exist")
            .clear()
            .type("21");
        cy.getBySel("detail-product-form").should("have.class", "ng-invalid");
        cy.getBySel("detail-product-add").click();
        cy.url().should("include", "/products/3");
    });
});