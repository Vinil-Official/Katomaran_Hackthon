import axios from "axios";
import { Buffer } from "buffer";

const IMAGGA_KEY = "acc_93d4891768a0b7e";
const IMAGGA_SECRET = "30ae9cb3b8279dcdbab3e4e0a21f4f92";

export const getAITags = async (imageUri) => {
  try {
    const auth = Buffer.from(`${IMAGGA_KEY}:${IMAGGA_SECRET}`).toString("base64");

    // 1️⃣ Upload image to Imagga first
    const uploadForm = new FormData();
    uploadForm.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    const uploadResponse = await axios.post(
      "https://api.imagga.com/v2/uploads",
      uploadForm,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const uploadId = uploadResponse.data.result.upload_id;
    console.log("✅ Uploaded to Imagga, upload_id:", uploadId);

    // 2️⃣ Request tags for that uploaded image
    const tagResponse = await axios.get(
      `https://api.imagga.com/v2/tags?image_upload_id=${uploadId}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const tags = tagResponse.data.result.tags.slice(0, 5).map((t) => t.tag.en);
    console.log("✅ AI Tags:", tags);
    return tags;
  } catch (err) {
    console.log("❌ AI tagging failed:", err.response?.data || err.message);
    return [];
  }
};
