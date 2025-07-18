const Photo = require('../models/photo');

// CREATE
exports.createPhoto = async (req, res) => {
  try {
    const { url, boat, caption } = req.body;
    const photo = new Photo({ url, boat, caption });
    await photo.save();
    res.status(201).json(photo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().populate('boat');
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('boat');
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json({ message: 'Photo supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
