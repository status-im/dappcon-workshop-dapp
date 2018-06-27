pragma solidity ^0.4.24;

contract DTwitter {
    struct User {
        uint creationDate;
        string username;
        string description;
        address owner;
        string picture;

        string[] tweets;
    }

    mapping (bytes32 => User) public users;

    event NewTweet(
        bytes32 indexed _from,
        uint index 
    );

    function createAccount(string username, string description) public {
        bytes32 usernameHash = keccak256(abi.encodePacked(username));

        // reject if username already registered
        require(users[usernameHash].creationDate == 0);

        users[usernameHash].creationDate = now;
        users[usernameHash].owner = msg.sender;
        users[usernameHash].username = username;
        users[usernameHash].description = description;
    }

    function updateProfilePicture(string username, string pictureHash) public {
        bytes32 usernameHash = keccak256(abi.encodePacked(username));
        require(users[usernameHash].owner == msg.sender);

        users[usernameHash].picture = pictureHash;
    }

    function editAccount(string username, string description) public {
        bytes32 usernameHash = keccak256(abi.encodePacked(username));
        require(users[usernameHash].owner == msg.sender);

        users[usernameHash].description = description;
    }

    function tweet(string username, string content) public {
        bytes32 usernameHash = keccak256(abi.encodePacked(username));
        require(users[usernameHash].owner == msg.sender);

        User storage user = users[usernameHash];
        uint tweetIndex = user.tweets.length++;
        user.tweets[tweetIndex] = content;
        emit NewTweet(usernameHash, tweetIndex);
    }

    function getTweet(string username, uint index) public view returns(string retTweet) {
        bytes32 usernameHash = keccak256(abi.encodePacked(username));

        return users[usernameHash].tweets[index];
    }

}
