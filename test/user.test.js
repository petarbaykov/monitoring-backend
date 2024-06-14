const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Your Express app

chai.use(chaiHttp);
chai.should();

describe("User API", () => {
  describe("POST /api/register", () => {
    it("should register a new user", (done) => {
      chai.request(app)
        .post('/api/register')
        .send({ username: "testuser", password: "password" })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User registered successfully');
          done();
        });
    });

    it("should not register a user with the same username", (done) => {
      chai.request(app)
        .post('/api/register')
        .send({ username: "testuser", password: "password" })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
  });

  describe("POST /api/login", () => {
    it("should login an existing user", (done) => {
      chai.request(app)
        .post('/api/login')
        .send({ username: "testuser", password: "password" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Login successful');
          done();
        });
    });

    it("should not login a user with incorrect password", (done) => {
      chai.request(app)
        .post('/api/login')
        .send({ username: "testuser", password: "wrongpassword" })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Incorrect password.');
          done();
        });
    });
  });
});
