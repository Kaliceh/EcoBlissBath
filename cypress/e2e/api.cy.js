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

    it("commands without a connection should return 401 or 403", () => {
        cy.request({
            method: 'GET',
            url: `${apiURL}/orders`,
            failOnStatusCode: false
        }).then((response) => {
            expect([401, 403]).to.include(response.status);
        });
    });


    it("must return the list of products", () => {

        cy.request({
            method: "GET",
            url: `${apiURL}/orders`,
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${token}`,
            },

        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("orderLines");

        });
    });


    it("the product details page must be returned; the product ID must be specified in the URL", () => {

        const id = 5;

        cy.request({
            method: "GET",
            url: `${apiURL}/products/${id}`,
        }).then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body).to.have.property("id", id);

            expect(response.body).to.have.property("name");
            expect(response.body).to.have.property("price");
            expect(response.body).to.have.property("availableStock");

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
            expect(response.status).not.to.oneOf([400, 409]);
        });
    });

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