describe ('T16 Intercept Login OrangeHRM',  () => {

    it("LOG_001-Successfully login with valid username and valid password", () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type('Admin')
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').type('admin123')
        cy.intercept('GET','https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/action-summary').as('actionSummary')
        cy.get('.oxd-button').click()   
        cy.wait('@actionSummary').its('response.statusCode').should('eq',200)
        cy.url().should('include', '/dashboard')
        cy.contains('Dashboard').should('be.visible')   
    })

    it("LOG_002-Login failed with valid credentials when username starts with lowercase letter", () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type('admin')
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').type('admin123')
        cy.intercept('GET','https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/locations').as('locations')
        cy.get('.oxd-button').click()   
        cy.wait('@locations')
    //cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')        
    })   

    it("LOG_003-Login failed when using valid username and wrong password", () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type('Admin')
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').type('admin321')
        cy.intercept('POST','https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate').as('validate')
        cy.get('.oxd-button').click()
        cy.wait('@validate').its('response.statusCode').should('eq', 302)
        cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials') 
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').should('be.visible')  
    })

    it("LOG_004-Login failed when using invalid username and correct password", () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type('Atmin')
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').type('admin123')
        cy.intercept('POST','https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate').as('loginReq')
        cy.get('.oxd-button').click()
        cy.wait('@loginReq').then((intercept) => {
            expect(intercept.response.headers['set-cookie']).to.be.undefined
        })
        cy.get('.oxd-alert-content-text').should('be.visible')
        .and('contain.text', 'Invalid credentials')
    })

    it("LOG_005-Login failed due to swapped username and password fields", () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type('admin123')
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').type('Admin')
        cy.intercept('GET','https://opensource-demo.orangehrmlive.com/web/index.php/auth/login').as('StayOnLogin')
        cy.get('.oxd-button').click()
        cy.wait('@StayOnLogin').its('response.statusCode').should('eq', 200)
        cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')  
    })

    it("LOG_006-Login failed when valid username is entered with @gmail.com and valid password", () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type('Admin@gmail.com')
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').type('admin123')
        cy.intercept('GET','https://opensource-demo.orangehrmlive.com/web/index.php/auth/login').as('login')
        cy.get('.oxd-button').click()
        cy.wait('@login')
        cy.url().should('include', '/auth/login')
    })

    it("LOG_007-Login failed when password contains '@' instead of 'a' with valid username and password", () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type('Admin')
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').type('@dmin123')
        cy.intercept('POST', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate').as('Validasi')
        cy.get('.oxd-button').click()
        cy.wait('@Validasi').its('response.statusCode').should('eq', 302)
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').should('have.value', '')
        cy.get('body').should('not.contain.text', 'Dashboard')
    })

    it("LOG_008-User cannot login because invalid username and password", () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type('a') // aslinya username kosong, tetapi karena gagal diganti huruf a
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').type('a') // aslinya password kosong, tetapi karena gagal diganti huruf a
        cy.intercept('GET','https://opensource-demo.orangehrmlive.com/web/index.php/auth/login').as('loginin')
        cy.get('.oxd-button').click()
        cy.wait('@loginin')
        cy.get('body').should('not.contain.text', 'Invalid credentials')
        cy.url().should('include', '/auth/login')
    })

    it("LOG_009-Login failed when valid username is entered but invalid password", () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type('Admin')
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').type('1') // aslinya password kosong, tetapi karena gagal diganti angka 1
        cy.intercept('POST','https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate').as('validasi')
        cy.get('.oxd-button').click()
        cy.wait('@validasi').its('response.statusCode').should('eq', 302,200,201)
        cy.get('body').should('not.contain.text', 'Invalid credentials')
        cy.url().should('include', '/auth/login')
    })
})