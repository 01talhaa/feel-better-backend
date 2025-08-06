const Therapist = require('./therapist.model');

// Note: A better route for creation might be POST /api/users/:id/therapist-profile
exports.createTherapistProfile = async (req, res) => {
    try {
        console.log('--- EXECUTING: createTherapistProfile ---');
        console.log('Request body:', req.body);
        const profile = await Therapist.create(req.body);
        console.log('Created therapist profile:', profile);
        res.status(201).json(profile);
    } catch (error) {
        console.error('Error creating therapist profile:', error);
        res.status(500).json({ message: "Error creating therapist profile", error: error.message });
    }
};
exports.getAllTherapists = async (req, res) => {
    try {
        const therapists = await Therapist.findAll();
        res.status(200).json(therapists);
    } catch (error) {
        res.status(500).json({ message: "Error fetching therapists", error: error.message });
    }
};
exports.getTherapistByUserId = async (req, res) => {
    try {
        const therapist = await Therapist.findByUserId(req.params.userId);
        if (!therapist) return res.status(404).json({ message: "Therapist profile not found for this user" });
        res.status(200).json(therapist);
    } catch (error) {
        res.status(500).json({ message: "Error fetching therapist profile", error: error.message });
    }
};