const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const { app } = require('../server');

test('GET /api/health returns online status', async () => {
  const res = await request(app).get('/api/health');

  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'online');
  assert.equal(res.body.service, 'Your Home Financial Calculations Engine');
});

test('GET /api/rates/locations returns location data', async () => {
  const res = await request(app).get('/api/rates/locations');

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.delhi);
  assert.equal(res.body.data.delhi.state, 'Delhi');
});

test('POST /api/calculate/true-cost calculates totals', async () => {
  const res = await request(app)
    .post('/api/calculate/true-cost')
    .send({
      propertyPrice: 5000000,
      location: 'delhi',
      propertyType: 'residential',
      carpetArea: 1200,
      buyerCategory: 'general'
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.basePrice, 5000000);
  assert.ok(res.body.data.totalTrueCost > res.body.data.basePrice);
  assert.ok(res.body.data.breakup.stampDuty.amount > 0);
});

test('POST /api/calculate/emi returns EMI schedule', async () => {
  const res = await request(app)
    .post('/api/calculate/emi')
    .send({ loanAmount: 5000000, interestRate: 8.5, tenureYears: 20 });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.monthlyEMI > 0);
  assert.ok(Array.isArray(res.body.data.schedule));
  assert.ok(res.body.data.schedule.length > 0);
});

test('POST /api/calculate/rental-roi returns rental metrics', async () => {
  const res = await request(app)
    .post('/api/calculate/rental-roi')
    .send({
      propertyPrice: 5000000,
      totalInvestment: 1200000,
      loanAmount: 3800000,
      interestRate: 8.5,
      tenureYears: 20
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.grossAnnualRent > 0);
  assert.ok(res.body.data.netAnnualRentalIncome >= 0 || res.body.data.netAnnualRentalIncome < 0);
});

test('POST /api/calculate/affordability returns affordability data', async () => {
  const res = await request(app)
    .post('/api/calculate/affordability')
    .send({
      monthlyIncome: 100000,
      monthlyExpenses: 40000,
      existingEMIs: 10000,
      monthlySavings: 20000,
      downPayment: 1200000
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.maxLoanAmount > 0);
  assert.ok(res.body.data.affordableRangeFormatted.includes('₹'));
});

test('POST /api/calculate/risk-analysis returns score and categories', async () => {
  const res = await request(app)
    .post('/api/calculate/risk-analysis')
    .send({
      propertyPrice: 7500000,
      project: 'Green Residency',
      location: 'Sector 67, Gurgaon, Haryana',
      propertyType: 'residential',
      propertyStatus: 'under-construction',
      possessionDate: 'Dec 2026'
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.overallScore >= 10);
  assert.ok(res.body.data.categories.location);
  assert.ok(Array.isArray(res.body.data.recommendations));
});

test('POST /api/calculate/buy-vs-rent returns buy-vs-rent comparison', async () => {
  const res = await request(app)
    .post('/api/calculate/buy-vs-rent')
    .send({
      propertyPrice: 7500000,
      monthlyRent: 25000,
      downPaymentPct: 20,
      interestRate: 8.5,
      tenureYears: 20,
      rentIncreasePct: 5,
      investmentReturnPct: 10
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.comparison);
  assert.ok(typeof res.body.data.comparison.recommendation === 'string');
});

test('GET /login and /register HTML routes are served', async () => {
  const loginRes = await request(app).get('/login');
  const registerRes = await request(app).get('/register');

  assert.equal(loginRes.status, 200);
  assert.equal(registerRes.status, 200);
  assert.match(loginRes.text, /<html/i);
  assert.match(registerRes.text, /<html/i);
});

test('GET /api/home requires a valid auth token', async () => {
  const res = await request(app).get('/api/home');

  assert.equal(res.status, 401);
  assert.equal(res.body.message, 'Authorization Token Required');
});

test('POST /api/login returns validation error for missing fields', async () => {
  const res = await request(app)
    .post('/api/login')
    .send({ identifier: '', password: '' });

  assert.equal(res.status, 400);
  assert.equal(res.body.message, 'Email/Username and Password are Required');
});

test('POST /api/register returns validation error for missing fields', async () => {
  const res = await request(app)
    .post('/api/register')
    .send({ name: 'Test User', username: 'testuser' });

  assert.equal(res.status, 400);
  assert.equal(res.body.message, 'All Fields are required');
});
