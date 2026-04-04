// API Client - wraps DBService for marketplace operations
import { DBService } from './firebase/db';
import { useAuth } from './contexts/AuthContext';

export const ApiClient = {
    listings: {
        create: async (data: any) => {
            // Add seller info if missing (in real app, would get from auth)
            const listingData = {
                ...data,
                seller: data.seller || {
                    id: 'demo-user',
                    name: 'Demo User',
                    avatar: 'https://ui-avatars.com/api/?name=Demo+User',
                    responseTime: '2h'
                }
            };
            return DBService.createListing(listingData);
        },
        getAll: DBService.getListings.bind(DBService),
        getById: DBService.getListingById.bind(DBService),
    }
};

export default ApiClient;
