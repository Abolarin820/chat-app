const downloadImage = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = imageUrl.split('/').pop();
        link.click();

        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Error downloading the image:', error);
    }
};

export default  downloadImage