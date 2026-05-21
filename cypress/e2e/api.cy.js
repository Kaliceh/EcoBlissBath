describe("API tests", () => {

    const apiURL = 'http://localhost:8081';
    let token

    before(() => {
        cy.request({
            method: "POST",
            url: `${apiURL}/login`,
            body: {
                username: 'test2@test.fr',
                password: 'testtest'
            }

        }).then((response) => {
            token = response.body.token;
            expect(token).to.exist;
        });
    });

    it("should deny access to cart when user is not authenticated", () => {
        cy.request({
            method: 'GET',
            url: `${apiURL}/orders`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403);
        });
    });
    // Anomalie : l'API retourne 401 au lieu de 403, déjà vu avec Marie

    it("must return the list of products", () => {

        cy.request({
            method: "GET",
            url: `${apiURL}/orders`,
            headers: {
                Authorization: `Bearer ${token}`,
            },

        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("orderLines");

        });
    });


    it("should return the product specifications and the good product ID must be specified in the URL", () => {

        const id = 5;

        cy.request({
            method: "GET",
            url: `${apiURL}/products/${id}`,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("id", id);
            expect(response.body).to.include.all.keys([
                "id",
                "name",
                "availableStock",
                "skin",
                "aromas",
                "ingredients",
                "description",
                "price",
                "picture",
                "varieties",
            ]);
        });
    });

    it("return a 401 when the credentials are incorrect", () => {

        cy.request({
            method: "POST",
            url: `${apiURL}/login`,
            failOnStatusCode: false,
            body: {
                username: 'fake2@fake.fr',
                password: 'fake'
            }
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });

    it("return a 200 when the credentials are correct", () => {

        cy.request({
            method: "POST",
            url: `${apiURL}/login`,
            failOnStatusCode: false,
            body: {
                username: 'test2@test.fr',
                password: 'testtest'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.token).to.exist;
        });
    });

    it("add an available product to the cart", () => {

        cy.request({
            method: "PUT",
            url: `${apiURL}/orders/add`,
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: {
                product: 5,
                quantity: 1
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("orderLines");
        });
    });

    it("add an unaivaible product to the cart", () => {

        cy.request({
            method: "PUT",
            url: `${apiURL}/orders/add`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: {
                product: 3,
                quantity: 1
            }
        }).then((response) => {
            expect(response.status).to.eq(400);
        });
    });

    // Anomalie : Renvoi un code 200 au lieu de 400

    it("add a review", () => {

        cy.request({
            method: "POST",
            url: `${apiURL}/reviews`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: {
                title: "Bon produit",
                comment: "Produit qui répond à mes attentes",
                rating: 4
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("id");
            expect(response.body.title).to.eq("Bon produit");
            expect(response.body.comment).to.eq("Produit qui répond à mes attentes");
            expect(response.body.rating).to.eq(4);
        });
    });

});