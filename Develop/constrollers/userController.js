const { User } = require('../models');


module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find({})
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Failed to update user!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a friend
  addFriend(req, res){
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: {friends: req.params.friendId}},
        { runValidators: true, new: true }
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete a friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: {friends: req.params.friendId}},
        { new: true }
        )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with that ID' });
        }
        // find and delete the friend from the user's friend list
        User.findOneAndDelete(
          { _id: req.params.friendId },
          (err, friend) => {
            if (err) {
              return res.status(500).json(err);
            }
            if (!friend) {
              return res.status(404).json({ message: 'No friend found with that ID' });
            }
            return res.json(user);
          }
        );
      })
      .catch((err) => res.status(500).json(err))
  },
}