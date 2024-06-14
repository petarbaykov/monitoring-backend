const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Your Express app

chai.use(chaiHttp);
chai.should();

describe("Endpoint API", () => {
  let token;
  before((done) => {
    chai.request(app)
      .post('/api/login')
      .send({ username: "testuser", password: "password" })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe("POST /api/endpoints", () => {
    it("should create a new endpoint", (done) => {
      chai.request(app)
        .post('/api/endpoints')
        .set('Authorization', `Bearer ${token}`)
        .send({ url: "https://jsonplaceholder.typicode.com/posts", method: "GET", interval: 60000 })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('url').eql('https://jsonplaceholder.typicode.com/posts');
          done();
        });
    });
  });

  describe("GET /api/endpoints", () => {
    it("should get all endpoints", (done) => {
      chai.request(app)
        .get('/api/endpoints')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });

  describe("PUT /api/endpoints/:id", () => {
    it("should update an endpoint", (done) => {
      chai.request(app)
        .put('/api/endpoints/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ url: "https://jsonplaceholder.typicode.com/comments", method: "POST", interval: 120000 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Endpoint updated successfully');
          done();
        });
    });
  });

  describe("DELETE /api/endpoints/:id", () => {
    it("should delete an endpoint", (done) => {
      chai.request(app)
        .delete('/api/endpoints/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Endpoint deleted successfully');
          done();
        });
    });
  });
});
