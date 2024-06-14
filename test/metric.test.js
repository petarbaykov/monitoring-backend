const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Your Express app

chai.use(chaiHttp);
chai.should();

describe("Metric API", () => {
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

  describe("GET /api/metrics/:endpointId", () => {
    it("should get all metrics for a given endpoint", (done) => {
      chai.request(app)
        .get('/api/metrics/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });
});
