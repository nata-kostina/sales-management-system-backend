import multer from "multer";
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
export const uploadsMiddleware = multer({ storage });
//# sourceMappingURL=uploads.middleware.js.map