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
    mapping (address => bytes32) public owners;

    event NewTweet(
        bytes32 indexed _from,
        string tweet 
    );

    function createAccount(string username, string description) public {
        require(bytes(username).length > 0);

        bytes32 usernameHash = keccak256(abi.encodePacked(username));

        // reject if username already registered
        require(users[usernameHash].creationDate == 0);

        // reject if sending adddress already created a user
        require(owners[msg.sender] == 0);

        users[usernameHash].creationDate = now;
        users[usernameHash].owner = msg.sender;
        users[usernameHash].username = username;
        users[usernameHash].description = description;

        owners[msg.sender] = usernameHash;
    }

    function userExists(string username) public view returns (bool) {
        bytes32 usernameHash = keccak256(abi.encodePacked(username));
        return users[usernameHash].creationDate != 0;
    }

    function editAccount(string username, string description, string pictureHash) public {
        bytes32 usernameHash = keccak256(abi.encodePacked(username));

        require(users[usernameHash].owner == msg.sender);

        users[usernameHash].description = description;
        if (bytes(pictureHash).length > 0) {
            users[usernameHash].picture = pictureHash;
        }
    }

    function tweet(string username, string content) public {
        bytes32 usernameHash = keccak256(abi.encodePacked(username));
        require(users[usernameHash].owner == msg.sender);

        User storage user = users[usernameHash];
        uint tweetIndex = user.tweets.length++;
        user.tweets[tweetIndex] = content;
        emit NewTweet(usernameHash, content);
    }

}
