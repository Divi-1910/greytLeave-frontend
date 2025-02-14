// controllers/uploadController.js
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client, { generatePresignedUrl } from "../../config/s3.js";
import crypto from "crypto";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided"
      });
    }

    const file = req.file;
    const fileName = `${crypto.randomBytes(16).toString("hex")}-${
      file.originalname
    }`;
    const key = `leave-documents/${fileName}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Generate presigned URL
    const presignedUrl = await generatePresignedUrl(key);

    res.status(200).json({
      success: true,
      file: {
        name: file.originalname,
        url: presignedUrl,
        key: key // Store the key for future presigned URL generation
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading file"
    });
  }
};

// Add a new endpoint to get fresh presigned URLs
export const getPresignedUrl = async (req, res) => {
  try {
    const { key } = req.params;
    const presignedUrl = await generatePresignedUrl(key);

    res.json({
      success: true,
      url: presignedUrl
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({
      success: false,
      message: "Error generating presigned URL"
    });
  }
};
