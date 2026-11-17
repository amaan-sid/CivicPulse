export interface Society {
  _id: string;
  name: string;
  code?: string;
  address?: string;
  city: string;
  state: string;
  totalFlats?: number;
  admin?: {
    _id?: string;
    name: string;
    email?: string;
  };
  createdAt?: string;
}

