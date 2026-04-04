export const StorageService = {
    async uploadImage(file: File, path: string): Promise<string> {
        // Mock image upload by returning a random Unsplash image
        console.log(`[StorageService] Mock uploading file to ${path}`);
        return `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400`;
    },

    async uploadListingImages(files: File[], listingId: string): Promise<string[]> {
        const uploadPromises = files.map((file, index) => {
            const extension = file.name.split('.').pop();
            const path = `listings/${listingId}/image_${index}.${extension}`;
            return this.uploadImage(file, path);
        });
        return Promise.all(uploadPromises);
    }
};
