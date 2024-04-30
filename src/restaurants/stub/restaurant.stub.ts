import { Restaurant } from '@prisma/client';

export const restaurantStub: Restaurant = {
  id: 'some-restaurant-id',
  name: 'some-restaurant-name',
  ownerId: 'some-owner-id',
  createdAt: new Date(),
  updatedAt: new Date(),
};
