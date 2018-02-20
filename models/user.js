'use strict';

const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
  {fullname: {type: String}},
  {username: {type: String, unique: true}},
  {password: {type: String}}
);