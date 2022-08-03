describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.request('POST', 'http://localhost:3003/api/users', {
      name: 'Test User',
      username: 'test0',
      password: 'testpwd',
    });
    cy.visit('http://localhost:3003');
  });

  it('Login form is shown', function () {
    cy.contains('Username:');
    cy.contains('Password:');
    cy.contains('Login');
  });

  describe('Login', function () {
    it('Login is successful with proper credentials', function () {
      cy.get('#username').type('test0');
      cy.get('#password').type('testpwd');
      cy.get('#login-btn').click();

      cy.get('#welcome-msg').should('contain', 'Hello Test User');
    });

    it('Login fails with wrong credentials', function () {
      cy.get('#username').type('test0');
      cy.get('#password').type('wrong');
      cy.get('#login-btn').click();

      cy.get('.notification')
        .should('contain', 'Wrong username or password!')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'test0', password: 'testpwd' });
    });

    it('Blog can be created', function () {
      cy.get('#show-form-btn').click();
      cy.get('#title').type('Test title');
      cy.get('#author').type('Test author');
      cy.get('#url').type('test.url');

      cy.get('#save-btn').click();
      cy.contains('Test title by Test author');
    });

    describe('When blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Yet another blog',
          author: 'Different author',
          url: 'unique.url',
        });
      });

      it('Blog likes can be increased', function () {
        cy.get('.expand-blog-btn').click();
        cy.get('.blog-like-btn').click();
        cy.wait(500);
        cy.get('.blog-like-btn').click();
        cy.get('.blog-likes').should('contain', 'Likes: 2');
      });

      it('Blog can be removed', function () {
        cy.get('.expand-blog-btn').click();
        cy.get('html').should(
          'contain',
          'Yet another blog by Different author'
        );

        cy.get('.remove-blog-btn').click();
        cy.get('html').should(
          'not.contain',
          'Yet another blog by Different author'
        );
      });

      it('Blog can not be removed if user is not blogs creator', function () {
        cy.request('POST', 'http://localhost:3003/api/users', {
          name: 'Griefer',
          username: 'test1',
          password: 'testPWD',
        });
        cy.get('#logout-btn').click();
        cy.login({ username: 'test1', password: 'testPWD' });
        cy.get('.expand-blog-btn').click();
        cy.get('html').should('not.contain', 'Remove');
      });
    });

    describe('When several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Blog with 2nd most likes',
          author: 'Random1',
          url: 'random.one',
          likes: 30,
        });
        cy.createBlog({
          title: 'Blog with most likes',
          author: 'Random2',
          url: 'random.two',
          likes: 40,
        });
        cy.createBlog({
          title: 'Blog with least likes',
          author: 'Random3',
          url: 'random.three',
          likes: 10,
        });
        cy.createBlog({
          title: 'Blog in third place',
          author: 'Random4',
          url: 'random.four',
          likes: 20,
        });
      });

      it('Blogs are sorted according to amount of likes', function () {
        cy.contains('Blog list');
        cy.get('.collapsed-blog')
          .eq(0)
          .should('contain', 'Blog with most likes');
        cy.get('.collapsed-blog')
          .eq(1)
          .should('contain', 'Blog with 2nd most likes');
        cy.get('.collapsed-blog')
          .eq(2)
          .should('contain', 'Blog in third place');
        cy.get('.collapsed-blog')
          .eq(3)
          .should('contain', 'Blog with least likes');
      });
    });
  });
});
