/* globals cy, describe, it */
// FIXME: Use eslint for cypress

// FIXME: Move credentials somewhere shared
const username = 'demo';
const password = '';

describe('Login Page', () => {
    it('can login with manual form by typing <enter>', () => {
        cy.visit('/');

        cy.url().should('include', '/login.html');

        cy.get('#txtManualName').type(username);
        cy.get('#txtManualPassword').type(`${password}{enter}`);

        cy.url().should('include', '/home.html');
    });

    it('can login with manual form by clicking button', () => {
        cy.visit('/');

        cy.url().should('include', '/login.html');

        cy.get('#txtManualName').type(username);
        // Cypress fails if password is blank
        if (password) {
            cy.get('#txtManualPassword').type(password);
        }
        cy.get('.button-submit').click();

        cy.url().should('include', '/home.html');
    });

    it('shows error for invalid credentials', () => {
        cy.visit('/');

        cy.url().should('include', '/login.html');

        cy.get('#txtManualName').type('invalid_user');
        cy.get('#txtManualPassword').type('invalid_password{enter}');

        cy.url().should('include', '/home.html');
    });
});
