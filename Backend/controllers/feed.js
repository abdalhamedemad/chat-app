const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

// const Post = require('../models/post');
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
// exports.getPosts = (req, res, next) => {
//   const currentPage = req.query.page || 1;
//   const perPage = 2;
//   let totalItems;
//   Post.find()
//     .countDocuments()
//     .then(count => {
//       totalItems = count;
//       return Post.find()
//         .skip((currentPage - 1) * perPage)
//         .limit(perPage);
//     })
//     .then(posts => {
//       res
//         .status(200)
//         .json({
//           message: 'Fetched posts successfully.',
//           posts: posts,
//           totalItems: totalItems
//         });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// exports.createPost = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error;
//   }
//   if (!req.file) {
//     const error = new Error('No image provided.');
//     error.statusCode = 422;
//     throw error;
//   }
//   const imageUrl = req.file.path;
//   const title = req.body.title;
//   const content = req.body.content;
//   const post = new Post({
//     title: title,
//     content: content,
//     imageUrl: imageUrl,
//     creator: { name: 'Maximilian' }
//   });
//   post
//     .save()
//     .then(result => {
//       res.status(201).json({
//         message: 'Post created successfully!',
//         post: result
//       });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

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

// exports.getPost = (req, res, next) => {
//   const postId = req.params.postId;
//   Post.findById(postId)
//     .then(post => {
//       if (!post) {
//         const error = new Error('Could not find post.');
//         error.statusCode = 404;
//         throw error;
//       }
//       res.status(200).json({ message: 'Post fetched.', post: post });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// exports.updatePost = (req, res, next) => {
//   const postId = req.params.postId;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error;
//   }
//   const title = req.body.title;
//   const content = req.body.content;
//   let imageUrl = req.body.image;
//   if (req.file) {
//     imageUrl = req.file.path;
//   }
//   if (!imageUrl) {
//     const error = new Error('No file picked.');
//     error.statusCode = 422;
//     throw error;
//   }
//   Post.findById(postId)
//     .then(post => {
//       if (!post) {
//         const error = new Error('Could not find post.');
//         error.statusCode = 404;
//         throw error;
//       }
//       if (imageUrl !== post.imageUrl) {
//         clearImage(post.imageUrl);
//       }
//       post.title = title;
//       post.imageUrl = imageUrl;
//       post.content = content;
//       return post.save();
//     })
//     .then(result => {
//       res.status(200).json({ message: 'Post updated!', post: result });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// exports.deletePost = (req, res, next) => {
//   const postId = req.params.postId;
//   Post.findById(postId)
//     .then(post => {
//       if (!post) {
//         const error = new Error('Could not find post.');
//         error.statusCode = 404;
//         throw error;
//       }
//       // Check logged in user
//       clearImage(post.imageUrl);
//       return Post.findByIdAndRemove(postId);
//     })
//     .then(result => {
//       console.log(result);
//       res.status(200).json({ message: 'Deleted post.' });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// const clearImage = filePath => {
//   filePath = path.join(__dirname, '..', filePath);
//   fs.unlink(filePath, err => console.log(err));
// };
