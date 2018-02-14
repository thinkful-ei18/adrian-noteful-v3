'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');
const expect = chai-expect;

chai.use(chaiHttp);
chai.use(chaiSpies);
