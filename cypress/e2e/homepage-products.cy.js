describe("Products homepage tests", () => {

    beforeEach(() => {

        cy.visit("/");
    });

    it("the page must be loading", () => {
        cy.url().should("include", "/");
    });

    it("the products must be displayed", () => {
        cy.get(".mini-product")
            .should("have.length.greaterThan", 0)
            .should("be.visible");
    });

    it("the products elements must be display", () => {
        cy.get(".mini-product")
            .first()
            .within(() => {
                cy.get("img")
                    .should("exist")
                    .should("be.visible")

                cy.get("h3")
                    .should("exist")
                    .should("be.visible")

                cy.contains("Consulter")
                    .should("be.visible");
            });
    });

    it("must display product information (price and stock)", () => {
        cy.get(".mini-product")
            .first()
            .within(() => {

                cy.contains("€")
                    .should("exist");

                cy.contains(/\d+/)
                    .should("exist");
            });
    });
});