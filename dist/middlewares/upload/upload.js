"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Konfigurasi penyimpanan
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const filename = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, filename);
    }
});
// Filter file berdasarkan mimetype
const fileFilter = (req, file, cb) => {
    const mimetype = file.mimetype;
    const maxImageSize = 2 * 1024 * 1024; // Maksimum ukuran gambar 2MB
    const maxVideoMusicSize = 10 * 1024 * 1024; // Maksimum ukuran video/musik 10MB
    // Switch case untuk menangani tipe file berdasarkan mimetype
    switch (true) {
        case mimetype.startsWith("image/"):
            if (file.size > maxImageSize) {
                return cb(new Error("Image too large. Max 2MB."));
            }
            break;
        case mimetype.startsWith("video/"):
            if (file.size > maxVideoMusicSize) {
                return cb(new Error("Video too large. Max 10MB."));
            }
            break;
        case mimetype.startsWith("audio/"):
            if (file.size > maxVideoMusicSize) {
                return cb(new Error("Music too large. Max 10MB."));
            }
            break;
        default:
            return cb(new Error("Unsupported file type."));
    }
    // Jika tipe file valid dan ukurannya sesuai, lanjutkan
    cb(null, true);
};
// Setup multer
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Batas mutlak 10MB
});
exports.default = upload;
