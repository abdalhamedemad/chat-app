const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Message = require('../models/message');
const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  usersData = users.filter(user => {
    if(user._id == req.userId){
      return false;
    }
    return true;
  });
  userData = users.map(user => {
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      e:user.keys.e,
      n:user.keys.n,
    }});
  res.status(200).json({ message: 'Fetched users successfully.',
  userData });
};
exports.getPublicKey = async (req, res, next) => {
  console.log(req.body.userId)
  const user = await User.findById(req.body.userId);
  console.log('pp')
  res.status(200).json({ message: 'Fetched users successfully.',
  e:user.keys.e,
  n:user.keys.n });
};

exports.getConversationData = async (req, res, next) => {
  let conversationData=[];
  let data = await Message.find({userId: req.body.userId});
  if(data.length ==0){
    data =  await Message.find({userId: req.body.toId});
  }
  if(data.length >0){
  conversationData = data[0].content.map(dataItem => {
    return {
      _id: dataItem._id,
      me: dataItem.me == req.body.userId ? true : false,
      body: dataItem.body,
    }});
  }
  res.status(200).json({ message: 'Fetched users successfully.',
  conversationData });
};


exports.createMessage = async (req, res, next) => {
  const user =await  User.findById(req.userId);
  console.log('toiid', req.body.toId);
  mId=null;
  receiverId='123';
  let conversation =await  Message.find({ 'userId' : req.userId  });
  if (conversation.length === 0) { 
    conversation =await  Message.find({ 'userId' : req.body.toId  });
    if (conversation.length === 0) {
    mId=req.userId;
    console.log('conversation', conversation);
    conversation = new Message({
      userId:  req.userId ,
    });
    await  conversation.save();
  }
  else {
    mId=req.body.toId;
  }
  }
  else {
    mId=req.userId;
  }
  conversation =await  Message.find({ 'userId' : mId  });
  console.log('user', user);
  console.log('req.body', req.body);
  console.log('conversation', conversation);
  conversation[0].content.push({ me: req.userId,
  body: req.body.message,});
  await conversation[0].save();
  return res.status(201).json({ message: 'Message created successfully!' });
}

