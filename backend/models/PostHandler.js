const DatabaseHandler = require("./DatabaseHandler");
const PostSchema = require("./PostSchema");
const HttpError = require("../utils/http-error");

const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

// GET /post/
async function getAllPosts() {
  const db = await DatabaseHandler.getDbConnection();
  const postModel = db.model("Post", PostSchema);
  let result = await postModel.find();
  return result;
}

// POST /post/
async function createPost(post) {
  const db = await DatabaseHandler.getDbConnection();
  const postModel = db.model("Post", PostSchema);

  const postId = uniqueID().slice(0, 6);

  const newPost = new postModel({
    _id: postId,
    userId: post.userId,
    title: post.title,
    message: post.message,
    comments: [],
    turnOnComments: true,
    published: true,
    stringify: "post.stringify",
    tags: [],
    imageURL: post.imageURL,
    upVoteUsers: [],
    downVoteUsers: [],
  });

  const result = await newPost.save();

  return result;
}

// GET /post/{id}
async function getPostById(id) {
  const db = await DatabaseHandler.getDbConnection();
  const postModel = db.model("Post", PostSchema);

  const post = await postModel.findById({ _id: id });
  return post;
}

// UPDATE /post/{id}
async function updatePostById(id, newInfo) {
  const db = await DatabaseHandler.getDbConnection();
  const postModel = db.model("Post", PostSchema);

  const post = await postModel.updateOne(
    { _id: id },
    {
      $set: newInfo,
    }
  );

  return post;
}

// UPDATE /post/comment/{id}
async function addCommentByPostId(id, newComment) {
  const db = await DatabaseHandler.getDbConnection();
  const postModel = db.model("Post", PostSchema);

  const post = await postModel.findOneAndUpdate(
    { _id: id },
    { $push: { comments: newComment } },
    { new: true }
  );
  return post;
}

// DELETE /post/comment/{id}
async function deleteCommentByPostId(commentId, postId) {
  const db = await DatabaseHandler.getDbConnection();
  const postModel = db.model("Post", PostSchema);

  const post = await postModel.updateOne(
    { _id: postId },
    { $pull: { comments: { _id: commentId } } }
  );

  if (post.modifiedCount === 1) {
    return 1;
  } else {
    const error = new HttpError("commentId not found!", 404);
    throw error;
  }
}

// DELETE /post/{id}
async function deletePostById(id) {
  const db = await DatabaseHandler.getDbConnection();
  const postModel = db.model("Post", PostSchema);

  await postModel.deleteOne({ _id: id });
  return 0;
}

// UPDATE /vote/{id}
async function votePost(postId, userId, value) {
  const db = await DatabaseHandler.getDbConnection();
  const postModel = db.model("Post", PostSchema);

  if (userId === null) {
    return 0;
  } else {
    const inUpVote = await postModel.update(
      { _id: postId },
      { $pull: { upVoteUsers: { userId: userId } } }
    );

    const inDownVote = await postModel.update(
      { _id: postId },
      { $pull: { downVoteUsers: { userId: userId } } }
    );

    if (value == 1 && inUpVote.modifiedCount === 0) {
      await postModel.updateOne(
        { _id: postId },
        { $push: { upVoteUsers: { userId: userId } } }
      );
    }

    if (value == -1 && inDownVote.modifiedCount === 0) {
      await postModel.updateOne(
        { _id: postId },
        { $push: { downVoteUsers: { userId: userId } } }
      );
    }

    const upVoteUsers = await postModel.find(
      { _id: postId },
      { upVoteUsers: 1, _id: 0 }
    );

    const downVoteUsers = await postModel.find(
      { _id: postId },
      { downVoteUsers: 1, _id: 0 }
    );

    return [upVoteUsers, downVoteUsers];
  }
}

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePostById,
  deletePostById,
  votePost,
  addCommentByPostId,
  deleteCommentByPostId,
};
