const Group = require('./group.model');

exports.createGroup = async (req, res) => {
    try {
        const newGroup = await Group.create(req.body);
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ message: "Error creating group", error: error.message });
    }
};

exports.getAllPublicGroups = async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error fetching groups", error: error.message });
    }
};

exports.joinGroup = async (req, res) => {
    try {
        // Get user ID from authentication token instead of request body
        const userId = req.user?.id || req.body.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "Authentication required to join a group" });
        }
        
        const affectedRows = await Group.addMember(req.params.groupId, userId);
        if (affectedRows === 0) return res.status(404).json({ message: "Group not found" });
        res.status(200).json({ message: "Successfully joined group" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "User is already a member of this group." });
        }
        res.status(500).json({ message: "Error joining group", error: error.message });
    }
};

exports.leaveGroup = async (req, res) => {
    try {
        // Get user ID from authentication token instead of request body
        const userId = req.user?.id || req.body.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "Authentication required to leave a group" });
        }
        
        const affectedRows = await Group.removeMember(req.params.groupId, userId);
        if (affectedRows === 0) return res.status(404).json({ message: "Membership not found" });
        res.status(200).json({ message: "Successfully left group" });
    } catch (error) {
        res.status(500).json({ message: "Error leaving group", error: error.message });
    }
};

exports.getGroupMembers = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        
        // First check if the group exists
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Support group not found" });
        }
        
        const members = await Group.findMembers(groupId);
        
        // Add additional context to empty results
        if (members.length === 0) {
            return res.status(200).json({
                message: "No members found in this group",
                groupName: group.group_name,
                members: []
            });
        }
        
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Error fetching group members", error: error.message });
    }
};
exports.getAllSupportGroups = async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error fetching groups", error: error.message });
    }
};

exports.getPostsInGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        
        // First check if the group exists
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Support group not found" });
        }
        
        const posts = await Group.findPosts(groupId);
        
        // Add additional context to empty results
        if (posts.length === 0) {
            return res.status(200).json({
                message: "No posts found in this group",
                groupId: groupId,
                groupName: group.group_name,
                posts: []
            });
        }
        
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching group posts", error: error.message });
    }
};