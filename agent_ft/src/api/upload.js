import { BlobServiceClient } from '@azure/storage-blob';

const containerName = "profile";
const blobServiceClient = new BlobServiceClient(process.env.REACT_APP_STORAGE_CLIENT)

export const createContainer = () => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    return containerClient.create();
}

export const uploadFile = async (file) => {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);
        const ref = blockBlobClient.url;
        const url = await blockBlobClient.uploadData(file)
        return { url, ref };
    } catch (e) {
        return e;
    }
}
