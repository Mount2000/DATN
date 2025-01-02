
import cloudinary from "../config/cloudinary.js";

export const uploadImages = async (image) => {
    try {
        const uploadImages = [];
            const results = await cloudinary.uploader.upload(image);
            uploadImages.push(
                results.secure_url,)

        return uploadImages;

    } catch (error) {
        return {
            status: 'failes',
            error: JSON.stringify(error)
        }
    }
};

export const removeImage = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return result;

    } catch (error) {
        return {
            status: 'failes',
            error: JSON.stringify(error)
        }
    }
};

